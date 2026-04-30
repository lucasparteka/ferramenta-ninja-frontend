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
			<label
				htmlFor="message-input"
				className="text-sm font-medium text-foreground"
			>
				Digite ou cole seu texto
			</label>
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
