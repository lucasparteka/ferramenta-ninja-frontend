import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultRowProps {
	label: string;
	value: ReactNode;
	dim?: boolean;
	strong?: boolean;
	subdued?: boolean;
	action?: ReactNode;
}

function brl(v: number): string {
	return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ResultRow({
	label,
	value,
	dim,
	strong,
	subdued,
	action,
}: ResultRowProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4 py-1.5",
				subdued && "opacity-50",
			)}
		>
			<span
				className={cn(
					"text-[12.5px]",
					dim ? "text-muted-foreground" : "text-foreground",
					strong && "font-semibold",
				)}
			>
				{label}
			</span>
			<div className="flex items-center gap-2 min-w-0">
				<span
					className={cn(
						"whitespace-nowrap font-mono text-[12.5px] tabular-nums",
						dim ? "text-muted-foreground" : "text-foreground",
						strong && "font-semibold",
					)}
				>
					{typeof value === "number" ? brl(value) : value}
				</span>
				{action && <span className="shrink-0">{action}</span>}
			</div>
		</div>
	);
}
