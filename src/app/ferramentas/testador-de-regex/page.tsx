import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { RegexTester } from "@/components/tools/regex-tester/regex-tester";

export const metadata: Metadata = {
	title: "Testador de Regex Online Grátis | Ferramenta Ninja",
	description:
		"Teste expressões regulares em tempo real com highlighting de matches, grupos capturantes e flags. Sem cadastro, sem backend — tudo no navegador.",
	keywords: [
		"regex tester",
		"testador regex",
		"expressão regular online",
		"regexp brasil",
		"regex javascript",
		"testar regex",
		"regex online grátis",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					O que é uma expressão regular?
				</h2>
				<p>
					Uma expressão regular (regex ou regexp) é um padrão de busca que permite
					encontrar, validar e manipular textos. É amplamente usada em
					programação para validar e-mails, CPFs, extrair dados de strings,
					substituir texto e muito mais.
				</p>
				<p className="mt-3">
					Por exemplo, o padrão <code className="font-mono text-sm">\d{"{3}"}-\d{"{4}"}</code> encontra
					sequências como &ldquo;123-4567&rdquo;. O testador mostra exatamente quais partes
					do texto são encontradas pelo padrão, em tempo real.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Quais flags estão disponíveis?
				</h2>
				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="border-b border-border">
								<th className="py-2 pr-4 text-left font-semibold text-foreground w-12">
									Flag
								</th>
								<th className="py-2 pr-4 text-left font-semibold text-foreground w-32">
									Nome
								</th>
								<th className="py-2 text-left font-semibold text-foreground">
									Comportamento
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">g</td>
								<td className="py-2 pr-4 text-muted-foreground">global</td>
								<td className="py-2 text-muted-foreground">
									Encontra todos os matches, não apenas o primeiro
								</td>
							</tr>
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">i</td>
								<td className="py-2 pr-4 text-muted-foreground">
									case insensitive
								</td>
								<td className="py-2 text-muted-foreground">
									Ignora diferença entre maiúsculas e minúsculas
								</td>
							</tr>
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">m</td>
								<td className="py-2 pr-4 text-muted-foreground">multiline</td>
								<td className="py-2 text-muted-foreground">
									<code className="font-mono">^</code> e{" "}
									<code className="font-mono">$</code> funcionam por linha, não
									pela string inteira
								</td>
							</tr>
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">s</td>
								<td className="py-2 pr-4 text-muted-foreground">dotAll</td>
								<td className="py-2 text-muted-foreground">
									O ponto (<code className="font-mono">.</code>) também captura
									quebras de linha
								</td>
							</tr>
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">u</td>
								<td className="py-2 pr-4 text-muted-foreground">unicode</td>
								<td className="py-2 text-muted-foreground">
									Habilita suporte completo a Unicode
								</td>
							</tr>
							<tr>
								<td className="py-2 pr-4 font-mono text-primary">y</td>
								<td className="py-2 pr-4 text-muted-foreground">sticky</td>
								<td className="py-2 text-muted-foreground">
									Busca a partir da posição exata do cursor (lastIndex)
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como capturar grupos nomeados?
						</h3>
						<p>
							Use a sintaxe{" "}
							<code className="font-mono text-sm">{"(?<nome>padrão)"}</code>. Por
							exemplo,{" "}
							<code className="font-mono text-sm">
								{"(?<ano>\\d{4})-(?<mes>\\d{2})"}
							</code>{" "}
							captura o ano e o mês em grupos com nome, que aparecem na seção
							&ldquo;Grupos nomeados&rdquo; do painel de resultados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que fazer quando o padrão é inválido?
						</h3>
						<p>
							O testador exibe a mensagem de erro do JavaScript abaixo do campo
							de padrão, em vermelho. Erros comuns incluem parênteses não fechados,
							quantificadores inválidos e caracteres de escape incorretos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados do texto de teste são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a execução do regex ocorre localmente no seu navegador,
							usando a engine JavaScript nativa. Nenhum dado é enviado para
							servidores externos.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function RegexTesterPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/testador-de-regex"
			title="Testador de Regex"
			description="Teste expressões regulares com highlighting de matches em tempo real. Flags, grupos capturantes e referência rápida incluídos."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/testador-de-regex" />
			}
			extraContent={<SeoContent />}
		>
			<RegexTester />
		</PageLayout>
	);
}
