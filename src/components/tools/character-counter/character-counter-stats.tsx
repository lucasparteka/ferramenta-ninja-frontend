type CounterResult = {
	characters: number;
	charactersNoSpaces: number;
	words: number;
	lines: number;
	paragraphs: number;
};

type StatItem = {
	label: string;
	value: number;
};

type CharacterCounterStatsProps = {
	stats: CounterResult;
};

export function CharacterCounterStats({ stats }: CharacterCounterStatsProps) {
	const items: StatItem[] = [
		{ label: "Caracteres (com espaços)", value: stats.characters },
		{ label: "Caracteres (sem espaços)", value: stats.charactersNoSpaces },
		{ label: "Palavras", value: stats.words },
		{ label: "Linhas", value: stats.lines },
		{ label: "Parágrafos", value: stats.paragraphs },
	];

	return (
		<div className="p-4 space-y-2">
			<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
				Contagens
			</h3>
			{items.map((item) => (
				<div
					key={item.label}
					className="flex items-center justify-between py-0.5"
				>
					<span className="text-xs text-muted-foreground">{item.label}</span>
					<span className="font-mono text-xs font-medium tabular-nums">
						{item.value}
					</span>
				</div>
			))}
		</div>
	);
}
