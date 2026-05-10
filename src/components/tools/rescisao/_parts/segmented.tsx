import { cn } from "@/lib/utils";

export interface SegmentedOption {
	value: string;
	label: string;
}

interface SegmentedProps {
	value: string;
	onChange: (value: string) => void;
	options: SegmentedOption[];
}

export function Segmented({ value, onChange, options }: SegmentedProps) {
	return (
		<div
			role="radiogroup"
			className="inline-flex w-full gap-0.5 rounded-md border border-border bg-muted p-0.5"
		>
			{options.map((o) => {
				const active = value === o.value;
				return (
					<button
						key={o.value}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => onChange(o.value)}
						className={cn(
							"flex h-[26px] flex-1 items-center justify-center rounded-sm text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
							active
								? "bg-card font-semibold text-foreground shadow-xs"
								: "font-medium text-muted-foreground hover:text-foreground",
						)}
					>
						{o.label}
					</button>
				);
			})}
		</div>
	);
}
