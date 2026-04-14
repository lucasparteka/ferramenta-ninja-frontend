type RandomPickerInputProps = {
	value: string;
	onChange: (value: string) => void;
	itemCount: number;
};

export function RandomPickerInput({
	value,
	onChange,
	itemCount,
}: RandomPickerInputProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor="picker-input"
					className="text-sm font-medium text-foreground"
				>
					Digite os itens (um por linha)
				</label>
				{itemCount > 0 && (
					<span className="text-xs text-muted-foreground">
						{itemCount} itens
					</span>
				)}
			</div>
			<textarea
				id="picker-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={"Ana\nBruno\nCarla\nDaniel"}
				rows={10}
				className="w-full resize-y rounded-lg border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>
	);
}
