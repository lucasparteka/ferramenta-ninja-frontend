"use client";

type DiffTuple = [-1 | 0 | 1, string];

type DiffResultProps = {
	diffResult: DiffTuple[];
	showOnlyDifferences: boolean;
};

const addedStyle = {
	backgroundColor: "#d4f8d4",
	color: "#1a7f37",
};

const removedStyle = {
	backgroundColor: "#ffd6d6",
	color: "#a10000",
};

export function DiffResult({
	diffResult,
	showOnlyDifferences,
}: DiffResultProps) {
	const leftItems = showOnlyDifferences
		? diffResult.filter(([type]) => type === -1)
		: diffResult.filter(([type]) => type !== 1);

	const rightItems = showOnlyDifferences
		? diffResult.filter(([type]) => type === 1)
		: diffResult.filter(([type]) => type !== -1);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div className="flex flex-col gap-1">
				<span className="text-xs font-medium text-muted-foreground">
					Original
				</span>
				<div className="overflow-x-auto rounded-md border bg-background p-4">
					<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
						{leftItems.map(([type, text], i) => {
							if (type === -1) {
								return (
									<span key={i} style={removedStyle}>
										{text}
									</span>
								);
							}
							return <span key={i}>{text}</span>;
						})}
					</pre>
				</div>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-xs font-medium text-muted-foreground">
					Modificado
				</span>
				<div className="overflow-x-auto rounded-md border bg-background p-4">
					<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
						{rightItems.map(([type, text], i) => {
							if (type === 1) {
								return (
									<span key={i} style={addedStyle}>
										{text}
									</span>
								);
							}
							return <span key={i}>{text}</span>;
						})}
					</pre>
				</div>
			</div>
		</div>
	);
}
