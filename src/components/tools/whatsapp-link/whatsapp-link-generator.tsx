"use client";

import { Download, ExternalLink, QrCode } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { ResultBox } from "@/components/shared/result-box";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateQRCode } from "@/lib/qrcode/generate";

function formatPhoneBR(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 11);
	if (digits.length === 0) return "";
	const ddd = digits.slice(0, 2);
	const rest = digits.slice(2);
	if (rest.length <= 4) return `(${ddd}) ${rest}`;
	return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

function validatePhone(raw: string): {
	valid: boolean;
	digits: string;
	error?: string;
} {
	const digits = raw.replace(/\D/g, "");
	if (digits.length === 0) return { valid: false, digits: "" };
	if (digits.length < 10)
		return { valid: false, digits, error: "Número incompleto" };
	return { valid: true, digits };
}

export function WhatsAppLinkGenerator() {
	const uid = useId();
	const [rawPhone, setRawPhone] = useState("");
	const [message, setMessage] = useState("");
	const [link, setLink] = useState("");
	const [qrDataUrl, setQrDataUrl] = useState("");
	const [showQr, setShowQr] = useState(false);

	const phoneValidation = validatePhone(rawPhone);

	const buildLink = useCallback(() => {
		if (phoneValidation.valid) {
			const url = new URL("https://wa.me");
			url.pathname = `/${phoneValidation.digits}`;
			if (message.trim()) url.searchParams.set("text", message.trim());
			return url.href;
		}
		return "";
	}, [phoneValidation.valid, phoneValidation.digits, message]);

	useEffect(() => {
		setLink(buildLink());
		setQrDataUrl("");
	}, [buildLink]);

	async function handleGenerateQr() {
		if (!link) return;
		try {
			const dataUrl = await generateQRCode({
				text: link,
				size: 280,
				errorCorrectionLevel: "M",
			});
			setQrDataUrl(dataUrl);
			setShowQr(true);
		} catch {
			// silent
		}
	}

	function handleOpen() {
		if (!link) return;
		window.open(link, "_blank", "noopener,noreferrer");
	}

	function handleDownloadQr() {
		if (!qrDataUrl) return;
		const a = document.createElement("a");
		a.href = qrDataUrl;
		a.download = "whatsapp-qrcode.png";
		a.click();
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Gerador de Link do WhatsApp"
					badge="WHATSAPP"
					actions={
						<>
							<CopyButton text={link} disabled={!link} size="sm" />
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={handleOpen}
								disabled={!link}
							>
								<ExternalLink className="mr-1.5 h-3.5 w-3.5" />
								Abrir
							</Button>
						</>
					}
				/>
			}
			sidebar={
				<div className="flex flex-col gap-3 p-4">
					<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
						QR Code
					</h3>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleGenerateQr}
						disabled={!link}
					>
						<QrCode className="mr-1.5 h-3.5 w-3.5" />
						{showQr ? "Atualizar" : "Gerar"} QR Code
					</Button>
					{qrDataUrl && (
						<div className="flex flex-col items-center gap-3">
							{/** biome-ignore lint/performance/noImgElement: . */}
							<img
								src={qrDataUrl}
								alt="QR Code do link WhatsApp"
								width={280}
								height={280}
								className="w-full max-w-70 rounded-md border border-border bg-card"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleDownloadQr}
							>
								<Download className="mr-1.5 h-3.5 w-3.5" />
								Baixar QR Code
							</Button>
						</div>
					)}
				</div>
			}
			sidebarWidth={320}
		>
			<div className="space-y-6 p-4">
				<div className="space-y-1">
					<Label
						htmlFor={`${uid}-phone`}
						className="text-[10px] uppercase tracking-wider text-muted-foreground"
					>
						Número de telefone
					</Label>
					<Input
						id={`${uid}-phone`}
						type="tel"
						value={formatPhoneBR(rawPhone)}
						onChange={(e) => {
							setRawPhone(e.target.value);
							setQrDataUrl("");
						}}
						placeholder="(11) 91234-5678"
						className={
							rawPhone && !phoneValidation.valid ? "border-destructive" : ""
						}
					/>
					{phoneValidation.error && (
						<p className="text-xs text-destructive">{phoneValidation.error}</p>
					)}
				</div>

				<div className="space-y-1">
					<Label
						htmlFor={`${uid}-message`}
						className="text-[10px] uppercase tracking-wider text-muted-foreground"
					>
						Mensagem{" "}
						<span className="text-muted-foreground/60">(opcional)</span>
					</Label>
					<Textarea
						id={`${uid}-message`}
						value={message}
						onChange={(e) => {
							setMessage(e.target.value);
							setQrDataUrl("");
						}}
						placeholder="Digite a mensagem pré-preenchida..."
						rows={3}
					/>
				</div>

				<ResultBox
					label="Link gerado"
					className="max-md:p-0 max-md:bg-transparent max-md:border-0"
				>
					<code className="block mt-1 min-h-10 break-all rounded bg-background px-3 py-2 text-sm font-mono border border-border whitespace-nowrap line-clamp-1 text-ellipsis">
						{link || "https://wa.me/5511999999999"}
					</code>
					<div className="flex gap-3 mt-3 justify-end">
						<CopyButton text={link} disabled={!link} size="sm" />
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={handleOpen}
							disabled={!link}
						>
							<ExternalLink className="mr-1.5 h-3.5 w-3.5" />
							Abrir
						</Button>
					</div>
				</ResultBox>
			</div>
		</LayoutD>
	);
}
