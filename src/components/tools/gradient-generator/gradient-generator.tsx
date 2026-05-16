"use client";

import { Shuffle, Trash } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { NumberInput } from "@/components/shared/number-input";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColorStop, GradientType } from "@/lib/color/gradient";
import {
	buildGradientCSS,
	generateStopId,
	getRandomColor,
} from "@/lib/color/gradient";
import { cn } from "@/lib/utils";

function buildTailwindClass(css: string): string {
	return `bg-[${css.replace(/\s+/g, "_")}]`;
}

const GRADIENT_TYPES = [
	{ value: "linear", label: "Linear" },
	{ value: "radial", label: "Radial" },
] as const;

const INITIAL_STOPS: ColorStop[] = [
	{ id: generateStopId(), color: "#3b82f6", position: 0 },
	{ id: generateStopId(), color: "#8b5cf6", position: 100 },
];

export function GradientGenerator() {
	const [type, setType] = useState<GradientType>("linear");
	const [angle, setAngle] = useState(90);
	const [stops, setStops] = useState<ColorStop[]>(INITIAL_STOPS);

	const gradientCSS = buildGradientCSS(type, stops, angle);

	function updateStop(index: number, updates: Partial<ColorStop>) {
		setStops((prev) =>
			prev.map((s, i) => (i === index ? { ...s, ...updates } : s)),
		);
	}

	function addStop() {
		if (stops.length >= 5) return;
		const sorted = [...stops].sort((a, b) => a.position - b.position);
		let maxGap = -1;
		let insertAt = 50;
		for (let i = 0; i < sorted.length - 1; i++) {
			const gap = sorted[i + 1].position - sorted[i].position;
			if (gap > maxGap) {
				maxGap = gap;
				insertAt = Math.round(
					(sorted[i].position + sorted[i + 1].position) / 2,
				);
			}
		}
		setStops((prev) => [
			...prev,
			{ id: generateStopId(), color: getRandomColor(), position: insertAt },
		]);
	}

	function removeStop(index: number) {
		if (stops.length <= 2) return;
		setStops((prev) => prev.filter((_, i) => i !== index));
	}

	function randomize() {
		setStops([
			{ id: generateStopId(), color: getRandomColor(), position: 0 },
			{ id: generateStopId(), color: getRandomColor(), position: 100 },
		]);
	}

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Tipo
						</h3>
						<div className="space-y-1">
							{GRADIENT_TYPES.map((gt) => (
								<button
									key={gt.value}
									type="button"
									onClick={() => setType(gt.value)}
									className={cn(
										"flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
										type === gt.value
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{gt.label}
								</button>
							))}
						</div>
					</div>

					{type === "linear" && (
						<div className="p-4 space-y-2">
							<div className="flex items-center justify-between">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Ângulo
								</h3>
								<div className="flex items-center gap-1">
									<NumberInput
										value={angle}
										onChange={(v) => setAngle(v)}
										className="h-7 w-16 text-right text-xs"
										min={0}
										max={360}
									/>
									<span className="text-xs text-muted-foreground">°</span>
								</div>
							</div>
							<Slider
								value={[angle]}
								onValueChange={([v]) => setAngle(v)}
								min={0}
								max={360}
								step={1}
							/>
						</div>
					)}

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Cores
						</h3>
						{stops.map((stop, i) => (
							<div key={stop.id} className="space-y-2">
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={stop.color}
										onChange={(e) => updateStop(i, { color: e.target.value })}
										className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
										aria-label={`Cor ${i + 1}`}
									/>
									<Input
										type="text"
										value={stop.color.toUpperCase()}
										onChange={(e) => {
											const v = e.target.value;
											if (/^#[0-9A-Fa-f]{0,6}$/.test(v))
												updateStop(i, { color: v });
										}}
										className="h-7 w-24 font-mono text-xs uppercase"
										maxLength={7}
									/>
									<span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
										{stop.position}%
									</span>
								</div>
								<Slider
									value={[stop.position]}
									onValueChange={([v]) => updateStop(i, { position: v })}
									min={0}
									max={100}
									step={1}
								/>
								{stops.length > 2 && (
									<div className="flex justify-end">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeStop(i)}
											className="h-6 px-2 text-xs text-muted-foreground"
										>
											<Trash className="h-3 w-3 mr-1" />
											Remover
										</Button>
									</div>
								)}
							</div>
						))}
						<div className="flex gap-2 pt-1">
							<Button
								variant="outline"
								size="sm"
								onClick={addStop}
								disabled={stops.length >= 5}
								className="text-xs h-7"
							>
								+ Adicionar
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={randomize}
								className="text-xs h-7"
							>
								<Shuffle className="h-3 w-3 mr-1" />
								Aleatório
							</Button>
						</div>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col flex-1">
					<div className="p-4 flex-1 flex flex-col">
						<div
							className="w-full flex-1 min-h-40 rounded-md border border-border"
							style={{ background: gradientCSS }}
						/>
					</div>

					<div className="border-t border-border p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							CSS
						</h3>
						<pre className="rounded-md bg-muted border border-border p-3 font-mono text-[11px] overflow-x-auto">
							<code>background: {gradientCSS};</code>
						</pre>
						<div className="flex justify-end">
							<CopyButton
								text={`background: ${gradientCSS};`}
								label="Copiar CSS"
								variant="outline"
								size="sm"
							/>
						</div>
					</div>

					<div className="border-t border-border p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							Tailwind
						</h3>
						<pre className="rounded-md bg-muted border border-border p-3 font-mono text-[11px] overflow-x-auto break-all whitespace-pre-wrap">
							<code>{buildTailwindClass(gradientCSS)}</code>
						</pre>
						<div className="flex justify-end">
							<CopyButton
								text={buildTailwindClass(gradientCSS)}
								label="Copiar Tailwind"
								variant="outline"
								size="sm"
							/>
						</div>
					</div>
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Informações
						</h3>
						<div className="flex items-center justify-between py-0.5">
							<span className="text-xs text-muted-foreground">Tipo</span>
							<span className="text-xs text-foreground">
								{type === "linear" ? "Linear" : "Radial"}
							</span>
						</div>
						{type === "linear" && (
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Ângulo</span>
								<span className="font-mono text-[11px] tabular-nums text-foreground">
									{angle}°
								</span>
							</div>
						)}
						<div className="flex items-center justify-between py-0.5">
							<span className="text-xs text-muted-foreground">
								Paradas de cor
							</span>
							<span className="font-mono text-[11px] tabular-nums text-foreground">
								{stops.length}
							</span>
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Ações
						</h3>
						<CopyButton
							text={`background: ${gradientCSS};`}
							label="Copiar CSS completo"
							variant="outline"
							size="sm"
							className="w-full"
						/>
						<CopyButton
							text={gradientCSS}
							label="Copiar valor"
							variant="outline"
							size="sm"
							className="w-full"
						/>
						<CopyButton
							text={buildTailwindClass(gradientCSS)}
							label="Copiar Tailwind"
							variant="outline"
							size="sm"
							className="w-full"
						/>
					</div>
				</div>
			}
		/>
	);
}
