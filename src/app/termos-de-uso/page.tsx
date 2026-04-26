import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";

const LAST_UPDATED = "26 de abril de 2026";

export const metadata: Metadata = {
	title: "Termos de Uso",
	description:
		"Termos de uso do Ferramenta Ninja: condições, limitações de responsabilidade e regras de utilização das ferramentas online gratuitas.",
	alternates: { canonical: "/termos-de-uso" },
	openGraph: {
		title: "Termos de Uso — Ferramenta Ninja",
		description: "Condições e regras de utilização do Ferramenta Ninja.",
		url: "/termos-de-uso",
		type: "website",
	},
};

export default function TermosPage() {
	return (
		<StaticPage
			title="Termos de Uso"
			description="Condições para uso das ferramentas do Ferramenta Ninja."
			breadcrumbLabel="Termos de Uso"
			href="/termos-de-uso"
		>
			<p className="text-sm text-muted-foreground">
				Última atualização: {LAST_UPDATED}
			</p>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					1. Aceitação dos termos
				</h2>
				<p>
					Ao acessar ou usar qualquer ferramenta deste site você concorda com
					estes termos. Se discordar, não utilize o serviço.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					2. Natureza do serviço
				</h2>
				<p>
					As ferramentas são oferecidas gratuitamente, sem cadastro, em regime{" "}
					<em>"as is"</em> (no estado em que se encontram). Não garantimos
					disponibilidade contínua, ausência de erros ou adequação a um
					propósito específico.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					3. Uso permitido
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>Uso pessoal, profissional, educacional ou comercial</li>
					<li>Compartilhar links para as ferramentas</li>
					<li>
						Embedar resultados em outros sites, desde que com link de retorno
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					3.1. Uso vedado
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>
						Usar geradores de documentos (CPF, CNPJ, cartão de crédito) para
						fraude, abertura de cadastros falsos ou qualquer atividade ilícita.
						Os dados gerados são fictícios e existem exclusivamente para teste
						de software. Uso indevido configura crime previsto no Código Penal.
					</li>
					<li>
						Tentar comprometer segurança, infraestrutura ou indisponibilizar o
						serviço
					</li>
					<li>Reproduzir o site integralmente como concorrente direto</li>
					<li>Realizar scraping massivo que sobrecarregue a infraestrutura</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					4. Calculadoras: limitação de responsabilidade
				</h2>
				<p>
					Calculadoras trabalhistas, financeiras e de saúde são ferramentas de
					apoio e simulação. Os resultados não substituem assessoria contábil,
					jurídica ou médica profissional. Para decisões definitivas, consulte
					um especialista habilitado. Detalhes de fórmulas e fontes em{" "}
					<Link href="/metodologia" className="text-primary underline">
						metodologia
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					5. Propriedade intelectual
				</h2>
				<p>
					Marca, logotipo, copy editorial e código-fonte são de propriedade do
					Ferramenta Ninja e seus colaboradores. Resultados gerados pelas
					ferramentas (PDFs, textos, imagens) pertencem a você — sem watermark,
					sem restrição de uso.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					6. Privacidade
				</h2>
				<p>
					O tratamento de dados é detalhado em{" "}
					<Link
						href="/politica-de-privacidade"
						className="text-primary underline"
					>
						política de privacidade
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					7. Foro e legislação aplicável
				</h2>
				<p>
					Estes termos são regidos pela legislação brasileira. Fica eleito o
					foro da comarca de domicílio do titular do site para dirimir eventuais
					controvérsias.
				</p>
			</section>
		</StaticPage>
	);
}
