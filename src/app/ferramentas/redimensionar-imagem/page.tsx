import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ResizeImage } from "@/components/tools/resize-image/resize-image";

export const metadata: Metadata = {
	title: "Redimensionar Imagem Online Grátis | Ferramenta Ninja",
	description:
		"Redimensione suas imagens para redes sociais, sites e documentos. Presets para Instagram, Facebook, YouTube e mais. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é redimensionamento de imagem?
				</h2>
				<p>
					Redimensionar uma imagem significa alterar suas dimensões em pixels —
					largura e altura — sem necessariamente recortar o conteúdo. É útil
					para adaptar imagens a tamanhos específicos exigidos por redes
					sociais, sites, apresentações ou documentos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tamanhos ideais para redes sociais
				</h2>
				<div className="space-y-2">
					<p>Conheça os tamanhos recomendados para cada plataforma:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Instagram (quadrado):</strong>{" "}
							1080 × 1080 pixels
						</li>
						<li>
							<strong className="text-foreground">Instagram Story:</strong> 1080
							× 1920 pixels (proporção 9:16)
						</li>
						<li>
							<strong className="text-foreground">Facebook Post:</strong> 1200 ×
							630 pixels
						</li>
						<li>
							<strong className="text-foreground">YouTube Thumbnail:</strong>{" "}
							1280 × 720 pixels (16:9)
						</li>
						<li>
							<strong className="text-foreground">Twitter Post:</strong> 1200 ×
							675 pixels
						</li>
						<li>
							<strong className="text-foreground">LinkedIn Post:</strong> 1200 ×
							627 pixels
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o redimensionamento?
				</h2>
				<p>
					Nossa ferramenta processa a imagem no seu navegador usando a API
					Canvas. Você pode definir largura e altura manualmente ou usar os
					presets para redes sociais. Ative a trava de proporção para manter a
					proporção original ao alterar apenas uma dimensão.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa "manter proporção"?
						</h3>
						<p>
							Quando ativado, ao alterar a largura a altura se ajusta
							automaticamente para manter a proporção original da imagem,
							evitando distorções.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Redimensionar reduz a qualidade da imagem?
						</h3>
						<p>
							Redimensionar para um tamanho menor pode causar leve perda de
							detalhes, mas o resultado costuma ser excelente. Ampliar a imagem
							além do tamanho original resultará em perda de nitidez.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso converter o formato ao redimensionar?
						</h3>
						<p>
							Sim. Use o seletor de formato de saída para escolher entre manter
							o formato original, JPEG, PNG ou WebP.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Minhas imagens são enviadas a algum servidor?
						</h3>
						<p>
							Não. Tudo acontece localmente no seu navegador. Nenhuma imagem é
							enviada ou armazenada externamente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function RedimensionarImagemPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/redimensionar-imagem"
			title="Redimensionar Imagem"
			description="Altere o tamanho das suas imagens para redes sociais, sites e documentos. Presets para Instagram, Facebook e YouTube."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/redimensionar-imagem" />
			}
			extraContent={<SeoContent />}
		>
			<ResizeImage />
		</PageLayout>
	);
}
