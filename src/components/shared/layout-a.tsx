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
			{header && (
				<div className="sticky top-14 z-10 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-4 py-3">
					{header}
				</div>
			)}
			<div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr_300px] border border-border rounded-lg overflow-hidden">
				<aside className="bg-card border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
					{leftPanel}
				</aside>
				<main className="bg-muted/40 flex flex-col min-h-[440px]">
					{centerPanel}
				</main>
				<aside className="bg-card border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
					{rightPanel}
				</aside>
			</div>
			{footer && (
				<div className="border-t border-border bg-muted/40 px-4 py-2">
					{footer}
				</div>
			)}
		</div>
	);
}
