import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ReceiptClient } from "@/components/tools/receipt/receipt-client";

export const metadata: Metadata = {
	title: "Gerador de Recibo Simples Online Grátis | Ferramenta Ninja",
	description:
		"Crie recibos simples prontos para impressão em segundos. Preencha os dados, visualize o recibo e exporte em PDF.",
	keywords: [
		"recibo simples",
		"gerador de recibo",
		"recibo online",
		"recibo grátis",
		"modelo de recibo",
		"recibo para impressão",
		"recibo pdf",
	],
	openGraph: {
		title: "Gerador de Recibo Simples Online Grátis | Ferramenta Ninja",
		description:
			"Crie recibos simples prontos para impressão em segundos. Preencha os dados, visualize o recibo e exporte em PDF.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um recibo
				</h2>
				<p>
					Um recibo é um documento que comprova o pagamento de um valor entre
					duas partes. Ao assinar um recibo, o recebedor confirma que recebeu a
					quantia indicada, quitando a obrigação do pagador. É um documento
					simples, com validade jurídica quando assinado, e amplamente utilizado
					em transações entre pessoas físicas ou em serviços informais.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Quando usar um recibo simples
				</h2>
				<p className="mb-3">
					O recibo simples é adequado em diversas situações do dia a dia:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Pagamento por serviços prestados como freelancer ou autônomo</li>
					<li>Aluguel de imóvel entre pessoas físicas</li>
					<li>Empréstimos pessoais e quitações de dívidas</li>
					<li>Compra e venda de bens usados entre particulares</li>
					<li>Qualquer transação em que não há obrigação de nota fiscal</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Diferença entre recibo e nota fiscal
				</h2>
				<p className="mb-3">
					A nota fiscal é um documento fiscal obrigatório emitido por empresas
					(pessoas jurídicas) ao vender produtos ou serviços. Tem validade
					fiscal e é registrada junto à Receita Federal ou prefeitura.
				</p>
				<p>
					O recibo, por sua vez, é um documento mais simples, sem
					obrigatoriedade fiscal para pessoas físicas. Ele não substitui a nota
					fiscal quando esta é exigida por lei, mas serve como comprovante
					legítimo em situações informais ou entre pessoas físicas. Em alguns
					casos, ambos podem coexistir na mesma transação.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>

				<div className="space-y-6">
					<div>
						<h3 className="mb-2 font-semibold text-foreground">
							O recibo gerado tem validade jurídica?
						</h3>
						<p>
							Sim. Um recibo tem validade jurídica quando assinado pelas partes
							envolvidas. O documento em si comprova a transação, e a assinatura
							confere força probatória em eventuais disputas.
						</p>
					</div>

					<div>
						<h3 className="mb-2 font-semibold text-foreground">
							Preciso de testemunhas no recibo?
						</h3>
						<p>
							Não é obrigatório para valores menores. Para transações de valores
							elevados ou situações mais formais, incluir duas testemunhas com
							nome e CPF reforça a validade do documento.
						</p>
					</div>

					<div>
						<h3 className="mb-2 font-semibold text-foreground">
							O PDF já vem com minha assinatura?
						</h3>
						<p>
							Não. O PDF contém a linha de assinatura em branco. Imprima o
							recibo, assine à mão e entregue uma via ao pagador. Guarde a outra
							via para seu controle.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ReciboSimplesPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/recibo-simples"
			title="Gerador de Recibo Simples"
			description="Crie recibos prontos para impressão em segundos. Preencha os dados, visualize em tempo real e exporte em PDF."
			relatedTools={<RelatedTools currentHref="/ferramentas/recibo-simples" />}
			extraContent={<SeoContent />}
		>
			<ReceiptClient />
		</PageLayout>
	);
}
