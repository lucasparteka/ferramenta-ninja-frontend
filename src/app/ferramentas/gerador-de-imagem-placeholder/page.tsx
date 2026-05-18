import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { PlaceholderGenerator } from "@/components/tools/placeholder-generator/placeholder-generator";

export const metadata: Metadata = {
	title: "Gerador de Imagem Placeholder Online Grátis | Ferramenta Ninja",
	description:
		"Crie imagens de placeholder com tamanho, cor e texto personalizados. Ideal para desenvolvimento de layouts e protótipos. Processamento 100% no navegador.",
	keywords: [
		"gerador de imagem placeholder",
		"imagem de placeholder",
		"placeholder image",
		"imagem temporária",
		"mock image",
		"placeholder png",
	],
};

const faq = [
	{
		question: "O que é uma imagem placeholder?",
		answer:
			"É uma imagem temporária usada durante o desenvolvimento de layouts. Em vez de usar uma imagem real, você gera um retângulo colorido com as dimensões exatas que o layout precisa, facilitando a visualização do design antes do conteúdo final estar disponível.",
	},
	{
		question: "Os arquivos são enviados para algum servidor?",
		answer:
			"Não. Toda a geração acontece localmente no seu navegador usando a API Canvas. Nenhum dado é transmitido ou armazenado em servidores externos.",
	},
	{
		question: "Qual o tamanho máximo que posso gerar?",
		answer:
			"A ferramenta aceita até 5000 × 5000 pixels. Imagens muito grandes (acima de 3000px em qualquer dimensão) podem demorar um pouco mais para renderizar dependendo da memória disponível no seu dispositivo.",
	},
	{
		question: "O que é o Data URI?",
		answer:
			"Data URI é uma representação da imagem diretamente em texto, no formato data:image/png;base64,... Você pode usá-lo como valor do atributo src de uma tag <img> em HTML, sem precisar hospedar o arquivo.",
	},
	{
		question: "Para que servem os presets?",
		answer:
			"Os presets são tamanhos padronizados para as situações mais comuns: banners de blog (1200×630), posts do Twitter/X, Instagram quadrado, thumbnail do YouTube, banner de site e card. Selecionar um preset ajusta as dimensões automaticamente.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é uma imagem placeholder?
				</h2>
				<div className="space-y-3">
					<p>
						Durante o desenvolvimento de sites, aplicações e protótipos, é
						comum precisar de imagens nos layouts antes que o conteúdo real
						esteja disponível. As imagens placeholder resolvem esse problema:
						são retângulos coloridos com as dimensões exatas que o layout
						precisa, frequentemente com o tamanho impresso no centro
						(ex: "1200 × 630").
					</p>
					<p>
						Com o Gerador de Imagem Placeholder da Ferramenta Ninja você cria
						essas imagens de forma rápida, personaliza cores e texto, e faz o
						download como PNG — tudo sem sair do navegador.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Quando usar imagens placeholder
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Protótipos e wireframes:</strong>{" "}
							preencha áreas de imagem durante a fase de design sem precisar de
							fotos reais.
						</li>
						<li>
							<strong className="text-foreground">Desenvolvimento de layouts:</strong>{" "}
							teste responsividade e proporções com imagens do tamanho certo.
						</li>
						<li>
							<strong className="text-foreground">Apresentações para clientes:</strong>{" "}
							monte apresentações de layout antes das fotos aprovadas chegarem.
						</li>
						<li>
							<strong className="text-foreground">Testes e mock data:</strong>{" "}
							popule listas, cards e grids com imagens consistentes para testes
							automatizados.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o gerador
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Escolha o tamanho:</strong>{" "}
						selecione um preset (Blog Banner, Instagram, YouTube Thumb etc.) ou
						insira largura e altura manualmente.
					</p>
					<p>
						<strong className="text-foreground">2. Personalize as cores:</strong>{" "}
						use os color pickers para definir a cor de fundo e a cor do texto.
					</p>
					<p>
						<strong className="text-foreground">3. Adicione texto (opcional):</strong>{" "}
						por padrão, as dimensões são exibidas no centro. Você pode substituir
						por qualquer texto, como o nome da seção ou um label descritivo.
					</p>
					<p>
						<strong className="text-foreground">4. Escolha o padrão de fundo:</strong>{" "}
						além da cor sólida, você pode adicionar grade, pontos ou listras ao
						fundo para dar mais textura visual ao placeholder.
					</p>
					<p>
						<strong className="text-foreground">5. Baixe ou copie:</strong>{" "}
						clique em "Baixar PNG" para salvar o arquivo, ou copie o Data URI
						para usar diretamente no HTML.
					</p>
				</div>
			</section>
		</>
	);
}

export default function GeradorDePlaceholderPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-imagem-placeholder"
			title="Gerador de Imagem Placeholder"
			description="Crie imagens de placeholder com tamanho, cor e texto personalizados para protótipos e layouts. Download PNG e Data URI, processamento 100% local."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-imagem-placeholder" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<PlaceholderGenerator />
		</PageLayout>
	);
}
