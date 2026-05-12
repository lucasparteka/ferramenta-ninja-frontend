"use client";

import { AlertTriangle, Download, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateTermination,
	type NoticePolicy,
	type TerminationResult,
} from "@/lib/labor/termination";
import type { TerminationType } from "@/lib/payroll";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";

type TerminationTypeOption = TerminationType | "indirect-resignation";

interface TerminationFormState {
	salary: number;
	admissionDate: string;
	terminationDate: string;
	terminationReason: TerminationTypeOption;
	noticeType: NoticePolicy;
	fgtsBalance: number;
	dependents: number;
	hasExpiredVacation: boolean;
	thirteenthAlreadyPaid: boolean;
}

const DEFAULTS: TerminationFormState = {
	salary: 0,
	admissionDate: "",
	terminationDate: "",
	terminationReason: "no-cause",
	noticeType: "indemnified",
	fgtsBalance: 0,
	dependents: 0,
	hasExpiredVacation: false,
	thirteenthAlreadyPaid: false,
};

const TERMINATION_REASON_OPTIONS: {
	value: TerminationTypeOption;
	label: string;
}[] = [
	{ value: "no-cause", label: "Demissão sem justa causa" },
	{ value: "resignation", label: "Pedido de demissão" },
	{ value: "agreement", label: "Acordo entre as partes" },
	{ value: "contract-end", label: "Fim de contrato determinado" },
	{ value: "with-cause", label: "Justa causa" },
	{ value: "indirect-resignation", label: "Rescisão indireta" },
];

const NOTICE_POLICY_OPTIONS = [
	{ value: "indemnified" as NoticePolicy, label: "Indenizado" },
	{ value: "worked" as NoticePolicy, label: "Trabalhado" },
	{ value: "not-served" as NoticePolicy, label: "Dispensado" },
];

function formatBRL(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function splitBRL(value: number): { integer: string; cents: string } {
	const [integer = "0", cents = "00"] = value
		.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		.split(",");
	return { integer, cents };
}

function buildSummary(r: TerminationResult): string {
	const lines = [
		`Rescisão — Total líquido: ${formatBRL(r.netTotal)}`,
		`Bruto: ${formatBRL(r.grossTotal)} · INSS: ${formatBRL(r.inss)} · IRRF: ${formatBRL(r.irrf)}`,
		"",
		...r.lines.map((l) => `${l.label}: ${formatBRL(l.amount)}`),
	];
	if (r.fgtsWithdrawable > 0)
		lines.push(`FGTS sacável: ${formatBRL(r.fgtsWithdrawable)}`);
	lines.push(
		"",
		`Tempo: ${r.yearsAtCompany}a ${r.monthsAtCompany % 12}m · Aviso: ${r.noticeDays} dias`,
		r.unemploymentInsuranceEligible
			? "Com direito ao seguro-desemprego"
			: "Sem direito a seguro-desemprego",
	);
	return lines.join("\n");
}

export function RescisaoClient() {
	const [state, setState] = useState<TerminationFormState>(DEFAULTS);

	function set<K extends keyof TerminationFormState>(key: K) {
		return (value: TerminationFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo<TerminationResult | null>(() => {
		if (!state.admissionDate || !state.terminationDate || state.salary <= 0)
			return null;
		const adm = new Date(`${state.admissionDate}T12:00:00`);
		const res = new Date(`${state.terminationDate}T12:00:00`);
		if (Number.isNaN(adm.getTime()) || Number.isNaN(res.getTime())) return null;
		if (res <= adm) return null;
		return calculateTermination({
			monthlySalary: state.salary,
			admissionDate: adm,
			terminationDate: res,
			type:
				state.terminationReason === "indirect-resignation"
					? "no-cause"
					: state.terminationReason,
			noticePolicy: state.noticeType,
			fgtsBalance: state.fgtsBalance,
			dependents: state.dependents,
			hasExpiredVacation: state.hasExpiredVacation,
			thirteenthAlreadyPaid: state.thirteenthAlreadyPaid,
		});
	}, [state]);

	const split = result ? splitBRL(result.netTotal) : null;

	async function handlePdfDownload() {
		if (!result) return;
		const { generateTerminationPdf } = await import(
			"@/lib/labor/termination-pdf"
		);
		const bytes = await generateTerminationPdf(result, {
			salary: state.salary,
			admissionDate: state.admissionDate,
			terminationDate: state.terminationDate,
			terminationReason:
				TERMINATION_REASON_OPTIONS.find(
					(o) => o.value === state.terminationReason,
				)?.label ?? "",
			noticeType:
				NOTICE_POLICY_OPTIONS.find((o) => o.value === state.noticeType)
					?.label ?? "",
		});
		const blob = new Blob([bytes.buffer as ArrayBuffer], {
			type: "application/pdf",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "rescisao.pdf";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel hint="Dados básicos do contrato">
							Vínculo empregatício
						</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="salary"
									className="mb-1.5 block text-xs text-foreground"
								>
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
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label
										htmlFor="admissionDate"
										className="mb-1.5 block text-xs text-foreground"
									>
										Data de admissão
									</Label>
									<DateInput
										id="admissionDate"
										value={state.admissionDate}
										onChange={set("admissionDate")}
									/>
								</div>
								<div>
									<Label
										htmlFor="terminationDate"
										className="mb-1.5 block text-xs text-foreground"
									>
										Data de rescisão
									</Label>
									<DateInput
										id="terminationDate"
										value={state.terminationDate}
										onChange={set("terminationDate")}
										min={state.admissionDate || undefined}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="p-5">
						<SectionLabel>Tipo de rescisão</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="terminationReason"
									className="mb-1.5 block text-xs text-foreground"
								>
									Motivo da rescisão
								</Label>
								<NativeSelect
									id="terminationReason"
									value={state.terminationReason}
									onChange={(e) =>
										set("terminationReason")(
											e.target.value as TerminationTypeOption,
										)
									}
								>
									{TERMINATION_REASON_OPTIONS.map((m) => (
										<option key={m.value} value={m.value}>
											{m.label}
										</option>
									))}
								</NativeSelect>
							</div>
							<div>
								<p className="mb-1.5 text-xs font-medium text-foreground">
									Aviso prévio
								</p>
								<OptionSwitch
									value={state.noticeType}
									onChange={(v) => set("noticeType")(v as NoticePolicy)}
									options={NOTICE_POLICY_OPTIONS}
									fullWidth
								/>
							</div>
						</div>
					</div>
					<div className="p-5">
						<SectionLabel hint="Opcional">Informações adicionais</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label
										htmlFor="fgts"
										className="mb-1.5 block text-xs text-foreground"
									>
										Saldo do FGTS atual
									</Label>
									<CurrencyInput
										value={
											state.fgtsBalance > 0 ? state.fgtsBalance : undefined
										}
										onChangeValue={(_, num) =>
											set("fgtsBalance")((num as number) ?? 0)
										}
										InputElement={
											<Input
												id="fgts"
												type="text"
												placeholder="R$ 0,00"
												inputMode="decimal"
											/>
										}
									/>
									<p className="mt-1 text-[11px] text-muted-foreground">
										Em branco usa estimativa de 8%
									</p>
								</div>
								<div>
									<Label
										htmlFor="deps"
										className="mb-1.5 block text-xs text-foreground"
									>
										Dependentes para IRRF
									</Label>
									<Input
										id="deps"
										type="number"
										min={0}
										max={10}
										value={state.dependents}
										onChange={(e) => set("dependents")(Number(e.target.value))}
										className="font-mono tabular-nums"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2.5">
								<Label
									htmlFor="expired-vacation"
									className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors ${
										state.hasExpiredVacation
											? "border-primary bg-primary/5"
											: "border-border bg-card"
									}`}
								>
									<Checkbox
										id="expired-vacation"
										checked={state.hasExpiredVacation}
										onCheckedChange={(v) =>
											set("hasExpiredVacation")(v === true)
										}
										className="mt-0.5 shrink-0"
									/>
									<span className="text-[12.5px] leading-snug text-foreground">
										Possui férias vencidas
									</span>
								</Label>
								<Label
									htmlFor="thirteenth-paid"
									className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors ${
										state.thirteenthAlreadyPaid
											? "border-primary bg-primary/5"
											: "border-border bg-card"
									}`}
								>
									<Checkbox
										id="thirteenth-paid"
										checked={state.thirteenthAlreadyPaid}
										onCheckedChange={(v) =>
											set("thirteenthAlreadyPaid")(v === true)
										}
										className="mt-0.5 shrink-0"
									/>
									<span className="text-[12.5px] leading-snug text-foreground">
										13º deste ano já recebido
									</span>
								</Label>
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
			<aside className="flex h-full lg:border-l max-lg:border-t flex-col gap-3">
				<div className="flex-1">
					{result && split ? (
						<>
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
									<span>
										Bruto{" "}
										<span className="font-mono tabular-nums text-foreground">
											{result.grossTotal.toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</span>
									</span>
									<span>
										· INSS{" "}
										<span className="font-mono tabular-nums text-foreground">
											{result.inss.toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</span>
									</span>
									<span>
										· IRRF{" "}
										<span className="font-mono tabular-nums text-foreground">
											{result.irrf.toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</span>
									</span>
								</div>
							</div>
							<div className="px-4.5 py-3">
								<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Detalhamento
								</p>
								{result.lines.map((l) => (
									<ResultRow key={l.label} label={l.label} value={l.amount} />
								))}
								<div className="my-2 h-px bg-border" />
								<ResultRow label="(−) INSS" value={result.inss} dim />
								<ResultRow label="(−) IRRF" value={result.irrf} dim />
								<div className="my-2 h-px bg-border" />
								<ResultRow
									label="Total líquido"
									value={result.netTotal}
									strong
								/>
							</div>
							<div className="flex flex-col gap-1 border-t border-border bg-muted px-4.5 py-2.5 text-[11.5px] text-muted-foreground">
								<div className="flex justify-between">
									<span>Tempo de empresa</span>
									<span className="font-mono tabular-nums text-foreground">
										{result.yearsAtCompany}a {result.monthsAtCompany % 12}m
									</span>
								</div>
								<div className="flex justify-between">
									<span>Aviso prévio devido</span>
									<span className="font-mono tabular-nums text-foreground">
										{result.noticeDays} dias
									</span>
								</div>
								{result.fgtsWithdrawable > 0 && (
									<div className="flex justify-between">
										<span>FGTS sacável</span>
										<span className="font-mono tabular-nums font-semibold text-foreground">
											{formatBRL(result.fgtsWithdrawable)}
										</span>
									</div>
								)}
								<div className="flex justify-between">
									<span>Seguro-desemprego</span>
									<span
										className={
											result.unemploymentInsuranceEligible
												? "font-medium text-success"
												: "font-medium text-warning"
										}
									>
										{result.unemploymentInsuranceEligible
											? "Com direito"
											: "Sem direito"}
									</span>
								</div>
							</div>
							<div className="flex gap-2 border-t border-border p-3">
								<CopyButton
									text={buildSummary(result)}
									label="Copiar resumo"
									feedbackText="Copiado"
								/>
								<Button
									variant="outline"
									aria-label="Exportar PDF"
									onClick={handlePdfDownload}
									disabled={!result}
								>
									<Download />
									PDF
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Preencha salário e datas para ver o resultado
							</p>
						</div>
					)}
				</div>
				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Estimativa orientativa baseada na CLT vigente. Para casos com
						insalubridade, comissões ou horas extras habituais, consulte um
						contador.
					</span>
				</div>
			</aside>
		</div>
	);
}
