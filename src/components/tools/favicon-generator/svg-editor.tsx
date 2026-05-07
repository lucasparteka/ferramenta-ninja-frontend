"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
	AlertTriangle,
	ArrowLeft,
	Code2,
	Loader2,
	RefreshCw,
	Upload,
	Wand2,
} from "lucide-react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";

interface SvgEditorProps {
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
const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

function stripSvgPreamble(text: string): string {
	return text
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<\?[\s\S]*?\?>/g, "")
		.replace(/<!DOCTYPE\s[^>]*>/gi, "")
		.trim();
}

function prepareSvgForCanvas(svgString: string): string {
	let s = svgString.trim();
	s = stripSvgPreamble(s);

	if (!s.includes("xmlns=")) {
		s = s.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
	}

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

function loadSvgImage(svgString: string): Promise<HTMLImageElement> {
	const sanitized = prepareSvgForCanvas(svgString);
	const blob = new Blob([sanitized], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve(img);
			URL.revokeObjectURL(url);
		};
		img.onerror = () => {
			reject(new Error("Não foi possível renderizar o SVG"));
			URL.revokeObjectURL(url);
		};
		img.src = url;
	});
}

async function renderSvgAtSize(
	svgString: string,
	size: number,
	format: (typeof FORMATS)[number]["value"],
	mediaSize: number,
	bgColor: string,
): Promise<HTMLCanvasElement> {
	const img = await loadSvgImage(svgString);

	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;

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

	return canvas;
}

export function SvgEditor({ onGenerate, onBack }: SvgEditorProps) {
	const [tab, setTab] = useState<"file" | "code">("file");
	const [svgString, setSvgString] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [codeValue, setCodeValue] = useState("");
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

	const validateSvg = useCallback((text: string): boolean => {
		const trimmed = text.trim();
		if (!trimmed) return false;
		const stripped = stripSvgPreamble(trimmed);
		if (!/^\s*<svg\b/i.test(stripped)) {
			setError(
				"Código inválido. O documento não contém um elemento <svg> válido.",
			);
			return false;
		}
		setError(null);
		return true;
	}, []);

	const handleFile = useCallback(
		(file: File) => {
			setError(null);
			if (file.size > MAX_FILE_SIZE) {
				setError("Arquivo muito grande. Tamanho máximo: 2MB.");
				return;
			}
			setIsLoading(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = String(e.target?.result || "");
				if (!validateSvg(text)) {
					setIsLoading(false);
					return;
				}
				setSvgString(text);
				setCodeValue(text);
				setTab("code");
				setIsLoading(false);
			};
			reader.onerror = () => {
				setError("Erro ao ler o arquivo.");
				setIsLoading(false);
			};
			reader.readAsText(file);
		},
		[validateSvg],
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
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setCodeValue(value);
			if (validateSvg(value)) {
				setSvgString(value);
			} else {
				setSvgString(null);
			}
		},
		[validateSvg],
	);

	const handleBgTextChange = useCallback((value: string) => {
		const v = value.trim();
		if (v.toLowerCase() === "transparent") {
			setBgColor("transparent");
		} else if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
			setBgColor(v);
		}
	}, []);

	const renderAtSize = useCallback(
		(size: number): Promise<HTMLCanvasElement> => {
			if (!svgString) {
				const c = document.createElement("canvas");
				c.width = size;
				c.height = size;
				return Promise.resolve(c);
			}
			return renderSvgAtSize(svgString, size, format, mediaSize, bgColor);
		},
		[svgString, format, mediaSize, bgColor],
	);

	const handleGenerate = useCallback(async () => {
		if (!svgString) return;
		setIsGenerating(true);
		try {
			const canvas = await renderSvgAtSize(
				svgString,
				SOURCE_SIZE,
				format,
				mediaSize,
				bgColor,
			);
			onGenerate(canvas, renderAtSize);
		} catch {
			setError("Erro ao gerar favicon.");
		} finally {
			setIsGenerating(false);
		}
	}, [svgString, format, mediaSize, bgColor, onGenerate, renderAtSize]);

	useEffect(() => {
		if (!svgString) return;
		let cancelled = false;
		(async () => {
			const canvas = previewCanvasRef.current;
			if (!canvas) return;
			const rendered = await renderSvgAtSize(
				svgString,
				PREVIEW_SIZE,
				format,
				mediaSize,
				bgColor,
			);
			if (cancelled) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			canvas.width = PREVIEW_SIZE;
			canvas.height = PREVIEW_SIZE;
			ctx.drawImage(rendered, 0, 0);
		})();
		return () => {
			cancelled = true;
		};
	}, [svgString, format, mediaSize, bgColor]);

	useEffect(() => {
		if (!svgString) return;
		let cancelled = false;
		(async () => {
			const sizes = [16, 32, 48];
			const refs = [mini16Ref, mini32Ref, mini48Ref];
			const results = await Promise.all(
				sizes.map((size) =>
					renderSvgAtSize(svgString, size, format, mediaSize, bgColor),
				),
			);
			if (cancelled) return;
			results.forEach((rendered, i) => {
				const canvas = refs[i].current;
				if (!canvas) return;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				canvas.width = sizes[i];
				canvas.height = sizes[i];
				ctx.drawImage(rendered, 0, 0);
			});
		})();
		return () => {
			cancelled = true;
		};
	}, [svgString, format, mediaSize, bgColor]);

	const tabs = [
		{ label: "Arquivo", value: "file" },
		{ label: "Código", value: "code" },
	];

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
					<Code2 className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						SVG → Favicon
					</h2>
					<p className="text-sm text-muted-foreground">
						Envie um arquivo SVG ou cole o código para convertê-lo em favicon.
					</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card p-5">
				<OptionSwitch
					options={tabs}
					value={tab}
					onChange={(v) => setTab(v as "file" | "code")}
				/>

				<div className="mt-5">
					{tab === "file" && (
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
												? "Solte o SVG aqui"
												: "Clique ou arraste um arquivo SVG"}
									</p>
									<p className="text-xs text-muted-foreground">
										SVG · Máx. 2MB
									</p>
								</div>
							</div>
						</div>
					)}

					{tab === "code" && (
						<div className="space-y-3">
							<div className="relative">
								<Code2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<textarea
									value={codeValue}
									onChange={handleCodeChange}
									placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
									rows={8}
									className="w-full rounded-xl border bg-card p-3 pl-9 font-mono text-sm text-card-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
									aria-label="Código SVG"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								Cole o código SVG completo. O preview será atualizado
								automaticamente a partir do código válido.
							</p>
						</div>
					)}
				</div>
			</div>

			{svgString && !error && (
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
								htmlFor="svg-bg-hex"
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
									id="svg-bg-hex"
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
									htmlFor="svg-media-size"
									className="text-sm font-medium text-foreground"
								>
									Tamanho do SVG
								</label>
								<span className="text-xs font-medium text-muted-foreground">
									{mediaSize}%
								</span>
							</div>
							<input
								id="svg-media-size"
								type="range"
								min={40}
								max={100}
								value={mediaSize}
								onChange={(e) => setMediaSize(Number(e.target.value))}
								className="w-full accent-primary"
								aria-label="Tamanho do SVG"
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
