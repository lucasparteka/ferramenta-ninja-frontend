"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { Input } from "@/components/ui/input";
import type { RGB } from "@/lib/color/palette";
import {
	generatePalette,
	hexToHsl,
	hexToOklch,
	hexToRgb,
} from "@/lib/color/palette";
import { cn } from "@/lib/utils";

const PALETTE_TYPES = [
	{ value: "complementary", label: "Complementar" },
	{ value: "analogous", label: "Análoga" },
	{ value: "triadic", label: "Triádica" },
	{ value: "monochromatic", label: "Monocromática" },
] as const;

function rgbString({ r, g, b }: RGB): string {
	return `${r}, ${g}, ${b}`;
}

function hslCssString(hex: string): string {
	const hsl = hexToHsl(hex);
	if (!hsl) return "";
	return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;
}

function oklchCssString(hex: string): string {
	const oklch = hexToOklch(hex);
	if (!oklch) return "";
	return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
}

function generateCssVars(palette: string[]): string {
	return palette
		.map((hex, i) => `--palette-${i + 1}: ${hex.toUpperCase()};`)
		.join("\n");
}

function generateOklchVars(palette: string[]): string {
	return palette
		.map((hex, i) => `--palette-${i + 1}: ${oklchCssString(hex)};`)
		.join("\n");
}

export function ColorPalette() {
	const [baseColor, setBaseColor] = useState("#3b82f6");
	const [type, setType] =
		useState<(typeof PALETTE_TYPES)[number]["value"]>("complementary");

	const hsl = hexToHsl(baseColor);
	const rgb = hexToRgb(baseColor);
	const palette = generatePalette(type, baseColor);

	const typeName = PALETTE_TYPES.find((t) => t.value === type)?.label ?? "";

	const gridCols: Record<number, string> = {
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-3",
		5: "grid-cols-1 sm:grid-cols-5",
	};
	const colsClass = gridCols[palette.length] ?? "grid-cols-1 sm:grid-cols-3";

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Base
						</h3>
						<div className="space-y-3">
							<div className="space-y-1.5">
								<label
									htmlFor="palette-base-text"
									className="text-xs font-medium text-foreground"
								>
									Cor base
								</label>
								<div className="flex items-center gap-2">
									<input
										id="palette-base-color"
										type="color"
										value={baseColor}
										onChange={(e) => setBaseColor(e.target.value)}
										className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
										aria-label="Selecionar cor"
									/>
									<Input
										id="palette-base-text"
										type="text"
										value={baseColor.toUpperCase()}
										onChange={(e) => {
											const v = e.target.value;
											if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBaseColor(v);
										}}
										className="font-mono text-xs uppercase"
										maxLength={7}
									/>
								</div>
							</div>
						</div>
					</div>

					{(rgb || hsl) && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Valores
							</h3>
							{rgb && (
								<div className="flex items-center justify-between py-0.5">
									<span className="text-xs text-muted-foreground">RGB</span>
									<span className="font-mono text-caption tabular-nums text-foreground">
										{rgbString(rgb)}
									</span>
								</div>
							)}
							{hsl && (
								<div className="flex items-center justify-between py-0.5">
									<span className="text-xs text-muted-foreground">HSL</span>
									<span className="font-mono text-caption tabular-nums text-foreground">
										{hsl.h}°, {hsl.s}%, {hsl.l}%
									</span>
								</div>
							)}
							{hexToOklch(baseColor) && (
								<div className="flex items-center justify-between py-0.5">
									<span className="text-xs text-muted-foreground">oklch</span>
									<span className="font-mono text-caption tabular-nums text-foreground">
										{(() => {
											const o = hexToOklch(baseColor)!;
											return `${o.l} ${o.c} ${o.h}`;
										})()}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			}
			centerPanel={
				<div className="flex flex-col gap-0 flex-1">
					<div className="p-4 space-y-3">
						<div
							className="h-24 w-full rounded-md border border-border"
							style={{ backgroundColor: baseColor }}
						/>
						<div className="flex flex-wrap gap-x-4 gap-y-1">
							<span className="font-mono text-caption tabular-nums text-muted-foreground">
								{baseColor.toUpperCase()}
							</span>
							{hsl && (
								<span className="font-mono text-caption tabular-nums text-muted-foreground">
									HSL {hsl.h}° {hsl.s}% {hsl.l}%
								</span>
							)}
							{rgb && (
								<span className="font-mono text-caption tabular-nums text-muted-foreground">
									RGB {rgbString(rgb)}
								</span>
							)}
						</div>
					</div>

					<div className="border-t border-border p-4 flex-1">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Paleta gerada
							</h3>
							<span className="font-mono text-caption tabular-nums text-muted-foreground">
								{palette.length} tons
							</span>
						</div>
						<div className={cn("grid gap-3", colsClass)}>
							{palette.map((hex) => {
								const paletteRgb = hexToRgb(hex);
								const hexUpper = hex.toUpperCase();
								return (
									<div
										key={hex}
										className="overflow-hidden rounded-md border border-border bg-card flex sm:flex-col"
									>
										<div
											className="w-12 shrink-0 sm:h-16 sm:w-full"
											style={{ backgroundColor: hex }}
										/>
										<div className="flex-1 min-w-0 p-2 space-y-1.5">
											<p className="font-mono text-caption tabular-nums font-medium text-foreground">
												{hexUpper}
											</p>
											<div className="flex flex-wrap gap-1 sm:flex-col">
												<CopyButton text={hexUpper} label="HEX" size="xs" />
												{paletteRgb && (
													<CopyButton
														text={`rgb(${rgbString(paletteRgb)})`}
														label="RGB"
														size="xs"
													/>
												)}
												<CopyButton
													text={hslCssString(hex)}
													label="HSL"
													size="xs"
												/>
												<CopyButton
													text={oklchCssString(hex)}
													label="oklch"
													size="xs"
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Harmonia
						</h3>
						<div className="space-y-1">
							{PALETTE_TYPES.map((pt) => (
								<button
									key={pt.value}
									type="button"
									onClick={() => setType(pt.value)}
									className={cn(
										"flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
										type === pt.value
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{pt.label}
								</button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Informações
						</h3>
						<div className="flex items-center justify-between py-0.5">
							<span className="text-xs text-muted-foreground">
								Tons gerados
							</span>
							<span className="font-mono text-caption tabular-nums text-foreground">
								{palette.length}
							</span>
						</div>
						<div className="flex items-center justify-between py-0.5">
							<span className="text-xs text-muted-foreground">Tipo</span>
							<span className="text-xs text-foreground">{typeName}</span>
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Ações
						</h3>
						<CopyButton
							text={generateCssVars(palette)}
							label="Copiar como CSS"
							variant="outline"
							size="sm"
							disabled={palette.length === 0}
							className="w-full"
						/>
						<CopyButton
							text={palette.map((h) => h.toUpperCase()).join("\n")}
							label="Copiar lista HEX"
							variant="outline"
							size="sm"
							disabled={palette.length === 0}
							className="w-full"
						/>
						<CopyButton
							text={generateOklchVars(palette)}
							label="Copiar como oklch"
							variant="outline"
							size="sm"
							disabled={palette.length === 0}
							className="w-full"
						/>
					</div>
				</div>
			}
		/>
	);
}
