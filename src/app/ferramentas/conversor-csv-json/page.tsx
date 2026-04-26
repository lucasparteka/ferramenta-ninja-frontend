import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CsvJsonConverter } from "@/components/tools/csv-json/csv-json-converter";

export const metadata: Metadata = {
	title: "Conversor CSV para JSON Online Grátis | Ferramenta Ninja",
	description:
		"Converta CSV para JSON e JSON para CSV com validação visual. Detecte erros, colunas inválidas e formatação quebrada diretamente no navegador.",
	keywords: [
		"csv para json",
		"json para csv",
		"converter csv json",
		"csv to json",
		"validar csv",
		"corrigir csv",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um conversor CSV para JSON?
				</h2>
				<p>
					O <strong className="text-foreground">conversor CSV para JSON</strong>{" "}
					transforma dados estruturados em formato de tabela (CSV) para o
					formato <strong className="text-foreground">JSON</strong>, amplamente
					utilizado em APIs e aplicações web.
				</p>
				<p className="mt-3">
					Além da conversão, esta ferramenta realiza{" "}
					<strong className="text-foreground">validação visual</strong>,
					identificando erros como colunas inconsistentes, aspas inválidas e
					delimitadores incorretos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o conversor
				</h2>
				<ol className="list-decimal space-y-3 pl-6">
					<li>Cole ou carregue seu arquivo CSV ou JSON</li>
					<li>Escolha o tipo de conversão</li>
					<li>Visualize o resultado formatado</li>
					<li>Corrija erros detectados automaticamente</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Exemplos de uso
				</h2>
				<p>
					<strong className="text-foreground">Integração com APIs:</strong>{" "}
					converta planilhas CSV em JSON para uso em sistemas web.
				</p>
				<p>
					<strong className="text-foreground">Debug de dados:</strong>{" "}
					identifique problemas em arquivos CSV quebrados.
				</p>
				<p>
					<strong className="text-foreground">Importação de dados:</strong>{" "}
					prepare arquivos para bancos de dados e sistemas.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="font-semibold text-foreground">
							Meus dados são enviados para servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece localmente no seu navegador.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-foreground">
							O CSV precisa ter cabeçalho?
						</h3>
						<p>
							Não necessariamente. Você pode configurar se a primeira linha será
							usada como chave do JSON.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function Page() {
	return (
		<PageLayout
			toolHref="/ferramentas/conversor-csv-json"
			title="Conversor CSV ↔ JSON"
			description="Converta CSV em JSON ou JSON em CSV com validação visual e correção de erros."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/conversor-csv-json" />
			}
			extraContent={<SeoContent />}
		>
			<CsvJsonConverter />
		</PageLayout>
	);
}
