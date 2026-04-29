import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { EmailSignature } from "@/components/tools/email-signature/email-signature";

export const metadata: Metadata = {
	title: "Assinatura de Email Profissional — Criar Grátis | Ferramenta Ninja",
	description:
		"Crie assinaturas de email profissionais gratuitamente. Templates modernos, com foto, redes sociais e exportação HTML para Gmail, Outlook e Apple Mail.",
};

const faq = [
	{
		question: "Como usar a assinatura no Gmail?",
		answer:
			"Copie o HTML gerado, vá em Configurações > Assinatura no Gmail e cole o conteúdo. Você também pode baixar o arquivo HTML e abrir no navegador para copiar manualmente.",
	},
	{
		question: "A assinatura funciona no Outlook?",
		answer:
			"Sim! O template 'Clássico' é 100% compatível com Outlook Desktop usando tabelas HTML. Os demais templates funcionam no Outlook 365 e Outlook Web.",
	},
	{
		question: "Posso adicionar minha foto?",
		answer:
			"Sim, o template 'Com Foto' permite fazer upload da sua imagem. A foto será exibida em formato circular ao lado das suas informações.",
	},
	{
		question: "É gratuito?",
		answer:
			"Sim, a ferramenta é 100% gratuita e funciona diretamente no navegador. Nenhum dado é enviado para servidores.",
	},
	{
		question: "Posso usar a assinatura comercialmente?",
		answer:
			"Sim, as assinaturas geradas são livres para uso pessoal e comercial sem restrições.",
	},
];

function SeoContent() {
	return (
		<>
			<section className="space-y-3">
				<h2 className="text-xl font-bold text-foreground">
					Por que ter uma assinatura de email profissional?
				</h2>
				<p className="text-muted-foreground">
					Uma assinatura de email bem elaborada transmite credibilidade,
					fortalece a identidade da marca e facilita o contato. Em emails
					corporativos, ela funciona como um cartão de visitas digital que
					reforça a imagem profissional do remetente.
				</p>
			</section>
			<section className="space-y-3">
				<h2 className="text-xl font-bold text-foreground">
					Templates para todos os estilos
				</h2>
				<p className="text-muted-foreground">
					Oferecemos 6 templates diferentes: Minimalista (texto puro),
					Profissional (com divisória), Moderno (borda lateral), Clássico (100%
					compatível com Outlook), Com Foto (avatar circular) e Com Banner
					(imagem superior). Escolha o que melhor representa sua marca ou estilo
					pessoal.
				</p>
			</section>
			<section className="space-y-3">
				<h2 className="text-xl font-bold text-foreground">
					Compatibilidade garantida
				</h2>
				<p className="text-muted-foreground">
					Todas as assinaturas são geradas em HTML inline, o formato mais
					compatível com clientes de email. O template Clássico utiliza tabelas
					HTML para máxima compatibilidade com Outlook Desktop. Os outros
					templates funcionam perfeitamente no Gmail, Outlook 365, Apple Mail e
					Thunderbird.
				</p>
			</section>
		</>
	);
}

export default function AssinaturaEmailPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/assinatura-de-email"
			title="Assinatura de Email Profissional"
			description="Crie assinaturas profissionais com templates, foto, redes sociais e exportação HTML/PNG. Compatível com Gmail, Outlook e Apple Mail."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/assinatura-de-email" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<EmailSignature />
		</PageLayout>
	);
}
