import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TabelaFipeClient } from "@/components/tools/tabela-fipe/tabela-fipe-client";

export const metadata: Metadata = {
	title: "Tabela FIPE Online | Ferramenta Ninja",
	description:
		"Consulte o preço médio de carros, motos e caminhões na Tabela FIPE atualizada. Pesquisa por marca, modelo e ano em segundos.",
	keywords: [
		"tabela fipe",
		"preço carro fipe",
		"consulta fipe",
		"fipe motos",
		"valor carro usado",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é a Tabela FIPE?
				</h2>
				<p>
					A Tabela FIPE é mantida pela Fundação Instituto de Pesquisas
					Econômicas e divulga mensalmente o preço médio de veículos novos e
					usados no mercado brasileiro. É a referência oficial usada por
					seguradoras, financiamentos e venda entre particulares.
				</p>
				<p className="mt-3">
					A consulta utiliza a base pública da BrasilAPI, que reflete os dados
					oficiais da FIPE atualizados a cada referência mensal.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Negociar compra e venda de veículos com referência justa.</li>
					<li>Calcular valor de seguro e cotação de financiamento.</li>
					<li>Avaliar depreciação ao longo do tempo.</li>
					<li>Conferir preço de carros, motos e caminhões.</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A consulta é gratuita?
						</h3>
						<p>Sim, sem cadastro e sem limite por usuário.</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O preço FIPE é o de venda?
						</h3>
						<p>
							Não. É um preço médio de mercado. O valor real pode variar conforme
							estado de conservação, quilometragem, opcionais e região.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que aparecem vários preços para o mesmo modelo?
						</h3>
						<p>
							Cada combinação de ano e combustível tem cotação própria. A FIPE
							trata, por exemplo, gasolina e flex como entradas diferentes.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function TabelaFipePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/tabela-fipe"
			title="Tabela FIPE Online"
			description="Consulte o preço médio de carros, motos e caminhões pela tabela oficial."
			relatedTools={<RelatedTools currentHref="/ferramentas/tabela-fipe" />}
			extraContent={<SeoContent />}
		>
			<TabelaFipeClient />
		</PageLayout>
	);
}
