import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { RemoveDuplicates } from "@/components/tools/remove-duplicates/remove-duplicates";

export const metadata: Metadata = {
	title: "Remover Linhas Duplicadas Online Grátis | Ferramenta Ninja",
	description:
		"Remova linhas duplicadas de qualquer texto ou lista com um clique. Mantenha a ordem, ignore maiúsculas e limpe linhas vazias. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são linhas duplicadas?
				</h2>
				<p>
					Linhas duplicadas são entradas idênticas que aparecem mais de uma vez
					em um texto ou lista. Elas surgem com frequência ao copiar dados de
					planilhas, exportar relatórios, mesclar arquivos ou coletar respostas
					de formulários. Em listas grandes, identificar duplicatas manualmente
					é demorado e propenso a erros.
				</p>
				<p className="mt-3">
					Esta ferramenta analisa cada linha do texto inserido e mantém apenas a
					primeira ocorrência de cada entrada, descartando as repetições de
					forma instantânea.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que remover duplicatas?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Limpeza de dados:</strong>{" "}
						listas com entradas repetidas geram inconsistências em análises,
						relatórios e importações. Remover duplicatas é uma etapa fundamental
						em qualquer processo de tratamento de dados.
					</p>
					<p>
						<strong className="text-foreground">Organização:</strong> ao
						eliminar repetições, a lista fica mais curta, mais legível e mais
						fácil de revisar ou compartilhar.
					</p>
					<p>
						<strong className="text-foreground">Uso em desenvolvimento:</strong>{" "}
						desenvolvedores frequentemente precisam remover valores duplicados
						de listas de IDs, e-mails, URLs ou palavras-chave antes de processar
						os dados em scripts ou bancos de dados.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Limpar listas exportadas do Excel ou Google Sheets com entradas
						repetidas.
					</li>
					<li>Remover e-mails ou nomes duplicados de listas de contatos.</li>
					<li>
						Deduplificar listas de palavras-chave para SEO ou campanhas de
						anúncios.
					</li>
					<li>
						Preparar listas de IDs ou códigos únicos para importação em
						sistemas.
					</li>
					<li>
						Unificar resultados de múltiplas fontes eliminando entradas em
						comum.
					</li>
					<li>Limpar saídas de scripts e logs com linhas repetidas.</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Entendendo as opções da ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Ignorar maiúsculas e minúsculas:
						</strong>{" "}
						com esta opção ativa, "Maçã", "maçã" e "MAÇÃ" são tratadas como a
						mesma entrada e apenas uma delas é mantida. Útil para listas onde a
						capitalização é inconsistente.
					</p>
					<p>
						<strong className="text-foreground">Remover espaços:</strong> remove
						espaços no início e no fim de cada linha antes de comparar. Assim, "
						exemplo " e "exemplo" são considerados duplicatas e apenas um é
						mantido. Também elimina linhas em branco do resultado.
					</p>
					<p>
						<strong className="text-foreground">
							Ordenar resultados de A-Z:
						</strong>{" "}
						após remover as duplicatas, ordena a lista em ordem alfabética
						crescente. Útil para organizar listas de nomes, palavras-chave ou
						identificadores.
					</p>
					<p>
						<strong className="text-foreground">
							Ordenar resultados de Z-A:
						</strong>{" "}
						semelhante à opção anterior, mas em ordem decrescente. As duas
						opções de ordenação são mutuamente exclusivas — ativar uma desativa
						a outra automaticamente.
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
							Como remover linhas duplicadas de um texto?
						</h3>
						<p>
							Cole o texto ou lista no campo de entrada, ajuste as opções
							conforme necessário e clique em{" "}
							<strong>Remover duplicados</strong>. O resultado aparecerá
							imediatamente abaixo com o número de linhas removidas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que são duplicatas?
						</h3>
						<p>
							Duplicatas são linhas com conteúdo idêntico que aparecem mais de
							uma vez. A ferramenta mantém apenas a primeira ocorrência e
							descarta as repetições.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A ferramenta mantém a ordem original?
						</h3>
						<p>
							Sim, por padrão as linhas são mantidas na ordem em que aparecem no
							texto original. Para ordenar o resultado alfabeticamente, ative a
							opção "Ordenar resultados de A-Z" ou "Ordenar resultados de Z-A".
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar isso para dados do Excel?
						</h3>
						<p>
							Sim. Copie a coluna do Excel, cole no campo de entrada e processe.
							O resultado pode ser copiado de volta para o Excel ou qualquer
							outro sistema.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece diretamente no seu navegador.
							Nenhum dado é transmitido ou armazenado externamente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function RemoverDuplicadosPage() {
	return (
		<PageLayout
			title="Remover Linhas Duplicadas Online Grátis"
			description="Cole sua lista, remova entradas repetidas e obtenha apenas os valores únicos. Suporte a ordenação, comparação sem distinção de maiúsculas e remoção de linhas vazias."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/remover-duplicados" />
			}
			extraContent={<SeoContent />}
		>
			<RemoveDuplicates />
		</PageLayout>
	);
}
