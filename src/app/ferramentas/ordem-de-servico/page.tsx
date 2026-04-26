import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { OrdemServicoClient } from "@/components/tools/ordem-servico/ordem-servico-client";

export const metadata: Metadata = {
	title: "Criador de Ordem de Serviço Grátis | Ferramenta Ninja",
	description:
		"Crie ordens de serviço profissionais online. Preencha os dados do prestador, cliente e itens e exporte em PDF ou PNG gratuitamente, sem cadastro.",
	keywords: [
		"ordem de serviço",
		"ordem de serviço grátis",
		"gerar ordem de serviço online",
		"modelo ordem de serviço PDF",
		"OS online",
		"ordem de serviço para imprimir",
		"criador de OS",
		"formulário ordem de serviço",
	],
	openGraph: {
		title: "Criador de Ordem de Serviço Grátis | Ferramenta Ninja",
		description:
			"Crie ordens de serviço profissionais online. Preencha os dados e exporte em PDF ou PNG. Sem cadastro.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é uma ordem de serviço?
				</h2>
				<p>
					Uma ordem de serviço (OS) é um documento formal que registra a
					solicitação de um serviço a ser realizado. Ela contém os dados do
					prestador, do cliente, a descrição do serviço, os itens utilizados e o
					valor total. É amplamente usada por profissionais autônomos, oficinas
					mecânicas, técnicos de informática, empresas de manutenção e
					prestadores de serviços em geral.
				</p>
				<p className="mt-3">
					Ter uma OS bem elaborada garante transparência na relação entre
					cliente e prestador, serve como comprovante de serviço e facilita a
					organização financeira do negócio.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o criador de ordem de serviço
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						<strong className="text-foreground">
							Preencha os dados do prestador
						</strong>{" "}
						na aba "Dados": nome ou empresa, CNPJ/CPF e endereço.
					</li>
					<li>
						<strong className="text-foreground">
							Informe os dados do cliente
						</strong>
						: nome, telefone de contato e e-mail se necessário.
					</li>
					<li>
						<strong className="text-foreground">Descreva o serviço</strong> com
						título, descrição, data de abertura, prazo e forma de pagamento.
					</li>
					<li>
						<strong className="text-foreground">
							Adicione os itens e serviços
						</strong>{" "}
						na aba "Itens": descrição, quantidade e valor unitário. O total é
						calculado automaticamente.
					</li>
					<li>
						<strong className="text-foreground">Baixe em PDF ou PNG</strong> e
						compartilhe com seu cliente ou imprima.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para quem é essa ferramenta?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Técnicos e autônomos:</strong>{" "}
						eletricistas, encanadores, técnicos de informática, mecânicos e
						outros profissionais que precisam emitir ordens de serviço
						rapidamente.
					</p>
					<p>
						<strong className="text-foreground">Pequenas empresas:</strong>{" "}
						oficinas, empresas de manutenção predial, assistências técnicas e
						prestadores de serviços que buscam praticidade sem precisar de
						software específico.
					</p>
					<p>
						<strong className="text-foreground">Freelancers:</strong>{" "}
						profissionais que querem documentar seus serviços de forma
						profissional sem custo adicional.
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
							Os dados ficam salvos?
						</h3>
						<p>
							Sim. Todas as informações preenchidas são salvas automaticamente
							no seu navegador (localStorage). Isso significa que, ao voltar
							para a página, seus dados estarão disponíveis para continuar de
							onde parou. Os dados ficam apenas no seu dispositivo e não são
							enviados a nenhum servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre PDF e PNG?
						</h3>
						<p>
							O PDF é recomendado para impressão e envio formal, pois mantém
							qualidade consistente em qualquer dispositivo. O PNG é uma imagem
							de alta resolução, ideal para compartilhar digitalmente ou inserir
							em documentos e apresentações.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso criar múltiplas ordens de serviço?
						</h3>
						<p>
							No momento, o editor mantém uma OS por vez no navegador. Para
							criar outra, baixe o arquivo da OS atual e preencha os novos
							dados. O número da OS é gerado automaticamente a cada nova sessão.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							É necessário fazer cadastro?
						</h3>
						<p>
							Não. A ferramenta é completamente gratuita e não requer cadastro,
							login ou qualquer tipo de conta. Basta preencher e baixar.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function OrdemDeServicoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/ordem-de-servico"
			title="Criador de Ordem de Serviço"
			description="Crie ordens de serviço profissionais com dados do prestador, cliente e itens. Exporte em PDF ou PNG gratuitamente."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/ordem-de-servico" />
			}
			extraContent={<SeoContent />}
		>
			<OrdemServicoClient />
		</PageLayout>
	);
}
