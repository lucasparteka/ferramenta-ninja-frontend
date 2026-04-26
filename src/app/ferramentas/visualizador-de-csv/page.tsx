import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CsvViewer } from "@/components/tools/csv-viewer/csv-viewer";

export const metadata: Metadata = {
	title: "Visualizador de CSV Online Grátis | Ferramenta Ninja",
	description:
		"Visualize arquivos CSV como tabela formatada diretamente no navegador. Faça upload, cole o conteúdo, ordene colunas e navegue por páginas. Sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um arquivo CSV?
				</h2>
				<p>
					CSV (Comma-Separated Values) é um formato de arquivo de texto simples
					usado para armazenar dados tabulares — como planilhas e bancos de
					dados — em formato legível por qualquer editor de texto. Cada linha
					representa um registro e os valores de cada coluna são separados por
					um delimitador, geralmente vírgula, ponto e vírgula ou tabulação.
				</p>
				<p className="mt-3">
					Por ser um formato universal, o CSV é amplamente usado para exportar e
					importar dados entre sistemas diferentes: bancos de dados, planilhas,
					ERPs, ferramentas de análise e plataformas de e-commerce.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o Visualizador de CSV
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Carregue o arquivo:</strong>{" "}
						arraste um arquivo <code>.csv</code> para a área de upload ou clique
						para selecionar no seu dispositivo. Alternativamente, cole o
						conteúdo CSV diretamente na caixa de texto abaixo.
					</p>
					<p>
						<strong className="text-foreground">
							2. Clique em "Visualizar CSV":
						</strong>{" "}
						a ferramenta detecta automaticamente o delimitador (vírgula, ponto e
						vírgula ou tabulação) e renderiza os dados em uma tabela formatada.
					</p>
					<p>
						<strong className="text-foreground">3. Explore os dados:</strong>{" "}
						clique no cabeçalho de qualquer coluna para ordenar os dados em
						ordem crescente ou decrescente. Para arquivos com muitas linhas, use
						os controles de paginação para navegar entre as páginas.
					</p>
					<p>
						<strong className="text-foreground">4. Colunas longas:</strong>{" "}
						quando o arquivo possui muitas colunas, a tabela permite rolagem
						horizontal. Passe o cursor sobre células truncadas para ver o
						conteúdo completo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Verificação de exportações:
						</strong>{" "}
						confirme rapidamente se uma exportação de banco de dados ou planilha
						contém os dados esperados antes de importar em outro sistema.
					</p>
					<p>
						<strong className="text-foreground">Análise rápida:</strong>{" "}
						visualize relatórios exportados de ferramentas como Google
						Analytics, sistemas de ERP, plataformas de e-commerce ou CRMs sem
						precisar abrir um editor de planilhas.
					</p>
					<p>
						<strong className="text-foreground">Depuração de dados:</strong>{" "}
						identifique linhas com estrutura incorreta, campos ausentes ou
						valores inesperados em arquivos CSV recebidos de terceiros.
					</p>
					<p>
						<strong className="text-foreground">
							Compartilhamento em reuniões:
						</strong>{" "}
						abra e apresente dados tabulares diretamente no navegador, sem
						depender de software instalado.
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
							Quais delimitadores são suportados?
						</h3>
						<p>
							A ferramenta detecta automaticamente o delimitador mais provável
							com base na primeira linha do arquivo. São suportados vírgula (
							<code>,</code>), ponto e vírgula (<code>;</code>) e tabulação (
							<code>\t</code>).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de tamanho ou número de linhas?
						</h3>
						<p>
							Não há limite imposto pela ferramenta. O limite prático depende da
							memória disponível no seu dispositivo. Para arquivos com mais de
							10.000 linhas, a ferramenta exibe um aviso e mantém a paginação
							ativa para garantir boa performance de navegação.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre localmente no seu navegador.
							Nenhum dado é transmitido ou armazenado em servidores externos,
							garantindo total privacidade mesmo para arquivos com informações
							sensíveis.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que acontece com linhas que têm número de colunas diferente?
						</h3>
						<p>
							Linhas com número de colunas diferente do cabeçalho são ignoradas
							durante a renderização. A ferramenta exibe uma contagem das linhas
							ignoradas para que você possa identificar e corrigir
							inconsistências no arquivo original.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Campos com vírgulas ou quebras de linha são suportados?
						</h3>
						<p>
							Sim. A ferramenta respeita o padrão RFC 4180: campos que contêm o
							delimitador, aspas ou quebras de linha devem estar entre aspas
							duplas no arquivo CSV, e a ferramenta os interpretará
							corretamente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function VisualizadorDeCsvPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/visualizador-de-csv"
			title="Visualizador de CSV Online Grátis"
			description="Visualize arquivos CSV como tabela formatada diretamente no navegador. Faça upload ou cole o conteúdo, ordene colunas e navegue pelas páginas — sem cadastro e sem enviar dados."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/visualizador-de-csv" />
			}
			extraContent={<SeoContent />}
		>
			<CsvViewer />
		</PageLayout>
	);
}
