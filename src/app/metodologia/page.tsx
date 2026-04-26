import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";

export const metadata: Metadata = {
	title: "Metodologia",
	description:
		"Como o Ferramenta Ninja calcula salário, férias, 13º, rescisão, financiamento, IMC e outros indicadores. Fórmulas, fontes oficiais e atualizações.",
	alternates: { canonical: "/metodologia" },
	openGraph: {
		title: "Metodologia — Ferramenta Ninja",
		description:
			"Fórmulas, fontes oficiais e atualizações das calculadoras do Ferramenta Ninja.",
		url: "/metodologia",
		type: "website",
	},
};

export default function MetodologiaPage() {
	return (
		<StaticPage
			title="Metodologia"
			description="Fórmulas, fontes oficiais e critérios de atualização das nossas calculadoras."
			breadcrumbLabel="Metodologia"
			href="/metodologia"
		>
			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Princípio editorial
				</h2>
				<p>
					Calculadoras trabalhistas, financeiras e de saúde precisam refletir a
					legislação e os parâmetros oficiais vigentes. Esta página descreve as
					fórmulas usadas e cita as fontes consultadas. Quando há atualização
					(novo teto do INSS, mudança em alíquotas IRRF, alteração na CLT,
					revisão da Selic), revisamos e ajustamos os cálculos.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Calculadoras trabalhistas
				</h2>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Salário líquido
				</h3>
				<p>
					Aplicação progressiva da{" "}
					<strong className="text-foreground">tabela INSS</strong> (alíquotas
					efetivas por faixa, com teto vigente) e{" "}
					<strong className="text-foreground">tabela IRRF</strong> (com dedução
					por dependente conforme art. 4º da Lei 9.250/95). Benefícios
					adicionados após o líquido. Fonte: gov.br/receitafederal e
					gov.br/inss.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Férias (CLT art. 129–153)
				</h3>
				<p>
					Cálculo de avos por meses no período aquisitivo, com ajuste por faltas
					injustificadas (CLT art. 130). Aplicação do{" "}
					<strong className="text-foreground">terço constitucional</strong>{" "}
					(CF/88 art. 7º, XVII). Suporte a fracionamento e abono pecuniário (CLT
					art. 143). INSS e IRRF descontados sobre a base.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					13º salário (Lei 4.090/62 e Lei 4.749/65)
				</h3>
				<p>
					Cálculo proporcional aos meses trabalhados, com inclusão de adicionais
					habituais. Suporte às duas datas de 1ª parcela: até 30/nov ou junto às
					férias (Lei 4.749/65 art. 2º §2º). INSS e IRRF aplicados sobre o
					bruto.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Rescisão (CLT art. 477–502)
				</h3>
				<p>
					Suporte a 5 modalidades: dispensa sem justa causa, com justa causa,
					pedido de demissão, acordo (CLT 484-A) e fim de contrato. Cálculo de
					saldo de salário, aviso prévio (Lei 12.506/2011 — 30 dias + 3 dias por
					ano), férias proporcionais e vencidas, 13º proporcional, FGTS sacável
					e multa de 40%/20% conforme modalidade.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Hora extra (CLT art. 59 e CF/88 art. 7º, XVI)
				</h3>
				<p>
					Hora normal calculada sobre o divisor da jornada semanal (220h, 200h,
					180h ou 150h). Adicional de 50% em dias úteis e 100% em domingos e
					feriados. DSR (Descanso Semanal Remunerado) opcional, calculado sobre
					dias úteis e dias de descanso do mês.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Calculadoras financeiras
				</h2>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Juros compostos
				</h3>
				<p>
					Capitalização mensal: M = P × (1 + i)<sup>n</sup> + A × ((1 + i)
					<sup>n</sup> − 1) / i, onde P é o principal, A o aporte mensal, i a
					taxa mensal equivalente (derivada da anual via (1 + ia)^(1/12) − 1) e
					n o número de meses. Suporte a aporte no início ou fim do mês.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Financiamento (SAC e Price)
				</h3>
				<p>
					<strong className="text-foreground">Price:</strong> parcela fixa via
					PMT = P × i / (1 − (1 + i)<sup>−n</sup>).{" "}
					<strong className="text-foreground">SAC:</strong> amortização
					constante (P/n) somada aos juros do saldo devedor. Tabela de evolução
					mensal gerada para os dois sistemas.
				</p>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">
					Renda fixa (CDB, LCI/LCA, Tesouro Selic)
				</h3>
				<p>
					Rentabilidade calculada sobre o índice escolhido (CDI, Selic ou
					prefixado). Aplicação de IOF regressivo (até 30 dias) e IR regressivo
					por prazo (22,5% / 20% / 17,5% / 15%) para CDB e Tesouro Selic.
					LCI/LCA isentas de IR.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Calculadoras de saúde
				</h2>

				<h3 className="mb-2 mt-6 font-semibold text-foreground">IMC</h3>
				<p>
					IMC = peso (kg) ÷ altura (m)². Classificação seguindo a{" "}
					<strong className="text-foreground">
						Organização Mundial da Saúde
					</strong>{" "}
					(faixas: abaixo do peso &lt; 18,5; normal 18,5–24,9; sobrepeso
					25–29,9; obesidade I 30–34,9; II 35–39,9; III ≥ 40). Faixa saudável
					calculada como 18,5 ≤ IMC ≤ 24,9 aplicada à altura informada.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Validadores e integrações
				</h2>
				<p>
					<strong className="text-foreground">Boleto:</strong> verificação de
					dígitos via módulo 10 e módulo 11 conforme padrão Febraban (boleto
					bancário 47 dígitos e arrecadação 48 dígitos).
				</p>
				<p>
					<strong className="text-foreground">PIX:</strong> decodificação do
					payload "Copia e Cola" seguindo o padrão BR Code (Manual do BR Code do
					Banco Central) com verificação de CRC-16/CCITT-FALSE.
				</p>
				<p>
					<strong className="text-foreground">CEP, CNPJ, FIPE:</strong>{" "}
					integração com APIs públicas (ViaCEP, BrasilAPI, Tabela FIPE oficial).
					Apenas o identificador consultado é enviado; nenhum outro dado seu.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Atualização e correção de erros
				</h2>
				<p>
					Tabelas e parâmetros revisados sempre que entra em vigor mudança
					oficial (lei, decreto, portaria, resolução). Encontrou divergência ou
					erro? Reporte via{" "}
					<Link href="/contato" className="text-primary underline">
						contato
					</Link>{" "}
					— corrigimos em até 5 dias úteis e republicamos com nota de revisão.
				</p>
			</section>
		</StaticPage>
	);
}
