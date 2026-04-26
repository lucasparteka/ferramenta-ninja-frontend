import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextCleaner } from "@/components/tools/text-cleaner/text-cleaner";

export const metadata: Metadata = {
	title: "Remover Quebras de Linha do Texto Online | Ferramenta Ninja",
	description:
		"Remova quebras de linha e normalize parágrafos automaticamente. Ideal para textos copiados de PDFs e emails.",
	keywords: [
		"remover quebra de linha",
		"tirar quebra de linha texto",
		"unir linhas texto",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que remover quebras de linha?
				</h2>
				<p>
					Textos copiados de PDFs ou emails frequentemente possuem quebras de
					linha no meio das frases.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Quando usar</h2>
				<div className="space-y-3">
					<p>Texto colado de PDF</p>
					<p>Conteúdo quebrado em várias linhas</p>
					<p>Preparar texto para publicação</p>
				</div>
			</section>
		</>
	);
}

export default function Page() {
	return (
		<PageLayout
			toolHref="/ferramentas/remover-quebras-de-linhas"
			title="Remover Quebras de Linha"
			description="Una linhas quebradas e normalize seu texto automaticamente."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/remover-quebras-de-linhas" />
			}
			extraContent={<SeoContent />}
		>
			<TextCleaner
				defaultOptions={{
					removeLineBreaks: true,
					removeExtraSpaces: false,
					removeInvisible: false,
					trimLines: false,
				}}
			/>
		</PageLayout>
	);
}
