import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";

const LAST_UPDATED = "26 de abril de 2026";

export const metadata: Metadata = {
	title: "Política de Privacidade",
	description:
		"Como o Ferramenta Ninja trata seus dados: processamento local no navegador, conformidade LGPD, sem cadastro nem rastreamento invasivo.",
	alternates: { canonical: "/politica-de-privacidade" },
	openGraph: {
		title: "Política de Privacidade — Ferramenta Ninja",
		description:
			"Tratamento de dados conforme LGPD. Processamento local no navegador.",
		url: "/politica-de-privacidade",
		type: "website",
	},
};

export default function PrivacidadePage() {
	return (
		<StaticPage
			title="Política de Privacidade"
			description="Como tratamos seus dados quando você usa o Ferramenta Ninja."
			breadcrumbLabel="Política de Privacidade"
			href="/politica-de-privacidade"
		>
			<p className="text-sm text-muted-foreground">
				Última atualização: {LAST_UPDATED}
			</p>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					1. Princípio fundamental
				</h2>
				<p>
					O Ferramenta Ninja foi desenhado para minimizar coleta de dados. A
					maior parte das ferramentas processa informações exclusivamente no seu
					navegador (client-side). Nada que você digita, cola ou envia em uma
					calculadora, gerador, validador ou conversor sai do seu computador.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					2. Dados que NÃO coletamos
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>Cadastro de usuário (não há login)</li>
					<li>
						Conteúdo que você processa nas ferramentas (textos, planilhas, PDFs,
						imagens, valores)
					</li>
					<li>E-mail, telefone ou outros dados pessoais</li>
					<li>Histórico de uso individual associado a você</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					3. Dados que coletamos
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>
						<strong className="text-foreground">
							Dados técnicos agregados
						</strong>{" "}
						(via analytics anonimizado): URL visitada, navegador, sistema
						operacional, idioma. Servem apenas para entender quais ferramentas
						são mais usadas e priorizar melhorias.
					</li>
					<li>
						<strong className="text-foreground">Logs de erro</strong>: quando
						uma ferramenta falha, registramos a mensagem técnica. Sem dados
						pessoais associados.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					4. Ferramentas que fazem requisições externas
				</h2>
				<p>
					Algumas ferramentas precisam consultar APIs públicas (ex.: Consulta
					CEP, Consulta CNPJ, Tabela FIPE). Nesses casos, apenas o identificador
					consultado (CEP, CNPJ ou código) é enviado para a API pública
					correspondente. Nenhum dado adicional seu é incluído.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">5. Cookies</h2>
				<p>
					Não usamos cookies de rastreamento publicitário nem cookies de
					terceiros para fins de marketing. Cookies técnicos podem ser usados
					para preferências locais (tema, último estado da ferramenta), todos
					armazenados no seu próprio navegador.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					6. Direitos do titular (LGPD)
				</h2>
				<p>
					A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante a você,
					titular de dados, os direitos de confirmação, acesso, correção,
					anonimização, portabilidade, eliminação e revogação de consentimento.
					Como praticamente não coletamos dados pessoais, a maioria desses
					direitos não se aplica. Para qualquer solicitação, escreva para{" "}
					<Link href="/contato" className="text-primary underline">
						contato
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					7. Alterações nesta política
				</h2>
				<p>
					Podemos atualizar esta política para refletir mudanças no produto ou
					em obrigações legais. A data da última atualização aparece no topo
					desta página.
				</p>
			</section>
		</StaticPage>
	);
}
