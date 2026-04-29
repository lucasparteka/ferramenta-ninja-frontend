"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { RGB } from "@/lib/color/palette";
import { generatePalette, hexToHsl, hexToRgb } from "@/lib/color/palette";

const PALETTE_TYPES = [
	{ value: "complementary", label: "Complementar" },
	{ value: "analogous", label: "Análoga" },
	{ value: "triadic", label: "Triádica" },
	{ value: "monochromatic", label: "Monocromática" },
] as const;

function rgbString({ r, g, b }: RGB): string {
	return `${r}, ${g}, ${b}`;
}

function hslString(hex: string): string {
	const hsl = hexToHsl(hex);
	if (!hsl) return "";
	return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
}

export function ColorPalette() {
	const [baseColor, setBaseColor] = useState("#3b82f6");
	const [type, setType] =
		useState<(typeof PALETTE_TYPES)[number]["value"]>("complementary");
	const [copied, setCopied] = useState<string | null>(null);
	const hsl = hexToHsl(baseColor);

	const palette = generatePalette(type, baseColor);

	const handleCopy = useCallback((label: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(null), 1500);
	}, []);

	return (
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="palette-base"
						className="block text-sm font-medium text-foreground"
					>
						Cor base
					</label>
					<div className="flex gap-3">
						<Input
							id="palette-base"
							type="color"
							value={baseColor}
							onChange={(e) => setBaseColor(e.target.value)}
							className="h-10 w-16 cursor-pointer p-1"
						/>
						<Input
							type="text"
							value={baseColor.toUpperCase()}
							onChange={(e) => setBaseColor(e.target.value)}
							className="font-mono text-foreground uppercase"
							maxLength={7}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="palette-type"
						className="block text-sm font-medium text-foreground"
					>
						Tipo de paleta
					</label>
					<NativeSelect
						id="palette-type"
						value={type}
						onChange={(e) => setType(e.target.value as typeof type)}
					>
						{PALETTE_TYPES.map((t) => (
							<option key={t.value} value={t.value}>
								{t.label}
							</option>
						))}
					</NativeSelect>
				</div>

				{hsl && (
					<div className="text-sm text-muted-foreground">
						HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%
					</div>
				)}
			</div>

			<div className="max-w-3xl">
				<h3 className="mb-3 text-sm font-medium text-foreground">
					{PALETTE_TYPES.find((t) => t.value === type)?.label}
				</h3>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{palette.map((hex) => {
						const rgb = hexToRgb(hex);
						const hexUpper = hex.toUpperCase();
						return (
							<div
								key={hex}
								className="overflow-hidden rounded-lg border border-border"
							>
								<div className="h-20 w-full" style={{ backgroundColor: hex }} />
								<div className="space-y-1.5 p-2">
									<p className="text-center text-xs font-mono font-semibold text-foreground">
										{hexUpper}
									</p>
									<div className="flex flex-col gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-7 text-xs"
											onClick={() => handleCopy(`hex-${hex}`, hexUpper)}
										>
											{copied === `hex-${hex}` ? "Copiado!" : "Copiar HEX"}
										</Button>
										{rgb && (
											<Button
												variant="ghost"
												size="sm"
												className="h-7 text-xs"
												onClick={() =>
													handleCopy(`rgb-${hex}`, `rgb(${rgbString(rgb)})`)
												}
											>
												{copied === `rgb-${hex}` ? "Copiado!" : "Copiar RGB"}
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											className="h-7 text-xs"
											onClick={() =>
												handleCopy(`hsl-${hex}`, `hsl(${hslString(hex)})`)
											}
										>
											{copied === `hsl-${hex}` ? "Copiado!" : "Copiar HSL"}
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
