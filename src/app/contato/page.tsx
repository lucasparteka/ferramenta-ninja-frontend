import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { StaticPage } from "@/components/shared/static-page";

const CONTACT_EMAIL = "contato@ferramenta.ninja";

export const metadata: Metadata = {
	title: "Contato",
	description:
		"Fale com a equipe do Ferramenta Ninja. Sugestões de novas ferramentas, correções e parcerias.",
	alternates: { canonical: "/contato" },
	openGraph: {
		title: "Contato — Ferramenta Ninja",
		description:
			"Sugestões, correções e parcerias. Fale com a equipe do Ferramenta Ninja.",
		url: "/contato",
		type: "website",
	},
};

export default function ContatoPage() {
	const contactSchema = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contato — Ferramenta Ninja",
		url: "https://ferramenta.ninja/contato",
		inLanguage: "pt-BR",
		mainEntity: {
			"@type": "Organization",
			name: "Ferramenta Ninja",
			email: CONTACT_EMAIL,
			contactPoint: {
				"@type": "ContactPoint",
				contactType: "customer support",
				email: CONTACT_EMAIL,
				availableLanguage: ["Portuguese"],
			},
		},
	};

	return (
		<StaticPage
			title="Contato"
			description="Sugestões, correções, parcerias ou dúvidas — fale com a gente."
			breadcrumbLabel="Contato"
			href="/contato"
		>
			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">E-mail</h2>
				<p>
					Para qualquer assunto, escreva para{" "}
					<a
						href={`mailto:${CONTACT_EMAIL}`}
						className="text-primary underline"
					>
						{CONTACT_EMAIL}
					</a>
					. Respondemos em até 5 dias úteis.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					O que escrever
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>
						<strong className="text-foreground">Erro em cálculo:</strong>{" "}
						informe a ferramenta, valores usados e resultado esperado. Vamos
						verificar contra a legislação ou fonte oficial.
					</li>
					<li>
						<strong className="text-foreground">Sugestão de ferramenta:</strong>{" "}
						descreva a tarefa que você precisa resolver. Priorizamos pelo volume
						de busca e utilidade.
					</li>
					<li>
						<strong className="text-foreground">Parcerias:</strong> propostas de
						conteúdo, embeds, integrações ou colaborações editoriais.
					</li>
					<li>
						<strong className="text-foreground">LGPD:</strong> exercício de
						direitos de titular previstos na Lei Geral de Proteção de Dados.
					</li>
				</ul>
			</section>

			<JsonLd data={contactSchema} />
		</StaticPage>
	);
}
