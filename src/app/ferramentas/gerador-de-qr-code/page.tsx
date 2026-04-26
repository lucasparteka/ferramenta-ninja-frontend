import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { QRGenerator } from "@/components/tools/qr-generator/qr-generator";

export const metadata: Metadata = {
	title: "Gerador de QR Code Online Grátis | Ferramenta Ninja",
	description:
		"Gere QR Codes a partir de qualquer texto ou URL em segundos. Escolha o tamanho e o nível de correção de erro. Baixe em PNG. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um QR Code?
				</h2>
				<p>
					QR Code (Quick Response Code) é um código de barras bidimensional que
					armazena informações de forma compacta e pode ser lido rapidamente por
					qualquer câmera de smartphone. Criado no Japão em 1994, o QR Code se
					popularizou por conseguir armazenar muito mais dados do que um código
					de barras tradicional — incluindo URLs, textos, dados de contato e
					muito mais.
				</p>
				<p className="mt-3">
					Hoje, os QR Codes estão presentes em cardápios digitais, pagamentos
					via Pix, cartões de visita, embalagens de produtos, campanhas de
					marketing e qualquer situação em que se deseja conectar o mundo físico
					ao digital de forma instantânea.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						Digite o texto ou cole a URL que deseja codificar no campo de
						entrada.
					</li>
					<li>O QR Code é gerado automaticamente enquanto você digita.</li>
					<li>
						Ajuste o tamanho e o nível de correção de erro conforme necessário.
					</li>
					<li>
						Clique em <strong className="text-foreground">Baixar PNG</strong>{" "}
						para salvar a imagem no seu dispositivo.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Opções disponíveis
				</h2>
				<ul className="list-disc space-y-3 pl-6">
					<li>
						<strong className="text-foreground">Texto ou URL:</strong> qualquer
						conteúdo pode ser codificado — links, endereços, números de
						telefone, textos livres, e-mails ou dados estruturados.
					</li>
					<li>
						<strong className="text-foreground">Tamanho:</strong> escolha entre
						200, 300, 400 e 500 pixels. Tamanhos maiores facilitam a leitura em
						impressões e displays.
					</li>
					<li>
						<strong className="text-foreground">Correção de erro:</strong>{" "}
						define quanto do código pode estar danificado ou coberto e ainda ser
						lido. Nível mais alto significa QR Code mais denso, porém mais
						resiliente.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Níveis de correção de erro
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Baixa (L — 7%):</strong> ideal
						para ambientes controlados, como telas e displays limpos. Gera o QR
						Code mais simples e de leitura mais rápida.
					</p>
					<p>
						<strong className="text-foreground">Média (M — 15%):</strong>{" "}
						equilíbrio entre densidade e resiliência. Recomendado para a maioria
						dos casos de uso, incluindo impressões em papel.
					</p>
					<p>
						<strong className="text-foreground">Alta (Q — 25%):</strong>{" "}
						indicado para ambientes com risco de sujeira ou desgaste moderado,
						como embalagens e materiais promocionais.
					</p>
					<p>
						<strong className="text-foreground">Máxima (H — 30%):</strong>{" "}
						suporta até 30% do código danificado. Usado quando o QR Code pode
						ser parcialmente coberto por um logotipo ou sofrer desgaste severo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Marketing e publicidade:
						</strong>{" "}
						inclua QR Codes em panfletos, banners e embalagens para direcionar
						clientes a páginas de produto, promoções ou redes sociais.
					</p>
					<p>
						<strong className="text-foreground">Cardápios digitais:</strong>{" "}
						restaurantes e estabelecimentos utilizam QR Codes para oferecer
						cardápios sem contato físico, atualizáveis a qualquer momento.
					</p>
					<p>
						<strong className="text-foreground">Cartões de visita:</strong>{" "}
						adicione um QR Code ao seu cartão com link para seu LinkedIn,
						portfólio ou página de contato, facilitando o networking.
					</p>
					<p>
						<strong className="text-foreground">Eventos e ingressos:</strong>{" "}
						gere códigos únicos para controle de acesso, check-in e validação de
						participantes em eventos.
					</p>
					<p>
						<strong className="text-foreground">
							Desenvolvimento e testes:
						</strong>{" "}
						gere QR Codes rapidamente para testar leitores, fluxos de aplicativo
						e integrações durante o desenvolvimento.
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
							Quais tipos de conteúdo posso codificar?
						</h3>
						<p>
							Qualquer texto: URLs, endereços de e-mail, números de telefone,
							mensagens de texto, coordenadas geográficas, dados de Wi-Fi, entre
							outros. O limite prático é de cerca de 2.900 caracteres,
							dependendo do nível de correção de erro.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O QR Code gerado tem prazo de validade?
						</h3>
						<p>
							Não. O QR Code é apenas uma representação visual do conteúdo que
							você digitou. Se o conteúdo for uma URL, o link continuará
							funcionando enquanto o site estiver no ar — isso não é controlado
							pelo QR Code em si.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual tamanho devo usar para impressão?
						</h3>
						<p>
							Para impressões, recomenda-se pelo menos 300 px para garantir boa
							qualidade. Ao imprimir, mantenha pelo menos 1 cm de margem ao
							redor do código. Em impressões grandes, como banners, utilize 400
							ou 500 px para melhor definição.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que o QR Code fica mais "cheio" com níveis altos de correção?
						</h3>
						<p>
							Níveis maiores de correção adicionam dados redundantes ao código
							para permitir a recuperação de informações mesmo que parte do QR
							Code esteja danificada. Isso aumenta a densidade de módulos (os
							quadradinhos), tornando o código visualmente mais complexo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre diretamente no seu navegador. O
							texto ou URL que você digita nunca é transmitido ou armazenado em
							nenhum servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeQrCodePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code"
			title="Gerador de QR Code Online Grátis"
			description="Gere QR Codes a partir de qualquer texto ou URL. Escolha o tamanho e o nível de correção de erro e baixe em PNG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code" />
			}
			extraContent={<SeoContent />}
		>
			<QRGenerator />
		</PageLayout>
	);
}
