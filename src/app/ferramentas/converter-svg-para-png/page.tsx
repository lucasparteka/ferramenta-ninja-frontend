import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { SvgToPngConverter } from "@/components/tools/svg-to-png/svg-to-png";

export const metadata: Metadata = {
	title: "Converter SVG para PNG Online Grátis | Ferramenta Ninja",
	description:
		"Converta arquivos SVG em PNG online e gratuito. Escolha o tamanho, cor de fundo e baixe o resultado. Processamento local — seus arquivos não são enviados a servidores.",
};

const faq = [
	{
		question: "Como converter SVG para PNG?",
		answer:
			"Basta enviar seu arquivo SVG ou colar o código SVG na área de texto. Ajuste as dimensões e a cor de fundo desejadas e clique em 'Baixar PNG'. Todo o processamento é feito no seu navegador.",
	},
	{
		question: "O arquivo SVG é enviado para algum servidor?",
		answer:
			"Não. Todo o processamento acontece localmente no seu navegador usando a API Canvas. Nenhum dado é transmitido ou armazenado em servidores externos.",
	},
	{
		question: "Quais dimensões posso usar na conversão?",
		answer:
			"Você pode manter as dimensões originais do SVG ou definir largura e altura personalizadas. A trava de proporção mantém a relação original ao alterar apenas uma dimensão. O tamanho máximo depende da memória disponível no seu dispositivo.",
	},
	{
		question: "SVGs com foreignObject são suportados?",
		answer:
			"Elementos foreignObject dentro de SVG têm suporte limitado em navegadores quando renderizados via canvas. Para SVG simples (formas, paths, texto), a conversão funciona perfeitamente. SVG com HTML incorporado pode não renderizar corretamente.",
	},
	{
		question: "Qual a diferença entre SVG e PNG?",
		answer:
			"SVG é um formato vetorial que mantém a qualidade em qualquer tamanho, ideal para ícones e ilustrações. PNG é um formato raster com fundo transparente, compatível com todos os softwares e sites. A conversão para PNG é útil quando você precisa de um arquivo de imagem padrão.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">O que é SVG?</h2>
				<div className="space-y-3">
					<p>
						SVG (Scalable Vector Graphics) é um formato de imagem vetorial
						baseado em XML. Diferente de formatos raster como PNG e JPEG, o SVG
						armazena a imagem como instruções matemáticas — linhas, curvas e
						formas geométricas — em vez de pixels.
					</p>
					<p>
						Isso significa que arquivos SVG podem ser redimensionados para
						qualquer tamanho sem perder qualidade, tornando-os ideais para
						ícones, logotipos, ilustrações e gráficos responsivos.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que converter SVG para PNG?
				</h2>
				<div className="space-y-3">
					<p>
						Embora o SVG seja excelente para design vetorial, muitos sistemas e
						plataformas exigem imagens no formato PNG. Sites de redes sociais,
						sistemas de gerenciamento de conteúdo, editores de documentos e
						aplicativos geralmente aceitam apenas PNG, JPEG ou WebP.
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Compatibilidade:</strong> PNG
							é suportado em absolutamente todos os navegadores e softwares.
						</li>
						<li>
							<strong className="text-foreground">Tamanho previsível:</strong>{" "}
							ao converter, você define exatamente as dimensões em pixels do
							resultado.
						</li>
						<li>
							<strong className="text-foreground">Fundo personalizado:</strong>{" "}
							SVGs podem ter fundo transparente; ao converter, você escolhe a
							cor de fundo que fará parte da imagem PNG final.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o conversor de SVG para PNG
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Selecione o SVG:</strong>{" "}
						arraste um arquivo SVG para a área de upload ou clique para
						selecionar. Você também pode colar o código SVG diretamente na aba
						"Código".
					</p>
					<p>
						<strong className="text-foreground">2. Ajuste as dimensões:</strong>{" "}
						as dimensões originais são detectadas automaticamente. Use os campos
						de largura e altura para redimensionar se necessário.
					</p>
					<p>
						<strong className="text-foreground">
							3. Escolha a cor de fundo:
						</strong>{" "}
						selecione entre transparente, branco, preto ou outras cores
						disponíveis.
					</p>
					<p>
						<strong className="text-foreground">4. Baixe o PNG:</strong> clique
						em "Baixar PNG" para salvar a imagem convertida no seu dispositivo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Design de interfaces:</strong>{" "}
						converta ícones SVG para PNG para usar em protótipos, apresentações
						e documentos de design.
					</p>
					<p>
						<strong className="text-foreground">Desenvolvimento web:</strong>{" "}
						prepare imagens para sites que não suportam SVG diretamente ou
						precisam de fallback para navegadores antigos.
					</p>
					<p>
						<strong className="text-foreground">
							Documentos e relatórios:
						</strong>{" "}
						insira ilustrações vetoriais em documentos que aceitam apenas
						imagens raster, como editores de texto e planilhas.
					</p>
				</div>
			</section>
		</>
	);
}

export default function ConverterSvgParaPngPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-svg-para-png"
			title="Converter SVG para PNG"
			description="Converta seus arquivos SVG em PNG com dimensões personalizadas e cor de fundo. Processamento rápido e 100% no navegador."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-svg-para-png" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<SvgToPngConverter />
		</PageLayout>
	);
}
