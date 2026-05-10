"use client";

import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { calculateVacation } from "@/lib/labor/vacation";

interface VacationFormState {
	salary: number;
	daysToTake: number;
	monthsAtCompany: number;
	absences: number;
	sellAbono: boolean;
	dependents: number;
}

const DEFAULTS: VacationFormState = {
	salary: 0,
	daysToTake: 30,
	monthsAtCompany: 12,
	absences: 0,
	sellAbono: false,
	dependents: 0,
};

function splitBRL(value: number): { integer: string; cents: string } {
	const [integer = "0", cents = "00"] = value
		.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		.split(",");
	return { integer, cents };
}

function fmt(value: number): string {
	return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

const VALIDATION_MESSAGES: Record<string, string> = {
	"days-below-minimum":
		"Mínimo de 5 dias por período (CLT art. 134 §1º). Ajustado automaticamente.",
	"days-exceed-available":
		"Dias solicitados excedem os disponíveis. Ajustado ao máximo.",
};

export function VacationClient() {
	const [state, setState] = useState<VacationFormState>(DEFAULTS);

	function set<K extends keyof VacationFormState>(key: K) {
		return (value: VacationFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (state.salary <= 0) return null;
		return calculateVacation({
			monthlySalary: state.salary,
			daysToTake: state.daysToTake,
			monthsAtCompany: state.monthsAtCompany,
			unjustifiedAbsences: state.absences,
			sellAbono: state.sellAbono,
			dependents: state.dependents,
		});
	}, [state]);

	const split =
		result && result.entitledDays > 0 ? splitBRL(result.netAmount) : null;

	function buildSummary(): string {
		if (!result || result.entitledDays === 0) return "";
		const lines = [
			`Total líquido: R$ ${fmt(result.netAmount)}`,
			`Dias de direito: ${result.entitledDays}`,
			`Dias de férias: ${result.vacationDaysTaken}`,
			...(result.abonoDays > 0
				? [`Dias vendidos (abono): ${result.abonoDays}`]
				: []),
			`Férias base: R$ ${fmt(result.vacationBase)}`,
			`1/3 constitucional: R$ ${fmt(result.oneThirdBonus)}`,
			...(result.abonoDays > 0
				? [
						`Abono pecuniário: R$ ${fmt(result.abonoPecuniario)}`,
						`1/3 sobre abono: R$ ${fmt(result.abonoOneThird)}`,
					]
				: []),
			`(−) INSS: R$ ${fmt(result.inss)}`,
			`(−) IRRF: R$ ${fmt(result.irrf)}`,
		];
		return lines.join("\n");
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Remuneração e período</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<label
										htmlFor="salary"
										className="mb-1.5 block text-xs font-medium text-foreground"
									>
										Salário bruto mensal
									</label>
									<CurrencyInput
										value={state.salary > 0 ? state.salary : undefined}
										onChangeValue={(_, num) =>
											set("salary")((num as number) ?? 0)
										}
										InputElement={
											<Input
												id="salary"
												type="text"
												placeholder="R$ 0,00"
												inputMode="decimal"
												autoComplete="off"
											/>
										}
									/>
								</div>
								<div>
									<label
										htmlFor="daysToTake"
										className="mb-1.5 block text-xs font-medium text-foreground"
									>
										Dias de férias
									</label>
									<Input
										id="daysToTake"
										type="number"
										min={5}
										max={30}
										value={state.daysToTake}
										onChange={(e) => set("daysToTake")(Number(e.target.value))}
									/>
									<p className="mt-1 text-[11px] text-muted-foreground">
										Mínimo 5 dias (CLT art. 134 §1º)
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel>Período aquisitivo</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<label
										htmlFor="monthsAtCompany"
										className="mb-1.5 block text-xs font-medium text-foreground"
									>
										Meses trabalhados
									</label>
									<Input
										id="monthsAtCompany"
										type="number"
										min={1}
										max={12}
										value={state.monthsAtCompany}
										onChange={(e) =>
											set("monthsAtCompany")(Number(e.target.value))
										}
									/>
								</div>
								<div>
									<label
										htmlFor="absences"
										className="mb-1.5 block text-xs font-medium text-foreground"
									>
										Faltas injustificadas
									</label>
									<Input
										id="absences"
										type="number"
										min={0}
										value={state.absences}
										onChange={(e) => set("absences")(Number(e.target.value))}
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="dependents"
									className="mb-1.5 block text-xs font-medium text-foreground"
								>
									Dependentes para IRRF
								</label>
								<Input
									id="dependents"
									type="number"
									min={0}
									value={state.dependents}
									onChange={(e) => set("dependents")(Number(e.target.value))}
								/>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel>Opções</SectionLabel>
						<label
							htmlFor="sellAbono"
							className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors ${
								state.sellAbono
									? "border-primary bg-primary/5"
									: "border-border bg-card"
							}`}
						>
							<Checkbox
								id="sellAbono"
								checked={state.sellAbono}
								onCheckedChange={(v) => set("sellAbono")(v === true)}
								className="mt-0.5 shrink-0"
							/>
							<div className="flex flex-col">
								<span className="text-[12.5px] leading-snug text-foreground">
									Vender abono pecuniário (art. 143 CLT)
								</span>
								<p className="mt-0.5 text-[11px] text-muted-foreground">
									Converte 1/3 dos dias em dinheiro (isento de tributos)
								</p>
							</div>
						</label>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
						<Info size={12} />O cálculo é atualizado automaticamente
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setState(DEFAULTS)}
					>
						<RotateCcw className="mr-1.5 h-3 w-3" />
						Resetar
					</Button>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t flex-col gap-3">
				<div className="flex-1">
					{!result ? (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Preencha o salário para ver o resultado
							</p>
						</div>
					) : result.entitledDays === 0 ? (
						<div className="flex items-start gap-2 rounded-sm border border-warning-line bg-warning-surface m-4 p-3 text-[11.5px] text-muted-foreground">
							<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
							<span>
								Sem direito a férias — período aquisitivo com mais de 32 faltas
								injustificadas (CLT art. 130).
							</span>
						</div>
					) : (
						<>
							{result.validationError && (
								<div className="flex items-start gap-2 border-b border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] text-muted-foreground">
									<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
									<span>{VALIDATION_MESSAGES[result.validationError]}</span>
								</div>
							)}
							{split && (
								<div className="p-4.5 bg-card border-b">
									<div className="mb-2 flex items-center justify-between">
										<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
											Total líquido a receber
										</span>
										<Chip tone="success">Estimativa</Chip>
									</div>
									<div className="flex items-baseline gap-1 font-mono">
										<span className="text-sm font-medium text-muted-foreground">
											R$
										</span>
										<span className="text-[32px] font-semibold leading-none tracking-tight text-foreground">
											{split.integer}
										</span>
										<span className="text-lg font-medium leading-none text-muted-foreground">
											,{split.cents}
										</span>
									</div>
									<div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-0.5 text-[11.5px] text-muted-foreground">
										<span>{result.entitledDays} dias de direito</span>
										<span>
											·{" "}
											<span className="font-mono tabular-nums text-foreground">
												{result.vacationDaysTaken}
											</span>{" "}
											dias de férias
										</span>
									</div>
								</div>
							)}
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								<ResultRow
									label="Dias de direito"
									value={`${result.entitledDays} dias`}
								/>
								<ResultRow
									label="Dias de férias"
									value={`${result.vacationDaysTaken} dias`}
								/>
								{result.abonoDays > 0 && (
									<ResultRow
										label="Dias vendidos (abono)"
										value={`${result.abonoDays} dias`}
										subdued
									/>
								)}
								<div className="my-2 h-px bg-border" />
								<ResultRow label="Férias base" value={result.vacationBase} />
								<ResultRow
									label="1/3 constitucional"
									value={result.oneThirdBonus}
								/>
								{result.abonoDays > 0 && (
									<>
										<ResultRow
											label="Abono pecuniário"
											value={result.abonoPecuniario}
											subdued
										/>
										<ResultRow
											label="1/3 sobre abono"
											value={result.abonoOneThird}
											subdued
										/>
									</>
								)}
								<div className="my-2 h-px bg-border" />
								<ResultRow label="(−) INSS" value={result.inss} dim />
								<ResultRow label="(−) IRRF" value={result.irrf} dim />
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label="Total líquido"
									value={result.netAmount}
									strong
								/>
							</div>
							<div className="flex gap-2 border-t border-border p-3">
								<CopyButton
									text={buildSummary()}
									label="Copiar resumo"
									feedbackText="Copiado"
									variant="outline"
								/>
							</div>
						</>
					)}
				</div>
				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Estimativa baseada na CLT vigente. Abono pecuniário e 1/3 sobre
						abono são isentos de tributos (Súmula 328 TST).
					</span>
				</div>
			</aside>
		</div>
	);
}
