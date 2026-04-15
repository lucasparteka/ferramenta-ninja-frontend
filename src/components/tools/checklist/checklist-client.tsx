"use client";

import dynamic from "next/dynamic";

const ChecklistEditor = dynamic(
	() =>
		import("@/components/tools/checklist/checklist-editor").then((m) => ({
			default: m.ChecklistEditor,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
				<p className="text-muted-foreground">
					Carregando editor de checklist...
				</p>
			</div>
		),
	},
);

export function ChecklistClient() {
	return <ChecklistEditor />;
}
