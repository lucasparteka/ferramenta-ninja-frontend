import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GeneratorOutputProps = {
	value: string;
	onCopy: () => void;
	copied: boolean;
};

export function GeneratorOutput({
	value,
	onCopy,
	copied,
}: GeneratorOutputProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor="generator-output"
					className="text-sm font-medium text-foreground"
				>
					Texto gerado
				</label>
				<Button variant="outline" size="sm" onClick={onCopy} disabled={!value}>
					{copied ? "Copiado!" : "Copiar"}
				</Button>
			</div>
			<Textarea
				id="generator-output"
				readOnly
				value={value}
				placeholder='Clique em "Gerar texto" para começar...'
				rows={12}
				className="resize-y"
			/>
			{copied && <p className="text-sm text-success">Texto copiado!</p>}
		</div>
	);
}
