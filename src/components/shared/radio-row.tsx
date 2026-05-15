"use client";

import { cn } from "@/lib/utils";

type RadioRowProps = {
	label: string;
	badge?: string;
	active?: boolean;
	onClick: () => void;
};

export function RadioRow({ label, badge, active, onClick }: RadioRowProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"flex items-center justify-between rounded px-2.5 py-1.5 cursor-pointer transition-colors text-xs",
				active
					? "bg-primary/10 text-primary font-medium"
					: "text-foreground hover:bg-muted/60",
			)}
		>
			<span>{label}</span>
			{badge && (
				<span
					className={cn(
						"font-mono text-caption tabular-nums",
						active ? "text-primary/70" : "text-muted-foreground",
					)}
				>
					{badge}
				</span>
			)}
		</div>
	);
}
