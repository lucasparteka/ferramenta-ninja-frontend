"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { PixKeyType } from "@/lib/pix/generate";
import { generatePixPayload } from "@/lib/pix/generate";
import { generateQRCode } from "@/lib/qrcode/generate";

const KEY_PLACEHOLDERS: Record<PixKeyType, string> = {
	cpf: "000.000.000-00",
	cnpj: "00.000.000/0000-00",
	phone: "(11) 91234-5678",
	email: "nome@email.com",
	evp: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
};

export function PixQR() {
	const [keyType, setKeyType] = useState<PixKeyType>("cpf");
	const [key, setKey] = useState("");
	const [name, setName] = useState("");
	const [city, setCity] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [dataUrl, setDataUrl] = useState("");
	const [downloaded, setDownloaded] = useState(false);
	const [error, setError] = useState("");

	function resetQR() {
		setDataUrl("");
		setError("");
	}

	async function handleGenerate() {
		setError("");
		if (!key.trim()) {
			setError("Informe a chave Pix.");
			return;
		}
		if (!name.trim()) {
			setError("Informe o nome do beneficiário.");
			return;
		}
		if (!city.trim()) {
			setError("Informe a cidade do beneficiário.");
			return;
		}

		const parsedAmount = amount ? Number(amount.replace(",", ".")) : undefined;
		if (amount && (Number.isNaN(parsedAmount) || parsedAmount! <= 0)) {
			setError("Valor inválido. Use o formato 10.50");
			return;
		}

		try {
			const payload = generatePixPayload({
				keyType,
				key,
				name,
				city,
				amount: parsedAmount,
				description: description || undefined,
			});
			const url = await generateQRCode({
				text: payload,
				size: 300,
				errorCorrectionLevel: "M",
			});
			setDataUrl(url);
		} catch {
			setError("Erro ao gerar o QR Code Pix.");
		}
	}

	function handleDownload() {
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `pix-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
		a.click();
		setDownloaded(true);
		setTimeout(() => setDownloaded(false), 2000);
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-4 sm:w-[30%] sm:shrink-0">
				<div className="space-y-1">
					<label
						htmlFor="pix-key-type"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Tipo de chave
					</label>
					<NativeSelect
						id="pix-key-type"
						value={keyType}
						onChange={(e) => {
							setKeyType(e.target.value as PixKeyType);
							setKey("");
							resetQR();
						}}
						className="text-foreground"
					>
						<option value="cpf">CPF</option>
						<option value="cnpj">CNPJ</option>
						<option value="phone">Telefone</option>
						<option value="email">E-mail</option>
						<option value="evp">Chave aleatória (EVP)</option>
					</NativeSelect>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="pix-key"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Chave Pix
					</label>
					<Input
						id="pix-key"
						type="text"
						placeholder={KEY_PLACEHOLDERS[keyType]}
						value={key}
						onChange={(e) => {
							setKey(e.target.value);
							resetQR();
						}}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="pix-name"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Nome do beneficiário
					</label>
					<Input
						id="pix-name"
						type="text"
						placeholder="Nome completo ou razão social"
						maxLength={25}
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							resetQR();
						}}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="pix-city"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Cidade
					</label>
					<Input
						id="pix-city"
						type="text"
						placeholder="São Paulo"
						maxLength={15}
						value={city}
						onChange={(e) => {
							setCity(e.target.value);
							resetQR();
						}}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="pix-amount"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Valor (opcional)
					</label>
					<Input
						id="pix-amount"
						type="text"
						placeholder="0.00"
						value={amount}
						onChange={(e) => {
							setAmount(e.target.value);
							resetQR();
						}}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="pix-desc"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Descrição (opcional)
					</label>
					<Input
						id="pix-desc"
						type="text"
						placeholder="Ex: Pagamento do pedido"
						maxLength={72}
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
							resetQR();
						}}
					/>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<Button onClick={handleGenerate}>Gerar QR Code Pix</Button>
			</div>

			<div className="flex flex-1 flex-col items-center justify-start gap-4">
				{dataUrl ? (
					<>
						<img
							src={dataUrl}
							alt="QR Code Pix"
							width={300}
							height={300}
							className="rounded-lg border border-border bg-white"
						/>
						<Button variant="outline" onClick={handleDownload}>
							{downloaded ? "Baixado!" : "Baixar PNG"}
						</Button>
					</>
				) : (
					<div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary text-sm text-muted-foreground">
						O QR Code aparecerá aqui
					</div>
				)}
			</div>
		</div>
	);
}
