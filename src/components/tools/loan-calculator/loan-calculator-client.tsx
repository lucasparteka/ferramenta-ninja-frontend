"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ChevronUp, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	type AmortizationResult,
	type AmortizationSystem,
	calculateAmortization,
} from "@/lib/finance/amortization";
import { cn } from "@/lib/utils";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	principal: z.string().min(1, "Informe o valor"),
	annualRate: z.coerce.number().min(0).max(100),
	months: z.coerce.number().min(1).max(600),
});

type FormValues = z.infer<typeof schema>;

type Results = {
	sac: AmortizationResult;
	price: AmortizationResult;
};

function brl(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildSummary(label: string, r: AmortizationResult): string {
	return [
		`Sistema: ${label}`,
		`Primeira parcela: ${brl(r.firstPayment)}`,
		`Última parcela: ${brl(r.lastPayment)}`,
		`Total pago: ${brl(r.totalPaid)}`,
		`Total em juros: ${brl(r.totalInterest)}`,
	].join("\n");
}

export function LoanCalculatorClient() {
	const [results, setResults] = useState<Results | null>(null);
	const [view, setView] = useState<AmortizationSystem>("price");
	const [tableOpen, setTableOpen] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: { principal: "", annualRate: 12, months: 120 },
	});

	const annualRateValue = form.watch("annualRate");

	const monthlyRate =
		annualRateValue > 0
			? ((1 + annualRateValue / 100) ** (1 / 12) - 1) * 100
			: null;

	function onSubmit(data: FormValues) {
		const base = {
			principal: parseCurrencyToNumber(data.principal),
			annualRate: data.annualRate / 100,
			months: data.months,
		};
		setResults({
			sac: calculateAmortization({ ...base, system: "sac" }),
			price: calculateAmortization({ ...base, system: "price" }),
		});
	}

	function handleReset() {
		form.reset();
		setResults(null);
	}

	const active = results
		? view === "sac"
			? results.sac
			: results.price
		: null;
	const activeLabel = view === "sac" ? "SAC" : "Price";

	const firstPaymentVal = active?.firstPayment ?? null;
	const lastPaymentVal = active?.lastPayment ?? null;
	const totalPaidVal = active?.totalPaid ?? null;
	const totalInterestVal = active?.totalInterest ?? null;
	const priceTotalPaid = results?.price.totalPaid ?? null;
	const sacTotalPaid = results?.sac.totalPaid ?? null;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
				{/* Coluna esquerda — formulário */}
				<div className="bg-card flex flex-col h-full">
					<Form {...form}>
						<form
							id="loan-form"
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col h-full"
						>
							<div className="divide-y divide-border">
								<div className="p-5">
									<SectionLabel>Financiamento</SectionLabel>
									<div className="space-y-3.5">
										<FormField
											control={form.control}
											name="principal"
											render={({ field }) => (
												<FormItem className="gap-1.5">
													<FormLabel className="text-xs">
														Valor financiado
													</FormLabel>
													<FormControl>
														<CurrencyInput
															value={field.value}
															onChangeValue={(_, __, masked) =>
																field.onChange(masked as string)
															}
															InputElement={
																<Input
																	id="loan-principal"
																	type="text"
																	placeholder="R$ 0,00"
																	{...field}
																/>
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className="p-5">
									<SectionLabel>Condições</SectionLabel>
									<div className="grid grid-cols-2 gap-3.5">
										<FormField
											control={form.control}
											name="annualRate"
											render={({ field }) => (
												<FormItem className="gap-1.5">
													<FormLabel className="text-xs">
														Taxa anual (%)
													</FormLabel>
													<FormControl>
														<Input
															id="loan-rate"
															type="number"
															step="0.01"
															min={0}
															{...field}
														/>
													</FormControl>
													<FormMessage />
													<FormDescription className="text-[11px]">
														ao ano, efetiva
													</FormDescription>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="months"
											render={({ field }) => (
												<FormItem className="gap-1.5">
													<FormLabel className="text-xs">
														Prazo (meses)
													</FormLabel>
													<FormControl>
														<Input
															id="loan-months"
															type="number"
															min={1}
															max={600}
															{...field}
														/>
													</FormControl>
													<FormMessage />
													<FormDescription className="text-[11px]">
														máx. 600 meses
													</FormDescription>
												</FormItem>
											)}
										/>
									</div>
									<div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
										<span className="text-[11px] text-muted-foreground">
											Taxa mensal equivalente
										</span>
										<span className="font-mono text-[11px] tabular-nums text-foreground">
											{monthlyRate != null
												? `${monthlyRate.toLocaleString("pt-BR", {
														minimumFractionDigits: 3,
														maximumFractionDigits: 3,
													})}%`
												: "—"}
										</span>
									</div>
								</div>

								<div className="p-5 border-t border-border">
									<SectionLabel>Sistema</SectionLabel>
									<OptionSwitch
										options={[
											{ label: "Price (parcela fixa)", value: "price" },
											{ label: "SAC (decrescente)", value: "sac" },
										]}
										value={view}
										onChange={(v) => setView(v as AmortizationSystem)}
										size="sm"
									/>
								</div>

								<div className="p-5 border-t border-border">
									<SectionLabel>Sobre os sistemas</SectionLabel>
									<div className="mt-3 flex flex-col gap-2">
										<div className="flex items-start gap-2.5 rounded-md border border-border bg-muted p-3">
											<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-card font-mono text-[11px] font-bold text-muted-foreground">
												P
											</div>
											<div>
												<p className="text-[12px] font-medium">
													Price — parcela fixa
												</p>
												<p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
													PMT constante calculada pela fórmula PMT = P × i / (1
													− (1 + i)⁻ⁿ). Amortização cresce e juros decrescem.
													Mais previsível, custo total maior.
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2.5 rounded-md border border-border bg-muted p-3">
											<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-card font-mono text-[11px] font-bold text-muted-foreground">
												S
											</div>
											<div>
												<p className="text-[12px] font-medium">
													SAC — amortização constante
												</p>
												<p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
													Amortização fixa, juros decrescentes — parcela diminui
													a cada mês. Parcela inicial maior, mas paga menos
													juros no total do contrato.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleReset}
									disabled={!results}
								>
									<RotateCcw className="mr-1.5 h-3 w-3" />
									Resetar
								</Button>
								<Button type="submit">Simular financiamento</Button>
							</div>
						</form>
					</Form>
				</div>

				{/* Coluna direita — resultado */}
				<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
					{/* Bloco: switch de sistema — sempre visível */}
					<div className="p-4 border-b border-border">
						<div className="mb-3 flex items-center justify-between">
							<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Sistema
							</span>
							<Chip tone="success">Estimativa</Chip>
						</div>
						<OptionSwitch
							options={[
								{ label: "Price (parcela fixa)", value: "price" },
								{ label: "SAC (decrescente)", value: "sac" },
							]}
							value={view}
							onChange={(v) => setView(v as AmortizationSystem)}
							size="sm"
						/>
					</div>

					{/* Bloco: primeira parcela — sempre visível */}
					<div className="p-4 border-b border-border">
						<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							{view === "sac" ? "Primeira parcela" : "Parcela"}
						</span>
						<div className="mt-1 flex items-baseline gap-1 font-mono">
							<span className="text-sm font-medium text-muted-foreground">
								R$
							</span>
							{firstPaymentVal != null ? (
								<>
									<span className="text-[28px] font-semibold leading-none tracking-tight text-foreground">
										{
											firstPaymentVal
												.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
												.split(",")[0]
										}
									</span>
									<span className="text-lg font-medium leading-none text-muted-foreground">
										,
										{
											firstPaymentVal
												.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
												.split(",")[1]
										}
									</span>
								</>
							) : (
								<span className="text-[28px] font-semibold leading-none tracking-tight text-muted-foreground/40">
									0<span className="text-lg">,00</span>
								</span>
							)}
						</div>
						{active && (
							<p className="mt-1 text-[11px] text-muted-foreground">
								{view === "sac"
									? "primeira parcela — decresce mensalmente"
									: "por mês (parcela constante)"}
							</p>
						)}
						{view === "sac" && lastPaymentVal != null && (
							<div className="mt-2 flex items-center gap-2 rounded bg-muted px-2.5 py-1.5">
								<span className="text-[11px] text-muted-foreground">
									Última parcela
								</span>
								<span className="ml-auto font-mono text-[11px] tabular-nums">
									{brl(lastPaymentVal)}
								</span>
							</div>
						)}
					</div>

					{/* Bloco: detalhamento — sempre visível */}
					<div className="px-4 py-3 flex-1">
						<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Detalhamento — {activeLabel}
						</p>
						{view === "sac" && (
							<ResultRow label="Última parcela" value={lastPaymentVal ?? "–"} />
						)}
						<ResultRow label="Total pago" value={totalPaidVal ?? "–"} />
						<ResultRow label="Total em juros" value={totalInterestVal ?? "–"} />
						<div className="my-2 h-px bg-border" />
						<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Comparação — total pago
						</p>
						<ResultRow
							label="Price — total pago"
							value={priceTotalPaid ?? "–"}
							dim={view !== "price"}
						/>
						<ResultRow
							label="SAC — total pago"
							value={sacTotalPaid ?? "–"}
							dim={view !== "sac"}
						/>
					</div>

					{/* Rodapé com CopyButton — só exibe quando há resultado */}
					{active && results && (
						<div className="flex gap-2 border-t border-border p-3">
							<CopyButton
								size="sm"
								text={buildSummary(activeLabel, active)}
								label="Copiar resumo"
								feedbackText="Copiado"
								variant="outline"
							/>
						</div>
					)}

					{/* Warning stripe — sempre visível */}
					<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
						<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
						<span>
							Estimativa orientativa. Não considera IOF, seguros obrigatórios ou
							outros encargos bancários.
						</span>
					</div>
				</aside>
			</div>

			{/* Tabela de amortização — abaixo do grid principal */}
			{active && results && (
				<div className="rounded-md border border-border bg-card overflow-hidden">
					{/* Header do accordion */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-border">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-foreground">
								Tabela de amortização
							</span>
							<span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
								{view === "price" ? "PRICE" : "SAC"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<OptionSwitch
								options={[
									{ label: "Price", value: "price" },
									{ label: "SAC", value: "sac" },
								]}
								value={view}
								onChange={(v) => setView(v as AmortizationSystem)}
								size="sm"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setTableOpen((o) => !o)}
							>
								<ChevronUp
									className={cn(
										"mr-1 h-3 w-3 transition-transform",
										!tableOpen && "rotate-180",
									)}
								/>
								{tableOpen ? "Recolher" : "Expandir"}
							</Button>
						</div>
					</div>

					{/* Conteúdo da tabela — visível quando tableOpen */}
					{tableOpen && (
						<div className="max-h-96 overflow-auto">
							<table className="w-full text-xs">
								<thead className="sticky top-0 bg-card border-b border-border text-left">
									<tr>
										<th className="px-4 py-2 font-medium text-muted-foreground">
											Mês
										</th>
										<th className="px-4 py-2 font-medium text-muted-foreground">
											Parcela
										</th>
										<th className="px-4 py-2 font-medium text-muted-foreground">
											Juros
										</th>
										<th className="px-4 py-2 font-medium text-muted-foreground">
											Amort.
										</th>
										<th className="px-4 py-2 font-medium text-muted-foreground">
											Saldo
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{active.schedule.map((e) => (
										<tr key={e.month}>
											<td className="px-4 py-1.5 font-mono tabular-nums text-muted-foreground">
												{e.month}
											</td>
											<td className="px-4 py-1.5 font-mono tabular-nums">
												{brl(e.payment)}
											</td>
											<td className="px-4 py-1.5 font-mono tabular-nums text-muted-foreground">
												{brl(e.interest)}
											</td>
											<td className="px-4 py-1.5 font-mono tabular-nums text-muted-foreground">
												{brl(e.amortization)}
											</td>
											<td className="px-4 py-1.5 font-mono tabular-nums">
												{brl(e.balance)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
