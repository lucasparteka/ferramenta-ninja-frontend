"use client";

import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
import type { CalculateResult } from "./types";

type SalaryResultCardProps = {
	result: CalculateResult;
};

export function SalaryResultCard({ result }: SalaryResultCardProps) {
	const { grossSalary, netSalary, inss, irrf, totalDiscounts, benefits } =
		result;

	function formatCurrency(value: number) {
		return value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 2,
		});
	}

	return (
		<div className="space-y-4">
			<ResultBox
				label="Salário líquido"
				value={
					<span className="text-green-700 dark:text-green-400">
						{formatCurrency(netSalary)}
					</span>
				}
			/>

			<ResultGrid>
				<ResultRow label="Salário bruto" value={formatCurrency(grossSalary)} />
				<ResultRow label="Benefícios" value={formatCurrency(benefits)} />
				<ResultRow label="Desconto INSS" value={formatCurrency(inss)} />
				<ResultRow label="Desconto IRRF" value={formatCurrency(irrf)} />
				<ResultRow
					label="Total de descontos"
					value={
						<span className="text-destructive">
							{formatCurrency(totalDiscounts)}
						</span>
					}
				/>
			</ResultGrid>
		</div>
	);
}
