import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code para Telefone | Ferramenta Ninja",
	description:
		"Crie QR codes que iniciam uma ligação para qualquer número de telefone. Ideal para cartões de visita e divulgação. Exporte em PNG, JPG ou SVG.",
	keywords: [
		"qr code telefone",
		"qr code celular",
		"qr code para ligar",
		"gerador qr code telefone",
		"qr code número de telefone",
		"qr code discagem",
	],
};

const faq = [
	{
		question: "O que acontece quando alguém escaneia o QR Code de telefone?",
		answer:
			"O discador do dispositivo abre automaticamente com o número já preenchido. O usuário só precisa confirmar a ligação tocando em Ligar.",
	},
	{
		question: "Funciona para números internacionais?",
		answer:
			"Sim. Informe o número com o código do país (ex: +55 para Brasil) e o QR Code incluirá o prefixo internacional corretamente.",
	},
	{
		question: "Funciona em iPhone e Android?",
		answer:
			"Sim. O QR Code usa o protocolo tel: padrão, reconhecido por todos os smartphones modernos em iOS e Android.",
	},
	{
		question: "Posso usar para números de WhatsApp?",
		answer:
			"O QR Code de telefone inicia uma ligação convencional. Para iniciar uma conversa no WhatsApp diretamente, use a ferramenta Gerador de Link WhatsApp do Ferramenta Ninja.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code para telefone
				</h2>
				<p>
					Digite o número de telefone (com DDD) e personalize as cores e o
					estilo do QR Code. Ao ser escaneado, o discador do celular abre
					automaticamente com o número pronto para ligar. Ideal para substituir
					números impressos em cartões de visita, fachadas e materiais
					promocionais.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Cartões de visita:</strong> substitua o número impresso por
						um QR Code para facilitar a discagem.
					</li>
					<li>
						<strong>Fachadas e letreiros:</strong> clientes podem ligar para o
						estabelecimento com um simples escaneamento.
					</li>
					<li>
						<strong>Materiais de entrega:</strong> inclua o QR Code de suporte
						em embalagens para contato rápido pós-compra.
					</li>
					<li>
						<strong>Anúncios impressos:</strong> facilite o contato em panfletos
						e outdoors sem que o cliente precise digitar o número.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodeTelefonePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code-telefone"
			title="Gerador de QR Code para Telefone"
			description="Crie QR codes que iniciam uma ligação com um escaneamento. Personalize cores e estilos. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-telefone" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode initialTab="phone" hideMode />
		</PageLayout>
	);
}
