import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { RandomPicker } from "@/components/tools/random-picker/random-picker";

export const metadata: Metadata = {
	title: "Sorteio Online Grátis: Sortear Nomes e Números | Ferramenta Ninja",
	description:
		"Faça sorteios online de nomes, números ou qualquer lista de forma justa e aleatória. Ferramenta gratuita, sem cadastro, resultado instantâneo.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funcionam os sorteios online?
				</h2>
				<p>
					Um sorteio online funciona de forma simples: você insere os itens que
					deseja sortear (nomes, números, opções), define quantos vencedores
					quer selecionar e clica em <strong>Sortear</strong>. A ferramenta
					então utiliza um algoritmo de aleatoriedade para selecionar os
					vencedores de forma imparcial.
				</p>
				<p className="mt-3">
					O algoritmo usado é o embaralhamento de Fisher-Yates, amplamente
					reconhecido por garantir que todas as combinações possíveis tenham a
					mesma probabilidade de ocorrer. A seleção é feita com{" "}
					<code>crypto.getRandomValues</code>, uma API de aleatoriedade
					criptograficamente segura disponível em todos os navegadores modernos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O sorteio é realmente justo?
				</h2>
				<p>
					Sim. Diferente de métodos baseados em <code>Math.random</code>, que
					podem apresentar padrões previsíveis em algumas implementações, esta
					ferramenta utiliza <code>crypto.getRandomValues</code> para gerar
					números verdadeiramente aleatórios. Isso garante que cada participante
					tenha exatamente a mesma chance de ser sorteado.
				</p>
				<p className="mt-3">
					Além disso, todo o processamento acontece diretamente no seu
					navegador. Nenhum dado é enviado a servidores externos, o que elimina
					qualquer possibilidade de manipulação externa do resultado.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Rifas e brindes:</strong>{" "}
						sorteie o vencedor de um produto, brinde ou prêmio entre uma lista
						de participantes de forma rápida e transparente.
					</p>
					<p>
						<strong className="text-foreground">
							Sorteios em redes sociais:
						</strong>{" "}
						cole a lista de comentários ou nomes de participantes de um concurso
						no Instagram, Facebook ou outras plataformas e sorteie o ganhador
						instantaneamente.
					</p>
					<p>
						<strong className="text-foreground">Decisões em grupo:</strong> não
						sabe quem começa o jogo, quem apresenta primeiro ou quem escolhe o
						destino da viagem? Use o sorteador para decidir de forma neutra e
						sem discussões.
					</p>
					<p>
						<strong className="text-foreground">Dinâmicas e jogos:</strong>{" "}
						sorteie duplas, times, ordens de apresentação ou qualquer divisão
						aleatória em eventos, aulas ou reuniões.
					</p>
					<p>
						<strong className="text-foreground">Seleção de números:</strong>{" "}
						gere números aleatórios para loteria, jogos de tabuleiro ou qualquer
						situação que exija imparcialidade.
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
							Como fazer um sorteio online?
						</h3>
						<p>
							Digite ou cole os nomes, números ou itens no campo de entrada, um
							por linha. Escolha quantos vencedores deseja sortear e clique em{" "}
							<strong>Sortear</strong>. O resultado aparece imediatamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O sorteio é realmente aleatório?
						</h3>
						<p>
							Sim. A ferramenta utiliza <code>crypto.getRandomValues</code>, a
							API de aleatoriedade criptográfica do navegador, garantindo
							resultados imparciais e não previsíveis.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso sortear mais de um nome?
						</h3>
						<p>
							Sim. Basta ajustar a opção{" "}
							<strong>Quantidade de vencedores</strong> para o número desejado.
							Por padrão, cada item só pode ser sorteado uma vez.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso repetir nomes no sorteio?
						</h3>
						<p>
							Sim, ativando a opção <strong>Permitir repetição</strong>. Nesse
							modo, o mesmo item pode ser sorteado mais de uma vez, útil quando
							você quer sortear posições ou rodadas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados inseridos são salvos?
						</h3>
						<p>
							Não. Tudo acontece no seu navegador e os dados são descartados ao
							fechar ou atualizar a página. Nada é enviado a nenhum servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function SorteioOnlinePage() {
	return (
		<PageLayout
			title="Sorteio Online Grátis (Sortear Nomes e Números)"
			description="Sorteie nomes, números ou qualquer lista de forma justa e instantânea. Configure a quantidade de vencedores e a opção de repetição."
			relatedTools={<RelatedTools currentHref="/ferramentas/sorteio-online" />}
			extraContent={<SeoContent />}
		>
			<RandomPicker />
		</PageLayout>
	);
}
