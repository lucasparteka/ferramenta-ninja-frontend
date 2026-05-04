import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { MockDataGenerator } from "@/components/tools/mock-data/mock-data-generator";

export const metadata: Metadata = {
	title: "Gerador de Dados Mock Online Grátis | Ferramenta Ninja",
	description:
		"Gere dados mock realistas em JSON e CSV. Usuários, produtos, API responses e edge cases para testes e desenvolvimento.",
	keywords: [
		"dados mock",
		"json exemplo",
		"fake data generator",
		"dados para teste",
		"csv mock",
		"gerador de dados",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são dados mock?
				</h2>
				<p>
					Dados mock (ou dados fictícios) são informações sintéticas criadas
					para simular dados reais em ambientes de teste, desenvolvimento e
					prototipação. Eles permitem que desenvolvedores e designers trabalhem
					com dados realistas sem expor informações sensíveis ou depender de
					bancos de dados em produção.
				</p>
				<p className="mt-3">
					Diferente de dados anonimizados, os dados mock são gerados do zero
					com base em padrões e regras predefinidas, garantindo que sejam
					semanticamente válidos (CPFs com dígitos corretos, emails com formato
					válido, etc.) mas completamente artificiais.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Testes de software:</strong>{" "}
						popule bancos de dados de teste, preencha formulários e simule
						respostas de API sem depender de dados reais ou serviços externos.
					</p>
					<p>
						<strong className="text-foreground">Prototipação de interfaces:</strong>{" "}
						preencha componentes UI com dados realistas para validar layouts,
						tabelas e cards antes do backend estar pronto.
					</p>
					<p>
						<strong className="text-foreground">Testes de performance:</strong>{" "}
						avalie o comportamento da aplicação com grandes volumes de dados
						(100, 500, 1000+ registros) sem precisar de um banco populado.
					</p>
					<p>
						<strong className="text-foreground">Desenvolvimento de APIs:</strong>{" "}
						simule respostas de sucesso, erro e edge cases para testar a
						robustez do cliente HTTP.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tipos de dados disponíveis
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Usuário:</strong>{" "}
						nome brasileiro completo, email válido, endereço com cidade/estado,
						níveis de permissão (admin, user, editor) e data de criação.
					</p>
					<p>
						<strong className="text-foreground">Produto:</strong>{" "}
						nome realista com categoria, preço em reais, estoque e SKU
						formatado. Ideal para e-commerces e sistemas de inventário.
					</p>
					<p>
						<strong className="text-foreground">API Response:</strong>{" "}
						simule respostas completas de API REST com status, mensagem, dados
						e timestamp. Versões de sucesso e erro disponíveis.
					</p>
					<p>
						<strong className="text-foreground">Paginação:</strong>{" "}
						estrutura completa de resposta paginada com page, limit, total e
						hasNext/hasPrev.
					</p>
					<p>
						<strong className="text-foreground">Edge Cases:</strong>{" "}
						dados extremos como objetos profundamente aninhados, caracteres
						especiais (acentos, emojis, HTML), valores numéricos extremos e
						diferentes formatos de data.
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
							O que são dados mock?
						</h3>
						<p>
							São dados sintéticos gerados artificialmente para simular
							informações reais em ambientes de teste e desenvolvimento. Não
							contêm informações reais de pessoas ou empresas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Para que servem dados mock?
						</h3>
						<p>
							Servem para testar aplicações, prototipar interfaces, simular
							respostas de API e validar o comportamento do sistema com
							diferentes volumes e tipos de dados, sem expor informações
							sensíveis.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar esses dados em produção?
						</h3>
						<p>
							Não. Dados mock devem ser usados apenas em ambientes de
							desenvolvimento, teste e prototipação. Em produção, utilize dados
							reais e reais fontes oficiais.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais formatos são suportados?
						</h3>
						<p>
							JSON e CSV. Para tipos de dado tabulares (usuário e produto),
							você pode alternar entre os dois formatos. Para tipos estruturados
							(API response, edge cases), apenas JSON está disponível.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Há limite de registros?
						</h3>
						<p>
							Você pode gerar até 10.000 registros de uma vez. Para conjuntos
							maiores, recomendamos gerar em lotes. Todo o processamento
							acontece no seu navegador.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para servidor?
						</h3>
						<p>
							Nunca. Toda a geração acontece localmente no seu navegador.
							Nenhum dado é enviado para servidores externos ou armazenado em
							nuvem.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeDadosMockPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-dados-mock"
			title="Gerador de Dados Mock Online"
			description="Gere dados mock realistas em JSON e CSV para testes, prototipação e desenvolvimento. Usuários, produtos, API responses e edge cases."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-dados-mock" />
			}
			extraContent={<SeoContent />}
		>
			<MockDataGenerator />
		</PageLayout>
	);
}
