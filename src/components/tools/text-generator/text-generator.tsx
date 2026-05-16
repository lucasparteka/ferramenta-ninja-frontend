"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { NumberInput } from "@/components/shared/number-input";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { SwitchRow } from "@/components/shared/switch-row";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
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
		if (options.unit === "words")
			return generateLoremWords(count, options.startWithLorem);
		if (options.unit === "sentences")
			return generateLoremSentences(count, options.startWithLorem);
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

	function set<K extends keyof GeneratorOptions>(
		key: K,
		value: GeneratorOptions[K],
	) {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}

	function handleGenerate() {
		setOutput(generate(options));
	}

	function handleClear() {
		setOutput("");
	}

	const wordCount = output
		? output.trim().split(/\s+/).filter(Boolean).length
		: 0;
	const unitLabel =
		options.unit === "words"
			? "Palavras"
			: options.unit === "sentences"
				? "Frases"
				: "Parágrafos";

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Gerador de Texto"
					badge={options.type === "lorem" ? "MODELO" : "ALEATÓRIO"}
					actions={
						<>
							<Button size="sm" onClick={handleGenerate}>
								Gerar texto
							</Button>
							{output && (
								<CopyButton
									text={output}
									label="Copiar"
									variant="outline"
									size="sm"
								/>
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
						</>
					}
				/>
			}
			sidebar={
				<>
					<SidebarSection title="Tipo">
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
					</SidebarSection>

					<SidebarSection title="Formato">
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
					</SidebarSection>

					<SidebarSection title="Quantidade">
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">{unitLabel}</span>
							<NumberInput
								value={options.quantity}
								onChange={(v) => set("quantity", v)}
								min={1}
								max={100}
								className="h-7 w-16 text-xs"
							/>
						</div>
					</SidebarSection>

					{options.type === "lorem" && (
						<SidebarSection title="Opções">
							<SwitchRow
								label="Começar com Lorem"
								checked={options.startWithLorem}
								onChange={(v) => set("startWithLorem", v)}
							/>
						</SidebarSection>
					)}
				</>
			}
		>
			<textarea
				readOnly
				value={output}
				placeholder='Clique em "Gerar texto" para começar...'
				className="flex-1 min-h-70 resize-none bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
			/>

			<StatusBar
				items={[
					{
						label: "",
						value: output ? "Gerado" : "Aguardando",
						mono: false,
						variant: output ? "success" : "default",
					},
					...(output
						? ([
								{ label: "", value: `${wordCount} palavras`, mono: true },
								{ label: "", value: `${output.length} chars`, mono: true },
							] as const)
						: []),
				]}
			/>
		</LayoutD>
	);
}
