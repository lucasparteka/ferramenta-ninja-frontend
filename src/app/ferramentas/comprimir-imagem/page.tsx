import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CompressImage } from "@/components/tools/compress-image/compress-image";

export const metadata: Metadata = {
	title: "Comprimir Imagem Online Grátis | Ferramenta Ninja",
	description:
		"Reduza o tamanho de imagens JPG, PNG e WebP sem perder qualidade. Comprima suas fotos direto no navegador, sem upload. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é compressão de imagem?
				</h2>
				<p>
					A compressão de imagem é o processo de reduzir o tamanho do arquivo de
					uma imagem sem comprometer significativamente sua qualidade visual.
					Isso é essencial para sites mais rápidos, e-mails que não excedem
					limites de anexo e economia de espaço de armazenamento.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como comprimir imagem sem perder qualidade?
				</h2>
				<div className="space-y-3">
					<p>
						O segredo está no equilíbrio entre compressão e qualidade. Formatos
						como JPEG e WebP permitem compressão com perdas — você escolhe o
						nível de qualidade e o algoritmo descarta detalhes que o olho humano
						dificilmente percebe.
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">JPEG:</strong> ideal para
							fotografias. Qualidade entre 70% e 85% geralmente mantém boa
							aparência com grande redução.
						</li>
						<li>
							<strong className="text-foreground">WebP:</strong> formato moderno
							que oferece compressão até 30% melhor que JPEG com a mesma
							qualidade.
						</li>
						<li>
							<strong className="text-foreground">PNG:</strong> compressão sem
							perdas — mantém qualidade total mas gera arquivos maiores.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que usar nosso compressor de imagem?
				</h2>
				<div className="space-y-3">
					<p>
						Diferente de outras ferramentas, nossas imagens são processadas
						diretamente no seu navegador. Nenhuma imagem é enviada para
						servidores externos, garantindo total privacidade e velocidade.
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>100% gratuito e sem limite de uso</li>
						<li>Processamento instantâneo no navegador</li>
						<li>Suporte a JPG, PNG e WebP</li>
						<li>Controle preciso de qualidade e dimensões</li>
						<li>
							Privacidade total — suas imagens nunca saem do seu dispositivo
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Minha imagem é enviada para algum servidor?
						</h3>
						<p>
							Não. Toda a compressão acontece no seu navegador. Suas imagens
							nunca saem do seu dispositivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a melhor qualidade para comprimir?
						</h3>
						<p>
							Para fotos, 80% costuma ser o ponto ideal entre qualidade e
							tamanho. Para imagens com texto ou gráficos, prefira 90% ou mais.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso comprimir várias imagens de uma vez?
						</h3>
						<p>
							No momento, o compressor processa uma imagem por vez. Para lotes,
							você pode usar a ferramenta várias vezes — é instantâneo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Comprimir imagem reduz a qualidade?
						</h3>
						<p>
							Depende do nível escolhido. Com qualidade acima de 80%, a perda é
							praticamente imperceptível. Em PNG, a compressão é sem perdas.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ComprimirImagemPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/comprimir-imagem"
			title="Comprimir Imagem"
			description="Reduza o tamanho das suas imagens online e grátis. Comprima JPG, PNG e WebP direto no navegador, com controle de qualidade e dimensões."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/comprimir-imagem" />
			}
			extraContent={<SeoContent />}
		>
			<CompressImage />
		</PageLayout>
	);
}
