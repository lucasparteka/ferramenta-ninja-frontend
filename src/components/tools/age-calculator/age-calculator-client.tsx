"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import { calculateAge, dateDiff } from "@/lib/date/age";

type Mode = "age" | "diff";

function parseIsoLocal(iso: string): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return null;
	const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
	return Number.isNaN(d.getTime()) ? null : d;
}

function pluralize(n: number, singular: string, plural: string) {
	return `${n} ${n === 1 ? singular : plural}`;
}

export function AgeCalculatorClient() {
	const [mode, setMode] = useState<Mode>("age");
	const [birth, setBirth] = useState("");
	const [reference, setReference] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");

	const ageResult = useMemo(() => {
		if (!birth) return null;
		const birthDate = parseIsoLocal(birth);
		if (!birthDate) return null;
		const refDate = reference ? parseIsoLocal(reference) : new Date();
		if (!refDate) return null;
		if (birthDate.getTime() > refDate.getTime()) return null;
		try {
			return calculateAge(birthDate, refDate);
		} catch {
			return null;
		}
	}, [birth, reference]);

	const diffResult = useMemo(() => {
		if (!start || !end) return null;
		const a = parseIsoLocal(start);
		const b = parseIsoLocal(end);
		if (!a || !b) return null;
		return dateDiff(a, b);
	}, [start, end]);

	const hasInput = mode === "age" ? !!birth : !!start && !!end;

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Modo</SectionLabel>
						<OptionSwitch
							options={[
								{ label: "Calcular idade", value: "age" },
								{ label: "Diferença entre datas", value: "diff" },
							]}
							value={mode}
							onChange={(v) => setMode(v as Mode)}
						/>
					</div>

					<div className="p-5">
						<SectionLabel>Datas</SectionLabel>
						{mode === "age" ? (
							<div className="space-y-3.5">
								<div>
									<Label htmlFor="age-birth" className="mb-1.5 block text-xs">
										Data de nascimento
									</Label>
									<DateInput id="age-birth" value={birth} onChange={setBirth} />
								</div>
								<div>
									<Label htmlFor="age-ref" className="mb-1.5 block text-xs">
										Data de referência
									</Label>
									<DateInput
										id="age-ref"
										value={reference}
										onChange={setReference}
									/>
									<p className="mt-1 text-caption text-muted-foreground">
										Em branco usa a data de hoje
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-3.5">
								<div>
									<Label htmlFor="diff-start" className="mb-1.5 block text-xs">
										Data inicial
									</Label>
									<DateInput
										id="diff-start"
										value={start}
										onChange={setStart}
									/>
								</div>
								<div>
									<Label htmlFor="diff-end" className="mb-1.5 block text-xs">
										Data final
									</Label>
									<DateInput id="diff-end" value={end} onChange={setEnd} />
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex items-center gap-1.5 border-t border-border bg-muted px-5 py-3 mt-auto text-[11.5px] text-muted-foreground">
					<Info size={12} />
					Atualizado em tempo real
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{mode === "age" ? (
					ageResult ? (
						<>
							<div className="p-4 border-b border-border">
								<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Idade
								</span>
								<p className="mt-1 font-mono text-base font-semibold leading-snug text-foreground">
									{pluralize(ageResult.years, "ano", "anos")},{" "}
									{pluralize(ageResult.months, "mês", "meses")} e{" "}
									{pluralize(ageResult.days, "dia", "dias")}
								</p>
							</div>

							<div className="px-4 py-3 flex-1">
								<SectionLabel>Detalhamento</SectionLabel>
								<ResultRow
									label="Total de dias"
									value={ageResult.totalDays.toLocaleString("pt-BR")}
								/>
								<ResultRow
									label="Total de semanas"
									value={ageResult.totalWeeks.toLocaleString("pt-BR")}
								/>
								<ResultRow
									label="Total de horas"
									value={ageResult.totalHours.toLocaleString("pt-BR")}
								/>
								<ResultRow
									label="Total de minutos"
									value={ageResult.totalMinutes.toLocaleString("pt-BR")}
								/>
							</div>

							{ageResult.nextBirthday && (
								<div className="border-t border-border px-4 py-3 text-[11.5px] text-muted-foreground">
									Próximo aniversário em{" "}
									<span className="font-mono font-medium text-foreground">
										{pluralize(ageResult.nextBirthday.daysUntil, "dia", "dias")}
									</span>{" "}
									({ageResult.nextBirthday.date.toLocaleDateString("pt-BR")})
								</div>
							)}
						</>
					) : (
						<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								{hasInput
									? "Verifique as datas informadas"
									: "Informe a data de nascimento para calcular"}
							</p>
						</div>
					)
				) : diffResult ? (
					<>
						<div className="p-4 border-b border-border">
							<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Diferença
							</span>
							<p className="mt-1 font-mono text-base font-semibold leading-snug text-foreground">
								{pluralize(diffResult.years, "ano", "anos")},{" "}
								{pluralize(diffResult.months, "mês", "meses")} e{" "}
								{pluralize(diffResult.days, "dia", "dias")}
							</p>
						</div>

						<div className="px-4 py-3 flex-1">
							<SectionLabel>Detalhamento</SectionLabel>
							<ResultRow
								label="Total de dias"
								value={diffResult.totalDays.toLocaleString("pt-BR")}
							/>
							<ResultRow
								label="Total de semanas"
								value={Math.floor(diffResult.totalDays / 7).toLocaleString(
									"pt-BR",
								)}
							/>
						</div>
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
						<p className="text-sm text-muted-foreground">
							{hasInput
								? "Verifique as datas informadas"
								: "Informe as duas datas para calcular a diferença"}
						</p>
					</div>
				)}
			</aside>
		</div>
	);
}
