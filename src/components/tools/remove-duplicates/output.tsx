import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RemoveDuplicatesOutputProps = {
	value: string;
};

export function RemoveDuplicatesOutput({ value }: RemoveDuplicatesOutputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="duplicates-output">Lista Desduplicada</Label>
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
