"use client";

import { useId, useMemo, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateDay,
	calculateWeek,
	formatMinutes,
	formatDecimal,
} from "@/lib/work-hours";
import type { DayEntry } from "@/lib/work-hours";

const DAY_LABELS = [
	"Segunda-feira",
	"Terça-feira",
	"Quarta-feira",
	"Quinta-feira",
	"Sexta-feira",
	"Sábado",
	"Domingo",
];

const DEFAULT_BREAK = 60;
const emptyEntry = (day: string): DayEntry => ({
	day,
	startTime: "",
	endTime: "",
	breakMinutes: DEFAULT_BREAK,
});

function useWorkHoursState() {
	const [entries, setEntries] = useState<DayEntry[]>(
		DAY_LABELS.map(emptyEntry),
	);

	function update(
		index: number,
		field: keyof DayEntry,
		value: string | number,
	) {
		setEntries((prev) =>
			prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
		);
	}

	function reset() {
		setEntries(DAY_LABELS.map(emptyEntry));
	}

	return { entries, update, reset };
}

export function WorkHoursCalculator() {
	const { entries, update, reset } = useWorkHoursState();
	const [showWeekend, setShowWeekend] = useState(false);

	const weekResult = useMemo(() => calculateWeek(entries), [entries]);

	const visibleEntries = showWeekend ? entries : entries.slice(0, 5);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Label>
					<input
						type="checkbox"
						checked={showWeekend}
						onChange={(e) => setShowWeekend(e.target.checked)}
						className="h-4 w-4 rounded border-border accent-primary"
					/>
					Incluir sábado e domingo
				</Label>
				<Button type="button" variant="outline" size="sm" onClick={reset}>
					Limpar tudo
				</Button>
			</div>

			<div className="space-y-3">
				{visibleEntries.map((entry, idx) => (
					<DayRow
						key={entry.day}
						entry={entry}
						onChange={(field, value) => update(idx, field, value)}
						index={idx}
					/>
				))}
			</div>

			<ResultBox label="Total da Semana">
				<p className="text-2xl font-semibold font-mono text-foreground">
					{weekResult.weeklyTotalFormatted}
				</p>
				<p className="text-sm text-muted-foreground">
					{weekResult.weeklyTotalMinutes} minutos ·{" "}
					{formatDecimal(weekResult.weeklyTotalMinutes)} horas decimais
				</p>
			</ResultBox>

			<dl className="grid gap-3 sm:grid-cols-2">
				<Stat
					label="Média diária"
					value={
						weekResult.dailyAverageMinutes > 0
							? weekResult.dailyAverageFormatted
							: "—"
					}
				/>
				<Stat
					label="Estimativa mensal"
					value={
						weekResult.monthlyEstimateMinutes > 0
							? weekResult.monthlyEstimateFormatted
							: "—"
					}
				/>
				<Stat
					label="Dias trabalhados na semana"
					value={weekResult.days
						.filter((d) => d.totalMinutes > 0)
						.length.toString()}
				/>
				<Stat
					label="Total em horas decimais"
					value={`${formatDecimal(weekResult.weeklyTotalMinutes)}h`}
				/>
			</dl>
		</div>
	);
}

function DayRow({
	entry,
	onChange,
	index,
}: {
	entry: DayEntry;
	onChange: (field: keyof DayEntry, value: string | number) => void;
	index: number;
}) {
	const uid = useId();
	const result = useMemo(() => calculateDay(entry), [entry]);

	const isWeekend = index >= 5;

	return (
		<div
			className={`rounded-md border p-3 ${
				isWeekend ? "border-dashed border-border/60" : "border-border"
			}`}
		>
			<span className="mb-3 block text-sm font-medium text-foreground">
				{entry.day}
			</span>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2 sm:items-center">
				<TimeInput
					id={`${uid}-start`}
					label="Entrada"
					value={entry.startTime}
					onChange={(v) => onChange("startTime", v)}
				/>
				<TimeInput
					id={`${uid}-end`}
					label="Saída"
					value={entry.endTime}
					onChange={(v) => onChange("endTime", v)}
				/>

				<div className="space-y-1">
					<Label
						htmlFor={`${uid}-break`}
						className="block text-[11px] uppercase tracking-wider text-muted-foreground"
					>
						Intervalo
					</Label>
					<NativeSelect
						id={`${uid}-break`}
						value={entry.breakMinutes}
						onChange={(e) => onChange("breakMinutes", Number(e.target.value))}
					>
						<option value={0}>0 min</option>
						<option value={15}>15 min</option>
						<option value={30}>30 min</option>
						<option value={45}>45 min</option>
						<option value={60}>1h</option>
						<option value={90}>1h30</option>
						<option value={120}>2h</option>
					</NativeSelect>
				</div>

				<div className="flex items-end justify-end">
					<div className="rounded-md bg-muted px-3 py-2 text-center min-w-[72px]">
						{result.totalMinutes > 0 ? (
							<>
								<p className="text-sm font-semibold text-foreground">
									{result.formatted}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{formatDecimal(result.totalMinutes)}h
								</p>
							</>
						) : (
							<span className="text-xs text-muted-foreground">—</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function TimeInput({
	id,
	label,
	value,
	onChange,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="space-y-1">
			<Label
				htmlFor={id}
				className="block text-[11px] uppercase tracking-wider text-muted-foreground"
			>
				{label}
			</Label>
			<Input
				id={id}
				type="time"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-md border border-border bg-card p-3">
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
		</div>
	);
}
