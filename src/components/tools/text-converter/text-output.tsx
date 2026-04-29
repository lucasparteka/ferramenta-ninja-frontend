import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type TextOutputProps = {
	value: string;
	onChange: (value: string) => void;
	onCopy: () => void;
	copied: boolean;
};

export function TextOutput({
	value,
	onChange,
	onCopy,
	copied,
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
				<Button variant="outline" size="sm" onClick={onCopy} disabled={!value}>
					{copied ? "Copiado!" : "Copiar"}
				</Button>
			</div>
			<Textarea
				id="text-output"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="O resultado aparecerá aqui..."
				rows={8}
				className="resize-y p-4 text-foreground"
			/>
			{copied && <p className="text-sm text-success">Texto copiado!</p>}
		</div>
	);
}
