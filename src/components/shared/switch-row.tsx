"use client";

import { cn } from "@/lib/utils";

type SwitchRowProps = {
	label: string;
	hint?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	feedback?: string;
	feedbackVariant?: "success" | "default";
	muted?: boolean;
};

export function SwitchRow({
	label,
	hint,
	checked,
	onChange,
	feedback,
	feedbackVariant = "success",
	muted = false,
}: SwitchRowProps) {
	return (
		<div
			className="flex items-center justify-between gap-3 py-1.5 cursor-pointer group"
			onClick={() => onChange(!checked)}
		>
			<div className="min-w-0 flex-1">
				<div
					className={cn(
						"text-xs font-medium",
						muted && !checked ? "text-muted-foreground" : "text-foreground",
					)}
				>
					{label}
				</div>
				{(hint || feedback) && (
					<div
						className={cn(
							"text-[11px] mt-0.5",
							feedback && feedbackVariant === "success"
								? "text-success font-mono tabular-nums"
								: "text-muted-foreground",
							feedback && feedbackVariant === "success" && "font-mono tabular-nums",
						)}
					>
						{feedback || hint}
					</div>
				)}
			</div>
			<button
				role="switch"
				aria-checked={checked}
				onClick={(e) => {
					e.stopPropagation();
					onChange(!checked);
				}}
				className={cn(
					"relative h-4 w-7 shrink-0 rounded-full transition-colors",
					checked ? "bg-foreground/80" : "bg-border",
				)}
			>
				<span
					className={cn(
						"absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all shadow-sm",
						checked ? "left-[14px]" : "left-0.5",
					)}
				/>
			</button>
		</div>
	);
}
