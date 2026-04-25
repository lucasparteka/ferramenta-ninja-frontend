import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { NumeroPorExtensoClient } from "@/components/tools/numero-por-extenso/numero-por-extenso-client";

export const metadata: Metadata = {
	title: "Número por Extenso em Reais | Ferramenta Ninja",
	description:
		"Converta qualquer valor em reais para extenso com as regras de plural e concordância do português. Ideal para cheques, recibos e contratos.",
	keywords: [
		"número por extenso",
		"valor por extenso",
		"reais por extenso",
		"cheque por extenso",
		"conversor de número",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve o número por extenso
				</h2>
				<p>
					Escrever um valor por extenso é obrigatório em diversos documentos:
					cheques, recibos, contratos, notas promissórias e declarações. Escrito
					à mão, o extenso evita fraudes (alguém alterar o algarismo não
					consegue mudar também o texto).
				</p>
				<p className="mt-3">
					Nossa ferramenta gera o extenso seguindo as regras do português
					brasileiro: uso correto de &quot;e&quot;, plural de reais e centavos,
					concordância das centenas e os casos especiais de{" "}
					<strong className="text-foreground">cem</strong> e{" "}
					<strong className="text-foreground">mil</strong>.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Exemplos de conversão
				</h2>
				<ul className="list-disc space-y-1 pl-6">
					<li>
						<strong className="text-foreground">R$ 1,00</strong> → um real
					</li>
					<li>
						<strong className="text-foreground">R$ 100,00</strong> → cem reais
					</li>
					<li>
						<strong className="text-foreground">R$ 1.234,56</strong> → mil,
						duzentos e trinta e quatro reais e cinquenta e seis centavos
					</li>
					<li>
						<strong className="text-foreground">R$ 1.000.000,00</strong> → um
						milhão de reais (ou um milhão e... quando há fração)
					</li>
					<li>
						<strong className="text-foreground">R$ 0,50</strong> → cinquenta
						centavos
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar para cheques?
						</h3>
						<p>
							Sim. O texto gerado segue o padrão aceito por bancos. Escreva-o no
							campo &quot;por extenso&quot; do cheque exatamente como é exibido
							aqui.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Serve também para contratos?
						</h3>
						<p>
							Sim. Em contratos é comum escrever valores no formato{" "}
							<em>
								R$ 1.234,56 (mil, duzentos e trinta e quatro reais e cinquenta e
								seis centavos)
							</em>
							. Basta copiar a saída e colar entre parênteses.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso converter números sem virar reais?
						</h3>
						<p>
							Sim. Desmarque a opção &quot;Incluir reais e centavos&quot; para
							obter apenas o número escrito por extenso.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Até quanto a ferramenta suporta?
						</h3>
						<p>
							A conversão funciona até a casa dos trilhões, mais que suficiente
							para qualquer documento financeiro.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function NumeroPorExtensoPage() {
	return (
		<PageLayout
			title="Número por Extenso em Reais"
			description="Digite um valor e receba a versão escrita em extenso pronta para cheques, contratos e recibos."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/numero-por-extenso" />
			}
			extraContent={<SeoContent />}
		>
			<NumeroPorExtensoClient />
		</PageLayout>
	);
}
