import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
				<Label htmlFor="picker-input">Digite os itens (um por linha)</Label>
				{itemCount > 0 && (
					<span className="text-xs text-muted-foreground">
						{itemCount} itens
					</span>
				)}
			</div>
			<Textarea
				id="picker-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={"Ana\nBruno\nCarla\nDaniel"}
				rows={10}
				className="resize-y"
			/>
		</div>
	);
}
