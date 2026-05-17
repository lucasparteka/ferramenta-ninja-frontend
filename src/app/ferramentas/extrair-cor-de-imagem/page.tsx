import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ColorExtractor } from "@/components/tools/color-extract/color-extractor";

export const metadata: Metadata = {
	title: "Extrair Cores de Imagem Online Grátis | Ferramenta Ninja",
	description:
		"Extraia a paleta de cores dominante de qualquer imagem. Obtenha HEX, RGB e HSL copiáveis. Clique em qualquer ponto para capturar a cor exata. 100% no navegador.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é extração de cores de uma imagem?
				</h2>
				<p>
					Extrair cores de uma imagem significa identificar as cores mais
					representativas de uma fotografia ou ilustração e organizá-las em uma
					paleta. Essa técnica é amplamente usada em design gráfico, criação de
					identidades visuais e desenvolvimento de interfaces para garantir
					consistência visual.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o algoritmo de extração?
				</h2>
				<div className="space-y-3">
					<p>
						Nossa ferramenta utiliza o algoritmo <strong className="text-foreground">Median Cut</strong>, uma
						técnica de quantização de cores que divide o espaço de cores em
						grupos e retorna a cor média de cada grupo:
					</p>
					<ol className="list-decimal space-y-2 pl-6">
						<li>
							A imagem é carregada em um canvas e os pixels são amostrados.
						</li>
						<li>
							O espaço RGB é dividido recursivamente pelo canal com maior
							variação (vermelho, verde ou azul).
						</li>
						<li>
							Cada divisão resulta em um grupo de cores similares, e a média
							desse grupo forma uma cor da paleta final.
						</li>
					</ol>
					<p>
						O resultado é uma paleta equilibrada que representa bem as cores
						dominantes da imagem.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve extrair cores de uma imagem?
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Criar paletas de cores para projetos de design a partir de referências visuais</li>
					<li>Identificar as cores de uma marca a partir de um logotipo</li>
					<li>Desenvolver temas e esquemas de cores consistentes</li>
					<li>Capturar uma cor específica de uma foto para usar em CSS, Figma ou outras ferramentas</li>
					<li>Analisar a composição cromática de uma imagem</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A imagem é enviada para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece diretamente no seu navegador via
							Canvas API. Sua imagem nunca sai do seu dispositivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais formatos de imagem são suportados?
						</h3>
						<p>
							A ferramenta suporta os formatos mais comuns: PNG, JPG/JPEG e WebP.
							Imagens com transparência (canal alpha) também são aceitas — pixels
							transparentes são automaticamente ignorados na extração.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quantas cores posso extrair?
						</h3>
						<p>
							É possível extrair entre 3 e 12 cores por análise. Use o controle
							deslizante para ajustar a quantidade conforme sua necessidade.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como capturar a cor de um ponto específico da imagem?
						</h3>
						<p>
							Após carregar a imagem, clique em qualquer ponto do canvas central.
							A cor exata daquele pixel será exibida no painel direito em formato
							HEX, RGB e HSL.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ExtrairCorDeImagemPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/extrair-cor-de-imagem"
			title="Extrair Cores de Imagem"
			description="Extraia a paleta de cores dominante de qualquer imagem e capture cores de pontos específicos. HEX, RGB e HSL copiáveis, direto no navegador."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/extrair-cor-de-imagem" />
			}
			extraContent={<SeoContent />}
		>
			<ColorExtractor />
		</PageLayout>
	);
}
