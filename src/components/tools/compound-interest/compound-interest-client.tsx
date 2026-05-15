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
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { calculateCompoundInterest } from "@/lib/finance/compound-interest";

interface CompoundInterestFormState {
	principal: number;
	monthlyContribution: number;
	annualRate: number;
	months: number;
	contributionTiming: "begin" | "end";
}

const DEFAULTS: CompoundInterestFormState = {
	principal: 0,
	monthlyContribution: 0,
	annualRate: 12,
	months: 60,
	contributionTiming: "end",
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

export function CompoundInterestClient() {
	const [state, setState] = useState<CompoundInterestFormState>(DEFAULTS);

	function set<K extends keyof CompoundInterestFormState>(key: K) {
		return (value: CompoundInterestFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (state.principal <= 0 && state.monthlyContribution <= 0) return null;
		return calculateCompoundInterest({
			principal: state.principal,
			monthlyContribution: state.monthlyContribution,
			annualRate: state.annualRate / 100,
			months: state.months,
			contributionTiming: state.contributionTiming,
		});
	}, [state]);

	const split = result ? splitBRL(result.finalBalance) : null;

	function buildSummary(): string {
		if (!result) return "";
		const lines = [
			`Montante final: R$ ${fmt(result.finalBalance)}`,
			`Total investido: R$ ${fmt(result.totalInvested)}`,
			`Total em juros: R$ ${fmt(result.totalInterest)}`,
			`Taxa mensal: ${(result.monthlyRate * 100).toFixed(4)}%`,
		];
		return lines.join("\n");
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Investimento</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label htmlFor="principal" className="mb-1.5 block text-xs">
									Aporte inicial
								</Label>
								<CurrencyInput
									value={state.principal > 0 ? state.principal : undefined}
									onChangeValue={(_, num) =>
										set("principal")((num as number) ?? 0)
									}
									InputElement={
										<Input
											id="principal"
											type="text"
											placeholder="R$ 0,00"
											inputMode="decimal"
											autoComplete="off"
										/>
									}
								/>
							</div>
							<div>
								<Label
									htmlFor="monthlyContribution"
									className="mb-1.5 block text-xs"
								>
									Aporte mensal
								</Label>
								<CurrencyInput
									value={
										state.monthlyContribution > 0
											? state.monthlyContribution
											: undefined
									}
									onChangeValue={(_, num) =>
										set("monthlyContribution")((num as number) ?? 0)
									}
									InputElement={
										<Input
											id="monthlyContribution"
											type="text"
											placeholder="R$ 0,00"
											inputMode="decimal"
											autoComplete="off"
										/>
									}
								/>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel>Parâmetros</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label htmlFor="annualRate" className="mb-1.5 block text-xs">
										Taxa de juros anual (%)
									</Label>
									<Input
										id="annualRate"
										type="number"
										step={0.01}
										min={0}
										value={state.annualRate}
										onChange={(e) => set("annualRate")(Number(e.target.value))}
									/>
								</div>
								<div>
									<Label htmlFor="months" className="mb-1.5 block text-xs">
										Período
									</Label>
									<Input
										id="months"
										type="number"
										min={1}
										max={600}
										value={state.months}
										onChange={(e) => set("months")(Number(e.target.value))}
									/>
									<p className="mt-1 text-caption text-muted-foreground">
										meses (máx. 50 anos)
									</p>
								</div>
							</div>
							<div>
								<Label
									htmlFor="contributionTiming"
									className="mb-1.5 block text-xs"
								>
									Quando o aporte é feito
								</Label>
								<NativeSelect
									id="contributionTiming"
									value={state.contributionTiming}
									onChange={(e) =>
										set("contributionTiming")(e.target.value as "begin" | "end")
									}
								>
									<option value="end">Fim do mês (padrão)</option>
									<option value="begin">Início do mês</option>
								</NativeSelect>
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
					{!result || !split ? (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Informe o aporte inicial ou mensal para ver o resultado
							</p>
						</div>
					) : (
						<>
							<div className="p-4.5 bg-card border-b">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										Montante final
									</span>
									<Chip tone="success">Simulação</Chip>
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
								<div className="mt-2 text-[11.5px] text-muted-foreground">
									Taxa mensal:{" "}
									<span className="font-mono tabular-nums text-foreground">
										{(result.monthlyRate * 100).toFixed(4)}%
									</span>
								</div>
							</div>
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								<ResultRow
									label="Total investido"
									value={result.totalInvested}
								/>
								<ResultRow
									label="Total em juros"
									value={result.totalInterest}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label="Montante final"
									value={result.finalBalance}
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
							<details className="border-t border-border">
								<summary className="cursor-pointer select-none px-4.5 py-3 text-[11.5px] font-medium text-muted-foreground hover:text-foreground">
									Ver evolução mês a mês
								</summary>
								<div className="max-h-72 overflow-auto">
									<table className="w-full text-[11.5px]">
										<thead className="sticky top-0 bg-card border-b border-border">
											<tr>
												<th className="px-4.5 py-1.5 text-left font-medium text-muted-foreground">
													Mês
												</th>
												<th className="px-2 py-1.5 text-right font-medium text-muted-foreground">
													Juros
												</th>
												<th className="px-4.5 py-1.5 text-right font-medium text-muted-foreground">
													Saldo
												</th>
											</tr>
										</thead>
										<tbody>
											{result.schedule.map((e) => (
												<tr
													key={e.month}
													className="border-t border-border font-mono tabular-nums"
												>
													<td className="px-4.5 py-1.5 text-muted-foreground">
														{e.month}
													</td>
													<td className="px-2 py-1.5 text-right">
														{fmt(e.interest)}
													</td>
													<td className="px-4.5 py-1.5 text-right">
														{fmt(e.balance)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</details>
						</>
					)}
				</div>
				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Simulação sem desconto de imposto de renda. Para renda fixa com IR
						progressivo e IOF, use a Calculadora de Rendimento CDI/Selic.
					</span>
				</div>
			</aside>
		</div>
	);
}
