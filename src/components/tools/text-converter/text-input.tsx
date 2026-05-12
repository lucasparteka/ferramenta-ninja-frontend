import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function TextInput({ value, onChange }: TextInputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="text-input">Digite ou cole seu texto</Label>
			<Textarea
				id="text-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Cole ou digite o texto que deseja converter..."
				rows={8}
				className="resize-y"
			/>
		</div>
	);
}
