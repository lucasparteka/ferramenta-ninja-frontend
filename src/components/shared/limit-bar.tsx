import { cn } from "@/lib/utils";

type LimitBarProps = {
	label: string;
	current: number;
	min: number;
	max: number;
	status: "empty" | "short" | "good" | "long";
};

const statusConfig = {
	empty: {
		label: "Vazio",
		barClass: "bg-muted-foreground/20",
		textClass: "text-muted-foreground",
	},
	short: {
		label: "Muito curto",
		barClass: "bg-warning",
		textClass: "text-warning",
	},
	good: { label: "Ideal", barClass: "bg-success", textClass: "text-success" },
	long: {
		label: "Muito longo",
		barClass: "bg-destructive",
		textClass: "text-destructive",
	},
} as const;

export function LimitBar({ label, current, min, max, status }: LimitBarProps) {
	const config = statusConfig[status];
	const pct = Math.min((current / max) * 100, 100);

	return (
		<div className="space-y-1.5">
			<div className="flex justify-between">
				<span className="text-xs text-muted-foreground">{label}</span>
				<span className="font-mono text-caption text-muted-foreground">
					{current} / {max}
				</span>
			</div>
			<div className="h-1 rounded-full bg-border overflow-hidden">
				<div
					className={cn("h-full rounded-full transition-all", config.barClass)}
					style={{ width: `${pct}%` }}
				/>
			</div>
			<div className="flex justify-between">
				<span className={cn("text-caption", config.textClass)}>
					{config.label}
				</span>
				<span className="text-caption text-muted-foreground">
					Recomendado: {min}–{max}
				</span>
			</div>
		</div>
	);
}
