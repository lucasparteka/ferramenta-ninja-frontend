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
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{items.map((item) => (
				<div
					key={item.label}
					className="rounded-lg border border-border bg-secondary p-4 text-center"
				>
					<p className="text-2xl font-bold text-primary">{item.value}</p>
					<p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
				</div>
			))}
		</div>
	);
}
