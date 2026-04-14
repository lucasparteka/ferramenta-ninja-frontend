import type { Editor } from "@tiptap/react";
import { Bold, Code, Italic, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormattingToolbarProps = {
	editor: Editor | null;
};

export function FormattingToolbar({ editor }: FormattingToolbarProps) {
	if (!editor) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button
				variant={editor.isActive("bold") ? "default" : "outline"}
				size="sm"
				onClick={() => editor.chain().focus().toggleBold().run()}
				aria-label="Aplicar negrito"
				aria-pressed={editor.isActive("bold")}
			>
				<Bold />
				Negrito
			</Button>
			<Button
				variant={editor.isActive("italic") ? "default" : "outline"}
				size="sm"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				aria-label="Aplicar itálico"
				aria-pressed={editor.isActive("italic")}
			>
				<Italic />
				Itálico
			</Button>
			<Button
				variant={editor.isActive("strike") ? "default" : "outline"}
				size="sm"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				aria-label="Aplicar tachado"
				aria-pressed={editor.isActive("strike")}
			>
				<Strikethrough />
				Tachado
			</Button>
			<Button
				variant={editor.isActive("code") ? "default" : "outline"}
				size="sm"
				onClick={() => editor.chain().focus().toggleCode().run()}
				aria-label="Aplicar monoespaçado"
				aria-pressed={editor.isActive("code")}
			>
				<Code />
				Monoespaçado
			</Button>
		</div>
	);
}
