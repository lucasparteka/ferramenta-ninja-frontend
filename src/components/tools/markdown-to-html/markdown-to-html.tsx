"use client";

import DOMPurify from "dompurify";
import { Download, Trash2 } from "lucide-react";
import { marked } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { SwitchRow } from "@/components/shared/switch-row";
import { Button } from "@/components/ui/button";

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

function SanitizedHtml({
	html,
	className,
}: {
	html: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) ref.current.innerHTML = html;
	}, [html]);
	return <div ref={ref} className={className} />;
}

export function MarkdownToHtml() {
	const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
	const [includeCss, setIncludeCss] = useState(true);

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
		<>
			<LayoutC
				left={
					<>
						<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Markdown
							</span>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setMarkdown("")}
								disabled={!markdown}
								aria-label="Limpar"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>

						<textarea
							value={markdown}
							onChange={(e) => setMarkdown(e.target.value)}
							placeholder="Digite seu Markdown aqui..."
							className="flex-1 min-h-[400px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
							spellCheck={false}
						/>
					</>
				}
				right={
					<>
						<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Preview HTML
							</span>
							<CopyButton
								text={fullHtml}
								disabled={!html}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						</div>

						<div className="flex-1 min-h-[400px] overflow-auto bg-card p-4">
							{html ? (
								<SanitizedHtml html={html} className="markdown-preview" />
							) : (
								<p className="text-sm text-muted-foreground">
									O preview aparecerá aqui...
								</p>
							)}
						</div>
					</>
				}
				footer={
					<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
						<span className="inline-flex items-center gap-1.5">
							<span
								className={`h-1.5 w-1.5 rounded-full ${html ? "bg-green-600" : "bg-foreground/30"}`}
							/>
							<span className="text-[11px] text-muted-foreground">
								{html ? "Renderizado" : "Aguardando"}
							</span>
						</span>
						<div className="flex items-center gap-2">
							<SwitchRow
								label="CSS no download"
								checked={includeCss}
								onChange={(v) => setIncludeCss(v)}
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleDownload}
								disabled={!html}
								className="h-6 gap-1 px-2 text-[11px]"
							>
								<Download className="h-3 w-3" />
								Baixar HTML
							</Button>
						</div>
					</div>
				}
			/>

			<style>{`
				.markdown-preview h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: inherit; }
				.markdown-preview h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: inherit; }
				.markdown-preview h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; color: inherit; }
				.markdown-preview h4 { font-size: 1.125rem; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; color: inherit; }
				.markdown-preview p { margin-bottom: 0.75em; line-height: 1.6; }
				.markdown-preview strong { font-weight: 700; }
				.markdown-preview em { font-style: italic; }
				.markdown-preview del { text-decoration: line-through; }
				.markdown-preview a { color: var(--color-primary); text-decoration: underline; }
				.markdown-preview ul, .markdown-preview ol { padding-left: 1.5em; margin-bottom: 0.75em; }
				.markdown-preview li { margin-bottom: 0.25em; }
				.markdown-preview input[type="checkbox"] { margin-right: 0.5em; }
				.markdown-preview table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.875rem; }
				.markdown-preview th, .markdown-preview td { border: 1px solid var(--color-border); padding: 0.5em 0.75em; text-align: left; }
				.markdown-preview th { background-color: var(--color-muted); font-weight: 600; }
				.markdown-preview tr:nth-child(even) { background-color: color-mix(in oklab, var(--color-muted) 50%, transparent); }
				.markdown-preview code { background-color: var(--color-muted); padding: 0.15em 0.35em; border-radius: 4px; font-size: 0.875em; font-family: ui-monospace, monospace; }
				.markdown-preview pre { background-color: var(--color-code-bg); color: var(--color-code-text); padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
				.markdown-preview pre code { background-color: transparent; color: inherit; padding: 0; }
				.markdown-preview blockquote { border-left: 4px solid var(--color-border); margin: 1em 0; padding-left: 1em; color: var(--color-muted-foreground); font-style: italic; }
				.markdown-preview hr { border: none; border-top: 1px solid var(--color-border); margin: 1.5em 0; }
			`}</style>
		</>
	);
}
