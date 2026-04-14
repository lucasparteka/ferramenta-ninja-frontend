import { type Editor, EditorContent } from "@tiptap/react";

type RichEditorProps = {
	editor: Editor | null;
};

export function RichEditor({ editor }: RichEditorProps) {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-foreground">
				Digite ou cole seu texto
			</label>
			<div className="min-h-[200px] w-full cursor-text rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-ring">
				<EditorContent
					editor={editor}
					className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-foreground [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
				/>
			</div>
		</div>
	);
}
