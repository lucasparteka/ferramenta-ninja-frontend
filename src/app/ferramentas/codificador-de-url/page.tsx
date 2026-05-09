import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { URLEncoder } from "@/components/tools/url-encoder/url-encoder";

export const metadata: Metadata = {
	title: "Codificador de URL Online Grátis | Ferramenta Ninja",
	description:
		"Codifique e decodifique URLs online. Suporte a parâmetros, caracteres especiais, emojis e acentos. Ferramenta 100% gratuita.",
};

const faq = [
	{
		question: "O que é codificação de URL?",
		answer:
			"A codificação de URL converte caracteres especiais, acentos, espaços e emojis em uma sequência segura de caracteres ASCII usando o formato percent-encoding (ex: espaço vira %20, ç vira %C3%A7). Isso garante que a URL seja interpretada corretamente por navegadores e servidores.",
	},
	{
		question: "Qual a diferença entre os modos de codificação?",
		answer:
			"O modo Parâmetro codifica tudo, incluindo os sinais estruturais da URL como ://, /, ?, & e =. Use para valores de formulários, query strings e qualquer texto que será inserido dentro de uma URL. O modo URL Completa preserva a estrutura da URL e codifica apenas acentos, espaços e emojis — ideal para codificar uma URL já formada sem quebrar sua estrutura.",
	},
	{
		question: "Quando devo usar o modo Parâmetro?",
		answer:
			"Use o modo Parâmetro quando precisar codificar um valor que será inserido em uma URL, como parâmetros de query string (?nome=João), valores de formulários ou qualquer texto que pode conter caracteres especiais. Ele garante que caracteres como /, ?, & e = não quebrem a estrutura da URL.",
	},
	{
		question: "Posso codificar uma URL inteira?",
		answer:
			"Sim! Para codificar uma URL completa (ex: https://exemplo.com/caminho?param=valor), use o modo URL Completa. Ele preserva os caracteres estruturais (:, /, ?, &, =) e codifica apenas os caracteres que precisam de escape, como espaços, acentos e emojis.",
	},
	{
		question: "É seguro decodificar URLs?",
		answer:
			"Sim, decodificar uma URL é totalmente seguro. O processo apenas reverte os códigos percentuais (%XX) de volta aos caracteres originais. Não há risco de execução de código ou vazamento de dados.",
	},
];

function SeoContent() {
	return (
		<section className="mt-12 space-y-8">
			<h2 className="text-2xl font-bold text-foreground">
				Como usar o Codificador de URL
			</h2>
			<p className="text-muted-foreground">
				Esta ferramenta permite codificar e decodificar URLs de forma rápida e
				segura. Escolha entre codificar (converter caracteres especiais) ou
				decodificar (reverter para o texto original). No modo de codificação,
				você pode escolher entre o modo <strong>Parâmetro</strong> (para valores
				e partes de URL) ou <strong>URL Completa</strong> (para codificar uma
				URL já formada).
			</p>

			<h2 className="text-2xl font-bold text-foreground">
				Quando usar URL Encode
			</h2>
			<p className="text-muted-foreground">
				A codificação de URL é essencial quando você precisa transmitir
				caracteres especiais através de uma URL. Use-a para: query strings com
				espaços ou acentos, parâmetros de API, compartilhamento de links em
				redes sociais, integração com sistemas legados e qualquer cenário onde
				navegadores ou servidores possam interpretar mal caracteres especiais.
			</p>

			<h2 className="text-2xl font-bold text-foreground">
				Diferença entre os modos de codificação
			</h2>
			<p className="text-muted-foreground">
				O modo <strong>Parâmetro</strong> é o mais comum e codifica todos os
				caracteres, incluindo os estruturais, tornando-o ideal para valores de
				parâmetros. O modo <strong>URL Completa</strong> preserva a estrutura da
				URL, sendo indicado quando você tem uma URL pronta e quer apenas
				garantir que acentos, espaços e emojis sejam seguros.
			</p>
		</section>
	);
}

export default function CodificadorURLPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/codificador-de-url"
			title="Codificador de URL Online Grátis"
			description="Codifique e decodifique URLs online. Suporte a parâmetros, caracteres especiais, emojis e acentos."
			faq={faq}
			relatedTools={
				<RelatedTools currentHref="/ferramentas/codificador-de-url" />
			}
			extraContent={<SeoContent />}
		>
			<URLEncoder />
		</PageLayout>
	);
}
