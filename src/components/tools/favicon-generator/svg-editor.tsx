"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Upload,
	FileCode,
	AlertTriangle,
	RefreshCw,
	Wand2,
	Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionSwitch } from "@/components/shared/option-switch";

interface SvgEditorProps {
	onGenerate: (canvas: HTMLCanvasElement) => void;
	onBack: () => void;
}

const PREVIEW_SIZE = 320;
const SOURCE_SIZE = 512;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB para SVG

function prepareSvgForCanvas(svgString: string): string {
	let s = svgString.trim();

	// Garante xmlns
	if (!s.includes("xmlns=")) {
		s = s.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	// Se não tiver width/height no tag svg raiz, injeta 512x512
	const svgTagMatch = s.match(/<svg\s([^>]*)>/i);
	if (svgTagMatch) {
		const attrs = svgTagMatch[1];
		const hasWidth = /\bwidth\s*=/.test(attrs);
		const hasHeight = /\bheight\s*=/.test(attrs);
		if (!hasWidth || !hasHeight) {
			const extra: string[] = [];
			if (!hasWidth) extra.push('width="512"');
			if (!hasHeight) extra.push('height="512"');
			s = s.replace(/<svg\s[^>]*>/i, (m) =>
				m.replace(/\/?>$/, ` ${extra.join(" ")}>`),
			);
		}
	}

	return s;
}

function svgToCanvas(
	svgString: string,
	size: number,
): Promise<HTMLCanvasElement> {
	return new Promise((resolve, reject) => {
		const sanitized = prepareSvgForCanvas(svgString);
		const blob = new Blob([sanitized], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);

		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(new Error("Canvas 2D não disponível"));
				return;
			}
			ctx.clearRect(0, 0, size, size);
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url);
			resolve(canvas);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Não foi possível renderizar o SVG"));
		};
		img.src = url;
	});
}

export function SvgEditor({ onGenerate, onBack }: SvgEditorProps) {
	const [tab, setTab] = useState<"file" | "code">("file");
	const [svgString, setSvgString] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [codeValue, setCodeValue] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);

	const drawPreview = useCallback(async (source: string) => {
		try {
			const canvas = await svgToCanvas(source, PREVIEW_SIZE);
			const previewCanvas = previewCanvasRef.current;
			if (!previewCanvas) return;
			previewCanvas.width = PREVIEW_SIZE;
			previewCanvas.height = PREVIEW_SIZE;
			const ctx = previewCanvas.getContext("2d");
			if (ctx) {
				// Fundo xadrez para transparência
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
				ctx.drawImage(canvas, 0, 0);
			}
		} catch {
			setError("Erro ao renderizar preview do SVG.");
		}
	}, []);

	const validateSvg = useCallback((text: string): boolean => {
		const trimmed = text.trim();
		if (!trimmed) return false;
		if (!/^\s*<svg\b/i.test(trimmed)) {
			setError('Código inválido. O SVG deve começar com "<svg".');
			return false;
		}
		setError(null);
		return true;
	}, []);

	const handleSvgLoaded = useCallback(
		async (text: string) => {
			if (!validateSvg(text)) {
				setSvgString(null);
				return;
			}
			setSvgString(text);
			await drawPreview(text);
		},
		[validateSvg, drawPreview],
	);

	const handleFile = useCallback(
		(file: File) => {
			setError(null);
			if (file.size > MAX_FILE_SIZE) {
				setError("Arquivo muito grande. Tamanho máximo: 2MB.");
				return;
			}
			setIsLoading(true);
			const reader = new FileReader();
			reader.onload = async (e) => {
				const text = String(e.target?.result || "");
				await handleSvgLoaded(text);
				setIsLoading(false);
			};
			reader.onerror = () => {
				setError("Erro ao ler o arquivo.");
				setIsLoading(false);
			};
			reader.readAsText(file);
		},
		[handleSvgLoaded],
	);

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

	const handleCodeChange = useCallback(
		async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setCodeValue(value);
			if (validateSvg(value)) {
				setSvgString(value);
				await drawPreview(value);
			} else {
				setSvgString(null);
				// Limpa preview
				const c = previewCanvasRef.current;
				if (c) {
					const ctx = c.getContext("2d");
					if (ctx) ctx.clearRect(0, 0, c.width, c.height);
				}
			}
		},
		[validateSvg, drawPreview],
	);

	const handleReset = useCallback(() => {
		setSvgString(null);
		setError(null);
		setCodeValue("");
		const c = previewCanvasRef.current;
		if (c) {
			const ctx = c.getContext("2d");
			if (ctx) ctx.clearRect(0, 0, c.width, c.height);
		}
	}, []);

	const handleGenerateClick = useCallback(async () => {
		if (!svgString) return;
		setIsLoading(true);
		try {
			const canvas = await svgToCanvas(svgString, SOURCE_SIZE);
			onGenerate(canvas);
		} catch {
			setError("Erro ao gerar favicon a partir do SVG.");
		} finally {
			setIsLoading(false);
		}
	}, [svgString, onGenerate]);

	// Re-renderiza preview ao trocar de aba se já houver svg válido
	useEffect(() => {
		if (svgString) {
			drawPreview(svgString);
		}
	}, [svgString, drawPreview]);

	const tabs = [
		{ label: "Arquivo", value: "file" },
		{ label: "Código", value: "code" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h2 className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
					SVG → Favicon
				</h2>
				<p className="text-muted-foreground">
					Envie um arquivo SVG ou cole o código para convertê-lo em favicon.
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

			{/* Tabs */}
			<OptionSwitch
				options={tabs}
				value={tab}
				onChange={(v) => setTab(v as "file" | "code")}
			/>

			<AnimatePresence mode="wait">
				{tab === "file" && !svgString ? (
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
									? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
									: "border-border hover:border-purple-400/50 hover:bg-muted/30"
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
							aria-label="Área de upload de SVG"
						>
							<input
								ref={fileInputRef}
								type="file"
								accept=".svg,image/svg+xml"
								className="hidden"
								onChange={handleInputChange}
								aria-label="Selecionar arquivo SVG"
							/>
							<div className="flex flex-col items-center gap-3">
								<div
									className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
										isDragging
											? "bg-purple-600 text-white"
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
												? "Solte o SVG aqui"
												: "Clique ou arraste um arquivo SVG"}
									</p>
									<p className="text-xs text-muted-foreground">
										SVG · Máx. 2MB
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				) : tab === "code" && !svgString ? (
					<motion.div
						key="code-input"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.25 }}
						className="space-y-3"
					>
						<div className="relative">
							<Code2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<textarea
								value={codeValue}
								onChange={handleCodeChange}
								placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
								rows={8}
								className="w-full rounded-xl border bg-card p-3 pl-9 font-mono text-sm text-card-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
								aria-label="Código SVG"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Cole o código SVG completo. O preview aparecerá automaticamente se
							o código for válido.
						</p>
					</motion.div>
				) : null}
			</AnimatePresence>

			{/* Preview + Actions */}
			<AnimatePresence>
				{svgString && (
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
										aria-label="Preview do favicon SVG"
									/>
									<div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
										1:1
									</div>
								</div>

								<p className="text-xs text-muted-foreground">
									Preview em {PREVIEW_SIZE}×{PREVIEW_SIZE}px · O SVG será
									renderizado em quadrado para o favicon.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button variant="outline" onClick={handleReset}>
								<FileCode className="mr-1.5 h-4 w-4" />
								Trocar SVG
							</Button>
							<Button
								onClick={handleGenerateClick}
								disabled={isLoading}
								className="gap-1.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
							>
								{isLoading ? (
									<RefreshCw className="h-4 w-4 animate-spin" />
								) : (
									<Wand2 className="h-4 w-4" />
								)}
								Gerar Favicon
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
