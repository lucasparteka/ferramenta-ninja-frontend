import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { AgeCalculatorClient } from "@/components/tools/age-calculator/age-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de Idade e Diferença entre Datas | Ferramenta Ninja",
	description:
		"Calcule sua idade exata em anos, meses e dias, ou descubra a diferença entre duas datas. Inclui total de dias, semanas e horas vividas.",
	keywords: [
		"calculadora de idade",
		"idade exata",
		"diferença entre datas",
		"calcular idade",
		"dias vividos",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve a calculadora de idade
				</h2>
				<p>
					Calcule sua idade exata em anos, meses e dias a partir da data de
					nascimento. A ferramenta também mostra o total de dias vividos,
					semanas, horas e minutos, além de quantos dias faltam para o próximo
					aniversário.
				</p>
				<p className="mt-3">
					No modo &quot;Diferença entre datas&quot;, calcule o intervalo entre
					duas datas quaisquer — útil para tempo de serviço, contratos,
					relacionamentos e prazos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como o cálculo é feito
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Anos completos são contados; meses e dias residuais são ajustados
						considerando o tamanho real de cada mês.
					</li>
					<li>
						O total de dias é a diferença absoluta entre as duas datas, sem
						aproximações.
					</li>
					<li>O cálculo considera anos bissextos automaticamente.</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar uma data futura como referência?
						</h3>
						<p>
							Sim. Preencha o campo &quot;Data de referência&quot; com qualquer
							data posterior à de nascimento para descobrir a idade naquele dia.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A ferramenta funciona offline?
						</h3>
						<p>
							Sim. Todo cálculo é feito no navegador, nada é enviado a
							servidores.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso calcular tempo de serviço com isso?
						</h3>
						<p>
							Sim. No modo &quot;Diferença entre datas&quot;, informe a data de
							admissão e a de hoje (ou de saída) para obter o tempo total em
							anos, meses e dias.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function AgeCalculatorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-de-idade"
			title="Calculadora de Idade e Datas Online"
			description="Descubra sua idade exata ou calcule a diferença entre duas datas em segundos."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-idade" />
			}
			extraContent={<SeoContent />}
		>
			<AgeCalculatorClient />
		</PageLayout>
	);
}
