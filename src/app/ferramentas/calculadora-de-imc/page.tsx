import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { BmiCalculatorClient } from "@/components/tools/bmi-calculator/bmi-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de IMC Online | Ferramenta Ninja",
	description:
		"Calcule seu Índice de Massa Corporal (IMC) em segundos. Veja a classificação OMS e a faixa de peso saudável para sua altura.",
	keywords: [
		"calculadora imc",
		"índice de massa corporal",
		"imc online",
		"peso ideal",
		"calcular imc",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o IMC
				</h2>
				<p>
					O Índice de Massa Corporal (IMC) é um indicador internacional usado
					pela Organização Mundial da Saúde (OMS) para avaliar se uma pessoa
					está dentro do peso considerado saudável para sua altura. O cálculo é
					feito dividindo o peso (em kg) pela altura (em metros) ao quadrado.
				</p>
				<p className="mt-3">
					<strong className="text-foreground">Fórmula:</strong> IMC = peso (kg)
					÷ altura (m)².
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Classificação segundo a OMS
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Abaixo do peso: IMC menor que 18,5</li>
					<li>Peso normal: 18,5 a 24,9</li>
					<li>Sobrepeso: 25,0 a 29,9</li>
					<li>Obesidade grau I: 30,0 a 34,9</li>
					<li>Obesidade grau II: 35,0 a 39,9</li>
					<li>Obesidade grau III: 40,0 ou mais</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O IMC serve para todas as pessoas?
						</h3>
						<p>
							Não. O IMC é uma referência para adultos. Atletas, gestantes,
							crianças e idosos exigem avaliações específicas, pois massa
							muscular e composição corporal influenciam o resultado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O IMC sozinho diagnostica obesidade?
						</h3>
						<p>
							Não. É uma triagem inicial. Para diagnóstico completo, considere
							também circunferência abdominal, percentual de gordura e avaliação
							médica.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados são salvos?
						</h3>
						<p>
							Não. Todo o cálculo acontece no seu navegador, nada é enviado a
							servidores.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function BmiCalculatorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-de-imc"
			title="Calculadora de IMC"
			description="Informe peso e altura para descobrir seu IMC e a classificação segundo a OMS."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-imc" />
			}
			extraContent={<SeoContent />}
		>
			<BmiCalculatorClient />
		</PageLayout>
	);
}
