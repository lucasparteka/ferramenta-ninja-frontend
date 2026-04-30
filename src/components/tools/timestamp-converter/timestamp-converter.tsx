"use client";

import { useState } from "react";
import { ResultGrid, ResultRow } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import type { TimestampUnit } from "@/lib/date/timestamp";
import {
	formatTimestampToDate,
	getCurrentTimestamp,
	parseDateToTimestamp,
} from "@/lib/date/timestamp";

function buildIsoDateTime(date: string, time: string): string {
	if (!date) return "";
	const t = time || "00:00";
	return `${date}T${t}:00`;
}

export function TimestampConverter() {
	const [unit, setUnit] = useState<TimestampUnit>("seconds");
	const [timestampInput, setTimestampInput] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [timeInput, setTimeInput] = useState("");
	const [resultDate, setResultDate] = useState<string | null>(null);
	const [resultTimestamp, setResultTimestamp] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handleTimestampToDate() {
		setError(null);
		setResultDate(null);
		setResultTimestamp(null);
		if (!timestampInput.trim()) return;

		const num = Number(timestampInput.trim());
		if (Number.isNaN(num)) {
			setError("Timestamp deve ser um número válido.");
			return;
		}

		const formatted = formatTimestampToDate(num, unit);
		if (!formatted) {
			setError("Não foi possível converter o timestamp. Verifique o valor.");
			return;
		}
		setResultDate(formatted);
	}

	function handleDateToTimestamp() {
		setError(null);
		setResultDate(null);
		setResultTimestamp(null);
		if (!dateInput.trim()) return;

		const iso = buildIsoDateTime(dateInput, timeInput);
		const ts = parseDateToTimestamp(iso, unit);
		if (ts === null) {
			setError("Data inválida. Selecione uma data válida.");
			return;
		}
		setResultTimestamp(ts);
	}

	function handleNow() {
		const now = new Date();
		const nowTs = getCurrentTimestamp(unit);
		setTimestampInput(String(nowTs));
		setDateInput(now.toISOString().slice(0, 10));
		setTimeInput(now.toTimeString().slice(0, 5));
		setError(null);
		setResultDate(null);
		setResultTimestamp(null);
	}

	function handleClear() {
		setTimestampInput("");
		setDateInput("");
		setTimeInput("");
		setResultDate(null);
		setResultTimestamp(null);
		setError(null);
	}

	return (
		<div className="space-y-6">
			<div className="max-w-2xl space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="timestamp-unit"
						className="block text-sm font-medium text-foreground"
					>
						Unidade
					</label>
					<NativeSelect
						id="timestamp-unit"
						value={unit}
						onChange={(e) => {
							setUnit(e.target.value as TimestampUnit);
							setResultDate(null);
							setResultTimestamp(null);
							setError(null);
						}}
					>
						<option value="seconds">Segundos</option>
						<option value="milliseconds">Milissegundos</option>
					</NativeSelect>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="timestamp-input"
						className="block text-sm font-medium text-foreground"
					>
						Timestamp Unix ({unit === "seconds" ? "segundos" : "milissegundos"})
					</label>
					<Input
						id="timestamp-input"
						type="text"
						value={timestampInput}
						onChange={(e) => setTimestampInput(e.target.value)}
					placeholder="Ex: 1700000000"
					className="font-mono"
					/>
					<Button
						onClick={handleTimestampToDate}
						disabled={!timestampInput.trim()}
					>
						Converter para data
					</Button>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="date-input"
						className="block text-sm font-medium text-foreground"
					>
						Data
					</label>
					<DateInput
						id="date-input"
						value={dateInput}
						onChange={setDateInput}
					/>
					<div className="grid gap-4 sm:grid-cols-[200px_1fr]">
						<div className="space-y-2">
							<label
								htmlFor="time-input"
								className="block text-sm font-medium text-foreground"
							>
								Hora
							</label>
							<Input
								id="time-input"
								type="time"
								value={timeInput}
						onChange={(e) => setTimeInput(e.target.value)}
							/>
						</div>
						<div className="flex items-end">
							<Button
								onClick={handleDateToTimestamp}
								disabled={!dateInput.trim()}
							>
								Converter para timestamp
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button variant="outline" onClick={handleNow}>
						Agora
					</Button>
					<Button
						variant="ghost"
						onClick={handleClear}
						disabled={!timestampInput && !dateInput}
					>
						Limpar
					</Button>
				</div>
			</div>

			{error && (
				<div className="max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
					<p className="text-sm font-medium text-destructive">{error}</p>
				</div>
			)}

			{(resultDate || resultTimestamp !== null) && (
				<div className="max-w-2xl space-y-4">
					<ResultGrid>
						{resultDate && (
							<ResultRow
								label="Data convertida"
								value={<span className="text-primary">{resultDate}</span>}
							/>
						)}
						{resultTimestamp !== null && (
							<ResultRow
								label="Timestamp convertido"
								value={<span className="text-primary">{resultTimestamp}</span>}
							/>
						)}
					</ResultGrid>
				</div>
			)}
		</div>
	);
}
