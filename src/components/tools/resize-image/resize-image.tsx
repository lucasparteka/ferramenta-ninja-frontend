"use client";

import { FileDown, Loader2, Lock, LockOpen } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { ImageInfo, ResizeMode } from "@/lib/image";
import { calculateAspectRatio, getImageInfo, resizeImage } from "@/lib/image";
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

const PREVIEW_MAX = 320;

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
		if (mode === "stretch") {
			setLockAspectRatio(false);
		} else {
			setLockAspectRatio(true);
		}
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
		if (backgroundColor === "transparent") {
			return {};
		}
		return { backgroundColor };
	}, [resizeMode, backgroundColor]);

	const showCheckerboard =
		resizeMode === "fit" && backgroundColor === "transparent";

	const previewScale = useMemo(() => {
		if (!targetWidth || !targetHeight) return 1;
		return Math.min(PREVIEW_MAX / targetWidth, PREVIEW_MAX / targetHeight, 1);
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
			const url = result.dataUrl;
			const a = document.createElement("a");
			a.href = url;
			a.download = `redimensionado.${ext}`;
			a.click();

			setTimeout(() => {
				URL.revokeObjectURL(url);
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
							<div className="block text-sm font-medium text-foreground">
								Presets
							</div>
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

						<div className="space-y-2">
							<label
								htmlFor="resize-mode"
								className="block text-sm font-medium text-foreground"
							>
								Modo de redimensionamento
							</label>
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
							<div className="space-y-2">
								<label
									htmlFor="resize-bg"
									className="block text-sm font-medium text-foreground"
								>
									Cor de fundo
								</label>
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

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="resize-width"
									className="text-sm font-medium text-foreground"
								>
									Largura (px)
								</label>
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
							<Input
								id="resize-width"
								type="number"
								value={targetWidth || ""}
								onChange={(e) => handleWidthChange(Number(e.target.value) || 0)}
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="resize-height"
								className="block text-sm font-medium text-foreground"
							>
								Altura (px)
							</label>
							<Input
								id="resize-height"
								type="number"
								value={targetHeight || ""}
								onChange={(e) =>
									handleHeightChange(Number(e.target.value) || 0)
								}
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="resize-format"
								className="block text-sm font-medium text-foreground"
							>
								Formato de saída
							</label>
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

					<div className="min-w-0 flex-1 space-y-4">
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>
								Original: {info.width} × {info.height}
							</span>
							<span className="font-medium text-green-700 dark:text-green-400">
								{targetWidth} × {targetHeight}
							</span>
						</div>

						<div
							className={cn(
								"relative mx-auto overflow-hidden rounded-lg border border-border",
								showCheckerboard && "checkerboard-bg",
							)}
							style={{
								width: previewW || PREVIEW_MAX,
								height: previewH || PREVIEW_MAX,
								...(!showCheckerboard ? bgStyle : {}),
							}}
						>
							{/* biome-ignore lint/performance/noImgElement: preview usa URL de blob */}
							<img
								src={info.dataUrl}
								alt="Pré-visualização"
								className="h-full w-full"
								style={{ objectFit }}
							/>
						</div>

						<Button
							onClick={handleDownload}
							disabled={!canDownload || state === "loading"}
							size="lg"
							className="w-full"
						>
							{state === "loading" ? (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							) : (
								<FileDown className="mr-2 h-5 w-5" />
							)}
							{state === "loading"
								? "Gerando imagem..."
								: "Baixar imagem redimensionada"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
