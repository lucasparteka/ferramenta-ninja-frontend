import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { Base64Tool } from "@/components/tools/base64/base64";

export const metadata: Metadata = {
	title: "Base64 Encode e Decode Online Grátis | Ferramenta Ninja",
	description:
		"Codifique e decodifique texto para Base64 online. Ferramenta gratuita, sem cadastro e 100% no navegador. Suporte a caracteres especiais e UTF-8.",
};

const faq = [
	{
		question: "O que é Base64?",
		answer:
			"Base64 é um método de codificação que converte dados binários em texto ASCII. É amplamente usado para transmitir dados em meios que só suportam texto, como e-mails e URLs.",
	},
	{
		question: "Essa ferramenta suporta UTF-8?",
		answer:
			"Sim. Nossa ferramenta codifica e decodifica corretamente caracteres especiais, acentos e emojis usando UTF-8.",
	},
	{
		question: "Meus dados são enviados para algum servidor?",
		answer:
			"Não. Toda a codificação e decodificação acontece diretamente no seu navegador. Seus dados nunca saem do dispositivo.",
	},
	{
		question: "Qual a diferença entre codificar e decodificar?",
		answer:
			"Codificar transforma texto normal em Base64. Decodificar reverte o texto Base64 de volta para o formato original.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é codificação Base64?
				</h2>
				<p>
					Base64 é um esquema de codificação que converte dados binários em uma
					representação textual usando 64 caracteres ASCII. É essencial para
					transmitir dados em protocolos que só suportam texto, como JSON, XML,
					e-mails e URLs.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve o Base64?
				</h2>
				<div className="space-y-3">
					<p>
						O Base64 é usado em diversas situações no desenvolvimento web e
						mobile:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Imagens inline:</strong>{" "}
							incorporar imagens diretamente em HTML/CSS usando data URIs.
						</li>
						<li>
							<strong className="text-foreground">APIs e JSON:</strong> enviar
							dados binários em payloads de texto.
						</li>
						<li>
							<strong className="text-foreground">E-mails:</strong> anexos e
							imagens em mensagens de texto.
						</li>
						<li>
							<strong className="text-foreground">Autenticação:</strong>{" "}
							cabeçalho Basic Auth usa Base64 para codificar usuário e senha.
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
						Escolha entre codificar ou decodificar, cole o texto e clique no
						botão. O resultado aparece instantaneamente, pronto para copiar.
						Funciona com qualquer texto, incluindo acentos, caracteres especiais
						e emojis.
					</p>
				</div>
			</section>
		</>
	);
}

export default function Base64Page() {
	return (
		<PageLayout
			toolHref="/ferramentas/base64"
			title="Base64 Encode e Decode"
			description="Codifique e decodifique texto para Base64 online. Suporte completo a UTF-8, caracteres especiais e emojis. Rápido, gratuito e 100% no navegador."
			relatedTools={<RelatedTools currentHref="/ferramentas/base64" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<Base64Tool />
		</PageLayout>
	);
}
