import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CpfValidator } from "@/components/tools/cpf-generator/cpf-validator";

export const metadata: Metadata = {
	title: "Validador de CPF Online Grátis | Ferramenta Ninja",
	description:
		"Valide qualquer CPF online de forma instantânea. Aceita CPF com ou sem formatação. Validação feita no navegador, sem enviar dados a servidores.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a validação do CPF?
				</h2>
				<p>
					A validação do CPF segue dois passos baseados em multiplicação e
					módulo:
				</p>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						Os 9 primeiros dígitos são multiplicados pelos pesos de 10 a 2. A
						soma é calculada e o resultado de <code>(soma × 10) % 11</code>{" "}
						determina o primeiro dígito verificador. Se o resultado for 10 ou
						mais, o dígito é 0.
					</li>
					<li>
						Os 10 dígitos (incluindo o primeiro verificador) são multiplicados
						pelos pesos de 11 a 2. A mesma fórmula determina o segundo dígito
						verificador.
					</li>
				</ol>
				<p className="mt-3">
					Além dos dígitos verificadores, sequências como 000.000.000-00 ou
					111.111.111-11 são consideradas inválidas mesmo que os cálculos
					resultem nos dígitos corretos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um validador de CPF?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Verificação antes de cadastros:
						</strong>{" "}
						confira se um CPF informado é matematicamente válido antes de
						processá-lo em um formulário ou sistema.
					</p>
					<p>
						<strong className="text-foreground">
							Testes de QA:
						</strong>{" "}
						equipes de qualidade usam validadores para checar se os CPFs gerados
						para testes passam corretamente pelas regras de negócio.
					</p>
					<p>
						<strong className="text-foreground">
							Diagnóstico de erros:
						</strong>{" "}
						quando um sistema rejeita um CPF, use o validador para confirmar se
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
							O validador aceita CPF sem formatação?
						</h3>
						<p>
							Sim. Você pode digitar o CPF com ou sem pontos e traço. O campo
							aplica a máscara automaticamente enquanto você digita.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Um CPF válido pertence a alguém?
						</h3>
						<p>
							Não necessariamente. Um CPF pode ser matematicamente válido (passar
							nos dígitos verificadores) sem estar cadastrado na Receita Federal.
							Este validador verifica apenas a estrutura matemática, não consulta
							nenhuma base de dados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que meu CPF aparece como inválido?
						</h3>
						<p>
							Verifique se todos os 11 dígitos estão corretos. CPFs com todos os
							dígitos iguais (ex: 111.111.111-11) são matematicamente inválidos
							mesmo que passem por validações simples de formato.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a validação ocorre diretamente no seu navegador. Nenhum
							CPF digitado é transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ValidadorDeCpfPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/validador-de-cpf"
			title="Validador de CPF Online Grátis"
			description="Valide qualquer CPF instantaneamente. Aceita CPF com ou sem formatação. A validação verifica os dígitos verificadores seguindo o algoritmo oficial da Receita Federal."
			relatedTools={<RelatedTools currentHref="/ferramentas/validador-de-cpf" />}
			extraContent={<SeoContent />}
		>
			<CpfValidator />
		</PageLayout>
	);
}
