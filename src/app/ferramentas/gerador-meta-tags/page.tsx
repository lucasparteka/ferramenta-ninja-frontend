import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { MetaTagGenerator } from "@/components/tools/meta-tag-generator/meta-tag-generator";

export const metadata: Metadata = {
	title: "Gerador de Meta Tags Online Grátis | Ferramenta Ninja",
	description:
		"Gere meta tags HTML otimizadas para SEO e redes sociais. Título, descrição, Open Graph, Twitter Cards e mais. Ferramenta gratuita e sem cadastro.",
};

const faq = [
	{
		question: "O que são meta tags?",
		answer:
			"Meta tags são trechos de código HTML dentro da tag <head> que fornecem informações sobre a página para navegadores e mecanismos de busca. Elas não aparecem visualmente na página, mas são essenciais para SEO e compartilhamento social.",
	},
	{
		question: "Qual a diferença entre meta tags comuns e Open Graph?",
		answer:
			"Meta tags comuns (description, keywords) são usadas por mecanismos de busca. Open Graph é um protocolo do Facebook usado para controlar como o conteúdo aparece quando compartilhado em redes sociais. Twitter Cards são similares, mas específicas para o X/Twitter.",
	},
	{
		question: "O código gerado funciona em qualquer site?",
		answer:
			"Sim. O código HTML gerado é padrão e funciona em qualquer página web. Basta copiar e colar dentro da tag <head> do seu documento HTML.",
	},
	{
		question: "Preciso preencher todos os campos?",
		answer:
			"Não. Apenas título e descrição são essenciais. Os outros campos são opcionais, mas recomendados para um SEO e compartilhamento social mais completo.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são meta tags?
				</h2>
				<p>
					Meta tags são elementos HTML que fornecem metadados sobre uma página
					web. Elas não são exibidas aos visitantes, mas são lidas por
					navegadores, mecanismos de busca e redes sociais para entender o
					conteúdo, formatar snippets e controlar a aparência do
					compartilhamento.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Meta tags incluídas
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Básicas:</strong> title,
							description, keywords, author, charset, viewport.
						</li>
						<li>
							<strong className="text-foreground">
								Open Graph (Facebook):
							</strong>{" "}
							og:title, og:description, og:url, og:image, og:type.
						</li>
						<li>
							<strong className="text-foreground">Twitter Cards:</strong>{" "}
							twitter:title, twitter:description, twitter:image, twitter:card.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar este gerador
				</h2>
				<div className="space-y-3">
					<p>
						Preencha os campos com as informações da sua página. A prévia mostra
						como o resultado aparecerá no Google e no Facebook. Quando estiver
						pronto, copie o código HTML e cole dentro da tag{" "}
						<code>&lt;head&gt;</code> do seu site.
					</p>
				</div>
			</section>
		</>
	);
}

export default function GeradorMetaTagsPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-meta-tags"
			title="Gerador de Meta Tags"
			description="Gere meta tags HTML otimizadas para SEO e redes sociais. Com preview do Google e Facebook. Rápido, gratuito e sem cadastro."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-meta-tags" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<MetaTagGenerator />
		</PageLayout>
	);
}
