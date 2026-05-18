import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { FaceBlurTool } from "@/components/tools/face-blur/face-blur";

export const metadata: Metadata = {
	title: "Borrador de Rosto Online Grátis | Ferramenta Ninja",
	description:
		"Borre rostos em fotos automaticamente no navegador. Detecção automática com IA, processamento local — suas imagens não são enviadas a servidores.",
};

const faq = [
	{
		question: "Como funciona o borrador de rosto?",
		answer:
			"A ferramenta usa um modelo de detecção facial (MediaPipe BlazeFace) que roda diretamente no seu navegador. Ao enviar a imagem, os rostos são detectados automaticamente e a área é borrada ou pixelizada conforme sua escolha.",
	},
	{
		question: "A imagem é enviada para algum servidor?",
		answer:
			"Não. Todo o processamento acontece localmente no seu navegador. A imagem nunca sai do seu dispositivo.",
	},
	{
		question: "Quantos rostos podem ser detectados?",
		answer:
			"A ferramenta detecta múltiplos rostos na mesma imagem. O modelo é otimizado para rostos frontais e semi-frontais com boa iluminação.",
	},
	{
		question: "O que fazer se um rosto não for detectado?",
		answer:
			"A detecção automática funciona melhor com rostos frontais e bem iluminados. Se um rosto não for detectado, tente usar uma imagem com melhor qualidade ou iluminação.",
	},
	{
		question: "Quais formatos de imagem são suportados?",
		answer: "PNG, JPEG e WebP.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que borrar rostos em fotos?
				</h2>
				<div className="space-y-3">
					<p>
						Proteger a identidade de pessoas em imagens é essencial em diversas
						situações: publicar fotos em redes sociais respeitando a privacidade
						de quem não autorizou, compartilhar imagens de protestos e eventos
						públicos, ou adequar conteúdo à LGPD e outras legislações de
						proteção de dados.
					</p>
					<p>
						O borrador de rosto automatiza esse processo: você não precisa
						selecionar manualmente cada área — a detecção é feita
						automaticamente.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o borrador de rosto
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Envie a imagem:</strong>{" "}
						arraste ou clique para selecionar. Formatos aceitos: PNG, JPG, WebP.
					</p>
					<p>
						<strong className="text-foreground">2. Aguarde a detecção:</strong>{" "}
						o modelo detecta os rostos automaticamente em segundos.
					</p>
					<p>
						<strong className="text-foreground">3. Ajuste o estilo:</strong>{" "}
						escolha entre desfoque suave ou pixelização. Use o controle de
						intensidade e margem para personalizar o resultado.
					</p>
					<p>
						<strong className="text-foreground">4. Baixe a imagem:</strong>{" "}
						clique em "Baixar" para salvar a versão com rostos borrados.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Privacidade e segurança
				</h2>
				<div className="space-y-3">
					<p>
						Todo o processamento ocorre no seu navegador usando WebAssembly e a
						Canvas API. Nenhuma imagem é transmitida ou armazenada em servidores
						externos. Você pode usar a ferramenta com total confiança mesmo com
						imagens sensíveis.
					</p>
				</div>
			</section>
		</>
	);
}

export default function DesfocarRostoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/desfocar-rosto"
			title="Borrador de Rosto"
			description="Detecte e borre rostos em fotos automaticamente. Desfoque ou pixelização, ajuste a intensidade e baixe o resultado. 100% no navegador."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/desfocar-rosto" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<FaceBlurTool />
		</PageLayout>
	);
}
