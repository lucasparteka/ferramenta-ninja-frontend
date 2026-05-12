import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RemoveDuplicatesInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function RemoveDuplicatesInput({
	value,
	onChange,
}: RemoveDuplicatesInputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="duplicates-input">Lista Original</Label>
			<Textarea
				id="duplicates-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Cole a lista aqui, um item por linha..."
				rows={12}
				className="resize-y"
			/>
		</div>
	);
}
