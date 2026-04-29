import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TerminationCalculatorClient } from "@/components/tools/termination-calculator/termination-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de Rescisão Trabalhista 2026 | Ferramenta Ninja",
	description:
		"Calcule verbas rescisórias: saldo de salário, aviso prévio, 13º proporcional, férias, multa do FGTS e descontos de INSS e IRRF.",
	keywords: [
		"calculadora rescisao",
		"verbas rescisorias",
		"multa fgts",
		"aviso previo proporcional",
		"calculo rescisao trabalhista",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funcionam as verbas rescisórias
				</h2>
				<p>
					A rescisão do contrato de trabalho é regida pelos arts. 477 a 484-A da
					CLT. As verbas devidas variam conforme o motivo: dispensa sem justa
					causa, pedido de demissão, justa causa, acordo (Lei 13.467/2017) ou
					fim de contrato determinado.
				</p>
				<p className="mt-3">
					O prazo para pagamento é de 10 dias corridos a partir do término do
					contrato (CLT art. 477 §6º). O atraso gera multa equivalente a um
					salário em favor do trabalhador.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Verbas por modalidade
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Sem justa causa:</strong> saldo de salário, aviso prévio
						indenizado, 13º proporcional, férias proporcionais + 1/3, multa FGTS
						de 40% e saque integral.
					</li>
					<li>
						<strong>Pedido de demissão:</strong> saldo de salário, 13º
						proporcional, férias proporcionais + 1/3. Sem multa FGTS, sem saque,
						sem seguro-desemprego.
					</li>
					<li>
						<strong>Acordo (CLT 484-A):</strong> metade do aviso prévio, multa
						FGTS de 20%, saque de 80% do FGTS. Sem seguro-desemprego.
					</li>
					<li>
						<strong>Justa causa:</strong> apenas saldo de salário e férias
						vencidas (se houver). Sem 13º proporcional, sem férias
						proporcionais, sem multa.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Aviso prévio proporcional
				</h2>
				<p>
					A Lei 12.506/2011 garante 30 dias de aviso prévio + 3 dias adicionais
					por ano completo trabalhado, com teto de 90 dias. O aviso pode ser
					trabalhado, indenizado ou não cumprido (no pedido de demissão,
					descontado do trabalhador).
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Tributação</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>INSS:</strong> incide sobre saldo de salário e 13º
						proporcional.
					</li>
					<li>
						<strong>IRRF:</strong> incide sobre saldo de salário e 13º. Férias
						indenizadas e 1/3 são isentos (IN RFB 1500/2014).
					</li>
					<li>
						<strong>Multa FGTS:</strong> isenta de INSS e IRRF.
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
							Tenho direito ao seguro-desemprego?
						</h3>
						<p>
							Apenas em dispensa sem justa causa. Acordo, pedido de demissão,
							justa causa e fim de contrato determinado não dão direito.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que entra no cálculo de férias proporcionais?
						</h3>
						<p>
							Cada mês com 15 dias ou mais trabalhados conta como avo. 12 avos
							equivalem ao período aquisitivo completo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso sacar o FGTS?
						</h3>
						<p>
							Saque integral em dispensa sem justa causa; 80% no acordo; sem
							saque nas demais modalidades.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function TerminationCalculatorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-de-rescisao"
			title="Calculadora de Rescisão Trabalhista"
			description="Verbas rescisórias com aviso, 13º, férias e multa do FGTS."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-rescisao" />
			}
			extraContent={<SeoContent />}
		>
			<TerminationCalculatorClient />
		</PageLayout>
	);
}
