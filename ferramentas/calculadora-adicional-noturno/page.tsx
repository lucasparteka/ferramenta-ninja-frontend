"use client";

import { useState } from "react";
import { NightAllowanceCalculatorForm } from "./components/night-allowance-form";
import { NightAllowanceResultCard } from "./components/night-allowance-result";
import { CalculateNightAllowanceResult } from "./types";
import Link from "next/link";

export default function NightAllowanceCalculatorPage() {
  const [result, setResult] = useState<CalculateNightAllowanceResult | null>(
    null
  );

  function handleCalculate(data: CalculateNightAllowanceResult) {
    setResult(data);
  }

  return (
    <section className="flex flex-col gap-6 py-10">
      <h1 className="text-xl md:text-3xl font-semibold text-primary">
        Calculadora de Adicional Noturno {new Date().getFullYear()}
      </h1>
      <p className="lg:max-w-3xl">
        Calcule o valor do seu adicional noturno de forma simples e rápida. Veja
        quanto você deve receber a mais pelo trabalho realizado à noite,
        conforme a legislação trabalhista.
      </p>
      <p className="lg:max-w-3xl">
        <strong>Empregado urbano:</strong> Quem trabalha à noite tem direito a
        ganhar mais do que quem trabalha de dia. A remuneração do trabalho
        noturno deve ter um acréscimo mínimo de 20% sobre o valor da hora
        diurna. Pela legislação, considera-se trabalho noturno aquele realizado
        entre 22h de um dia e 5h do dia seguinte. (CLT, art. 73)
      </p>
      <p className="lg:max-w-3xl">
        <strong>Empregado Rural:</strong> No caso do trabalhador rural, o
        período considerado noturno varia conforme a atividade. Na lavoura, o
        trabalho noturno é o realizado entre 21h e 5h; já na pecuária, entre 20h
        e 4h. Em ambos os casos, o valor da hora noturna deve ter um acréscimo
        de 25% sobre a remuneração normal. (Lei nº 5.889/73, art. 7º)
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <NightAllowanceCalculatorForm onCalculate={handleCalculate} />
        <NightAllowanceResultCard result={result} />
      </div>
      <div className="mt-8">
        <h3 className="font-semibold text-xl">Veja também:</h3>
        <Link
          href="/calculadora-salario-liquido"
          className="text-link underline"
        >
          Calculadora salário líquido
        </Link>
      </div>
    </section>
  );
}
