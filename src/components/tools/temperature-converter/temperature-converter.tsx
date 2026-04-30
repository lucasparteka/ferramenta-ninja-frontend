"use client";

import { useMemo, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Input } from "@/components/ui/input";

 type TemperatureScale = "celsius" | "fahrenheit" | "kelvin";

 const SCALE_LABELS: Record<TemperatureScale, string> = {
	 celsius: "Celsius (°C)",
	 fahrenheit: "Fahrenheit (°F)",
	 kelvin: "Kelvin (K)",
 };

 const SCALE_SHORT: Record<TemperatureScale, string> = {
	 celsius: "°C",
	 fahrenheit: "°F",
	 kelvin: "K",
 };

 function convertTemperature(
	 value: number,
	 from: TemperatureScale,
	 to: TemperatureScale,
 ): number {
	 if (from === to) return value;

	 // Convert to Celsius first
	 let celsius = value;
	 if (from === "fahrenheit") {
		 celsius = (value - 32) * (5 / 9);
	 } else if (from === "kelvin") {
		 celsius = value - 273.15;
	 }

	 // Convert from Celsius to target
	 if (to === "celsius") return celsius;
	 if (to === "fahrenheit") return celsius * (9 / 5) + 32;
	 if (to === "kelvin") return celsius + 273.15;

	 return celsius;
 }

 function getFormula(from: TemperatureScale, to: TemperatureScale): string {
	 if (from === to) return "Valor igual na mesma escala.";
	 if (from === "celsius" && to === "fahrenheit")
		 return "°F = (°C × 9/5) + 32";
	 if (from === "celsius" && to === "kelvin")
		 return "K = °C + 273.15";
	 if (from === "fahrenheit" && to === "celsius")
		 return "°C = (°F − 32) × 5/9";
	 if (from === "fahrenheit" && to === "kelvin")
		 return "K = (°F − 32) × 5/9 + 273.15";
	 if (from === "kelvin" && to === "celsius")
		 return "°C = K − 273.15";
	 if (from === "kelvin" && to === "fahrenheit")
		 return "°F = (K − 273.15) × 9/5 + 32";
	 return "";
 }

 export function TemperatureConverter() {
	 const [value, setValue] = useState("0");
	 const [fromScale, setFromScale] = useState<TemperatureScale>("celsius");
	 const [toScale, setToScale] = useState<TemperatureScale>("fahrenheit");

	 const scales: TemperatureScale[] = ["celsius", "fahrenheit", "kelvin"];

	 const numeric = Number(value.replace(",", "."));
	 const result = useMemo(() => {
		 if (Number.isNaN(numeric) || value.trim() === "") return null;
		 return convertTemperature(numeric, fromScale, toScale);
	 }, [numeric, fromScale, toScale, value]);

	 const allResults = useMemo(() => {
		 if (Number.isNaN(numeric) || value.trim() === "") return null;
		 return {
			 celsius: convertTemperature(numeric, fromScale, "celsius"),
			 fahrenheit: convertTemperature(numeric, fromScale, "fahrenheit"),
			 kelvin: convertTemperature(numeric, fromScale, "kelvin"),
		 };
	 }, [numeric, fromScale, value]);

	 function swap() {
		 setFromScale(toScale);
		 setToScale(fromScale);
	 }

	 return (
		 <div className="space-y-6">
			 <div className="max-w-2xl space-y-4">
				 {/* Input scale chips */}
				 <div className="space-y-2">
					 <span className="block text-sm font-medium text-foreground">
						 Converter de
					 </span>
					 <div className="flex flex-wrap gap-2">
						 {scales.map((s) => (
							 <button
								 key={s}
								 type="button"
								 onClick={() => setFromScale(s)}
								 className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
									 fromScale === s
										 ? "border-primary bg-primary text-primary-foreground"
										 : "border-border bg-card text-foreground hover:bg-accent"
								 }`}
							 >
								 {SCALE_LABELS[s]}
							 </button>
						 ))}
					 </div>
				 </div>

				 {/* Value input */}
				 <div className="space-y-2">
					 <label
						 htmlFor="temp-value"
						 className="block text-sm font-medium text-foreground"
					 >
						 Valor em {SCALE_SHORT[fromScale]}
					 </label>
					 <Input
						 id="temp-value"
						 type="text"
						 inputMode="decimal"
						 value={value}
						 onChange={(e) => setValue(e.target.value)}
						 placeholder={`Ex: ${fromScale === "fahrenheit" ? "32" : fromScale === "kelvin" ? "273.15" : "0"}`}
	
					 />
				 </div>

				 {/* Output scale chips */}
				 <div className="space-y-2">
					 <div className="flex items-center justify-between">
						 <span className="block text-sm font-medium text-foreground">
							 Para
						 </span>
						 <button
							 type="button"
							 onClick={swap}
							 className="text-xs font-medium text-primary hover:underline"
						 >
							 Inverter escalas
						 </button>
					 </div>
					 <div className="flex flex-wrap gap-2">
						 {scales.map((s) => (
							 <button
								 key={s}
								 type="button"
								 onClick={() => setToScale(s)}
								 className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
									 toScale === s
										 ? "border-primary bg-primary text-primary-foreground"
										 : "border-border bg-card text-foreground hover:bg-accent"
								 }`}
							 >
								 {SCALE_LABELS[s]}
							 </button>
						 ))}
					 </div>
				 </div>
			 </div>

			 {/* Main result */}
			 {result !== null && (
				 <div className="max-w-2xl space-y-4">
					 <ResultBox
						 label={`Resultado: ${SCALE_LABELS[toScale]}`}
						 value={
							 <span className="text-primary">
								 {Number.isFinite(result)
									 ? `${result.toLocaleString("pt-BR", {
											 minimumFractionDigits: 2,
											 maximumFractionDigits: 4,
										 })} ${SCALE_SHORT[toScale]}`
									 : "—"}
							 </span>
						 }
						 hint={getFormula(fromScale, toScale)}
					 />
				 </div>
			 )}

			 {/* All scales table */}
			 {allResults && (
				 <div className="max-w-2xl space-y-3">
					 <h3 className="text-sm font-semibold text-foreground">
						 Todas as escalas
					 </h3>
					 <div className="grid gap-2 sm:grid-cols-3">
						 {scales.map((s) => (
							 <div
								 key={s}
								 className={`rounded-lg border px-3 py-2 text-center ${
									 s === toScale
										 ? "border-primary/30 bg-primary/5"
										 : "border-border bg-card"
								 }`}
							 >
								 <p className="text-xs text-muted-foreground">
									 {SCALE_LABELS[s]}
								 </p>
								 <p className="text-lg font-semibold text-foreground">
									 {allResults[s].toLocaleString("pt-BR", {
										 minimumFractionDigits: 2,
										 maximumFractionDigits: 4,
									 })} {SCALE_SHORT[s]}
								 </p>
							 </div>
						 ))}
					 </div>
				 </div>
			 )}
		 </div>
	 );
 }
