import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { InventarioClient } from "@/components/tools/inventario/inventario-client";

export const metadata: Metadata = {
	title:
		"Planilha de Controle de Estoque para Imprimir Grátis | Ferramenta Ninja",
	description:
		"Crie sua planilha de controle de estoque personalizada online, grátis e pronta para imprimir em PDF. Adicione colunas, produtos e imprima sem instalar nada.",
	keywords: [
		"controle de estoque",
		"planilha de controle de estoque",
		"controle de estoque grátis",
		"planilha de estoque para imprimir",
		"controle de estoque simples",
		"planilha de estoque grátis",
		"controle manual de produtos",
		"controle de estoque para pequenos negócios",
		"controle de mercadoria simples",
		"modelo de controle de estoque para imprimir grátis",
		"ferramenta online simples de controle de estoque",
		"como controlar estoque sem software",
	],
	openGraph: {
		title:
			"Planilha de Controle de Estoque para Imprimir Grátis | Ferramenta Ninja",
		description:
			"Crie sua planilha de controle de estoque personalizada online, grátis e pronta para imprimir em PDF. Sem cadastro, sem instalação.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um controle de estoque?
				</h2>
				<p>
					O controle de estoque é o registro organizado de todos os produtos,
					materiais ou itens que uma empresa ou pessoa possui. Ele permite saber
					exatamente o que está disponível, em que quantidade e onde está
					localizado — evitando faltas, excessos e desperdícios.
				</p>
				<p className="mt-3">
					Mesmo para pequenos negócios ou uso doméstico, manter um inventário
					atualizado facilita compras, planejamento e organização geral.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar a ferramenta
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Configure o documento</strong>{" "}
						na aba "Geral": defina o título, escolha entre orientação retrato ou
						paisagem e selecione a cor do cabeçalho da tabela.
					</li>
					<li>
						<strong className="text-foreground">Personalize o cabeçalho</strong>{" "}
						na aba "Cabeçalho": edite os labels e valores dos campos como Data,
						Setor e Responsável, ou adicione novos campos.
					</li>
					<li>
						<strong className="text-foreground">Defina as colunas</strong> na
						aba "Colunas": renomeie, ajuste a largura ou adicione novas colunas
						conforme a necessidade.
					</li>
					<li>
						<strong className="text-foreground">Preencha os itens</strong> na
						aba "Itens": adicione cada produto com seus dados correspondentes a
						cada coluna.
					</li>
					<li>
						<strong className="text-foreground">Exporte em PDF ou PNG</strong> e
						imprima ou compartilhe onde precisar.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para quem é essa ferramenta?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Pequenos negócios:</strong>{" "}
						lojas, restaurantes, oficinas e qualquer estabelecimento que precise
						controlar mercadorias sem adotar um sistema complexo.
					</p>
					<p>
						<strong className="text-foreground">
							Profissionais autônomos:
						</strong>{" "}
						revendedores, costureiras, artesãos e outros que precisam de um
						inventário simples e rápido de preencher.
					</p>
					<p>
						<strong className="text-foreground">Uso doméstico:</strong> controle
						de alimentos, materiais de limpeza, medicamentos ou qualquer outro
						estoque pessoal.
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
							Sim. Tudo que você preencher é salvo automaticamente no
							localStorage do navegador. Ao reabrir a página, seus dados estarão
							intactos. Nenhuma informação é enviada a servidores externos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso adicionar quantas colunas quiser?
						</h3>
						<p>
							Sim. Você pode adicionar, renomear e remover colunas livremente.
							Ajuste a largura de cada coluna para que o layout fique adequado
							ao conteúdo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual orientação usar: retrato ou paisagem?
						</h3>
						<p>
							Para tabelas com muitas colunas, a orientação paisagem
							(horizontal) aproveita melhor o espaço e evita que colunas fiquem
							muito estreitas. Para poucos campos, o retrato é suficiente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Preciso instalar algum programa?
						</h3>
						<p>
							Não. A ferramenta funciona diretamente no navegador, sem
							necessidade de cadastro, instalação ou pagamento.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ControleDeEstoquePage() {
	return (
		<PageLayout
			title="Controle de Estoque e Inventario Grátis para Imprimir"
			description="Crie sua planilha de controle de estoque ou inventário personalizada. Adicione colunas, itens e exporte em PDF ou PNG para imprimir."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/controle-de-estoque" />
			}
			extraContent={<SeoContent />}
		>
			<InventarioClient />
		</PageLayout>
	);
}
