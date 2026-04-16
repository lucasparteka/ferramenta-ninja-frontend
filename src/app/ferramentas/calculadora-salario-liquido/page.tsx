import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { SalaryContent } from "@/components/tools/salary-calculator/salary-content";

export const metadata: Metadata = {
	title: "Calculadora de Salário Líquido | Ferramenta Ninja",
	description:
		"Calcule seu salário líquido com base no salário bruto, número de dependentes e descontos. Descubra quanto realmente vai para o seu bolso após INSS e IRRF.",
	keywords: [
		"salário líquido",
		"calculadora salário",
		"descontos INSS",
		"IRRF",
		"trabalhista",
		"folha de pagamento",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é salário líquido?
				</h2>
				<p>
					<strong className="text-foreground">Salário líquido</strong> é o valor
					que o funcionário recebe após os{" "}
					<strong className="text-foreground">
						descontos obrigatórios exigidos por lei
					</strong>
					, como INSS e Imposto de Renda. Além disso, inclui também descontos
					que dependem de cada empresa, como o vale-transporte e o plano de
					saúde. Após esses descontos serem aplicados sobre o salário bruto
					registrado em carteira, temos então o que chamamos de{" "}
					<strong className="text-foreground">salário líquido</strong>.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o INSS?
				</h2>
				<p>
					Sendo obrigatório, o <strong className="text-foreground">INSS</strong>{" "}
					é o desconto responsável por custear a aposentadoria, o
					auxílio-doença, a pensão, entre outros. A contribuição funciona de
					maneira <strong className="text-foreground">progressiva</strong>, ou
					seja, cada faixa salarial paga um percentual diferente apenas sobre o
					valor dentro daquela faixa.
				</p>
				<div className="overflow-x-auto mt-4">
					<table className="w-full border border-gray-200 text-sm text-left">
						<thead className="bg-gray-100">
							<tr>
								<th className="border border-gray-200 px-4 py-2">
									Faixa salarial (R$)
								</th>
								<th className="border border-gray-200 px-4 py-2">
									Alíquota (%)
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									Até 1.518,00
								</td>
								<td className="border border-gray-200 px-4 py-2">7,5%</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									1.518,01 até 2.793,88
								</td>
								<td className="border border-gray-200 px-4 py-2">9%</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									2.793,89 até 4.190,83
								</td>
								<td className="border border-gray-200 px-4 py-2">12%</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									4.190,84 até 8.157,41
								</td>
								<td className="border border-gray-200 px-4 py-2">14%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className="mt-4">
					Assim, os que recebem salários maiores têm as maiores alíquotas
					descontadas, enquanto quem recebe menos contribui com percentuais
					menores.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o IRRF?
				</h2>
				<p>
					O{" "}
					<strong className="text-foreground">
						IRRF (Imposto de Renda Retido na Fonte)
					</strong>{" "}
					é também obrigatório e é o imposto descontado diretamente do salário,
					baseado na renda mensal do funcionário e no número de dependentes.
					Esse imposto segue uma tabela progressiva, parecida com a do INSS,
					porém com deduções fixas por faixa de renda.
				</p>
				<div className="overflow-x-auto mt-4">
					<table className="w-full border border-gray-200 text-sm text-left">
						<thead className="bg-gray-100">
							<tr>
								<th className="border border-gray-200 px-4 py-2">
									Base de cálculo (R$)
								</th>
								<th className="border border-gray-200 px-4 py-2">
									Alíquota (%)
								</th>
								<th className="border border-gray-200 px-4 py-2">
									Parcela a deduzir (R$)
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									Até 2.428,80
								</td>
								<td className="border border-gray-200 px-4 py-2">Isento</td>
								<td className="border border-gray-200 px-4 py-2">0,00</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									2.428,81 até 2.826,65
								</td>
								<td className="border border-gray-200 px-4 py-2">7,5%</td>
								<td className="border border-gray-200 px-4 py-2">182,16</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									2.826,66 até 3.751,05
								</td>
								<td className="border border-gray-200 px-4 py-2">15%</td>
								<td className="border border-gray-200 px-4 py-2">394,16</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									3.751,06 até 4.664,68
								</td>
								<td className="border border-gray-200 px-4 py-2">22,5%</td>
								<td className="border border-gray-200 px-4 py-2">675,49</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2">
									Acima de 4.664,68
								</td>
								<td className="border border-gray-200 px-4 py-2">27,5%</td>
								<td className="border border-gray-200 px-4 py-2">908,73</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className="mt-4">
					Além da faixa salarial, o IRRF leva em conta deduções como dependentes
					e contribuições ao INSS. Essas deduções diminuem a base de cálculo,
					tornando o imposto um pouco mais justo conforme a situação do
					trabalhador.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas comuns sobre salário líquido
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O FGTS também deve entrar no cálculo do salário líquido?
						</h3>
						<p>
							Não. O <strong className="text-foreground">FGTS</strong> é uma
							contribuição feita pelo empregador, equivalente a{" "}
							<strong className="text-foreground">8% do salário bruto</strong>.
							Esse valor nunca deve ser descontado do trabalhador e também não
							reduz o salário líquido. Ele funciona por meio de depósito mensal
							em uma conta vinculada ao trabalhador, podendo ser sacado em casos
							específicos, como demissão sem justa causa, compra de imóvel ou
							aposentadoria.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais descontos não são obrigatórios?
						</h3>
						<p>
							Alguns descontos como{" "}
							<strong className="text-foreground">vale-transporte</strong>,{" "}
							<strong className="text-foreground">plano de saúde</strong> e{" "}
							<strong className="text-foreground">
								vale-refeição ou vale-alimentação
							</strong>{" "}
							são opcionais e dependem de cada empresa. No caso do
							vale-transporte, a empresa pode descontar até 6% do salário bruto.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que usar uma calculadora de salário líquido?
						</h3>
						<p>
							Uma{" "}
							<strong className="text-foreground">
								calculadora de salário líquido
							</strong>{" "}
							mostra de maneira simples o que um funcionário recebe após todos
							os descontos. Os cálculos de impostos muitas vezes podem ser
							complicados e confusos, e uma calculadora já considera todos esses
							valores pré-definidos.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h3 className="mb-2 text-lg font-semibold text-foreground">
					Veja também
				</h3>
				<Link
					href="/ferramentas/calculadora-adicional-noturno"
					className="text-primary underline underline-offset-4"
				>
					Calculadora de adicional noturno
				</Link>
			</section>
		</>
	);
}

export default function CalculadoraSalarioLiquidoPage() {
	return (
		<PageLayout
			title="Calculadora de Salário Líquido"
			description="Descubra quanto do seu salário você realmente recebe. Nossa calculadora considera os descontos de INSS, IRRF e dependentes para calcular o valor líquido."
			relatedTools={<RelatedTools currentHref="/ferramentas/calculadora-salario-liquido" />}
			extraContent={<SeoContent />}
		>
			<SalaryContent />
		</PageLayout>
	);
}
