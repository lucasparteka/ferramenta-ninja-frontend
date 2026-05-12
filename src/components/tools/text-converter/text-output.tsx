import { CopyButton } from "@/components/shared/copy-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextOutputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function TextOutput({ value, onChange }: TextOutputProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label htmlFor="text-output">Resultado</Label>
				<CopyButton
					text={value}
					label="Copiar"
					disabled={!value}
					variant="outline"
				/>
			</div>
			<Textarea
				id="text-output"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="O resultado aparecerá aqui..."
				rows={8}
				className="resize-y"
			/>
		</div>
	);
}
