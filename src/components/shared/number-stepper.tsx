"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type NumberStepperProps = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	className?: string;
};

export function NumberStepper({
	value,
	onChange,
	min = 1,
	max = 99,
	step = 1,
	label,
	className,
}: NumberStepperProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-3",
				className,
			)}
		>
			{label && (
				<span className="text-xs text-muted-foreground">{label}</span>
			)}
			<div className="inline-flex items-stretch h-7 border border-border rounded-md overflow-hidden bg-card">
				<button
					type="button"
					onClick={() => onChange(Math.max(min, value - step))}
					disabled={value <= min}
					className="flex items-center justify-center w-7 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
					aria-label="Diminuir"
				>
					<Minus className="h-3 w-3" />
				</button>
				<div className="w-px bg-border" />
				<input
					type="text"
					inputMode="numeric"
					value={value}
					onChange={(e) => {
						const n = Number.parseInt(e.target.value, 10);
						if (!Number.isNaN(n) && n >= min && n <= max) {
							onChange(n);
						}
					}}
					className="w-11 bg-transparent text-center font-mono text-xs tabular-nums text-foreground focus:outline-none"
				/>
				<div className="w-px bg-border" />
				<button
					type="button"
					onClick={() => onChange(Math.min(max, value + step))}
					disabled={value >= max}
					className="flex items-center justify-center w-7 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
					aria-label="Aumentar"
				>
					<Plus className="h-3 w-3" />
				</button>
			</div>
		</div>
	);
}
