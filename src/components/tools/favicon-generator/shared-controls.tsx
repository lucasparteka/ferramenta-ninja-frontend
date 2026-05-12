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

import { FileCode, Image as ImageIcon, Smile, Type } from "lucide-react";
import { useEffect, useRef } from "react";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Label } from "@/components/ui/label";
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
							"group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
							active
								? "border-primary/40 bg-primary/5"
								: "border-transparent hover:border-border hover:bg-muted/50",
						)}
						aria-pressed={active}
					>
						<span
							className={cn(
								"flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
								active
									? "border-primary/40 bg-primary/10 text-primary"
									: "border-border bg-card text-muted-foreground",
							)}
						>
							<Icon className="h-4 w-4" />
						</span>
						<span className="min-w-0 flex-1">
							<span
								className={cn(
									"block text-sm font-medium",
									active ? "text-foreground" : "text-foreground/80",
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	if (!render) {
		return (
			<div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center">
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
						"relative rounded-2xl border p-3 shadow-sm",
						bgTransparent
							? "bg-[conic-gradient(from_45deg,_#e5e7eb_25%,_transparent_0_50%,_#e5e7eb_0_75%,_transparent_0)] [background-size:16px_16px]"
							: "bg-card",
					)}
				>
					<canvas
						ref={mainRef}
						width={PREVIEW_SIZE}
						height={PREVIEW_SIZE}
						className="block aspect-square w-[280px] sm:w-[320px]"
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
										? "bg-[conic-gradient(from_45deg,_#e5e7eb_25%,_transparent_0_50%,_#e5e7eb_0_75%,_transparent_0)] [background-size:8px_8px]"
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
			<div className="rounded-xl border bg-card p-4">
				<p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
					No navegador
				</p>
				<div className="flex items-center gap-2 rounded-t-lg border border-b-0 bg-muted/40 px-3 py-2">
					<canvas
						ref={tabRef}
						width={32}
						height={32}
						style={{ width: 16, height: 16 }}
					/>
					<span className="truncate text-xs text-foreground">{tabLabel}</span>
					<span className="ml-auto text-muted-foreground/60">×</span>
				</div>
				<div className="h-12 rounded-b-lg border bg-background" />
			</div>
		</div>
	);
}

/* ---------- ColorField -------------------------------------------- */

export function ColorField({
	id,
	label,
	value,
	onChange,
	allowTransparent = true,
	presets = COLOR_PRESETS,
}: {
	id: string;
	label: string;
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
			<Label htmlFor={id}>{label}</Label>
			<div className="flex items-center gap-2">
				<input
					type="color"
					value={value === "transparent" ? "#3B82F6" : value}
					onChange={(e) => onChange(e.target.value)}
					className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border bg-transparent p-0.5"
					aria-label={`${label} — seletor`}
				/>
				<input
					id={id}
					type="text"
					value={value}
					onChange={(e) => handleHex(e.target.value)}
					className="flex-1 rounded-lg border bg-background px-3 py-1.5 font-mono text-sm"
					placeholder="#FFFFFF"
				/>
				{allowTransparent && (
					<button
						type="button"
						onClick={() => onChange("transparent")}
						className={cn(
							"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
							value === "transparent"
								? "border-primary bg-primary/10 text-primary"
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
							"h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
							value.toLowerCase() === c.toLowerCase()
								? "scale-110 border-primary ring-2 ring-primary/30"
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
			<div className="text-sm font-medium text-foreground">Formato</div>
			<OptionSwitch
				options={FORMATS}
				value={value}
				onChange={(v) => onChange(v as Format)}
			/>
		</div>
	);
}

/* ---------- SizeSlider -------------------------------------------- */

export function SizeSlider({
	id,
	label,
	value,
	onChange,
	min = 40,
	max = 100,
}: {
	id: string;
	label: string;
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label htmlFor={id}>{label}</Label>
				<span className="font-mono text-xs text-muted-foreground">
					{value}%
				</span>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-primary"
			/>
			<div className="flex justify-between text-[10px] text-muted-foreground">
				<span>{min}%</span>
				<span>{max}%</span>
			</div>
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
		<div className="space-y-3">
			<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
				{title}
			</h3>
			{children}
		</div>
	);
}
