"use client";

import { type ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	decreaseByPercent,
	increaseByPercent,
	percentageChange,
	percentOf,
	whatPercent,
} from "@/lib/math/percentage";

const INPUT_CLASS = "w-24 text-center font-mono";

function toNum(value: string): number | null {
	const n = Number(value);
	return value !== "" && !Number.isNaN(n) ? n : null;
}

function fmt(value: number): string {
	if (!Number.isFinite(value)) return "–";
	return (Math.round(value * 100) / 100).toLocaleString("pt-BR", {
		maximumFractionDigits: 2,
	});
}

type SectionProps = {
	label: string;
	sentence: ReactNode;
	result: string;
	resultClass?: string;
};

function CalculatorSection({
	label,
	sentence,
	result,
	resultClass,
}: SectionProps) {
	return (
		<div className="px-4 py-3">
			<h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
				{label}
			</h3>
			<div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-foreground">
				{sentence}
				{result && (
					<>
						<span className="text-muted-foreground select-none">=</span>
						<span
							className={cn(
								"font-mono font-semibold tabular-nums",
								resultClass ?? "text-foreground",
							)}
						>
							{result}
						</span>
					</>
				)}
			</div>
		</div>
	);
}

export function PercentageCalculator() {
	const [c1p, setC1p] = useState("");
	const [c1v, setC1v] = useState("");

	const [c2p, setC2p] = useState("");
	const [c2t, setC2t] = useState("");

	const [c3f, setC3f] = useState("");
	const [c3t, setC3t] = useState("");

	const [c4v, setC4v] = useState("");
	const [c4p, setC4p] = useState("");

	const [c5v, setC5v] = useState("");
	const [c5p, setC5p] = useState("");

	const n1p = toNum(c1p);
	const n1v = toNum(c1v);
	const r1 = n1p !== null && n1v !== null ? fmt(percentOf(n1p, n1v)) : "";

	const n2p = toNum(c2p);
	const n2t = toNum(c2t);
	const r2 =
		n2p !== null && n2t !== null ? `${fmt(whatPercent(n2p, n2t))}%` : "";

	const n3f = toNum(c3f);
	const n3t = toNum(c3t);
	const change =
		n3f !== null && n3t !== null ? percentageChange(n3f, n3t) : null;
	const r3 = change !== null ? `${change > 0 ? "+" : ""}${fmt(change)}%` : "";
	const r3Class =
		change === null
			? undefined
			: change > 0
				? "text-success"
				: change < 0
					? "text-destructive"
					: undefined;

	const n4v = toNum(c4v);
	const n4p = toNum(c4p);
	const r4 =
		n4v !== null && n4p !== null ? fmt(increaseByPercent(n4v, n4p)) : "";

	const n5v = toNum(c5v);
	const n5p = toNum(c5p);
	const r5 =
		n5v !== null && n5p !== null ? fmt(decreaseByPercent(n5v, n5p)) : "";

	return (
		<div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
			<CalculatorSection
				label="Porcentagem de um valor"
				sentence={
					<>
						<span>Quanto é</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c1p}
							onChange={(e) => setC1p(e.target.value)}
							placeholder="0"
							aria-label="Porcentagem"
						/>
						<span>% de</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c1v}
							onChange={(e) => setC1v(e.target.value)}
							placeholder="0"
							aria-label="Valor"
						/>
					</>
				}
				result={r1}
			/>

			<CalculatorSection
				label="Qual porcentagem representa"
				sentence={
					<>
						<span>O valor</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c2p}
							onChange={(e) => setC2p(e.target.value)}
							placeholder="0"
							aria-label="Valor parcial"
						/>
						<span>é qual % de</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c2t}
							onChange={(e) => setC2t(e.target.value)}
							placeholder="0"
							aria-label="Valor total"
						/>
					</>
				}
				result={r2}
			/>

			<CalculatorSection
				label="Variação percentual"
				sentence={
					<>
						<span>De</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c3f}
							onChange={(e) => setC3f(e.target.value)}
							placeholder="0"
							aria-label="Valor original"
						/>
						<span>para</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c3t}
							onChange={(e) => setC3t(e.target.value)}
							placeholder="0"
							aria-label="Novo valor"
						/>
						<span>. Variação</span>
					</>
				}
				result={r3}
				resultClass={r3Class}
			/>

			<CalculatorSection
				label="Aumentar por porcentagem"
				sentence={
					<>
						<span>Valor</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c4v}
							onChange={(e) => setC4v(e.target.value)}
							placeholder="0"
							aria-label="Valor base"
						/>
						<span>aumentado em</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c4p}
							onChange={(e) => setC4p(e.target.value)}
							placeholder="0"
							aria-label="Porcentagem de aumento"
						/>
						<span>%</span>
					</>
				}
				result={r4}
				resultClass="text-success"
			/>

			<CalculatorSection
				label="Diminuir por porcentagem"
				sentence={
					<>
						<span>Valor</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c5v}
							onChange={(e) => setC5v(e.target.value)}
							placeholder="0"
							aria-label="Valor base"
						/>
						<span>diminuído em</span>
						<Input
							className={INPUT_CLASS}
							type="number"
							value={c5p}
							onChange={(e) => setC5p(e.target.value)}
							placeholder="0"
							aria-label="Porcentagem de desconto"
						/>
						<span>%</span>
					</>
				}
				result={r5}
				resultClass="text-destructive"
			/>
		</div>
	);
}
