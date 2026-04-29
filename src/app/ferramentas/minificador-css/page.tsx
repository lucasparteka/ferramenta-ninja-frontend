import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CssMinifier } from "@/components/tools/css-minifier/css-minifier";

export const metadata: Metadata = {
	title: "Minificador de CSS, JS e HTML Online Grátis | Ferramenta Ninja",
	description:
		"Minifique CSS, JavaScript e HTML online. Reduza o tamanho dos arquivos removendo espaços e comentários. Ferramenta gratuita e sem cadastro.",
};

const faq = [
	{
		question: "O que é minificação?",
		answer:
			"Minificação é o processo de remover espaços em branco, quebras de linha e comentários de código, reduzindo o tamanho do arquivo sem alterar sua funcionalidade.",
	},
	{
		question: "A minificação altera o funcionamento do código?",
		answer:
			"Não. A minificação apenas remove caracteres desnecessários para a execução. O comportamento do código permanece idêntico ao original.",
	},
	{
		question: "Quanto de redução é possível obter?",
		answer:
			"Depende do código. Arquivos bem comentados e indentados podem reduzir 30% a 70% do tamanho. O resultado é exibido em bytes e porcentagem.",
	},
	{
		question: "Posso desfazer a minificação?",
		answer:
			"Não diretamente. A minificação é irreversível porque remove comentários e formatação. Mantenha sempre o código original em um arquivo separado.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é minificação de código?
				</h2>
				<p>
					Minificação é o processo de remover todos os caracteres desnecessários
					do código-fonte sem alterar sua funcionalidade. Isso inclui espaços em
					branco, quebras de linha, comentários e indentação. O resultado é um
					arquivo menor e mais rápido de transferir.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que minificar CSS, JS e HTML?
				</h2>
				<div className="space-y-3">
					<p>
						Arquivos menores trazem benefícios diretos para performance e SEO:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">
								Carregamento mais rápido:
							</strong>{" "}
							menos bytes para transferir significa páginas mais rápidas.
						</li>
						<li>
							<strong className="text-foreground">
								Menos consumo de banda:
							</strong>{" "}
							ideal para usuários com conexões lentas ou limitadas.
						</li>
						<li>
							<strong className="text-foreground">
								Melhor Core Web Vitals:
							</strong>{" "}
							arquivos menores melhoram métricas como LCP e FCP.
						</li>
						<li>
							<strong className="text-foreground">
								Economia de hospedagem:
							</strong>{" "}
							menos dados transferidos podem reduzir custos de CDN.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Selecione o tipo de código (CSS, JavaScript ou HTML), cole o código
						no campo de entrada e clique em "Minificar". O resultado aparece
						instantaneamente com estatísticas de redução de tamanho. Copie o
						código minificado com um clique.
					</p>
				</div>
			</section>
		</>
	);
}

export default function MinificadorCssPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/minificador-css"
			title="Minificador de CSS, JS e HTML"
			description="Minifique CSS, JavaScript e HTML online. Reduza o tamanho dos arquivos removendo espaços, comentários e quebras de linha. Rápido, gratuito e 100% no navegador."
			relatedTools={<RelatedTools currentHref="/ferramentas/minificador-css" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CssMinifier />
		</PageLayout>
	);
}
