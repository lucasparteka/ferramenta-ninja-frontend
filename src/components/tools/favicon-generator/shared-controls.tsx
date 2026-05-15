"use client";

/* ------------------------------------------------------------------ */
/*  Building blocks compartilhados pelos 4 editores de favicon.        */
/*  - drawBackground / clipFormat: helpers de canvas                  */
/*  - <ModeTabs>: navegação entre modos (left rail header)            */
/*  - <LivePreview>: canvas grande + mini 16/32/48 + tab do browser    */
/*  - <ColorField>: input color + hex + presets + transparente         */
/*  - <FormatField>: square / rounded / circle                         */
/*  - <SizeSlider>: slider com label + valor                           */
/*  - <Section>: bloco de propriedades com header uppercase            */
/* ------------------------------------------------------------------ */

import {
	FileCode,
	Image as ImageIcon,
	Lock,
	Smile,
	Star,
	Type,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Slider } from "@/components/shared/slider";
import { Input } from "@/components/ui/input";
import type { FaviconMode } from "@/lib/image/favicon";
import { cn } from "@/lib/utils";

/* ---------- presets ----------------------------------------------- */

export type Format = "square" | "rounded" | "circle";

export const FORMATS: Array<{ label: string; value: Format }> = [
	{ label: "Quadrado", value: "square" },
	{ label: "Arredondado", value: "rounded" },
	{ label: "Redondo", value: "circle" },
];

export const COLOR_PRESETS = [
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

/* ---------- canvas helpers ---------------------------------------- */

export function drawBackground(
	ctx: CanvasRenderingContext2D,
	size: number,
	color: string,
	format: Format,
) {
	if (!color || color === "transparent") return;
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
				ctx as CanvasRenderingContext2D & { roundRect?: typeof ctx.roundRect }
			).roundRect?.(0, 0, size, size, r);
			ctx.fill();
			break;
		}
		default:
			ctx.fillRect(0, 0, size, size);
	}
}

export function clipFormat(
	ctx: CanvasRenderingContext2D,
	size: number,
	format: Format,
) {
	if (format === "square") return;
	ctx.save();
	if (format === "circle") {
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.clip();
	} else {
		const r = Math.round(size * 0.2);
		ctx.beginPath();
		(
			ctx as CanvasRenderingContext2D & { roundRect?: typeof ctx.roundRect }
		).roundRect?.(0, 0, size, size, r);
		ctx.clip();
	}
}

/* ---------- ModeTabs ---------------------------------------------- */

const MODE_META: Record<
	FaviconMode,
	{ label: string; icon: React.ElementType; hint: string }
> = {
	image: { label: "Imagem", icon: ImageIcon, hint: "PNG, JPG, WebP" },
	svg: { label: "SVG", icon: FileCode, hint: "Vetor escalável" },
	text: { label: "Texto", icon: Type, hint: "Letras + fonte" },
	emoji: { label: "Emoji", icon: Smile, hint: "Catálogo + cor" },
};

export function ModeTabs({
	value,
	onChange,
}: {
	value: FaviconMode;
	onChange: (m: FaviconMode) => void;
}) {
	const order: FaviconMode[] = ["image", "svg", "text", "emoji"];
	return (
		<div className="flex flex-col gap-1">
			{order.map((m) => {
				const meta = MODE_META[m];
				const Icon = meta.icon;
				const active = m === value;
				return (
					<button
						key={m}
						type="button"
						onClick={() => onChange(m)}
						className={cn(
							"group flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs font-medium transition-colors",
							active
								? "bg-accent text-accent-foreground border-border"
								: "border-transparent hover:border-border hover:bg-muted/50",
						)}
						aria-pressed={active}
					>
						<span
							className={cn(
								"flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
								active
									? "bg-card text-accent-foreground border-border"
									: "border-border bg-card text-muted-foreground",
							)}
						>
							<Icon className="h-3.5 w-3.5" />
						</span>
						<span className="min-w-0 flex-1">
							<span
								className={cn(
									"block leading-tight",
									active ? "text-accent-foreground" : "text-muted-foreground",
								)}
							>
								{meta.label}
							</span>
							<span className="block truncate text-[11px] text-muted-foreground">
								{meta.hint}
							</span>
						</span>
					</button>
				);
			})}
		</div>
	);
}

/* ---------- BrowserTabPreview -------------------------------------- */

function BrowserTabPreview({
	tabRef,
	tabLabel = "exemplo.com.br",
	className,
}: {
	tabRef: React.RefObject<HTMLCanvasElement | null>;
	tabLabel?: string;
	className?: string;
}) {
	const url = `https://${tabLabel}`;
	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-card overflow-hidden",
				className,
			)}
		>
			<div className="flex items-center justify-between px-3 h-7 bg-muted/40">
				<div className="flex items-center gap-1" aria-hidden>
					<span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
					<span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
					<span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
				</div>
				<div
					className="flex items-center gap-1.5 text-muted-foreground/35 text-xs select-none"
					aria-hidden
				>
					<span>—</span>
					<span>□</span>
					<span>✕</span>
				</div>
			</div>

			<div className="flex items-end bg-muted/30 px-3 h-8">
				<div className="flex items-center gap-2 rounded-t-md border border-border border-b-0 bg-card px-2 h-7 -mb-px min-w-0">
					<canvas
						ref={tabRef}
						width={32}
						height={32}
						style={{ width: 17, height: 17 }}
						className="shrink-0"
					/>
					<span className="text-[13px] truncate max-w-28">{tabLabel}</span>
					<button
						type="button"
						tabIndex={-1}
						aria-hidden
						className="text-muted-foreground/40 hover:text-muted-foreground text-sm leading-none shrink-0 cursor-default ml-4"
					>
						×
					</button>
				</div>
			</div>

			<div className="flex items-center gap-2 px-3 h-8 bg-card">
				<div className="flex items-center gap-1.5 flex-1 rounded-full bg-muted/60 px-2.5 h-6 min-w-0">
					<Lock
						className="size-3 shrink-0 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<span className="text-[11px] text-muted-foreground truncate">
						{url}
					</span>
				</div>
				<Star
					className="size-3 shrink-0 text-muted-foreground/30"
					strokeWidth={1.75}
				/>
			</div>

			<div className="h-16 bg-background" />
		</div>
	);
}

/* ---------- LivePreview ------------------------------------------- */

type RenderFn = (
	size: number,
) => HTMLCanvasElement | Promise<HTMLCanvasElement>;

const PREVIEW_SIZE = 320;
const MINI_SIZES = [16, 32, 48];

export function LivePreview({
	render,
	deps,
	bgTransparent,
	tabLabel = "exemplo.com.br",
	empty,
}: {
	render: RenderFn | null;
	deps: unknown[];
	bgTransparent?: boolean;
	tabLabel?: string;
	empty?: React.ReactNode;
}) {
	const mainRef = useRef<HTMLCanvasElement>(null);
	const tabRef = useRef<HTMLCanvasElement>(null);
	const mini16 = useRef<HTMLCanvasElement>(null);
	const mini32 = useRef<HTMLCanvasElement>(null);
	const mini48 = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!render) return;
		let cancelled = false;
		(async () => {
			const main = mainRef.current;
			if (main) {
				const c = await render(PREVIEW_SIZE);
				if (cancelled) return;
				const ctx = main.getContext("2d");
				if (ctx) {
					main.width = PREVIEW_SIZE;
					main.height = PREVIEW_SIZE;
					ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
					ctx.drawImage(c, 0, 0);
				}
			}

			const tab = tabRef.current;
			if (tab) {
				const c = await render(32);
				if (cancelled) return;
				const ctx = tab.getContext("2d");
				if (ctx) {
					tab.width = 32;
					tab.height = 32;
					ctx.clearRect(0, 0, 32, 32);
					ctx.drawImage(c, 0, 0);
				}
			}

			const refs = [mini16, mini32, mini48];
			for (let i = 0; i < MINI_SIZES.length; i++) {
				const size = MINI_SIZES[i];
				const canvas = refs[i].current;
				if (!canvas) continue;
				const c = await render(size);
				if (cancelled) return;
				const ctx = canvas.getContext("2d");
				if (!ctx) continue;
				canvas.width = size;
				canvas.height = size;
				ctx.clearRect(0, 0, size, size);
				ctx.drawImage(c, 0, 0);
			}
		})();
		return () => {
			cancelled = true;
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: .
	}, deps);

	if (!render) {
		return (
			<div className="flex h-full min-h-105 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
				{empty ?? (
					<p className="text-sm text-muted-foreground">
						Adicione conteúdo no painel à esquerda para ver o preview.
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* main canvas */}
			<div className="flex justify-center">
				<div
					className={cn(
						"relative rounded-md border p-3",
						bgTransparent
							? "bg-[conic-gradient(from_90deg,#e5e7eb_25%,transparent_0_50%,#e5e7eb_0_75%,transparent_0)] bg-size-[16px_16px]"
							: "bg-card",
					)}
				>
					<canvas
						ref={mainRef}
						width={PREVIEW_SIZE}
						height={PREVIEW_SIZE}
						className="block aspect-square w-70 sm:w-[320px]"
					/>
				</div>
			</div>

			{/* mini sizes row */}
			<div className="flex items-center justify-center gap-6">
				{MINI_SIZES.map((size, i) => {
					const ref = [mini16, mini32, mini48][i];
					return (
						<div key={size} className="flex flex-col items-center gap-1.5">
							<div
								className={cn(
									"flex items-center justify-center rounded-md border p-1.5",
									bgTransparent
										? "bg-[conic-gradient(from_90deg,#e5e7eb_25%,transparent_0_50%,#e5e7eb_0_75%,transparent_0)] bg-size-[8px_8px]"
										: "bg-card",
								)}
							>
								<canvas
									ref={ref}
									width={size}
									height={size}
									style={{
										width: size,
										height: size,
										imageRendering: size <= 16 ? "pixelated" : "auto",
									}}
								/>
							</div>
							<span className="font-mono text-[10px] text-muted-foreground">
								{size}×{size}
							</span>
						</div>
					);
				})}
			</div>

			{/* contextual preview: browser tab */}
			<div className="space-y-3">
				<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					No navegador
				</h3>
				<BrowserTabPreview tabRef={tabRef} tabLabel={tabLabel} />
			</div>
		</div>
	);
}

/* ---------- ColorField -------------------------------------------- */

export function ColorField({
	value,
	onChange,
	allowTransparent = true,
	presets = COLOR_PRESETS,
}: {
	value: string;
	onChange: (v: string) => void;
	allowTransparent?: boolean;
	presets?: string[];
}) {
	function handleHex(v: string) {
		const t = v.trim();
		if (allowTransparent && t.toLowerCase() === "transparent") {
			onChange("transparent");
		} else if (/^#[0-9A-Fa-f]{6}$/.test(t)) {
			onChange(t);
		}
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Input
					type="color"
					value={value === "transparent" ? "#3B82F6" : value}
					onChange={(e) => onChange(e.target.value)}
					className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
					aria-label="Seletor de cor"
				/>
				<Input
					type="text"
					value={value}
					onChange={(e) => handleHex(e.target.value)}
					className="font-mono text-xs h-8"
					placeholder="#FFFFFF"
				/>
				{allowTransparent && (
					<button
						type="button"
						onClick={() => onChange("transparent")}
						className={cn(
							"flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border transition-colors",
							value === "transparent"
								? "bg-accent text-accent-foreground border-border"
								: "border-border text-muted-foreground hover:border-foreground/40",
						)}
						aria-label="Fundo transparente"
						title="Transparente"
					>
						<svg
							aria-hidden="true"
							className="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
						>
							<line x1="18" y1="6" x2="6" y2="18" />
						</svg>
					</button>
				)}
			</div>
			<div className="flex flex-wrap gap-1.5">
				{presets.map((c) => (
					<button
						key={c}
						type="button"
						onClick={() => onChange(c)}
						title={c}
						className={cn(
							"h-6 w-6 rounded-md border transition-all hover:ring-2 hover:ring-ring/50",
							value.toLowerCase() === c.toLowerCase()
								? "ring-2 ring-ring/50"
								: "border-border",
						)}
						style={{ backgroundColor: c }}
						aria-label={`Cor ${c}`}
					/>
				))}
			</div>
		</div>
	);
}

/* ---------- FormatField ------------------------------------------- */

export function FormatField({
	value,
	onChange,
}: {
	value: Format;
	onChange: (v: Format) => void;
}) {
	return (
		<div className="space-y-2">
			<OptionSwitch
				options={FORMATS}
				value={value}
				onChange={(v) => onChange(v as Format)}
				size="sm"
			/>
		</div>
	);
}

/* ---------- SizeSlider -------------------------------------------- */

export function SizeSlider({
	value,
	onChange,
	min = 40,
	max = 100,
}: {
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-foreground">Tamanho</span>
				<span className="font-mono text-xs text-muted-foreground">
					{value}%
				</span>
			</div>
			<Slider
				value={[value]}
				onValueChange={([v]) => onChange(v)}
				min={min}
				max={max}
				step={1}
			/>
		</div>
	);
}

/* ---------- Section ----------------------------------------------- */

export function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="p-4 space-y-3">
			<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
				{title}
			</h3>
			{children}
		</div>
	);
}
