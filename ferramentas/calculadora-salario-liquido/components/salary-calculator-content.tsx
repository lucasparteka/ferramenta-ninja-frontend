"use client";

import { SalaryCalculatorForm } from "./salary-form";
import ResultCard from "./result-card";
import { useState } from "react";
import { CalculateResult } from "../types";

export default function SalaryCalculatorContent() {
  const [result, setResult] = useState<CalculateResult | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SalaryCalculatorForm onCalculate={setResult} />
      <ResultCard result={result} />
    </div>
  );
}
