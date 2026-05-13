/**
 * @deprecated Use ResultSheet (Layout A/C/E) ou badges inline (Layout E).
 * Mantido apenas para compatibilidade com ferramentas legadas.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "warning" | "destructive" | "muted";

const toneStyles: Record<Tone, string> = {
	primary: "border bg-muted",
	warning: "border-warning/40 bg-warning/10",
	destructive: "border-destructive/40 bg-destructive/10",
	muted: "border-border bg-card",
};

type ResultBoxProps = {
	label?: ReactNode;
	value?: ReactNode;
	hint?: ReactNode;
	tone?: Tone;
	className?: string;
	children?: ReactNode;
};

export function ResultBox({
	label,
	value,
	hint,
	tone = "primary",
	className,
	children,
}: ResultBoxProps) {
	return (
		<div className={cn("rounded-md border p-4", toneStyles[tone], className)}>
			{label && <p className="text-sm text-muted-foreground">{label}</p>}
			{value !== undefined && (
				<p className="text-2xl font-semibold text-foreground">{value}</p>
			)}
			{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
			{children}
		</div>
	);
}

type ResultRowProps = {
	label: ReactNode;
	value: ReactNode;
	className?: string;
};

export function ResultRow({ label, value, className }: ResultRowProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm",
				className,
			)}
		>
			<dt className="text-muted-foreground">{label}</dt>
			<dd className="font-medium text-foreground">{value}</dd>
		</div>
	);
}

type ResultGridProps = {
	children: ReactNode;
	className?: string;
};

export function ResultGrid({ children, className }: ResultGridProps) {
	return (
		<dl className={cn("grid gap-2 text-sm sm:grid-cols-2", className)}>
			{children}
		</dl>
	);
}
