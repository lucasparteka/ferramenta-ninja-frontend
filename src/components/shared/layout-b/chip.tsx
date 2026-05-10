import { cn } from "@/lib/utils";

type ChipTone = "neutral" | "info" | "warn" | "success" | "danger";

interface ChipProps {
	children: React.ReactNode;
	tone?: ChipTone;
}

const toneClasses: Record<ChipTone, string> = {
	neutral: "bg-muted border-border text-muted-foreground",
	info: "bg-primary/10 border-primary/20 text-primary",
	warn: "bg-warning/10 border-warning/20 text-warning",
	success: "bg-success/10 border-success/20 text-success",
	danger: "bg-destructive/10 border-destructive/30 text-destructive",
};

export function Chip({ children, tone = "neutral" }: ChipProps) {
	return (
		<span
			className={cn(
				"inline-flex h-5 items-center rounded border px-[7px] text-[10.5px] font-semibold uppercase tracking-[0.02em]",
				toneClasses[tone],
			)}
		>
			{children}
		</span>
	);
}
