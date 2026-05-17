"use client";

import { Image as ImageIcon, Palette, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { Slider } from "@/components/shared/slider";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	type ExtractedColor,
	extractColors,
	pickPixelColor,
} from "@/lib/color/extract";
import { getImageInfo, type ImageInfo } from "@/lib/image/info";

function ColorCard({ color }: { color: ExtractedColor }) {
	return (
		<div className="flex items-center gap-2 p-2.5">
			<div
				className="h-8 w-8 shrink-0 rounded-sm border border-border"
				style={{ backgroundColor: color.hex }}
			/>
			<div className="flex-1 min-w-0">
				<p className="font-mono text-[11px] font-medium">
					{color.hex.toUpperCase()}
				</p>
				<p className="font-mono text-[10px] text-muted-foreground">
					rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
				</p>
				<p className="font-mono text-[10px] text-muted-foreground">
					hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
				</p>
			</div>
			<CopyButton text={color.hex} iconOnly size="sm" variant="ghost" />
		</div>
	);
}

export function ColorExtractor() {
	const [info, setInfo] = useState<ImageInfo | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [colorCount, setColorCount] = useState(6);
	const [palette, setPalette] = useState<ExtractedColor[]>([]);
	const [picked, setPicked] = useState<ExtractedColor | null>(null);
	const [error, setError] = useState<string | null>(null);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const blobUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
		};
	}, []);

	async function handleFile(file: File) {
		setError(null);
		setPalette([]);
		setPicked(null);

		if (blobUrlRef.current) {
			URL.revokeObjectURL(blobUrlRef.current);
			blobUrlRef.current = null;
		}

		try {
			const imgInfo = await getImageInfo(file);
			blobUrlRef.current = imgInfo.dataUrl;
			setInfo(imgInfo);

			const img = new Image();
			img.onload = () => {
				imageRef.current = img;
				const canvas = canvasRef.current;
				if (!canvas) return;
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext("2d")?.drawImage(img, 0, 0);
			};
			img.src = imgInfo.dataUrl;
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "Não foi possível carregar a imagem.",
			);
		}
	}

	function handleClear() {
		if (blobUrlRef.current) {
			URL.revokeObjectURL(blobUrlRef.current);
			blobUrlRef.current = null;
		}
		imageRef.current = null;
		setInfo(null);
		setPalette([]);
		setPicked(null);
		setError(null);
	}

	function handleExtract() {
		if (!imageRef.current) return;
		setPalette(extractColors(imageRef.current, colorCount));
		setPicked(null);
	}

	function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = Math.floor(((e.clientX - rect.left) * canvas.width) / rect.width);
		const y = Math.floor(
			((e.clientY - rect.top) * canvas.height) / rect.height,
		);
		setPicked(pickPixelColor(canvas, x, y));
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
		const file = e.dataTransfer.files[0];
		if (file?.type.startsWith("image/")) handleFile(file);
	}

	return (
		<LayoutA
			header={
				<ToolHeader
					title="Extrair Cores de Imagem"
					badge="DESIGN"
					actions={
						info ? (
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={handleClear}
							>
								<Trash className="mr-1.5 h-3.5 w-3.5" />
								Limpar
							</Button>
						) : undefined
					}
				/>
			}
			leftPanel={
				<div className="h-full divide-y divide-border">
					{info ? (
						<div className="p-4 space-y-4">
							<div className="space-y-2">
								<Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
									Número de cores:{" "}
									<span className="font-mono font-medium text-foreground">
										{colorCount}
									</span>
								</Label>
								<Slider
									min={3}
									max={12}
									value={[colorCount]}
									onValueChange={(vals) => setColorCount(vals[0])}
									aria-label="Número de cores a extrair"
								/>
								<div className="flex justify-between font-mono text-[10px] text-muted-foreground">
									<span>3</span>
									<span>12</span>
								</div>
							</div>
							<Button className="w-full" size="sm" onClick={handleExtract}>
								<Palette className="mr-1.5 h-3.5 w-3.5" />
								Extrair paleta
							</Button>
						</div>
					) : (
						<div className="hidden h-full lg:flex flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
							<ImageIcon className="h-8 w-8 opacity-20" />
							<p className="text-xs text-center">
								Carregue uma imagem para começar
							</p>
						</div>
					)}
				</div>
			}
			centerPanel={
				<div className="flex flex-1 items-center justify-center p-4">
					{info ? (
						<div className="flex flex-col items-center gap-2 w-full h-full">
							<canvas
								ref={canvasRef}
								onClick={handleCanvasClick}
								className="max-w-full max-h-96 rounded border border-border cursor-crosshair"
								title="Clique em qualquer ponto para capturar a cor"
							/>
							<p className="text-[11px] text-muted-foreground">
								Clique na imagem para capturar a cor de um ponto
							</p>
						</div>
					) : (
						<div className="w-full">
							<ImageDropzone
								preview={null}
								isDragging={isDragging}
								onFile={handleFile}
								onClear={handleClear}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								label="Imagem"
								hint="PNG, JPG, WebP"
							/>
							{error && (
								<p className="mt-2 text-xs text-destructive">{error}</p>
							)}
						</div>
					)}
				</div>
			}
			rightPanel={
				<div className="h-full divide-y divide-border">
					{palette.length > 0 ? (
						<div>
							<p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Paleta dominante
							</p>
							<div className="divide-y divide-border">
								{palette.map((color, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: ordem da paleta é estável
									<ColorCard key={i} color={color} />
								))}
							</div>
						</div>
					) : (
						<div className="flex h-full min-h-30 flex-col items-center justify-center gap-3 px-4 text-muted-foreground">
							<Palette className="h-8 w-8 opacity-20" />
							<p className="text-xs text-center">
								{info
									? 'Clique em "Extrair paleta" para analisar as cores'
									: "Nenhuma paleta extraída ainda"}
							</p>
						</div>
					)}

					{picked && (
						<div>
							<p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Cor capturada
							</p>
							<ColorCard color={picked} />
						</div>
					)}
				</div>
			}
		/>
	);
}
