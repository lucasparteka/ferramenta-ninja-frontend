"use client";

import { GitCompare, Trash2 } from "lucide-react";
import { LayoutD } from "@/components/shared/layout-d";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
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

	const additions = diffResult.filter(([type]) => type === 1).length;
	const removals = diffResult.filter(([type]) => type === -1).length;

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Comparar textos"
					badge="COMPARAÇÃO"
					actions={
						<>
							<Button onClick={computeDiff} size="sm" variant="default">
								<GitCompare className="mr-1.5 h-3 w-3" />
								Comparar
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={clearAll}
								aria-label="Limpar"
								disabled={!leftText && !rightText}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</>
					}
				/>
			}
			sidebar={
				<>
					{hasCompared && (
						<SidebarSection title="Resultado">
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
						</SidebarSection>
					)}
					<SidebarSection title="Opções">
						<DiffOptions options={options} onChange={setOptions} />
					</SidebarSection>
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
				<div className="border-t border-border p-4">
					<DiffResult
						diffResult={diffResult}
						showOnlyDifferences={options.showOnlyDifferences}
					/>
				</div>
			)}

			<StatusBar
				items={[
					{
						label: "",
						value: hasCompared ? "Comparado" : "Pronto para comparar",
						mono: false,
						variant: hasCompared ? "success" : "default",
					},
					{ label: "Original", value: `${leftText.length}`, mono: true },
					{ label: "Modificado", value: `${rightText.length}`, mono: true },
				]}
			/>
		</LayoutD>
	);
}
