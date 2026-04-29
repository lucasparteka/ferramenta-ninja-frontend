"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
	centerCrop,
	makeAspectCrop,
	type Crop,
	type PixelCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImgFromElement } from "@/utils/image";

const ASPECT_RATIOS: Record<string, number | undefined> = {
	free: undefined,
	"1:1": 1,
	"16:9": 16 / 9,
	"4:3": 4 / 3,
	"3:2": 3 / 2,
};

function buildCenterAspectCrop(
	width: number,
	height: number,
	aspect: number,
) {
	return centerCrop(
		makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
		width,
		height,
	);
}

export function ImageCropper() {
	const [imgSrc, setImgSrc] = useState<string>("");
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const [aspectKey, setAspectKey] = useState("free");
	const [resultUrl, setResultUrl] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const imgRef = useRef<HTMLImageElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const aspect = ASPECT_RATIOS[aspectKey];

	function handleFile(f: File) {
		if (!f.type.startsWith("image/")) return;
		const url = URL.createObjectURL(f);
		setImgSrc(url);
		setResultUrl(null);
		setCrop(undefined);
		setCompletedCrop(null);
	}

	function handleClear() {
		if (imgSrc) URL.revokeObjectURL(imgSrc);
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		setImgSrc("");
		setResultUrl(null);
		setCrop(undefined);
		setCompletedCrop(null);
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const { width, height } = e.currentTarget;
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
			const fileType = imgSrc.startsWith("blob:")
				? "image/png"
				: "image/jpeg";
			const blob = await getCroppedImgFromElement(
				imgRef.current,
				completedCrop,
				fileType as "image/png" | "image/jpeg",
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

	function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0];
		if (f) handleFile(f);
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
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				{/* Upload area */}
				{!imgSrc && (
					<div className="space-y-2">
						<p className="text-sm font-medium text-foreground">
							Selecione uma imagem
						</p>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary transition-colors hover:border-primary hover:bg-primary/5"
						>
							<Upload className="h-8 w-8 text-muted-foreground" />
							<p className="text-sm font-medium text-foreground">
								Clique ou arraste uma imagem
							</p>
							<p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
						</button>
						<input
							ref={inputRef}
							type="file"
							accept="image/png,image/jpeg,image/webp"
							onChange={handleFileInput}
							className="hidden"
						/>
					</div>
				)}

				{/* Editor */}
				{imgSrc && (
					<>
						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">Proporção</p>
							<div className="flex flex-wrap gap-2">
								{Object.keys(ASPECT_RATIOS).map((key) => (
									<button
										key={key}
										type="button"
										onClick={() => handleAspectChange(key)}
										className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
											aspectKey === key
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
										}`}
									>
										{key === "free"
											? "Livre"
											: key === "1:1"
												? "1:1 Quadrado"
												: key === "16:9"
													? "16:9 Widescreen"
													: key === "4:3"
														? "4:3 Padrão"
														: "3:2 Foto"}
									</button>
								))}
							</div>
						</div>

						<div className="rounded-lg border-2 border-dashed border-primary/40 bg-muted p-3">
							<p className="mb-2 text-center text-xs text-muted-foreground">
								Arraste as bordas ou o centro da área de corte para ajustar.
							</p>
						<div className="flex justify-center overflow-hidden rounded-md border border-border bg-zinc-900">
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
									style={{ maxWidth: "100%", maxHeight: "60vh", display: "block" }}
								/>
							</ReactCrop>
						</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button
								onClick={handleCrop}
								disabled={isProcessing || !completedCrop}
							>
								{isProcessing ? "Processando..." : "Recortar"}
							</Button>
							<Button
								variant="outline"
								onClick={handleDownload}
								disabled={!resultUrl}
							>
								<Download className="mr-2 h-4 w-4" />
								Baixar
							</Button>
							<Button variant="ghost" onClick={handleClear}>
								<RotateCcw className="mr-2 h-4 w-4" />
								Reiniciar
							</Button>
						</div>
					</>
				)}

				{/* Resultado */}
				{resultUrl && (
					<div className="space-y-2">
						<p className="text-sm font-medium text-foreground">Resultado</p>
						<div className="flex justify-center rounded-lg border border-border bg-card p-4">
							{/* biome-ignore lint/performance/noImgElement: blob URLs */}
							<img
								src={resultUrl}
								alt="Imagem recortada"
								className="max-h-64 max-w-full rounded object-contain"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
