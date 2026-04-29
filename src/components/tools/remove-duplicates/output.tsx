import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RemoveDuplicatesOutputProps = {
	value: string;
	onCopy: () => void;
	copied: boolean;
};

export function RemoveDuplicatesOutput({
	value,
	onCopy,
	copied,
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
				<Button variant="outline" size="sm" onClick={onCopy} disabled={!value}>
					{copied ? "Copiado!" : "Copiar"}
				</Button>
			</div>
			<Textarea
				id="duplicates-output"
				readOnly
				value={value}
				placeholder='Clique em "Remover duplicatas" para ver o resultado...'
				rows={12}
				className="resize-y p-4 text-foreground"
			/>
			{copied && <p className="text-sm text-success">Texto copiado!</p>}
		</div>
	);
}
