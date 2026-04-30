"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { ResultGrid, ResultRow } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
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

export function BusinessDaysCalculator() {
	const [mode, setMode] = useState<TabMode>("range");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [daysToAdd, setDaysToAdd] = useState("");
	const [includeOptional, setIncludeOptional] = useState(false);
	const [result, setResult] = useState<{
		range?: {
			totalDays: number;
			businessDays: number;
			weekendDays: number;
			holidayDays: number;
			holidays: HolidayInfo[];
		};
		add?: {
			targetDate: string;
			businessDaysUsed: number;
			totalDaysElapsed: number;
		};
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	function applyYearPreset(year: number) {
		setStartDate(`${year}-01-01`);
		setEndDate(`${year}-12-31`);
		setResult(null);
		setError(null);
	}

	function handleCalculateRange() {
		setError(null);
		setResult(null);

		if (!startDate || !endDate) {
			setError("Selecione a data inicial e a data final.");
			return;
		}

		const calc = calculateBusinessDays(startDate, endDate, includeOptional);
		if (!calc.dateRangeValid) {
			setError("A data final deve ser igual ou posterior à data inicial.");
			return;
		}

		setResult({
			range: {
				totalDays: calc.totalDays,
				businessDays: calc.businessDays,
				weekendDays: calc.weekendDays,
				holidayDays: calc.holidayDays,
				holidays: calc.holidays,
			},
		});
	}

	function handleAddDays() {
		setError(null);
		setResult(null);

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

		setResult({
			add: {
				targetDate: calc.date,
				businessDaysUsed: calc.businessDaysUsed,
				totalDaysElapsed: calc.totalDaysElapsed,
			},
		});
	}

	function handleClear() {
		setStartDate("");
		setEndDate("");
		setDaysToAdd("");
		setResult(null);
		setError(null);
	}

	return (
		<div className="space-y-6">
			{/* Mode tabs */}
			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => {
						setMode("range");
						setResult(null);
						setError(null);
					}}
					className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
						mode === "range"
							? "border-primary bg-primary text-primary-foreground"
							: "border-border bg-card text-foreground hover:bg-accent"
					}`}
				>
					Dias úteis entre datas
				</button>
				<button
					type="button"
					onClick={() => {
						setMode("add");
						setResult(null);
						setError(null);
					}}
					className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
						mode === "add"
							? "border-primary bg-primary text-primary-foreground"
							: "border-border bg-card text-foreground hover:bg-accent"
					}`}
				>
					Adicionar dias úteis
				</button>
			</div>

			<div className="max-w-2xl space-y-4">
				{/* Year presets - only in range mode */}
				{mode === "range" && (
					<div className="space-y-2">
						<span className="block text-sm font-medium text-foreground">
							Ano completo
						</span>
						<div className="flex flex-wrap gap-2">
							{YEAR_PRESETS.map((year) => (
								<button
									key={year}
									type="button"
									onClick={() => applyYearPreset(year)}
									className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
								>
									{year}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Date inputs */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<label
							htmlFor="bd-start"
							className="block text-sm font-medium text-foreground"
						>
							Data inicial
						</label>
						<DateInput
							id="bd-start"
							value={startDate}
							onChange={setStartDate}
						/>
					</div>

					{mode === "range" ? (
						<div className="space-y-2">
							<label
								htmlFor="bd-end"
								className="block text-sm font-medium text-foreground"
							>
								Data final
							</label>
							<DateInput id="bd-end" value={endDate} onChange={setEndDate} />
						</div>
					) : (
						<div className="space-y-2">
							<label
								htmlFor="bd-days"
								className="block text-sm font-medium text-foreground"
							>
								Dias úteis a adicionar
							</label>
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

				{/* Optional holidays checkbox */}
				<div className="flex items-center gap-2">
					<input
						id="bd-optional"
						type="checkbox"
						checked={includeOptional}
						onChange={(e) => setIncludeOptional(e.target.checked)}
						className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
					/>
					<label htmlFor="bd-optional" className="text-sm text-foreground">
						Contabilizar feriados facultativos (Dia do Servidor Público, Véspera
						de Natal, Véspera de Ano-Novo)
					</label>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						onClick={mode === "range" ? handleCalculateRange : handleAddDays}
						disabled={!startDate || (mode === "range" ? !endDate : !daysToAdd)}
					>
						Calcular
					</Button>
					<Button
						variant="secondary"
						onClick={handleClear}
						disabled={!startDate && !endDate && !daysToAdd}
					>
						<Trash />
						Limpar
					</Button>
				</div>
			</div>

			{error && (
				<div className="max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
					<p className="text-sm font-medium text-destructive">{error}</p>
				</div>
			)}

			{result?.range && (
				<div className="max-w-2xl space-y-4">
					<ResultGrid>
						<ResultRow
							label="Total de dias"
							value={
								<span className="text-primary">{result.range.totalDays}</span>
							}
						/>
						<ResultRow
							label="Dias úteis"
							value={
								<span className="text-primary">
									{result.range.businessDays}
								</span>
							}
						/>
						<ResultRow
							label="Fins de semana"
							value={result.range.weekendDays}
						/>
						<ResultRow label="Feriados" value={result.range.holidayDays} />
					</ResultGrid>

					{result.range.holidays.length > 0 && (
						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-foreground">
								Feriados no período
							</h4>
							<div className="grid gap-2">
								{result.range.holidays.map((h) => (
									<div
										key={h.date}
										className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
									>
										<span className="text-muted-foreground">
											{formatFullDate(new Date(h.date + "T12:00:00"))}
										</span>
										<span className="font-medium text-foreground">
											{h.name}
										</span>
										<span className="text-xs capitalize text-muted-foreground">
											{h.type}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{result?.add && (
				<div className="max-w-2xl space-y-4">
					<ResultGrid>
						<ResultRow
							label="Data resultante"
							value={
								<span className="text-primary">
									{formatFullDate(
										new Date(result.add.targetDate + "T12:00:00"),
									)}
								</span>
							}
						/>
						<ResultRow
							label="Dias úteis adicionados"
							value={result.add.businessDaysUsed}
						/>
						<ResultRow
							label="Dias corridos totais"
							value={result.add.totalDaysElapsed}
						/>
					</ResultGrid>
				</div>
			)}
		</div>
	);
}
