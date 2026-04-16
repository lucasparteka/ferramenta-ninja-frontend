import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextDiff } from "@/components/tools/text-diff/text-diff";

export const metadata: Metadata = {
	title: "Comparador de Textos Online Grátis | Ferramenta Ninja",
	description:
		"Compare dois textos e visualize as diferenças com destaque por cores. Encontre adições, remoções e trechos iguais de forma rápida e gratuita, sem cadastro.",
	keywords: [
		"comparar textos",
		"diff de texto",
		"diferença entre textos",
		"comparador de texto online",
		"encontrar diferenças",
		"text diff",
		"text compare",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um comparador de textos?
				</h2>
				<p>
					Um <strong className="text-foreground">comparador de textos</strong> é
					uma ferramenta que identifica automaticamente as diferenças entre dois
					trechos de texto. Ele destaca o que foi{" "}
					<strong className="text-foreground">adicionado</strong>,{" "}
					<strong className="text-foreground">removido</strong> ou permaneceu{" "}
					<strong className="text-foreground">inalterado</strong> entre as duas
					versões, facilitando a revisão de alterações sem precisar comparar
					linha por linha manualmente.
				</p>
				<p className="mt-3">
					A ferramenta utiliza o algoritmo{" "}
					<strong className="text-foreground">diff-match-patch</strong>,
					desenvolvido pelo Google, que oferece comparações precisas tanto no
					nível de caracteres quanto no nível de palavras.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o comparador
				</h2>
				<ol className="list-decimal space-y-3 pl-6">
					<li>
						<strong className="text-foreground">
							Cole ou carregue o texto original
						</strong>{" "}
						no campo da esquerda. Você pode digitar diretamente ou clicar em
						"Carregar arquivo" para usar um arquivo <code>.txt</code> ou{" "}
						<code>.json</code>.
					</li>
					<li>
						<strong className="text-foreground">
							Cole ou carregue o texto modificado
						</strong>{" "}
						no campo da direita da mesma forma.
					</li>
					<li>
						Ajuste as <strong className="text-foreground">opções</strong>{" "}
						conforme necessário: ignorar maiúsculas, espaços ou visualizar
						apenas as diferenças.
					</li>
					<li>
						Clique em{" "}
						<strong className="text-foreground">Comparar textos</strong> para
						visualizar o resultado com destaque por cores.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Exemplos de uso
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Revisão de documentos:</strong>{" "}
						compare duas versões de um contrato, relatório ou artigo para
						identificar exatamente o que mudou entre as revisões.
					</p>
					<p>
						<strong className="text-foreground">Revisão de código:</strong>{" "}
						verifique diferenças em trechos de código antes de aplicar
						alterações, sem depender de ferramentas de controle de versão.
					</p>
					<p>
						<strong className="text-foreground">
							Conferência de traduções:
						</strong>{" "}
						compare a versão original com a tradução para garantir que nenhum
						trecho foi omitido ou alterado indevidamente.
					</p>
					<p>
						<strong className="text-foreground">Detecção de plágio:</strong>{" "}
						compare dois textos para identificar similaridades e diferenças de
						conteúdo de forma rápida.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus textos são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece diretamente no seu navegador.
							Os textos nunca saem do seu dispositivo, garantindo total
							privacidade.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa "diff por palavras"?
						</h3>
						<p>
							Por padrão, a comparação é feita caractere por caractere. Ao
							ativar o{" "}
							<strong className="text-foreground">diff por palavras</strong>, a
							ferramenta compara palavra por palavra, o que pode tornar o
							resultado mais legível em textos longos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Para que serve a opção "Ignorar maiúsculas/minúsculas"?
						</h3>
						<p>
							Quando ativada, diferenças de capitalização como "Texto" e "texto"
							são tratadas como iguais. Útil quando você quer focar apenas em
							mudanças de conteúdo, ignorando variações de formatação.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que faz a opção "Ignorar espaços em branco"?
						</h3>
						<p>
							Normaliza os espaços antes de comparar, tratando múltiplos espaços
							consecutivos como um único espaço. Ideal para comparar textos que
							podem ter espaçamentos diferentes.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar a ferramenta em arquivos grandes?
						</h3>
						<p>
							Sim. A ferramenta suporta textos de qualquer tamanho, mas para
							arquivos muito grandes o processamento pode levar alguns segundos.
							Todo o cálculo é feito no seu dispositivo, sem limite de tamanho
							imposto pelo servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os textos são salvos se eu fechar a página?
						</h3>
						<p>
							Sim. Os textos inseridos são automaticamente salvos no
							armazenamento local do navegador e restaurados quando você reabrir
							a página. O resultado da comparação, porém, precisa ser
							recalculado.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ComparadorDeTextosPage() {
	return (
		<PageLayout
			title="Comparador de Textos Online"
			description="Cole dois textos, clique em comparar e visualize as diferenças com destaque por cores. Adições em verde, remoções em vermelho."
			relatedTools={<RelatedTools currentHref="/ferramentas/comparar-textos" />}
			extraContent={<SeoContent />}
		>
			<TextDiff />
		</PageLayout>
	);
}
