"use client";

import dynamic from "next/dynamic";

const MenuEditor = dynamic(
	() =>
		import("@/components/tools/menu/menu-editor").then((m) => ({
			default: m.MenuEditor,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
				Carregando editor…
			</div>
		),
	},
);

export function MenuClient() {
	return <MenuEditor />;
}
