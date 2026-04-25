import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextConverter } from "@/components/tools/text-converter/text-converter";

export const metadata: Metadata = {
	title: "Conversor de Texto Online Grátis | Ferramenta Ninja",
	description:
		"Converta texto para maiúsculo, minúsculo, capitalize, inverta, remova acentos e espaços extras em segundos. Ferramenta gratuita, sem cadastro, direto no navegador.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um Conversor de Texto?
				</h2>
				<p>
					Um conversor de texto é uma ferramenta que aplica transformações
					automáticas ao conteúdo que você digita ou cola. Em vez de editar
					manualmente palavra por palavra, você obtém o resultado desejado com
					um único clique.
				</p>
				<p className="mt-3">
					Esta ferramenta reúne as conversões mais utilizadas no dia a dia:
					alteração de capitalização, remoção de acentos e limpeza de espaços
					desnecessários.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Transformações disponíveis
				</h2>
				<ul className="list-disc space-y-3 pl-6">
					<li>
						<strong className="text-foreground">MAIÚSCULO:</strong> converte
						todo o texto para letras maiúsculas. Útil para títulos em destaque,
						siglas e cabeçalhos.
					</li>
					<li>
						<strong className="text-foreground">minúsculo:</strong> converte
						todo o texto para letras minúsculas. Ideal para normalizar dados ou
						padronizar entradas.
					</li>
					<li>
						<strong className="text-foreground">Capitalizar:</strong> transforma
						a primeira letra de cada palavra em maiúscula. Perfeito para nomes,
						títulos e headings.
					</li>
					<li>
						<strong className="text-foreground">Remover espaços extras:</strong>{" "}
						elimina espaços duplicados e espaços no início e no final do texto.
						Essencial para limpar dados copiados de planilhas ou PDFs.
					</li>
					<li>
						<strong className="text-foreground">Remover acentos:</strong>{" "}
						substitui caracteres acentuados pela versão sem acento (ã → a, é →
						e, ç → c). Muito utilizado para gerar slugs, URLs e compatibilidade
						com sistemas legados.
					</li>
					<li>
						<strong className="text-foreground">Inverter texto:</strong> inverte
						a ordem de todos os caracteres do texto. Útil para efeitos visuais,
						curiosidades linguísticas e alguns casos de uso em programação.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Formatação de conteúdo:</strong>{" "}
						ajuste rapidamente a capitalização de títulos, legendas e parágrafos
						antes de publicar em blogs, redes sociais ou apresentações.
					</p>
					<p>
						<strong className="text-foreground">
							Desenvolvimento e dados:
						</strong>{" "}
						normalize strings para comparações, gere slugs sem acentos para URLs
						e limpe dados importados de fontes externas como CSV ou planilhas.
					</p>
					<p>
						<strong className="text-foreground">Redes sociais:</strong> prepare
						textos com formatação específica para diferentes plataformas, como
						legendas em maiúsculo para Instagram ou títulos capitalizados para
						LinkedIn.
					</p>
					<p>
						<strong className="text-foreground">Limpeza de texto:</strong>{" "}
						remova espaços extras gerados ao copiar conteúdo de PDFs, documentos
						ou e-mails antes de usar o texto em outro sistema.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Benefícios</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Economiza tempo em tarefas repetitivas de formatação.</li>
					<li>Reduz erros causados por edição manual.</li>
					<li>
						Funciona inteiramente no navegador, sem enviar seus dados a nenhum
						servidor.
					</li>
					<li>Sem instalação, sem cadastro e completamente gratuito.</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como colocar texto em maiúsculo?
						</h3>
						<p>
							Cole ou digite o texto no campo de entrada e clique no botão{" "}
							<strong>MAIÚSCULO</strong>. O resultado aparecerá imediatamente na
							área de saída.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como remover espaços extras de um texto?
						</h3>
						<p>
							Digite ou cole o texto e clique em{" "}
							<strong>Remover espaços extras</strong>. A ferramenta eliminará
							espaços duplicados e espaços no início e no fim do texto.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como tirar acentos de palavras?
						</h3>
						<p>
							Cole o texto com acentos e clique em{" "}
							<strong>Remover acentos</strong>. Todos os caracteres acentuados
							serão substituídos pela versão sem acento.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O conversor de texto é gratuito?
						</h3>
						<p>
							Sim, completamente gratuito e sem necessidade de cadastro. Todo o
							processamento acontece no seu navegador.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como inverter um texto?
						</h3>
						<p>
							Cole o texto no campo de entrada e clique em{" "}
							<strong>Inverter texto</strong>. Todos os caracteres serão
							reordenados de trás para frente instantaneamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso aplicar mais de uma transformação?
						</h3>
						<p>
							Sim. O campo de resultado é editável. Você pode copiar o resultado
							de volta ao campo de entrada e aplicar outra transformação,
							encadeando conversões conforme necessário.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConversorDeTextoPage() {
	return (
		<PageLayout
			title="Conversor de Texto Online Grátis"
			description="Converta texto para maiúsculo, minúsculo, capitalize, remova acentos e espaços extras com um clique."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/conversor-de-texto" />
			}
			extraContent={<SeoContent />}
		>
			<TextConverter />
		</PageLayout>
	);
}
