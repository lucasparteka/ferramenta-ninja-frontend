"use client";

import { useId, useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResultBox } from "@/components/shared/result-box";
import { CopyButton } from "@/components/shared/copy-button";
import { generateQRCode } from "@/lib/qrcode/generate";

function formatPhoneBR(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 11);
	if (digits.length === 0) return "";
	const ddd = digits.slice(0, 2);
	const rest = digits.slice(2);
	if (rest.length <= 4) return `(${ddd}) ${rest}`;
	return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

function validatePhone(raw: string): { valid: boolean; digits: string; error?: string } {
	const digits = raw.replace(/\D/g, "");
	if (digits.length === 0) return { valid: false, digits: "" };
	if (digits.length < 10) return { valid: false, digits, error: "Número incompleto" };
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
			const dataUrl = await generateQRCode({ text: link, size: 280, errorCorrectionLevel: "M" });
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
		<div className="space-y-6">
			<div className="space-y-1">
				<label htmlFor={`${uid}-phone`} className="block text-[10px] uppercase tracking-wider text-muted-foreground">
					Número de telefone
				</label>
				<Input
					id={`${uid}-phone`}
					type="tel"
					value={formatPhoneBR(rawPhone)}
					onChange={(e) => {
						setRawPhone(e.target.value);
						setQrDataUrl("");
					}}
					placeholder="(11) 91234-5678"
					className={rawPhone && !phoneValidation.valid ? "border-destructive" : ""}
				/>
				{phoneValidation.error && (
					<p className="text-xs text-destructive">{phoneValidation.error}</p>
				)}
			</div>

			<div className="space-y-1">
				<label htmlFor={`${uid}-message`} className="block text-[10px] uppercase tracking-wider text-muted-foreground">
					Mensagem <span className="text-muted-foreground/60">(opcional)</span>
				</label>
				<Textarea
					id={`${uid}-message`}
					value={message}
					onChange={(e) => { setMessage(e.target.value); setQrDataUrl(""); }}
					placeholder="Digite a mensagem pré-preenchida..."
					rows={3}
				/>
			</div>

			<ResultBox label="Link gerado">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<code className="min-h-[2.5rem] flex-1 break-all rounded bg-background px-3 py-2 text-sm font-mono text-foreground">
						{link || "https://wa.me/5511999999999"}
					</code>
					<div className="flex shrink-0 gap-1">
						<CopyButton text={link} disabled={!link} />
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={handleOpen}
							disabled={!link}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-1.5"
							>
								<path d="M15 3h6v6" />
								<path d="M10 14 21 3" />
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
							</svg>
							Abrir
						</Button>
					</div>
				</div>
			</ResultBox>

			<div className="space-y-3">
				<Button type="button" variant="outline" size="sm" onClick={handleGenerateQr} disabled={!link}>
					{showQr ? "Atualizar" : "Gerar"} QR Code
				</Button>

				{qrDataUrl && (
					<div className="flex flex-col items-center gap-3">
						<img
							src={qrDataUrl}
							alt="QR Code do link WhatsApp"
							width={280}
							height={280}
							className="rounded-md border border-border bg-card"
						/>
						<Button type="button" variant="outline" size="sm" onClick={handleDownloadQr}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-1.5"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" x2="12" y1="15" y2="3" />
							</svg>
							Baixar QR Code
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
