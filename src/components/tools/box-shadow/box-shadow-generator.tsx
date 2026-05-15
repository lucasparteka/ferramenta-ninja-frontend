"use client";

import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutA } from "@/components/shared/layout-a";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	buildAllShadowsCSS,
	createDefaultLayer,
	PRESETS,
	type ShadowLayer,
} from "@/lib/color/box-shadow";
import { cn } from "@/lib/utils";

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

	const fullCSS = shadowCSS
		? `-webkit-box-shadow: ${shadowCSS};\n-moz-box-shadow: ${shadowCSS};\nbox-shadow: ${shadowCSS};`
		: "box-shadow: none;";

	const tailwindCSS = shadowCSS
		? `shadow-[${shadowCSS.replace(/ /g, "_")}]`
		: "shadow-none";

	return (
		<LayoutA
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Camadas
						</h3>
						<div className="space-y-1">
							{layers.map((layer, i) => (
								<button
									key={layer.id}
									type="button"
									onClick={() => setActiveLayerIndex(i)}
									className={cn(
										"flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
										activeLayerIndex === i
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									Camada {i + 1}
								</button>
							))}
						</div>
						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								size="sm"
								onClick={addLayer}
								disabled={layers.length >= 5}
								className="text-xs h-7"
							>
								<Plus className="h-3 w-3 mr-1" />
								Adicionar
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => removeLayer(activeLayerIndex)}
								disabled={layers.length <= 1}
								className="text-xs h-7"
							>
								<Trash className="h-3 w-3 mr-1" />
								Remover
							</Button>
						</div>
					</div>

					{activeLayer && (
						<>
							<div className="p-4 space-y-3">
								<div className="space-y-2">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Cor
									</h3>
									<div className="flex items-center gap-2">
										<input
											type="color"
											value={activeLayer.color}
											onChange={(e) =>
												handleUpdate(activeLayerIndex, {
													color: e.target.value,
												})
											}
											className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
											aria-label="Cor da sombra"
										/>
										<Input
											type="text"
											value={activeLayer.color.toUpperCase()}
											onChange={(e) => {
												const v = e.target.value;
												if (/^#[0-9A-Fa-f]{0,6}$/.test(v))
													handleUpdate(activeLayerIndex, { color: v });
											}}
											className="h-7 w-24 font-mono text-xs uppercase"
											maxLength={7}
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Tipo
									</h3>
									<div className="space-y-1">
										{(["Normal", "Inset"] as const).map((label) => {
											const isInset = label === "Inset";
											return (
												<button
													key={label}
													type="button"
													onClick={() =>
														handleUpdate(activeLayerIndex, { inset: isInset })
													}
													className={cn(
														"flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
														activeLayer.inset === isInset
															? "bg-accent text-accent-foreground"
															: "text-muted-foreground hover:bg-muted hover:text-foreground",
													)}
												>
													{label}
												</button>
											);
										})}
									</div>
								</div>
							</div>

							<div className="p-4 space-y-2">
								<div className="flex items-center justify-between">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Opacidade
									</h3>
									<div className="flex items-center gap-1">
										<Input
											type="number"
											value={activeLayer.opacity}
											onChange={(e) => {
												const v = Number(e.target.value);
												if (!Number.isNaN(v))
													handleUpdate(activeLayerIndex, {
														opacity: Math.min(100, Math.max(0, v)),
													});
											}}
											className="h-7 w-16 text-right font-mono text-xs"
											min={0}
											max={100}
										/>
										<span className="text-xs text-muted-foreground">%</span>
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

							<div className="p-4 space-y-3">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
											Deslocamento X
										</h3>
										<div className="flex items-center gap-1">
											<Input
												type="number"
												value={activeLayer.offsetX}
												onChange={(e) => {
													const v = Number(e.target.value);
													if (!Number.isNaN(v))
														handleUpdate(activeLayerIndex, {
															offsetX: Math.min(50, Math.max(-50, v)),
														});
												}}
												className="h-7 w-16 text-right font-mono text-xs"
												min={-50}
												max={50}
											/>
											<span className="text-xs text-muted-foreground">px</span>
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
										<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
											Deslocamento Y
										</h3>
										<div className="flex items-center gap-1">
											<Input
												type="number"
												value={activeLayer.offsetY}
												onChange={(e) => {
													const v = Number(e.target.value);
													if (!Number.isNaN(v))
														handleUpdate(activeLayerIndex, {
															offsetY: Math.min(50, Math.max(-50, v)),
														});
												}}
												className="h-7 w-16 text-right font-mono text-xs"
												min={-50}
												max={50}
											/>
											<span className="text-xs text-muted-foreground">px</span>
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

							<div className="p-4 space-y-3">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
											Desfoque
										</h3>
										<div className="flex items-center gap-1">
											<Input
												type="number"
												value={activeLayer.blur}
												onChange={(e) => {
													const v = Number(e.target.value);
													if (!Number.isNaN(v))
														handleUpdate(activeLayerIndex, {
															blur: Math.min(100, Math.max(0, v)),
														});
												}}
												className="h-7 w-16 text-right font-mono text-xs"
												min={0}
												max={100}
											/>
											<span className="text-xs text-muted-foreground">px</span>
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
										<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
											Espalhamento
										</h3>
										<div className="flex items-center gap-1">
											<Input
												type="number"
												value={activeLayer.spread}
												onChange={(e) => {
													const v = Number(e.target.value);
													if (!Number.isNaN(v))
														handleUpdate(activeLayerIndex, {
															spread: Math.min(50, Math.max(-50, v)),
														});
												}}
												className="h-7 w-16 text-right font-mono text-xs"
												min={-50}
												max={50}
											/>
											<span className="text-xs text-muted-foreground">px</span>
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
						</>
					)}

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Visualização
						</h3>
						<div className="space-y-1.5">
							<p className="text-xs font-medium text-foreground">Elemento</p>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={elementBgColor}
									onChange={(e) => setElementBgColor(e.target.value)}
									className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
									aria-label="Cor do elemento"
								/>
								<Input
									type="text"
									value={elementBgColor.toUpperCase()}
									onChange={(e) => {
										const v = e.target.value;
										if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setElementBgColor(v);
									}}
									className="h-7 w-24 font-mono text-xs uppercase"
									maxLength={7}
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<p className="text-xs font-medium text-foreground">Fundo</p>
							<div className="flex items-center gap-2">
								<input
									type="color"
									value={containerBgColor}
									onChange={(e) => setContainerBgColor(e.target.value)}
									className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5 shrink-0"
									aria-label="Cor de fundo do preview"
								/>
								<Input
									type="text"
									value={containerBgColor.toUpperCase()}
									onChange={(e) => {
										const v = e.target.value;
										if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setContainerBgColor(v);
									}}
									className="h-7 w-24 font-mono text-xs uppercase"
									maxLength={7}
								/>
							</div>
						</div>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex flex-col flex-1">
					<div
						className="p-8 flex-1 flex items-center justify-center min-h-50"
						style={{ backgroundColor: containerBgColor }}
					>
						<div className="flex flex-wrap items-center justify-center gap-8">
							<div className="text-center space-y-2">
								<div
									className="mx-auto h-32 w-32 rounded-lg"
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
											elementBgColor === "#ffffff" ||
											elementBgColor === "#FFFFFF"
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

					<div className="border-t border-border p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							CSS
						</h3>
						<pre className="rounded-md bg-muted border border-border p-3 font-mono text-[11px] overflow-x-auto whitespace-pre">
							<code>{fullCSS}</code>
						</pre>
						<div className="flex justify-end">
							<CopyButton
								text={fullCSS}
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
							<code>{tailwindCSS}</code>
						</pre>
						<div className="flex justify-end">
							<CopyButton
								text={tailwindCSS}
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
					<div className="p-4">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Presets
						</h3>
						<div className="grid grid-cols-3 gap-2">
							{PRESETS.map((preset) => (
								<button
									key={preset.name}
									type="button"
									onClick={() => applyPreset(preset.layers)}
									className="flex flex-col items-center gap-1.5 rounded-md border border-border p-2 transition-colors hover:bg-muted"
								>
									<div
										className="h-10 w-10 rounded-md"
										style={{
											backgroundColor: "#ffffff",
											boxShadow: buildAllShadowsCSS(preset.layers),
										}}
									/>
									<span className="text-[10px] text-muted-foreground leading-tight text-center">
										{preset.name}
									</span>
								</button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Informações
						</h3>
						<div className="flex items-center justify-between py-0.5">
							<span className="text-xs text-muted-foreground">Camadas</span>
							<span className="font-mono text-[11px] tabular-nums text-foreground">
								{layers.length}
							</span>
						</div>
						{activeLayer && (
							<>
								<div className="flex items-center justify-between py-0.5">
									<span className="text-xs text-muted-foreground">Tipo</span>
									<span className="text-xs text-foreground">
										{activeLayer.inset ? "Inset" : "Normal"}
									</span>
								</div>
								<div className="flex items-center justify-between py-0.5">
									<span className="text-xs text-muted-foreground">Blur</span>
									<span className="font-mono text-[11px] tabular-nums text-foreground">
										{activeLayer.blur}px
									</span>
								</div>
							</>
						)}
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Ações
						</h3>
						<CopyButton
							text={fullCSS}
							label="Copiar CSS completo"
							variant="outline"
							size="sm"
							className="w-full"
						/>
						<CopyButton
							text={shadowCSS || "none"}
							label="Copiar valor"
							variant="outline"
							size="sm"
							className="w-full"
						/>
						<CopyButton
							text={tailwindCSS}
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
