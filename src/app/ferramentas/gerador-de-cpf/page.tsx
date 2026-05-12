import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CpfGenerator } from "@/components/tools/cpf-generator/cpf-generator";

export const metadata: Metadata = {
	title: "Gerador de CPF Válido Online Grátis | Ferramenta Ninja",
	description:
		"Gere CPFs válidos para testes e desenvolvimento. Os CPFs gerados são matematicamente corretos mas não pertencem a pessoas reais. Gratuito, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o CPF?
				</h2>
				<p>
					O CPF (Cadastro de Pessoas Físicas) é um documento de identificação
					tributária emitido pela Receita Federal do Brasil para pessoas
					físicas. Composto por 11 dígitos no formato
					<strong className="text-foreground"> ###.###.###-##</strong>, o CPF é
					amplamente exigido em transações financeiras, cadastros em sistemas,
					contratos e serviços públicos no Brasil.
				</p>
				<p className="mt-3">
					Os dois últimos dígitos são chamados de{" "}
					<strong className="text-foreground">dígitos verificadores</strong> e
					são calculados a partir dos nove primeiros usando um algoritmo
					matemático específico. Isso permite que qualquer sistema verifique se
					um CPF é matematicamente válido sem precisar consultar a Receita
					Federal.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um gerador de CPF?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Desenvolvimento e testes de software:
						</strong>{" "}
						desenvolvedores precisam de CPFs válidos para testar formulários,
						validações de campos, fluxos de cadastro e integrações com sistemas
						que exigem o documento. Os CPFs gerados são matematicamente válidos,
						mas não pertencem a nenhuma pessoa real.
					</p>
					<p>
						<strong className="text-foreground">
							Testes de QA e automação:
						</strong>{" "}
						analistas de qualidade e equipes de QA utilizam geradores de CPF
						para criar massas de dados de teste, simular cadastros e verificar o
						comportamento de sistemas em diferentes cenários.
					</p>
					<p>
						<strong className="text-foreground">
							Ambientes de homologação:
						</strong>{" "}
						sistemas em fase de homologação frequentemente não podem usar dados
						reais de usuários. CPFs gerados permitem popular o ambiente de
						testes sem expor informações sensíveis.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Aviso importante
				</h2>
				<p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
					Os CPFs gerados por esta ferramenta são matematicamente válidos, mas{" "}
					<strong>não pertencem a nenhuma pessoa real</strong>. Eles são
					destinados exclusivamente a fins de teste e desenvolvimento de
					software. O uso indevido de CPFs — seja para fraudes, falsificação de
					documentos ou qualquer outra finalidade ilícita — é crime previsto no
					Código Penal Brasileiro.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O CPF gerado é válido?
						</h3>
						<p>
							Sim, matematicamente válido. Os dígitos verificadores são
							calculados seguindo o algoritmo oficial da Receita Federal,
							portanto passam em qualquer validação de formato. No entanto, não
							correspondem a nenhum CPF cadastrado na base da Receita.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esses CPFs pertencem a pessoas reais?
						</h3>
						<p>
							Não. Os CPFs são gerados aleatoriamente e, embora sejam
							matematicamente corretos, não têm vínculo com nenhum cidadão
							cadastrado. Qualquer semelhança com um CPF real é coincidência.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar esses CPFs em sistemas reais?
						</h3>
						<p>
							Apenas em ambientes de teste e desenvolvimento. Nunca utilize CPFs
							gerados para fraudar cadastros, contratos ou qualquer sistema com
							dados reais. Esse uso constitui crime.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como validar um CPF?
						</h3>
						<p>
							Use nosso{" "}
							<a
								href="/ferramentas/validador-de-cpf"
								className="text-primary underline-offset-4 hover:underline"
							>
								Validador de CPF
							</a>
							: cole o CPF no campo e clique em Validar. A ferramenta aceita o
							CPF com ou sem formatação e verifica tanto o formato quanto os
							dígitos verificadores.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a geração ocorre diretamente no seu navegador. Nenhum
							CPF gerado é transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeCpfPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/gerador-de-cpf"
			title="Gerador de CPF Válido Online Grátis"
			description="Gere CPFs válidos para testes e desenvolvimento. Os números gerados são matematicamente corretos e destinados exclusivamente a fins de desenvolvimento."
			relatedTools={<RelatedTools currentHref="/ferramentas/gerador-de-cpf" />}
			extraContent={<SeoContent />}
		>
			<CpfGenerator />
		</PageLayout>
	);
}
