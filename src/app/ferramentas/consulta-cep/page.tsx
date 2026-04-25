import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ConsultaCepClient } from "@/components/tools/consulta-cep/consulta-cep-client";

export const metadata: Metadata = {
	title: "Consulta de CEP Online Grátis | Ferramenta Ninja",
	description:
		"Consulte CEP de qualquer endereço do Brasil gratuitamente. Obtenha logradouro, bairro, cidade e UF em segundos, com dados atualizados dos Correios.",
	keywords: [
		"consulta cep",
		"buscar cep",
		"cep online",
		"endereço por cep",
		"viacep",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o CEP?
				</h2>
				<p>
					O CEP (Código de Endereçamento Postal) é um número de 8 dígitos usado
					pelos Correios para identificar logradouros, bairros, cidades e até
					faixas de entrega específicas. O formato oficial é{" "}
					<strong className="text-foreground">00000-000</strong>.
				</p>
				<p className="mt-3">
					Esta consulta utiliza a base pública do ViaCEP, alimentada pelos dados
					oficiais dos Correios, e retorna instantaneamente o endereço associado
					a um CEP válido.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve a consulta de CEP
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Preencher automaticamente formulários de cadastro e compras.</li>
					<li>Conferir endereço antes de enviar encomendas.</li>
					<li>Obter código IBGE e DDD da cidade.</li>
					<li>Consultar logradouro quando você só tem o CEP em mãos.</li>
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
							Sim, totalmente gratuita e sem limite de uso. Utilizamos a API
							pública do ViaCEP.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados são armazenados?
						</h3>
						<p>
							Não. Nenhum CEP consultado fica salvo em nossos servidores — a
							consulta parte diretamente do seu navegador para o ViaCEP.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							E se o CEP não retornar endereço?
						</h3>
						<p>
							Alguns CEPs genéricos (únicos para uma cidade inteira) retornam
							apenas cidade e UF. Se o CEP estiver incorreto, a consulta informa
							que não foi encontrado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso consultar CEP com hífen ou espaços?
						</h3>
						<p>
							Sim. O campo formata automaticamente conforme você digita, e
							qualquer caractere fora dos dígitos é ignorado.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConsultaCepPage() {
	return (
		<PageLayout
			title="Consulta de CEP Online"
			description="Digite um CEP e obtenha o endereço completo em segundos. Consulta gratuita com dados do ViaCEP."
			relatedTools={<RelatedTools currentHref="/ferramentas/consulta-cep" />}
			extraContent={<SeoContent />}
		>
			<ConsultaCepClient />
		</PageLayout>
	);
}
