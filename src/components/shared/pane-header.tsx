"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PaneHeaderProps = {
	title: ReactNode;
	actions?: ReactNode;
	badge?: ReactNode;
	className?: string;
};

export function PaneHeader({ title, actions, badge, className }: PaneHeaderProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2",
				className,
			)}
		>
			<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
				{title}
				{badge}
			</span>
			{actions && (
				<div className="flex items-center gap-1.5">{actions}</div>
			)}
		</div>
	);
}
