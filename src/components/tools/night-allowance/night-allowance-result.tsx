"use client";

import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
import type { CalculateNightAllowanceResult } from "./types";

type NightAllowanceResultCardProps = {
	result: CalculateNightAllowanceResult;
};

export function NightAllowanceResultCard({
	result,
}: NightAllowanceResultCardProps) {
	const {
		grossSalary,
		contractualHours,
		workedHours,
		percentageAllowance,
		hourValue,
		nightHoursWorked,
		allowanceValue,
		rsrDsr,
		hourWithAllowance,
		totalAllowanceDue,
	} = result;

	function formatCurrency(value: number) {
		return value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 2,
		});
	}

	function formatHours(value: number) {
		return `${value.toFixed(2)}h`;
	}

	return (
		<div className="space-y-4">
			<ResultBox
				label="Total do adicional noturno devido"
				value={formatCurrency(totalAllowanceDue)}
			/>

			<ResultGrid>
				<ResultRow label="Salário bruto" value={formatCurrency(grossSalary)} />
				<ResultRow label="Horas contratuais" value={`${contractualHours}h`} />
				<ResultRow label="Horas trabalhadas" value={formatHours(workedHours)} />
				<ResultRow
					label="Percentual adicional"
					value={`${percentageAllowance}%`}
				/>
			</ResultGrid>

			<ResultGrid>
				<ResultRow label="Valor da hora" value={formatCurrency(hourValue)} />
				<ResultRow
					label="Horas noturnas trabalhadas"
					value={formatHours(nightHoursWorked)}
				/>
				<ResultRow
					label="Valor do adicional por hora"
					value={formatCurrency(allowanceValue)}
				/>
				<ResultRow
					label="Hora com adicional"
					value={formatCurrency(hourWithAllowance)}
				/>
				<ResultRow label="RSR/DSR" value={formatCurrency(rsrDsr)} />
			</ResultGrid>
		</div>
	);
}
