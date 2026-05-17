import type { ReactNode } from "react";

type LayoutAProps = {
	header?: ReactNode;
	leftPanel: ReactNode;
	centerPanel: ReactNode;
	rightPanel: ReactNode;
	footer?: ReactNode;
};

export function LayoutA({
	header,
	leftPanel,
	centerPanel,
	rightPanel,
	footer,
}: LayoutAProps) {
	return (
		<div>
			<div className="overflow-hidden rounded-lg border border-border">
				{header && (
					<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 bg-card">
						{header}
					</div>
				)}
				<div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr_300px]">
					<aside className="bg-card border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
						{leftPanel}
					</aside>
					<main className="bg-muted/40 flex flex-col lg:min-h-110">
						{centerPanel}
					</main>
					<aside className="bg-card border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
						{rightPanel}
					</aside>
				</div>
			</div>
			{footer && (
				<div className="border-t border-border bg-muted/40 px-4 py-2">
					{footer}
				</div>
			)}
		</div>
	);
}
