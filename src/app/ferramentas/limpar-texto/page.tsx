import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextCleaner } from "@/components/tools/text-cleaner/text-cleaner";

export const metadata: Metadata = {
	title: "Limpador de Texto Online (Remover Espaços, Invisíveis e Encoding)",
	description:
		"Limpe e normalize textos online gratuitamente. Remova espaços extras, caracteres invisíveis, quebras de linha e problemas de encoding. Funciona direto no navegador.",
	keywords: [
		"limpar texto",
		"limpador de texto online",
		"remover caracteres invisíveis",
		"remover espaços extras",
		"normalizar texto",
		"corrigir encoding texto",
		"remove hidden characters",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um limpador de texto?
				</h2>
				<p>
					O <strong className="text-foreground">limpador de texto</strong> é uma
					ferramenta que remove automaticamente caracteres indesejados, como{" "}
					<strong className="text-foreground">espaços extras</strong>,{" "}
					<strong className="text-foreground">quebras de linha</strong> e{" "}
					<strong className="text-foreground">caracteres invisíveis</strong>,
					muito comuns ao copiar conteúdo de PDFs, Word ou páginas da web.
				</p>
				<p className="mt-3">
					Todo o processamento é feito diretamente no navegador, garantindo
					privacidade total dos seus dados.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o limpador de texto
				</h2>
				<ol className="list-decimal space-y-3 pl-6">
					<li>Cole o texto no campo de entrada.</li>
					<li>Selecione as opções de limpeza desejadas.</li>
					<li>Visualize o resultado instantaneamente.</li>
					<li>Copie o texto limpo com um clique.</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Exemplos de uso
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Textos de PDF:</strong> remova
						quebras de linha e espaços inconsistentes ao copiar conteúdo de
						documentos.
					</p>
					<p>
						<strong className="text-foreground">Código:</strong> limpe
						caracteres invisíveis que podem causar bugs difíceis de identificar.
					</p>
					<p>
						<strong className="text-foreground">Conteúdo web:</strong> normalize
						textos copiados de sites e editores ricos.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="font-semibold text-foreground">
							Meu texto é enviado para o servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece localmente no seu navegador.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-foreground">
							O que são caracteres invisíveis?
						</h3>
						<p>
							São caracteres que não aparecem visualmente, como espaços
							especiais e símbolos Unicode ocultos, mas que podem afetar o
							comportamento do texto.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function LimparTextoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/limpar-texto"
			title="Limpador de Texto Avançado"
			description="Remova espaços extras, caracteres invisíveis e normalize textos rapidamente."
			relatedTools={<RelatedTools currentHref="/ferramentas/limpar-texto" />}
			extraContent={<SeoContent />}
		>
			<TextCleaner />
		</PageLayout>
	);
}
