import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ImageCropper } from "@/components/tools/image-cropper/image-cropper";

export const metadata: Metadata = {
	title: "Recortar Imagem Online Grátis | Ferramenta Ninja",
	description:
		"Recorte imagens online com precisão. Selecione a área com drag, escolha a proporção e baixe o resultado. Ferramenta gratuita, sem upload para servidor.",
};

const faq = [
	{
		question: "A imagem é enviada para algum servidor?",
		answer:
			"Não. Todo o processamento de recorte acontece diretamente no seu navegador. A imagem nunca sai do seu dispositivo.",
	},
	{
		question: "Quais proporções estão disponíveis?",
		answer:
			"Você pode recortar livremente ou escolher proporções pré-definidas: 1:1 (quadrado), 16:9 (widescreen), 4:3 (padrão) e 3:2 (foto).",
	},
	{
		question: "Posso fazer zoom antes de recortar?",
		answer:
			"Sim. Use o controle deslizante de zoom para ajustar o enquadramento antes de aplicar o recorte.",
	},
	{
		question: "Quais formatos são suportados?",
		answer:
			"A ferramenta aceita imagens PNG, JPEG e WebP. O arquivo recortado mantém o formato original.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que recortar imagens?
				</h2>
				<div className="space-y-3">
					<p>
						Recortar imagens é essencial para ajustar fotos para redes sociais,
						criar avatares, preparar imagens para sites e remover partes
						indesejadas. Uma proporção correta melhora a composição visual e
						garante que a imagem fique bem em qualquer contexto.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Proporções mais usadas
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">1:1 (Quadrado):</strong> ideal
							para perfis do Instagram, avatares e ícones.
						</li>
						<li>
							<strong className="text-foreground">16:9 (Widescreen):</strong>{" "}
							padrão para capas do YouTube, banners e apresentações.
						</li>
						<li>
							<strong className="text-foreground">4:3 (Padrão):</strong> formato
							clássico de fotografia e slides.
						</li>
						<li>
							<strong className="text-foreground">3:2 (Foto):</strong> proporção
							nativa de câmeras DSLR e impressões fotográficas.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Arraste uma imagem ou clique para selecionar. Escolha a proporção
						desejada, ajuste o enquadramento arrastando e usando o zoom, e
						clique em "Recortar". Baixe o resultado quando estiver satisfeito.
					</p>
				</div>
			</section>
		</>
	);
}

export default function RecortarImagemPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/recortar-imagem"
			title="Recortar Imagem"
			description="Recorte imagens online com precisão. Selecione a área com drag, escolha a proporção e baixe o resultado. Rápido, gratuito e 100% no navegador."
			relatedTools={<RelatedTools currentHref="/ferramentas/recortar-imagem" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<ImageCropper />
		</PageLayout>
	);
}
