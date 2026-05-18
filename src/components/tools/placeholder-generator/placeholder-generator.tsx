"use client";

import { FileDown, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { PlaceholderPattern } from "@/lib/image";
import { formatBytes, generatePlaceholder } from "@/lib/image";

const PRESETS = [
	{ label: "Blog Banner", width: 1200, height: 630 },
	{ label: "Twitter/X", width: 1200, height: 675 },
	{ label: "Instagram", width: 1080, height: 1080 },
	{ label: "YouTube Thumb", width: 1280, height: 720 },
	{ label: "Banner Web", width: 728, height: 90 },
	{ label: "Card", width: 300, height: 250 },
] as const;

const PATTERNS: { value: PlaceholderPattern; label: string }[] = [
	{ value: "none", label: "Nenhum" },
	{ value: "grid", label: "Grade" },
	{ value: "dots", label: "Pontos" },
	{ value: "stripes", label: "Listras" },
];

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;
const DEFAULT_BG = "#cccccc";
const DEFAULT_TEXT_COLOR = "#666666";

export function PlaceholderGenerator() {
	const [width, setWidth] = useState(DEFAULT_WIDTH);
	const [height, setHeight] = useState(DEFAULT_HEIGHT);
	const [bgColor, setBgColor] = useState(DEFAULT_BG);
	const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
	const [customText, setCustomText] = useState("");
	const [pattern, setPattern] = useState<PlaceholderPattern>("none");
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [blobSize, setBlobSize] = useState<number | null>(null);
	const [generating, setGenerating] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setGenerating(true);

		generatePlaceholder({
			width,
			height,
			bgColor,
			textColor,
			text: customText,
			pattern,
		})
			.then((result) => {
				if (cancelled) return;
				setDataUrl(result.dataUrl);
				setBlobSize(result.blob.size);
			})
			.catch(() => {
				if (!cancelled) setDataUrl(null);
			})
			.finally(() => {
				if (!cancelled) setGenerating(false);
			});

		return () => {
			cancelled = true;
		};
	}, [width, height, bgColor, textColor, customText, pattern]);

	function handlePreset(w: number, h: number) {
		setWidth(w);
		setHeight(h);
	}

	function handleReset() {
		setWidth(DEFAULT_WIDTH);
		setHeight(DEFAULT_HEIGHT);
		setBgColor(DEFAULT_BG);
		setTextColor(DEFAULT_TEXT_COLOR);
		setCustomText("");
		setPattern("none");
	}

	function handleDownload() {
		if (!dataUrl) return;
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `placeholder-${width}x${height}.png`;
		a.click();
	}

	const activePreset = PRESETS.find(
		(p) => p.width === width && p.height === height,
	);

	const MAX_PREVIEW = 480;
	const previewScale = Math.min(MAX_PREVIEW / width, MAX_PREVIEW / height, 1);
	const previewW = Math.round(width * previewScale);
	const previewH = Math.round(height * previewScale);

	const viaUrl = `https://via.placeholder.com/${width}x${height}`;

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Gerador de Imagem Placeholder
					</span>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={handleReset}>
							<RefreshCw className="h-3.5 w-3.5" />
							Resetar
						</Button>
						<Button
							size="sm"
							onClick={handleDownload}
							disabled={!dataUrl || generating}
						>
							<FileDown className="h-3.5 w-3.5" />
							Baixar PNG
						</Button>
					</div>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Presets
						</h3>
						<div className="flex flex-col gap-1">
							{PRESETS.map((preset) => (
								<Button
									key={preset.label}
									variant={
										activePreset?.label === preset.label ? "secondary" : "ghost"
									}
									size="sm"
									className="justify-between font-normal"
									onClick={() => handlePreset(preset.width, preset.height)}
								>
									<span>{preset.label}</span>
									<span className="font-mono text-xs text-muted-foreground">
										{preset.width}×{preset.height}
									</span>
								</Button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Dimensões
						</h3>
						<div className="space-y-1.5">
							<Label htmlFor="ph-width" className="text-xs font-medium">
								Largura (px)
							</Label>
							<NumberInput
								id="ph-width"
								value={width}
								onChange={(v) => setWidth(Math.max(1, Math.min(v, 5000)))}
								live
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="ph-height" className="text-xs font-medium">
								Altura (px)
							</Label>
							<NumberInput
								id="ph-height"
								value={height}
								onChange={(v) => setHeight(Math.max(1, Math.min(v, 5000)))}
								live
							/>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Cores
						</h3>
						<div className="flex items-center justify-between">
							<Label htmlFor="ph-bg-color" className="text-xs font-medium">
								Fundo
							</Label>
							<div className="flex items-center gap-2">
								<span className="font-mono text-xs text-muted-foreground">
									{bgColor}
								</span>
								<input
									id="ph-bg-color"
									type="color"
									value={bgColor}
									onChange={(e) => setBgColor(e.target.value)}
									className="h-8 w-8 cursor-pointer rounded border border-border p-0.5"
								/>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="ph-text-color" className="text-xs font-medium">
								Texto
							</Label>
							<div className="flex items-center gap-2">
								<span className="font-mono text-xs text-muted-foreground">
									{textColor}
								</span>
								<input
									id="ph-text-color"
									type="color"
									value={textColor}
									onChange={(e) => setTextColor(e.target.value)}
									className="h-8 w-8 cursor-pointer rounded border border-border p-0.5"
								/>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Texto
						</h3>
						<Input
							id="ph-text"
							value={customText}
							onChange={(e) => setCustomText(e.target.value)}
							placeholder={`${width} × ${height}`}
							className="text-sm"
						/>
						<p className="text-[10px] text-muted-foreground">
							Se vazio, exibe as dimensões
						</p>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Padrão de fundo
						</h3>
						<NativeSelect
							id="ph-pattern"
							value={pattern}
							onChange={(e) => setPattern(e.target.value as PlaceholderPattern)}
						>
							{PATTERNS.map((p) => (
								<option key={p.value} value={p.value}>
									{p.label}
								</option>
							))}
						</NativeSelect>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex h-full min-h-110 flex-col items-center justify-center gap-3 p-6">
					<div
						className="relative overflow-hidden border border-border"
						style={{ width: previewW, height: previewH }}
					>
						{dataUrl ? (
							// biome-ignore lint/performance/noImgElement: canvas preview via data URI
							<img
								src={dataUrl}
								alt="Preview do placeholder"
								style={{ width: "100%", height: "100%", display: "block" }}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted">
								<ImageIcon className="h-8 w-8 opacity-20" />
							</div>
						)}
						{generating && (
							<div className="absolute inset-0 flex items-center justify-center bg-background/60">
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
							</div>
						)}
					</div>
					<p className="font-mono text-xs text-muted-foreground">
						{width} × {height} px
					</p>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border h-full">
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Info
						</h3>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">Dimensões</span>
							<span className="font-mono text-xs">
								{width} × {height}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">Formato</span>
							<span className="font-mono text-xs">PNG</span>
						</div>
						{blobSize !== null && (
							<div className="flex items-center justify-between">
								<span className="text-xs text-muted-foreground">Tamanho</span>
								<span className="font-mono text-xs">
									{formatBytes(blobSize)}
								</span>
							</div>
						)}
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Data URI
						</h3>
						<Textarea
							readOnly
							value={dataUrl ?? ""}
							className="resize-none font-mono text-xs h-20"
							placeholder="Gerando…"
						/>
						<div className="flex justify-end">
							<CopyButton
								text={dataUrl ?? ""}
								disabled={!dataUrl}
								size="sm"
								variant="outline"
							/>
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Alternativa externa
						</h3>
						<p className="text-xs text-muted-foreground">
							via.placeholder.com:
						</p>
						<div className="flex items-center gap-2">
							<code className="flex-1 truncate rounded bg-muted px-2 py-1 font-mono text-[10px]">
								{viaUrl}
							</code>
							<CopyButton
								text={viaUrl}
								size="icon-xs"
								variant="ghost"
								iconOnly
							/>
						</div>
					</div>
				</div>
			}
		/>
	);
}
