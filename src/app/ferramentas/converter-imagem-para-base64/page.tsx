import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ImageToBase64 } from "@/components/tools/image-base64/image-to-base64";

export const metadata: Metadata = {
	title: "Converter Imagem para Base64 Online Grátis | Ferramenta Ninja",
	description:
		"Converta imagens para Base64 online de forma gratuita. Suporte a PNG, JPG, GIF, SVG e WebP. Gere data URI e copie com um clique.",
};

function SeoContent() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold">O que é Base64?</h2>
				<p className="text-muted-foreground">
					Base64 é um método de codificação que converte dados binários em texto
					ASCII. É amplamente utilizado para embutir imagens diretamente em
					HTML, CSS e JSON.
				</p>
			</div>
			<div>
				<h2 className="text-lg font-semibold">Como usar este conversor?</h2>
				<p className="text-muted-foreground">
					Arraste uma imagem para a área indicada ou cole uma URL remota. A
					conversão acontece automaticamente no navegador — nenhum dado é
					enviado para servidores.
				</p>
			</div>
			<div>
				<h2 className="text-lg font-semibold">Quando usar imagens Base64?</h2>
				<p className="text-muted-foreground">
					Ideal para ícones pequenos, imagens em e-mails HTML, data URIs em CSS
					e quando você precisa de uma única string sem dependência de arquivo
					externo.
				</p>
			</div>
		</section>
	);
}

const faq = [
	{
		question: "O que é uma imagem Base64?",
		answer:
			"É uma imagem convertida em uma string de texto que pode ser inserida diretamente em código HTML, CSS ou JSON, sem necessidade de arquivo separado.",
	},
	{
		question: "Quais formatos de imagem são suportados?",
		answer:
			"PNG, JPG/JPEG, GIF, SVG e WebP. Todos os formatos comuns da web são aceitos.",
	},
	{
		question: "É seguro converter imagens aqui?",
		answer:
			"Sim. Todo o processamento acontece no seu navegador. Nenhuma imagem é enviada para servidores externos.",
	},
	{
		question: "Por que o tamanho Base64 é maior que o original?",
		answer:
			"A codificação Base64 aumenta o tamanho em aproximadamente 33%, pois converte dados binários em texto ASCII de 64 caracteres.",
	},
	{
		question: "Posso converter imagens de URLs remotas?",
		answer:
			"Sim. Basta colar a URL da imagem na aba 'URL Remota' e clicar em 'Carregar'.",
	},
];

export default function ConverterImagemParaBase64Page() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-imagem-para-base64"
			title="Converter Imagem para Base64"
			description="Converta imagens para Base64 online de forma gratuita. Suporte a PNG, JPG, GIF, SVG e WebP."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-imagem-para-base64" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<ImageToBase64 />
		</PageLayout>
	);
}
