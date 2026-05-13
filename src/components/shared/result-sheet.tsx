"use client";

import { cn } from "@/lib/utils";

export type Section = {
	title: string;
	rows: { label: string; value: React.ReactNode; mono?: boolean }[];
};

type ResultSheetProps = {
	sections: Section[];
	variant?: "cards" | "grid";
	cols?: 1 | 2;
};

export function ResultSheet({
	sections,
	variant = "cards",
	cols = 2,
}: ResultSheetProps) {
	if (variant === "grid") {
		return (
			<div className={cn("grid grid-cols-1", cols === 2 && "md:grid-cols-2")}>
				{sections.map((section, i) => {
					const isOdd = i % 2 === 0;
					const isLast = i === sections.length - 1;
					const isSecondToLast = i === sections.length - 2;
					const noBottomBorder = isLast || (isSecondToLast && isOdd);

					return (
						<div
							key={section.title}
							className={cn(
								"border-b border-border",
								isOdd && cols === 2 && "md:border-r",
								noBottomBorder && "border-b-0",
							)}
						>
							<div className="border-b border-border bg-muted/55 px-4 py-[7px]">
								<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
									{section.title}
								</h3>
							</div>
							<div>
								{section.rows.map((row) => (
									<div
										key={row.label}
										className="flex items-start justify-between border-b border-border px-4 py-[9px] last:border-b-0"
									>
										<span className="min-w-[108px] pr-3 text-xs text-muted-foreground">
											{row.label}
										</span>
										<span
											className={cn(
												"text-right text-xs",
												row.mono && "font-mono",
											)}
										>
											{row.value}
										</span>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div
			className={cn("grid grid-cols-1 gap-4", cols === 2 && "md:grid-cols-2")}
		>
			{sections.map((section) => (
				<div
					key={section.title}
					className="rounded-md border border-border bg-card"
				>
					<div className="border-b border-border px-4 py-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							{section.title}
						</h3>
					</div>
					<div className="divide-y divide-border">
						{section.rows.map((row) => (
							<div
								key={row.label}
								className="flex items-start justify-between px-4 py-2.5"
							>
								<span className="min-w-[100px] text-xs text-muted-foreground">
									{row.label}
								</span>
								<span
									className={cn("text-right text-xs", row.mono && "font-mono")}
								>
									{row.value}
								</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
