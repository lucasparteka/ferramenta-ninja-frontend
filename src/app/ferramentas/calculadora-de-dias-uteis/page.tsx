import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { BusinessDaysCalculator } from "@/components/tools/business-days-calculator/business-days-calculator";

export const metadata: Metadata = {
	title: "Calculadora de Dias Úteis Online | Ferramenta Ninja",
	description:
		"Calcule dias úteis entre duas datas ou adicione dias úteis a uma data. Inclui feriados nacionais brasileiros e facultativos. Gratuito e sem cadastro.",
	keywords: [
		"calculadora de dias úteis",
		"dias úteis brasil",
		"feriados nacionais",
		"dias corridos",
		"prazo dias úteis",
		"calendário comercial",
	],
};

const faq = [
	{
		question: "Quais feriados estão incluídos no cálculo?",
		answer:
			"Todos os feriados nacionais fixos (1º de Janeiro, Tiradentes, Dia do Trabalhador, Independência, Aparecida, Finados, Proclamação da República, Consciência Negra e Natal) e os feriados móveis (Carnaval, Sexta-feira Santa e Corpus Christi).",
	},
	{
		question: "O que são feriados facultativos?",
		answer:
			"São datas em que o funcionalismo público e algumas empresas não trabalham, mas não são obrigatórias para o setor privado. Incluímos: Dia do Servidor Público (28/10), Véspera de Natal (24/12) e Véspera de Ano-Novo (31/12). Você pode optar por contabilizá-los ou não.",
	},
	{
		question: "Como calcular 'daqui a 10 dias úteis'?",
		answer:
			"Use a aba 'Adicionar dias úteis'. Informe a data inicial e a quantidade de dias úteis. A ferramenta mostra a data final, considerando fins de semana e feriados.",
	},
	{
		question: "A calculadora considera feriados estaduais e municipais?",
		answer:
			"Não. Apenas feriados nacionais estão incluídos. Para cálculos que envolvam feriados locais, adicione manualmente os dias ao resultado.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a calculadora de dias úteis
				</h2>
				<p>
					Esta ferramenta calcula a quantidade de dias úteis entre duas datas ou
					encontra a data resultante ao adicionar um número de dias úteis. O
					cálculo desconta automaticamente sábados, domingos e feriados
					nacionais brasileiros conforme a legislação vigente.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Feriados nacionais considerados
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-border">
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Data
								</th>
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Feriado
								</th>
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Tipo
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-border">
								<td className="px-3 py-2">1º de janeiro</td>
								<td className="px-3 py-2">Confraternização Universal</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">21 de abril</td>
								<td className="px-3 py-2">Tiradentes</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">1º de maio</td>
								<td className="px-3 py-2">Dia do Trabalhador</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">7 de setembro</td>
								<td className="px-3 py-2">Independência do Brasil</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">12 de outubro</td>
								<td className="px-3 py-2">Nossa Senhora Aparecida</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">2 de novembro</td>
								<td className="px-3 py-2">Finados</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">15 de novembro</td>
								<td className="px-3 py-2">Proclamação da República</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">20 de novembro</td>
								<td className="px-3 py-2">
									Dia Nacional de Zumbi e da Consciência Negra
								</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">25 de dezembro</td>
								<td className="px-3 py-2">Natal</td>
								<td className="px-3 py-2">Fixo</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Terça-feira de Carnaval</td>
								<td className="px-3 py-2">Carnaval</td>
								<td className="px-3 py-2">Móvel</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Sexta-feira Santa</td>
								<td className="px-3 py-2">Paixão de Cristo</td>
								<td className="px-3 py-2">Móvel</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">Corpus Christi</td>
								<td className="px-3 py-2">Corpus Christi</td>
								<td className="px-3 py-2">Móvel</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</>
	);
}

export default function CalculadoraDiasUteisPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-de-dias-uteis"
			title="Calculadora de Dias Úteis"
			description="Calcule dias úteis entre datas ou adicione dias úteis a uma data. Inclui feriados nacionais e facultativos do Brasil."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-dias-uteis" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<BusinessDaysCalculator />
		</PageLayout>
	);
}
