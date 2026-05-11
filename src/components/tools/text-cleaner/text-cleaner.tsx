"use client";

import DiffMatchPatch from "diff-match-patch";
import { ChevronDown, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { StatusBar } from "@/components/shared/status-bar";
import { SwitchRow } from "@/components/shared/switch-row";
import { DiffResult } from "@/components/tools/text-diff/diff-result";
import { Button } from "@/components/ui/button";
import { TextCleanerHighlight } from "./text-cleaner-highlight";
import { TextCleanerInput } from "./text-cleaner-input";
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

	const [showDiff, setShowDiff] = useState(false);

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
		};
	}, [output]);

	const inputStats = useMemo(() => {
		if (!input) return null;
		return {
			characters: input.length,
			words: input.trim() ? input.trim().split(/\s+/).length : 0,
		};
	}, [input]);

	const removedCount = useMemo(() => {
		if (!inputStats || !outputStats) return 0;
		return inputStats.characters - outputStats.characters;
	}, [inputStats, outputStats]);

	const counts = useMemo(() => {
		if (!input) return {};
		return {
			removeExtraSpaces: (input.match(/  +/g) || []).length,
			removeLineBreaks: (input.match(/\n{2,}/g) || []).length,
			removeInvisible: (input.match(/[​-‍﻿]/g) || []).length,
			trimLines: (input.match(/^ +| +$/gm) || []).length,
		};
	}, [input]);

	return (
		<LayoutD
			sidebarWidth={280}
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">
							Limpar texto
						</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							LIMPEZA
						</span>
						{hasChanges && (
							<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success tabular-nums">
								−{removedCount} chars
							</span>
						)}
					</div>
					<div className="flex items-center gap-1.5">
						<CopyButton
							text={output}
							label="Copiar"
							variant="outline"
							size="sm"
							disabled={!output}
						/>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={clearAll}
							disabled={!input}
							aria-label="Limpar"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</>
			}
			sidebar={
				<>
					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Operações
							<span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground/60">
								aplicadas em ordem
							</span>
						</h3>
						<SwitchRow
							label="Espaços extras"
							hint="Reduz múltiplos espaços para um"
							checked={options.removeExtraSpaces}
							onChange={(v) => setOptions({ ...options, removeExtraSpaces: v })}
							feedback={
								options.removeExtraSpaces && counts.removeExtraSpaces && counts.removeExtraSpaces > 0
									? `−${counts.removeExtraSpaces} ocorrências`
									: undefined
							}
						/>
						<SwitchRow
							label="Quebras de linha duplicadas"
							hint="Reduz múltiplas quebras para uma"
							checked={options.removeLineBreaks}
							onChange={(v) => setOptions({ ...options, removeLineBreaks: v })}
							feedback={
								options.removeLineBreaks && counts.removeLineBreaks && counts.removeLineBreaks > 0
									? `−${counts.removeLineBreaks} ocorrências`
									: undefined
							}
						/>
						<SwitchRow
							label="Caracteres invisíveis"
							hint="Remove zero-width, BOM, etc."
							checked={options.removeInvisible}
							onChange={(v) => setOptions({ ...options, removeInvisible: v })}
							feedback={
								options.removeInvisible && counts.removeInvisible && counts.removeInvisible > 0
									? `−${counts.removeInvisible}`
									: undefined
							}
						/>
						<SwitchRow
							label="Trim por linha"
							hint="Espaços no início/fim"
							checked={options.trimLines}
							onChange={(v) => setOptions({ ...options, trimLines: v })}
						/>
					</div>

					<div className="p-4 space-y-2">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Normalização
						</h3>
						<SwitchRow
							label="Aspas curvas → retas"
							hint={`“‘ → "'`}
							checked={options.convertQuotes}
							onChange={(v) => setOptions({ ...options, convertQuotes: v })}
							muted
						/>
						<SwitchRow
							label="Travessões → hífens"
							hint="— – → -"
							checked={options.convertDashes}
							onChange={(v) => setOptions({ ...options, convertDashes: v })}
							muted
						/>
					</div>
				</>
			}
		>
			<div className="p-4">
				<TextCleanerInput value={input} onChange={setInput} />
			</div>

			{output && (
				<div className="border-t border-border p-4">
					<TextCleanerResult
						output={output}
						difference={removedCount}
						totalInput={inputStats?.characters ?? 0}
					/>
				</div>
			)}

			{input && (
				<div className="border-t border-border p-4">
					<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
						Caracteres invisíveis
					</h3>
					<TextCleanerHighlight text={input} />
				</div>
			)}

			{showDiff && hasChanges && (
				<div className="border-t border-border p-4">
					<DiffResult diffResult={diff} showOnlyDifferences={false} />
				</div>
			)}

			<StatusBar
				items={[
					{
						label: "",
						value: output ? "Limpo" : "Pronto",
						mono: true,
					},
					{
						label: "Total removido",
						value: removedCount > 0 ? `−${removedCount} chars` : "0",
						mono: true,
						variant: removedCount > 0 ? "success" : "default",
					},
					{
						label: "",
						value:
							inputStats && removedCount > 0
								? `${((removedCount / inputStats.characters) * 100).toFixed(1)}%`
								: "",
						mono: true,
					},
				]}
				right={
					hasChanges ? (
						<Button
							variant="ghost"
							size="sm"
							className="h-6 px-2 text-[11px]"
							onClick={() => setShowDiff(!showDiff)}
						>
							<ChevronDown
								className={`mr-1 h-3 w-3 transition-transform ${
									showDiff ? "rotate-180" : ""
								}`}
							/>
							{showDiff ? "Ocultar diff" : "Mostrar diff"}
						</Button>
					) : undefined
				}
			/>
		</LayoutD>
	);
}

type TextCleanerResultProps = {
	output: string;
	difference?: number;
	totalInput?: number;
};

function TextCleanerResult({
	output,
	difference,
	totalInput,
}: TextCleanerResultProps) {
	return (
		<div className="space-y-2">
			{difference !== undefined && difference > 0 && totalInput && (
				<div className="flex items-center justify-between">
					<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
						Resultado
					</span>
					<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success tabular-nums">
						−{difference} chars
					</span>
				</div>
			)}
			<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
				{output}
			</pre>
		</div>
	);
}
