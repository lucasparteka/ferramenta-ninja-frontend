"use client";

import { useMemo, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { calculateAge, dateDiff } from "@/lib/date/age";

type Mode = "age" | "diff";

function parseIsoLocal(iso: string): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return null;
	const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
	return Number.isNaN(d.getTime()) ? null : d;
}

export function AgeCalculatorClient() {
	const [mode, setMode] = useState<Mode>("age");
	const [birth, setBirth] = useState("");
	const [reference, setReference] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant={mode === "age" ? "default" : "outline"}
					onClick={() => setMode("age")}
				>
					Calcular idade
				</Button>
				<Button
					type="button"
					variant={mode === "diff" ? "default" : "outline"}
					onClick={() => setMode("diff")}
				>
					Diferença entre datas
				</Button>
			</div>

			{mode === "age" ? (
				<AgeMode
					birth={birth}
					reference={reference}
					onBirthChange={setBirth}
					onReferenceChange={setReference}
				/>
			) : (
				<DiffMode
					start={start}
					end={end}
					onStartChange={setStart}
					onEndChange={setEnd}
				/>
			)}
		</div>
	);
}

function AgeMode(props: {
	birth: string;
	reference: string;
	onBirthChange: (v: string) => void;
	onReferenceChange: (v: string) => void;
}) {
	const result = useMemo(() => {
		if (!props.birth) return null;
		const birthDate = parseIsoLocal(props.birth);
		if (!birthDate) return null;
		const refDate = props.reference
			? parseIsoLocal(props.reference)
			: new Date();
		if (!refDate) return null;
		if (birthDate.getTime() > refDate.getTime()) return null;
		try {
			return calculateAge(birthDate, refDate);
		} catch {
			return null;
		}
	}, [props.birth, props.reference]);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
				<div className="space-y-2">
					<label
						htmlFor="age-birth"
						className="block text-sm font-medium text-foreground"
					>
						Data de nascimento
					</label>
					<DateInput
						id="age-birth"
						value={props.birth}
						onChange={props.onBirthChange}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="age-ref"
						className="block text-sm font-medium text-foreground"
					>
						Data de referência (opcional)
					</label>
					<DateInput
						id="age-ref"
						value={props.reference}
						onChange={props.onReferenceChange}
					/>
				</div>
			</div>

			{result && (
				<div className="space-y-4">
					<ResultBox label="Idade">
						<p className="text-2xl font-bold text-foreground">
							{result.years} {result.years === 1 ? "ano" : "anos"},{" "}
							{result.months} {result.months === 1 ? "mês" : "meses"} e{" "}
							{result.days} {result.days === 1 ? "dia" : "dias"}
						</p>
					</ResultBox>

					<dl className="grid gap-3 sm:grid-cols-2">
						<Stat
							label="Total de dias"
							value={result.totalDays.toLocaleString("pt-BR")}
						/>
						<Stat
							label="Total de semanas"
							value={result.totalWeeks.toLocaleString("pt-BR")}
						/>
						<Stat
							label="Total de horas"
							value={result.totalHours.toLocaleString("pt-BR")}
						/>
						<Stat
							label="Total de minutos"
							value={result.totalMinutes.toLocaleString("pt-BR")}
						/>
					</dl>

					{result.nextBirthday && (
						<div className="rounded-lg border border-border bg-card p-3 text-sm text-foreground">
							Próximo aniversário em{" "}
							<strong>
								{result.nextBirthday.daysUntil}{" "}
								{result.nextBirthday.daysUntil === 1 ? "dia" : "dias"}
							</strong>{" "}
							({result.nextBirthday.date.toLocaleDateString("pt-BR")})
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function DiffMode(props: {
	start: string;
	end: string;
	onStartChange: (v: string) => void;
	onEndChange: (v: string) => void;
}) {
	const result = useMemo(() => {
		if (!props.start || !props.end) return null;
		const a = parseIsoLocal(props.start);
		const b = parseIsoLocal(props.end);
		if (!a || !b) return null;
		return dateDiff(a, b);
	}, [props.start, props.end]);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
				<div className="space-y-2">
					<label
						htmlFor="diff-start"
						className="block text-sm font-medium text-foreground"
					>
						Data inicial
					</label>
					<DateInput
						id="diff-start"
						value={props.start}
						onChange={props.onStartChange}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="diff-end"
						className="block text-sm font-medium text-foreground"
					>
						Data final
					</label>
					<DateInput
						id="diff-end"
						value={props.end}
						onChange={props.onEndChange}
					/>
				</div>
			</div>

			{result && (
				<div className="space-y-4">
					<ResultBox label="Diferença">
						<p className="text-2xl font-bold text-foreground">
							{result.years} {result.years === 1 ? "ano" : "anos"},{" "}
							{result.months} {result.months === 1 ? "mês" : "meses"} e{" "}
							{result.days} {result.days === 1 ? "dia" : "dias"}
						</p>
					</ResultBox>
					<dl className="grid gap-3 sm:grid-cols-2">
						<Stat
							label="Total de dias"
							value={result.totalDays.toLocaleString("pt-BR")}
						/>
						<Stat
							label="Total de semanas"
							value={Math.floor(result.totalDays / 7).toLocaleString("pt-BR")}
						/>
					</dl>
				</div>
			)}
		</div>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-card p-3">
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
		</div>
	);
}
