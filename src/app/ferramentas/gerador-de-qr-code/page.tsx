import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code para URL e Texto | Ferramenta Ninja",
	description:
		"Crie QR codes para links e textos gratuitamente. Personalize cores, estilos e adicione logo. Exporte em PNG, JPG ou SVG.",
	keywords: [
		"gerador de qr code",
		"qr code url",
		"qr code link",
		"qr code texto",
		"criar qr code grátis",
		"qr code personalizado",
	],
};

const faq = [
	{
		question: "Posso criar um QR Code para qualquer URL?",
		answer:
			"Sim. Cole qualquer endereço web (ou texto livre) e o QR Code será gerado automaticamente. Funciona para links curtos, longos, com ou sem HTTPS.",
	},
	{
		question: "O QR Code de URL tem prazo de validade?",
		answer:
			"Não. O QR Code gerado aqui é estático — ele contém a URL diretamente no código. Enquanto a URL existir, o QR Code funcionará para sempre.",
	},
	{
		question: "Como adicionar meu logo ao QR Code?",
		answer:
			"Clique em 'Escolher arquivo' na seção Logo, faça upload de uma imagem PNG ou JPG e ajuste o tamanho com o slider. Use nível de correção 'M' ou superior.",
	},
	{
		question: "Qual formato de exportação devo usar?",
		answer:
			"Use PNG para web e uso geral, JPG se precisar de arquivo menor, ou SVG para impressão em qualquer tamanho sem perda de qualidade.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code para URL ou texto
				</h2>
				<p>
					Cole o link ou texto no campo, personalize as cores e o estilo dos
					pontos e clique em baixar. O QR Code é gerado instantaneamente no
					navegador, sem enviar seus dados a nenhum servidor.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Cardápios digitais:</strong> aponte para o link do cardápio
						online e imprima o QR Code.
					</li>
					<li>
						<strong>Redes sociais:</strong> direcione para o seu perfil ou
						página sem precisar digitar.
					</li>
					<li>
						<strong>Materiais impressos:</strong> adicione o QR Code em
						panfletos, cartões e banners.
					</li>
					<li>
						<strong>Textos curtos:</strong> exiba mensagens, senhas temporárias
						ou instruções via QR Code.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code"
			title="Gerador de QR Code para URL e Texto"
			description="Crie QR codes para links e textos com cores e estilos personalizados. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode initialTab="url" />
		</PageLayout>
	);
}
