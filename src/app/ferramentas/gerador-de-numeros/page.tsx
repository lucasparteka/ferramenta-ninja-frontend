import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { NumberGenerator } from "@/components/tools/number-generator/number-generator";

export const metadata: Metadata = {
	title: "Gerador de Números Aleatórios Online Grátis | Ferramenta Ninja",
	description:
		"Gere números aleatórios com intervalo, quantidade, colunas e ordenação personalizados. Suporte a números únicos. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um gerador de números aleatórios?
				</h2>
				<p>
					Um gerador de números aleatórios é uma ferramenta que produz
					sequências de números sem padrão previsível dentro de um intervalo
					definido. Em vez de escolher números manualmente, você configura o
					intervalo, a quantidade e as opções desejadas, e o gerador faz o
					trabalho em frações de segundo.
				</p>
				<p className="mt-3">
					Esta ferramenta utiliza o algoritmo de aleatoriedade nativo do
					navegador para garantir que cada geração seja independente e não
					influenciada por resultados anteriores.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Opções disponíveis
				</h2>
				<ul className="list-disc space-y-3 pl-6">
					<li>
						<strong className="text-foreground">Quantidade:</strong> defina
						quantos números deseja gerar, de 1 até 1.000.
					</li>
					<li>
						<strong className="text-foreground">Intervalo:</strong> configure o
						valor mínimo e máximo do intervalo. Números negativos são aceitos.
					</li>
					<li>
						<strong className="text-foreground">Colunas:</strong> organize a
						exibição dos números em 1 a 10 colunas para facilitar a leitura.
					</li>
					<li>
						<strong className="text-foreground">Ordem:</strong> exiba os números
						na ordem em que foram gerados (aleatória), do menor para o maior
						(crescente) ou do maior para o menor (decrescente).
					</li>
					<li>
						<strong className="text-foreground">Números únicos:</strong> quando
						ativado, cada número aparece no máximo uma vez no resultado. A
						quantidade gerada fica limitada ao tamanho do intervalo.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Jogos e dinâmicas:</strong> gere
						números para bingo, rifas, loteria caseira, roleta de decisões ou
						qualquer jogo que precise de valores aleatórios.
					</p>
					<p>
						<strong className="text-foreground">Educação e estatística:</strong>{" "}
						professores e estudantes utilizam geradores de números para criar
						amostras aleatórias, demonstrar conceitos de probabilidade e gerar
						dados para exercícios.
					</p>
					<p>
						<strong className="text-foreground">
							Desenvolvimento e testes:
						</strong>{" "}
						gere IDs, códigos, seeds e outros valores numéricos aleatórios para
						popular bancos de dados de teste ou simular entradas de usuário.
					</p>
					<p>
						<strong className="text-foreground">Sorteios simples:</strong>{" "}
						quando a lista de participantes é numérica (como números de ingresso
						ou matrículas), use o gerador para sortear o vencedor de forma
						rápida.
					</p>
					<p>
						<strong className="text-foreground">
							Senhas e códigos temporários:
						</strong>{" "}
						gere sequências numéricas para usar como PINs, códigos de
						verificação ou tokens de acesso temporário.
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
							Os números gerados são realmente aleatórios?
						</h3>
						<p>
							Sim. A ferramenta utiliza o gerador de números pseudoaleatórios
							nativo do navegador, adequado para a grande maioria dos casos de
							uso cotidianos como jogos, sorteios e testes. Para aplicações que
							exigem aleatoriedade criptográfica (como geração de chaves de
							segurança), utilize ferramentas especializadas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso gerar números negativos?
						</h3>
						<p>
							Sim. Basta definir um valor mínimo negativo no campo de intervalo.
							Por exemplo, entre -50 e 50 gera números nesse intervalo completo,
							incluindo o zero.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa "números únicos"?
						</h3>
						<p>
							Com essa opção ativada, nenhum número se repete no resultado. A
							quantidade gerada fica limitada ao tamanho do intervalo: por
							exemplo, entre 1 e 10 é possível gerar no máximo 10 números
							únicos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual é a quantidade máxima de números que posso gerar?
						</h3>
						<p>
							A ferramenta suporta até 1.000 números por geração. Para listas
							maiores, gere em partes e copie os resultados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados gerados são salvos?
						</h3>
						<p>
							Não. Tudo acontece diretamente no seu navegador e os números são
							descartados ao fechar ou atualizar a página. Nada é enviado a
							nenhum servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeNumerosPage() {
	return (
		<PageLayout
			title="Gerador de Números Aleatórios Online Grátis"
			description="Gere números aleatórios com intervalo, quantidade, colunas e ordenação personalizados. Suporte a números únicos e cópia com um clique."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-numeros" />
			}
			extraContent={<SeoContent />}
		>
			<NumberGenerator />
		</PageLayout>
	);
}
