"use client";

import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateFixedIncome,
	type IndexType,
} from "@/lib/finance/fixed-income";

interface FixedIncomeFormState {
	principal: number;
	days: number;
	kind: "cdb" | "lci-lca" | "tesouro-selic";
	indexType: "cdi" | "selic" | "prefixed";
	annualIndexRate: number;
	indexPercentage: number;
	prefixedAnnualRate: number;
}

const DEFAULTS: FixedIncomeFormState = {
	principal: 0,
	days: 365,
	kind: "cdb",
	indexType: "cdi",
	annualIndexRate: 11.25,
	indexPercentage: 100,
	prefixedAnnualRate: 12,
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

export function FixedIncomeClient() {
	const [state, setState] = useState<FixedIncomeFormState>(DEFAULTS);

	function set<K extends keyof FixedIncomeFormState>(key: K) {
		return (value: FixedIncomeFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (state.principal <= 0) return null;
		return calculateFixedIncome({
			principal: state.principal,
			days: state.days,
			annualIndexRate: state.annualIndexRate / 100,
			indexPercentage: state.indexPercentage,
			prefixedAnnualRate: state.prefixedAnnualRate / 100,
			kind: state.kind,
			indexType: state.indexType as IndexType,
		});
	}, [state]);

	const split = result ? splitBRL(result.netFinal) : null;

	function buildSummary(): string {
		if (!result) return "";
		const lines = [
			`Valor líquido final: R$ ${fmt(result.netFinal)}`,
			`Rendimento bruto: R$ ${fmt(result.grossYield)}`,
			`Valor bruto final: R$ ${fmt(result.grossFinal)}`,
			`(−) IOF (${(result.iofRate * 100).toFixed(0)}%): R$ ${fmt(result.iof)}`,
			`(−) IR (${(result.irRate * 100).toFixed(2)}%): R$ ${fmt(result.ir)}`,
			`Rendimento líquido: R$ ${fmt(result.netYield)}`,
			`Rentabilidade anual: ${(result.effectiveAnnualRate * 100).toFixed(2)}%`,
		];
		return lines.join("\n");
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Aplicação</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="principal"
									className="mb-1.5 block text-xs text-foreground"
								>
									Valor aplicado
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
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label
										htmlFor="days"
										className="mb-1.5 block text-xs text-foreground"
									>
										Prazo
									</Label>
									<NumberInput
										id="days"
										value={state.days}
										onChange={(v) => set("days")(v)}
										min={1}
										max={7300}
									/>
									<p className="mt-1 text-[11px] text-muted-foreground">
										dias corridos
									</p>
								</div>
								<div>
									<Label
										htmlFor="kind"
										className="mb-1.5 block text-xs text-foreground"
									>
										Tipo de aplicação
									</Label>
									<NativeSelect
										id="kind"
										value={state.kind}
										onChange={(e) =>
											set("kind")(
												e.target.value as "cdb" | "lci-lca" | "tesouro-selic",
											)
										}
									>
										<option value="cdb">CDB</option>
										<option value="lci-lca">LCI/LCA (isento)</option>
										<option value="tesouro-selic">Tesouro Selic</option>
									</NativeSelect>
								</div>
							</div>
						</div>
					</div>

					<div className="p-5">
						<SectionLabel>Indexador</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="indexType"
									className="mb-1.5 block text-xs text-foreground"
								>
									Indexador
								</Label>
								<NativeSelect
									id="indexType"
									value={state.indexType}
									onChange={(e) =>
										set("indexType")(
											e.target.value as "cdi" | "selic" | "prefixed",
										)
									}
								>
									<option value="cdi">CDI</option>
									<option value="selic">Selic</option>
									<option value="prefixed">Prefixado</option>
								</NativeSelect>
							</div>
							{state.indexType !== "prefixed" ? (
								<div className="grid grid-cols-2 gap-3.5">
									<div>
										<Label
											htmlFor="annualIndexRate"
											className="mb-1.5 block text-xs text-foreground"
										>
											Taxa anual do{" "}
											{state.indexType === "cdi" ? "CDI" : "Selic"} (%)
										</Label>
										<NumberInput
											id="annualIndexRate"
											value={state.annualIndexRate}
											onChange={(v) => set("annualIndexRate")(v)}
											min={0}
											step={0.01}
										/>
									</div>
									<div>
										<Label
											htmlFor="indexPercentage"
											className="mb-1.5 block text-xs text-foreground"
										>
											% do indexador
										</Label>
										<NumberInput
											id="indexPercentage"
											value={state.indexPercentage}
											onChange={(v) => set("indexPercentage")(v)}
											min={0}
											max={300}
											step={0.01}
										/>
									</div>
								</div>
							) : (
								<div>
									<Label
										htmlFor="prefixedAnnualRate"
										className="mb-1.5 block text-xs text-foreground"
									>
										Taxa prefixada anual (%)
									</Label>
									<NumberInput
										id="prefixedAnnualRate"
										value={state.prefixedAnnualRate}
										onChange={(v) => set("prefixedAnnualRate")(v)}
										min={0}
										step={0.01}
									/>
								</div>
							)}
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
								Informe o valor aplicado para ver o resultado
							</p>
						</div>
					) : (
						<>
							<div className="p-4.5 bg-card border-b">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										Valor líquido final
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
									Rentabilidade anual:{" "}
									<span className="font-mono tabular-nums text-foreground">
										{(result.effectiveAnnualRate * 100).toFixed(2)}%
									</span>
								</div>
							</div>
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								<ResultRow label="Rendimento bruto" value={result.grossYield} />
								<ResultRow
									label="Valor bruto final"
									value={result.grossFinal}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label={`(−) IOF (${(result.iofRate * 100).toFixed(0)}%)`}
									value={result.iof}
									dim
									subdued={result.iof === 0}
								/>
								<ResultRow
									label={`(−) IR (${(result.irRate * 100).toFixed(2)}%)`}
									value={result.ir}
									dim
									subdued={result.ir === 0}
								/>
								<div className="my-2 h-px bg-border" />
								<ResultRow label="Rendimento líquido" value={result.netYield} />
								<ResultRow
									label="Valor líquido final"
									value={result.netFinal}
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
						Simulação orientativa com IR regressivo (Lei 11.033/2004) e IOF
						(Decreto 6.306/2007). LCI e LCA são isentos de IR e IOF para pessoa
						física.
					</span>
				</div>
			</aside>
		</div>
	);
}
