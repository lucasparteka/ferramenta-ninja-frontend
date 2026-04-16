import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CharacterCounter } from "@/components/tools/character-counter/character-counter";

export const metadata: Metadata = {
	title: "Contador de Caracteres Online Gratuito | Ferramenta Ninja",
	description:
		"Conte caracteres, palavras, linhas e parágrafos do seu texto em tempo real. Ferramenta gratuita, sem cadastro, funciona diretamente no navegador.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o Contador de Caracteres?
				</h2>
				<p>
					O contador analisa o texto que você digita ou cola em tempo real, sem
					enviar nenhuma informação para servidores externos. Todo o
					processamento ocorre diretamente no seu navegador.
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Caracteres com espaços:</strong>{" "}
						conta todos os caracteres, incluindo espaços e quebras de linha.
					</li>
					<li>
						<strong className="text-foreground">Caracteres sem espaços:</strong>{" "}
						remove todos os espaços antes de contar.
					</li>
					<li>
						<strong className="text-foreground">Palavras:</strong> divide o
						texto por espaços em branco e conta os grupos não vazios.
					</li>
					<li>
						<strong className="text-foreground">Linhas:</strong> conta o número
						de linhas separadas por quebra de linha.
					</li>
					<li>
						<strong className="text-foreground">Parágrafos:</strong> conta
						blocos de texto separados por linhas em branco.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um Contador de Caracteres?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Redes sociais:</strong>{" "}
						plataformas como Twitter/X (280 caracteres), Instagram e LinkedIn
						possuem limites de caracteres. Use esta ferramenta para garantir que
						seu texto se encaixa antes de publicar.
					</p>
					<p>
						<strong className="text-foreground">Otimização de escrita:</strong>{" "}
						verifique o tamanho de títulos para SEO (recomendado: até 60
						caracteres), meta descrições (até 160 caracteres) e outros elementos
						de texto.
					</p>
					<p>
						<strong className="text-foreground">Formulários e sistemas:</strong>{" "}
						muitos sistemas limitam o número de caracteres em campos de texto.
						Conte antecipadamente para evitar erros ao enviar.
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
							Os dados do meu texto são salvos?
						</h3>
						<p>
							Não. O texto é processado inteiramente no seu navegador e nunca é
							enviado para nenhum servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de texto?
						</h3>
						<p>
							Não há limite técnico imposto pela ferramenta. Textos muito
							grandes podem variar conforme a capacidade do seu dispositivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como são contados os parágrafos?
						</h3>
						<p>
							Parágrafos são blocos de texto separados por pelo menos uma linha
							em branco (duas quebras de linha consecutivas).
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ContadorDeCaracteresPage() {
	return (
		<PageLayout
			title="Contador de Caracteres"
			description="Analise seu texto em tempo real: conte caracteres, palavras, linhas e parágrafos instantaneamente."
			relatedTools={<RelatedTools currentHref="/ferramentas/contador-de-caracteres" />}
			extraContent={<SeoContent />}
		>
			<CharacterCounter />
		</PageLayout>
	);
}
