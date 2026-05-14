"use client";

import { Crop, FileDown, Trash } from "lucide-react";
import { useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
	type Crop as CropType,
	centerCrop,
	makeAspectCrop,
	type PixelCrop,
} from "react-image-crop";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import { getCroppedImgFromElement } from "@/utils/image";

const ASPECT_RATIOS: Record<string, number | undefined> = {
	free: undefined,
	"1:1": 1,
	"16:9": 16 / 9,
	"4:3": 4 / 3,
	"3:2": 3 / 2,
};

const ASPECT_RATIO_LABELS: Record<string, string> = {
	free: "Livre",
	"1:1": "1:1 Quadrado",
	"16:9": "16:9 Widescreen",
	"4:3": "4:3 Padrão",
	"3:2": "3:2 Foto",
};

function buildCenterAspectCrop(width: number, height: number, aspect: number) {
	return centerCrop(
		makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
		width,
		height,
	);
}

export function ImageCropper() {
	const [file, setFile] = useState<File | null>(null);
	const [imgSrc, setImgSrc] = useState<string>("");
	const [origWidth, setOrigWidth] = useState(0);
	const [origHeight, setOrigHeight] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [crop, setCrop] = useState<CropType>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const [aspectKey, setAspectKey] = useState("free");
	const [resultUrl, setResultUrl] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const aspect = ASPECT_RATIOS[aspectKey];

	function handleFile(f: File) {
		if (!f.type.startsWith("image/")) return;
		const url = URL.createObjectURL(f);
		setFile(f);
		setImgSrc(url);
		setResultUrl(null);
		setCrop(undefined);
		setCompletedCrop(null);
	}

	function handleClear() {
		if (imgSrc) URL.revokeObjectURL(imgSrc);
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		setFile(null);
		setImgSrc("");
		setOrigWidth(0);
		setOrigHeight(0);
		setIsDragging(false);
		setResultUrl(null);
		setCrop(undefined);
		setCompletedCrop(null);
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
		if (dropped?.type.startsWith("image/")) handleFile(dropped);
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const { width, height } = e.currentTarget;
		setOrigWidth(width);
		setOrigHeight(height);
		if (aspect) {
			setCrop(buildCenterAspectCrop(width, height, aspect));
		} else {
			setCrop(
				centerCrop(
					{ unit: "%", x: 10, y: 10, width: 80, height: 80 },
					width,
					height,
				),
			);
		}
	}

	async function handleCrop() {
		if (!imgRef.current || !completedCrop) return;
		setIsProcessing(true);
		try {
			const blob = await getCroppedImgFromElement(
				imgRef.current,
				completedCrop,
				"image/png",
			);
			const url = URL.createObjectURL(blob);
			if (resultUrl) URL.revokeObjectURL(resultUrl);
			setResultUrl(url);
		} catch {
			// fail silently
		} finally {
			setIsProcessing(false);
		}
	}

	function handleDownload() {
		if (!resultUrl) return;
		const a = document.createElement("a");
		a.href = resultUrl;
		a.download = "recortado.png";
		a.click();
	}

	function handleAspectChange(key: string) {
		setAspectKey(key);
		const newAspect = ASPECT_RATIOS[key];
		if (imgRef.current) {
			const { width, height } = imgRef.current;
			if (newAspect) {
				setCrop(buildCenterAspectCrop(width, height, newAspect));
			} else {
				setCrop(
					centerCrop(
						{ unit: "%", x: 10, y: 10, width: 80, height: 80 },
						width,
						height,
					),
				);
			}
		} else {
			setCrop(undefined);
		}
	}

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Recortar Imagem
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleClear}
							disabled={!imgSrc}
						>
							<Trash className="h-3.5 w-3.5" />
							Limpar
						</Button>
						<Button
							size="sm"
							onClick={handleCrop}
							disabled={!completedCrop || isProcessing}
						>
							<Crop className="h-3.5 w-3.5" />
							{isProcessing ? "Processando…" : "Recortar"}
						</Button>
					</div>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					{imgSrc && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Arquivo
							</h3>
							<p className="truncate font-mono text-xs text-foreground">
								{file?.name}
							</p>
							<p className="font-mono text-xs text-muted-foreground">
								{file?.type || "imagem"}
							</p>
							{origWidth > 0 && origHeight > 0 && (
								<p className="font-mono text-xs text-muted-foreground">
									{origWidth} × {origHeight} px
								</p>
							)}
						</div>
					)}

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Proporção
						</h3>
						<NativeSelect
							id="crop-aspect"
							value={aspectKey}
							onChange={(e) => handleAspectChange(e.target.value)}
						>
							{Object.entries(ASPECT_RATIO_LABELS).map(([key, label]) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</NativeSelect>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex h-full min-h-110 flex-col items-center justify-center p-4">
					{!imgSrc ? (
						<ImageDropzone
							preview={null}
							isDragging={isDragging}
							onFile={handleFile}
							onClear={handleClear}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						/>
					) : (
						<div className="w-full flex justify-center overflow-hidden rounded-md border border-border bg-zinc-900">
							<ReactCrop
								crop={crop}
								onChange={(_, percentCrop) => setCrop(percentCrop)}
								onComplete={(c) => setCompletedCrop(c)}
								aspect={aspect}
								minWidth={50}
								minHeight={50}
							>
								{/* biome-ignore lint/performance/noImgElement: object URL */}
								<img
									ref={imgRef}
									alt="Imagem para recortar"
									src={imgSrc}
									onLoad={onImageLoad}
									style={{ maxWidth: "100%", maxHeight: "600px", display: "block" }}
								/>
							</ReactCrop>
						</div>
					)}
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					{!resultUrl ? (
						<div className="p-4">
							<p className="text-xs text-muted-foreground">
								Recorte a imagem para ver o resultado.
							</p>
						</div>
					) : (
						<div className="p-4 space-y-3">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Resultado
							</h3>
							<div className="flex justify-center rounded-md border border-border bg-card p-3">
								{/* biome-ignore lint/performance/noImgElement: blob URLs */}
								<img
									src={resultUrl}
									alt="Imagem recortada"
									className="max-h-48 max-w-full rounded object-contain"
								/>
							</div>
							<Button onClick={handleDownload} className="w-full">
								<FileDown className="h-4 w-4" />
								Baixar imagem
							</Button>
						</div>
					)}
				</div>
			}
		/>
	);
}
