import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { YouTubeThumbnailDownloader } from "@/components/tools/youtube-thumbnail/downloader";

export const metadata: Metadata = {
	title: "Baixar Thumbnail do YouTube Online Grátis | Ferramenta Ninja",
	description:
		"Extraia e baixe thumbnails de qualquer vídeo do YouTube em até 4 resoluções. Cole o link, visualize e baixe a imagem. Grátis e sem cadastro.",
	keywords: [
		"baixar thumbnail youtube",
		"download thumbnail youtube",
		"extrair capa youtube",
		"thumbnail youtube hd",
		"capturar imagem youtube",
	],
};

function SeoContent() {
	return (
		<section className="space-y-4">
			<div>
				<h2>O que é a thumbnail do YouTube?</h2>
				<p>
					A thumbnail é a imagem de capa exibida antes do vídeo ser reproduzido. O YouTube
					gera automaticamente até 4 versões em diferentes resoluções: HD (1280×720), SD
					(640×480), HQ (480×360) e MQ (320×180).
				</p>
			</div>
			<div>
				<h2>Como baixar a thumbnail de um vídeo do YouTube?</h2>
				<p>
					Cole o link do vídeo no campo acima e clique em "Buscar". A ferramenta extrai o ID
					do vídeo e exibe as thumbnails disponíveis. Clique em "Baixar" na resolução
					desejada para salvar a imagem no seu dispositivo.
				</p>
			</div>
			<div>
				<h2>Quais formatos de link são suportados?</h2>
				<p>
					São aceitos links no formato youtube.com/watch?v=, youtu.be/ (links curtos),
					youtube.com/shorts/ e youtube.com/embed/. Basta colar qualquer link de vídeo do
					YouTube.
				</p>
			</div>
		</section>
	);
}

const faq = [
	{
		question: "Posso usar a thumbnail comercialmente?",
		answer:
			"As thumbnails são criadas pelos próprios canais do YouTube e podem estar sujeitas a direitos autorais. Para uso comercial, verifique a licença do canal e, se necessário, solicite autorização ao criador.",
	},
	{
		question: "Por que a thumbnail em HD não aparece?",
		answer:
			"O YouTube gera a versão maxresdefault (1280×720) apenas para alguns vídeos. Se não aparecer, utilize a resolução SD ou HQ que estão disponíveis para todos os vídeos.",
	},
	{
		question: "Os meus dados ficam seguros?",
		answer:
			"Sim. A URL do vídeo é processada no servidor apenas para buscar a imagem pública do YouTube. Nenhum dado é armazenado.",
	},
	{
		question: "Funciona com Shorts do YouTube?",
		answer:
			"Sim. A ferramenta suporta links de YouTube Shorts no formato youtube.com/shorts/ID.",
	},
];

export default function BaixarThumbnailYoutubePage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/baixar-thumbnail-youtube"
			title="Baixar Thumbnail do YouTube"
			description="Extraia e baixe thumbnails de qualquer vídeo do YouTube em alta resolução."
			relatedTools={<RelatedTools currentHref="/ferramentas/baixar-thumbnail-youtube" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<YouTubeThumbnailDownloader />
		</PageLayout>
	);
}
