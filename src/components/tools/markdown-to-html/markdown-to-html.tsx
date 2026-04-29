"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

 const SAMPLE_MARKDOWN = `# Título Principal

Este é um parágrafo com **negrito**, *itálico* e ~~tachado~~.

## Subtítulo

- [x] Tarefa concluída
- [ ] Tarefa pendente

### Tabela de Exemplo

| Nome | Idade | Cidade |
|------|-------|--------|
| Ana  | 25    | São Paulo |
| João | 30    | Rio de Janeiro |

## Código

\`\`\`typescript
function hello(name: string): string {
  return \`Olá, \${name}!\`;
}
\`\`\`

> "O conhecimento é a única coisa que não pesa."

[Visite o Ferramenta Ninja](https://ferramenta.ninja)
`;

 const BASIC_CSS = `<style>
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1f2937; }
  h1, h2, h3, h4 { color: #111827; margin-top: 1.5em; margin-bottom: 0.5em; }
  code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f3f4f6; padding: 1em; border-radius: 8px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #e5e7eb; margin: 0; padding-left: 1em; color: #4b5563; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #e5e7eb; padding: 0.5em; text-align: left; }
  th { background: #f9fafb; }
  ul, ol { padding-left: 1.5em; }
  a { color: #7c3aed; }
</style>`;

 function SanitizedHtml({ html, className }: { html: string; className?: string }) {
	 const ref = useRef<HTMLDivElement>(null);
	 useEffect(() => {
		 if (ref.current) {
			 ref.current.innerHTML = html;
		 }
	 }, [html]);
	 return <div ref={ref} className={className} />;
 }

 export function MarkdownToHtml() {
	 const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
	 const [includeCss, setIncludeCss] = useState(true);
	 const [copied, setCopied] = useState(false);

	 const html = useMemo(() => {
		 if (!markdown.trim()) return "";
		 const raw = marked.parse(markdown, {
			 async: false,
			 gfm: true,
			 breaks: true,
		 });
		 return DOMPurify.sanitize(raw as string);
	 }, [markdown]);

	 const fullHtml = useMemo(() => {
		 const css = includeCss ? BASIC_CSS : "";
		 return `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Documento Markdown</title>\n${css}\n</head>\n<body>\n${html}\n</body>\n</html>`;
	 }, [html, includeCss]);

	 async function handleCopy() {
		 try {
			 await navigator.clipboard.writeText(fullHtml);
			 setCopied(true);
			 setTimeout(() => setCopied(false), 2000);
		 } catch {
			 // fallback
		 }
	 }

	 function handleDownload() {
		 const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
		 const url = URL.createObjectURL(blob);
		 const a = document.createElement("a");
		 a.href = url;
		 a.download = "documento.html";
		 document.body.appendChild(a);
		 a.click();
		 document.body.removeChild(a);
		 URL.revokeObjectURL(url);
	 }

	 return (
		 <div className="space-y-4">
			 {/* Split screen */}
			 <div className="grid gap-4 lg:grid-cols-2">
				 {/* Editor */}
				 <div className="space-y-2">
					 <div className="flex items-center justify-between">
						 <label
							 htmlFor="md-input"
							 className="text-sm font-medium text-foreground"
						 >
							 Markdown
						 </label>
						 <button
							 type="button"
							 onClick={() => setMarkdown("")}
							 className="text-xs text-muted-foreground hover:text-foreground"
						 >
							 Limpar
						 </button>
					 </div>
					 <Textarea
						 id="md-input"
						 value={markdown}
						 onChange={(e) => setMarkdown(e.target.value)}
						 placeholder="Digite seu Markdown aqui..."
						 className="min-h-[400px] font-mono text-sm"
					 />
				 </div>

				 {/* Preview */}
				 <div className="space-y-2">
					 <span className="block text-sm font-medium text-foreground">
						 Preview
					 </span>
					 <div className="min-h-[400px] max-h-[600px] overflow-auto rounded-lg border border-border bg-card p-4">
						 {html ? (
							 <SanitizedHtml
								 html={html}
								 className="markdown-preview"
							 />
						 ) : (
							 <p className="text-sm text-muted-foreground">
								 O preview aparecerá aqui...
							 </p>
						 )}
					 </div>
				 </div>
			 </div>

			 {/* Toolbar below preview */}
			 <div className="flex flex-wrap items-center gap-3">
				 <Button variant="outline" size="sm" onClick={handleCopy}>
					 {copied ? "Copiado!" : "Copiar HTML"}
				 </Button>
				 <Button variant="outline" size="sm" onClick={handleDownload}>
					 Baixar HTML
				 </Button>
				 <div className="flex items-center gap-2">
					 <input
						 id="md-css"
						 type="checkbox"
						 checked={includeCss}
						 onChange={(e) => setIncludeCss(e.target.checked)}
						 className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
					 />
					 <label htmlFor="md-css" className="text-sm text-foreground">
						 Incluir CSS básico no download
					 </label>
				 </div>
			 </div>

			 {/* Scoped CSS for markdown preview */}
			 <style>{`
				 .markdown-preview h1 {
					 font-size: 1.875rem;
					 font-weight: 700;
					 margin-top: 1.5em;
					 margin-bottom: 0.5em;
					 color: inherit;
				 }
				 .markdown-preview h2 {
					 font-size: 1.5rem;
					 font-weight: 700;
					 margin-top: 1.5em;
					 margin-bottom: 0.5em;
					 color: inherit;
				 }
				 .markdown-preview h3 {
					 font-size: 1.25rem;
					 font-weight: 600;
					 margin-top: 1.5em;
					 margin-bottom: 0.5em;
					 color: inherit;
				 }
				 .markdown-preview h4 {
					 font-size: 1.125rem;
					 font-weight: 600;
					 margin-top: 1.5em;
					 margin-bottom: 0.5em;
					 color: inherit;
				 }
				 .markdown-preview p {
					 margin-bottom: 0.75em;
					 line-height: 1.6;
				 }
				 .markdown-preview strong {
					 font-weight: 700;
				 }
				 .markdown-preview em {
					 font-style: italic;
				 }
				 .markdown-preview del {
					 text-decoration: line-through;
				 }
				 .markdown-preview a {
					 color: rgb(var(--primary));
					 text-decoration: underline;
				 }
				 .markdown-preview ul,
				 .markdown-preview ol {
					 padding-left: 1.5em;
					 margin-bottom: 0.75em;
				 }
				 .markdown-preview li {
					 margin-bottom: 0.25em;
				 }
				 .markdown-preview input[type="checkbox"] {
					 margin-right: 0.5em;
				 }
				 .markdown-preview table {
					 border-collapse: collapse;
					 width: 100%;
					 margin: 1em 0;
					 font-size: 0.875rem;
				 }
				 .markdown-preview th,
				 .markdown-preview td {
					 border: 1px solid rgb(var(--border));
					 padding: 0.5em 0.75em;
					 text-align: left;
				 }
				 .markdown-preview th {
					 background-color: rgb(var(--muted));
					 font-weight: 600;
				 }
				 .markdown-preview tr:nth-child(even) {
					 background-color: rgba(var(--muted), 0.5);
				 }
				 .markdown-preview code {
					 background-color: rgb(var(--muted));
					 padding: 0.15em 0.35em;
					 border-radius: 4px;
					 font-size: 0.875em;
					 font-family: ui-monospace, monospace;
				 }
				 .markdown-preview pre {
					 background-color: var(--color-code-bg);
					 color: var(--color-code-text);
					 padding: 1em;
					 border-radius: 8px;
					 overflow-x: auto;
					 margin: 1em 0;
				 }
				 .markdown-preview pre code {
					 background-color: transparent;
					 color: inherit;
					 padding: 0;
				 }
				 .markdown-preview blockquote {
					 border-left: 4px solid rgb(var(--border));
					 margin: 1em 0;
					 padding-left: 1em;
					 color: rgb(var(--muted-foreground));
					 font-style: italic;
				 }
				 .markdown-preview hr {
					 border: none;
					 border-top: 1px solid rgb(var(--border));
					 margin: 1.5em 0;
				 }
			 `}</style>
		 </div>
	 );
 }
