import { cn } from "@/lib/utils";

interface ResultRowProps {
	label: string;
	value: number | string;
	dim?: boolean;
	strong?: boolean;
	subdued?: boolean;
}

function brl(v: number): string {
	return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ResultRow({ label, value, dim, strong, subdued }: ResultRowProps) {
	return (
		<div
			className={cn(
				"flex items-baseline justify-between gap-4 py-1.5",
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
			<span
				className={cn(
					"whitespace-nowrap font-mono text-[12.5px] tabular-nums",
					dim ? "text-muted-foreground" : "text-foreground",
					strong && "font-semibold",
				)}
			>
				{typeof value === "number" ? brl(value) : value}
			</span>
		</div>
	);
}
