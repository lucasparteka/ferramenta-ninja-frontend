import type { Metadata } from "next";
import { CopyGrid } from "@/components/shared/copy-grid";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { symbolCategories } from "@/lib/data/symbols";

export const metadata: Metadata = {
	title: "Símbolos para Copiar e Colar | Ferramenta Ninja",
	description:
		"Copie símbolos especiais com um clique. Matemática, setas, moedas, formas, tipografia e muito mais. Ferramenta gratuita, sem cadastro.",
};

export default function SimbolosPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/simbolos"
			title="Símbolos para Copiar e Colar"
			description="Clique em qualquer símbolo para copiá-lo para a área de transferência."
			extraContent={
				<section>
					<h2 className="mb-4 text-xl font-bold text-foreground">
						Sobre os símbolos
					</h2>
					<p>
						Todos os símbolos desta página são caracteres Unicode e funcionam em
						qualquer plataforma que suporte texto — documentos, planilhas,
						e-mails, sites e aplicativos. Úteis para matemática, design,
						tipografia e comunicação.
					</p>
				</section>
			}
		>
			<CopyGrid
				categories={symbolCategories}
				itemClass="h-12 w-12 text-xl font-mono"
			/>
		</PageLayout>
	);
}
