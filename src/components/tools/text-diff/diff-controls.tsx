"use client";

import { ArrowLeftRight, GitCompare, Trash } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";

type DiffControlsProps = {
	onCompare: () => void;
	onClear: () => void;
	onSwap: () => void;
	resultText: string;
	hasResult: boolean;
};

export function DiffControls({
	onCompare,
	onClear,
	onSwap,
	resultText,
	hasResult,
}: DiffControlsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			<Button type="button" onClick={onCompare} className="gap-1.5">
				<GitCompare className="size-4" />
				Comparar textos
			</Button>

			<Button
				type="button"
				variant="outline"
				onClick={onSwap}
				className="gap-1.5"
			>
				<ArrowLeftRight className="size-4" />
				Inverter textos
			</Button>

			<Button
				type="button"
				variant="secondary"
				onClick={onClear}
				className="gap-1.5"
			>
				<Trash className="size-4" />
				Limpar
			</Button>

			{hasResult && <CopyButton text={resultText} label="Copiar resultado" />}
		</div>
	);
}
