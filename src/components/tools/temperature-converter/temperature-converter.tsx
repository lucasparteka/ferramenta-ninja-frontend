"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";

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
		setValue("0");
	}

	return (
		<LayoutC
			toolbar={
				<div className="flex items-center gap-4">
					<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Escala origem
					</span>
					<div className="flex gap-1">
						{SCALES.map((s) => (
							<button
								key={s}
								type="button"
								onClick={() => setFromScale(s)}
								className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
									fromScale === s
										? "bg-foreground/10 text-foreground font-medium"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								{SCALE_SHORT[s]}
							</button>
						))}
					</div>
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
					<div className="flex flex-1 flex-col p-3 space-y-4">
						<div className="space-y-1.5">
							<label
								htmlFor="temp-value"
								className="text-xs font-medium text-muted-foreground"
							>
								Valor em {SCALE_SHORT[fromScale]}
							</label>
							<input
								id="temp-value"
								type="text"
								inputMode="decimal"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="0"
								className="w-full rounded-md border border-border bg-transparent px-3 py-1.5 font-mono text-sm tabular-nums outline-none focus:border-foreground/30"
							/>
						</div>
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-muted-foreground">
								Converter para
							</span>
							<div className="flex gap-1">
								{SCALES.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => setToScale(s)}
										className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
											toScale === s
												? "bg-foreground/10 text-foreground font-medium"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										{SCALE_SHORT[s]}
									</button>
								))}
							</div>
						</div>
					</div>
				</>
			}
			right={
				<>
					<PaneHeader title="Resultado" />
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3 space-y-4">
						{result !== null && valid ? (
							<>
								<p className="font-mono text-2xl tabular-nums text-foreground">
									{Number.isFinite(result)
										? `${formatNum(result)} ${SCALE_SHORT[toScale]}`
										: "—"}
								</p>
								<p className="text-xs text-muted-foreground font-mono">
									{getFormula(fromScale, toScale)}
								</p>
								<div className="space-y-2 pt-2 border-t border-border">
									<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
										Todas as escalas
									</p>
									{SCALES.map((s) => (
										<div
											key={s}
											className="flex items-center justify-between py-0.5"
										>
											<span className="text-xs text-muted-foreground">
												{SCALE_LABELS[s]}
											</span>
											<span className="font-mono text-xs tabular-nums text-foreground">
												{formatNum(allResults![s])} {SCALE_SHORT[s]}
											</span>
										</div>
									))}
								</div>
							</>
						) : (
							<p className="text-sm text-muted-foreground">
								Insira um valor para converter...
							</p>
						)}
					</div>
				</>
			}
			swapButton={
				<button
					type="button"
					onClick={handleSwap}
					className="rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm hover:text-foreground hover:bg-muted"
					aria-label="Inverter escalas"
				>
					<ArrowLeftRight className="h-3.5 w-3.5" />
				</button>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: valid && result !== null ? "Convertido" : "Aguardando",
							mono: false,
							variant: valid && result !== null ? "success" : "default",
						},
						{ label: "Escalas", value: "1 valor · 3 escalas", mono: true },
					]}
				/>
			}
		/>
	);
}
