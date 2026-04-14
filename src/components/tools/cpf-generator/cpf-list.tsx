"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CpfListProps = {
	cpfs: string[];
	onCopyAll: () => void;
	copiedAll: boolean;
};

export function CpfList({ cpfs, onCopyAll, copiedAll }: CpfListProps) {
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	function handleCopyItem(cpf: string, index: number) {
		navigator.clipboard.writeText(cpf);
		setCopiedIndex(index);
		setTimeout(() => setCopiedIndex(null), 2000);
	}

	const label =
		cpfs.length === 1 ? "1 CPF gerado" : `${cpfs.length} CPFs gerados`;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<Button variant="outline" size="sm" onClick={onCopyAll}>
					{copiedAll ? "Copiado!" : "Copiar tudo"}
				</Button>
			</div>
			<ul className="space-y-2">
				{cpfs.map((cpf, index) => (
					<li
						key={cpf}
						className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2"
					>
						<span className="font-mono text-foreground">{cpf}</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleCopyItem(cpf, index)}
						>
							{copiedIndex === index ? "Copiado!" : "Copiar"}
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
