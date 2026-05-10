"use client";

import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateSalary } from "./utils";

interface SalaryFormState {
	salary: number;
	dependents: number;
	otherDiscounts: number;
	benefits: number;
}

const DEFAULTS: SalaryFormState = {
	salary: 0,
	dependents: 0,
	otherDiscounts: 0,
	benefits: 0,
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

export function SalaryClient() {
	const [state, setState] = useState<SalaryFormState>(DEFAULTS);

	function set<K extends keyof SalaryFormState>(key: K) {
		return (value: SalaryFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (state.salary <= 0) return null;
		return calculateSalary({
			grossSalary: state.salary,
			dependents: state.dependents,
			benefits: state.benefits,
			otherDiscounts: state.otherDiscounts,
		});
	}, [state]);

	const split = result ? splitBRL(result.netSalary) : null;

	function buildSummary(): string {
		if (!result) return "";
		const lines = [
			`Salário líquido: R$ ${fmt(result.netSalary)}`,
			`Salário bruto: R$ ${fmt(result.grossSalary)}`,
			...(result.benefits > 0
				? [`Benefícios: R$ ${fmt(result.benefits)}`]
				: []),
			`(−) INSS: R$ ${fmt(result.inss)}`,
			`(−) IRRF: R$ ${fmt(result.irrf)}`,
			...(state.otherDiscounts > 0
				? [`(−) Outros descontos: R$ ${fmt(state.otherDiscounts)}`]
				: []),
		];
		return lines.join("\n");
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Remuneração</SectionLabel>
						<div className="space-y-3.5">
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
									htmlFor="benefits"
									className="mb-1.5 block text-xs font-medium text-foreground"
								>
									Benefícios
								</label>
								<CurrencyInput
									value={state.benefits > 0 ? state.benefits : undefined}
									onChangeValue={(_, num) =>
										set("benefits")((num as number) ?? 0)
									}
									InputElement={
										<Input
											id="benefits"
											type="text"
											placeholder="R$ 0,00"
											inputMode="decimal"
											autoComplete="off"
										/>
									}
								/>
								<p className="mt-1 text-[11px] text-muted-foreground">
									VA, VR, bônus ou outros acréscimos
								</p>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel hint="Opcional">Deduções</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
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
										max={10}
										value={state.dependents}
										onChange={(e) =>
											set("dependents")(Number(e.target.value))
										}
									/>
								</div>
								<div>
									<label
										htmlFor="otherDiscounts"
										className="mb-1.5 block text-xs font-medium text-foreground"
									>
										Outros descontos
									</label>
									<CurrencyInput
										value={
											state.otherDiscounts > 0
												? state.otherDiscounts
												: undefined
										}
										onChangeValue={(_, num) =>
											set("otherDiscounts")((num as number) ?? 0)
										}
										InputElement={
											<Input
												id="otherDiscounts"
												type="text"
												placeholder="R$ 0,00"
												inputMode="decimal"
												autoComplete="off"
											/>
										}
									/>
									<p className="mt-1 text-[11px] text-muted-foreground">
										VT, plano de saúde, pensão...
									</p>
								</div>
							</div>
						</div>
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
					{result && split ? (
						<>
							<div className="p-4.5 bg-card border-b">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										Salário líquido
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
									<span>
										INSS{" "}
										<span className="font-mono tabular-nums text-foreground">
											{fmt(result.inss)}
										</span>
									</span>
									<span>
										· IRRF{" "}
										<span className="font-mono tabular-nums text-foreground">
											{fmt(result.irrf)}
										</span>
									</span>
								</div>
							</div>
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								<ResultRow label="Salário bruto" value={result.grossSalary} />
								<ResultRow
									label="Benefícios"
									value={result.benefits}
									subdued={result.benefits === 0}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow label="(−) INSS" value={result.inss} dim />
								<ResultRow label="(−) IRRF" value={result.irrf} dim />
								<ResultRow
									label="(−) Outros descontos"
									value={state.otherDiscounts}
									dim
									subdued={state.otherDiscounts === 0}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label="Salário líquido"
									value={result.netSalary}
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
					) : (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Preencha o salário para ver o resultado
							</p>
						</div>
					)}
				</div>
				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Estimativa orientativa baseada na legislação vigente (2026). Para
						horas extras habituais, comissões ou PLR, consulte um contador.
					</span>
				</div>
			</aside>
		</div>
	);
}
