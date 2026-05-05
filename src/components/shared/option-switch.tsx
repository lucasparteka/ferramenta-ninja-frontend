"use client";

import { cn } from "@/lib/utils";

type Option = {
	label: string;
	value: string;
};

type OptionSwitchProps = {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
};

export function OptionSwitch({ options, value, onChange }: OptionSwitchProps) {
	return (
		<div className="flex items-center gap-1 rounded-lg border p-1 w-fit">
			{options.map((option) => {
				const active = value === option.value;
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"rounded-md px-3 py-1 text-sm transition-colors",
							active
								? "bg-primary text-primary-foreground"
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
