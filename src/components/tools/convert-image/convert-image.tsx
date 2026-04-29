"use client";

import { AlertTriangle, ArrowLeftRight, FileDown } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { ResultBox, ResultRow } from "@/components/shared/result-box";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import type { ImageInfo } from "@/lib/image";
import {
	convertImage,
	formatBytes,
	getFormatLabel,
	getImageInfo,
} from "@/lib/image";

type State = "idle" | "loading" | "done" | "error";

const TARGET_FORMATS = [
	{ value: "image/jpeg", label: "JPEG" },
	{ value: "image/png", label: "PNG" },
	{ value: "image/webp", label: "WebP" },
] as const;

export function ConvertImage() {
	const [state, setState] = useState<State>("idle");
	const [file, setFile] = useState<File | null>(null);
	const [info, setInfo] = useState<ImageInfo | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [targetFormat, setTargetFormat] = useState("image/jpeg");
	const [quality, setQuality] = useState(100);
	const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
	const [resultBlob, setResultBlob] = useState<Blob | null>(null);
	const [resultSize, setResultSize] = useState(0);
	const [targetLabel, setTargetLabel] = useState("JPEG");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleFile = useCallback(async (f: File) => {
		try {
			const imageInfo = await getImageInfo(f);
			setFile(f);
			setInfo(imageInfo);
			setState("idle");
			setResultDataUrl(null);
			setResultBlob(null);
			setResultSize(0);
			setErrorMessage(null);
		} catch {
			setErrorMessage(
				"Não foi possível carregar a imagem. Verifique se o formato é válido.",
			);
			setState("error");
		}
	}, []);

	function handleClear() {
		if (info?.dataUrl) URL.revokeObjectURL(info.dataUrl);
		if (resultDataUrl) URL.revokeObjectURL(resultDataUrl);
		setFile(null);
		setInfo(null);
		setState("idle");
		setResultDataUrl(null);
		setResultBlob(null);
		setResultSize(0);
		setErrorMessage(null);
	}

	function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		setIsDragging(true);
	}

	function handleDragLeave() {
		setIsDragging(false);
	}

	function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped?.type.startsWith("image/")) {
			handleFile(dropped);
		}
	}

	async function handleConvert() {
		if (!file) return;
		setState("loading");
		setErrorMessage(null);

		try {
			const result = await convertImage(file, targetFormat, quality / 100);
			setResultDataUrl(result.dataUrl);
			setResultBlob(result.blob);
			setResultSize(result.convertedSize);
			setTargetLabel(result.targetFormat);
			setState("done");
		} catch {
			setErrorMessage("Erro ao converter a imagem. Tente novamente.");
			setState("error");
		}
	}

	function handleDownload() {
		if (!resultBlob) return;
		const url = URL.createObjectURL(resultBlob);
		const a = document.createElement("a");
		a.href = url;
		const ext = targetFormat.split("/")[1].replace("jpeg", "jpg");
		a.download = `convertido.${ext}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const showTransparencyWarning =
		file?.type === "image/png" && targetFormat === "image/jpeg";

	const sameFormat = info?.format === getFormatLabel(targetFormat);

	return (
		<div className="space-y-6">
			<ImageDropzone
				preview={info?.dataUrl ?? null}
				isDragging={isDragging}
				onFile={handleFile}
				onClear={handleClear}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			/>

			{errorMessage && (
				<p className="text-sm text-destructive">{errorMessage}</p>
			)}

			{info && (
				<div className="flex flex-col gap-6 sm:flex-row">
					<div className="w-full space-y-5 sm:w-72 sm:shrink-0">
						<ResultRow label="Formato atual" value={info.format} />

						<ResultRow label="Tamanho" value={formatBytes(file?.size ?? 0)} />

						<div className="space-y-2">
							<label
								htmlFor="convert-format"
								className="block text-sm font-medium text-foreground"
							>
								Converter para
							</label>
							<NativeSelect
								id="convert-format"
								value={targetFormat}
								onChange={(e) => setTargetFormat(e.target.value)}
							>
								{TARGET_FORMATS.map((f) => (
									<option key={f.value} value={f.value}>
										{f.label}
									</option>
								))}
							</NativeSelect>
						</div>

						{(targetFormat === "image/jpeg" ||
							targetFormat === "image/webp") && (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<label
										htmlFor="convert-quality"
										className="text-sm font-medium text-foreground"
									>
										Qualidade
									</label>
									<span className="text-sm text-muted-foreground">
										{quality}%
									</span>
								</div>
								<Slider
									id="convert-quality"
									value={[quality]}
									onValueChange={([v]) => setQuality(v)}
									min={10}
									max={100}
									step={5}
								/>
							</div>
						)}

						{showTransparencyWarning && (
							<div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2">
								<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
								<p className="text-xs text-warning">
									A transparência será removida. O fundo ficará branco.
								</p>
							</div>
						)}

						<Button
							onClick={handleConvert}
							disabled={state === "loading" || sameFormat}
							className="w-full"
						>
							<ArrowLeftRight className="mr-2 h-4 w-4" />
							{state === "loading" ? "Convertendo..." : "Converter"}
						</Button>
					</div>

					<div className="min-w-0 flex-1 space-y-4">
						{state === "done" && resultBlob && (
							<>
								<ResultRow
									label="Formato convertido"
									value={
										<span className="text-green-700 dark:text-green-400">
											{targetLabel}
										</span>
									}
								/>

								<ResultRow
									label="Novo tamanho"
									value={
										<span className="text-green-700 dark:text-green-400">
											{formatBytes(resultSize)}
										</span>
									}
								/>

								<ResultBox tone="primary">
									<p className="text-3xl font-bold text-green-700 dark:text-green-400">
										{info.format} → {targetLabel}
									</p>
									<p className="mt-1 text-sm text-green-700 dark:text-green-400">
										{formatBytes(file?.size ?? 0)} → {formatBytes(resultSize)}
									</p>
								</ResultBox>

								{resultDataUrl && (
									<div className="flex justify-center rounded-lg border border-border bg-card p-4">
										{/* biome-ignore lint/performance/noImgElement: blob URLs requerem img nativo */}
										<img
											src={resultDataUrl}
											alt="Pré-visualização da imagem convertida"
											className="max-h-64 max-w-full rounded object-contain"
										/>
									</div>
								)}

								<Button onClick={handleDownload} size="lg" className="w-full">
									<FileDown className="mr-2 h-5 w-5" />
									Baixar imagem convertida
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
