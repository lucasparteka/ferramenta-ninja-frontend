"use client";

import { FileDown, Loader2, Lock, LockOpen, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import type { ImageInfo, ResizeMode } from "@/lib/image";
import {
	calculateAspectRatio,
	formatBytes,
	getImageInfo,
	resizeImage,
} from "@/lib/image";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "error";

const SIZE_PRESETS = [
	{ label: "Instagram (1080×1080)", width: 1080, height: 1080 },
	{ label: "Instagram Story (1080×1920)", width: 1080, height: 1920 },
	{ label: "Facebook (1200×630)", width: 1200, height: 630 },
	{ label: "YouTube (1280×720)", width: 1280, height: 720 },
	{ label: "Twitter (1200×675)", width: 1200, height: 675 },
	{ label: "LinkedIn (1200×627)", width: 1200, height: 627 },
] as const;

const OUTPUT_FORMATS = [
	{ value: "original", label: "Manter original" },
	{ value: "image/jpeg", label: "JPEG" },
	{ value: "image/png", label: "PNG" },
	{ value: "image/webp", label: "WebP" },
] as const;

const RESIZE_MODES: { value: ResizeMode; label: string }[] = [
	{ value: "fit", label: "Ajustar (manter proporção)" },
	{ value: "cover", label: "Preencher (cortar excesso)" },
	{ value: "stretch", label: "Esticar (forçar tamanho)" },
];

const BG_COLORS = [
	{ value: "#ffffff", label: "Branco" },
	{ value: "#000000", label: "Preto" },
	{ value: "#f5f5f5", label: "Cinza claro" },
	{ value: "transparent", label: "Transparente" },
] as const;

const PREVIEW_MAX_W = 640;
const PREVIEW_MAX_H = 600;
const PREVIEW_PLACEHOLDER = 320;

export function ResizeImage() {
	const [state, setState] = useState<State>("idle");
	const [file, setFile] = useState<File | null>(null);
	const [info, setInfo] = useState<ImageInfo | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [targetWidth, setTargetWidth] = useState(0);
	const [targetHeight, setTargetHeight] = useState(0);
	const [lockAspectRatio, setLockAspectRatio] = useState(true);
	const [outputFormat, setOutputFormat] = useState("original");
	const [resizeMode, setResizeMode] = useState<ResizeMode>("fit");
	const [backgroundColor, setBackgroundColor] = useState("#ffffff");
	const [activePreset, setActivePreset] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleFile = useCallback(async (f: File) => {
		try {
			const imageInfo = await getImageInfo(f);
			setFile(f);
			setInfo(imageInfo);
			setTargetWidth(imageInfo.width);
			setTargetHeight(imageInfo.height);
			setState("idle");
			setErrorMessage(null);
			setActivePreset(null);
		} catch {
			setErrorMessage(
				"Não foi possível carregar a imagem. Verifique se o formato é válido.",
			);
			setState("error");
		}
	}, []);

	function handleClear() {
		if (info?.dataUrl) URL.revokeObjectURL(info.dataUrl);
		setFile(null);
		setInfo(null);
		setState("idle");
		setTargetWidth(0);
		setTargetHeight(0);
		setErrorMessage(null);
		setActivePreset(null);
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

	function handleWidthChange(value: number) {
		setTargetWidth(value);
		setActivePreset(null);
		if (lockAspectRatio && info) {
			const result = calculateAspectRatio(
				info.width,
				info.height,
				value,
				"width",
			);
			setTargetHeight(result.height);
		}
	}

	function handleHeightChange(value: number) {
		setTargetHeight(value);
		setActivePreset(null);
		if (lockAspectRatio && info) {
			const result = calculateAspectRatio(
				info.width,
				info.height,
				value,
				"height",
			);
			setTargetWidth(result.width);
		}
	}

	function handleModeChange(mode: ResizeMode) {
		setResizeMode(mode);
		setLockAspectRatio(mode !== "stretch");
	}

	function applyPreset(index: number, width: number, height: number) {
		setTargetWidth(width);
		setTargetHeight(height);
		setActivePreset(index);
	}

	const objectFit = useMemo(() => {
		if (resizeMode === "fit") return "contain";
		if (resizeMode === "cover") return "cover";
		return "fill";
	}, [resizeMode]);

	const bgStyle = useMemo(() => {
		if (resizeMode !== "fit") return {};
		if (backgroundColor === "transparent") return {};
		return { backgroundColor };
	}, [resizeMode, backgroundColor]);

	const showCheckerboard =
		resizeMode === "fit" && backgroundColor === "transparent";

	const previewScale = useMemo(() => {
		if (!targetWidth || !targetHeight) return 1;
		return Math.min(
			PREVIEW_MAX_W / targetWidth,
			PREVIEW_MAX_H / targetHeight,
			1,
		);
	}, [targetWidth, targetHeight]);

	const previewW = Math.round((targetWidth || 1) * previewScale);
	const previewH = Math.round((targetHeight || 1) * previewScale);

	async function handleDownload() {
		if (!file || targetWidth <= 0 || targetHeight <= 0) return;
		setState("loading");
		setErrorMessage(null);

		try {
			const result = await resizeImage(
				file,
				targetWidth,
				targetHeight,
				outputFormat !== "original" ? outputFormat : undefined,
				0.92,
				resizeMode,
				backgroundColor,
			);

			const ext =
				outputFormat !== "original"
					? outputFormat.split("/")[1].replace("jpeg", "jpg")
					: file.name.split(".").pop() || "png";
			const a = document.createElement("a");
			a.href = result.dataUrl;
			a.download = `redimensionado.${ext}`;
			a.click();

			setTimeout(() => {
				URL.revokeObjectURL(result.dataUrl);
			}, 1000);
		} catch {
			setErrorMessage("Erro ao redimensionar a imagem. Tente novamente.");
			setState("error");
			return;
		}

		setState("idle");
	}

	const canDownload = file && info && targetWidth > 0 && targetHeight > 0;

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Redimensionar Imagem
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
							onClick={handleDownload}
							disabled={!canDownload || state === "loading"}
						>
							{state === "loading" ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<FileDown className="h-3.5 w-3.5" />
							)}
							{state === "loading" ? "Gerando…" : "Baixar"}
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
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Presets
						</h3>
						<div className="grid grid-cols-2 gap-1.5">
							{SIZE_PRESETS.map((preset, i) => (
								<button
									type="button"
									key={preset.label}
									onClick={() => applyPreset(i, preset.width, preset.height)}
									className={cn(
										"rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
										activePreset === i
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-secondary text-foreground hover:bg-accent",
									)}
								>
									{preset.label}
								</button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Dimensões
						</h3>
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="resize-width" className="text-xs font-medium">
									Largura (px)
								</Label>
								<button
									type="button"
									onClick={() => setLockAspectRatio(!lockAspectRatio)}
									className="text-muted-foreground hover:text-foreground"
									aria-label={
										lockAspectRatio
											? "Desbloquear proporção"
											: "Bloquear proporção"
									}
								>
									{lockAspectRatio ? (
										<Lock className="h-4 w-4" />
									) : (
										<LockOpen className="h-4 w-4" />
									)}
								</button>
							</div>
							<NumberInput
								id="resize-width"
								value={targetWidth || 0}
								onChange={(v) => handleWidthChange(v)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="resize-height" className="text-xs font-medium">
								Altura (px)
							</Label>
							<NumberInput
								id="resize-height"
								value={targetHeight || 0}
								onChange={(v) => handleHeightChange(v)}
							/>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Modo
						</h3>
						<NativeSelect
							id="resize-mode"
							value={resizeMode}
							onChange={(e) => handleModeChange(e.target.value as ResizeMode)}
						>
							{RESIZE_MODES.map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</NativeSelect>
					</div>

					{resizeMode === "fit" && (
						<div className="p-4 space-y-3">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Fundo
							</h3>
							<NativeSelect
								id="resize-bg"
								value={backgroundColor}
								onChange={(e) => setBackgroundColor(e.target.value)}
							>
								{BG_COLORS.map((c) => (
									<option key={c.value} value={c.value}>
										{c.label}
									</option>
								))}
							</NativeSelect>
						</div>
					)}

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Formato
						</h3>
						<NativeSelect
							id="resize-format"
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
					) : state === "error" ? (
						<p className="text-sm text-destructive">{errorMessage}</p>
					) : (
						<div
							className={cn(
								"relative overflow-hidden rounded-md border border-border",
								showCheckerboard && "checkerboard-bg",
							)}
							style={{
								width: previewW || PREVIEW_PLACEHOLDER,
								height: previewH || PREVIEW_PLACEHOLDER,
								...(!showCheckerboard ? bgStyle : {}),
							}}
						>
							{/* biome-ignore lint/performance/noImgElement: preview usa URL de blob */}
							<img
								src={info?.dataUrl}
								alt="Pré-visualização"
								className="h-full w-full"
								style={{ objectFit }}
							/>
						</div>
					)}
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					{!file ? (
						<div className="p-4">
							<p className="text-xs text-muted-foreground">
								Envie uma imagem para ver as informações.
							</p>
						</div>
					) : (
						<>
							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Original
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">
										Dimensões
									</span>
									<span className="font-mono text-xs">
										{info?.width} × {info?.height}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Tamanho</span>
									<span className="font-mono text-xs">
										{formatBytes(file.size)}
									</span>
								</div>
							</div>

							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Destino
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">
										Dimensões
									</span>
									<span
										className={cn(
											"font-mono text-xs",
											targetWidth > 0 && targetHeight > 0
												? "text-success"
												: "text-muted-foreground",
										)}
									>
										{targetWidth > 0 && targetHeight > 0
											? `${targetWidth} × ${targetHeight}`
											: "—"}
									</span>
								</div>
							</div>
						</>
					)}
				</div>
			}
		/>
	);
}
