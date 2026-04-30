"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";

type Props = {
	output: string;
};

function analyze(text: string) {
	return {
		doubleSpaces: (text.match(/ {2,}/g) || []).length,
		lineBreaks: (text.match(/\n/g) || []).length,
		invisible: (text.match(/[\u200B-\u200D\uFEFF]/g) || []).length,
	};
}

function countStats(text: string) {
	return {
		characters: text.length,
		words: text.trim() ? text.trim().split(/\s+/).length : 0,
	};
}

export function TextCleanerResult({ output }: Props) {
	const stats = countStats(output);
	const analysis = analyze(output);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">
					Resultado
				</span>

				<CopyButton text={output} />
			</div>

			<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
				<span>{stats.characters} caracteres</span>
				<span>{stats.words} palavras</span>
			</div>

			<div className="flex flex-wrap gap-4 text-xs">
				{analysis.doubleSpaces > 0 && (
					<span>Espaços duplicados: {analysis.doubleSpaces}</span>
				)}
				{analysis.lineBreaks > 0 && (
					<span>Quebras de linha: {analysis.lineBreaks}</span>
				)}
				{analysis.invisible > 0 && (
					<span>Caracteres invisíveis: {analysis.invisible}</span>
				)}
			</div>

			<div className="rounded-md border p-4">
				<pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
			</div>
		</div>
	);
}
