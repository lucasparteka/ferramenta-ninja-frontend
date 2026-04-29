"use client";

import { useState } from "react";
import { SalaryCalculatorForm } from "./salary-form";
import { SalaryResultCard } from "./salary-result";
import type { CalculateResult } from "./types";

export function SalaryContent() {
	const [result, setResult] = useState<CalculateResult | null>(null);

	return (
		<div className="space-y-6">
			<SalaryCalculatorForm onCalculate={setResult} />
			{result && <SalaryResultCard result={result} />}
		</div>
	);
}
