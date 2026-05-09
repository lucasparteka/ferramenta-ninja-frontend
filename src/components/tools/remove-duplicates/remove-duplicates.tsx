"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { removeDuplicateLines } from "@/lib/text/deduplicate";
import { Trash2 } from "lucide-react";
import { RemoveDuplicatesInput } from "./input";
import { RemoveDuplicatesOptions } from "./options";
import { RemoveDuplicatesOutput } from "./output";

type DeduplicateOptions = {
	ignoreCase: boolean;
	trimWhitespace: boolean;
	sortOrder: "none" | "asc" | "desc";
};

type ProcessResult = {
	output: string;
	totalLines: number;
	uniqueLines: number;
	removedLines: number;
};

const DEFAULT_OPTIONS: DeduplicateOptions = {
	ignoreCase: false,
	trimWhitespace: true,
	sortOrder: "none",
};

export function RemoveDuplicates() {
	const [input, setInput] = useState("");
	const [options, setOptions] = useState<DeduplicateOptions>(DEFAULT_OPTIONS);
	const [result, setResult] = useState<ProcessResult | null>(null);

	function handleInput(value: string) {
		setInput(value);
		setResult(null);
	}

	function handleProcess() {
		const output = removeDuplicateLines(input, options);
		const totalLines = input.split("\n").filter((line) => {
			if (options.trimWhitespace) return line.trim() !== "";
			return true;
		}).length;
		const uniqueLines = output === "" ? 0 : output.split("\n").length;

		setResult({
			output,
			totalLines,
			uniqueLines,
			removedLines: totalLines - uniqueLines,
		});
	}

	function clearAll() {
		setInput("");
		setResult(null);
	}

	const inputLineCount = input
		.split("\n")
		.filter((line) =>
			options.trimWhitespace ? line.trim() !== "" : true,
		).length;

	return (
		<LayoutD
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">
							Remover duplicados
						</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							LISTA
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Button
							onClick={handleProcess}
							disabled={!input.trim()}
							size="sm"
							variant="default"
						>
							Remover duplicatas
						</Button>
						{result && (
							<CopyButton
								text={result.output}
								label="Copiar"
								variant="outline"
								size="sm"
							/>
						)}
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={clearAll}
							aria-label="Limpar"
							disabled={!input}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</>
			}
			sidebar={
				<>
					{result && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Resultado
							</h3>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">
									Linhas originais
								</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{result.totalLines}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">
									Linhas únicas
								</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{result.uniqueLines}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Removidas</span>
								<span className="font-mono text-xs font-medium tabular-nums text-destructive">
									-{result.removedLines}
								</span>
							</div>
						</div>
					)}
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Opções
						</h3>
						<RemoveDuplicatesOptions options={options} onChange={setOptions} />
					</div>
				</>
			}
		>
			<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
				<RemoveDuplicatesInput value={input} onChange={handleInput} />
				<RemoveDuplicatesOutput value={result?.output ?? ""} />
			</div>

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 mt-auto">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-green-600" />
						<span className="text-[11px] text-muted-foreground">
							{result ? "Processado" : "Pronto para processar"}
						</span>
					</span>
				</div>
				<div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
					<span>{inputLineCount} linhas</span>
					<span>·</span>
					<span>{input.length} caracteres</span>
				</div>
			</div>
		</LayoutD>
	);
}
