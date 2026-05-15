"use client";

import { Download, Trash, Upload } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutA } from "@/components/shared/layout-a";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { PixKeyType } from "@/lib/pix/generate";
import { generatePixPayload } from "@/lib/pix/generate";
import type { WifiSecurity } from "@/lib/wifi/generate";
import { generateWifiString } from "@/lib/wifi/generate";
import { cn } from "@/lib/utils";

type QrTab = "url" | "wifi" | "email" | "phone" | "pix";

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

const MODE_LIST = [
	{ value: "url" as QrTab, label: "URL / Texto" },
	{ value: "wifi" as QrTab, label: "Wi-Fi" },
	{ value: "email" as QrTab, label: "E-mail" },
	{ value: "phone" as QrTab, label: "Telefone" },
	{ value: "pix" as QrTab, label: "PIX" },
];

function formatPhoneBR(value: string): string {
	const digits = value.replace(/\D/g, "").substring(0, 11);
	if (digits.length <= 2) return digits;
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10)
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface CustomQrCodeProps {
	initialTab?: QrTab;
}

export function CustomQrCode({ initialTab }: CustomQrCodeProps) {
	const [tab, setTab] = useState<QrTab>(initialTab ?? "url");
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

	const [dotColor, setDotColor] = useState("#000000");
	const [bgColor, setBgColor] = useState("#ffffff");
	const [dotType, setDotType] = useState("square");
	const [cornerType, setCornerType] = useState("square");
	const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
	const [logoUrl, setLogoUrl] = useState("");
	const [logoSize, setLogoSize] = useState(0.4);

	const [error, setError] = useState<string | null>(null);
	const qrRef = useRef<HTMLDivElement>(null);
	const qrInstance = useRef<QRCodeStyling | null>(null);
	const logoInputRef = useRef<HTMLInputElement>(null);

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
					type: cornerType as any,
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
					type: cornerType as any,
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

	function handleTabChange(t: QrTab) {
		setTab(t);
		setError(null);
	}

	function renderContentInputs() {
		switch (tab) {
			case "url":
				return (
					<div className="space-y-1.5">
						<Label
							htmlFor="qr-url"
							className="text-xs font-medium text-foreground"
						>
							Texto ou URL
						</Label>
						<Input
							id="qr-url"
							value={urlText}
							onChange={(e) => setUrlText(e.target.value)}
							placeholder="https://..."
						/>
					</div>
				);
			case "wifi":
				return (
					<>
						<div className="space-y-1.5">
							<Label
								htmlFor="qr-wifi-ssid"
								className="text-xs font-medium text-foreground"
							>
								Nome da rede (SSID)
							</Label>
							<Input
								id="qr-wifi-ssid"
								value={wifiSsid}
								onChange={(e) => setWifiSsid(e.target.value)}
								placeholder="MinhaRedeWiFi"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="qr-wifi-pass"
								className="text-xs font-medium text-foreground"
							>
								Senha
							</Label>
							<Input
								id="qr-wifi-pass"
								type="password"
								value={wifiPassword}
								onChange={(e) => setWifiPassword(e.target.value)}
								placeholder="Senha da rede"
							/>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-wifi-sec"
									className="text-xs font-medium text-foreground"
								>
									Segurança
								</Label>
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
							<div className="flex items-center gap-2 pt-5">
								<Checkbox
									id="qr-wifi-hidden"
									checked={wifiHidden}
									onCheckedChange={(checked) => setWifiHidden(checked === true)}
								/>
								<Label
									htmlFor="qr-wifi-hidden"
									className="text-xs font-medium text-foreground cursor-pointer"
								>
									Rede oculta
								</Label>
							</div>
						</div>
					</>
				);
			case "email":
				return (
					<>
						<div className="space-y-1.5">
							<Label
								htmlFor="qr-email-to"
								className="text-xs font-medium text-foreground"
							>
								Para
							</Label>
							<Input
								id="qr-email-to"
								type="email"
								value={emailTo}
								onChange={(e) => setEmailTo(e.target.value)}
								placeholder="exemplo@email.com"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="qr-email-subject"
								className="text-xs font-medium text-foreground"
							>
								Assunto
							</Label>
							<Input
								id="qr-email-subject"
								value={emailSubject}
								onChange={(e) => setEmailSubject(e.target.value)}
								placeholder="Assunto do e-mail"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="qr-email-body"
								className="text-xs font-medium text-foreground"
							>
								Corpo
							</Label>
							<Textarea
								id="qr-email-body"
								value={emailBody}
								onChange={(e) => setEmailBody(e.target.value)}
								placeholder="Mensagem..."
								rows={4}
							/>
						</div>
					</>
				);
			case "phone":
				return (
					<div className="space-y-1.5">
						<Label
							htmlFor="qr-phone"
							className="text-xs font-medium text-foreground"
						>
							Número de telefone
						</Label>
						<Input
							id="qr-phone"
							type="tel"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(formatPhoneBR(e.target.value))}
							placeholder="(11) 91234-5678"
						/>
					</div>
				);
			case "pix":
				return (
					<>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-type"
									className="text-xs font-medium text-foreground"
								>
									Tipo de chave
								</Label>
								<NativeSelect
									id="qr-pix-type"
									value={pixKeyType}
									onChange={(e) => setPixKeyType(e.target.value as PixKeyType)}
								>
									<option value="cpf">CPF</option>
									<option value="cnpj">CNPJ</option>
									<option value="phone">Celular</option>
									<option value="email">E-mail</option>
									<option value="evp">Chave Aleatória</option>
								</NativeSelect>
							</div>
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-key"
									className="text-xs font-medium text-foreground"
								>
									Chave Pix
								</Label>
								<Input
									id="qr-pix-key"
									value={pixKey}
									onChange={(e) => setPixKey(e.target.value)}
									placeholder="Chave Pix"
								/>
							</div>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-name"
									className="text-xs font-medium text-foreground"
								>
									Nome do beneficiário
								</Label>
								<Input
									id="qr-pix-name"
									value={pixName}
									onChange={(e) => setPixName(e.target.value)}
									placeholder="Nome completo"
								/>
							</div>
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-city"
									className="text-xs font-medium text-foreground"
								>
									Cidade
								</Label>
								<Input
									id="qr-pix-city"
									value={pixCity}
									onChange={(e) => setPixCity(e.target.value)}
									placeholder="Cidade"
								/>
							</div>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-amount"
									className="text-xs font-medium text-foreground"
								>
									Valor (opcional)
								</Label>
								<Input
									id="qr-pix-amount"
									value={pixAmount}
									onChange={(e) => setPixAmount(e.target.value)}
									placeholder="0,00"
								/>
							</div>
							<div className="space-y-1.5">
								<Label
									htmlFor="qr-pix-desc"
									className="text-xs font-medium text-foreground"
								>
									Descrição (opcional)
								</Label>
								<Input
									id="qr-pix-desc"
									value={pixDescription}
									onChange={(e) => setPixDescription(e.target.value)}
									placeholder="Descrição"
								/>
							</div>
						</div>
					</>
				);
		}
	}

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Modo
						</h3>
						<div className="space-y-1">
							{MODE_LIST.map((m) => (
								<button
									key={m.value}
									type="button"
									onClick={() => handleTabChange(m.value)}
									className={cn(
										"flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
										tab === m.value
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{m.label}
								</button>
							))}
						</div>
					</div>

					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Conteúdo
						</h3>
						<div className="space-y-3">
							{renderContentInputs()}
							{error && (
								<div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2">
									<p className="text-xs font-medium text-destructive">
										{error}
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Logo
						</h3>
						<input
							id="qr-logo"
							ref={logoInputRef}
							type="file"
							accept="image/*"
							onChange={handleLogoUpload}
							className="hidden"
						/>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							type="button"
							onClick={() => logoInputRef.current?.click()}
						>
							<Upload className="mr-1.5 h-3.5 w-3.5" />
							Escolher arquivo
						</Button>
						{logoUrl && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<img
										src={logoUrl}
										alt="Preview do logo"
										className="h-8 w-8 rounded-md object-contain border border-border"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setLogoUrl("")}
										className="h-7 text-xs"
									>
										<Trash className="h-3 w-3 mr-1" />
										Remover
									</Button>
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Tamanho
										</span>
										<span className="font-mono text-[11px] text-muted-foreground">
											{Math.round(logoSize * 100)}%
										</span>
									</div>
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
							</div>
						)}
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col items-center justify-center gap-4 flex-1 p-4">
					<div
						ref={qrRef}
						className="flex h-[300px] w-[300px] items-center justify-center rounded-md border border-border bg-muted/40"
					/>
					<div className="flex flex-wrap justify-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleDownload("png")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							PNG
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleDownload("jpeg")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							JPG
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleDownload("svg")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							SVG
						</Button>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Aparência
						</h3>
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Cor dos pontos
							</span>
							<div className="flex flex-wrap gap-1.5">
								{PRESET_COLORS.map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => setDotColor(c)}
										className={cn(
											"h-7 w-7 rounded-md border-2",
											dotColor === c
												? "border-foreground"
												: "border-transparent",
										)}
										style={{ backgroundColor: c }}
										aria-label={`Cor ${c}`}
									/>
								))}
								<input
									type="color"
									value={dotColor}
									onChange={(e) => setDotColor(e.target.value)}
									className="h-7 w-7 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Cor do fundo
							</span>
							<div className="flex flex-wrap gap-1.5">
								{["#ffffff", "#f3f4f6", "#1f2937", "#fef3c7", "#ecfccb"].map(
									(c) => (
										<button
											key={c}
											type="button"
											onClick={() => setBgColor(c)}
											className={cn(
												"h-7 w-7 rounded-md border-2",
												bgColor === c
													? "border-foreground"
													: "border-transparent",
											)}
											style={{ backgroundColor: c }}
											aria-label={`Fundo ${c}`}
										/>
									),
								)}
								<input
									type="color"
									value={bgColor}
									onChange={(e) => setBgColor(e.target.value)}
									className="h-7 w-7 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
								/>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Estilo
						</h3>
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Estilo dos pontos
							</span>
							<NativeSelect
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
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Estilo dos cantos
							</span>
							<NativeSelect
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
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-foreground">
								Correção de erro
							</span>
							<NativeSelect
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

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Ações
						</h3>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => handleDownload("png")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							Baixar PNG
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => handleDownload("jpeg")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							Baixar JPG
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => handleDownload("svg")}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							Baixar SVG
						</Button>
					</div>
				</div>
			}
		/>
	);
}
