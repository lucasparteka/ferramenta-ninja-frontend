"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { FaviconMode } from "@/lib/image/favicon";
import { FaviconShell } from "./favicon-shell";
import {
	ColorField,
	drawBackground,
	type Format,
	FormatField,
	LivePreview,
	ModeTabs,
	Section,
	SizeSlider,
} from "./shared-controls";

interface TextEditorProps {
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

const FONTS = [
	{ label: "Arial", value: "Arial, sans-serif", source: "system" },
	{ label: "Georgia", value: "Georgia, serif", source: "system" },
	{
		label: "Times New Roman",
		value: '"Times New Roman", serif',
		source: "system",
	},
	{ label: "Courier New", value: '"Courier New", monospace', source: "system" },
	{ label: "Verdana", value: "Verdana, sans-serif", source: "system" },
	{ label: "Impact", value: "Impact, sans-serif", source: "system" },
	{
		label: "Helvetica",
		value: "Helvetica, Arial, sans-serif",
		source: "system",
	},
	{ label: "Roboto", value: "Roboto, sans-serif", source: "google" },
	{ label: "Montserrat", value: "Montserrat, sans-serif", source: "google" },
	{ label: "Poppins", value: "Poppins, sans-serif", source: "google" },
	{ label: "Oswald", value: "Oswald, sans-serif", source: "google" },
	{ label: "Raleway", value: "Raleway, sans-serif", source: "google" },
	{ label: "Lato", value: "Lato, sans-serif", source: "google" },
	{ label: "Open Sans", value: '"Open Sans", sans-serif', source: "google" },
	{ label: "Bebas Neue", value: '"Bebas Neue", cursive', source: "google" },
	{
		label: "Playfair Display",
		value: '"Playfair Display", serif',
		source: "google",
	},
	{ label: "Ubuntu", value: "Ubuntu, sans-serif", source: "google" },
] as const;

const FONT_WEIGHTS = [
	{ value: 300, label: "Light" },
	{ value: 400, label: "Regular" },
	{ value: 500, label: "Medium" },
	{ value: 600, label: "Semi-Bold" },
	{ value: 700, label: "Bold" },
	{ value: 800, label: "Extra-Bold" },
	{ value: 900, label: "Black" },
];

const fontLoadPromises = new Map<string, Promise<void>>();

function loadGoogleFont(fontName: string): Promise<void> {
	const id = `gf-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
	if (fontLoadPromises.has(id)) return fontLoadPromises.get(id)!;
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
			} catch {}
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

interface DrawConfig {
	text: string;
	textColor: string;
	bgColor: string;
	format: Format;
	fontFamily: string;
	fontWeight: number;
	fontSizePercent: number;
}

function drawText(ctx: CanvasRenderingContext2D, size: number, c: DrawConfig) {
	ctx.clearRect(0, 0, size, size);
	drawBackground(ctx, size, c.bgColor, c.format);
	if (c.text) {
		ctx.fillStyle = c.textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const fontSize = Math.round((c.fontSizePercent / 100) * size);
		ctx.font = `${c.fontWeight} ${fontSize}px ${c.fontFamily}`;
		ctx.fillText(c.text, size / 2, size / 2 + fontSize * 0.05);
	}
}

export function TextEditor({
	mode,
	onChangeMode,
	onGenerate,
	footer,
}: TextEditorProps) {
	const [text, setText] = useState("A");
	const [textColor, setTextColor] = useState("#FFFFFF");
	const [bgColor, setBgColor] = useState("#3B82F6");
	const [fontFamily, setFontFamily] = useState<string>(FONTS[0].value);
	const [fontWeight, setFontWeight] = useState(700);
	const [fontSizePercent, setFontSizePercent] = useState(70);
	const [format, setFormat] = useState<Format>("square");
	const [fontLoading, setFontLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const loadIdRef = useRef(0);

	const handleFontChange = useCallback(async (value: string) => {
		const font = FONTS.find((f) => f.value === value);
		if (font?.source === "google") {
			const id = ++loadIdRef.current;
			setFontLoading(true);
			const name = font.value.split(",")[0].trim().replace(/['"]/g, "");
			await loadGoogleFont(name);
			if (loadIdRef.current === id) setFontLoading(false);
		} else {
			setFontLoading(false);
		}
		setFontFamily(value);
	}, []);

	const renderAtSize = useCallback(
		(size: number): HTMLCanvasElement => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawText(ctx, size, {
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

	const handleGenerate = useCallback(() => {
		setIsGenerating(true);
		setTimeout(() => {
			const canvas = renderAtSize(SOURCE_SIZE);
			setIsGenerating(false);
			onGenerate(canvas, renderAtSize);
		}, 200);
	}, [renderAtSize, onGenerate]);

	/* panes */

	const left = (
		<>
			<div className="p-4 border-b border-border">
				<ModeTabs value={mode} onChange={onChangeMode} />
			</div>

			<Section title="Texto">
				<Input
					id="favicon-text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Ex: A, AB, JS"
				/>
			</Section>

			<Section title="Tipografia">
				<div className="space-y-2">
					<NativeSelect
						value={fontFamily}
						onChange={(e) => handleFontChange(e.target.value)}
						className="w-full px-3 py-2 text-sm"
						aria-label="Família da fonte"
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
					<NativeSelect
						value={fontWeight}
						onChange={(e) => setFontWeight(Number(e.target.value))}
						className="w-full px-3 py-2 text-sm"
						aria-label="Peso da fonte"
					>
						{FONT_WEIGHTS.map((w) => (
							<option key={w.value} value={w.value}>
								{w.value} · {w.label}
							</option>
						))}
					</NativeSelect>
					{fontLoading && (
						<p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
							<RefreshCw className="h-3 w-3 animate-spin" />
							Carregando fonte...
						</p>
					)}
				</div>
			</Section>
		</>
	);

	const center = (
		<LivePreview
			render={renderAtSize}
			deps={[
				text,
				textColor,
				bgColor,
				format,
				fontFamily,
				fontWeight,
				fontSizePercent,
			]}
			bgTransparent={bgColor === "transparent"}
		/>
	);

	const right = (
		<>
			<Section title="Cor do texto">
				<ColorField
					value={textColor}
					onChange={setTextColor}
					allowTransparent={false}
				/>
			</Section>
			<Section title="Cor de fundo">
				<ColorField value={bgColor} onChange={setBgColor} />
			</Section>
			<Section title="Forma">
				<FormatField value={format} onChange={setFormat} />
			</Section>
			<Section title="Escala">
				<SizeSlider
					value={fontSizePercent}
					onChange={setFontSizePercent}
					min={20}
					max={90}
				/>
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
			canGenerate={!!text.trim() && !fontLoading}
			isGenerating={isGenerating}
		/>
	);
}
