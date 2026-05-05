import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { WhatsAppLinkGenerator } from "@/components/tools/whatsapp-link/whatsapp-link-generator";

export const metadata: Metadata = {
	title: "Gerador de Link do WhatsApp Online Grátis | Ferramenta Ninja",
	description:
		"Crie links wa.me para WhatsApp com número e mensagem pré-preenchida. Gere QR Code, copie o link ou abra diretamente no WhatsApp. Grátis e sem cadastro.",
};

function SeoContent() {
	return (
		<section className="space-y-4">
			<div>
				<h2>O que é um link do WhatsApp?</h2>
				<p>
					Um link do WhatsApp (wa.me) permite iniciar uma conversa no WhatsApp com um número
					específico sem precisar salvar o contato na agenda. Você pode incluir uma mensagem
					pré-preenchida que aparece automaticamente no campo de texto da conversa.
				</p>
			</div>
			<div>
				<h2>Como usar o gerador de link do WhatsApp?</h2>
				<p>
					Digite o número de telefone com DDD, insira uma mensagem opcional e pronto. O link
					é gerado automaticamente. Você pode copiar o link, abrir direto no WhatsApp ou gerar
					um QR Code para compartilhar em materiais impressos.
				</p>
			</div>
			<div>
				<h2>O link wa.me funciona fora do Brasil?</h2>
				<p>
					Sim. O formato wa.me funciona mundialmente. O gerador usa o código do país +55 por
					padrão, mas você pode digitar números internacionais com o código do país desejado.
				</p>
			</div>
		</section>
	);
}

const faq = [
	{
		question: "Preciso salvar o contato para usar o link?",
		answer:
			"Não. O link wa.me abre o WhatsApp diretamente na conversa com o número informado, sem necessidade de adicionar à agenda.",
	},
	{
		question: "O link funciona no WhatsApp Web?",
		answer:
			"Sim. O link abre automaticamente no WhatsApp Web se você estiver usando o desktop, ou no aplicativo móvel se estiver no celular.",
	},
	{
		question: "Meus dados ficam seguros?",
		answer:
			"Sim. Tudo é processado no seu navegador. Nenhum número ou mensagem é enviado para nossos servidores.",
	},
];

export default function GeradorDeLinkWhatsAppPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/gerador-de-link-whatsapp"
			title="Gerador de Link do WhatsApp"
			description="Crie links wa.me para WhatsApp com número e mensagem pré-preenchida. Copie, abra direto ou gere QR Code."
			relatedTools={<RelatedTools currentHref="/ferramentas/gerador-de-link-whatsapp" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<WhatsAppLinkGenerator />
		</PageLayout>
	);
}
