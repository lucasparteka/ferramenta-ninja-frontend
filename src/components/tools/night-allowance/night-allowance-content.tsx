"use client";

import { useState } from "react";
import { NightAllowanceCalculatorForm } from "./night-allowance-form";
import { NightAllowanceResultCard } from "./night-allowance-result";
import type { CalculateNightAllowanceResult } from "./types";

export function NightAllowanceContent() {
	const [result, setResult] = useState<CalculateNightAllowanceResult | null>(
		null,
	);

	return (
		<div className="flex flex-col lg:flex-row gap-6">
			<NightAllowanceCalculatorForm onCalculate={setResult} />
			<NightAllowanceResultCard result={result} />
		</div>
	);
}
