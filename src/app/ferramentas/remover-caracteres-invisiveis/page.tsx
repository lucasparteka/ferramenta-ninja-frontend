import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { TextCleaner } from "@/components/tools/text-cleaner/text-cleaner";

export const metadata: Metadata = {
	title: "Remover Caracteres Invisíveis do Texto Online | Ferramenta Ninja",
	description:
		"Remova caracteres invisíveis como espaços ocultos, zero-width e símbolos invisíveis do seu texto online. 100% no navegador.",
	keywords: [
		"remover caracteres invisiveis",
		"tirar caracteres ocultos texto",
		"zero width remover",
		"limpar caracteres invisiveis",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são caracteres invisíveis?
				</h2>
				<p>
					<strong className="text-foreground">Caracteres invisíveis</strong> são
					símbolos que não aparecem visualmente, mas podem quebrar código,
					validações ou layout.
				</p>
				<p className="mt-3">
					Exemplos incluem espaços especiais, zero-width characters e quebras
					ocultas vindas de PDFs ou editores de texto.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Quando remover caracteres invisíveis
				</h2>
				<div className="space-y-3">
					<p>Erros misteriosos em código</p>
					<p>Problemas ao colar texto em formulários</p>
					<p>Falhas em validação de dados</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="font-semibold text-foreground">
							O que é zero-width space?
						</h3>
						<p>
							É um caractere invisível que ocupa espaço no texto mas não é
							visível.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function Page() {
	return (
		<PageLayout
			title="Remover Caracteres Invisíveis"
			description="Cole seu texto e remova automaticamente caracteres ocultos e invisíveis."
			extraContent={<SeoContent />}
		>
			<TextCleaner
				defaultOptions={{
					removeInvisible: true,
					removeExtraSpaces: false,
					removeLineBreaks: false,
					trimLines: false,
				}}
			/>
		</PageLayout>
	);
}
