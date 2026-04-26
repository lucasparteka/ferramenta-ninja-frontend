import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ConsultaCnpjClient } from "@/components/tools/consulta-cnpj/consulta-cnpj-client";

export const metadata: Metadata = {
	title: "Consulta de CNPJ Online Grátis | Ferramenta Ninja",
	description:
		"Consulte CNPJ na Receita Federal: razão social, nome fantasia, endereço, situação cadastral, atividade principal, sócios e Simples/MEI.",
	keywords: [
		"consulta cnpj",
		"buscar cnpj",
		"cnpj receita federal",
		"situacao cadastral cnpj",
		"socios cnpj",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o CNPJ?
				</h2>
				<p>
					O Cadastro Nacional da Pessoa Jurídica (CNPJ) é o número de 14 dígitos
					que identifica empresas e demais entidades perante a Receita Federal.
					O formato oficial é{" "}
					<strong className="text-foreground">00.000.000/0000-00</strong>.
				</p>
				<p className="mt-3">
					A consulta utiliza a base pública da Receita Federal via BrasilAPI e
					retorna os dados cadastrais oficiais em segundos, sem cadastro nem
					custo.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve a consulta de CNPJ
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Verificar se a empresa está ativa antes de fechar negócio.</li>
					<li>Obter razão social, nome fantasia e endereço oficial.</li>
					<li>Consultar quadro de sócios e administradores (QSA).</li>
					<li>Identificar enquadramento no Simples Nacional ou MEI.</li>
					<li>Confirmar atividade econômica principal (CNAE).</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A consulta é gratuita?
						</h3>
						<p>
							Sim. Usamos a BrasilAPI, que disponibiliza dados públicos da
							Receita Federal gratuitamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são oficiais?
						</h3>
						<p>
							Sim. A base é a mesma da Receita Federal, atualizada
							periodicamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de consultas?
						</h3>
						<p>
							A BrasilAPI aplica rate limiting. Se aparecer mensagem de "muitas
							consultas", aguarde alguns segundos e tente novamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O CNPJ é válido mas não foi encontrado?
						</h3>
						<p>
							CNPJs recém-criados podem demorar a aparecer na base pública.
							Verifique também se digitou corretamente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConsultaCnpjPage() {
	return (
		<PageLayout
			title="Consulta de CNPJ Online"
			description="Digite um CNPJ e obtenha os dados cadastrais oficiais da Receita Federal em segundos."
			relatedTools={<RelatedTools currentHref="/ferramentas/consulta-cnpj" />}
			extraContent={<SeoContent />}
		>
			<ConsultaCnpjClient />
		</PageLayout>
	);
}
