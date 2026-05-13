import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { FlexboxGenerator } from "@/components/tools/flexbox-generator/flexbox-generator";

export const metadata: Metadata = {
	title: "Gerador de Flexbox CSS Online Grátis | Ferramenta Ninja",
	description:
		"Experimente flex-direction, justify-content, align-items e outras propriedades do Flexbox com preview em tempo real e código CSS pronto para copiar.",
	keywords: [
		"flexbox css",
		"gerador de flexbox",
		"flexbox generator",
		"css flex",
		"justify content",
		"align items",
		"flex direction",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					O que é Flexbox?
				</h2>
				<p>
					Flexbox é um modelo de layout do CSS que permite distribuir elementos
					em uma única dimensão (linha ou coluna) com controle preciso sobre
					alinhamento, espaçamento e ordenação. É a base da maioria dos layouts
					modernos na web.
				</p>
				<p className="mt-3">
					Este gerador permite visualizar em tempo real como cada propriedade
					afeta o comportamento dos itens, eliminando a necessidade de adivinhar
					valores no código.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Como usar
				</h2>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						Escolha as propriedades do container à esquerda (direção, quebra,
						alinhamento).
					</li>
					<li>Observe o preview no centro atualizar em tempo real.</li>
					<li>
						Clique em um item do preview para ajustar suas propriedades
						individuais (grow, shrink, basis, order).
					</li>
					<li>Copie o código CSS gerado à direita.</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Propriedades suportadas
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Container:</strong>{" "}
						flex-direction, flex-wrap, justify-content, align-items,
						align-content, gap.
					</li>
					<li>
						<strong className="text-foreground">Itens:</strong> flex-grow,
						flex-shrink, flex-basis, align-self, order.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O código funciona em todos os navegadores?
						</h3>
						<p>
							Sim. As propriedades geradas seguem a especificação Flexbox nível
							1, compatível com todos os navegadores modernos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso adicionar mais itens ao preview?
						</h3>
						<p>
							Sim. Use os botões abaixo do preview para adicionar ou remover
							itens (máximo 8).
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function FlexboxGeneratorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-flexbox-css"
			title="Gerador de Flexbox CSS"
			description="Experimente flex-direction, justify-content, align-items e outras propriedades do Flexbox com preview em tempo real."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-flexbox-css" />
			}
			extraContent={<SeoContent />}
		>
			<FlexboxGenerator />
		</PageLayout>
	);
}
