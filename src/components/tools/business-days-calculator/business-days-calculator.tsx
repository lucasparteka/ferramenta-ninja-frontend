"use client";

import { AlertTriangle, Trash } from "lucide-react";
import { useState } from "react";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	addBusinessDays,
	calculateBusinessDays,
	formatFullDate,
	type HolidayInfo,
} from "@/lib/date/holidays";

type TabMode = "range" | "add";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_PRESETS = [
	CURRENT_YEAR - 1,
	CURRENT_YEAR,
	CURRENT_YEAR + 1,
	CURRENT_YEAR + 2,
	CURRENT_YEAR + 3,
	CURRENT_YEAR + 4,
];

type RangeResult = {
	totalDays: number;
	businessDays: number;
	weekendDays: number;
	holidayDays: number;
	holidays: HolidayInfo[];
};

type AddResult = {
	targetDate: string;
	businessDaysUsed: number;
	totalDaysElapsed: number;
};

export function BusinessDaysCalculator() {
	const [mode, setMode] = useState<TabMode>("range");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [daysToAdd, setDaysToAdd] = useState("");
	const [includeOptional, setIncludeOptional] = useState(false);
	const [rangeResult, setRangeResult] = useState<RangeResult | null>(null);
	const [addResult, setAddResult] = useState<AddResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	function applyYearPreset(year: number) {
		setStartDate(`${year}-01-01`);
		setEndDate(`${year}-12-31`);
		setRangeResult(null);
		setAddResult(null);
		setError(null);
	}

	function handleCalculateRange() {
		setError(null);
		setRangeResult(null);
		if (!startDate || !endDate) {
			setError("Selecione a data inicial e a data final.");
			return;
		}
		const calc = calculateBusinessDays(startDate, endDate, includeOptional);
		if (!calc.dateRangeValid) {
			setError("A data final deve ser igual ou posterior à data inicial.");
			return;
		}
		setRangeResult({
			totalDays: calc.totalDays,
			businessDays: calc.businessDays,
			weekendDays: calc.weekendDays,
			holidayDays: calc.holidayDays,
			holidays: calc.holidays,
		});
	}

	function handleAddDays() {
		setError(null);
		setAddResult(null);
		if (!startDate || !daysToAdd.trim()) {
			setError("Selecione a data inicial e informe o número de dias úteis.");
			return;
		}
		const num = Number(daysToAdd.replace(",", "."));
		if (Number.isNaN(num) || num < 0 || !Number.isInteger(num)) {
			setError("Informe um número inteiro válido de dias úteis.");
			return;
		}
		const calc = addBusinessDays(startDate, num, includeOptional);
		if (!calc) {
			setError("Não foi possível calcular. Verifique as datas.");
			return;
		}
		setAddResult({
			targetDate: calc.date,
			businessDaysUsed: calc.businessDaysUsed,
			totalDaysElapsed: calc.totalDaysElapsed,
		});
	}

	function handleClear() {
		setStartDate("");
		setEndDate("");
		setDaysToAdd("");
		setRangeResult(null);
		setAddResult(null);
		setError(null);
	}

	const hasResult = !!(rangeResult || addResult);

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Modo</SectionLabel>
						<OptionSwitch
							options={[
								{ label: "Dias entre datas", value: "range" },
								{ label: "Adicionar dias úteis", value: "add" },
							]}
							value={mode}
							onChange={(v) => {
								setMode(v as TabMode);
								setRangeResult(null);
								setAddResult(null);
								setError(null);
							}}
						/>
					</div>

					{mode === "range" && (
						<div className="p-5">
							<SectionLabel>Ano completo</SectionLabel>
							<div className="flex flex-wrap gap-1.5">
								{YEAR_PRESETS.map((year) => (
									<button
										key={year}
										type="button"
										onClick={() => applyYearPreset(year)}
										className="inline-flex items-center rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-medium text-foreground transition-colors hover:bg-accent"
									>
										{year}
									</button>
								))}
							</div>
						</div>
					)}

					<div className="p-5">
						<SectionLabel>Datas</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label htmlFor="bd-start" className="mb-1.5 block text-xs">
									Data inicial
								</Label>
								<DateInput
									id="bd-start"
									value={startDate}
									onChange={setStartDate}
								/>
							</div>
							{mode === "range" ? (
								<div>
									<Label htmlFor="bd-end" className="mb-1.5 block text-xs">
										Data final
									</Label>
									<DateInput
										id="bd-end"
										value={endDate}
										onChange={setEndDate}
									/>
								</div>
							) : (
								<div>
									<Label htmlFor="bd-days" className="mb-1.5 block text-xs">
										Dias úteis a adicionar
									</Label>
									<Input
										id="bd-days"
										type="text"
										inputMode="numeric"
										value={daysToAdd}
										onChange={(e) => setDaysToAdd(e.target.value)}
										placeholder="Ex: 10"
									/>
								</div>
							)}
						</div>
					</div>

					<div className="p-5">
						<div className="flex items-start gap-2">
							<Checkbox
								id="bd-optional"
								checked={includeOptional}
								onCheckedChange={(checked) =>
									setIncludeOptional(checked === true)
								}
							/>
							<Label
								htmlFor="bd-optional"
								className="cursor-pointer text-xs leading-relaxed"
							>
								Incluir feriados facultativos (Dia do Servidor, Véspera de
								Natal, Véspera de Ano-Novo)
							</Label>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClear}
						disabled={!startDate && !endDate && !daysToAdd && !hasResult}
					>
						<Trash className="mr-1.5 h-3 w-3" />
						Limpar
					</Button>
					<Button
						onClick={mode === "range" ? handleCalculateRange : handleAddDays}
						disabled={!startDate || (mode === "range" ? !endDate : !daysToAdd)}
					>
						Calcular
					</Button>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{error ? (
					<div className="p-4">
						<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
							<div className="flex items-start gap-2">
								<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
								<p className="text-xs text-destructive">{error}</p>
							</div>
						</div>
					</div>
				) : rangeResult ? (
					<div className="flex-1 overflow-y-auto">
						<div className="p-4 border-b border-border">
							<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Dias úteis
							</span>
							<p className="mt-1 font-mono text-[32px] font-semibold leading-none tracking-tight text-foreground">
								{rangeResult.businessDays.toLocaleString("pt-BR")}
							</p>
						</div>

						<div className="p-4 border-b border-border">
							<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Detalhamento
							</p>
							<div className="divide-y divide-border">
								<Row
									label="Total de dias"
									value={rangeResult.totalDays.toLocaleString("pt-BR")}
								/>
								<Row
									label="Fins de semana"
									value={rangeResult.weekendDays.toLocaleString("pt-BR")}
								/>
								<Row
									label="Feriados"
									value={rangeResult.holidayDays.toLocaleString("pt-BR")}
								/>
							</div>
						</div>

						{rangeResult.holidays.length > 0 && (
							<div className="p-4">
								<p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Feriados no período
								</p>
								<div className="divide-y divide-border">
									{rangeResult.holidays.map((h) => (
										<div
											key={h.date}
											className="flex items-center justify-between py-2"
										>
											<span className="font-mono text-caption text-muted-foreground">
												{formatFullDate(new Date(h.date + "T12:00:00"))}
											</span>
											<span className="text-xs font-medium text-foreground text-right ml-2">
												{h.name}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				) : addResult ? (
					<div className="flex-1 p-4">
						<div className="border-b border-border pb-4 mb-4">
							<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Data resultante
							</span>
							<p className="mt-1 font-mono text-base font-semibold text-foreground">
								{formatFullDate(new Date(addResult.targetDate + "T12:00:00"))}
							</p>
						</div>
						<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Detalhamento
						</p>
						<div className="divide-y divide-border">
							<Row
								label="Dias úteis adicionados"
								value={addResult.businessDaysUsed.toLocaleString("pt-BR")}
							/>
							<Row
								label="Dias corridos totais"
								value={addResult.totalDaysElapsed.toLocaleString("pt-BR")}
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
						<p className="text-sm text-muted-foreground">
							Preencha os dados e clique em Calcular
						</p>
					</div>
				)}
			</aside>
		</div>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between py-1.5">
			<span className="text-[12.5px] text-muted-foreground">{label}</span>
			<span className="font-mono text-[12.5px] tabular-nums text-foreground">
				{value}
			</span>
		</div>
	);
}
