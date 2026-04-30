"use client";

import { Trash } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";

type Props = {
	onClear: () => void;
	output: string;
	hasResult: boolean;
};

export function CsvJsonControls({ onClear, output, hasResult }: Props) {
	return (
		<div className="flex gap-2">
			<Button variant="secondary" disabled={!hasResult} onClick={onClear}>
				<Trash />
				Limpar
			</Button>

			{hasResult && <CopyButton text={output} label="Copiar resultado" />}
		</div>
	);
}
