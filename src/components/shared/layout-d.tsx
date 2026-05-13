import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LayoutDProps = {
	header: ReactNode;
	sidebar: ReactNode;
	children: ReactNode;
	sidebarWidth?: number;
	mainAreaClassName?: string;
};

export function LayoutD({
	header,
	sidebar,
	children,
	sidebarWidth = 240,
	mainAreaClassName,
}: LayoutDProps) {
	return (
		<div
			className="rounded-sm border border-border overflow-hidden flex flex-col md:grid bg-card"
			style={{ gridTemplateColumns: `1fr ${sidebarWidth}px` }}
		>
			<div className="flex items-center justify-between gap-y-4 flex-wrap border-b border-border px-4 py-2.5 col-span-full">
				{header}
			</div>
			<div
				className={cn(
					"flex flex-col border-r border-border min-w-0",
					mainAreaClassName,
				)}
			>
				{children}
			</div>
			<div className="flex flex-col bg-muted/30 divide-y divide-border overflow-y-auto">
				{sidebar}
			</div>
		</div>
	);
}
