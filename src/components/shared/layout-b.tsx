type LayoutBProps = {
	form: React.ReactNode;
	result: React.ReactNode;
};

export function LayoutB({ form, result }: LayoutBProps) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] items-start">
			<div>{form}</div>
			<div className="lg:sticky lg:top-[calc(3.5rem+1px)]">
				<div className="rounded-md border border-border bg-card p-4 space-y-4">
					{result}
				</div>
			</div>
		</div>
	);
}
