import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code para E-mail | Ferramenta Ninja",
	description:
		"Crie QR codes que abrem o app de e-mail com destinatário, assunto e corpo pré-preenchidos. Ideal para contato e suporte. Exporte em PNG, JPG ou SVG.",
	keywords: [
		"qr code email",
		"qr code e-mail",
		"qr code para contato",
		"gerador qr code email",
		"qr code mailto",
		"qr code endereço de email",
	],
};

const faq = [
	{
		question: "O que acontece quando alguém escaneia o QR Code de e-mail?",
		answer:
			"O app de e-mail padrão do dispositivo abre automaticamente com o destinatário, assunto e corpo já preenchidos. O usuário só precisa tocar em Enviar.",
	},
	{
		question: "Funciona em iPhone e Android?",
		answer:
			"Sim. O QR Code gera um link mailto: padrão, reconhecido por todos os apps de e-mail em iOS e Android, incluindo Gmail, Outlook e Apple Mail.",
	},
	{
		question: "Posso deixar o assunto ou corpo em branco?",
		answer:
			"Sim. Apenas o destinatário é obrigatório. Assunto e corpo são opcionais — deixe em branco se quiser que o usuário preencha livremente.",
	},
	{
		question: "Qual é o tamanho máximo do corpo do e-mail?",
		answer:
			"Não há um limite estrito, mas textos muito longos geram QR codes com mais módulos e podem ser difíceis de escanear. Recomendamos manter o corpo curto e objetivo.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code para e-mail
				</h2>
				<p>
					Informe o endereço de e-mail do destinatário, o assunto e o corpo da
					mensagem. O QR Code gerado usa o protocolo mailto: — ao ser escaneado,
					abre o app de e-mail já configurado com todos os campos preenchidos.
					Ideal para facilitar o contato em materiais impressos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Cartões de visita:</strong> substitua o endereço de e-mail
						impresso por um QR Code que já abre uma mensagem para você.
					</li>
					<li>
						<strong>Formulários de contato físico:</strong> coloque em lojas,
						stands ou recepções para que visitantes enviem uma mensagem com um
						escaneamento.
					</li>
					<li>
						<strong>Suporte técnico:</strong> gere um QR Code com assunto e
						corpo padronizados para facilitar abertura de chamados.
					</li>
					<li>
						<strong>Feedback pós-evento:</strong> distribua o QR Code para que
						participantes enviem comentários rapidamente.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodeEmailPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code-email"
			title="Gerador de QR Code para E-mail"
			description="Crie QR codes que abrem o app de e-mail com destinatário, assunto e corpo pré-preenchidos. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-email" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode initialTab="email" />
		</PageLayout>
	);
}
