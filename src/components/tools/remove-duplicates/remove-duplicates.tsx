"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeDuplicateLines } from "@/lib/text/deduplicate";
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

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<RemoveDuplicatesInput value={input} onChange={handleInput} />
				<RemoveDuplicatesOutput
					value={result?.output ?? ""}
				/>
			</div>

			<RemoveDuplicatesOptions options={options} onChange={setOptions} />

			<Button onClick={handleProcess} disabled={!input.trim()}>
				Remover duplicatas
			</Button>

			{result && (
				<div className="grid grid-cols-3 gap-3">
					{[
						{ label: "Linhas originais", value: result.totalLines },
						{ label: "Linhas únicas", value: result.uniqueLines },
						{ label: "Removidas", value: result.removedLines },
					].map((stat) => (
						<div
							key={stat.label}
							className="rounded-lg border border-border bg-secondary p-3 text-center"
						>
							<p className="text-xl font-bold text-primary">{stat.value}</p>
							<p className="text-xs text-muted-foreground">{stat.label}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
