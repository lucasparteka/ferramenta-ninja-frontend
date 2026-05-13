import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CnpjValidator } from "@/components/tools/cnpj-generator/cnpj-validator";

export const metadata: Metadata = {
	title: "Validador de CNPJ Online Grátis | Ferramenta Ninja",
	description:
		"Valide qualquer CNPJ online de forma instantânea. Aceita CNPJ com ou sem formatação. Validação feita no navegador, sem enviar dados a servidores.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a validação do CNPJ?
				</h2>
				<p>
					A validação do CNPJ segue dois passos baseados em multiplicação e
					módulo:
				</p>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						Os 12 primeiros dígitos são multiplicados pelos pesos{" "}
						<code>5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2</code>. A soma é calculada
						e o resultado de <code>soma % 11</code> determina o primeiro dígito
						verificador. Se o restante for menor que 2, o dígito é 0; caso
						contrário, é <code>11 - restante</code>.
					</li>
					<li>
						Os 13 dígitos (incluindo o primeiro verificador) são multiplicados
						pelos pesos <code>6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2</code>. A
						mesma regra determina o segundo dígito verificador.
					</li>
				</ol>
				<p className="mt-3">
					Além dos dígitos verificadores, sequências como 00.000.000/0000-00 ou
					11.111.111/1111-11 são consideradas inválidas mesmo que os cálculos
					resultem nos dígitos corretos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um validador de CNPJ?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Verificação antes de cadastros:
						</strong>{" "}
						confira se um CNPJ informado é matematicamente válido antes de
						processá-lo em um formulário ou sistema.
					</p>
					<p>
						<strong className="text-foreground">Testes de QA:</strong> equipes
						de qualidade usam validadores para checar se os CNPJs gerados para
						testes passam corretamente pelas regras de negócio.
					</p>
					<p>
						<strong className="text-foreground">Diagnóstico de erros:</strong>{" "}
						quando um sistema rejeita um CNPJ, use o validador para confirmar se
						o problema é o formato, os dígitos verificadores ou uma sequência
						inválida.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O validador aceita CNPJ sem formatação?
						</h3>
						<p>
							Sim. Você pode digitar o CNPJ com ou sem pontos, barra e traço. O
							campo aplica a máscara automaticamente enquanto você digita.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Um CNPJ válido pertence a alguma empresa?
						</h3>
						<p>
							Não necessariamente. Um CNPJ pode ser matematicamente válido
							(passar nos dígitos verificadores) sem estar cadastrado na Receita
							Federal. Este validador verifica apenas a estrutura matemática,
							não consulta nenhuma base de dados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que meu CNPJ aparece como inválido?
						</h3>
						<p>
							Verifique se todos os 14 dígitos estão corretos. CNPJs com todos
							os dígitos iguais (ex: 11.111.111/1111-11) são matematicamente
							inválidos mesmo que passem por validações simples de formato.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a validação ocorre diretamente no seu navegador. Nenhum
							CNPJ digitado é transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ValidadorDeCnpjPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/validador-de-cnpj"
			title="Validador de CNPJ Online Grátis"
			description="Valide qualquer CNPJ instantaneamente. Aceita CNPJ com ou sem formatação. A validação verifica os dígitos verificadores seguindo o algoritmo oficial da Receita Federal."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/validador-de-cnpj" />
			}
			extraContent={<SeoContent />}
		>
			<CnpjValidator />
		</PageLayout>
	);
}
