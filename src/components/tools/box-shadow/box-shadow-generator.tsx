"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Slider } from "@/components/shared/slider";
import { OptionSwitch } from "@/components/shared/option-switch";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	buildAllShadowsCSS,
	createDefaultLayer,
	PRESETS,
	type ShadowLayer,
} from "@/lib/color/box-shadow";

function updateLayer(
	layers: ShadowLayer[],
	index: number,
	updates: Partial<ShadowLayer>,
): ShadowLayer[] {
	return layers.map((l, i) => (i === index ? { ...l, ...updates } : l));
}

export function BoxShadowGenerator() {
	const [layers, setLayers] = useState<ShadowLayer[]>([createDefaultLayer()]);
	const [activeLayerIndex, setActiveLayerIndex] = useState(0);
	const [elementBgColor, setElementBgColor] = useState("#ffffff");
	const [containerBgColor, setContainerBgColor] = useState("#f8fafc");
	const [outputMode, setOutputMode] = useState<"css" | "tailwind">("css");

	const activeLayer = layers[activeLayerIndex];
	const shadowCSS = buildAllShadowsCSS(layers);

	function handleUpdate(index: number, updates: Partial<ShadowLayer>) {
		setLayers((prev) => updateLayer(prev, index, updates));
	}

	function addLayer() {
		if (layers.length >= 5) return;
		setLayers((prev) => [...prev, createDefaultLayer()]);
		setActiveLayerIndex(layers.length);
	}

	function removeLayer(index: number) {
		if (layers.length <= 1) return;
		setLayers((prev) => prev.filter((_, i) => i !== index));
		if (activeLayerIndex >= index && activeLayerIndex > 0) {
			setActiveLayerIndex((prev) => prev - 1);
		}
	}

	function applyPreset(presetLayers: ShadowLayer[]) {
		setLayers(presetLayers.map((l) => ({ ...l, id: crypto.randomUUID() })));
		setActiveLayerIndex(0);
	}

	const layerTabs = layers.map((_, i) => ({
		label: `Camada ${i + 1}`,
		value: String(i),
	}));

	const fullCSS = shadowCSS
		? `-webkit-box-shadow: ${shadowCSS};
-moz-box-shadow: ${shadowCSS};
box-shadow: ${shadowCSS};`
		: "box-shadow: none;";

	const tailwindCSS = shadowCSS
		? `shadow-[${shadowCSS.replace(/ /g, "_")}]`
		: "shadow-none";

	const displayCode = outputMode === "css" ? fullCSS : tailwindCSS;

	return (
		<div className="space-y-8">
			{/* Layer Tabs */}
			<div className="flex flex-wrap items-center gap-2">
				<OptionSwitch
					options={layerTabs}
					value={String(activeLayerIndex)}
					onChange={(v) => setActiveLayerIndex(Number(v))}
				/>
				{layers.length > 1 && (
					<Button
						variant="secondary"
						size="sm"
						onClick={() => removeLayer(activeLayerIndex)}
					>
						<Trash className="mr-1 h-4 w-4" />
						Remover
					</Button>
				)}
				<Button
					variant="outline"
					size="sm"
					onClick={addLayer}
					disabled={layers.length >= 5}
				>
					<Plus className="mr-1 h-4 w-4" />
					Adicionar
				</Button>
			</div>

			{/* Active Layer Controls */}
			{activeLayer && (
				<div className="max-w-2xl space-y-4">
					{/* Color + Inset Toggle */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">Cor</p>
							<div className="flex items-center gap-3">
								<Input
									type="color"
									value={activeLayer.color}
									onChange={(e) =>
										handleUpdate(activeLayerIndex, {
											color: e.target.value,
										})
									}
									className="h-10 w-16 cursor-pointer p-1"
								/>
								<Input
									type="text"
									value={activeLayer.color.toUpperCase()}
									onChange={(e) =>
										handleUpdate(activeLayerIndex, {
											color: e.target.value,
										})
									}
									className="w-28 font-mono uppercase"
									maxLength={7}
								/>
							</div>
						</div>
						<div className="flex items-center gap-3 self-end">
							<span className="text-sm font-medium text-foreground">Tipo:</span>
							<OptionSwitch
								options={[
									{ label: "Normal", value: "false" },
									{ label: "Inset", value: "true" },
								]}
								value={String(activeLayer.inset)}
								onChange={(v) =>
									handleUpdate(activeLayerIndex, {
										inset: v === "true",
									})
								}
							/>
						</div>
					</div>

					{/* Opacity */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-foreground">Opacidade</p>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={activeLayer.opacity}
									onChange={(e) => {
										const val = Number(e.target.value);
										if (!Number.isNaN(val))
											handleUpdate(activeLayerIndex, {
												opacity: Math.min(100, Math.max(0, val)),
											});
									}}
									className="h-8 w-20 text-right font-mono"
									min={0}
									max={100}
								/>
								<span className="text-sm text-muted-foreground">%</span>
							</div>
						</div>
						<Slider
							value={[activeLayer.opacity]}
							onValueChange={([v]) =>
								handleUpdate(activeLayerIndex, { opacity: v })
							}
							min={0}
							max={100}
							step={1}
						/>
					</div>

					{/* offsetX + offsetY */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-foreground">
									Deslocamento X
								</p>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={activeLayer.offsetX}
										onChange={(e) => {
											const val = Number(e.target.value);
											if (!Number.isNaN(val))
												handleUpdate(activeLayerIndex, {
													offsetX: Math.min(50, Math.max(-50, val)),
												});
										}}
										className="h-8 w-20 text-right font-mono"
										min={-50}
										max={50}
									/>
									<span className="text-sm text-muted-foreground">px</span>
								</div>
							</div>
							<Slider
								value={[activeLayer.offsetX]}
								onValueChange={([v]) =>
									handleUpdate(activeLayerIndex, { offsetX: v })
								}
								min={-50}
								max={50}
								step={1}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-foreground">
									Deslocamento Y
								</p>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={activeLayer.offsetY}
										onChange={(e) => {
											const val = Number(e.target.value);
											if (!Number.isNaN(val))
												handleUpdate(activeLayerIndex, {
													offsetY: Math.min(50, Math.max(-50, val)),
												});
										}}
										className="h-8 w-20 text-right font-mono"
										min={-50}
										max={50}
									/>
									<span className="text-sm text-muted-foreground">px</span>
								</div>
							</div>
							<Slider
								value={[activeLayer.offsetY]}
								onValueChange={([v]) =>
									handleUpdate(activeLayerIndex, { offsetY: v })
								}
								min={-50}
								max={50}
								step={1}
							/>
						</div>
					</div>

					{/* blur + spread */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-foreground">
									Desfoque (Blur)
								</p>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={activeLayer.blur}
										onChange={(e) => {
											const val = Number(e.target.value);
											if (!Number.isNaN(val))
												handleUpdate(activeLayerIndex, {
													blur: Math.min(100, Math.max(0, val)),
												});
										}}
										className="h-8 w-20 text-right font-mono"
										min={0}
										max={100}
									/>
									<span className="text-sm text-muted-foreground">px</span>
								</div>
							</div>
							<Slider
								value={[activeLayer.blur]}
								onValueChange={([v]) =>
									handleUpdate(activeLayerIndex, { blur: v })
								}
								min={0}
								max={100}
								step={1}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-foreground">
									Espalhamento (Spread)
								</p>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={activeLayer.spread}
										onChange={(e) => {
											const val = Number(e.target.value);
											if (!Number.isNaN(val))
												handleUpdate(activeLayerIndex, {
													spread: Math.min(50, Math.max(-50, val)),
												});
										}}
										className="h-8 w-20 text-right font-mono"
										min={-50}
										max={50}
									/>
									<span className="text-sm text-muted-foreground">px</span>
								</div>
							</div>
							<Slider
								value={[activeLayer.spread]}
								onValueChange={([v]) =>
									handleUpdate(activeLayerIndex, { spread: v })
								}
								min={-50}
								max={50}
								step={1}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Preview */}
			<div className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex items-center gap-3">
						<p className="text-sm font-medium text-foreground">
							Cor do elemento
						</p>
						<Input
							type="color"
							value={elementBgColor}
							onChange={(e) => setElementBgColor(e.target.value)}
							className="h-10 w-16 cursor-pointer p-1"
						/>
						<Input
							type="text"
							value={elementBgColor.toUpperCase()}
							onChange={(e) => setElementBgColor(e.target.value)}
							className="w-28 font-mono uppercase"
							maxLength={7}
						/>
					</div>
					<div className="flex items-center gap-3">
						<p className="text-sm font-medium text-foreground">Cor de fundo</p>
						<Input
							type="color"
							value={containerBgColor}
							onChange={(e) => setContainerBgColor(e.target.value)}
							className="h-10 w-16 cursor-pointer p-1"
						/>
						<Input
							type="text"
							value={containerBgColor.toUpperCase()}
							onChange={(e) => setContainerBgColor(e.target.value)}
							className="w-28 font-mono uppercase"
							maxLength={7}
						/>
					</div>
				</div>

				<div
					className="flex flex-wrap items-center gap-8 rounded-lg border p-8"
					style={{ backgroundColor: containerBgColor }}
				>
					<div className="text-center space-y-2">
						<div
							className="mx-auto h-32 w-32 rounded-lg border"
							style={{
								backgroundColor: elementBgColor,
								boxShadow: shadowCSS,
							}}
						/>
						<p className="text-xs text-muted-foreground">Quadrado</p>
					</div>
					<div className="text-center space-y-2">
						<button
							type="button"
							className="rounded-md px-6 py-3 text-sm font-medium"
							style={{
								backgroundColor: elementBgColor,
								boxShadow: shadowCSS,
								color:
									elementBgColor === "#ffffff" || elementBgColor === "#FFFFFF"
										? "#000"
										: "#fff",
							}}
						>
							Botão de teste
						</button>
						<p className="text-xs text-muted-foreground">Botão</p>
					</div>
				</div>
			</div>

			{/* Presets */}
			<div className="space-y-3">
				<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Presets</p>
				<div className="flex flex-wrap gap-3">
					{PRESETS.map((preset) => (
						<button
							key={preset.name}
							type="button"
							onClick={() => applyPreset(preset.layers)}
							className="flex flex-col items-center gap-2 rounded-md border p-3 transition-colors hover:bg-muted"
						>
							<div
								className="h-12 w-12 rounded-md border bg-card"
								style={{
									boxShadow: buildAllShadowsCSS(preset.layers),
								}}
							/>
							<span className="text-xs text-muted-foreground">
								{preset.name}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* CSS Output */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Código gerado</p>
					<OptionSwitch
						options={[
							{ label: "CSS", value: "css" },
							{ label: "Tailwind", value: "tailwind" },
						]}
						value={outputMode}
						onChange={(v) => setOutputMode(v as "css" | "tailwind")}
					/>
				</div>
				<pre className="overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">
					<code>{displayCode}</code>
				</pre>
				<div className="flex justify-end">
					<CopyButton text={displayCode} label="Copiar" />
				</div>
			</div>
		</div>
	);
}
