import { Textarea } from "@/components/ui/textarea";

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
			<Textarea
				id="text-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Cole ou digite o texto que deseja converter..."
				rows={8}
				className="resize-y p-4 text-foreground"
			/>
		</div>
	);
}
