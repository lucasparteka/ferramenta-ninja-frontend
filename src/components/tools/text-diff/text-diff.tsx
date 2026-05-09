"use client";

import { GitCompare, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { DiffInputs } from "./diff-inputs";
import { DiffOptions } from "./diff-options";
import { DiffResult } from "./diff-result";
import { useDiff } from "./use-diff";

export function TextDiff() {
	const {
		leftText,
		rightText,
		diffResult,
		hasCompared,
		options,
		setLeftText,
		setRightText,
		setOptions,
		computeDiff,
		clearAll,
		swapTexts,
	} = useDiff();

	const resultText = diffResult.map(([, text]) => text).join("");
	const additions = diffResult.filter(([type]) => type === 1).length;
	const removals = diffResult.filter(([type]) => type === -1).length;

	return (
		<LayoutD
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">
							Comparar textos
						</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							COMPARAÇÃO
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Button onClick={computeDiff} size="sm" variant="default">
							<GitCompare className="mr-1.5 h-3 w-3" />
							Comparar
						</Button>
						{hasCompared && (
							<CopyButton
								text={resultText}
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
							disabled={!leftText && !rightText}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</>
			}
			sidebar={
				<>
					{hasCompared && (
						<div className="p-4 space-y-2">
							<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Resultado
							</h3>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Adições</span>
								<span className="font-mono text-xs font-medium tabular-nums text-success">
									+{additions}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Remoções</span>
								<span className="font-mono text-xs font-medium tabular-nums text-destructive">
									-{removals}
								</span>
							</div>
							<div className="flex items-center justify-between py-0.5">
								<span className="text-xs text-muted-foreground">Blocos</span>
								<span className="font-mono text-xs font-medium tabular-nums">
									{diffResult.length}
								</span>
							</div>
						</div>
					)}
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
							Opções
						</h3>
						<DiffOptions options={options} onChange={setOptions} />
					</div>
				</>
			}
		>
			<DiffInputs
				leftText={leftText}
				rightText={rightText}
				onLeftChange={setLeftText}
				onRightChange={setRightText}
				onSwap={swapTexts}
			/>

			{hasCompared && (
				<div className="border-t border-border">
					<DiffResult
						diffResult={diffResult}
						showOnlyDifferences={options.showOnlyDifferences}
					/>
				</div>
			)}

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-green-600" />
						<span className="text-[11px] text-muted-foreground">
							{hasCompared ? "Comparado" : "Pronto para comparar"}
						</span>
					</span>
				</div>
				<div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
					<span>{leftText.length} original</span>
					<span>·</span>
					<span>{rightText.length} modificado</span>
				</div>
			</div>
		</LayoutD>
	);
}
