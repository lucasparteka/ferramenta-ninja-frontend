"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	generateLoremParagraphs,
	generateLoremSentences,
	generateLoremWords,
} from "@/lib/text/lorem";
import {
	generateRandomParagraphs,
	generateRandomSentences,
	generateRandomWords,
} from "@/lib/text/random";

type GeneratorType = "lorem" | "random";
type UnitType = "words" | "sentences" | "paragraphs";

type GeneratorOptions = {
	type: GeneratorType;
	quantity: number;
	unit: UnitType;
	startWithLorem: boolean;
};

const DEFAULT_OPTIONS: GeneratorOptions = {
	type: "lorem",
	quantity: 3,
	unit: "paragraphs",
	startWithLorem: true,
};

function generate(options: GeneratorOptions): string {
	const count = Math.min(100, Math.max(1, options.quantity));
	if (options.type === "lorem") {
		if (options.unit === "words") return generateLoremWords(count, options.startWithLorem);
		if (options.unit === "sentences") return generateLoremSentences(count, options.startWithLorem);
		return generateLoremParagraphs(count, options.startWithLorem);
	}
	if (options.unit === "words") return generateRandomWords(count);
	if (options.unit === "sentences") return generateRandomSentences(count);
	return generateRandomParagraphs(count);
}

const TYPE_OPTIONS: { label: string; value: GeneratorType }[] = [
	{ label: "Lorem Ipsum", value: "lorem" },
	{ label: "Aleatório", value: "random" },
];

const UNIT_OPTIONS: { label: string; value: UnitType }[] = [
	{ label: "Palavras", value: "words" },
	{ label: "Frases", value: "sentences" },
	{ label: "Parágrafos", value: "paragraphs" },
];

export function TextGenerator() {
	const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
	const [output, setOutput] = useState("");

	function set<K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}

	function handleGenerate() {
		setOutput(generate(options));
	}

	function handleClear() {
		setOutput("");
	}

	const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;
	const unitLabel =
		options.unit === "words"
			? "Palavras"
			: options.unit === "sentences"
				? "Frases"
				: "Parágrafos";

	return (
		<LayoutD
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">Gerador de Texto</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							{options.type === "lorem" ? "MODELO" : "ALEATÓRIO"}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Button size="sm" onClick={handleGenerate}>
							Gerar texto
						</Button>
						{output && (
							<CopyButton text={output} label="Copiar" variant="outline" size="sm" />
						)}
						{output && (
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleClear}
								aria-label="Limpar"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						)}
					</div>
				</>
			}
			sidebar={
				<>
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Tipo
						</h3>
						<div className="flex flex-col gap-1">
							{TYPE_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => set("type", opt.value)}
									className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
										options.type === opt.value
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Formato
						</h3>
						<div className="flex flex-col gap-1">
							{UNIT_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => set("unit", opt.value)}
									className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
										options.unit === opt.value
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Quantidade
						</h3>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">{unitLabel}</span>
							<Input
								type="number"
								min={1}
								max={100}
								value={options.quantity}
								onChange={(e) => {
									const value = Number(e.target.value);
									if (!Number.isNaN(value)) {
										set("quantity", Math.min(100, Math.max(1, value)));
									}
								}}
								className="h-7 w-16 text-right font-mono text-xs"
							/>
						</div>
					</div>

					{options.type === "lorem" && (
						<div className="p-4 space-y-3">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Opções
							</h3>
							<div className="flex items-center justify-between">
								<span className="text-xs text-muted-foreground">Começar com Lorem</span>
								<button
									type="button"
									role="switch"
									aria-checked={options.startWithLorem}
									onClick={() => set("startWithLorem", !options.startWithLorem)}
									className={`relative h-4 w-7 rounded-full transition-colors ${
										options.startWithLorem ? "bg-foreground/80" : "bg-border"
									}`}
								>
									<span
										className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
											options.startWithLorem ? "left-[14px]" : "left-0.5"
										}`}
									/>
								</button>
							</div>
						</div>
					)}
				</>
			}
		>
			<textarea
				readOnly
				value={output}
				placeholder='Clique em "Gerar texto" para começar...'
				className="flex-1 min-h-[280px] resize-none bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
			/>

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
				<span className="inline-flex items-center gap-1.5">
					<span
						className={`h-1.5 w-1.5 rounded-full ${output ? "bg-green-600" : "bg-foreground/30"}`}
					/>
					<span className="text-[11px] text-muted-foreground">
						{output ? "Gerado" : "Aguardando"}
					</span>
				</span>
				<div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
					{output && (
						<>
							<span>{wordCount} palavras</span>
							<span>·</span>
							<span>{output.length} chars</span>
						</>
					)}
				</div>
			</div>
		</LayoutD>
	);
}
