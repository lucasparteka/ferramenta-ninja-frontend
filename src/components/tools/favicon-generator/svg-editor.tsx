"use client";

import { Code2, RefreshCw, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { OptionSwitch } from "@/components/shared/option-switch";
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

interface SvgEditorProps {
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
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function stripSvgPreamble(text: string): string {
	return text
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<\?[\s\S]*?\?>/g, "")
		.replace(/<!DOCTYPE\s[^>]*>/gi, "")
		.trim();
}

function prepareSvgForCanvas(svgString: string): string {
	let s = stripSvgPreamble(svgString.trim());
	if (!s.includes("xmlns=")) {
		s = s.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
	}
	const m = s.match(/<svg\s([^>]*)>/i);
	if (m) {
		const attrs = m[1];
		const hasW = /\bwidth\s*=/.test(attrs);
		const hasH = /\bheight\s*=/.test(attrs);
		if (!hasW || !hasH) {
			const extra: string[] = [];
			if (!hasW) extra.push('width="512"');
			if (!hasH) extra.push('height="512"');
			s = s.replace(/<svg\s[^>]*>/i, (mm) =>
				mm.replace(/\/?>$/, ` ${extra.join(" ")}>`),
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
	format: Format,
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
	drawBackground(ctx, size, bgColor, format);
	clipFormat(ctx, size, format);
	const target = size * (mediaSize / 100);
	const scale = Math.min(target / img.naturalWidth, target / img.naturalHeight);
	const dw = img.naturalWidth * scale;
	const dh = img.naturalHeight * scale;
	ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
	if (format !== "square") ctx.restore();
	return canvas;
}

export function SvgEditor({
	mode,
	onChangeMode,
	onGenerate,
	footer,
}: SvgEditorProps) {
	const [tab, setTab] = useState<"file" | "code">("file");
	const [svgString, setSvgString] = useState<string | null>(null);
	const [codeValue, setCodeValue] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [format, setFormat] = useState<Format>("square");
	const [mediaSize, setMediaSize] = useState(80);
	const [bgColor, setBgColor] = useState("transparent");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validate = useCallback((text: string): boolean => {
		const t = text.trim();
		if (!t) return false;
		if (!/^\s*<svg\b/i.test(stripSvgPreamble(t))) {
			setError("Código inválido. Documento sem elemento <svg>.");
			return false;
		}
		setError(null);
		return true;
	}, []);

	const handleFile = useCallback(
		(file: File) => {
			setError(null);
			if (file.size > MAX_FILE_SIZE) {
				setError("Arquivo muito grande. Máx. 2MB.");
				return;
			}
			setIsLoading(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = String(e.target?.result || "");
				if (!validate(text)) {
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
		[validate],
	);

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

	/* panes */

	const left = (
		<>
			<div className="p-4 border-b border-border">
				<ModeTabs value={mode} onChange={onChangeMode} />
			</div>

			<Section title="Origem do SVG">
				<OptionSwitch
					options={[
						{ label: "Arquivo", value: "file" },
						{ label: "Código", value: "code" },
					]}
					value={tab}
					onChange={(v) => setTab(v as "file" | "code")}
				/>

				{tab === "file" && (
					// biome-ignore lint/a11y/useSemanticElements: .
					<div
						className={cn(
							"mt-3 cursor-pointer rounded-lg border border-dashed p-5 text-center transition-colors",
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
							accept=".svg,image/svg+xml"
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
							<p className="text-xs font-medium text-foreground">
								{isLoading
									? "Carregando..."
									: isDragging
										? "Solte o SVG"
										: "Clique ou arraste"}
							</p>
							<p className="text-[10px] text-muted-foreground">SVG · 2MB</p>
						</div>
					</div>
				)}

				{tab === "code" && (
					<div className="relative mt-3">
						<Code2 className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
						<textarea
							value={codeValue}
							onChange={(e) => {
								const v = e.target.value;
								setCodeValue(v);
								if (validate(v)) setSvgString(v);
								else setSvgString(null);
							}}
							placeholder='<svg xmlns="..." viewBox="0 0 100 100">...</svg>'
							rows={9}
							className="w-full rounded-lg border bg-background p-2.5 pl-7 font-mono text-caption text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
						/>
					</div>
				)}
			</Section>
		</>
	);

	const center = (
		<LivePreview
			render={svgString ? renderAtSize : null}
			deps={[svgString, format, mediaSize, bgColor]}
			bgTransparent={bgColor === "transparent"}
			empty={
				<p className="text-sm text-muted-foreground">
					Envie ou cole um SVG à esquerda para começar
				</p>
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
			canGenerate={!!svgString}
			isGenerating={isGenerating}
			error={error}
		/>
	);
}
