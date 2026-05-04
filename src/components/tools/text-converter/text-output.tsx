import { CopyButton } from "@/components/shared/copy-button";
import { Textarea } from "@/components/ui/textarea";

type TextOutputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function TextOutput({
	value,
	onChange,
}: TextOutputProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor="text-output"
					className="text-sm font-medium text-foreground"
				>
					Resultado
				</label>
				<CopyButton text={value} label="Copiar" disabled={!value} variant="outline" size="sm" />
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
