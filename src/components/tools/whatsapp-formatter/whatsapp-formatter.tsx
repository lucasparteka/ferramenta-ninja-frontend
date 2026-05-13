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
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { ToolHeader } from "@/components/shared/tool-header";
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

	function handleClearStyle() {
		editor
			?.chain()
			.focus()
			.extendMarkRange("bold")
			.extendMarkRange("italic")
			.extendMarkRange("strike")
			.extendMarkRange("code")
			.unsetAllMarks()
			.run();
	}

	const isEmpty = editor?.isEmpty ?? true;
	const canUndo = editor?.can().undo() ?? false;
	const hasActiveStyle = !!(
		editor?.isActive("bold") ||
		editor?.isActive("italic") ||
		editor?.isActive("strike") ||
		editor?.isActive("code")
	);

	return (
		<LayoutD
			sidebarWidth={380}
			header={<ToolHeader title="Formatador WhatsApp" badge="FORMATAÇÃO" />}
			sidebar={
				<SidebarSection title="Pré-visualização">
					<WhatsAppPreview text={whatsAppText} />
					<div className="flex items-center gap-1.5 pt-1">
						<CopyButton
							text={whatsAppText}
							label="Copiar"
							variant="outline"
							size="sm"
							disabled={isEmpty}
							className="flex-1"
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
							aria-label="Limpar tudo"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</SidebarSection>
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
					onClick={handleClearStyle}
					disabled={!hasActiveStyle}
					aria-label="Remover estilo"
				>
					<Eraser className="h-3.5 w-3.5" />
					Remover estilo
				</Button>
			</div>

			<EditorContent
				editor={editor}
				className="flex-1 cursor-text [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-foreground [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
			/>

			<StatusBar
				items={[
					{ label: "", value: "Em tempo real", mono: false, variant: "success" },
					{ label: "", value: `${whatsAppText.length} caracteres`, mono: true },
				]}
			/>
		</LayoutD>
	);
}
