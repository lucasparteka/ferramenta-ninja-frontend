"use client";

import { CopyButton } from "@/components/shared/copy-button";

type CpfListProps = {
	cpfs: string[];
};

export function CpfList({ cpfs }: CpfListProps) {
	const label =
		cpfs.length === 1 ? "1 CPF gerado" : `${cpfs.length} CPFs gerados`;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<CopyButton text={cpfs.join("\n")} label="Copiar tudo" size="sm" />
			</div>
			<ul className="space-y-2">
				{cpfs.map((cpf) => (
					<li
						key={cpf}
						className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2"
					>
						<span className="font-mono text-foreground">{cpf}</span>
						<CopyButton text={cpf} size="sm" variant="ghost" />
					</li>
				))}
			</ul>
		</div>
	);
}
