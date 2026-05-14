"use client";

import { FileDown, Minimize2, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
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
				undefined,
				undefined,
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
		file && resultSize
			? Math.min(99, Math.round((1 - resultSize / file.size) * 100))
			: 0;

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Comprimir Imagem
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleClear}
							disabled={!file}
						>
							<Trash className="h-3.5 w-3.5" />
							Limpar
						</Button>
						<Button
							size="sm"
							onClick={handleCompress}
							disabled={!file || state === "loading"}
						>
							<Minimize2 className="h-3.5 w-3.5" />
							{state === "loading" ? "Comprimindo…" : "Comprimir"}
						</Button>
					</div>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					{file && info && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Arquivo
							</h3>
							<p className="truncate font-mono text-xs text-foreground">
								{file.name}
							</p>
							<p className="font-mono text-xs text-muted-foreground">
								{file.type || "imagem"}
							</p>
							<p className="font-mono text-xs text-muted-foreground">
								{info.width} × {info.height} px
							</p>
						</div>
					)}

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Qualidade
							</h3>
							<span className="font-mono text-xs text-muted-foreground">
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

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Formato
						</h3>
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
				</div>
			}
			centerPanel={
				<div className="flex h-full min-h-110 flex-col items-center justify-center p-4">
					{!file ? (
						<ImageDropzone
							preview={null}
							isDragging={isDragging}
							onFile={handleFile}
							onClear={handleClear}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						/>
					) : state === "loading" ? (
						<p className="text-sm text-muted-foreground">Comprimindo…</p>
					) : state === "error" ? (
						<p className="text-sm text-destructive">{errorMessage}</p>
					) : resultDataUrl ? (
						// biome-ignore lint/performance/noImgElement: blob URLs requerem img nativo
						<img
							src={resultDataUrl}
							alt="Pré-visualização da imagem comprimida"
							className="max-h-80 max-w-full rounded-md object-contain"
						/>
					) : info?.dataUrl ? (
						// biome-ignore lint/performance/noImgElement: blob URLs requerem img nativo
						<img
							src={info.dataUrl}
							alt="Pré-visualização da imagem original"
							className="max-h-80 max-w-full rounded-md object-contain"
						/>
					) : null}
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					{!file ? (
						<div className="p-4">
							<p className="text-xs text-muted-foreground">
								Envie uma imagem para ver os resultados.
							</p>
						</div>
					) : (
						<>
							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Original
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Tamanho</span>
									<span className="font-mono text-xs">
										{formatBytes(file.size)}
									</span>
								</div>
								{info && (
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Dimensões
										</span>
										<span className="font-mono text-xs">
											{info.width} × {info.height}
										</span>
									</div>
								)}
							</div>

							{state === "done" && resultBlob && (
								<div className="p-4 space-y-3">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Resultado
									</h3>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Tamanho
										</span>
										<span className="font-mono text-xs text-success">
											{formatBytes(resultSize)}
										</span>
									</div>
									<div className="rounded-md border border-border bg-muted/40 p-3 text-center">
										<p className="font-mono text-2xl font-semibold">
											-{reduction}%
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											de {formatBytes(file.size)} para {formatBytes(resultSize)}
										</p>
									</div>
									<Button onClick={handleDownload} className="w-full">
										<FileDown className="h-4 w-4" />
										Baixar imagem
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			}
		/>
	);
}
