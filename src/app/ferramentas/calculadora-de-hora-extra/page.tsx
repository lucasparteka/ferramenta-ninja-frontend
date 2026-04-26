import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { OvertimeCalculatorClient } from "@/components/tools/overtime-calculator/overtime-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de Hora Extra Online | Ferramenta Ninja",
	description:
		"Calcule horas extras 50% e 100%, reflexo no DSR (Súmula 172 TST) e o valor da sua hora normal. Atualizado para 2026.",
	keywords: [
		"calculadora hora extra",
		"hora extra 50",
		"hora extra 100",
		"DSR sobre hora extra",
		"adicional de hora extra",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o cálculo da hora extra
				</h2>
				<p>
					A jornada padrão CLT é de 44 horas semanais, equivalente a 220 horas
					mensais. O valor da hora normal é o salário dividido por essas horas.
					Sobre cada hora extra incide um adicional mínimo de 50% nos dias úteis
					(CLT art. 7º XVI) e de 100% em domingos e feriados.
				</p>
				<p className="mt-3">
					A Súmula 172 do TST garante que horas extras habituais geram reflexo no
					Descanso Semanal Remunerado (DSR). O reflexo é calculado dividindo o
					total de horas extras pelos dias úteis e multiplicando pelos domingos e
					feriados do mês.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Fórmulas
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Hora normal:</strong> salário ÷ horas mensais (220 ou 200).
					</li>
					<li>
						<strong>Hora extra 50%:</strong> hora normal × 1,5.
					</li>
					<li>
						<strong>Hora extra 100%:</strong> hora normal × 2.
					</li>
					<li>
						<strong>DSR:</strong> total de HE ÷ dias úteis × dias de descanso.
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
							Posso receber adicional maior que 50%?
						</h3>
						<p>
							Sim. A CLT define o mínimo, mas convenções coletivas, acordos
							sindicais ou contratos podem estabelecer adicionais maiores
							(60%, 70%, 100%).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Hora extra entra no 13º e nas férias?
						</h3>
						<p>
							Quando recebida com habitualidade, sim. Faz parte da média que
							compõe a base de cálculo de 13º, férias e FGTS.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Banco de horas substitui hora extra?
						</h3>
						<p>
							Pode substituir, dependendo do acordo. Quando há banco de horas
							válido, a compensação ocorre em folga e não em pagamento.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function OvertimeCalculatorPage() {
	return (
		<PageLayout
			title="Calculadora de Hora Extra"
			description="Calcule horas extras 50%, 100% e o reflexo no DSR em segundos."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-hora-extra" />
			}
			extraContent={<SeoContent />}
		>
			<OvertimeCalculatorClient />
		</PageLayout>
	);
}
