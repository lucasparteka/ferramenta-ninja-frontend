import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CsvToPdf } from "@/components/tools/csv-to-pdf/csv-to-pdf";

export const metadata: Metadata = {
	title: "Converter CSV para PDF Online Grátis | Ferramenta Ninja",
	description:
		"Converta arquivos CSV em PDF com tabela formatada diretamente no navegador. Sem cadastro, sem enviar dados — processamento 100% local.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a conversão de CSV para PDF
				</h2>
				<p>
					A ferramenta lê o arquivo CSV ou o conteúdo colado, detecta
					automaticamente o delimitador (vírgula, ponto e vírgula ou tabulação)
					e converte os dados em uma tabela formatada dentro de um documento
					PDF. Todo o processamento ocorre diretamente no seu navegador — nenhum
					dado é enviado a servidores externos.
				</p>
				<p className="mt-3">
					O PDF gerado contém apenas a tabela de dados, com cabeçalho repetido
					em cada página para facilitar a leitura quando impresso.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Como usar</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Carregue o CSV:</strong>{" "}
						arraste o arquivo para a área de upload ou clique para selecionar.
						Você também pode colar o conteúdo diretamente na caixa de texto.
					</p>
					<p>
						<strong className="text-foreground">2. Visualize os dados:</strong>{" "}
						clique em "Visualizar CSV" para confirmar que os dados foram
						interpretados corretamente. A prévia mostra a tabela paginada antes
						da geração do PDF.
					</p>
					<p>
						<strong className="text-foreground">3. Baixe o PDF:</strong> clique
						em "Baixar como PDF". O arquivo é gerado no navegador e salvo
						automaticamente com o mesmo nome do CSV original.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como a ferramenta lida com tabelas largas
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Orientação automática:</strong>{" "}
						arquivos com até 5 colunas são convertidos em formato retrato (A4
						vertical). Acima disso, o PDF é gerado em modo paisagem (A4
						horizontal) para aproveitar melhor a largura disponível.
					</p>
					<p>
						<strong className="text-foreground">Ajuste de fonte:</strong> para
						tabelas com muitas colunas, o tamanho da fonte é reduzido
						progressivamente (de 9pt até 7pt) de modo que mais colunas caibam na
						mesma página sem comprometer a legibilidade.
					</p>
					<p>
						<strong className="text-foreground">Seções horizontais:</strong>{" "}
						quando o número de colunas ultrapassa a capacidade de uma única
						página — mesmo em paisagem com fonte reduzida —, a ferramenta divide
						as colunas em grupos. Cada grupo ocupa um conjunto de páginas
						contendo todas as linhas de dados, seguindo o padrão adotado por
						ferramentas como Microsoft Excel ao imprimir planilhas largas.
					</p>
					<p>
						<strong className="text-foreground">Quebras de página:</strong> as
						quebras ocorrem sempre entre linhas de dados, nunca no meio de uma
						linha. O cabeçalho é repetido no topo de cada página.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Relatórios para impressão:
						</strong>{" "}
						transforme exportações de sistemas ERP, CRM ou planilhas em
						documentos PDF prontos para impressão, sem precisar abrir o Excel ou
						o Google Sheets.
					</p>
					<p>
						<strong className="text-foreground">Envio por e-mail:</strong>{" "}
						compartilhe dados tabulares em formato PDF, que preserva a
						formatação e pode ser aberto em qualquer dispositivo sem depender de
						software específico.
					</p>
					<p>
						<strong className="text-foreground">Arquivamento:</strong> converta
						planilhas de dados históricos em PDF para armazenamento de longo
						prazo, reduzindo a dependência de formatos proprietários.
					</p>
					<p>
						<strong className="text-foreground">
							Apresentações e reuniões:
						</strong>{" "}
						gere rapidamente um PDF de uma tabela de dados para incluir em
						apresentações ou distribuir em reuniões.
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
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento — leitura do CSV e geração do PDF —
							ocorre localmente no seu navegador. Nenhum dado é transmitido ou
							armazenado externamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais delimitadores são suportados?
						</h3>
						<p>
							A ferramenta detecta automaticamente vírgula (<code>,</code>),
							ponto e vírgula (<code>;</code>) e tabulação (<code>\t</code>) com
							base na primeira linha do arquivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O PDF gerado mantém a formatação da tabela?
						</h3>
						<p>
							Sim. O PDF inclui cabeçalho com fundo colorido, linhas alternadas
							para facilitar a leitura e separadores entre as linhas. O
							cabeçalho é repetido em todas as páginas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de linhas ou colunas?
						</h3>
						<p>
							Não há limite imposto pela ferramenta. O limite prático depende da
							memória disponível no dispositivo. Arquivos muito grandes podem
							levar alguns segundos a mais para gerar o PDF.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Campos com aspas ou delimitadores internos são suportados?
						</h3>
						<p>
							Sim. A ferramenta respeita o padrão RFC 4180: campos entre aspas
							duplas que contêm vírgulas, aspas escapadas (<code>""</code>) ou
							quebras de linha internas são interpretados corretamente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConverterCsvParaPdfPage() {
	return (
		<PageLayout
			title="Converter CSV para PDF Online Grátis"
			description="Converta arquivos CSV em um PDF com tabela formatada diretamente no navegador. Faça upload ou cole o CSV, visualize os dados e baixe o PDF — sem cadastro e sem enviar dados."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-csv-para-pdf" />
			}
			extraContent={<SeoContent />}
		>
			<CsvToPdf />
		</PageLayout>
	);
}
