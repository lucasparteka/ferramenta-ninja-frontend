import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusItem = {
	label: string;
	value: string;
	mono?: boolean;
	variant?: "default" | "success" | "warning" | "danger";
};

type StatusBarProps = {
	items: StatusItem[];
	right?: ReactNode;
	className?: string;
};

export function StatusBar({ items, right, className }: StatusBarProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-caption mt-auto",
				className,
			)}
		>
			<div className="flex items-center gap-3">
				{items.map((item, i) => {
					const key = `${item.label}-${item.value}-${i}`;
					return (
						<span key={key} className="inline-flex items-center gap-1.5">
							{i > 0 && <span className="text-muted-foreground">·</span>}
							<span className="text-muted-foreground">{item.label}</span>
							<span
								className={cn(
									item.mono !== false && "font-mono  tabular-nums",
									item.variant === "success" && "text-success",
									item.variant === "warning" && "text-warning",
									item.variant === "danger" && "text-destructive",
									(!item.variant || item.variant === "default") &&
										"text-foreground font-medium",
								)}
							>
								{item.value}
							</span>
						</span>
					);
				})}
			</div>
			{right && <div className="flex items-center gap-2">{right}</div>}
		</div>
	);
}

type StatusDotProps = {
	variant?: "active" | "idle" | "warning";
};

export function StatusDot({ variant = "active" }: StatusDotProps) {
	const colors = {
		active: "bg-success",
		idle: "bg-foreground/30",
		warning: "bg-warning",
	};
	const ringColors = {
		active: "shadow-[0_0_0_3px_var(--success)]/10",
		idle: "",
		warning: "shadow-[0_0_0_3px_var(--warning)]/10",
	};
	return (
		<span
			className={cn(
				"inline-block h-1.5 w-1.5 rounded-full",
				colors[variant],
				ringColors[variant],
			)}
		/>
	);
}
