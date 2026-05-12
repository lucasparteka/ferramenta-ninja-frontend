import type { ReactNode } from "react";

type LayoutCProps = {
	left: ReactNode;
	right: ReactNode;
	toolbar?: ReactNode;
	footer?: ReactNode;
	swapButton?: ReactNode;
};

export function LayoutC({
	left,
	right,
	toolbar,
	footer,
	swapButton,
}: LayoutCProps) {
	return (
		<div className="rounded-sm border border-border overflow-hidden flex flex-col bg-card">
			{toolbar && (
				<div className="flex items-center justify-between border-b border-border px-3 py-2.5 gap-3">
					{toolbar}
				</div>
			)}
			<div className="relative grid grid-cols-1 md:grid-cols-2">
				<div className="flex flex-col border-b md:border-b-0 md:border-r border-border">
					{left}
				</div>
				<div className="flex flex-col">{right}</div>
				{swapButton && (
					<div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
						{swapButton}
					</div>
				)}
			</div>
			{footer && <div className="col-span-full">{footer}</div>}
		</div>
	);
}
