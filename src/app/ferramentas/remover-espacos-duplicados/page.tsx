import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextCleaner } from "@/components/tools/text-cleaner/text-cleaner";

export const metadata: Metadata = {
	title: "Remover Espaços Duplicados do Texto Online | Ferramenta Ninja",
	description:
		"Remova espaços duplicados e normalize seu texto automaticamente. Ideal para limpar textos copiados de PDFs, Word ou planilhas.",
	keywords: [
		"remover espacos duplicados",
		"tirar espacos extras texto",
		"normalizar espacos texto",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que remover espaços duplicados?
				</h2>
				<p>
					Espaços duplicados podem causar problemas de leitura, quebra de layout
					e inconsistências em dados.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Quando usar</h2>
				<div className="space-y-3">
					<p>Texto copiado de PDF ou Word</p>
					<p>Dados exportados com formatação incorreta</p>
					<p>Preparação de texto para código</p>
				</div>
			</section>
		</>
	);
}

export default function Page() {
	return (
		<PageLayout
			title="Remover Espaços Duplicados"
			description="Elimine espaços extras do seu texto com um clique."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/remover-espacos-duplicados" />
			}
			extraContent={<SeoContent />}
		>
			<TextCleaner
				defaultOptions={{
					removeExtraSpaces: true,
					removeInvisible: false,
					removeLineBreaks: false,
					trimLines: false,
				}}
			/>
		</PageLayout>
	);
}
