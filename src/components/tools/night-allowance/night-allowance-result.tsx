"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import type { CalculateNightAllowanceResult } from "./types";

type NightAllowanceResultCardProps = {
	result: CalculateNightAllowanceResult;
};

function brl(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

function hFmt(value: number): string {
	return `${value.toFixed(2).replace(".", ",")}h`;
}

function buildSummary(r: CalculateNightAllowanceResult): string {
	return [
		"Adicional noturno — Ferramenta Ninja",
		"─────────────────────────────",
		`Salário bruto: ${brl(r.grossSalary)}`,
		`Horas contratuais: ${r.contractualHours}h`,
		`Valor da hora: ${brl(r.hourValue)}`,
		`Horas noturnas: ${hFmt(r.nightHoursWorked)}`,
		`Adicional por hora: ${brl(r.allowanceValue)}`,
		`Adicional base: ${brl(r.baseAllowance)}`,
		`RSR/DSR: ${brl(r.rsrDsr)}`,
		"─────────────────────────────",
		`TOTAL DEVIDO: ${brl(r.totalAllowanceDue)}`,
	].join("\n");
}

export function NightAllowanceResultCard({
	result,
}: NightAllowanceResultCardProps) {
	const {
		grossSalary,
		contractualHours,
		percentageAllowance,
		hourValue,
		nightHoursWorked,
		allowanceValue,
		hourWithAllowance,
		baseAllowance,
		rsrDsr,
		totalAllowanceDue,
	} = result;

	const [intPart, centsPart] = brl(totalAllowanceDue)
		.replace("R$\u00A0", "")
		.split(",");

	return (
		<div className="flex flex-col h-full">
			{/* Hero */}
			<div className="border-b border-border p-4">
				<div className="mb-2 flex items-center justify-between">
					<p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
						Resultado
					</p>
					<Chip tone="success">Estimativa</Chip>
				</div>
				<div className="flex items-baseline gap-1 font-mono tabular-nums">
					<span className="text-sm font-medium text-muted-foreground">R$</span>
					<span className="text-[28px] font-semibold leading-none tracking-tight text-foreground">
						{intPart}
					</span>
					<span className="text-lg font-medium leading-none text-muted-foreground">
						,{centsPart}
					</span>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">
					total do adicional noturno devido
				</p>
			</div>

			{/* Base de cálculo */}
			<div className="border-b border-border px-4 py-3">
				<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
					Base de cálculo
				</p>
				<div className="space-y-0.5">
					<ResultRow label="Salário bruto" value={grossSalary} dim />
					<ResultRow
						label="Horas contratuais"
						value={`${contractualHours}h`}
						dim
					/>
					<ResultRow label="Valor da hora" value={hourValue} dim />
					<ResultRow
						label="Percentual aplicado"
						value={`${percentageAllowance}%`}
						dim
					/>
				</div>
			</div>

			{/* Componentes */}
			<div className="border-b border-border px-4 py-3">
				<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
					Componentes
				</p>
				<div className="space-y-0.5">
					<ResultRow
						label="Horas noturnas apuradas"
						value={hFmt(nightHoursWorked)}
					/>
					<ResultRow label="Adicional por hora" value={allowanceValue} />
					<ResultRow label="Hora com adicional" value={hourWithAllowance} />
				</div>
			</div>

			{/* Detalhamento */}
			<div className="flex-1 px-4 py-3">
				<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
					Detalhamento
				</p>
				<div className="space-y-0.5">
					<ResultRow label="Adicional base" value={baseAllowance} />
					<ResultRow
						label={`RSR / DSR (${result.holidaysAndSundays} dias)`}
						value={rsrDsr}
					/>
					<ResultRow label="Total devido" value={totalAllowanceDue} strong />
				</div>
			</div>

			{/* Footer */}
			<div className="flex gap-2 border-t border-border p-3">
				<CopyButton
					text={buildSummary(result)}
					label="Copiar resumo"
					feedbackText="Copiado"
					variant="outline"
				/>
			</div>
		</div>
	);
}
