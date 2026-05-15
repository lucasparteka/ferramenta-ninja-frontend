"use client";

import { cn } from "@/lib/utils";

export type OptionSwitchOption = {
	label: string;
	value: string;
};

type OptionSwitchProps = {
	options: OptionSwitchOption[];
	value: string;
	onChange: (value: string) => void;
	size?: "default" | "sm";
	fullWidth?: boolean;
};

export function OptionSwitch({
	options,
	value,
	onChange,
	size = "default",
	fullWidth = false,
}: OptionSwitchProps) {
	return (
		<div
			role="radiogroup"
			className={cn(
				"inline-flex items-center bg-muted border border-border rounded-md p-0.5 gap-0.5",
				fullWidth && "flex w-full",
			)}
		>
			{options.map((option) => {
				const active = value === option.value;
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"rounded transition-all font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
							size === "default"
								? "px-3 text-13 h-7.5 text-[13px]"
								: "px-2 py-0.5 text-caption",
							fullWidth && "flex-1 flex items-center justify-center",
							active
								? "bg-card text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.12),0_0_0_0.5px_oklch(0_0_0/0.08)] font-medium"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
