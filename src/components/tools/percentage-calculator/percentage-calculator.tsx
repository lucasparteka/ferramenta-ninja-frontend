/** biome-ignore-all lint/suspicious/noArrayIndexKey: . */
"use client";

import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	absolutePercentDiff,
	decreaseByPercent,
	increaseByPercent,
	percentageChange,
	percentOf,
	stackedDiscounts,
	whatPercent,
} from "@/lib/math/percentage";
import { cn } from "@/lib/utils";

type Tone = "positive" | "negative" | "neutral";

type ComputedResult = {
	formatted: string;
	suffix: string;
	tone: Tone;
	meta?: string;
	steps: string[];
};

type ProseSeg = { t: string } | { f: string; suffix?: string };

type FieldDef = {
	key: string;
	label: string;
	suffix?: string;
	placeholder?: string;
	example: string;
};

type CalculatorDef = {
	id: string;
	label: string;
	blurb: string;
	fields: FieldDef[];
	prose: ProseSeg[];
	compute: (vals: Record<string, string>) => ComputedResult | null;
	example: Record<string, string>;
};

function toNum(v: string): number | null {
	if (v === "") return null;
	const n = Number(v);
	return Number.isNaN(n) ? null : n;
}

function fmt(value: number): string {
	if (!Number.isFinite(value)) return "–";
	return (Math.round(value * 100) / 100).toLocaleString("pt-BR", {
		maximumFractionDigits: 2,
	});
}

const CALCULATORS: CalculatorDef[] = [
	{
		id: "percent_of",
		label: "Porcentagem de um valor",
		blurb:
			"Aplicar uma taxa a um valor. Útil para descontos, comissões e impostos.",
		fields: [
			{
				key: "p",
				label: "Porcentagem",
				suffix: "%",
				placeholder: "0",
				example: "20",
			},
			{ key: "v", label: "Valor base", placeholder: "0", example: "150" },
		],
		prose: [
			{ t: "Quanto é " },
			{ f: "p", suffix: "%" },
			{ t: " de " },
			{ f: "v" },
			{ t: "?" },
		],
		compute: ({ p, v }) => {
			const np = toNum(p);
			const nv = toNum(v);
			if (np === null || nv === null) return null;
			const result = percentOf(np, nv);
			return {
				formatted: fmt(result),
				suffix: "",
				tone: "neutral",
				steps: [
					`${fmt(np)} ÷ 100 = ${fmt(np / 100)}`,
					`${fmt(np / 100)} × ${fmt(nv)} = ${fmt(result)}`,
				],
			};
		},
		example: { p: "20", v: "150" },
	},
	{
		id: "what_percent",
		label: "Qual porcentagem representa",
		blurb:
			"Descobrir que fração um valor representa de outro. Útil para entender proporções.",
		fields: [
			{ key: "a", label: "Valor parcial", placeholder: "0", example: "30" },
			{ key: "t", label: "Valor total", placeholder: "0", example: "50" },
		],
		prose: [
			{ t: "O valor de " },
			{ f: "a" },
			{ t: " é qual porcentagem de " },
			{ f: "t" },
			{ t: "?" },
		],
		compute: ({ a, t }) => {
			const na = toNum(a);
			const nt = toNum(t);
			if (na === null || nt === null || nt === 0) return null;
			const result = whatPercent(na, nt);
			return {
				formatted: fmt(result),
				suffix: "%",
				tone: "neutral",
				steps: [
					`${fmt(na)} ÷ ${fmt(nt)} = ${fmt(na / nt)}`,
					`${fmt(na / nt)} × 100 = ${fmt(result)}%`,
				],
			};
		},
		example: { a: "30", t: "50" },
	},
	{
		id: "change",
		label: "Variação percentual",
		blurb:
			"Quanto um valor subiu ou caiu em relação ao original. Direção importa.",
		fields: [
			{ key: "f", label: "Valor antigo", placeholder: "0", example: "100" },
			{ key: "t", label: "Valor novo", placeholder: "0", example: "120" },
		],
		prose: [
			{ t: "Um valor de " },
			{ f: "f" },
			{ t: " que mudou para " },
			{ f: "t" },
			{ t: ". Qual foi a variação?" },
		],
		compute: ({ f, t }) => {
			const nf = toNum(f);
			const nt = toNum(t);
			if (nf === null || nt === null || nf === 0) return null;
			const result = percentageChange(nf, nt);
			const sign = result > 0 ? "+" : "";
			return {
				formatted: `${sign}${fmt(result)}`,
				suffix: "%",
				tone: result > 0 ? "positive" : result < 0 ? "negative" : "neutral",
				steps: [
					`${fmt(nt)} − ${fmt(nf)} = ${fmt(nt - nf)}`,
					`${fmt(nt - nf)} ÷ ${fmt(nf)} = ${fmt((nt - nf) / nf)}`,
					`${fmt((nt - nf) / nf)} × 100 = ${sign}${fmt(result)}%`,
				],
			};
		},
		example: { f: "100", t: "120" },
	},
	{
		id: "increase",
		label: "Aumentar por porcentagem",
		blurb:
			"Adiciona um acréscimo a um valor base. Útil para reajustes e juros simples.",
		fields: [
			{ key: "v", label: "Valor base", placeholder: "0", example: "100" },
			{
				key: "p",
				label: "Acréscimo",
				suffix: "%",
				placeholder: "0",
				example: "15",
			},
		],
		prose: [
			{ t: "Um valor de " },
			{ f: "v" },
			{ t: " aumentado em " },
			{ f: "p", suffix: "%" },
			{ t: " resulta em quanto?" },
		],
		compute: ({ v, p }) => {
			const nv = toNum(v);
			const np = toNum(p);
			if (nv === null || np === null) return null;
			const result = increaseByPercent(nv, np);
			return {
				formatted: fmt(result),
				suffix: "",
				tone: "positive",
				steps: [
					`${fmt(np)} ÷ 100 = ${fmt(np / 100)}`,
					`1 + ${fmt(np / 100)} = ${fmt(1 + np / 100)}`,
					`${fmt(nv)} × ${fmt(1 + np / 100)} = ${fmt(result)}`,
				],
			};
		},
		example: { v: "100", p: "15" },
	},
	{
		id: "decrease",
		label: "Diminuir por porcentagem",
		blurb:
			"Aplica um desconto sobre o valor base. Útil para preços promocionais.",
		fields: [
			{ key: "v", label: "Valor base", placeholder: "0", example: "100" },
			{
				key: "p",
				label: "Desconto",
				suffix: "%",
				placeholder: "0",
				example: "15",
			},
		],
		prose: [
			{ t: "Um valor de " },
			{ f: "v" },
			{ t: " com " },
			{ f: "p", suffix: "%" },
			{ t: " de desconto resulta em quanto?" },
		],
		compute: ({ v, p }) => {
			const nv = toNum(v);
			const np = toNum(p);
			if (nv === null || np === null) return null;
			const result = decreaseByPercent(nv, np);
			return {
				formatted: fmt(result),
				suffix: "",
				tone: "negative",
				steps: [
					`${fmt(np)} ÷ 100 = ${fmt(np / 100)}`,
					`1 − ${fmt(np / 100)} = ${fmt(1 - np / 100)}`,
					`${fmt(nv)} × ${fmt(1 - np / 100)} = ${fmt(result)}`,
				],
			};
		},
		example: { v: "100", p: "15" },
	},
	{
		id: "abs_diff",
		label: "Diferença percentual (sem direção)",
		blurb:
			"Compara dois valores sem importar qual é maior. Usa a média como base.",
		fields: [
			{ key: "a", label: "Valor A", placeholder: "0", example: "80" },
			{ key: "b", label: "Valor B", placeholder: "0", example: "100" },
		],
		prose: [
			{ t: "Qual a diferença percentual entre " },
			{ f: "a" },
			{ t: " e " },
			{ f: "b" },
			{ t: ", sem direção?" },
		],
		compute: ({ a, b }) => {
			const na = toNum(a);
			const nb = toNum(b);
			if (na === null || nb === null || na + nb === 0) return null;
			const avg = (na + nb) / 2;
			const result = absolutePercentDiff(na, nb);
			return {
				formatted: fmt(result),
				suffix: "%",
				tone: "neutral",
				steps: [
					`|${fmt(na)} − ${fmt(nb)}| = ${fmt(Math.abs(na - nb))}`,
					`(${fmt(na)} + ${fmt(nb)}) ÷ 2 = ${fmt(avg)}`,
					`${fmt(Math.abs(na - nb))} ÷ ${fmt(avg)} × 100 = ${fmt(result)}%`,
				],
			};
		},
		example: { a: "80", b: "100" },
	},
	{
		id: "stacked_discounts",
		label: "Descontos sucessivos",
		blurb:
			"O segundo desconto incide sobre o valor já reduzido — não soma diretamente.",
		fields: [
			{ key: "v", label: "Valor base", placeholder: "0", example: "100" },
			{
				key: "d1",
				label: "1º desconto",
				suffix: "%",
				placeholder: "0",
				example: "10",
			},
			{
				key: "d2",
				label: "2º desconto",
				suffix: "%",
				placeholder: "0",
				example: "5",
			},
		],
		prose: [
			{ t: "Um valor de " },
			{ f: "v" },
			{ t: " com " },
			{ f: "d1", suffix: "%" },
			{ t: " de desconto e depois " },
			{ f: "d2", suffix: "%" },
			{ t: " de desconto resulta em quanto?" },
		],
		compute: ({ v, d1, d2 }) => {
			const nv = toNum(v);
			const n1 = toNum(d1);
			const n2 = toNum(d2);
			if (nv === null || n1 === null || n2 === null) return null;
			const afterFirst = nv * (1 - n1 / 100);
			const { result, equivalentDiscount } = stackedDiscounts(nv, n1, n2);
			return {
				formatted: fmt(result),
				suffix: "",
				tone: "negative",
				meta: `equivale a ${fmt(equivalentDiscount)}% de desconto total`,
				steps: [
					`${fmt(nv)} × (1 − ${fmt(n1 / 100)}) = ${fmt(afterFirst)}`,
					`${fmt(afterFirst)} × (1 − ${fmt(n2 / 100)}) = ${fmt(result)}`,
					`desconto total efetivo = ${fmt(equivalentDiscount)}%`,
				],
			};
		},
		example: { v: "100", d1: "10", d2: "5" },
	},
];

// ─── useCalcRow hook ──────────────────────────────────────────────────────────

function useCalcRow(def: CalculatorDef) {
	const [values, setValues] = useState<Record<string, string>>(() =>
		Object.fromEntries(def.fields.map((f) => [f.key, ""])),
	);
	const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
		setValues((prev) => ({ ...prev, [key]: e.target.value }));
	const fillExample = () => setValues(def.example);
	const computed = def.compute(values);
	return { values, set, computed, fillExample };
}

type ProseInputProps = {
	field: FieldDef;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProseInput({ field, value, onChange }: ProseInputProps) {
	return (
		<span className="inline-flex items-center">
			<Input
				type="number"
				inputMode="decimal"
				value={value}
				onChange={onChange}
				placeholder={field.placeholder ?? "0"}
				aria-label={field.label}
				className="w-20 text-center font-mono text-sm h-7 px-1.5"
				autoComplete="off"
			/>
			{field.suffix && (
				<span className="ml-1 text-sm text-muted-foreground select-none">
					{field.suffix}
				</span>
			)}
		</span>
	);
}

function ResultChip({ computed }: { computed: ComputedResult | null }) {
	const [copied, setCopied] = useState(false);

	const displayValue = computed
		? `${computed.formatted}${computed.suffix}`
		: null;

	const copy = () => {
		if (!displayValue) return;
		navigator.clipboard.writeText(displayValue);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const toneClass =
		computed?.tone === "positive"
			? "text-success"
			: computed?.tone === "negative"
				? "text-destructive"
				: "text-foreground";

	return (
		<div className="flex items-center gap-2">
			<span className="text-muted-foreground select-none">=</span>
			<span className={cn("font-mono font-semibold tabular-nums", toneClass)}>
				{displayValue ?? (
					<span className="text-muted-foreground font-normal">–</span>
				)}
			</span>
			{computed?.meta && (
				<span className="font-mono text-[11px] text-muted-foreground tabular-nums">
					({computed.meta})
				</span>
			)}
			<button
				type="button"
				onClick={copy}
				disabled={!computed}
				aria-label="Copiar resultado"
				className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
			>
				{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
			</button>
		</div>
	);
}

function StepsAccordion({ computed }: { computed: ComputedResult | null }) {
	const [open, setOpen] = useState(false);

	if (!computed || computed.steps.length === 0) return null;

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
			>
				<ChevronDown
					className={cn(
						"h-3 w-3 transition-transform duration-150",
						open && "rotate-180",
					)}
				/>
				Mostrar passos
			</button>
			{open && (
				<ol className="mt-2 space-y-1 pl-3 border-l border-border">
					{computed.steps.map((step, i) => (
						<li
							key={i}
							className="font-mono text-[11px] text-muted-foreground tabular-nums"
						>
							{step}
						</li>
					))}
				</ol>
			)}
		</div>
	);
}

function CalculatorRow({ def }: { def: CalculatorDef }) {
	const { values, set, computed } = useCalcRow(def);
	const fieldByKey = Object.fromEntries(def.fields.map((f) => [f.key, f]));

	return (
		<div className="px-4 py-3">
			<div className="flex items-start justify-between gap-2 mb-2">
				<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					{def.label}
				</h3>
			</div>
			<p className="text-xs text-muted-foreground mb-3">{def.blurb}</p>
			<div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-foreground mb-3">
				{def.prose.map((seg, i) =>
					"f" in seg ? (
						<ProseInput
							key={i}
							field={
								seg.suffix !== undefined
									? { ...fieldByKey[seg.f], suffix: seg.suffix }
									: fieldByKey[seg.f]
							}
							value={values[seg.f]}
							onChange={set(seg.f)}
						/>
					) : (
						<span key={i} className="text-sm">
							{seg.t}
						</span>
					),
				)}
			</div>
			<div className="space-y-3">
				<ResultChip computed={computed} />
				<StepsAccordion computed={computed} />
			</div>
		</div>
	);
}

export function PercentageCalculator() {
	return (
		<div className="rounded-lg border border-border overflow-hidden divide-y divide-border bg-card">
			{CALCULATORS.map((def) => (
				<CalculatorRow key={def.id} def={def} />
			))}
		</div>
	);
}
