type LayoutCProps = {
	left: React.ReactNode;
	right: React.ReactNode;
	footer?: React.ReactNode;
};

export function LayoutC({ left, right, footer }: LayoutCProps) {
	return (
		<div className="rounded-sm border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
			<div className="flex flex-col border-b border-border md:border-b-0 md:border-r md:border-border">
				{left}
			</div>
			<div className="flex flex-col">{right}</div>
			{footer && <div className="col-span-full">{footer}</div>}
		</div>
	);
}
