"use client";

import { CopyButton } from "@/components/shared/copy-button";

type CnpjListProps = {
	cnpjs: string[];
};

export function CnpjList({ cnpjs }: CnpjListProps) {
	const label =
		cnpjs.length === 1 ? "1 CNPJ gerado" : `${cnpjs.length} CNPJs gerados`;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<CopyButton text={cnpjs.join("\n")} label="Copiar tudo" size="sm" />
			</div>
			<ul className="space-y-2">
				{cnpjs.map((cnpj) => (
					<li
						key={cnpj}
						className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2"
					>
						<span className="font-mono text-foreground">{cnpj}</span>
						<CopyButton text={cnpj} size="sm" variant="ghost" />
					</li>
				))}
			</ul>
		</div>
	);
}
