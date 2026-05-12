import { CopyButton } from "@/components/shared/copy-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type GeneratorOutputProps = {
	value: string;
};

export function GeneratorOutput({ value }: GeneratorOutputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="generator-output">Texto gerado</Label>
			<Textarea
				id="generator-output"
				readOnly
				value={value}
				placeholder='Clique em "Gerar texto" para começar...'
				rows={12}
				className="resize-y"
			/>
			<CopyButton
				text={value}
				label="Copiar"
				disabled={!value}
				variant="outline"
				className="ml-auto flex"
			/>
		</div>
	);
}
