import { CopyButton } from "@/components/shared/copy-button";
import { Textarea } from "@/components/ui/textarea";

type GeneratorOutputProps = {
	value: string;
};

export function GeneratorOutput({
	value,
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
				<CopyButton text={value} label="Copiar" disabled={!value} variant="outline" size="sm" />
			</div>
			<Textarea
				id="generator-output"
				readOnly
				value={value}
				placeholder='Clique em "Gerar texto" para começar...'
				rows={12}
				className="resize-y"
			/>
		</div>
	);
}
