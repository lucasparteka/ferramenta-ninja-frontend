import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ValidadorBoletoClient } from "@/components/tools/validador-boleto/validador-boleto-client";

export const metadata: Metadata = {
	title: "Validador de Boleto Online | Ferramenta Ninja",
	description:
		"Valide a linha digitável do boleto bancário ou de arrecadação. Confira valor, vencimento, banco emissor e dígitos verificadores (módulo 10 e 11).",
	keywords: [
		"validador boleto",
		"linha digitavel",
		"verificar boleto",
		"codigo de barras boleto",
		"boleto vencimento",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a linha digitável
				</h2>
				<p>
					A linha digitável é a representação numérica do código de barras do
					boleto, padronizada pela FEBRABAN. Boletos bancários (cobrança)
					possuem 47 dígitos divididos em 5 campos. Boletos de arrecadação
					(concessionárias, tributos) possuem 48 dígitos divididos em 4 blocos
					de 12.
				</p>
				<p className="mt-3">
					Os dígitos verificadores (DV) garantem a integridade do código.
					Boletos bancários usam módulo 10 nos campos 1 a 3 e módulo 11 no DV
					geral. Boletos de arrecadação usam módulo 10 ou módulo 11 conforme o
					terceiro dígito (identificador de valor).
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que esta ferramenta extrai
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Banco emissor (3 primeiros dígitos do boleto bancário).</li>
					<li>Valor exato do documento.</li>
					<li>Data de vencimento (calculada a partir do fator de vencimento).</li>
					<li>Código de barras de 44 dígitos reconstruído.</li>
					<li>Validação dos dígitos verificadores de cada campo.</li>
					<li>Segmento da arrecadação (energia, saneamento, prefeitura etc.).</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A validação garante que o boleto será pago?
						</h3>
						<p>
							Não. A ferramenta confere apenas a integridade matemática da
							linha digitável. O status de pagamento, registro e baixa só pode
							ser obtido junto ao banco emissor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que o vencimento aparece como "Não informado"?
						</h3>
						<p>
							Boletos com fator de vencimento zero (boletos sem data fixa, como
							alguns recargas e arrecadações) não retornam vencimento.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso colar o boleto com pontos e espaços?
						</h3>
						<p>
							Sim. Qualquer caractere fora dos dígitos é ignorado
							automaticamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a validação acontece no seu navegador. Nada é
							transmitido nem armazenado.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ValidadorBoletoPage() {
	return (
		<PageLayout
			title="Validador de Boleto"
			description="Confira a linha digitável e extraia valor, vencimento e código de barras."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/validador-de-boleto" />
			}
			extraContent={<SeoContent />}
		>
			<ValidadorBoletoClient />
		</PageLayout>
	);
}
