"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
	AlertTriangle,
	ArrowLeft,
	Image as ImageIcon,
	Loader2,
	RefreshCw,
	Upload,
	Wand2,
} from "lucide-react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";

interface ImageEditorProps {
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	onBack: () => void;
}

const FORMATS = [
	{ label: "Quadrado", value: "square" },
	{ label: "Arredondado", value: "rounded" },
	{ label: "Redondo", value: "circle" },
] as const;

const COLOR_PRESETS = [
	"#FFFFFF",
	"#000000",
	"#1F2937",
	"#374151",
	"#4B5563",
	"#EF4444",
	"#F97316",
	"#EAB308",
	"#22C55E",
	"#3B82F6",
	"#8B5CF6",
	"#A855F7",
	"#EC4899",
	"#06B6D4",
	"#14B8A6",
	"#84CC16",
	"#F43F5E",
	"#0EA5E9",
	"#6366F1",
	"#D946EF",
];

const PREVIEW_SIZE = 320;
const SOURCE_SIZE = 512;

function drawBackground(
	ctx: CanvasRenderingContext2D,
	size: number,
	color: string,
	format: (typeof FORMATS)[number]["value"],
) {
	ctx.fillStyle = color;
	switch (format) {
		case "circle":
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			ctx.fill();
			break;
		case "rounded": {
			const r = Math.round(size * 0.2);
			ctx.beginPath();
			(
				ctx as CanvasRenderingContext2D & {
					roundRect?: typeof ctx.roundRect;
				}
			).roundRect?.(0, 0, size, size, r);
			ctx.fill();
			break;
		}
		default:
			ctx.fillRect(0, 0, size, size);
	}
}

function renderImage(
	ctx: CanvasRenderingContext2D,
	size: number,
	img: HTMLImageElement,
	format: (typeof FORMATS)[number]["value"],
	mediaSize: number,
	bgColor: string,
) {
	ctx.clearRect(0, 0, size, size);

	if (bgColor && bgColor !== "transparent") {
		drawBackground(ctx, size, bgColor, format);
	}

	if (format !== "square") {
		ctx.save();
		if (format === "circle") {
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			ctx.clip();
		} else {
			const r = Math.round(size * 0.2);
			ctx.beginPath();
			(
				ctx as CanvasRenderingContext2D & {
					roundRect?: typeof ctx.roundRect;
				}
			).roundRect?.(0, 0, size, size, r);
			ctx.clip();
		}
	}

	const targetSize = size * (mediaSize / 100);
	const scale = Math.min(
		targetSize / img.naturalWidth,
		targetSize / img.naturalHeight,
	);
	const dw = img.naturalWidth * scale;
	const dh = img.naturalHeight * scale;
	const dx = (size - dw) / 2;
	const dy = (size - dh) / 2;
	ctx.drawImage(img, dx, dy, dw, dh);

	if (format !== "square") {
		ctx.restore();
	}
}

export function ImageEditor({ onGenerate, onBack }: ImageEditorProps) {
	const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
	const [fileName, setFileName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [format, setFormat] = useState<"square" | "rounded" | "circle">(
		"square",
	);
	const [mediaSize, setMediaSize] = useState(80);
	const [bgColor, setBgColor] = useState("transparent");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const mini16Ref = useRef<HTMLCanvasElement>(null);
	const mini32Ref = useRef<HTMLCanvasElement>(null);
	const mini48Ref = useRef<HTMLCanvasElement>(null);

	const handleFile = useCallback((file: File) => {
		setError(null);
		if (!file.type.startsWith("image/")) {
			setError("Por favor, envie um arquivo de imagem (PNG, JPG, WebP, etc.)");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setError("Imagem muito grande. Tamanho máximo: 10MB.");
			return;
		}
		setIsLoading(true);
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				setSourceImage(img);
				setFileName(file.name);
				setIsLoading(false);
			};
			img.onerror = () => {
				setError("Não foi possível carregar a imagem.");
				setIsLoading(false);
			};
			img.src = e.target?.result as string;
		};
		reader.onerror = () => {
			setError("Erro ao ler o arquivo.");
			setIsLoading(false);
		};
		reader.readAsDataURL(file);
	}, []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
			if (fileInputRef.current) fileInputRef.current.value = "";
		},
		[handleFile],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files?.[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleReset = useCallback(() => {
		setSourceImage(null);
		setFileName("");
		setError(null);
	}, []);

	const handleBgTextChange = useCallback((value: string) => {
		const v = value.trim();
		if (v.toLowerCase() === "transparent") {
			setBgColor("transparent");
		} else if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
			setBgColor(v);
		}
	}, []);

	useEffect(() => {
		if (!sourceImage) return;
		const canvas = previewCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = PREVIEW_SIZE;
		canvas.height = PREVIEW_SIZE;
		renderImage(ctx, PREVIEW_SIZE, sourceImage, format, mediaSize, bgColor);
	}, [sourceImage, format, mediaSize, bgColor]);

	useEffect(() => {
		if (!sourceImage) return;
		const sizes = [16, 32, 48];
		const refs = [mini16Ref, mini32Ref, mini48Ref];
		sizes.forEach((size, idx) => {
			const canvas = refs[idx].current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			canvas.width = size;
			canvas.height = size;
			renderImage(ctx, size, sourceImage, format, mediaSize, bgColor);
		});
	}, [sourceImage, format, mediaSize, bgColor]);

	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (!ctx || !sourceImage) return canvas;
			renderImage(ctx, size, sourceImage, format, mediaSize, bgColor);
			return canvas;
		},
		[sourceImage, format, mediaSize, bgColor],
	);

	const handleGenerate = useCallback(() => {
		if (!sourceImage) return;
		setIsGenerating(true);
		setTimeout(() => {
			const canvas = document.createElement("canvas");
			canvas.width = SOURCE_SIZE;
			canvas.height = SOURCE_SIZE;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				setIsGenerating(false);
				return;
			}
			renderImage(ctx, SOURCE_SIZE, sourceImage, format, mediaSize, bgColor);
			setIsGenerating(false);
			onGenerate(canvas, renderAtSize);
		}, 200);
	}, [sourceImage, format, mediaSize, bgColor, onGenerate, renderAtSize]);

	return (
		<div className="space-y-6">
			{error && (
				<div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
					<AlertTriangle className="h-4 w-4 shrink-0" />
					{error}
				</div>
			)}

			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<ImageIcon className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Imagem → Favicon
					</h2>
					<p className="text-sm text-muted-foreground">
						Envie uma imagem e personalize o fundo, formato e tamanho.
					</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card">
				{sourceImage ? (
					<div className="flex items-center gap-4 p-4">
						{/* biome-ignore lint/performance/noImgElement: . */}
						<img
							src={sourceImage.src}
							alt=""
							className="h-14 w-14 shrink-0 rounded-lg object-cover"
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-foreground">
								{fileName}
							</p>
							<p className="text-xs text-muted-foreground">
								{sourceImage.naturalWidth}×{sourceImage.naturalHeight}px
							</p>
						</div>
						<Button variant="outline" size="sm" onClick={handleReset}>
							<Upload className="mr-1.5 h-3 w-3" />
							Trocar
						</Button>
					</div>
				) : (
					<div
						className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center shadow transition-colors ${
							isDragging
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50 hover:bg-muted/30"
						}`}
						onClick={() => fileInputRef.current?.click()}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								fileInputRef.current?.click();
							}
						}}
						aria-label="Área de upload de imagem"
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleInputChange}
							aria-label="Selecionar arquivo de imagem"
						/>
						<div className="flex flex-col items-center gap-3">
							<div
								className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
									isDragging
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground"
								}`}
							>
								{isLoading ? (
									<RefreshCw className="h-6 w-6 animate-spin" />
								) : (
									<Upload className="h-6 w-6" />
								)}
							</div>
							<div className="space-y-1">
								<p className="font-medium text-foreground">
									{isLoading
										? "Carregando..."
										: isDragging
											? "Solte a imagem aqui"
											: "Clique ou arraste uma imagem"}
								</p>
								<p className="text-xs text-muted-foreground">
									PNG, JPG, WebP, GIF · Máx. 10MB
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{sourceImage && (
				<>
					<div className="rounded-xl border bg-card p-6">
						<div className="flex flex-col items-center gap-5">
							<canvas
								ref={previewCanvasRef}
								width={PREVIEW_SIZE}
								height={PREVIEW_SIZE}
								className="mx-auto max-w-[280px] w-full aspect-square rounded-lg shadow-sm"
							/>

							<div className="flex items-center justify-center gap-6">
								{[
									{ label: "16×16", ref: mini16Ref, size: 16 },
									{ label: "32×32", ref: mini32Ref, size: 32 },
									{ label: "48×48", ref: mini48Ref, size: 48 },
								].map(({ label, ref: canvasRef, size }) => (
									<div
										key={label}
										className="flex flex-col items-center gap-1.5"
									>
										<canvas
											ref={canvasRef}
											style={{
												width: size,
												height: size,
												imageRendering: "pixelated",
											}}
											className="rounded-sm border"
										/>
										<span className="text-[10px] text-muted-foreground">
											{label}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-6 rounded-xl border bg-card p-6">
						<div className="space-y-3">
							<label
								htmlFor="image-bg-hex"
								className="text-sm font-medium text-foreground"
							>
								Cor de fundo
							</label>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={bgColor === "transparent" ? "#3B82F6" : bgColor}
									onChange={(e) => setBgColor(e.target.value)}
									className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border bg-transparent p-0.5"
									aria-label="Cor de fundo"
								/>
								<input
									id="image-bg-hex"
									type="text"
									value={bgColor}
									onChange={(e) => handleBgTextChange(e.target.value)}
									className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm font-mono"
									placeholder="#FFFFFF ou transparent"
								/>
								<button
									type="button"
									onClick={() => setBgColor("transparent")}
									className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
										bgColor === "transparent"
											? "border-primary bg-primary/10"
											: "border-muted-foreground/30 hover:border-muted-foreground/60"
									}`}
									aria-label="Fundo transparente"
								>
									<svg
										aria-hidden="true"
										className="h-4 w-4 text-muted-foreground"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
									>
										<line x1="18" y1="6" x2="6" y2="18" />
									</svg>
								</button>
							</div>
							<div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
								{COLOR_PRESETS.map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => setBgColor(c)}
										title={c}
										className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
											bgColor === c
												? "scale-110 border-primary ring-2 ring-primary/30"
												: "border-muted-foreground/30"
										}`}
										style={{ backgroundColor: c }}
										aria-label={`Cor ${c}`}
									>
										{bgColor === c && (
											<svg
												aria-hidden="true"
												className="mx-auto h-3 w-3 text-white drop-shadow"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={3}
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</button>
								))}
							</div>
						</div>

						<hr className="border-border" />

						<div className="space-y-3">
							<div className="text-sm font-medium text-foreground">Formato</div>
							<OptionSwitch
								options={FORMATS.map((f) => ({
									value: f.value,
									label: f.label,
								}))}
								value={format}
								onChange={(v) =>
									setFormat(v as "square" | "rounded" | "circle")
								}
							/>
						</div>

						<hr className="border-border" />

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<label
									htmlFor="image-media-size"
									className="text-sm font-medium text-foreground"
								>
									Tamanho da imagem
								</label>
								<span className="text-xs font-medium text-muted-foreground">
									{mediaSize}%
								</span>
							</div>
							<input
								id="image-media-size"
								type="range"
								min={40}
								max={100}
								value={mediaSize}
								onChange={(e) => setMediaSize(Number(e.target.value))}
								className="w-full accent-primary"
								aria-label="Tamanho da imagem"
							/>
							<div className="flex justify-between text-[10px] text-muted-foreground">
								<span>40%</span>
								<span>100%</span>
							</div>
						</div>
					</div>

					<div className="flex gap-3">
						<Button variant="outline" onClick={onBack} className="flex-1">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar
						</Button>
						<Button
							onClick={handleGenerate}
							disabled={isGenerating}
							className="flex-1"
						>
							{isGenerating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Gerando...
								</>
							) : (
								<>
									<Wand2 className="mr-2 h-4 w-4" />
									Gerar Favicon
								</>
							)}
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
