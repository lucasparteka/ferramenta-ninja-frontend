import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { TextGenerator } from "@/components/tools/text-generator/text-generator";

export const metadata: Metadata = {
	title:
		"Gerador de Texto Online Grátis: Lorem Ipsum e Texto Aleatório | Ferramenta Ninja",
	description:
		"Gere Lorem Ipsum ou texto aleatório em palavras, frases ou parágrafos. Ferramenta gratuita para designers, desenvolvedores e criadores de conteúdo.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é Lorem Ipsum?
				</h2>
				<p>
					Lorem Ipsum é um texto de preenchimento usado na indústria gráfica e
					editorial desde o século XVI. Originado de uma obra do filósofo romano
					Cícero chamada "De Finibus Bonorum et Malorum", o texto foi
					embaralhado e adaptado para servir como conteúdo fictício em layouts e
					protótipos.
				</p>
				<p className="mt-3">
					A principal vantagem do Lorem Ipsum é que ele imita a distribuição
					natural de letras e palavras do latim, permitindo que o leitor foque
					no design da página e não no conteúdo em si. Por isso, é amplamente
					utilizado em design gráfico, desenvolvimento web e prototipação de
					interfaces.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é texto aleatório?
				</h2>
				<p>
					Diferente do Lorem Ipsum, o texto aleatório utiliza palavras reais do
					português para gerar conteúdo de preenchimento. É útil quando o
					público-alvo precisa reconhecer o idioma do projeto, como em
					apresentações para clientes, testes de internacionalização ou
					validação de layouts com conteúdo em português.
				</p>
				<p className="mt-3">
					O texto aleatório gerado por esta ferramenta não possui significado
					semântico — é apenas um agrupamento de palavras comuns em português
					para simular a presença de conteúdo real.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Design de interfaces (UI/UX):
						</strong>{" "}
						preencha wireframes, mockups e protótipos com texto realista para
						avaliar hierarquia visual, espaçamento e tipografia antes do
						conteúdo final estar pronto.
					</p>
					<p>
						<strong className="text-foreground">Desenvolvimento web:</strong>{" "}
						popule componentes, templates e páginas durante o desenvolvimento
						sem precisar escrever conteúdo manualmente. Ideal para testes de
						responsividade com diferentes quantidades de texto.
					</p>
					<p>
						<strong className="text-foreground">Prototipação rápida:</strong>{" "}
						apresente conceitos e layouts para clientes com texto de
						preenchimento realista, comunicando a estrutura da página sem
						distrair com conteúdo incompleto.
					</p>
					<p>
						<strong className="text-foreground">Testes de sistema:</strong>{" "}
						preencha campos de formulários, banco de dados de teste e fixtures
						com texto variado para validar o comportamento da aplicação com
						diferentes volumes de conteúdo.
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
							O que é Lorem Ipsum?
						</h3>
						<p>
							Lorem Ipsum é um texto fictício em latim usado como preenchimento
							em projetos de design e desenvolvimento. Ele imita a aparência de
							texto real sem ter significado semântico, permitindo que designers
							e desenvolvedores foquem no layout.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Para que serve o texto aleatório?
						</h3>
						<p>
							O texto aleatório em português é útil quando o projeto precisa
							simular conteúdo no idioma do usuário final, como em apresentações
							para clientes brasileiros ou testes de interface com conteúdo em
							português.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar esse texto em projetos reais?
						</h3>
						<p>
							O texto gerado é apenas para fins de preenchimento e prototipação.
							Não deve ser usado como conteúdo final em produção, pois não
							possui significado real nem está sujeito a direitos autorais.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O gerador de texto é gratuito?
						</h3>
						<p>
							Sim, completamente gratuito e sem necessidade de cadastro. Todo o
							processamento acontece diretamente no seu navegador, sem enviar
							dados para nenhum servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre palavras, frases e parágrafos?
						</h3>
						<p>
							Ao selecionar <strong>Palavras</strong>, o gerador retorna o
							número exato de palavras solicitadas. Com <strong>Frases</strong>,
							cada unidade é uma sentença completa com começo e ponto final. Com{" "}
							<strong>Parágrafos</strong>, o resultado é agrupado em blocos de
							três a cinco frases, separados por linhas em branco.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeTextoPage() {
	return (
		<PageLayout
			title="Gerador de Texto Online (Lorem Ipsum e Texto Aleatório)"
			description="Gere Lorem Ipsum ou texto aleatório em palavras, frases ou parágrafos. Ideal para designers, desenvolvedores e prototipação de interfaces."
			extraContent={<SeoContent />}
		>
			<TextGenerator />
		</PageLayout>
	);
}
