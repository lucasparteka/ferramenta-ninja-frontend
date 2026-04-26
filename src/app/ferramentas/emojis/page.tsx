import type { Metadata } from "next";
import { CopyGrid } from "@/components/shared/copy-grid";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { emojiCategories } from "@/lib/data/emojis";

export const metadata: Metadata = {
	title: "Emojis para Copiar e Colar | Ferramenta Ninja",
	description:
		"Copie emojis com um clique. Rostos, gestos, animais, comida, objetos e muito mais. Ferramenta gratuita, sem cadastro.",
};

export default function EmojisPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/emojis"
			title="Emojis para Copiar e Colar"
			description="Clique em qualquer emoji para copiá-lo para a área de transferência."
			extraContent={
				<section>
					<h2 className="mb-4 text-xl font-bold text-foreground">
						Sobre os emojis
					</h2>
					<p>
						Os emojis são caracteres Unicode padronizados e funcionam em
						qualquer plataforma: WhatsApp, Instagram, Twitter, e-mail,
						documentos e muito mais. Clique para copiar e cole onde quiser.
					</p>
				</section>
			}
		>
			<CopyGrid categories={emojiCategories} itemClass="h-12 w-12 text-2xl" />
		</PageLayout>
	);
}
