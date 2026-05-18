import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CssGridGenerator } from "@/components/tools/css-grid-generator/css-grid-generator";

export const metadata: Metadata = {
	title: "Gerador de CSS Grid Online Grátis | Ferramenta Ninja",
	description:
		"Crie layouts CSS Grid visualmente. Configure colunas, linhas e gaps com preview em tempo real. Copie o código CSS gerado instantaneamente, sem login.",
	keywords: [
		"css grid generator",
		"gerador css grid",
		"grid layout css",
		"css grid online",
		"grid template columns",
		"ferramentas frontend",
		"css grid brasil",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					O que é CSS Grid?
				</h2>
				<p>
					CSS Grid é um sistema de layout bidimensional que permite organizar
					elementos em colunas e linhas simultaneamente. É a ferramenta ideal para
					criar layouts complexos de página como headers, sidebars, grids de
					produtos e estruturas editoriais.
				</p>
				<p className="mt-3">
					Diferente do Flexbox, que opera em uma única dimensão, o CSS Grid
					controla tanto o eixo horizontal quanto o vertical ao mesmo tempo, dando
					total controle sobre o posicionamento dos elementos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Como usar o gerador
				</h2>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						Configure as colunas no painel esquerdo: defina quantas colunas e o
						tamanho de cada uma usando as unidades <code className="font-mono text-sm">fr</code>,{" "}
						<code className="font-mono text-sm">px</code>,{" "}
						<code className="font-mono text-sm">%</code> ou{" "}
						<code className="font-mono text-sm">auto</code>.
					</li>
					<li>Configure as linhas da mesma forma que as colunas.</li>
					<li>
						Ajuste o gap (espaço entre células) com o controle de slider.
					</li>
					<li>Visualize o resultado no preview central em tempo real.</li>
					<li>Use os presets para aplicar layouts prontos como "Sidebar + Main" e "12 colunas".</li>
					<li>Copie o código CSS gerado no painel direito.</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Qual a diferença entre CSS Grid e Flexbox?
				</h2>
				<p>
					Use <strong className="text-foreground">CSS Grid</strong> quando precisar
					controlar o layout em duas dimensões (linhas E colunas), como em
					layouts de página completos, galerias de imagens e grids de cards.
				</p>
				<p className="mt-3">
					Use <strong className="text-foreground">Flexbox</strong> para layouts
					unidimensionais — uma linha de botões, uma lista de itens, uma barra de
					navegação. As duas tecnologias se complementam e podem ser usadas juntas.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa a unidade fr?
						</h3>
						<p>
							<code className="font-mono text-sm">fr</code> (fraction unit) representa
							uma fração do espaço disponível. Por exemplo,{" "}
							<code className="font-mono text-sm">1fr 2fr 1fr</code> divide o espaço
							em quatro partes iguais e distribui 1, 2 e 1 parte para cada coluna
							respectivamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como usar minmax() no gerador?
						</h3>
						<p>
							Clique no campo de valor de uma coluna ou linha e digite manualmente o
							valor desejado, por exemplo:{" "}
							<code className="font-mono text-sm">minmax(200px, 1fr)</code>. O gerador
							aceita qualquer valor CSS válido para{" "}
							<code className="font-mono text-sm">grid-template-columns</code>.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O código gerado funciona em todos os navegadores?
						</h3>
						<p>
							Sim. CSS Grid tem suporte nativo em todos os navegadores modernos
							(Chrome, Firefox, Safari, Edge) desde 2017. Para compatibilidade com
							navegadores muito antigos, pode ser necessário adicionar prefixos
							de fornecedor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CssGridGeneratorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-css-grid"
			title="Gerador de CSS Grid"
			description="Configure colunas, linhas e gaps visualmente e copie o código CSS pronto para usar."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-css-grid" />
			}
			extraContent={<SeoContent />}
		>
			<CssGridGenerator />
		</PageLayout>
	);
}
