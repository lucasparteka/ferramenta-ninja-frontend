"use client";

import DiffMatchPatch from "diff-match-patch";
import { useMemo } from "react";
import { DiffResult } from "@/components/tools/text-diff/diff-result";
import { Separator } from "@/components/ui/separator";
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
	const { input, output, options, setInput, setOptions, issues } =
		useTextCleaner(defaultOptions);

	const diff = useMemo(() => {
		if (!input || !output) return [];
		return computeDiff(input, output);
	}, [input, output]);

	return (
		<div className="flex flex-col gap-6">
			<TextCleanerInput value={input} onChange={setInput} />

			<TextCleanerOptions options={options} onChange={setOptions} />

			{input && (
				<>
					<Separator />
					<div className="flex flex-col gap-2">
						<span className="text-sm font-medium text-muted-foreground">
							Visualização de caracteres invisíveis
						</span>
						<TextCleanerHighlight text={input} />
					</div>
				</>
			)}

			{output && (
				<>
					<Separator />
					<TextCleanerResult output={output} />

					{input !== output && diff.length > 0 && (
						<>
							<Separator />
							{input && (
								<div className="flex flex-wrap gap-3 text-xs">
									{issues.fromWord && <span>Texto parece vindo do Word</span>}
									{issues.hasInvisible && (
										<span>Contém caracteres invisíveis</span>
									)}
									{issues.hasManyLineBreaks && (
										<span>Muitas quebras de linha detectadas</span>
									)}
								</div>
							)}
							<DiffResult diffResult={diff} showOnlyDifferences={false} />
						</>
					)}
				</>
			)}
		</div>
	);
}
