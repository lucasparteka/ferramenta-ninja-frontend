"use client";

import { FileDown, Minimize2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { ResultBox, ResultRow } from "@/components/shared/result-box";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { ImageInfo } from "@/lib/image";
import { compressImage, formatBytes, getImageInfo } from "@/lib/image";

type State = "idle" | "loading" | "done" | "error";

const OUTPUT_FORMATS = [
	{ value: "original", label: "Manter original" },
	{ value: "jpeg", label: "JPEG" },
	{ value: "png", label: "PNG" },
	{ value: "webp", label: "WebP" },
] as const;

export function CompressImage() {
	const [state, setState] = useState<State>("idle");
	const [file, setFile] = useState<File | null>(null);
	const [info, setInfo] = useState<ImageInfo | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [quality, setQuality] = useState(80);
	const [maxWidth, setMaxWidth] = useState<number>(0);
	const [maxHeight, setMaxHeight] = useState<number>(0);
	const [outputFormat, setOutputFormat] = useState("original");
	const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
	const [resultBlob, setResultBlob] = useState<Blob | null>(null);
	const [resultSize, setResultSize] = useState(0);
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

	async function handleCompress() {
		if (!file) return;
		setState("loading");
		setErrorMessage(null);

		try {
			const result = await compressImage(
				file,
				quality,
				maxWidth || undefined,
				maxHeight || undefined,
				outputFormat !== "original" ? outputFormat : undefined,
			);
			setResultDataUrl(result.dataUrl);
			setResultBlob(result.blob);
			setResultSize(result.compressedSize);
			setState("done");
		} catch {
			setErrorMessage("Erro ao comprimir a imagem. Tente novamente.");
			setState("error");
		}
	}

	function handleDownload() {
		if (!resultBlob) return;
		const url = URL.createObjectURL(resultBlob);
		const a = document.createElement("a");
		a.href = url;
		const ext =
			outputFormat !== "original"
				? outputFormat
				: file?.name.split(".").pop() || "jpg";
		a.download = `comprimido.${ext.replace("jpeg", "jpg")}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const reduction =
		file && resultSize ? Math.round((1 - resultSize / file.size) * 100) : 0;

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
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="compress-quality"
									className="text-sm font-medium text-foreground"
								>
									Qualidade
								</label>
								<span className="text-sm text-muted-foreground">
									{quality}%
								</span>
							</div>
							<Slider
								id="compress-quality"
								value={[quality]}
								onValueChange={([v]) => setQuality(v)}
								min={10}
								max={100}
								step={5}
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="compress-width"
								className="block text-sm font-medium text-foreground"
							>
								Largura máxima (px)
							</label>
							<Input
								id="compress-width"
								type="number"
								value={maxWidth || ""}
								onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
								placeholder="Original"
								className="text-foreground"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="compress-height"
								className="block text-sm font-medium text-foreground"
							>
								Altura máxima (px)
							</label>
							<Input
								id="compress-height"
								type="number"
								value={maxHeight || ""}
								onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
								placeholder="Original"
								className="text-foreground"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="compress-format"
								className="block text-sm font-medium text-foreground"
							>
								Formato de saída
							</label>
							<NativeSelect
								id="compress-format"
								value={outputFormat}
								onChange={(e) => setOutputFormat(e.target.value)}
							>
								{OUTPUT_FORMATS.map((f) => (
									<option key={f.value} value={f.value}>
										{f.label}
									</option>
								))}
							</NativeSelect>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={handleCompress}
								disabled={state === "loading"}
								className="flex-1"
							>
								<Minimize2 className="mr-2 h-4 w-4" />
								{state === "loading" ? "Comprimindo..." : "Comprimir"}
							</Button>
							<Button
								variant="outline"
								onClick={handleClear}
								disabled={state === "idle" && !file}
							>
								<X className="mr-2 h-4 w-4" />
								Limpar
							</Button>
						</div>
					</div>

					<div className="min-w-0 flex-1 space-y-4">
						<ResultRow
							label="Tamanho original"
							value={formatBytes(file?.size ?? 0)}
						/>

						{state === "done" && resultBlob && (
							<>
								<ResultRow
									label="Tamanho comprimido"
									value={
										<span className="text-green-700 dark:text-green-400">
											{formatBytes(resultSize)}
										</span>
									}
								/>

								<ResultBox tone="primary">
									<p className="text-3xl font-bold text-green-700 dark:text-green-400">
										-{reduction}%
									</p>
									<p className="mt-1 text-sm text-green-700 dark:text-green-400">
										Redução de {formatBytes(file?.size ?? 0)} para{" "}
										{formatBytes(resultSize)}
									</p>
								</ResultBox>

								{resultDataUrl && (
									<div className="flex justify-center rounded-lg border border-border bg-card p-4">
										{/* biome-ignore lint/performance/noImgElement: blob URLs requerem img nativo */}
										<img
											src={resultDataUrl}
											alt="Pré-visualização da imagem comprimida"
											className="max-h-64 max-w-full rounded object-contain"
										/>
									</div>
								)}

								<Button onClick={handleDownload} size="lg" className="w-full">
									<FileDown className="mr-2 h-5 w-5" />
									Baixar imagem comprimida
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
