import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { JsonFormatter } from "@/components/tools/json-formatter/json-formatter";

export const metadata: Metadata = {
	title: "Formatar JSON Online Grátis | Ferramenta Ninja",
	description:
		"Formate, valide e minifique JSON online. Destaque de sintaxe, detecção de erros com linha e coluna. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é JSON?
				</h2>
				<p>
					JSON (JavaScript Object Notation) é um formato leve de troca de dados.
					É amplamente usado em APIs, arquivos de configuração e comunicação
					entre sistemas. Sua sintaxe simples baseada em chave-valor o torna
					fácil de ler e escrever tanto para humanos quanto para máquinas.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que formatar JSON?
				</h2>
				<div className="space-y-3">
					<p>
						JSON minificado (tudo em uma linha) é eficiente para transmissão de
						dados, mas difícil de ler. Um formatador JSON adiciona indentação e
						quebras de linha, tornando a estrutura clara e facilitando:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>Depurar respostas de APIs</li>
						<li>Entender arquivos de configuração</li>
						<li>Validar se um JSON está bem formado</li>
						<li>Encontrar erros de sintaxe rapidamente</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Erros comuns em JSON
				</h2>
				<div className="space-y-3">
					<p>Os erros mais frequentes ao escrever JSON manualmente são:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">
								Vírgula no último item:
							</strong>{" "}
							diferente de JavaScript, JSON não permite vírgula após o último
							elemento de um objeto ou array.
						</li>
						<li>
							<strong className="text-foreground">Aspas simples:</strong> JSON
							exige aspas duplas para chaves e strings.
						</li>
						<li>
							<strong className="text-foreground">Chaves sem aspas:</strong>{" "}
							todas as chaves devem estar entre aspas duplas.
						</li>
						<li>
							<strong className="text-foreground">Comentários:</strong> JSON não
							suporta comentários {"(// ou /* */)"}.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre formatar e minificar JSON?
						</h3>
						<p>
							Formatar adiciona indentação e quebras de linha para facilitar a
							leitura. Minificar remove todos os espaços desnecessários,
							deixando o JSON em uma única linha — ideal para uso em produção.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O formatador corrige JSON inválido?
						</h3>
						<p>
							Não. Se o JSON for inválido, a ferramenta mostra o erro com a
							linha e coluna exatas. Você precisa corrigir manualmente. Isso
							garante que você saiba exatamente o que está errado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados JSON são enviados a algum servidor?
						</h3>
						<p>
							Não. Toda a formatação e validação acontece no seu navegador. Seus
							dados nunca saem do seu dispositivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significam as cores no resultado?
						</h3>
						<p>
							O destaque de sintaxe usa cores para diferenciar chaves (azul),
							strings (verde), números (laranja) e booleanos/null (roxo),
							facilitando a leitura visual do JSON.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function FormatarJsonPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/formatar-json"
			title="Formatar JSON"
			description="Formate, valide e minifique JSON online. Destaque de sintaxe e detecção de erros com indicação exata de linha e coluna."
			relatedTools={<RelatedTools currentHref="/ferramentas/formatar-json" />}
			extraContent={<SeoContent />}
		>
			<JsonFormatter />
		</PageLayout>
	);
}
