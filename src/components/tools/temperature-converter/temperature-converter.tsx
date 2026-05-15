"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";

type TemperatureScale = "celsius" | "fahrenheit" | "kelvin";

const SCALE_LABELS: Record<TemperatureScale, string> = {
	celsius: "Celsius",
	fahrenheit: "Fahrenheit",
	kelvin: "Kelvin",
};

const SCALE_SHORT: Record<TemperatureScale, string> = {
	celsius: "°C",
	fahrenheit: "°F",
	kelvin: "K",
};

const SCALES: TemperatureScale[] = ["celsius", "fahrenheit", "kelvin"];

function convertTemperature(
	value: number,
	from: TemperatureScale,
	to: TemperatureScale,
): number {
	if (from === to) return value;
	let celsius = value;
	if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
	else if (from === "kelvin") celsius = value - 273.15;
	if (to === "celsius") return celsius;
	if (to === "fahrenheit") return celsius * (9 / 5) + 32;
	if (to === "kelvin") return celsius + 273.15;
	return celsius;
}

function getFormula(from: TemperatureScale, to: TemperatureScale): string {
	if (from === to) return "";
	const f: Record<string, string> = {
		"celsius→fahrenheit": "°F = (°C × 9/5) + 32",
		"celsius→kelvin": "K = °C + 273.15",
		"fahrenheit→celsius": "°C = (°F − 32) × 5/9",
		"fahrenheit→kelvin": "K = (°F − 32) × 5/9 + 273.15",
		"kelvin→celsius": "°C = K − 273.15",
		"kelvin→fahrenheit": "°F = (K − 273.15) × 9/5 + 32",
	};
	return f[`${from}→${to}`] ?? "";
}

function formatNum(n: number): string {
	return n.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4,
	});
}

export function TemperatureConverter() {
	const [value, setValue] = useState("0");
	const [fromScale, setFromScale] = useState<TemperatureScale>("celsius");
	const [toScale, setToScale] = useState<TemperatureScale>("fahrenheit");

	const numeric = Number(value.replace(",", "."));
	const valid = !Number.isNaN(numeric) && value.trim() !== "";

	const result = useMemo(() => {
		if (!valid) return null;
		return convertTemperature(numeric, fromScale, toScale);
	}, [numeric, fromScale, toScale, valid]);

	const allResults = useMemo(() => {
		if (!valid) return null;
		return Object.fromEntries(
			SCALES.map((s) => [s, convertTemperature(numeric, fromScale, s)]),
		) as Record<TemperatureScale, number>;
	}, [numeric, fromScale, valid]);

	function handleSwap() {
		setFromScale(toScale);
		setToScale(fromScale);
	}

	function handleClear() {
		setValue("");
	}

	const copyStr =
		valid && result !== null && Number.isFinite(result)
			? `${formatNum(result)} ${SCALE_SHORT[toScale]}`
			: "";

	return (
		<LayoutC
			toolbar={
				<div className="flex items-center gap-3">
					<h1 className="text-sm font-semibold tracking-tight">
						Conversor de Temperatura
					</h1>
					<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
						CONVERSÃO
					</span>
				</div>
			}
			left={
				<>
					<PaneHeader
						title="Entrada"
						actions={
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Limpar"
								onClick={handleClear}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						}
					/>
					<div className="flex flex-1 flex-col p-3 pt-5 space-y-3 min-h-75">
						<div className="flex flex-col gap-2 md:flex-row md:items-end">
							<div className="space-y-1.5 flex-1">
								<Label
									htmlFor="temp-from"
									className="text-xs font-medium text-foreground"
								>
									Escala origem
								</Label>
								<NativeSelect
									id="temp-from"
									value={fromScale}
									onChange={(e) =>
										setFromScale(e.target.value as TemperatureScale)
									}
									className="w-full"
								>
									{SCALES.map((s) => (
										<option key={s} value={s}>
											{SCALE_LABELS[s]} ({SCALE_SHORT[s]})
										</option>
									))}
								</NativeSelect>
							</div>
							<Button
								variant="secondary"
								type="button"
								onClick={handleSwap}
								aria-label="Inverter escalas"
								size="icon"
								className="self-center lg:self-end"
							>
								<ArrowLeftRight className="max-lg:rotate-90" />
							</Button>
							<div className="space-y-1.5 flex-1">
								<Label
									htmlFor="temp-to"
									className="text-xs font-medium text-foreground"
								>
									Converter para
								</Label>
								<NativeSelect
									id="temp-to"
									value={toScale}
									onChange={(e) =>
										setToScale(e.target.value as TemperatureScale)
									}
									className="w-full"
								>
									{SCALES.map((s) => (
										<option key={s} value={s}>
											{SCALE_LABELS[s]} ({SCALE_SHORT[s]})
										</option>
									))}
								</NativeSelect>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="temp-value"
								className="text-xs font-medium text-foreground"
							>
								Valor em {SCALE_SHORT[fromScale]}
							</Label>
							<Input
								autoComplete="off"
								id="temp-value"
								type="text"
								inputMode="decimal"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="0"
								aria-label={`Valor em ${SCALE_LABELS[fromScale]}`}
							/>
						</div>
					</div>
				</>
			}
			right={
				<>
					<PaneHeader
						title="Resultado"
						actions={
							<CopyButton
								text={copyStr}
								disabled={!copyStr}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						}
					/>
					{valid && result !== null && Number.isFinite(result) ? (
						<div className="flex flex-1 flex-col">
							<div className="p-3">
								<p className="text-xl font-semibold tabular-nums text-foreground">
									{formatNum(result)} {SCALE_SHORT[toScale]}
								</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									{getFormula(fromScale, toScale)}
								</p>
							</div>
							<div className="border-t border-border pt-4">
								<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground p-3">
									Todas as escalas
								</p>
								{SCALES.map((s) => {
									const isActive = s === fromScale;
									return (
										<button
											key={s}
											type="button"
											tabIndex={isActive ? -1 : 0}
											onClick={() => !isActive && setFromScale(s)}
											aria-label={`Usar ${SCALE_LABELS[s]} como base`}
											className={cn(
												"group flex w-full items-center justify-between border-t border-border p-3",
												isActive
													? "bg-accent/60 cursor-default"
													: "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-ring/30",
											)}
										>
											<span className="text-xs text-foreground">
												{SCALE_LABELS[s]}
											</span>
											<div className="flex items-center gap-2 shrink-0">
												{!isActive && (
													<span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
														← usar como base
													</span>
												)}
												<span className="font-mono text-sm tabular-nums text-foreground">
													{formatNum(allResults![s])} {SCALE_SHORT[s]}
												</span>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					) : (
						<div className="flex h-full min-h-50 flex-col items-center justify-center gap-2 bg-muted/40 p-6 text-center">
							<ArrowLeftRight
								className="h-5 w-5 text-muted-foreground"
								strokeWidth={1.75}
							/>
							<p className="text-sm text-foreground">
								Insira um valor para converter
							</p>
							<p className="text-xs text-muted-foreground">
								Digite um número acima e escolha as escalas
							</p>
						</div>
					)}
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "Resultado",
							value:
								valid && result !== null && Number.isFinite(result)
									? `${formatNum(result)} ${SCALE_SHORT[toScale]}`
									: "Aguardando",
							mono: true,
							variant:
								valid && result !== null && Number.isFinite(result)
									? "success"
									: "default",
						},
						{
							label: "Fórmula",
							value: valid ? getFormula(fromScale, toScale) : "—",
							mono: false,
						},
						{
							label: "Escalas",
							value: "3",
							mono: true,
						},
					]}
				/>
			}
		/>
	);
}
