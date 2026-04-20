"use client";

import dynamic from "next/dynamic";

const InventarioEditor = dynamic(
	() =>
		import("@/components/tools/inventario/inventario-editor").then((m) => ({
			default: m.InventarioEditor,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
				<p className="text-muted-foreground">
					Carregando editor de controle de estoque...
				</p>
			</div>
		),
	},
);

export function InventarioClient() {
	return <InventarioEditor />;
}
