"use client";

import dynamic from "next/dynamic";

const OrdemServicoEditor = dynamic(
	() =>
		import("@/components/tools/ordem-servico/ordem-servico-editor").then(
			(m) => ({ default: m.OrdemServicoEditor }),
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
				<p className="text-muted-foreground">
					Carregando editor de ordem de serviço...
				</p>
			</div>
		),
	},
);

export function OrdemServicoClient() {
	return <OrdemServicoEditor />;
}
