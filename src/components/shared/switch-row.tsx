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
			role="switch"
			aria-checked={checked}
			tabIndex={0}
			className="flex items-center justify-between gap-3 py-1.5 cursor-pointer group"
			onClick={() => onChange(!checked)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onChange(!checked);
				}
			}}
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
						)}
					>
						{feedback || hint}
					</div>
				)}
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={(e) => {
					e.stopPropagation();
					onChange(!checked);
				}}
				className={cn(
					"relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
					checked ? "bg-primary" : "bg-input",
				)}
			>
				<span
					className={cn(
						"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
						checked ? "left-4.5" : "left-0.5",
					)}
				/>
			</button>
		</div>
	);
}
