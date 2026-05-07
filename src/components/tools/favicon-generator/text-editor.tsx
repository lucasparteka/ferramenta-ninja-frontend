"use client";

import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TextEditorProps {
	onGenerate: (
		canvas: HTMLCanvasElement,
		renderAtSize?: (
			size: number,
		) => HTMLCanvasElement | Promise<HTMLCanvasElement>,
	) => void;
	onBack: () => void;
}

interface DrawConfig {
	text: string;
	textColor: string;
	bgColor: string;
	format: "square" | "rounded" | "circle";
	fontFamily: string;
	fontWeight: number;
	fontSizePercent: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const FONTS = [
	/* system */
	{ label: "Arial", value: "Arial, sans-serif", source: "system" as const },
	{ label: "Georgia", value: "Georgia, serif", source: "system" as const },
	{
		label: "Times New Roman",
		value: '"Times New Roman", serif',
		source: "system" as const,
	},
	{
		label: "Courier New",
		value: '"Courier New", monospace',
		source: "system" as const,
	},
	{ label: "Verdana", value: "Verdana, sans-serif", source: "system" as const },
	{ label: "Impact", value: "Impact, sans-serif", source: "system" as const },
	{
		label: "Comic Sans MS",
		value: '"Comic Sans MS", cursive',
		source: "system" as const,
	},
	{
		label: "Helvetica",
		value: "Helvetica, Arial, sans-serif",
		source: "system" as const,
	},
	/* google */
	{ label: "Roboto", value: "Roboto, sans-serif", source: "google" as const },
	{
		label: "Montserrat",
		value: "Montserrat, sans-serif",
		source: "google" as const,
	},
	{ label: "Poppins", value: "Poppins, sans-serif", source: "google" as const },
	{ label: "Oswald", value: "Oswald, sans-serif", source: "google" as const },
	{ label: "Raleway", value: "Raleway, sans-serif", source: "google" as const },
	{ label: "Lato", value: "Lato, sans-serif", source: "google" as const },
	{
		label: "Open Sans",
		value: '"Open Sans", sans-serif',
		source: "google" as const,
	},
	{
		label: "Bebas Neue",
		value: '"Bebas Neue", cursive',
		source: "google" as const,
	},
	{
		label: "Playfair Display",
		value: '"Playfair Display", serif',
		source: "google" as const,
	},
	{ label: "Ubuntu", value: "Ubuntu, sans-serif", source: "google" as const },
];

const FONT_WEIGHTS = [
	{ value: 300, label: "Light (Fino)" },
	{ value: 400, label: "Regular (Normal)" },
	{ value: 500, label: "Medium (Médio)" },
	{ value: 600, label: "Semi-Bold (Semi-Negrito)" },
	{ value: 700, label: "Bold (Negrito)" },
	{ value: 800, label: "Extra-Bold (Extra-Negrito)" },
	{ value: 900, label: "Black (Preto)" },
];

const FORMATS = [
	{ label: "Quadrado", value: "square" },
	{ label: "Arredondado", value: "rounded" },
	{ label: "Redondo", value: "circle" },
];

const PREVIEW_SIZES = [16, 32, 48];
const SOURCE_SIZE = 512;

const COLORS_PRESETS = [
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

/* ------------------------------------------------------------------ */
/*  Google Font loader cache                                           */
/* ------------------------------------------------------------------ */

const fontLoadPromises = new Map<string, Promise<void>>();

function loadGoogleFont(fontName: string): Promise<void> {
	const id = `gf-${fontName.replace(/\s+/g, "-").toLowerCase()}`;

	if (fontLoadPromises.has(id)) {
		return fontLoadPromises.get(id)!;
	}

	const promise = new Promise<void>((resolve) => {
		if (document.getElementById(id)) {
			document.fonts.ready.then(() => resolve());
			return;
		}

		const link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;

		link.onload = async () => {
			try {
				await document.fonts.load(`700 12px "${fontName}"`);
			} catch {
				/* empty */
			}
			await document.fonts.ready;
			resolve();
		};

		link.onerror = () => resolve();
		document.head.appendChild(link);

		setTimeout(() => resolve(), 5000);
	});

	fontLoadPromises.set(id, promise);
	return promise;
}

/* ------------------------------------------------------------------ */
/*  Drawing helper                                                     */
/* ------------------------------------------------------------------ */

function drawFavicon(
	ctx: CanvasRenderingContext2D,
	size: number,
	config: DrawConfig,
) {
	ctx.clearRect(0, 0, size, size);

	/* background shape */
	if (config.bgColor !== "transparent") {
		ctx.fillStyle = config.bgColor;
		switch (config.format) {
			case "circle": {
				ctx.beginPath();
				ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
				ctx.fill();
				break;
			}
			case "rounded": {
				const r = Math.round(size * 0.2);
				ctx.beginPath();
				(
					ctx as CanvasRenderingContext2D & { roundRect?: typeof ctx.roundRect }
				).roundRect?.(0, 0, size, size, r);
				ctx.fill();
				break;
			}
			default: {
				ctx.fillRect(0, 0, size, size);
			}
		}
	}

	/* text */
	if (config.text) {
		ctx.fillStyle = config.textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const fontSize = Math.round((config.fontSizePercent / 100) * size);
		ctx.font = `${config.fontWeight} ${fontSize}px ${config.fontFamily}`;
		ctx.fillText(config.text, size / 2, size / 2 + fontSize * 0.05);
	}
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TextEditor({ onGenerate }: TextEditorProps) {
	const [text, setText] = useState("A");
	const [textColor, setTextColor] = useState("#FFFFFF");
	const [bgColor, setBgColor] = useState("#3B82F6");
	const [fontFamily, setFontFamily] = useState(FONTS[0].value);
	const [fontWeight, setFontWeight] = useState(700);
	const [fontSizePercent, setFontSizePercent] = useState(70);
	const [format, setFormat] = useState<"square" | "rounded" | "circle">(
		"square",
	);
	const [fontLoading, setFontLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);

	const loadIdRef = useRef(0);
	const preview16Ref = useRef<HTMLCanvasElement>(null);
	const preview32Ref = useRef<HTMLCanvasElement>(null);
	const preview48Ref = useRef<HTMLCanvasElement>(null);

	/* -- font change handler ------------------------------------------ */
	const handleFontChange = useCallback(async (value: string) => {
		const font = FONTS.find((f) => f.value === value);
		if (font?.source === "google") {
			const currentLoadId = ++loadIdRef.current;
			setFontLoading(true);
			const googleName = font.value.split(",")[0].trim();
			await loadGoogleFont(googleName);
			if (loadIdRef.current === currentLoadId) {
				setFontLoading(false);
			}
		} else {
			setFontLoading(false);
		}
		setFontFamily(value);
	}, []);

	/* -- draw previews ------------------------------------------------ */
	useEffect(() => {
		const config: DrawConfig = {
			text,
			textColor,
			bgColor,
			format,
			fontFamily,
			fontWeight,
			fontSizePercent,
		};

		const refs = [preview16Ref, preview32Ref, preview48Ref];
		PREVIEW_SIZES.forEach((size, i) => {
			const canvas = refs[i].current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			drawFavicon(ctx, size, config);
		});
	}, [
		text,
		textColor,
		bgColor,
		fontFamily,
		fontWeight,
		fontSizePercent,
		format,
	]);

	/* -- render at any size (native, no scaling) ---------------------- */
	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawFavicon(ctx, size, {
					text,
					textColor,
					bgColor,
					format,
					fontFamily,
					fontWeight,
					fontSizePercent,
				});
			}
			return canvas;
		},
		[text, textColor, bgColor, format, fontFamily, fontWeight, fontSizePercent],
	);

	/* -- generate source canvas --------------------------------------- */
	function handleGenerate() {
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

			drawFavicon(ctx, SOURCE_SIZE, {
				text,
				textColor,
				bgColor,
				format,
				fontFamily,
				fontWeight,
				fontSizePercent,
			});

			onGenerate(canvas, renderAtSize);
			setIsGenerating(false);
		}, 200);
	}

	/* -- color input helpers ------------------------------------------ */
	function handleBgTextChange(value: string) {
		const v = value.trim();
		if (v.toLowerCase() === "transparent") {
			setBgColor("transparent");
		} else if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
			setBgColor(v);
		}
	}

	/* ---------------------------------------------------------------- */
	return (
		<motion.div
			initial={{ opacity: 0, x: 40 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -40 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			{/* Header */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold tracking-tight">Texto → Favicon</h2>
				<p className="text-muted-foreground mt-1">
					Crie um favicon a partir de texto com fontes e cores personalizadas.
				</p>
			</div>

			{/* 3 mini previews */}
			<div className="mb-8 flex justify-center gap-6">
				{[
					{ size: 16, ref: preview16Ref },
					{ size: 32, ref: preview32Ref },
					{ size: 48, ref: preview48Ref },
				].map(({ size, ref }) => (
					<div key={size} className="text-center">
						<div className="relative inline-block overflow-hidden">
							<canvas
								ref={ref}
								width={size}
								height={size}
								className="block"
								style={{
									width: size,
									height: size,
									imageRendering: size <= 16 ? "pixelated" : "auto",
								}}
								aria-label={`Prévia ${size}×${size}`}
							/>
						</div>
						<span className="mt-1 block text-xs text-muted-foreground font-mono">
							{size}×{size}
						</span>
					</div>
				))}
			</div>

			{/* Controls grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				{/* Texto */}
				<div>
					<label
						htmlFor="favicon-text"
						className="mb-1.5 block text-sm font-medium"
					>
						Texto
					</label>
					<Input
						id="favicon-text"
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="w-full"
						placeholder="Ex: AB"
					/>
				</div>

				{/* Fonte */}
				<div>
					<label
						htmlFor="favicon-font"
						className="mb-1.5 block text-sm font-medium"
					>
						Fonte
					</label>
					<NativeSelect
						id="favicon-font"
						value={fontFamily}
						onChange={(e) => handleFontChange(e.target.value)}
						className="w-full px-3 py-2 text-sm"
					>
						<optgroup label="Sistema">
							{FONTS.filter((f) => f.source === "system").map((f) => (
								<option key={f.value} value={f.value}>
									{f.label}
								</option>
							))}
						</optgroup>
						<optgroup label="Google Fonts">
							{FONTS.filter((f) => f.source === "google").map((f) => (
								<option key={f.value} value={f.value}>
									{f.label}
								</option>
							))}
						</optgroup>
					</NativeSelect>
					{fontLoading && (
						<RefreshCw className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
					)}
				</div>

				{/* Peso */}
				<div>
					<label
						htmlFor="favicon-weight"
						className="mb-1.5 block text-sm font-medium"
					>
						Peso da Fonte
					</label>
					<NativeSelect
						id="favicon-weight"
						value={fontWeight}
						onChange={(e) => setFontWeight(Number(e.target.value))}
						className="w-full px-3 py-2 text-sm"
					>
						{FONT_WEIGHTS.map((w) => (
							<option key={w.value} value={w.value}>
								{w.label}
							</option>
						))}
					</NativeSelect>
				</div>

				{/* Tamanho */}
				<div>
					<label
						htmlFor="favicon-size"
						className="mb-1.5 block text-sm font-medium"
					>
						Tamanho do Texto: {fontSizePercent}%
					</label>
					<input
						id="favicon-size"
						type="range"
						min={20}
						max={90}
						value={fontSizePercent}
						onChange={(e) => setFontSizePercent(Number(e.target.value))}
						className="w-full accent-primary mt-3"
					/>
				</div>
				<div>
					<span className="mb-1.5 block text-sm font-medium">Formato</span>
					<OptionSwitch
						options={FORMATS}
						value={format}
						onChange={(v) => setFormat(v as "square" | "rounded" | "circle")}
					/>
				</div>
			</div>

			{/* Color cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{/* Cor do Texto */}
				<div className="rounded-xl border bg-card p-4">
					<label
						htmlFor="favicon-text-color"
						className="mb-2 block text-sm font-medium"
					>
						Cor do Texto
					</label>
					<div className="flex items-center gap-2 mb-3">
						<input
							id="favicon-text-color"
							type="color"
							value={textColor}
							onChange={(e) => setTextColor(e.target.value)}
							className="h-10 w-10 cursor-pointer rounded-md border-0 p-0 shrink-0"
							aria-label="Cor do texto"
						/>
						<input
							type="text"
							value={textColor}
							onChange={(e) => {
								const v = e.target.value.trim();
								if (v.toLowerCase() === "transparent") {
									setTextColor("transparent");
								} else if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
									setTextColor(v);
								}
							}}
							className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm font-mono"
							placeholder="#FFFFFF ou transparent"
						/>
					</div>
					<div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1">
						{COLORS_PRESETS.map((c) => (
							<button
								type="button"
								key={c}
								onClick={() => setTextColor(c)}
								title={c}
								className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring ${
									textColor.toLowerCase() === c.toLowerCase()
										? "border-primary scale-110"
										: "border"
								}`}
								style={{ backgroundColor: c }}
								aria-label={`Cor ${c}`}
							/>
						))}
					</div>
				</div>

				{/* Cor de Fundo */}
				<div className="rounded-xl border bg-card p-4">
					<label
						htmlFor="favicon-bg-color"
						className="mb-2 block text-sm font-medium"
					>
						Cor de Fundo
					</label>
					<div className="flex items-center gap-2 mb-3">
						<input
							id="favicon-bg-color"
							type="color"
							value={bgColor === "transparent" ? "#3B82F6" : bgColor}
							onChange={(e) => setBgColor(e.target.value)}
							className="h-10 w-10 cursor-pointer rounded-md border-0 p-0 shrink-0"
							aria-label="Cor de fundo"
						/>
						<input
							type="text"
							value={bgColor}
							onChange={(e) => handleBgTextChange(e.target.value)}
							className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm font-mono"
							placeholder="#3B82F6 ou transparent"
						/>
					</div>
					<div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1">
						{COLORS_PRESETS.map((c) => (
							<button
								type="button"
								key={c}
								onClick={() => setBgColor(c)}
								title={c}
								className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring ${
									bgColor.toLowerCase() === c.toLowerCase()
										? "border-primary scale-110"
										: "border"
								}`}
								style={{ backgroundColor: c }}
								aria-label={`Cor ${c}`}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Generate */}
			<div className="flex justify-center">
				<Button
					onClick={handleGenerate}
					disabled={!text.trim() || fontLoading || isGenerating}
					className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Gerando...
						</>
					) : (
						"Gerar Favicon"
					)}
				</Button>
			</div>
		</motion.div>
	);
}
