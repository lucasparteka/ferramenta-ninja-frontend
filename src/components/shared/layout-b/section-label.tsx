interface SectionLabelProps {
	children: React.ReactNode;
	hint?: string;
}

export function SectionLabel({ children, hint }: SectionLabelProps) {
	return (
		<div className="flex items-baseline justify-between gap-2 border-b border-border pb-2 mb-3.5">
			<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
				{children}
			</span>
			{hint && (
				<span className="text-[11px] text-muted-foreground/70">{hint}</span>
			)}
		</div>
	);
}
