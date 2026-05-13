"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
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
				<ToolHeader
					title="Remover duplicados"
					badge="LISTA"
					actions={
						<>
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
						</>
					}
				/>
			}
			sidebar={
				<>
					{result && (
						<SidebarSection title="Resultado">
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
						</SidebarSection>
					)}
					<SidebarSection title="Opções">
						<RemoveDuplicatesOptions options={options} onChange={setOptions} />
					</SidebarSection>
				</>
			}
		>
			<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
				<RemoveDuplicatesInput value={input} onChange={handleInput} />
				<RemoveDuplicatesOutput value={result?.output ?? ""} />
			</div>

			<StatusBar
				items={[
					{
						label: "",
						value: result ? "Processado" : "Pronto para processar",
						mono: false,
						variant: result ? "success" : "default",
					},
					{ label: "", value: `${inputLineCount} linhas`, mono: true },
					{ label: "", value: `${input.length} caracteres`, mono: true },
				]}
			/>
		</LayoutD>
	);
}
