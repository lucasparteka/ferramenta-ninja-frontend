"use client";

import { cn } from "@/lib/utils";

export type Section = {
	title: string;
	rows: { label: string; value: React.ReactNode; mono?: boolean }[];
};

type ResultSheetProps = {
	sections: Section[];
};

export function ResultSheet({ sections }: ResultSheetProps) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
