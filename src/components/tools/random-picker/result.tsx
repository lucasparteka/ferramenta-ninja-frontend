type RandomPickerResultProps = {
	winners: string[];
};

export function RandomPickerResult({ winners }: RandomPickerResultProps) {
	return (
		<div
			className="space-y-3"
			role="status"
			aria-label="Resultado do sorteio"
		>
			<p className="text-sm font-medium text-foreground">
				{winners.length === 1
					? "1 vencedor sorteado"
					: `${winners.length} vencedores sorteados`}
			</p>
			<ol className="space-y-2">
				{winners.map((winner, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: winners may not be unique
					<li key={index} className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3">
						<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
							{index + 1}
						</span>
						<span className="font-medium text-foreground">{winner}</span>
					</li>
				))}
			</ol>
		</div>
	);
}
