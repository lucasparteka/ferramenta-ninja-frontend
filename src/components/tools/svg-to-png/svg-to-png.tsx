"use client";

import {
	FileDown,
	Image as ImageIcon,
	Loader2,
	Lock,
	LockOpen,
	Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { NumberInput } from "@/components/shared/number-input";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { formatBytes } from "@/lib/image";
import {
	loadSvgFromFile,
	parseSvgDimensions,
	svgStringToPng,
} from "@/lib/image";

type InputMode = "file" | "code";
type State = "idle" | "loaded" | "loading" | "error";

const BG_COLORS = [
	{ value: "transparent", label: "Transparente" },
	{ value: "#ffffff", label: "Branco" },
	{ value: "#000000", label: "Preto" },
	{ value: "#f5f5f5", label: "Cinza claro" },
	{ value: "#1a1a1a", label: "Cinza escuro" },
	{ value: "#f0f0ff", label: "Off-white" },
] as const;

export function SvgToPngConverter() {
	const [state, setState] = useState<State>("idle");
	const [inputMode, setInputMode] = useState<InputMode>("file");
	const [svgContent, setSvgContent] = useState<string>("");
	const [svgFile, setSvgFile] = useState<File | null>(null);
	const [origWidth, setOrigWidth] = useState(0);
	const [origHeight, setOrigHeight] = useState(0);
	const [targetWidth, setTargetWidth] = useState(0);
	const [targetHeight, setTargetHeight] = useState(0);
	const [lockAspectRatio, setLockAspectRatio] = useState(true);
	const [backgroundColor, setBackgroundColor] = useState("transparent");
	const [isDragging, setIsDragging] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [resultSize, setResultSize] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	function handleFile(f: File) {
		setErrorMessage(null);
		loadSvgFromFile(f)
			.then((svgText) => {
				setSvgFile(f);
				setSvgContent(svgText);
				const dims = parseSvgDimensions(svgText);
				if (dims) {
					setOrigWidth(dims.width);
					setOrigHeight(dims.height);
					setTargetWidth(dims.width);
					setTargetHeight(dims.height);
				} else {
					setOrigWidth(800);
					setOrigHeight(600);
					setTargetWidth(800);
					setTargetHeight(600);
				}
				setState("loaded");
				renderPreview(svgText);
			})
			.catch((err: Error) => {
				setErrorMessage(err.message);
				setState("error");
			});
	}

	function handleCodeChange(code: string) {
		setSvgContent(code);
		setErrorMessage(null);
		setResultSize(null);

		if (!code.trim()) {
			setState("idle");
			setPreviewUrl(null);
			setOrigWidth(0);
			setOrigHeight(0);
			return;
		}

		const dims = parseSvgDimensions(code);
		if (dims) {
			setOrigWidth(dims.width);
			setOrigHeight(dims.height);
			setTargetWidth(dims.width);
			setTargetHeight(dims.height);
		} else {
			setOrigWidth(800);
			setOrigHeight(600);
			setTargetWidth(800);
			setTargetHeight(600);
		}
		setState("loaded");
		renderPreview(code);
	}

	function renderPreview(svg: string) {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		setPreviewUrl(url);
	}

	function handleClear() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSvgFile(null);
		setSvgContent("");
		setOrigWidth(0);
		setOrigHeight(0);
		setTargetWidth(0);
		setTargetHeight(0);
		setState("idle");
		setPreviewUrl(null);
		setResultSize(null);
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
		if (dropped) handleFile(dropped);
	}

	function handleWidthChange(value: number) {
		setTargetWidth(value);
		if (lockAspectRatio && origWidth > 0) {
			setTargetHeight(Math.round((value / origWidth) * origHeight));
		}
	}

	function handleHeightChange(value: number) {
		setTargetHeight(value);
		if (lockAspectRatio && origHeight > 0) {
			setTargetWidth(Math.round((value / origHeight) * origWidth));
		}
	}

	function handleModeToggle(mode: InputMode) {
		setInputMode(mode);
		handleClear();
	}

	const hasInput = !!svgContent && targetWidth > 0 && targetHeight > 0;

	async function handleDownload() {
		if (!svgContent || !hasInput) return;
		setState("loading");
		setErrorMessage(null);

		try {
			const result = await svgStringToPng(svgContent, {
				width: targetWidth,
				height: targetHeight,
				backgroundColor,
			});

			const a = document.createElement("a");
			a.href = result.dataUrl;
			const name = svgFile
				? svgFile.name.replace(/\.svg$/i, ".png")
				: "convertido.png";
			a.download = name;
			a.click();

			URL.revokeObjectURL(result.dataUrl);
			setResultSize(result.blob.size);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Erro ao converter SVG para PNG.",
			);
			setState("error");
			return;
		}

		setState("loaded");
	}

	const previewScale = useMemo(() => {
		if (!targetWidth || !targetHeight) return 1;
		return Math.min(500 / targetWidth, 500 / targetHeight, 1);
	}, [targetWidth, targetHeight]);

	const previewW = Math.round((targetWidth || 1) * previewScale);
	const previewH = Math.round((targetHeight || 1) * previewScale);

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Converter SVG para PNG
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleClear}
							disabled={state === "idle"}
						>
							<Trash className="h-3.5 w-3.5" />
							Limpar
						</Button>
						<Button
							size="sm"
							onClick={handleDownload}
							disabled={!hasInput || state === "loading"}
						>
							{state === "loading" ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<FileDown className="h-3.5 w-3.5" />
							)}
							{state === "loading" ? "Gerando…" : "Baixar PNG"}
						</Button>
					</div>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</h3>
						<OptionSwitch
							options={[
								{ label: "Arquivo", value: "file" },
								{ label: "Código", value: "code" },
							]}
							value={inputMode}
							onChange={(v) => handleModeToggle(v as InputMode)}
							size="sm"
							fullWidth
						/>
					</div>

					{state !== "idle" && (
						<>
							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Arquivo
								</h3>
								{svgFile && (
									<>
										<p className="truncate font-mono text-xs text-foreground">
											{svgFile.name}
										</p>
										<p className="font-mono text-xs text-muted-foreground">
											{formatBytes(svgFile.size)}
										</p>
									</>
								)}
								{!svgFile && inputMode === "code" && (
									<p className="text-xs text-muted-foreground">
										Código SVG colado
									</p>
								)}
								<p className="font-mono text-xs text-muted-foreground">
									{origWidth} × {origHeight}
								</p>
							</div>

							<div className="p-4 space-y-3">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Dimensões
								</h3>
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<Label htmlFor="svg-width" className="text-xs font-medium">
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
										id="svg-width"
										value={targetWidth || 0}
										onChange={handleWidthChange}
										live
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="svg-height" className="text-xs font-medium">
										Altura (px)
									</Label>
									<NumberInput
										id="svg-height"
										value={targetHeight || 0}
										onChange={handleHeightChange}
										live
									/>
								</div>
							</div>

							<div className="p-4 space-y-3">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Fundo
								</h3>
								<NativeSelect
									id="svg-bg"
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
						</>
					)}
				</div>
			}
			centerPanel={
				<div className="flex h-full min-h-110 flex-col items-center justify-center p-4">
					{state === "idle" && inputMode === "file" ? (
						<ImageDropzone
							preview={null}
							isDragging={isDragging}
							onFile={handleFile}
							onClear={handleClear}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							accept="image/svg+xml,.svg"
							label="Arquivo SVG"
							hint="SVG"
							className="w-full"
						/>
					) : state === "idle" && inputMode === "code" ? (
						<div className="flex h-full w-full flex-col">
							<p className="mb-2 text-xs text-muted-foreground">
								Cole o código SVG abaixo:
							</p>
							<textarea
								className="min-h-[300px] w-full resize-none rounded-md border border-border bg-transparent p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
								placeholder={`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="red" />\n</svg>`}
								value={svgContent}
								onChange={(e) => handleCodeChange(e.target.value)}
							/>
						</div>
					) : state === "error" ? (
						<p className="text-sm text-destructive">{errorMessage}</p>
					) : (
						<div
							className="relative flex items-center justify-center overflow-hidden border border-border"
							style={{
								width: previewW || 300,
								height: previewH || 300,
								backgroundColor:
									backgroundColor !== "transparent"
										? backgroundColor
										: undefined,
							}}
						>
							{previewUrl && (
								// biome-ignore lint/performance/noImgElement: blob URL preview
								<img
									src={previewUrl}
									alt="Preview do SVG"
									style={{ maxWidth: "100%", maxHeight: "100%" }}
								/>
							)}
						</div>
					)}
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					{state === "idle" ? (
						<div className="flex h-full min-h-30 flex-col items-center justify-center gap-3 px-4 text-muted-foreground">
							<ImageIcon className="h-8 w-8 opacity-20" />
							<p className="text-xs text-center">
								{inputMode === "file"
									? "Envie um arquivo SVG para começar."
									: "Cole o código SVG para começar."}
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
										{origWidth} × {origHeight}
									</span>
								</div>
								{svgFile && (
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Tamanho
										</span>
										<span className="font-mono text-xs">
											{formatBytes(svgFile.size)}
										</span>
									</div>
								)}
							</div>

							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Destino
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">
										Dimensões
									</span>
									<span className="font-mono text-xs text-muted-foreground">
										{targetWidth && targetHeight
											? `${targetWidth} × ${targetHeight}`
											: "—"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Formato</span>
									<span className="font-mono text-xs text-muted-foreground">
										PNG
									</span>
								</div>
								{resultSize !== null && (
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Tamanho
										</span>
										<span className="font-mono text-xs text-muted-foreground">
											{formatBytes(resultSize)}
										</span>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			}
		/>
	);
}
