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
import { calculateChristmasBonus } from "@/lib/labor/christmas-bonus";

interface ChristmasBonusFormState {
	salary: number;
	monthsWorked: number;
	dependents: number;
	additional: number;
	firstInstallmentTiming: "november" | "vacation";
}

const DEFAULTS: ChristmasBonusFormState = {
	salary: 0,
	monthsWorked: 12,
	dependents: 0,
	additional: 0,
	firstInstallmentTiming: "november",
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

export function ChristmasBonusClient() {
	const [state, setState] = useState<ChristmasBonusFormState>(DEFAULTS);

	function set<K extends keyof ChristmasBonusFormState>(key: K) {
		return (value: ChristmasBonusFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (state.salary <= 0) return null;
		return calculateChristmasBonus({
			monthlySalary: state.salary,
			monthsWorked: state.monthsWorked,
			dependents: state.dependents,
			averageAdditional: state.additional,
			firstInstallmentTiming: state.firstInstallmentTiming,
		});
	}, [state]);

	const split = result ? splitBRL(result.netTotal) : null;

	function buildSummary(): string {
		if (!result) return "";
		const lines = [
			`13º líquido: R$ ${fmt(result.netTotal)}`,
			`13º bruto: R$ ${fmt(result.grossBonus)}`,
			`Avos: ${result.avos}/12`,
			`1ª parcela: R$ ${fmt(result.firstInstallment)}`,
			`2ª parcela: R$ ${fmt(result.secondInstallment)}`,
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
						<SectionLabel>Remuneração</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label htmlFor="salary" className="mb-1.5 block text-xs">
										Salário bruto mensal
									</Label>
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
									<Label htmlFor="additional" className="mb-1.5 block text-xs">
										Adicionais habituais
									</Label>
									<CurrencyInput
										value={state.additional > 0 ? state.additional : undefined}
										onChangeValue={(_, num) =>
											set("additional")((num as number) ?? 0)
										}
										InputElement={
											<Input
												id="additional"
												type="text"
												placeholder="R$ 0,00"
												inputMode="decimal"
												autoComplete="off"
											/>
										}
									/>
									<p className="mt-1 text-caption text-muted-foreground">
										Insalubridade, HE habitual, comissões...
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel>Período</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label
										htmlFor="monthsWorked"
										className="mb-1.5 block text-xs"
									>
										Meses trabalhados
									</Label>
									<Input
										id="monthsWorked"
										type="number"
										min={1}
										max={12}
										value={state.monthsWorked}
										onChange={(e) =>
											set("monthsWorked")(Number(e.target.value))
										}
									/>
								</div>
								<div>
									<Label htmlFor="dependents" className="mb-1.5 block text-xs">
										Dependentes
									</Label>
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
					</div>

					<div className="p-5">
						<SectionLabel>Opções</SectionLabel>
						<div>
							<Label
								htmlFor="firstInstallmentTiming"
								className="mb-1.5 block text-xs"
							>
								Pagamento da 1ª parcela
							</Label>
							<NativeSelect
								id="firstInstallmentTiming"
								value={state.firstInstallmentTiming}
								onChange={(e) =>
									set("firstInstallmentTiming")(
										e.target.value as "november" | "vacation",
									)
								}
							>
								<option value="november">Até 30 de novembro (padrão)</option>
								<option value="vacation">
									Adiantar junto às férias (Lei 4.749/65 art. 2º §2º)
								</option>
							</NativeSelect>
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
					{!result ? (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Preencha o salário para ver o resultado
							</p>
						</div>
					) : (
						<>
							{split && (
								<div className="p-4.5 bg-card border-b">
									<div className="mb-2 flex items-center justify-between">
										<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
											13º líquido total
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
									<div className="mt-2 text-[11.5px] text-muted-foreground">
										<span className="font-mono tabular-nums text-foreground">
											{result.avos}
										</span>
										/12 avos
									</div>
								</div>
							)}
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								<ResultRow label="13º bruto" value={result.grossBonus} />
								<ResultRow label="Avos" value={`${result.avos}/12`} />
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label={
										state.firstInstallmentTiming === "vacation"
											? "1ª parcela (com férias)"
											: "1ª parcela (até 30/nov)"
									}
									value={result.firstInstallment}
								/>
								<ResultRow
									label="2ª parcela (até 20/dez)"
									value={result.secondInstallment}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow label="(−) INSS" value={result.inss} dim />
								<ResultRow label="(−) IRRF" value={result.irrf} dim />
								<div className="my-2 h-px bg-border" />
								<ResultRow label="13º líquido" value={result.netTotal} strong />
								<p className="mt-2 text-caption text-muted-foreground">
									{result.firstInstallmentDueLabel}
								</p>
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
						Estimativa baseada nas tabelas INSS e IRRF 2026. IRRF calculado sem
						o redutor da reforma 2025 (vale apenas para salário mensal). FGTS
						(8%) é depositado pelo empregador, sem desconto no holerite.
					</span>
				</div>
			</aside>
		</div>
	);
}
