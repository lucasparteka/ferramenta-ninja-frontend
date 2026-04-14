import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { QRReader } from "@/components/tools/qr-reader/qr-reader";

export const metadata: Metadata = {
	title: "Leitor de QR Code Online Grátis | Ferramenta Ninja",
	description:
		"Leia e decodifique QR Codes a partir de imagens no seu computador. Suporte a PNG, JPG, WebP e mais. Processamento local, sem envio de dados.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona
				</h2>
				<p>
					Esta ferramenta lê o conteúdo de um QR Code a partir de um arquivo de
					imagem. Ao carregar a imagem, o algoritmo de decodificação analisa os
					pixels e extrai as informações armazenadas no código, exibindo o
					resultado em texto.
				</p>
				<p className="mt-3">
					Todo o processamento ocorre diretamente no seu navegador — a imagem
					não é enviada a nenhum servidor. É especialmente útil para ler QR
					Codes recebidos como imagem (capturas de tela, fotos, PDFs exportados
					como imagem) sem precisar apontar uma câmera.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							QR Codes em capturas de tela:
						</strong>{" "}
						leia QR Codes recebidos por WhatsApp, e-mail ou redes sociais sem
						precisar imprimir ou apontar o celular para a tela.
					</p>
					<p>
						<strong className="text-foreground">
							Verificação de conteúdo:
						</strong>{" "}
						confirme o que um QR Code contém antes de compartilhá-lo — útil para
						verificar links, dados de pagamento ou informações de contato.
					</p>
					<p>
						<strong className="text-foreground">
							Desenvolvimento e testes:
						</strong>{" "}
						decodifique QR Codes gerados em testes de software para verificar se
						o conteúdo está correto.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais formatos de imagem são suportados?
						</h3>
						<p>
							PNG, JPG, JPEG, WebP, GIF, BMP e qualquer formato suportado pelo
							seu navegador. Para melhor resultado, use imagens com boa
							resolução e o QR Code bem enquadrado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A imagem é enviada para algum servidor?
						</h3>
						<p>
							Não. O processamento ocorre inteiramente no navegador usando a API
							Canvas e uma biblioteca de decodificação JavaScript. Nenhuma
							imagem ou dado é transmitido.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O leitor não encontrou o QR Code. O que fazer?
						</h3>
						<p>
							Certifique-se de que a imagem tem boa resolução, o QR Code está
							nítido e não está muito inclinado ou parcialmente obstruído.
							Imagens com baixa qualidade ou QR Codes com muito ruído podem
							dificultar a decodificação.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function LeitorDeQrCodePage() {
	return (
		<PageLayout
			title="Leitor de QR Code Online"
			description="Decodifique QR Codes a partir de imagens no seu computador. Arraste a imagem ou clique para selecionar."
			extraContent={<SeoContent />}
		>
			<QRReader />
		</PageLayout>
	);
}
