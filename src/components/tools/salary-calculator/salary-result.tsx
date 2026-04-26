"use client";

import { ResultBox, ResultRow } from "@/components/shared/result-box";
import type { CalculateResult } from "./types";

type SalaryResultCardProps = {
	result: CalculateResult | null;
};

export function SalaryResultCard({ result }: SalaryResultCardProps) {
	const {
		grossSalary = 0,
		netSalary = 0,
		inss = 0,
		irrf = 0,
		totalDiscounts = 0,
		benefits = 0,
	} = result || {};

	const hasResult = Boolean(result);

	function formatCurrency(value: number) {
		return value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 2,
		});
	}

	return (
		<div className="w-full lg:w-1/2 space-y-4">
			<ResultBox
				label="Salário líquido"
				value={hasResult ? formatCurrency(netSalary) : "—"}
			/>

			<dl className="grid gap-2 text-sm">
				<ResultRow
					label="Salário bruto"
					value={hasResult ? formatCurrency(grossSalary) : "—"}
				/>
				<ResultRow
					label="Benefícios"
					value={hasResult ? formatCurrency(benefits) : "—"}
				/>
				<ResultRow
					label="Desconto INSS"
					value={hasResult ? formatCurrency(inss) : "—"}
				/>
				<ResultRow
					label="Desconto IRRF"
					value={hasResult ? formatCurrency(irrf) : "—"}
				/>
				<ResultRow
					label="Total de descontos"
					value={
						<span className="text-destructive">
							{hasResult ? formatCurrency(totalDiscounts) : "—"}
						</span>
					}
				/>
			</dl>

			{!hasResult && (
				<p className="text-sm text-muted-foreground">
					Preencha o formulário e clique em{" "}
					<strong>Calcular salário líquido</strong> para ver o resultado.
				</p>
			)}
		</div>
	);
}
