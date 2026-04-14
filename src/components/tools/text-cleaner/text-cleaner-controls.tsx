"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
	onCopy: () => void;
	hasResult: boolean;
};

export function TextCleanerControls({ onCopy, hasResult }: Props) {
	return (
		<div className="flex gap-2">
			{hasResult && (
				<Button variant="outline" onClick={onCopy} className="gap-1.5">
					<Copy className="size-4" />
					Copiar
				</Button>
			)}
		</div>
	);
}
