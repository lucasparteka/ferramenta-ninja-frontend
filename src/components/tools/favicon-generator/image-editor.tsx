"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Upload,
	ImageIcon,
	AlertTriangle,
	RefreshCw,
	Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageEditorProps {
	onGenerate: (canvas: HTMLCanvasElement) => void;
	onBack: () => void;
}

const PREVIEW_SIZE = 320;
const SOURCE_SIZE = 512;

export function ImageEditor({ onGenerate, onBack }: ImageEditorProps) {
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const drawToCanvases = useCallback((img: HTMLImageElement) => {
		// Canvas de preview visível (320x320)
		const previewCanvas = previewCanvasRef.current;
		if (previewCanvas) {
			previewCanvas.width = PREVIEW_SIZE;
			previewCanvas.height = PREVIEW_SIZE;
			const ctx = previewCanvas.getContext("2d");
			if (ctx) {
				// Fundo transparente (checkered pattern)
				ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
				ctx.fillStyle = "rgba(0,0,0,0.05)";
				const sq = 16;
				for (let y = 0; y < PREVIEW_SIZE; y += sq) {
					for (let x = 0; x < PREVIEW_SIZE; x += sq) {
						if ((x / sq + y / sq) % 2 === 0) {
							ctx.fillRect(x, y, sq, sq);
						}
					}
				}
				// Cover centralizado
				const scale = Math.max(
					PREVIEW_SIZE / img.naturalWidth,
					PREVIEW_SIZE / img.naturalHeight,
				);
				const dw = img.naturalWidth * scale;
				const dh = img.naturalHeight * scale;
				const dx = (PREVIEW_SIZE - dw) / 2;
				const dy = (PREVIEW_SIZE - dh) / 2;
				ctx.drawImage(img, dx, dy, dw, dh);
			}
		}

		// Canvas fonte invisível (512x512) para geração
		const sourceCanvas = document.createElement("canvas");
		sourceCanvas.width = SOURCE_SIZE;
		sourceCanvas.height = SOURCE_SIZE;
		const sCtx = sourceCanvas.getContext("2d");
		if (sCtx) {
			sCtx.clearRect(0, 0, SOURCE_SIZE, SOURCE_SIZE);
			const scale = Math.max(
				SOURCE_SIZE / img.naturalWidth,
				SOURCE_SIZE / img.naturalHeight,
			);
			const dw = img.naturalWidth * scale;
			const dh = img.naturalHeight * scale;
			const dx = (SOURCE_SIZE - dw) / 2;
			const dy = (SOURCE_SIZE - dh) / 2;
			sCtx.drawImage(img, dx, dy, dw, dh);
		}
		sourceCanvasRef.current = sourceCanvas;
	}, []);

	const handleFile = useCallback(
		(file: File) => {
			setError(null);
			if (!file.type.startsWith("image/")) {
				setError(
					"Por favor, envie um arquivo de imagem (PNG, JPG, WebP, etc.)",
				);
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
					setImage(img);
					drawToCanvases(img);
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
		},
		[drawToCanvases],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
			// Reseta o input para permitir re-selecionar o mesmo arquivo
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
		setImage(null);
		setError(null);
		sourceCanvasRef.current = null;
		const canvas = previewCanvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}, []);

	const handleGenerateClick = useCallback(() => {
		if (sourceCanvasRef.current) {
			onGenerate(sourceCanvasRef.current);
		}
	}, [onGenerate]);

	// Atualiza preview se a imagem mudar (ex: ao voltar do preview)
	useEffect(() => {
		if (image) {
			drawToCanvases(image);
		}
	}, [image, drawToCanvases]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h2 className="text-2xl font-bold tracking-tight">Imagem → Favicon</h2>
				<p className="text-muted-foreground">
					Envie uma imagem e nós convertemos em todos os tamanhos de favicon.
				</p>
			</div>

			{/* Error */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
							<AlertTriangle className="h-4 w-4 shrink-0" />
							{error}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Upload / Preview */}
			<AnimatePresence mode="wait">
				{!image ? (
					<motion.div
						key="upload"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.25 }}
					>
						<div
							className={`relative cursor-pointer rounded-xl border-2 border-dashed bg-card p-8 text-center text-card-foreground shadow transition-colors ${
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
									<p className="font-medium">
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
					</motion.div>
				) : (
					<motion.div
						key="preview"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.25 }}
						className="space-y-4"
					>
						<div className="overflow-hidden rounded-xl border bg-card p-4 text-card-foreground shadow">
							<div className="flex flex-col items-center gap-4">
								<div className="relative">
									<canvas
										ref={previewCanvasRef}
										width={PREVIEW_SIZE}
										height={PREVIEW_SIZE}
										className="h-auto max-w-full rounded-lg border shadow-sm"
										style={{
											maxHeight: 320,
											width: "100%",
											aspectRatio: "1",
										}}
										aria-label="Preview do favicon"
									/>
									<div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
										1:1
									</div>
								</div>

								<p className="text-xs text-muted-foreground">
									Preview em {PREVIEW_SIZE}×{PREVIEW_SIZE}px · A imagem será
									cortada centralmente para caber no quadrado.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button variant="outline" onClick={handleReset}>
								<ImageIcon className="mr-1.5 h-4 w-4" />
								Trocar imagem
							</Button>
							<Button onClick={handleGenerateClick} className="gap-1.5">
								<Wand2 className="h-4 w-4" />
								Gerar Favicon
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
