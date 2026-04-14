import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { CreditCardGenerator } from "@/components/tools/credit-card-generator/credit-card-generator";

export const metadata: Metadata = {
	title: "Gerador de Cartão de Crédito Online Grátis | Ferramenta Ninja",
	description:
		"Gere números de cartão de crédito válidos para testes com Visa, Mastercard, American Express, Elo e Hipercard. Os números gerados não pertencem a cartões reais. Ferramenta gratuita, sem cadastro.",
	keywords: [
		"gerador de cartão de crédito",
		"cartão de crédito para testes",
		"número de cartão válido",
		"visa fake",
		"mastercard teste",
		"luhn",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um gerador de cartão de crédito?
				</h2>
				<p>
					Um gerador de cartão de crédito cria números que seguem as regras
					matemáticas das bandeiras reais — como Visa, Mastercard e Elo — sem
					pertencer a nenhum cartão verdadeiro. Os números são produzidos com o{" "}
					<strong className="text-foreground">algoritmo de Luhn</strong>, o
					mesmo método de verificação usado pelos sistemas de pagamento para
					checar se um número de cartão é matematicamente consistente.
				</p>
				<p className="mt-3">
					Além do número, a ferramenta gera uma data de validade futura e um CVV
					aleatório com o comprimento correto para cada bandeira. O resultado é
					exibido em uma pré-visualização semelhante a um cartão físico para
					facilitar a leitura.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o algoritmo de Luhn?
				</h2>
				<p>
					O algoritmo de Luhn, criado por Hans Peter Luhn em 1954, é usado para
					validar uma variedade de números de identificação, incluindo cartões
					de crédito. O processo funciona da seguinte forma:
				</p>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						A partir do último dígito (da direita para a esquerda), dobre o
						valor de cada segundo dígito.
					</li>
					<li>Se o resultado da duplicação for maior que 9, subtraia 9.</li>
					<li>Some todos os dígitos, incluindo os que foram dobrados.</li>
					<li>O número é válido se a soma total for divisível por 10.</li>
				</ol>
				<p className="mt-3">
					O gerador usa exatamente esse algoritmo ao contrário: preenche os
					dígitos aleatórios e calcula o último dígito necessário para que a
					soma seja múltipla de 10.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve essa ferramenta?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Testes de formulários e fluxos de pagamento:
						</strong>{" "}
						desenvolvedores que constroem interfaces de checkout precisam de
						números de cartão válidos para verificar máscaras de entrada,
						validações em tempo real e detecção automática de bandeira.
					</p>
					<p>
						<strong className="text-foreground">
							QA e automação de testes:
						</strong>{" "}
						analistas de qualidade utilizam números gerados para simular
						cenários de pagamento em ambientes de sandbox ou staging, sem expor
						dados reais.
					</p>
					<p>
						<strong className="text-foreground">Aprendizado e estudo:</strong>{" "}
						estudantes e desenvolvedores que estão aprendendo sobre o algoritmo
						de Luhn podem usar a ferramenta para gerar exemplos e validar
						implementações próprias.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Aviso importante
				</h2>
				<p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
					Os números de cartão gerados por esta ferramenta são matematicamente
					válidos pelo algoritmo de Luhn, mas{" "}
					<strong>não pertencem a nenhum cartão real</strong> e não podem ser
					utilizados para realizar transações financeiras. O uso de números de
					cartão falsos para fraudes, tentativas de compra ou qualquer
					finalidade ilícita é crime previsto no Código Penal Brasileiro.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os cartões gerados funcionam para compras?
						</h3>
						<p>
							Não. Os números passam na verificação matemática do Luhn, mas não
							existem em nenhuma instituição financeira. Qualquer tentativa de
							uso em uma transação real será recusada imediatamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre Elo, Hipercard e as outras bandeiras?
						</h3>
						<p>
							Visa, Mastercard e American Express são bandeiras internacionais
							presentes em todo o mundo. Elo e Hipercard são bandeiras
							brasileiras, criadas para o mercado nacional. Cada bandeira possui
							faixas de prefixos exclusivas que permitem sua identificação
							automática.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que o CVV do American Express tem 4 dígitos?
						</h3>
						<p>
							O American Express utiliza um código de segurança de 4 dígitos
							impresso na frente do cartão, enquanto as demais bandeiras usam 3
							dígitos no verso. Essa diferença é uma característica de segurança
							da própria bandeira.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como validar um número de cartão gerado?
						</h3>
						<p>
							Você pode usar o{" "}
							<a
								href="/ferramentas/validador-de-cartao-de-credito"
								className="text-primary underline underline-offset-4"
							>
								Validador de Cartão de Crédito
							</a>{" "}
							desta ferramenta para confirmar que o número gerado passa na
							verificação de Luhn e identificar a bandeira automaticamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados gerados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processo de geração ocorre diretamente no seu
							navegador, sem enviar nenhum dado a servidores externos. Nenhuma
							informação é armazenada ou transmitida.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeCartaoDeCreditoPage() {
	return (
		<PageLayout
			title="Gerador de Cartão de Crédito Online Grátis"
			description="Gere números de cartão de crédito válidos para testes com Visa, Mastercard, American Express, Elo e Hipercard. Os números são matematicamente corretos e destinados exclusivamente a fins de desenvolvimento."
			extraContent={<SeoContent />}
		>
			<CreditCardGenerator />
		</PageLayout>
	);
}
