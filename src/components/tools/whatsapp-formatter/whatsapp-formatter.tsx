"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Eraser,
	Italic,
	Strikethrough,
	Trash2,
	Undo2,
} from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutD } from "@/components/shared/layout-d";
import { Button } from "@/components/ui/button";
import { serializeToWhatsApp } from "@/lib/text/whatsapp-serializer";
import { WhatsAppPreview } from "./whatsapp-preview";

export function WhatsAppFormatter() {
	const [whatsAppText, setWhatsAppText] = useState("");
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

	function handleClear() {
		editor?.commands.clearContent(true);
		setWhatsAppText("");
	}

	const isEmpty = editor?.isEmpty ?? true;
	const canUndo = editor?.can().undo() ?? false;

	return (
		<LayoutD
			sidebarWidth={380}
			header={
				<>
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-semibold tracking-tight">
							Formatador WhatsApp
						</h1>
						<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
							FORMATAÇÃO
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<CopyButton
							text={whatsAppText}
							label="Copiar"
							variant="outline"
							size="sm"
							disabled={isEmpty}
						/>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => editor?.chain().focus().undo().run()}
							disabled={!canUndo}
							aria-label="Desfazer"
						>
							<Undo2 className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleClear}
							disabled={isEmpty}
							aria-label="Limpar"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</>
			}
			sidebar={
				<div className="p-4 space-y-3">
					<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
						Pré-visualização
					</h3>
					<WhatsAppPreview text={whatsAppText} />
				</div>
			}
		>
			{/* Toolbar de formatação */}
			<div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
				<Button
					variant={editor?.isActive("bold") ? "secondary" : "ghost"}
					size="sm"
					onClick={() => editor?.chain().focus().toggleBold().run()}
					aria-label="Negrito"
					aria-pressed={editor?.isActive("bold")}
				>
					<Bold className="h-3.5 w-3.5" />
					Negrito
				</Button>
				<Button
					variant={editor?.isActive("italic") ? "secondary" : "ghost"}
					size="sm"
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					aria-label="Itálico"
					aria-pressed={editor?.isActive("italic")}
				>
					<Italic className="h-3.5 w-3.5" />
					Itálico
				</Button>
				<Button
					variant={editor?.isActive("strike") ? "secondary" : "ghost"}
					size="sm"
					onClick={() => editor?.chain().focus().toggleStrike().run()}
					aria-label="Tachado"
					aria-pressed={editor?.isActive("strike")}
				>
					<Strikethrough className="h-3.5 w-3.5" />
					Tachado
				</Button>
				<Button
					variant={editor?.isActive("code") ? "secondary" : "ghost"}
					size="sm"
					onClick={() => editor?.chain().focus().toggleCode().run()}
					aria-label="Monoespaçado"
					aria-pressed={editor?.isActive("code")}
				>
					<Code className="h-3.5 w-3.5" />
					Mono
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="ml-auto"
					onClick={() => editor?.chain().focus().unsetAllMarks().run()}
					disabled={isEmpty}
					aria-label="Limpar estilos"
				>
					<Eraser className="h-3.5 w-3.5" />
					Limpar estilos
				</Button>
			</div>

			<EditorContent
				editor={editor}
				className="flex-1 cursor-text [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-foreground [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
			/>

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
				<span className="inline-flex items-center gap-1.5">
					<span className="h-1.5 w-1.5 rounded-full bg-green-600" />
					<span className="text-[11px] text-muted-foreground">
						Em tempo real
					</span>
				</span>
				<span className="font-mono text-[11px] text-muted-foreground">
					{whatsAppText.length} caracteres
				</span>
			</div>
		</LayoutD>
	);
}
