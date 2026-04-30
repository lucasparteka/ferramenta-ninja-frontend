"use client";

import { Download, Trash } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { PixKeyType } from "@/lib/pix/generate";
import { generatePixPayload } from "@/lib/pix/generate";
import type { WifiSecurity } from "@/lib/wifi/generate";
import { generateWifiString } from "@/lib/wifi/generate";

type QrTab = "url" | "wifi" | "email" | "phone" | "pix";

const TAB_LABELS: Record<QrTab, string> = {
	url: "URL / Texto",
	wifi: "Wi-Fi",
	email: "E-mail",
	phone: "Telefone",
	pix: "PIX",
};

const DOT_TYPES = [
	{ value: "square", label: "Quadrado" },
	{ value: "rounded", label: "Redondo" },
	{ value: "dots", label: "Pontos" },
	{ value: "classy", label: "Classy" },
	{ value: "classy-rounded", label: "Classy Redondo" },
	{ value: "extra-rounded", label: "Extra Redondo" },
];

const CORNER_TYPES = [
	{ value: "square", label: "Quadrado" },
	{ value: "dot", label: "Ponto" },
	{ value: "extra-rounded", label: "Extra Redondo" },
];

const ERROR_LEVELS = [
	{ value: "L", label: "L (Baixa)" },
	{ value: "M", label: "M (Média)" },
	{ value: "Q", label: "Q (Alta)" },
	{ value: "H", label: "H (Máxima)" },
];

const PRESET_COLORS = [
	"#000000",
	"#7c3aed",
	"#2563eb",
	"#059669",
	"#dc2626",
	"#ea580c",
	"#db2777",
	"#0891b2",
];

function formatPhoneBR(value: string): string {
	const digits = value.replace(/\D/g, "").substring(0, 11);
	if (digits.length <= 2) return digits;
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10)
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function CustomQrCode() {
	// Tabs & content state
	const [tab, setTab] = useState<QrTab>("url");
	const [urlText, setUrlText] = useState("https://ferramenta.ninja");
	const [wifiSsid, setWifiSsid] = useState("");
	const [wifiPassword, setWifiPassword] = useState("");
	const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>("WPA");
	const [wifiHidden, setWifiHidden] = useState(false);
	const [emailTo, setEmailTo] = useState("");
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pixKeyType, setPixKeyType] = useState<PixKeyType>("cpf");
	const [pixKey, setPixKey] = useState("");
	const [pixName, setPixName] = useState("");
	const [pixCity, setPixCity] = useState("");
	const [pixAmount, setPixAmount] = useState("");
	const [pixDescription, setPixDescription] = useState("");

	// Style state
	const [dotColor, setDotColor] = useState("#000000");
	const [bgColor, setBgColor] = useState("#ffffff");
	const [dotType, setDotType] = useState("rounded");
	const [cornerType, setCornerType] = useState("extra-rounded");
	const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
	const [logoUrl, setLogoUrl] = useState("");
	const [logoSize, setLogoSize] = useState(0.4);

	const [error, setError] = useState<string | null>(null);
	const qrRef = useRef<HTMLDivElement>(null);
	const qrInstance = useRef<QRCodeStyling | null>(null);

	const buildQr = useCallback(() => {
		function getQrData(): string {
			switch (tab) {
				case "url":
					return urlText.trim() || " ";
				case "wifi":
					return generateWifiString({
						ssid: wifiSsid,
						password: wifiPassword,
						security: wifiSecurity,
						hidden: wifiHidden,
					});
				case "email": {
					const params = new URLSearchParams();
					if (emailSubject) params.set("subject", emailSubject);
					if (emailBody) params.set("body", emailBody);
					const query = params.toString();
					return `mailto:${emailTo}${query ? `?${query}` : ""}`;
				}
				case "phone":
					return `tel:${phoneNumber.replace(/\D/g, "")}`;
				case "pix": {
					const amount = pixAmount
						? Number(pixAmount.replace(",", "."))
						: undefined;
					return generatePixPayload({
						keyType: pixKeyType,
						key: pixKey,
						name: pixName,
						city: pixCity,
						amount,
						description: pixDescription || undefined,
					});
				}
			}
		}

		function validate(): string | null {
			switch (tab) {
				case "url":
					if (!urlText.trim()) return "Informe o texto ou URL.";
					break;
				case "wifi":
					if (!wifiSsid.trim()) return "Informe o nome da rede (SSID).";
					if (wifiSecurity !== "nopass" && !wifiPassword)
						return "Informe a senha da rede.";
					break;
				case "email":
					if (!emailTo.trim()) return "Informe o destinatário do e-mail.";
					break;
				case "phone":
					if (!phoneNumber.trim()) return "Informe o número de telefone.";
					break;
				case "pix":
					if (!pixKey.trim()) return "Informe a chave Pix.";
					if (!pixName.trim()) return "Informe o nome do beneficiário.";
					if (!pixCity.trim()) return "Informe a cidade do beneficiário.";
					if (pixAmount) {
						const val = Number(pixAmount.replace(",", "."));
						if (Number.isNaN(val) || val <= 0)
							return "Valor inválido. Use o formato 10,50.";
					}
					break;
			}
			return null;
		}

		const err = validate();
		if (err) {
			setError(err);
			return;
		}
		setError(null);

		const data = getQrData();
		if (!qrInstance.current) {
			qrInstance.current = new QRCodeStyling({
				width: 300,
				height: 300,
				data,
				type: "svg",
				shape: "square",
				margin: 10,
				qrOptions: {
					errorCorrectionLevel: errorLevel,
				},
				dotsOptions: {
					type: dotType as any,
					color: dotColor,
				},
				cornersSquareOptions: {
					type: cornerType as any,
					color: dotColor,
				},
				cornersDotOptions: {
					type: "dot",
					color: dotColor,
				},
				backgroundOptions: {
					color: bgColor,
				},
				image: logoUrl || undefined,
				imageOptions: {
					hideBackgroundDots: true,
					imageSize: logoSize,
					margin: 5,
				},
			});
			if (qrRef.current) {
				qrRef.current.innerHTML = "";
				qrInstance.current.append(qrRef.current);
			}
		} else {
			qrInstance.current.update({
				data,
				qrOptions: {
					errorCorrectionLevel: errorLevel,
				},
				dotsOptions: {
					type: dotType as any,
					color: dotColor,
				},
				cornersSquareOptions: {
					type: cornerType as any,
					color: dotColor,
				},
				cornersDotOptions: {
					type: "dot",
					color: dotColor,
				},
				backgroundOptions: {
					color: bgColor,
				},
				image: logoUrl || undefined,
				imageOptions: {
					hideBackgroundDots: true,
					imageSize: logoSize,
					margin: 5,
				},
			});
		}
	}, [
		tab,
		urlText,
		wifiSsid,
		wifiPassword,
		wifiSecurity,
		wifiHidden,
		emailTo,
		emailSubject,
		emailBody,
		phoneNumber,
		pixKeyType,
		pixKey,
		pixName,
		pixCity,
		pixAmount,
		pixDescription,
		dotColor,
		bgColor,
		dotType,
		cornerType,
		errorLevel,
		logoUrl,
		logoSize,
	]);

	// Real-time update whenever relevant state changes
	useEffect(() => {
		const timer = setTimeout(() => {
			buildQr();
		}, 150);
		return () => clearTimeout(timer);
	}, [buildQr]);

	useEffect(() => {
		if (qrRef.current && qrInstance.current) {
			qrRef.current.innerHTML = "";
			qrInstance.current.append(qrRef.current);
		}
		// Initial build
		buildQr();
	}, [buildQr]);

	async function handleDownload(ext: "png" | "jpeg" | "svg") {
		if (!qrInstance.current) return;
		await qrInstance.current.download({
			extension: ext,
			name: `qr-code-${tab}`,
		});
	}

	function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			setLogoUrl(ev.target?.result as string);
		};
		reader.readAsDataURL(file);
	}

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<div className="flex flex-wrap gap-2">
				{(Object.keys(TAB_LABELS) as QrTab[]).map((t) => (
					<button
						key={t}
						type="button"
						onClick={() => {
							setTab(t);
							setError(null);
						}}
						className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
							tab === t
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-card text-foreground hover:bg-accent"
						}`}
					>
						{TAB_LABELS[t]}
					</button>
				))}
			</div>

			{/* Main grid: left = inputs + styling, right = preview */}
			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				{/* Left column */}
				<div className="space-y-6">
					{/* Content inputs */}
					<div className="space-y-4">
						{tab === "url" && (
							<div className="space-y-2">
								<label
									htmlFor="qr-url"
									className="block text-sm font-medium text-foreground"
								>
									Texto ou URL
								</label>
								<Input
									id="qr-url"
									value={urlText}
									onChange={(e) => setUrlText(e.target.value)}
									placeholder="https://..."
								/>
							</div>
						)}

						{tab === "wifi" && (
							<div className="space-y-3">
								<div className="space-y-2">
									<label
										htmlFor="qr-wifi-ssid"
										className="block text-sm font-medium text-foreground"
									>
										Nome da rede (SSID)
									</label>
									<Input
										id="qr-wifi-ssid"
										value={wifiSsid}
										onChange={(e) => setWifiSsid(e.target.value)}
										placeholder="MinhaRedeWiFi"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="qr-wifi-pass"
										className="block text-sm font-medium text-foreground"
									>
										Senha
									</label>
									<Input
										id="qr-wifi-pass"
										type="password"
										value={wifiPassword}
										onChange={(e) => setWifiPassword(e.target.value)}
										placeholder="Senha da rede"
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="qr-wifi-sec"
											className="block text-sm font-medium text-foreground"
										>
											Segurança
										</label>
										<NativeSelect
											id="qr-wifi-sec"
											value={wifiSecurity}
											onChange={(e) =>
												setWifiSecurity(e.target.value as WifiSecurity)
											}
										>
											<option value="WPA">WPA/WPA2</option>
											<option value="WEP">WEP</option>
											<option value="nopass">Aberta</option>
										</NativeSelect>
									</div>
									<div className="flex items-center gap-2 pt-6">
										<input
											id="qr-wifi-hidden"
											type="checkbox"
											checked={wifiHidden}
											onChange={(e) => setWifiHidden(e.target.checked)}
											className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
										/>
										<label
											htmlFor="qr-wifi-hidden"
											className="text-sm text-foreground"
										>
											Rede oculta
										</label>
									</div>
								</div>
							</div>
						)}

						{tab === "email" && (
							<div className="space-y-3">
								<div className="space-y-2">
									<label
										htmlFor="qr-email-to"
										className="block text-sm font-medium text-foreground"
									>
										Para
									</label>
									<Input
										id="qr-email-to"
										type="email"
										value={emailTo}
										onChange={(e) => setEmailTo(e.target.value)}
										placeholder="exemplo@email.com"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="qr-email-subject"
										className="block text-sm font-medium text-foreground"
									>
										Assunto
									</label>
									<Input
										id="qr-email-subject"
										value={emailSubject}
										onChange={(e) => setEmailSubject(e.target.value)}
										placeholder="Assunto do e-mail"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="qr-email-body"
										className="block text-sm font-medium text-foreground"
									>
										Corpo
									</label>
									<Textarea
										id="qr-email-body"
										value={emailBody}
										onChange={(e) => setEmailBody(e.target.value)}
										placeholder="Mensagem..."
										rows={4}
									/>
								</div>
							</div>
						)}

						{tab === "phone" && (
							<div className="space-y-2">
								<label
									htmlFor="qr-phone"
									className="block text-sm font-medium text-foreground"
								>
									Número de telefone
								</label>
								<Input
									id="qr-phone"
									type="tel"
									value={phoneNumber}
									onChange={(e) =>
										setPhoneNumber(formatPhoneBR(e.target.value))
									}
									placeholder="(11) 91234-5678"
								/>
							</div>
						)}

						{tab === "pix" && (
							<div className="space-y-3">
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-type"
											className="block text-sm font-medium text-foreground"
										>
											Tipo de chave
										</label>
										<NativeSelect
											id="qr-pix-type"
											value={pixKeyType}
											onChange={(e) =>
												setPixKeyType(e.target.value as PixKeyType)
											}
										>
											<option value="cpf">CPF</option>
											<option value="cnpj">CNPJ</option>
											<option value="phone">Celular</option>
											<option value="email">E-mail</option>
											<option value="evp">Chave Aleatória</option>
										</NativeSelect>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-key"
											className="block text-sm font-medium text-foreground"
										>
											Chave Pix
										</label>
										<Input
											id="qr-pix-key"
											value={pixKey}
											onChange={(e) => setPixKey(e.target.value)}
											placeholder="Chave Pix"
										/>
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-name"
											className="block text-sm font-medium text-foreground"
										>
											Nome do beneficiário
										</label>
										<Input
											id="qr-pix-name"
											value={pixName}
											onChange={(e) => setPixName(e.target.value)}
											placeholder="Nome completo"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-city"
											className="block text-sm font-medium text-foreground"
										>
											Cidade
										</label>
										<Input
											id="qr-pix-city"
											value={pixCity}
											onChange={(e) => setPixCity(e.target.value)}
											placeholder="Cidade"
										/>
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-amount"
											className="block text-sm font-medium text-foreground"
										>
											Valor (opcional)
										</label>
										<Input
											id="qr-pix-amount"
											value={pixAmount}
											onChange={(e) => setPixAmount(e.target.value)}
											placeholder="0,00"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="qr-pix-desc"
											className="block text-sm font-medium text-foreground"
										>
											Descrição (opcional)
										</label>
										<Input
											id="qr-pix-desc"
											value={pixDescription}
											onChange={(e) => setPixDescription(e.target.value)}
											placeholder="Descrição"
										/>
									</div>
								</div>
							</div>
						)}

						{error && (
							<div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
								<p className="text-sm font-medium text-destructive">{error}</p>
							</div>
						)}
					</div>

					{/* Styling controls */}
					<div className="space-y-4 rounded-lg border border-border bg-card p-4">
						<h4 className="text-sm font-semibold text-foreground">
							Personalização
						</h4>

						<div className="grid gap-4 sm:grid-cols-2">
							{/* Dot color */}
							<div className="space-y-2">
								<span className="block text-xs font-medium text-muted-foreground">
									Cor dos pontos
								</span>
								<div className="flex flex-wrap gap-2">
									{PRESET_COLORS.map((c) => (
										<button
											key={c}
											type="button"
											onClick={() => setDotColor(c)}
											className={`h-6 w-6 rounded-full border-2 ${
												dotColor === c
													? "border-foreground"
													: "border-transparent"
											}`}
											style={{ backgroundColor: c }}
											aria-label={`Cor ${c}`}
										/>
									))}
									<input
										type="color"
										value={dotColor}
										onChange={(e) => setDotColor(e.target.value)}
										className="h-6 w-6 cursor-pointer rounded-full border-0 p-0"
									/>
								</div>
							</div>

							{/* Background color */}
							<div className="space-y-2">
								<span className="block text-xs font-medium text-muted-foreground">
									Cor do fundo
								</span>
								<div className="flex flex-wrap gap-2">
									{["#ffffff", "#f3f4f6", "#1f2937", "#fef3c7", "#ecfccb"].map(
										(c) => (
											<button
												key={c}
												type="button"
												onClick={() => setBgColor(c)}
												className={`h-6 w-6 rounded-full border-2 ${
													bgColor === c
														? "border-foreground"
														: "border-transparent"
												}`}
												style={{ backgroundColor: c }}
												aria-label={`Fundo ${c}`}
											/>
										),
									)}
									<input
										type="color"
										value={bgColor}
										onChange={(e) => setBgColor(e.target.value)}
										className="h-6 w-6 cursor-pointer rounded-full border-0 p-0"
									/>
								</div>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							{/* Dot type */}
							<div className="space-y-2">
								<label
									htmlFor="qr-dot-type"
									className="block text-xs font-medium text-muted-foreground"
								>
									Estilo dos pontos
								</label>
								<NativeSelect
									id="qr-dot-type"
									value={dotType}
									onChange={(e) => setDotType(e.target.value)}
								>
									{DOT_TYPES.map((d) => (
										<option key={d.value} value={d.value}>
											{d.label}
										</option>
									))}
								</NativeSelect>
							</div>

							{/* Corner type */}
							<div className="space-y-2">
								<label
									htmlFor="qr-corner-type"
									className="block text-xs font-medium text-muted-foreground"
								>
									Estilo dos cantos
								</label>
								<NativeSelect
									id="qr-corner-type"
									value={cornerType}
									onChange={(e) => setCornerType(e.target.value)}
								>
									{CORNER_TYPES.map((d) => (
										<option key={d.value} value={d.value}>
											{d.label}
										</option>
									))}
								</NativeSelect>
							</div>

							{/* Error correction */}
							<div className="space-y-2">
								<label
									htmlFor="qr-error"
									className="block text-xs font-medium text-muted-foreground"
								>
									Correção de erro
								</label>
								<NativeSelect
									id="qr-error"
									value={errorLevel}
									onChange={(e) =>
										setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")
									}
								>
									{ERROR_LEVELS.map((d) => (
										<option key={d.value} value={d.value}>
											{d.label}
										</option>
									))}
								</NativeSelect>
							</div>
						</div>

						{/* Logo upload */}
						<div className="space-y-2">
							<label
								htmlFor="qr-logo"
								className="block text-xs font-medium text-muted-foreground"
							>
								Logo central (opcional)
							</label>
							<input
								id="qr-logo"
								type="file"
								accept="image/*"
								onChange={handleLogoUpload}
								className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
							/>
							{logoUrl && (
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<img
											src={logoUrl}
											alt="Logo preview"
											className="h-8 w-8 rounded object-contain"
										/>
										<Button
											type="button"
											variant="secondary"
											size="sm"
											onClick={() => setLogoUrl("")}
										>
											<Trash />
											Remover
										</Button>
									</div>
									<span className="block text-xs text-muted-foreground">
										Tamanho do logo
									</span>
									<input
										type="range"
										min={0.1}
										max={0.5}
										step={0.05}
										value={logoSize}
										onChange={(e) => setLogoSize(Number(e.target.value))}
										className="w-full"
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right column: preview */}
				<div className="space-y-4">
					<div className="flex flex-col items-center gap-4">
						<div
							ref={qrRef}
							className="flex h-[300px] w-[300px] items-center justify-center rounded-lg border border-border bg-card"
						/>
						<div className="flex flex-wrap justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDownload("png")}
							>
								<Download className="mr-1.5 h-4 w-4" />
								Baixar em PNG
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDownload("jpeg")}
							>
								<Download className="mr-1.5 h-4 w-4" />
								Baixar em JPG
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDownload("svg")}
							>
								<Download className="mr-1.5 h-4 w-4" />
								Baixar em SVG
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
