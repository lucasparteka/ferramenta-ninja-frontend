import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { MarkdownToHtml } from "@/components/tools/markdown-to-html/markdown-to-html";

export const metadata: Metadata = {
	title: "Converter Markdown para HTML Online | Ferramenta Ninja",
	description:
		"Converta Markdown para HTML com preview em tempo real. Suporte a tabelas, listas, código e GitHub Flavored Markdown. Exporte ou copie o resultado.",
	keywords: [
		"markdown para html",
		"converter markdown",
		"markdown online",
		"gfm",
		"github flavored markdown",
		"preview markdown",
	],
};

const faq = [
	{
		question: "O que é Markdown?",
		answer:
			"Markdown é uma linguagem de marcação leve que permite formatar texto usando sintaxe simples. É amplamente usada em documentação, READMEs, blogs e plataformas como GitHub e Notion.",
	},
	{
		question: "O HTML gerado é seguro?",
		answer:
			"Sim. Todo o HTML passa por sanitização com DOMPurify antes de ser exibido ou exportado, removendo scripts e atributos potencialmente maliciosos.",
	},
	{
		question: "Quais recursos do Markdown são suportados?",
		answer:
			"Suportamos: títulos, negrito, itálico, tachado, listas ordenadas/não ordenadas, listas de tarefas, links, imagens, tabelas, blocos de código com syntax highlight básico, citações e linhas horizontais.",
	},
	{
		question: "Posso usar o HTML gerado em qualquer lugar?",
		answer:
			"Sim. O HTML exportado é puro e pode ser usado em emails, blogs, documentação ou qualquer lugar que aceite HTML. A opção 'Incluir CSS básico' adiciona estilos simples para melhor legibilidade.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como converter Markdown para HTML
				</h2>
				<p>
					Nosso conversor transforma sua sintaxe Markdown em HTML limpo e
					semântico em tempo real. Basta digitar ou colar seu texto no editor
					esquerdo e o preview à direita mostra o resultado instantaneamente.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Referência rápida de sintaxe
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-border">
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Elemento
								</th>
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Sintaxe Markdown
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Título</td>
								<td className="px-3 py-2 font-mono"># Título</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Negrito</td>
								<td className="px-3 py-2 font-mono">**texto**</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Itálico</td>
								<td className="px-3 py-2 font-mono">*texto*</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Tachado</td>
								<td className="px-3 py-2 font-mono">~~texto~~</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Link</td>
								<td className="px-3 py-2 font-mono">[texto](url)</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Imagem</td>
								<td className="px-3 py-2 font-mono">![alt](url)</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Lista</td>
								<td className="px-3 py-2 font-mono">- item</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Tarefa</td>
								<td className="px-3 py-2 font-mono">- [x] feito</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Código inline</td>
								<td className="px-3 py-2 font-mono">`código`</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Bloco de código</td>
								<td className="px-3 py-2 font-mono">```lang ... ```</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Tabela</td>
								<td className="px-3 py-2 font-mono">| a | b |</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Citação</td>
								<td className="px-3 py-2 font-mono">&gt; citação</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Linha horizontal</td>
								<td className="px-3 py-2 font-mono">---</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</>
	);
}

export default function MarkdownToHtmlPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-markdown-para-html"
			title="Converter Markdown para HTML"
			description="Transforme Markdown em HTML com preview ao vivo. Suporte completo a GitHub Flavored Markdown, tabelas, código e mais."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-markdown-para-html" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<MarkdownToHtml />
		</PageLayout>
	);
}
