import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ChecklistClient } from "@/components/tools/checklist/checklist-client";

export const metadata: Metadata = {
	title: "Checklist Personalizado para Imprimir | Ferramenta Ninja",
	description:
		"Crie e imprima checklists personalizados gratuitamente. Templates prontos para compras, limpeza, tarefas e viagem. Exporte em PDF ou PNG, sem cadastro.",
	keywords: [
		"checklist para imprimir",
		"checklist personalizado",
		"lista de tarefas imprimir",
		"checklist online grátis",
		"criar checklist",
		"lista de compras para imprimir",
		"checklist de viagem",
		"checklist de limpeza",
		"to do list imprimir",
	],
	openGraph: {
		title: "Checklist Personalizado para Imprimir | Ferramenta Ninja",
		description:
			"Crie checklists personalizados com templates prontos. Exporte em PDF ou PNG, pronto para imprimir. Sem cadastro, sem instalação.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um checklist?
				</h2>
				<p>
					Um checklist é uma lista de verificação usada para garantir que todas
					as tarefas ou itens necessários sejam lembrados e concluídos. É uma
					das ferramentas de organização mais simples e eficazes que existem,
					usada em contextos como compras, viagens, limpeza, reuniões e
					planejamento diário.
				</p>
				<p className="mt-3">
					Com um checklist impresso, você tem controle visual imediato do que já
					foi feito e do que ainda precisa ser concluído, sem depender de
					aplicativos ou tecnologia.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o criador de checklist
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Escolha um template</strong> que
						mais se aproxima da sua necessidade — compras, limpeza, viagem,
						tarefas ou reunião.
					</li>
					<li>
						<strong className="text-foreground">
							Edite o título e os itens
						</strong>{" "}
						conforme sua necessidade. Adicione, remova ou modifique os textos
						livremente.
					</li>
					<li>
						<strong className="text-foreground">Ajuste o layout</strong>{" "}
						escolhendo o número de colunas, espaçamento, tamanho de fonte e
						opções de caixas de seleção e divisores.
					</li>
					<li>
						<strong className="text-foreground">Baixe em PDF ou PNG</strong> e
						imprima em papel A4 na sua impressora doméstica ou em uma gráfica.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um checklist personalizado?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Lista de compras:</strong>{" "}
						organize os itens do mercado em duas colunas para facilitar a
						leitura e evitar esquecimentos.
					</p>
					<p>
						<strong className="text-foreground">Limpeza da casa:</strong>{" "}
						distribua as tarefas de forma clara com divisores entre os itens,
						tornando mais fácil acompanhar o progresso.
					</p>
					<p>
						<strong className="text-foreground">Planejamento de viagem:</strong>{" "}
						crie uma lista de malas e documentos para não esquecer nada
						importante antes de embarcar.
					</p>
					<p>
						<strong className="text-foreground">Tarefas do dia:</strong> comece
						cada dia com um plano claro, marcando cada item conforme conclui.
					</p>
					<p>
						<strong className="text-foreground">Reuniões:</strong> use como
						pauta impressa para manter a reunião focada e registrar os pontos
						discutidos.
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
							Como imprimir o checklist?
						</h3>
						<p>
							Baixe o arquivo em PDF ou PNG e abra na sua impressora. Configure
							o papel para A4 e, para melhor resultado, desative as margens
							automáticas da impressora (opção "sem margens" ou "ajustar à
							página"). O checklist já inclui margens internas adequadas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso personalizar os itens livremente?
						</h3>
						<p>
							Sim. Você pode editar o texto de qualquer item, adicionar novos
							itens clicando em "Adicionar item" ou remover itens existentes
							pelo botão de exclusão. O template serve apenas como ponto de
							partida.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre PDF e PNG?
						</h3>
						<p>
							O PDF é recomendado para impressão, pois mantém qualidade vetorial
							e é compatível com qualquer impressora. O PNG é uma imagem no
							formato A4 com resolução de 150 DPI, ideal para compartilhar
							digitalmente ou inserir em outros documentos.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ChecklistPersonalizadoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/checklist-personalizado"
			title="Checklist Personalizado para Imprimir"
			description="Crie checklists personalizados com templates prontos para compras, limpeza, viagem e mais. Exporte em PDF ou PNG e imprima em A4."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/checklist-personalizado" />
			}
			extraContent={<SeoContent />}
		>
			<ChecklistClient />
		</PageLayout>
	);
}
