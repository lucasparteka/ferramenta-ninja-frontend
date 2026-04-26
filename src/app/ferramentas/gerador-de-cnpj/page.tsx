import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CnpjGenerator } from "@/components/tools/cnpj-generator/cnpj-generator";
import { CnpjValidator } from "@/components/tools/cnpj-generator/cnpj-validator";

export const metadata: Metadata = {
	title: "Gerador de CNPJ Válido Online Grátis | Ferramenta Ninja",
	description:
		"Gere CNPJs válidos para testes e valide CNPJs existentes. Os números gerados não pertencem a empresas reais. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o CNPJ?
				</h2>
				<p>
					O CNPJ (Cadastro Nacional da Pessoa Jurídica) é o número de
					identificação de empresas e outras pessoas jurídicas perante a Receita
					Federal do Brasil. Composto por 14 dígitos no formato{" "}
					<strong className="text-foreground">##.###.###/####-##</strong>, o
					CNPJ é exigido em notas fiscais, contratos, abertura de contas
					bancárias e qualquer relação formal entre empresas ou com o governo.
				</p>
				<p className="mt-3">
					Os dois últimos dígitos são os{" "}
					<strong className="text-foreground">dígitos verificadores</strong>,
					calculados a partir dos doze primeiros por um algoritmo matemático
					específico. Esse mecanismo permite que qualquer sistema verifique
					instantaneamente se um CNPJ é matematicamente válido, sem consultar a
					base da Receita Federal.
				</p>
			</section>

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
					Para que serve um gerador de CNPJ?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Desenvolvimento e testes de software:
						</strong>{" "}
						desenvolvedores precisam de CNPJs válidos para testar formulários de
						cadastro de empresas, emissão de notas fiscais, integrações com
						sistemas de ERP e validações de campo. Os CNPJs gerados são
						matematicamente válidos, mas não correspondem a nenhuma empresa
						real.
					</p>
					<p>
						<strong className="text-foreground">
							Testes de QA e automação:
						</strong>{" "}
						equipes de qualidade utilizam geradores de CNPJ para criar massas de
						dados de teste, simular cadastros de fornecedores e clientes, e
						verificar o comportamento de sistemas em diferentes cenários
						empresariais.
					</p>
					<p>
						<strong className="text-foreground">
							Ambientes de homologação:
						</strong>{" "}
						sistemas fiscais, ERPs e plataformas de e-commerce em fase de
						homologação frequentemente exigem CNPJs válidos para testar fluxos
						completos, como emissão de NF-e e integração com a Sefaz, sem usar
						dados reais.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Aviso importante
				</h2>
				<p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
					Os CNPJs gerados por esta ferramenta são matematicamente válidos, mas{" "}
					<strong>não pertencem a nenhuma empresa real</strong>. Eles são
					destinados exclusivamente a fins de teste e desenvolvimento de
					software. O uso indevido de CNPJs — seja para fraudes fiscais, emissão
					de documentos falsos ou qualquer outra finalidade ilícita — é crime
					previsto na legislação brasileira.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O CNPJ gerado é válido?
						</h3>
						<p>
							Sim, matematicamente válido. Os dígitos verificadores são
							calculados seguindo o algoritmo oficial da Receita Federal,
							portanto passam em qualquer validação de formato. No entanto, não
							correspondem a nenhum CNPJ cadastrado na base da Receita.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esses CNPJs pertencem a empresas reais?
						</h3>
						<p>
							Não. Os CNPJs são gerados aleatoriamente e, embora sejam
							matematicamente corretos, não têm vínculo com nenhuma empresa
							cadastrada. Qualquer semelhança com um CNPJ real é coincidência.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar esses CNPJs em sistemas reais?
						</h3>
						<p>
							Apenas em ambientes de teste e desenvolvimento. Nunca utilize
							CNPJs gerados para emitir documentos fiscais, fraudar cadastros ou
							qualquer sistema com dados reais. Esse uso constitui crime.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como validar um CNPJ?
						</h3>
						<p>
							Use o validador acima: cole o CNPJ no campo e clique em{" "}
							<strong>Validar CNPJ</strong>. A ferramenta aceita o CNPJ com ou
							sem formatação (pontos, barra e traço) e verifica tanto o formato
							quanto os dígitos verificadores.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre CPF e CNPJ?
						</h3>
						<p>
							O CPF identifica pessoas físicas (cidadãos), enquanto o CNPJ
							identifica pessoas jurídicas (empresas, associações, órgãos
							públicos). O CPF tem 11 dígitos e o CNPJ tem 14, e cada um usa um
							algoritmo de verificação diferente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a geração e validação ocorre diretamente no seu
							navegador. Nenhum CNPJ digitado ou gerado é transmitido ou
							armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeCnpjPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-cnpj"
			title="Gerador de CNPJ Válido Online Grátis"
			description="Gere CNPJs válidos para testes ou valide CNPJs existentes. Os números gerados são matematicamente corretos e destinados exclusivamente a fins de desenvolvimento."
			relatedTools={<RelatedTools currentHref="/ferramentas/gerador-de-cnpj" />}
			extraContent={<SeoContent />}
		>
			<div className="space-y-8">
				<div>
					<h2 className="mb-5 text-lg font-semibold text-foreground">
						Gerar CNPJ
					</h2>
					<CnpjGenerator />
				</div>
				<div className="border-t border-border pt-8">
					<h2 className="mb-5 text-lg font-semibold text-foreground">
						Validar CNPJ
					</h2>
					<CnpjValidator />
				</div>
			</div>
		</PageLayout>
	);
}
