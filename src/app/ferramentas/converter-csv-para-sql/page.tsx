import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CsvToSql } from "@/components/tools/csv-to-sql/csv-to-sql";

export const metadata: Metadata = {
	title: "Converter CSV para SQL Online Grátis | Ferramenta Ninja",
	description:
		"Converta arquivos CSV em comandos SQL INSERT diretamente no navegador. Suporte a MySQL, PostgreSQL, SQLite, Oracle e SQL Server. Sem cadastro, sem enviar dados.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a conversão de CSV para SQL
				</h2>
				<p>
					A ferramenta lê o arquivo CSV ou o conteúdo colado, detecta
					automaticamente o delimitador (vírgula, ponto e vírgula ou tabulação)
					e gera comandos <code>INSERT INTO</code> para cada linha de dados.
					Opcionalmente, também gera o comando <code>CREATE TABLE</code> com as
					colunas do cabeçalho. Todo o processamento ocorre localmente no seu
					navegador — nenhum dado é transmitido a servidores externos.
				</p>
				<p className="mt-3">
					O SQL gerado pode ser copiado para a área de transferência ou baixado
					como arquivo <code>.sql</code>, pronto para execução no banco de dados
					de sua escolha.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Como usar</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							1. Configure a conversão:
						</strong>{" "}
						informe o nome da tabela de destino e selecione o dialeto SQL
						correspondente ao seu banco de dados.
					</p>
					<p>
						<strong className="text-foreground">2. Carregue o CSV:</strong>{" "}
						arraste o arquivo para a área de upload ou clique para selecionar.
						Você também pode colar o conteúdo diretamente na caixa de texto.
					</p>
					<p>
						<strong className="text-foreground">3. Ajuste as opções:</strong>{" "}
						marque "Incluir CREATE TABLE" para gerar o script de criação da
						tabela junto com os inserts. Marque "Tratar campos vazios como NULL"
						para converter células em branco em <code>NULL</code> em vez de
						string vazia.
					</p>
					<p>
						<strong className="text-foreground">4. Converta:</strong> clique em
						"Converter para SQL". O resultado aparece abaixo com botões para
						copiar ou baixar o arquivo <code>.sql</code>.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Diferenças entre os dialetos
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">MySQL:</strong> identificadores
						entre crases (<code>`coluna`</code>). Tipo de coluna padrão:{" "}
						<code>TEXT</code>. Compatível com MariaDB.
					</p>
					<p>
						<strong className="text-foreground">PostgreSQL:</strong>{" "}
						identificadores entre aspas duplas (<code>"coluna"</code>). Tipo de
						coluna padrão: <code>TEXT</code>. Compatível com CockroachDB e
						outros bancos compatíveis com PostgreSQL.
					</p>
					<p>
						<strong className="text-foreground">SQLite:</strong> mesma sintaxe
						do PostgreSQL para identificadores. Tipo de coluna padrão:{" "}
						<code>TEXT</code>. Ideal para bancos de dados locais e aplicações
						embarcadas.
					</p>
					<p>
						<strong className="text-foreground">Oracle:</strong> identificadores
						entre aspas duplas. Tipo de coluna padrão:{" "}
						<code>VARCHAR2(4000)</code>, o tipo de texto mais comum em Oracle
						Database.
					</p>
					<p>
						<strong className="text-foreground">SQL Server:</strong>{" "}
						identificadores entre colchetes (<code>[coluna]</code>). Tipo de
						coluna padrão: <code>NVARCHAR(MAX)</code>, com suporte a Unicode.
						Compatível com Azure SQL Database.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Migração de dados:</strong>{" "}
						exporte dados de planilhas ou sistemas legados em CSV e importe-os
						diretamente em qualquer banco de dados relacional sem ferramentas
						adicionais.
					</p>
					<p>
						<strong className="text-foreground">Seed de banco de dados:</strong>{" "}
						gere scripts de seed para popular tabelas em ambientes de
						desenvolvimento ou teste a partir de arquivos CSV mantidos pela
						equipe.
					</p>
					<p>
						<strong className="text-foreground">Prototipagem rápida:</strong>{" "}
						crie a estrutura de uma tabela e insira dados iniciais em segundos,
						acelerando o início de novos projetos.
					</p>
					<p>
						<strong className="text-foreground">
							Integração entre sistemas:
						</strong>{" "}
						converta exportações de ERPs, CRMs ou planilhas em scripts SQL
						prontos para execução, sem depender de ferramentas pagas de ETL.
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
							Não. Todo o processamento — leitura do CSV e geração do SQL —
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
							Campos numéricos recebem aspas no SQL?
						</h3>
						<p>
							Não. A ferramenta detecta automaticamente valores numéricos
							(inteiros e decimais) e os insere sem aspas no SQL gerado. Valores
							não numéricos são sempre envolvidos em aspas simples com escape
							correto.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como aspas simples dentro dos dados são tratadas?
						</h3>
						<p>
							Aspas simples nos valores são escapadas como <code>''</code> (dois
							apóstrofos), seguindo o padrão SQL ANSI compatível com todos os
							dialetos suportados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de linhas?
						</h3>
						<p>
							Não há limite imposto pela ferramenta. O limite prático depende da
							memória disponível no dispositivo. Para arquivos muito grandes, a
							geração pode levar alguns segundos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O CREATE TABLE gerado é adequado para produção?
						</h3>
						<p>
							O <code>CREATE TABLE</code> gerado usa o tipo de texto padrão para
							cada dialeto e serve como ponto de partida. Para uso em produção,
							revise os tipos de dados de cada coluna de acordo com os valores
							reais (inteiros, datas, booleanos etc.) antes de executar o
							script.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConverterCsvParaSqlPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-csv-para-sql"
			title="Converter CSV para SQL Online Grátis"
			description="Converta arquivos CSV em comandos SQL INSERT diretamente no navegador. Suporte a MySQL, PostgreSQL, SQLite, Oracle e SQL Server — sem cadastro e sem enviar dados."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-csv-para-sql" />
			}
			extraContent={<SeoContent />}
		>
			<CsvToSql />
		</PageLayout>
	);
}
