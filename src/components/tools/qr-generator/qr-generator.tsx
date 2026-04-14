"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ErrorCorrectionLevel } from "@/lib/qrcode/generate";
import { generateQRCode } from "@/lib/qrcode/generate";

type QRState = {
	text: string;
	size: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
};

const DEFAULT_STATE: QRState = {
	text: "",
	size: 300,
	errorCorrectionLevel: "M",
};

const selectClass =
	"w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const textareaClass =
	"w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none";

export function QRGenerator() {
	const [state, setState] = useState<QRState>(DEFAULT_STATE);
	const [dataUrl, setDataUrl] = useState("");
	const [downloaded, setDownloaded] = useState(false);

	function set<K extends keyof QRState>(key: K, value: QRState[K]) {
		setState((prev) => ({ ...prev, [key]: value }));
	}

	useEffect(() => {
		if (!state.text.trim()) {
			setDataUrl("");
			return;
		}

		const timer = setTimeout(async () => {
			const url = await generateQRCode(state);
			setDataUrl(url);
		}, 300);

		return () => clearTimeout(timer);
	}, [state]);

	function handleDownload() {
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = "qrcode.png";
		a.click();
		setDownloaded(true);
		setTimeout(() => setDownloaded(false), 2000);
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-4 sm:w-[30%] sm:shrink-0">
				<div className="space-y-1">
					<label
						htmlFor="qr-text"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Texto ou URL
					</label>
					<textarea
						id="qr-text"
						rows={4}
						placeholder="Digite o texto ou cole uma URL..."
						value={state.text}
						onChange={(e) => set("text", e.target.value)}
						className={textareaClass}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="qr-size"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Tamanho
					</label>
					<select
						id="qr-size"
						value={state.size}
						onChange={(e) => set("size", Number(e.target.value))}
						className={selectClass}
					>
						<option value={200}>200 × 200 px</option>
						<option value={300}>300 × 300 px</option>
						<option value={400}>400 × 400 px</option>
						<option value={500}>500 × 500 px</option>
					</select>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="qr-ecl"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Correção de erro
					</label>
					<select
						id="qr-ecl"
						value={state.errorCorrectionLevel}
						onChange={(e) =>
							set(
								"errorCorrectionLevel",
								e.target.value as ErrorCorrectionLevel,
							)
						}
						className={selectClass}
					>
						<option value="L">Baixa (L) — 7%</option>
						<option value="M">Média (M) — 15%</option>
						<option value="Q">Alta (Q) — 25%</option>
						<option value="H">Máxima (H) — 30%</option>
					</select>
				</div>
			</div>

			<div className="flex flex-1 flex-col items-center justify-start gap-4">
				{dataUrl ? (
					<>
						<img
							src={dataUrl}
							alt="QR Code gerado"
							width={state.size}
							height={state.size}
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
