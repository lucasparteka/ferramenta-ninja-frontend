type TextInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function TextInput({ value, onChange }: TextInputProps) {
	return (
		<div className="space-y-2">
			<label
				htmlFor="text-input"
				className="text-sm font-medium text-foreground"
			>
				Digite ou cole seu texto
			</label>
			<textarea
				id="text-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Cole ou digite o texto que deseja converter..."
				rows={8}
				className="w-full resize-y rounded-lg border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>
	);
}
