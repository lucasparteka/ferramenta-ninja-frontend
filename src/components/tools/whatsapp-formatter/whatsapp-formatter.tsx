"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Copy, Eraser, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { serializeToWhatsApp } from "@/lib/text/whatsapp-serializer";
import { FormattingToolbar } from "./formatting-toolbar";
import { RichEditor } from "./rich-editor";
import { WhatsAppPreview } from "./whatsapp-preview";

export function WhatsAppFormatter() {
	const [whatsAppText, setWhatsAppText] = useState("");
	const [copied, setCopied] = useState(false);
	const [, rerender] = useState(0);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				blockquote: false,
				bulletList: false,
				codeBlock: false,
				heading: false,
				horizontalRule: false,
				listItem: false,
				orderedList: false,
			}),
		],
		editorProps: {
			attributes: {
				"data-placeholder": "Escreva sua mensagem aqui...",
			},
		},
		onTransaction() {
			rerender((n) => n + 1);
		},
		onUpdate({ editor: e }) {
			setWhatsAppText(serializeToWhatsApp(e.getJSON()));
		},
	});

	function handleCopy() {
		if (!whatsAppText) return;
		navigator.clipboard.writeText(whatsAppText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleClear() {
		editor?.commands.clearContent(true);
		setWhatsAppText("");
		setCopied(false);
	}

	const isEmpty = editor?.isEmpty ?? true;
	const canUndo = editor?.can().undo() ?? false;

	return (
		<div className="space-y-4">
			<FormattingToolbar editor={editor} />
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[4fr_3fr]">
				<div className="space-y-4">
					<RichEditor editor={editor} />
					<div className="flex flex-wrap gap-2">
						<Button size="sm" onClick={handleCopy} disabled={isEmpty}>
							<Copy />
							Copiar mensagem
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={handleClear}
							disabled={isEmpty}
						>
							<Trash2 />
							Remover texto
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => editor?.chain().focus().unsetAllMarks().run()}
							disabled={isEmpty}
						>
							<Eraser />
							Limpar estilos
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => editor?.chain().focus().undo().run()}
							disabled={!canUndo}
						>
							<Undo2 />
							Desfazer
						</Button>
					</div>
					{copied && <p className="text-sm text-success">Mensagem copiada!</p>}
				</div>
				<div className="space-y-2">
					<p className="text-sm font-medium text-foreground">
						Pré-visualização
					</p>
					<WhatsAppPreview text={whatsAppText} />
				</div>
			</div>
		</div>
	);
}
