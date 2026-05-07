import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { FaviconGenerator } from "@/components/tools/favicon-generator/favicon-generator";

export const metadata: Metadata = {
	title: "Gerador de Favicon Online Grátis | Ferramenta Ninja",
	description:
		"Crie favicons gratuitamente a partir de imagem, SVG, texto ou emoji. Gere todos os tamanhos necessários (16x16, 32x32, 180x180, 192x192, 512x512) mais o arquivo .ico e o manifest.",
	keywords: [
		"gerador de favicon",
		"favicon",
		"ico",
		"png",
		"icone site",
		"favicon online",
		"criar favicon",
		"apple touch icon",
		"android chrome icon",
	],
};

function SeoContent() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold">O que é um favicon?</h2>
				<p className="text-muted-foreground">
					Favicon é o ícone que aparece na aba do navegador, nos favoritos e na
					tela inicial do celular quando alguém adiciona seu site. Um favicon
					bem feito melhora a identidade visual e a experiência do usuário.
				</p>
			</div>
			<div>
				<h2 className="text-lg font-semibold">Como usar o gerador?</h2>
				<p className="text-muted-foreground">
					Escolha uma das quatro opções (imagem, SVG, texto ou emoji),
					personalize no editor e clique em "Gerar Favicon". Você receberá todos
					os arquivos prontos para usar no seu site.
				</p>
			</div>
			<div>
				<h2 className="text-lg font-semibold">Quais formatos são gerados?</h2>
				<p className="text-muted-foreground">
					O gerador cria arquivos PNG nos tamanhos 16×16, 32×32, 48×48, 180×180,
					192×192 e 512×512, além de um arquivo .ico multi-resolução e o
					site.webmanifest para Android.
				</p>
			</div>
			<div>
				<h2 className="text-lg font-semibold">Como instalar no meu site?</h2>
				<p className="text-muted-foreground">
					Baixe o pacote .zip, extraia os arquivos na raiz do seu site e cole as
					tags HTML fornecidas dentro da tag <code>&lt;head&gt;</code> das suas
					páginas.
				</p>
			</div>
		</section>
	);
}

const faq = [
	{
		question: "O que é um favicon?",
		answer:
			"Favicon é um pequeno ícone associado a um site, exibido na aba do navegador, na barra de favoritos e em atalhos de tela inicial em dispositivos móveis.",
	},
	{
		question: "Quais tamanhos de favicon são gerados?",
		answer:
			"São gerados os tamanhos 16×16, 32×32, 48×48, 180×180 (Apple Touch Icon), 192×192 e 512×512 (Android Chrome), além de um arquivo .ico com múltiplas resoluções.",
	},
	{
		question: "Posso usar uma imagem que não é quadrada?",
		answer:
			"Sim. Se você enviar uma imagem retangular, ela será cortada automaticamente pelo centro para se ajustar ao formato quadrado do favicon.",
	},
	{
		question: "O que é o arquivo site.webmanifest?",
		answer:
			"É um arquivo JSON que informa ao navegador como exibir seu site quando adicionado à tela inicial de um dispositivo Android, incluindo os ícones e cores do tema.",
	},
	{
		question: "Como adicionar o favicon no meu site?",
		answer:
			"Faça o download do pacote, coloque os arquivos na raiz do seu servidor e insira as tags HTML fornecidas dentro da tag <head> do seu documento.",
	},
];

export default function GeradorDeFaviconPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-favicon"
			title="Gerador de Favicon"
			description="Crie favicons gratuitamente a partir de imagem, SVG, texto ou emoji. Gere todos os tamanhos, o .ico e o manifest em segundos."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-favicon" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<FaviconGenerator />
		</PageLayout>
	);
}
