"use client";

import { CopyButton } from "@/components/shared/copy-button";

type Props = {
	output: string;
};

export function TextCleanerResult({ output }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
				Resultado
			</h3>
			<div className="rounded-md border">
				<pre className="whitespace-pre-wrap font-mono text-sm p-4">
					{output}
				</pre>
			</div>
			<CopyButton
				text={output}
				label="Copiar resultado"
				variant="outline"
				size="sm"
				className="self-end"
			/>
		</div>
	);
}
