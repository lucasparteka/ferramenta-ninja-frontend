"use client";

import DiffMatchPatch from "diff-match-patch";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { DiffResult } from "@/components/tools/text-diff/diff-result";
import { Button } from "@/components/ui/button";
import { TextCleanerHighlight } from "./text-cleaner-highlight";
import { TextCleanerInput } from "./text-cleaner-input";
import { TextCleanerOptions } from "./text-cleaner-options";
import { TextCleanerResult } from "./text-cleaner-result";
import {
	type TextCleanerOptions as TextCleanerOptionsType,
	useTextCleaner,
} from "./use-text-cleaner";

type Props = {
	defaultOptions?: Partial<TextCleanerOptionsType>;
};

function computeDiff(left: string, right: string) {
	const dmp = new DiffMatchPatch();
	const diff = dmp.diff_main(left, right);
	dmp.diff_cleanupSemantic(diff);
	return diff as [-1 | 0 | 1, string][];
}

export function TextCleaner({ defaultOptions }: Props) {
	const { input, output, options, setInput, setOptions, issues, clearAll } =
		useTextCleaner(defaultOptions);

	const diff = useMemo(() => {
		if (!input || !output) return [];
		return computeDiff(input, output);
	}, [input, output]);

	const hasChanges = input !== output && diff.length > 0;

	const outputStats = useMemo(() => {
		if (!output) return null;
		return {
			characters: output.length,
			words: output.trim() ? output.trim().split(/\s+/).length : 0,
			lines: output.split("\n").length,
		};
	}, [output]);

	const inputStats = useMemo(() => {
		if (!input) return null;
		return {
			characters: input.length,
			words: input.trim() ? input.trim().split(/\s+/).length : 0,
			lines: input.split("\n").length,
		};
	}, [input]);

	return (
		<LayoutD
			sidebarWidth={280}
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">Limpar texto</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							LIMPEZA
						</span>
					</div>
					<div className="flex items-center gap-1.5">
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
					{outputStats && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Resultado
							</h3>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Caracteres</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{outputStats.characters}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Palavras</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{outputStats.words}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Linhas</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{outputStats.lines}
								</span>
							</div>
						</div>
					)}

					{input &&
						(issues.fromWord ||
							issues.hasInvisible ||
							issues.hasManyLineBreaks) && (
							<div className="p-4 space-y-2">
								<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
									Problemas detectados
								</h3>
								{issues.fromWord && (
									<div className="flex items-center gap-2 text-xs text-amber-600">
										<span>Texto parece vindo do Word</span>
									</div>
								)}
								{issues.hasInvisible && (
									<div className="flex items-center gap-2 text-xs text-amber-600">
										<span>Contém caracteres invisíveis</span>
									</div>
								)}
								{issues.hasManyLineBreaks && (
									<div className="flex items-center gap-2 text-xs text-amber-600">
										<span>Muitas quebras de linha</span>
									</div>
								)}
							</div>
						)}

					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Opções
						</h3>
						<TextCleanerOptions options={options} onChange={setOptions} />
					</div>
				</>
			}
		>
			<div className="p-4">
				<TextCleanerInput value={input} onChange={setInput} />
			</div>

			{output && (
				<>
					<div className="border-t border-border p-4">
						<TextCleanerResult output={output} />
					</div>
					{hasChanges && (
						<div className="border-t border-border p-4">
							<DiffResult diffResult={diff} showOnlyDifferences={false} />
						</div>
					)}
				</>
			)}

			{input && (
				<div className="border-t border-border p-4">
					<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
						Visualização de caracteres invisíveis
					</h3>
					<TextCleanerHighlight text={input} />
				</div>
			)}

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 mt-auto">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-green-600" />
						<span className="text-[11px] text-muted-foreground">
							{output ? "Processado" : "Pronto"}
						</span>
					</span>
				</div>
				{inputStats && (
					<div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
						<span>{inputStats.characters} caracteres</span>
						<span>·</span>
						<span>{inputStats.words} palavras</span>
						<span>·</span>
						<span>{inputStats.lines} linhas</span>
					</div>
				)}
			</div>
		</LayoutD>
	);
}
