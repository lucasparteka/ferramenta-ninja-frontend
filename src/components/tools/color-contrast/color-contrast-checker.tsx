"use client";

import { Check, Copy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { NumberInput } from "@/components/shared/number-input";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type ColorBlindnessType,
	type ContrastResult,
	checkContrast,
	simulateColorBlindness,
	suggestPassingColor,
	type WCAGLevel,
} from "@/lib/color/contrast";
import { hexToHsl, hexToRgb, hslToHex, rgbToHex } from "@/lib/color/palette";
import { cn } from "@/lib/utils";

const FORMAT_OPTIONS = [
	{ label: "HEX", value: "hex" },
	{ label: "RGB", value: "rgb" },
	{ label: "HSL", value: "hsl" },
];

const BLINDNESS_OPTIONS: { label: string; value: ColorBlindnessType }[] = [
	{ label: "Normal", value: "normal" },
	{ label: "Protanopia", value: "protanopia" },
	{ label: "Deuteranopia", value: "deuteranopia" },
	{ label: "Tritanopia", value: "tritanopia" },
];

function clamp(v: number, min: number, max: number) {
	return Math.min(max, Math.max(min, v));
}

function isValidHex(hex: string): boolean {
	return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function LevelBadge({ level }: { level: WCAGLevel }) {
	if (level === "fail") {
		return (
			<span className="flex items-center gap-1 text-destructive">
				<X className="h-3.5 w-3.5" />
				<span className="text-xs font-medium">Reprovado</span>
			</span>
		);
	}
	return (
		<span className="flex items-center gap-1 text-success">
			<Check className="h-3.5 w-3.5" />
			<span className="text-xs font-medium">{level}</span>
		</span>
	);
}

type ColorInputsProps = {
	label: string;
	hex: string;
	onHexChange: (hex: string) => void;
	format: string;
};

function ColorInputs({ label, hex, onHexChange, format }: ColorInputsProps) {
	const rgb = hexToRgb(hex);
	const hsl = hexToHsl(hex);

	function handleHexInput(raw: string) {
		const val = raw.startsWith("#") ? raw : `#${raw}`;
		if (isValidHex(val)) onHexChange(val);
	}

	function handleRgbChannel(channel: "r" | "g" | "b", value: number) {
		if (!rgb) return;
		const updated = { ...rgb, [channel]: clamp(Math.round(value), 0, 255) };
		onHexChange(rgbToHex(updated));
	}

	function handleHslChannel(channel: "h" | "s" | "l", value: number) {
		if (!hsl) return;
		const limits = { h: [0, 360], s: [0, 100], l: [0, 100] } as const;
		const [min, max] = limits[channel];
		const updated = { ...hsl, [channel]: clamp(Math.round(value), min, max) };
		onHexChange(hslToHex(updated));
	}

	return (
		<div className="space-y-2">
			<Label className="text-xs font-medium">{label}</Label>
			<div className="flex items-center gap-2">
				<input
					type="color"
					value={hex}
					onChange={(e) => onHexChange(e.target.value)}
					className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
				/>
				{format === "hex" && (
					<Input
						value={hex.toUpperCase()}
						onChange={(e) => handleHexInput(e.target.value)}
						className="font-mono text-xs uppercase"
						maxLength={7}
					/>
				)}
				{format === "rgb" && rgb && (
					<div className="flex gap-1">
						{(["r", "g", "b"] as const).map((ch) => (
							<NumberInput
								key={ch}
								value={rgb[ch]}
								onChange={(v) => handleRgbChannel(ch, v)}
								min={0}
								max={255}
								live
								className="w-14 text-xs"
							/>
						))}
					</div>
				)}
				{format === "hsl" && hsl && (
					<div className="flex gap-1">
						{(["h", "s", "l"] as const).map((ch) => {
							const limits = { h: [0, 360], s: [0, 100], l: [0, 100] } as const;
							return (
								<NumberInput
									key={ch}
									value={hsl[ch]}
									onChange={(v) => handleHslChannel(ch, v)}
									min={limits[ch][0]}
									max={limits[ch][1]}
									live
									className="w-14 text-xs"
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

function CriterionRow({
	label,
	level,
	threshold,
}: {
	label: string;
	level: WCAGLevel;
	threshold: string;
}) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<span className="text-xs text-foreground">{label}</span>
				<span className="ml-1 text-[10px] text-muted-foreground">
					(≥{threshold})
				</span>
			</div>
			<LevelBadge level={level} />
		</div>
	);
}

export function ColorContrastChecker() {
	const [fgHex, setFgHex] = useState("#1a1a1a");
	const [bgHex, setBgHex] = useState("#ffffff");
	const [format, setFormat] = useState("hex");
	const [blindnessType, setBlindnessType] =
		useState<ColorBlindnessType>("normal");

	const result: ContrastResult | null = useMemo(
		() => checkContrast(fgHex, bgHex),
		[fgHex, bgHex],
	);

	const effectiveFg = useMemo(
		() => simulateColorBlindness(fgHex, blindnessType),
		[fgHex, blindnessType],
	);

	const effectiveBg = useMemo(
		() => simulateColorBlindness(bgHex, blindnessType),
		[bgHex, blindnessType],
	);

	const suggestionAA = useMemo(() => {
		if (!result || result.normalAA !== "fail") return null;
		return suggestPassingColor(fgHex, bgHex, 4.5);
	}, [result, fgHex, bgHex]);

	const suggestionAAA = useMemo(() => {
		if (!result || result.normalAAA !== "fail") return null;
		return suggestPassingColor(fgHex, bgHex, 7.0);
	}, [result, fgHex, bgHex]);

	function handleCopyCss() {
		const css = `color: ${fgHex.toUpperCase()};\nbackground-color: ${bgHex.toUpperCase()};`;
		navigator.clipboard.writeText(css);
	}

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Verificador de Contraste
					</span>
					<Button size="sm" onClick={handleCopyCss}>
						<Copy className="h-3.5 w-3.5" />
						Copiar CSS
					</Button>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Cores
						</h3>
						<ColorInputs
							label="Texto"
							hex={fgHex}
							onHexChange={setFgHex}
							format={format}
						/>
						<ColorInputs
							label="Fundo"
							hex={bgHex}
							onHexChange={setBgHex}
							format={format}
						/>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Formato
						</h3>
						<OptionSwitch
							options={FORMAT_OPTIONS}
							value={format}
							onChange={setFormat}
							fullWidth
						/>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Amostra de cores
						</h3>
						<div className="flex gap-2">
							<div className="flex-1 space-y-1">
								<div
									style={{ backgroundColor: fgHex }}
									className="h-10 rounded border border-border"
								/>
								<p className="text-center font-mono text-[10px] text-muted-foreground">
									{fgHex.toUpperCase()}
								</p>
							</div>
							<div className="flex-1 space-y-1">
								<div
									style={{ backgroundColor: bgHex }}
									className="h-10 rounded border border-border"
								/>
								<p className="text-center font-mono text-[10px] text-muted-foreground">
									{bgHex.toUpperCase()}
								</p>
							</div>
						</div>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex h-full flex-col gap-4 px-4 py-6 md:p-6">
					<div
						style={{ backgroundColor: effectiveBg, color: effectiveFg }}
						className="w-full rounded-md border border-border px-4 py-6 md:p-6 space-y-4"
					>
						<p className="text-2xl font-semibold">Texto grande (18pt+)</p>
						<p className="text-base">
							Texto normal para corpo de parágrafo — 16px, leitura comum em
							interfaces e artigos.
						</p>
						<p className="text-sm">
							Texto em tamanho menor — 14px, usado em legendas e metadados.
						</p>
						<p className="text-xs">
							Texto pequeno — 12px, utilizado em hints e notas auxiliares.
						</p>
					</div>

					<div className="space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Simulador de daltonismo
						</h3>
						<div className="flex flex-wrap gap-1">
							{BLINDNESS_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setBlindnessType(opt.value)}
									className={cn(
										"rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
										blindnessType === opt.value
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{opt.label}
								</button>
							))}
						</div>
						{blindnessType !== "normal" && (
							<p className="text-[10px] text-muted-foreground">
								Preview mostrando como as cores aparecem para{" "}
								{BLINDNESS_OPTIONS.find(
									(o) => o.value === blindnessType,
								)?.label.toLowerCase()}
								.
							</p>
						)}
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border h-full">
					{result ? (
						<>
							<div className="p-4 space-y-1">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Taxa de contraste
								</h3>
								<div className="flex items-baseline gap-1 justify-center py-3">
									<span className="font-mono text-4xl font-semibold tabular-nums">
										{result.ratio.toFixed(2)}
									</span>
									<span className="font-mono text-xl text-muted-foreground">
										:1
									</span>
								</div>
							</div>

							<div className="p-4 space-y-3">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Critérios WCAG 2.1
								</h3>

								<div className="space-y-1">
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
										Texto normal
									</p>
									<CriterionRow
										label="Nível AA"
										level={result.normalAA === "AAA" ? "AA" : result.normalAA}
										threshold="4.5"
									/>
									<CriterionRow
										label="Nível AAA"
										level={result.normalAAA}
										threshold="7.0"
									/>
								</div>

								<div className="space-y-1 pt-1">
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
										Texto grande (18pt+)
									</p>
									<CriterionRow
										label="Nível AA"
										level={result.largeAA === "AAA" ? "AA" : result.largeAA}
										threshold="3.0"
									/>
									<CriterionRow
										label="Nível AAA"
										level={result.largeAAA}
										threshold="4.5"
									/>
								</div>

								<div className="space-y-1 pt-1">
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
										Componentes de UI
									</p>
									<CriterionRow
										label="Nível AA"
										level={result.uiComponents}
										threshold="3.0"
									/>
								</div>
							</div>

							{suggestionAA && (
								<div className="p-4 space-y-2">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Sugestão para AA
									</h3>
									<p className="text-xs text-muted-foreground">
										Cor próxima que atinge 4.5:1 (nível AA para texto normal):
									</p>
									<div className="flex items-center gap-2">
										<div
											style={{ backgroundColor: suggestionAA }}
											className="h-6 w-6 shrink-0 rounded border border-border"
										/>
										<span className="font-mono text-xs flex-1">
											{suggestionAA.toUpperCase()}
										</span>
										<CopyButton
											text={suggestionAA.toUpperCase()}
											size="icon-xs"
											variant="ghost"
											iconOnly
										/>
									</div>
									<Button
										size="sm"
										variant="outline"
										className="w-full"
										onClick={() => setFgHex(suggestionAA)}
									>
										Aplicar sugestão
									</Button>
								</div>
							)}
							{!suggestionAA && suggestionAAA && (
								<div className="p-4 space-y-2">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Sugestão para AAA
									</h3>
									<p className="text-xs text-muted-foreground">
										Cor próxima que atinge 7:1 (nível AAA para texto normal):
									</p>
									<div className="flex items-center gap-2">
										<div
											style={{ backgroundColor: suggestionAAA }}
											className="h-6 w-6 shrink-0 rounded border border-border"
										/>
										<span className="font-mono text-xs flex-1">
											{suggestionAAA.toUpperCase()}
										</span>
										<CopyButton
											text={suggestionAAA.toUpperCase()}
											size="icon-xs"
											variant="ghost"
											iconOnly
										/>
									</div>
									<Button
										size="sm"
										variant="outline"
										className="w-full"
										onClick={() => setFgHex(suggestionAAA)}
									>
										Aplicar sugestão
									</Button>
								</div>
							)}
						</>
					) : (
						<div className="p-4">
							<p className="text-xs text-muted-foreground">
								Insira cores válidas em formato HEX.
							</p>
						</div>
					)}
				</div>
			}
		/>
	);
}
