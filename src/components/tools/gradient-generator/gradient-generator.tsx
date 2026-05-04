"use client";

import { Shuffle, Trash } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/shared/slider";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { ColorStop, GradientType } from "@/lib/color/gradient";
import {
	buildGradientCSS,
	generateStopId,
	getRandomColor,
} from "@/lib/color/gradient";

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
		const last = stops[stops.length - 1];
		setStops((prev) => [
			...prev,
			{
				id: generateStopId(),
				color: getRandomColor(),
				position: Math.min(100, last.position + 20),
			},
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
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="gradient-type"
						className="block text-sm font-medium text-foreground"
					>
						Tipo
					</label>
					<NativeSelect
						id="gradient-type"
						value={type}
						onChange={(e) => setType(e.target.value as GradientType)}
					>
						<option value="linear">Linear</option>
						<option value="radial">Radial</option>
					</NativeSelect>
				</div>

				{type === "linear" && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="gradient-angle"
								className="text-sm font-medium text-foreground"
							>
								Ângulo
							</label>
							<div className="flex items-center gap-2">
								<Input
									id="gradient-angle-input"
									type="number"
									value={angle}
									onChange={(e) => {
										const val = Number(e.target.value);
										if (!Number.isNaN(val))
											setAngle(Math.min(360, Math.max(0, val)));
									}}
									className="h-8 w-20 text-right font-mono"
									min={0}
									max={360}
								/>
								<span className="text-sm text-muted-foreground">°</span>
							</div>
						</div>
						<Slider
							id="gradient-angle"
							value={[angle]}
							onValueChange={([v]) => setAngle(v)}
							min={0}
							max={360}
							step={1}
						/>
					</div>
				)}

				<div className="space-y-3">
					<p className="text-sm font-medium text-foreground">Cores</p>
					{stops.map((stop, i) => (
						<div key={stop.id} className="flex items-center gap-3">
							<Input
								type="color"
								value={stop.color}
								onChange={(e) => updateStop(i, { color: e.target.value })}
								className="h-10 w-16 cursor-pointer p-1"
							/>
							<Input
								type="text"
								value={stop.color.toUpperCase()}
								onChange={(e) => updateStop(i, { color: e.target.value })}
								className="w-28 font-mono uppercase"
								maxLength={7}
							/>
							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Posição</span>
									<span className="text-xs text-muted-foreground">
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
							</div>
							{stops.length > 2 && (
								<Button
									variant="secondary"
									onClick={() => removeStop(i)}
									className="shrink-0"
								>
									<Trash />
									Remover
								</Button>
							)}
						</div>
					))}
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={addStop}
							disabled={stops.length >= 5}
						>
							Adicionar cor
						</Button>
						<Button variant="outline" onClick={randomize}>
							<Shuffle className="mr-2 h-4 w-4" />
							Aleatório
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-2xl space-y-4">
				<div
					className="h-48 w-full rounded-lg border-2 border-border shadow-sm"
					style={{ background: gradientCSS }}
				/>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label
							htmlFor="gradient-css"
							className="block text-sm font-medium text-foreground"
						>
							Código CSS
						</label>
					<CopyButton text={
						`background: ${gradientCSS};`
					} label="Copiar" variant="outline" />
					</div>
					<pre
						id="gradient-css"
						className="overflow-x-auto rounded-lg p-4 font-mono text-sm"
						style={{ background: "#1b1b1b", color: "#fafafa" }}
					>
						<code>background: {gradientCSS};</code>
					</pre>
				</div>
			</div>
		</div>
	);
}
