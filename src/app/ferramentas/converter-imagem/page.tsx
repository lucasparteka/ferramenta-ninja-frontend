import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ConvertImage } from "@/components/tools/convert-image/convert-image";

export const metadata: Metadata = {
	title: "Converter Imagem Online Grátis | Ferramenta Ninja",
	description:
		"Converta imagens entre PNG, JPEG e WebP online e grátis. Conversão instantânea no navegador, sem upload. Suporte a transparência e controle de qualidade.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é conversão de formato de imagem?
				</h2>
				<p>
					Conversão de formato é o processo de transformar uma imagem de um
					formato para outro — por exemplo, de PNG para JPEG ou de JPEG para
					WebP. Cada formato tem características diferentes em termos de
					compressão, qualidade e suporte a transparência.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Qual formato de imagem escolher?
				</h2>
				<div className="space-y-3">
					<div>
						<h3 className="font-semibold text-foreground">JPEG</h3>
						<p>
							Ideal para fotografias e imagens com muitas cores. Compressão com
							perdas — arquivos menores mas sem suporte a transparência.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-foreground">PNG</h3>
						<p>
							Ideal para logos, ícones e imagens com texto. Suporta
							transparência e compressão sem perdas — arquivos maiores que JPEG.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-foreground">WebP</h3>
						<p>
							Formato moderno desenvolvido pelo Google. Suporta transparência,
							compressão com e sem perdas, e gera arquivos até 30% menores que
							JPEG com qualidade equivalente.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Quando usar cada formato?
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">PNG para JPEG:</strong> quando
						precisa reduzir drasticamente o tamanho do arquivo e a transparência
						não é necessária.
					</li>
					<li>
						<strong className="text-foreground">JPEG para PNG:</strong> quando
						precisa adicionar transparência ou quando a imagem será editada
						várias vezes (PNG não acumula artefatos).
					</li>
					<li>
						<strong className="text-foreground">Qualquer para WebP:</strong>{" "}
						para usar em sites modernos — combina qualidade e tamanho reduzido.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Converter PNG para JPEG perde qualidade?
						</h3>
						<p>
							Sim, pois JPEG é um formato com perdas. Mas você pode controlar a
							qualidade da conversão para minimizar a perda visual.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que acontece com a transparência ao converter para JPEG?
						</h3>
						<p>
							Como JPEG não suporta transparência, as áreas transparentes são
							preenchidas com branco. Para preservar transparência, use PNG ou
							WebP.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso converter vários formatos de uma vez?
						</h3>
						<p>
							A ferramenta atual processa uma imagem por vez. Para múltiplas
							imagens, repita o processo — é instantâneo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Minhas imagens são enviadas a algum servidor?
						</h3>
						<p>
							Não. A conversão é feita inteiramente no seu navegador. Suas
							imagens nunca saem do seu dispositivo.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConverterImagemPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-imagem"
			title="Converter Imagem"
			description="Converta suas imagens entre PNG, JPEG e WebP online e grátis. Conversão instantânea no navegador, com controle de qualidade."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-imagem" />
			}
			extraContent={<SeoContent />}
		>
			<ConvertImage />
		</PageLayout>
	);
}
