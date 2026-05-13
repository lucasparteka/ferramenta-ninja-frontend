"use client";

import { RefreshCw, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { FaviconMode } from "@/lib/image/favicon";
import { cn } from "@/lib/utils";
import { FaviconShell } from "./favicon-shell";
import {
	ColorField,
	clipFormat,
	drawBackground,
	type Format,
	FormatField,
	LivePreview,
	ModeTabs,
	Section,
	SizeSlider,
} from "./shared-controls";

interface ImageEditorProps {
	mode: FaviconMode;
	onChangeMode: (m: FaviconMode) => void;
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	footer?: React.ReactNode;
}

const SOURCE_SIZE = 512;

function renderImage(
	ctx: CanvasRenderingContext2D,
	size: number,
	img: HTMLImageElement,
	format: Format,
	mediaSize: number,
	bgColor: string,
) {
	ctx.clearRect(0, 0, size, size);
	drawBackground(ctx, size, bgColor, format);
	clipFormat(ctx, size, format);

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

	if (format !== "square") ctx.restore();
}

export function ImageEditor({
	mode,
	onChangeMode,
	onGenerate,
	footer,
}: ImageEditorProps) {
	const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
	const [fileName, setFileName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [format, setFormat] = useState<Format>("square");
	const [mediaSize, setMediaSize] = useState(80);
	const [bgColor, setBgColor] = useState("transparent");
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (ctx && sourceImage) {
				renderImage(ctx, size, sourceImage, format, mediaSize, bgColor);
			}
			return canvas;
		},
		[sourceImage, format, mediaSize, bgColor],
	);

	const handleGenerate = useCallback(() => {
		if (!sourceImage) return;
		setIsGenerating(true);
		setTimeout(() => {
			const canvas = renderAtSize(SOURCE_SIZE);
			setIsGenerating(false);
			onGenerate(canvas, renderAtSize);
		}, 200);
	}, [sourceImage, renderAtSize, onGenerate]);

	/* ---------- panes -------------------------------------------- */

	const left = (
		<>
			<div className="p-4 border-b border-border">
				<ModeTabs value={mode} onChange={onChangeMode} />
			</div>

			<Section title="Origem">
				{sourceImage ? (
					<div className="space-y-2">
						<div className="flex items-center gap-3 rounded-lg border bg-background p-2.5">
							{/* biome-ignore lint/performance/noImgElement: . */}
							<img
								src={sourceImage.src}
								alt=""
								className="h-10 w-10 shrink-0 rounded-md object-cover"
							/>
							<div className="min-w-0 flex-1">
								<p className="truncate text-xs font-medium text-foreground">
									{fileName}
								</p>
								<p className="font-mono text-[10px] text-muted-foreground">
									{sourceImage.naturalWidth}×{sourceImage.naturalHeight}
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
							className="w-full"
						>
							<Upload className="mr-2 h-3.5 w-3.5" />
							Trocar imagem
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) handleFile(f);
								if (fileInputRef.current) fileInputRef.current.value = "";
							}}
						/>
					</div>
				) : (
					// biome-ignore lint/a11y/useSemanticElements: .
					<div
						className={cn(
							"relative cursor-pointer rounded-lg border border-dashed p-5 text-center transition-colors",
							isDragging
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50 hover:bg-muted/40",
						)}
						onClick={() => fileInputRef.current?.click()}
						onDrop={(e) => {
							e.preventDefault();
							setIsDragging(false);
							const f = e.dataTransfer.files?.[0];
							if (f) handleFile(f);
						}}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={(e) => {
							e.preventDefault();
							setIsDragging(false);
						}}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								fileInputRef.current?.click();
						}}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) handleFile(f);
								if (fileInputRef.current) fileInputRef.current.value = "";
							}}
						/>
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
								{isLoading ? (
									<RefreshCw className="h-4 w-4 animate-spin" />
								) : (
									<Upload className="h-4 w-4" />
								)}
							</div>
							<div className="space-y-0.5">
								<p className="text-xs font-medium text-foreground">
									{isLoading ? "Carregando..." : "Clique ou arraste"}
								</p>
								<p className="text-[10px] text-muted-foreground">
									PNG, JPG, WebP · 10MB
								</p>
							</div>
						</div>
					</div>
				)}
			</Section>
		</>
	);

	const center = (
		<LivePreview
			render={sourceImage ? renderAtSize : null}
			deps={[sourceImage, format, mediaSize, bgColor]}
			bgTransparent={bgColor === "transparent"}
			empty={
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground">
						Envie uma imagem à esquerda para começar
					</p>
					<p className="text-xs text-muted-foreground/80">
						PNG, JPG, WebP, GIF · até 10MB
					</p>
				</div>
			}
		/>
	);

	const right = (
		<>
			<Section title="Cor de fundo">
				<ColorField value={bgColor} onChange={setBgColor} />
			</Section>
			<Section title="Forma">
				<FormatField value={format} onChange={setFormat} />
			</Section>
			<Section title="Escala">
				<SizeSlider value={mediaSize} onChange={setMediaSize} />
			</Section>
		</>
	);

	return (
		<FaviconShell
			left={left}
			center={center}
			right={right}
			footer={footer}
			onGenerate={handleGenerate}
			canGenerate={!!sourceImage}
			isGenerating={isGenerating}
			error={error}
		/>
	);
}
