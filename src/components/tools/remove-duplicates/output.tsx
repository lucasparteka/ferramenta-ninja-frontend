import { CopyButton } from "@/components/shared/copy-button";
import { Textarea } from "@/components/ui/textarea";

type RemoveDuplicatesOutputProps = {
	value: string;
};

export function RemoveDuplicatesOutput({
	value,
}: RemoveDuplicatesOutputProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor="duplicates-output"
					className="text-sm font-medium text-foreground"
				>
					Lista Desduplicada
				</label>
				<CopyButton text={value} label="Copiar" disabled={!value} variant="outline" />
			</div>
			<Textarea
				id="duplicates-output"
				readOnly
				value={value}
				placeholder='Clique em "Remover duplicatas" para ver o resultado...'
				rows={12}
				className="resize-y"
			/>
		</div>
	);
}
