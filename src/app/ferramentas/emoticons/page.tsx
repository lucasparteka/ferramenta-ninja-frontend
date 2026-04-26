import type { Metadata } from "next";
import { CopyGrid } from "@/components/shared/copy-grid";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { emoticonCategories } from "@/lib/data/emoticons";

export const metadata: Metadata = {
	title: "Emoticons para Copiar e Colar | Ferramenta Ninja",
	description:
		"Copie emoticons de texto com um clique. Clássicos, kaomoji, rostos e gestos. Ferramenta gratuita, sem cadastro.",
};

export default function EmoticonsPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/emoticons"
			title="Emoticons para Copiar e Colar"
			description="Clique em qualquer emoticon para copiá-lo para a área de transferência."
			extraContent={
				<section>
					<h2 className="mb-4 text-xl font-bold text-foreground">
						Sobre os emoticons
					</h2>
					<p>
						Emoticons são representações de expressões faciais e gestos feitas
						com caracteres de texto. Diferente dos emojis, funcionam em qualquer
						sistema que exiba texto puro, incluindo terminais, e-mails antigos e
						sistemas sem suporte a Unicode estendido.
					</p>
				</section>
			}
		>
			<CopyGrid
				categories={emoticonCategories}
				itemClass="h-10 px-3 text-sm font-mono whitespace-nowrap"
			/>
		</PageLayout>
	);
}
