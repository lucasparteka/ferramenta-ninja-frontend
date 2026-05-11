"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";
import type { CalculateNightAllowanceResult } from "./types";
import { NightAllowanceCalculatorForm } from "./night-allowance-form";
import { NightAllowanceResultCard } from "./night-allowance-result";

export function NightAllowanceContent() {
	const [result, setResult] = useState<CalculateNightAllowanceResult | null>(
		null,
	);

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<NightAllowanceCalculatorForm onCalculate={(data) => setResult(data)} />
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{result ? (
					<NightAllowanceResultCard result={result} />
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center min-h-[300px]">
						<Clock
							className="h-5 w-5 text-muted-foreground"
							strokeWidth={1.75}
						/>
						<p className="text-sm text-muted-foreground">
							Preencha os dados para calcular o adicional noturno
						</p>
					</div>
				)}

				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Estimativa orientativa baseada na legislação vigente (2026).
						Consulte um contador para holerites oficiais.
					</span>
				</div>
			</aside>
		</div>
	);
}
