"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import type { TimestampUnit } from "@/lib/date/timestamp";
import {
	formatTimestampToDate,
	getCurrentTimestamp,
	parseDateToTimestamp,
} from "@/lib/date/timestamp";

type Direction = "ts-to-date" | "date-to-ts";

function buildIsoDateTime(date: string, time: string): string {
	if (!date) return "";
	const t = time || "00:00";
	return `${date}T${t}:00`;
}

export function TimestampConverter() {
	const [unit, setUnit] = useState<TimestampUnit>("seconds");
	const [direction, setDirection] = useState<Direction>("ts-to-date");
	const [timestampInput, setTimestampInput] = useState("");
	const [dateInput, setDateInput] = useState("");
	const [timeInput, setTimeInput] = useState("");

	const result = useMemo(() => {
		if (direction === "ts-to-date") {
			if (!timestampInput.trim()) return { output: "", error: null };
			const num = Number(timestampInput.trim());
			if (Number.isNaN(num))
				return { output: "", error: "Timestamp deve ser um número." };
			const formatted = formatTimestampToDate(num, unit);
			if (!formatted)
				return { output: "", error: "Valor inválido para o timestamp." };
			return { output: formatted, error: null };
		} else {
			if (!dateInput.trim()) return { output: "", error: null };
			const iso = buildIsoDateTime(dateInput, timeInput);
			const ts = parseDateToTimestamp(iso, unit);
			if (ts === null) return { output: "", error: "Data inválida." };
			return { output: String(ts), error: null };
		}
	}, [direction, timestampInput, dateInput, timeInput, unit]);

	function handleNow() {
		const now = new Date();
		setTimestampInput(String(getCurrentTimestamp(unit)));
		setDateInput(now.toISOString().slice(0, 10));
		setTimeInput(now.toTimeString().slice(0, 5));
	}

	function handleSwap() {
		if (!result.output) return;
		if (direction === "ts-to-date") {
			// result is a formatted date string like "dd/MM/yyyy HH:mm:ss"
			// we need to swap: put timestamp in output into date field
			// but we can't easily parse back "dd/MM/yyyy HH:mm:ss" — skip swap for this direction
			// Instead, just flip the direction and clear
			setDirection("date-to-ts");
			setDateInput("");
			setTimeInput("");
		} else {
			// result is a timestamp string
			setTimestampInput(result.output);
			setDirection("ts-to-date");
		}
	}

	function handleClear() {
		setTimestampInput("");
		setDateInput("");
		setTimeInput("");
	}

	const hasInput = direction === "ts-to-date" ? !!timestampInput : !!dateInput;

	return (
		<LayoutC
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-1">
							{(["ts-to-date", "date-to-ts"] as const).map((d) => (
								<button
									key={d}
									type="button"
									onClick={() => setDirection(d)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										direction === d
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{d === "ts-to-date" ? "Timestamp → Data" : "Data → Timestamp"}
								</button>
							))}
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleSwap}
								disabled={!result.output || direction === "ts-to-date"}
								aria-label="Usar resultado como entrada"
							>
								<ArrowLeftRight className="h-3.5 w-3.5" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleClear}
								disabled={!hasInput}
								aria-label="Limpar"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-between border-b border-border px-3 py-2">
						<span className="text-[11px] text-muted-foreground">Unidade</span>
						<div className="flex items-center gap-1">
							{(["seconds", "milliseconds"] as const).map((u) => (
								<button
									key={u}
									type="button"
									onClick={() => setUnit(u)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										unit === u
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{u === "seconds" ? "Segundos" : "Milissegundos"}
								</button>
							))}
						</div>
					</div>

					{direction === "ts-to-date" ? (
						<div className="flex flex-col gap-4 p-4">
							<div className="flex flex-col gap-1.5">
								<span className="text-[11px] text-muted-foreground">
									Timestamp Unix ({unit === "seconds" ? "s" : "ms"})
								</span>
								<input
									type="text"
									value={timestampInput}
									onChange={(e) => setTimestampInput(e.target.value)}
									placeholder="Ex: 1700000000"
									className="w-full rounded border border-border bg-transparent px-2 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
									spellCheck={false}
								/>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleNow}
								className="w-fit text-[11px]"
							>
								Agora
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4 p-4">
							<div className="flex flex-col gap-1.5">
								<span className="text-[11px] text-muted-foreground">Data</span>
								<input
									type="date"
									value={dateInput}
									onChange={(e) => setDateInput(e.target.value)}
									className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-sm text-foreground focus:outline-none"
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<span className="text-[11px] text-muted-foreground">Hora</span>
								<input
									type="time"
									value={timeInput}
									onChange={(e) => setTimeInput(e.target.value)}
									className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-sm text-foreground focus:outline-none"
								/>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleNow}
								className="w-fit text-[11px]"
							>
								Agora
							</Button>
						</div>
					)}
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							{direction === "ts-to-date" ? "Data e Hora" : "Timestamp Unix"}
						</span>
						<CopyButton
							text={result.output}
							disabled={!result.output}
							variant="ghost"
							size="icon-sm"
							iconOnly
						/>
					</div>

					<div className="flex-1 min-h-[200px] bg-muted/20 p-4">
						{result.error ? (
							<p className="text-xs text-destructive">{result.error}</p>
						) : result.output ? (
							<p className="font-mono text-lg text-foreground select-all">
								{result.output}
							</p>
						) : null}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: result.error
								? "Erro"
								: result.output
									? "Convertido"
									: "Aguardando",
							mono: false,
							variant: result.error
								? "danger"
								: result.output
									? "success"
									: "default",
						},
						{
							label: "Tipo",
							value:
								direction === "ts-to-date"
									? "Timestamp → Data"
									: "Data → Timestamp",
							mono: true,
						},
					]}
				/>
			}
		/>
	);
}
