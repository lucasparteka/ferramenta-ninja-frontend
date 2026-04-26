import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { GooglePreviewTool } from "@/components/tools/google-preview/google-preview-tool";

export const metadata: Metadata = {
	title: "Prévia do Resultado do Google | Ferramenta Ninja",
	description:
		"Visualize como seu site aparece nos resultados de busca do Google antes de publicar. Simule o snippet com título, meta descrição e URL em tempo real.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a Prévia do Resultado do Google?
				</h2>
				<p>
					A ferramenta simula em tempo real como o seu site será exibido nos
					resultados de busca do Google. Você pode importar os dados diretamente
					de uma URL ou preenchê-los manualmente, ajustando o título, a meta
					descrição e a URL da página.
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Importar por URL:</strong>{" "}
						informe o endereço do site e a ferramenta busca automaticamente o
						título e a descrição cadastrados na página.
					</li>
					<li>
						<strong className="text-foreground">Edição manual:</strong> escreva
						ou ajuste os textos diretamente nos campos e veja o resultado
						atualizar instantaneamente.
					</li>
					<li>
						<strong className="text-foreground">
							Prévia desktop e mobile:
						</strong>{" "}
						alterne entre as visualizações para garantir que o snippet fique bem
						em todos os dispositivos.
					</li>
					<li>
						<strong className="text-foreground">
							Destaque de palavra-chave:
						</strong>{" "}
						informe a palavra-chave principal para visualizar como o Google pode
						destacá-la em negrito no resultado.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são título e meta descrição?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Título (title tag):</strong> é o
						texto clicável exibido em azul nos resultados do Google. Ele deve
						descrever com clareza o conteúdo da página e conter a palavra-chave
						principal. O tamanho ideal é entre 30 e 60 caracteres para que não
						seja cortado na exibição.
					</p>
					<p>
						<strong className="text-foreground">Meta descrição:</strong> é o
						trecho de texto exibido abaixo do título, que resume o conteúdo da
						página. Embora não seja um fator direto de ranqueamento, uma boa
						meta descrição influencia a taxa de cliques (CTR). O tamanho
						recomendado é de 120 a 160 caracteres.
					</p>
					<p>
						<strong className="text-foreground">URL exibida:</strong> o Google
						mostra uma versão simplificada do endereço da página, com o domínio
						e o caminho separados por "›". URLs limpas e descritivas transmitem
						confiança ao usuário.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que o tamanho do título e da descrição importa para o SEO?
				</h2>
				<div className="space-y-3">
					<p>
						O Google limita o espaço disponível para exibir o título e a
						descrição nos resultados de busca. Textos muito longos são cortados
						com reticências ("…"), o que pode prejudicar a legibilidade e
						reduzir os cliques. Textos muito curtos desperdiçam o espaço e
						perdem a oportunidade de comunicar o valor da página.
					</p>
					<p>
						Manter o título entre 30 e 60 caracteres garante que ele seja
						exibido por completo na maioria dos dispositivos. Para a meta
						descrição, o intervalo de 120 a 160 caracteres é suficiente para uma
						apresentação clara sem ser cortado.
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
							O Google sempre exibe o título e a descrição que cadastrei?
						</h3>
						<p>
							Não. O Google pode reescrever o título ou a descrição quando
							considera que o conteúdo da página é mais relevante para a busca
							do usuário do que o texto cadastrado. Por isso, é importante que
							os textos originais sejam claros e representativos do conteúdo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A meta descrição afeta o ranqueamento?
						</h3>
						<p>
							Não diretamente. A meta descrição não é um fator de ranqueamento
							do algoritmo do Google. No entanto, ela influencia a taxa de
							cliques (CTR), que pode impactar indiretamente a posição da página
							nos resultados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados são salvos ao usar a ferramenta?
						</h3>
						<p>
							Não. Todo o processamento ocorre diretamente no navegador. Nenhum
							texto digitado é enviado ou armazenado em servidores externos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que a prévia pode diferir do resultado real no Google?
						</h3>
						<p>
							O Google adapta dinamicamente o snippet exibido com base na
							consulta do usuário, no conteúdo da página e em outros fatores.
							Esta ferramenta simula o formato padrão do snippet, mas o
							resultado final pode variar conforme o contexto da busca.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function PreviaResultadoGooglePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/previa-resultado-google"
			title="Prévia do Resultado do Google"
			description="Simule como seu site aparece nos resultados de busca. Edite o título, a meta descrição e a URL e veja o snippet atualizar em tempo real."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/previa-resultado-google" />
			}
			extraContent={<SeoContent />}
		>
			<GooglePreviewTool />
		</PageLayout>
	);
}
