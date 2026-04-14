"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
	output: string;
};

function countStats(text: string) {
	return {
		characters: text.length,
		words: text.trim() ? text.trim().split(/\s+/).length : 0,
	};
}

export function TextCleanerResult({ output }: Props) {
	function handleCopy() {
		navigator.clipboard.writeText(output);
		toast.success("Texto copiado!");
	}

	const stats = countStats(output);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">
					Resultado
				</span>

				<Button onClick={handleCopy} className="gap-1.5">
					<Copy className="size-4" />
					Copiar
				</Button>
			</div>

			<div className="flex gap-4 text-xs text-muted-foreground">
				<span>{stats.characters} caracteres</span>
				<span>{stats.words} palavras</span>
			</div>

			<div className="rounded-md border p-4">
				<pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
			</div>
		</div>
	);
}
