"use client";

import { CopyIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
	onClear: () => void;
	onCopy: () => void;
	hasResult: boolean;
};

export function CsvJsonControls({ onClear, onCopy, hasResult }: Props) {
	return (
		<div className="flex gap-2">
			<Button variant="secondary" disabled={!hasResult} onClick={onClear}>
				<Trash />
				Limpar
			</Button>

			{hasResult && (
				<Button onClick={onCopy}>
					<CopyIcon /> Copiar resultado
				</Button>
			)}
		</div>
	);
}
