import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code Personalizado | Ferramenta Ninja",
	description:
		"Crie QR codes personalizados com cores, estilos, logo central e múltiplos tipos de conteúdo: URL, Wi-Fi, e-mail, telefone e PIX. Exporte em PNG, JPG ou SVG.",
	keywords: [
		"qr code personalizado",
		"gerador de qr code",
		"qr code com logo",
		"qr code estilizado",
		"qr code wifi",
		"qr code pix",
		"qr code email",
	],
};

const faq = [
	{
		question: "Posso colocar meu logo no centro do QR Code?",
		answer:
			"Sim. Faça upload de uma imagem PNG ou JPG e ajuste o tamanho do logo com o slider. Recomendamos usar nível de correção de erro 'M' ou superior para garantir a leitura.",
	},
	{
		question: "Qual formato de exportação devo usar?",
		answer:
			"Use PNG para uso geral e web, JPG se precisar de arquivo menor, ou SVG se precisar de escalabilidade infinita (ideal para impressão).",
	},
	{
		question: "O QR Code Wi-Fi funciona em qualquer dispositivo?",
		answer:
			"Sim. A maioria dos smartphones modernos (Android e iOS) consegue ler QR codes Wi-Fi e conectar automaticamente à rede.",
	},
	{
		question: "O QR Code PIX é válido para pagamento?",
		answer:
			"Sim. O payload gerado segue o padrão EMV QR Code do Banco Central do Brasil e é aceito por todos os bancos e carteiras digitais.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code personalizado
				</h2>
				<p>
					Nosso gerador de QR Code permite criar códigos estilizados para
					diferentes finalidades. Escolha o tipo de conteúdo (URL, Wi-Fi,
					E-mail, Telefone ou PIX), personalize as cores e o estilo dos pontos,
					adicione seu logo e exporte no formato desejado.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tipos de QR Code suportados
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>URL / Texto:</strong> Redireciona para um site ou exibe
						um texto.
					</li>
					<li>
						<strong>Wi-Fi:</strong> Permite conexão automática à rede
						sem digitar senha.
					</li>
					<li>
						<strong>E-mail:</strong> Abre o app de e-mail com destinatário,
						assunto e corpo pré-preenchidos.
					</li>
					<li>
						<strong>Telefone:</strong> Inicia uma ligação para o número
						informado.
					</li>
					<li>
						<strong>PIX:</strong> Gera um código de pagamento instantâneo
						com chave, valor e descrição.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodePersonalizadoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code-personalizado"
			title="Gerador de QR Code Personalizado"
			description="Crie QR codes com cores, estilos, logo central e múltiplos tipos de conteúdo. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-personalizado" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode />
		</PageLayout>
	);
}
