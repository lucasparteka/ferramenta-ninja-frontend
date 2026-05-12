import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MessageInputProps = {
	ref: React.RefObject<HTMLTextAreaElement>;
	value: string;
	onChange: (value: string) => void;
	onSelectionChange: () => void;
};

export function MessageInput({
	ref,
	value,
	onChange,
	onSelectionChange,
}: MessageInputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="message-input">Digite ou cole seu texto</Label>
			<Textarea
				id="message-input"
				ref={ref}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onSelect={onSelectionChange}
				onMouseUp={onSelectionChange}
				onKeyUp={onSelectionChange}
				placeholder="Escreva sua mensagem aqui..."
				rows={8}
				className="resize-y"
			/>
		</div>
	);
}
