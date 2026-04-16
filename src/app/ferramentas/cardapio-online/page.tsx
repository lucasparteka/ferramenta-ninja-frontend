import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { MenuClient } from "@/components/tools/menu/menu-client";
import type { LucideIcon } from "@/lib/data/tools";

export const metadata: Metadata = {
	title: "Criador de Cardápio Online Grátis para Imprimir | Ferramenta Ninja",
	description:
		"Crie cardápios personalizados prontos para impressão em PDF. Templates profissionais, sem cadastro, sem instalação. Ideal para restaurantes, bares, lanchonetes e eventos.",
	keywords: [
		"cardápio para imprimir",
		"cardápio simples pdf",
		"criar cardápio online",
		"menu restaurante grátis",
		"cardápio personalizado",
		"cardápio digital grátis",
		"fazer cardápio online",
		"gerador de cardápio",
	],
	openGraph: {
		title: "Criador de Cardápio Online Grátis para Imprimir | Ferramenta Ninja",
		description:
			"Crie cardápios personalizados com templates prontos. Exporte em PDF ou PNG, pronto para imprimir. Sem cadastro, sem instalação.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um cardápio digital?
				</h2>
				<p>
					Um cardápio digital é uma versão criada online do menu de um
					estabelecimento, projetada para ser impressa ou compartilhada
					digitalmente. Diferente de soluções complexas de design, ele foca no
					essencial: título, seções, itens e preços — tudo organizado de forma
					clara e profissional.
				</p>
				<p className="mt-3">
					Com este criador de cardápio você não precisa de conhecimento em
					design ou programas pagos. Em minutos você tem um cardápio pronto para
					imprimir em papel A4 ou compartilhar como imagem.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar seu cardápio
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Escolha um template</strong> —
						Clássico, Moderno ou Bistrô. Cada um tem uma organização visual
						diferente.
					</li>
					<li>
						<strong className="text-foreground">Preencha o cabeçalho</strong>{" "}
						com o nome do estabelecimento e um subtítulo opcional.
					</li>
					<li>
						<strong className="text-foreground">Adicione seções e itens</strong>{" "}
						como Entradas, Pratos Principais, Bebidas, Sobremesas.
					</li>
					<li>
						<strong className="text-foreground">Personalize o estilo</strong> —
						cor principal, cor de fundo e fonte.
					</li>
					<li>
						<strong className="text-foreground">Baixe em PDF ou PNG</strong> e
						imprima ou compartilhe.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Restaurantes e bares:</strong>{" "}
						crie menus impressos para mesas, balcão ou quadro.
					</p>
					<p>
						<strong className="text-foreground">Delivery e lanchonetes:</strong>{" "}
						monte um cardápio visual para compartilhar no WhatsApp ou Instagram.
					</p>
					<p>
						<strong className="text-foreground">
							Eventos e confraternizações:
						</strong>{" "}
						cardápio de jantar especial ou festa temática com visual elegante.
					</p>
					<p>
						<strong className="text-foreground">Food trucks:</strong> cardápio
						compacto em duas colunas com itens e preços bem organizados.
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
							Como imprimir o cardápio?
						</h3>
						<p>
							Baixe o arquivo em PDF e abra em qualquer leitor de PDF. Configure
							o papel para A4 e imprima normalmente. Para melhor resultado,
							desative as margens automáticas da impressora.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso personalizar cores e fontes?
						</h3>
						<p>
							Sim. Você pode escolher a cor principal, a cor de fundo e a fonte
							do cardápio. As alterações aparecem em tempo real na prévia.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre PDF e PNG?
						</h3>
						<p>
							O PDF é recomendado para impressão por manter a qualidade em
							qualquer escala. O PNG é uma imagem ideal para compartilhar
							digitalmente em redes sociais ou mensagens.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados ficam salvos?
						</h3>
						<p>
							Não. O cardápio é criado diretamente no navegador e não é salvo em
							nenhum servidor. Baixe o arquivo antes de fechar a página.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CardapioOnlinePage() {
	return (
		<PageLayout
			title="Criador de Cardápio Online"
			description="Crie cardápios personalizados com templates prontos. Exporte em PDF ou PNG e imprima em A4. Sem cadastro, sem instalação."
			relatedTools={
				<RelatedTools
					currentHref="/ferramentas/cardapio-online"
					customTools={[
						{
							name: "Gerador de Recibo",
							href: "/ferramentas/recibo-simples",
							description: "Recibos prontos para impressão",
							tags: ["pdf", "financeiro", "documento"],
							intent: "generate",
						},
						{
							name: "Checklist Personalizado",
							href: "/ferramentas/checklist-personalizado",
							description: "Crie e imprima checklists personalizados",
							tags: ["pdf", "impressao", "organizacao"],
							intent: "generate",
						},
						{
							name: "Gerador de QR Code",
							href: "/ferramentas/gerador-de-qr-code",
							description: "QR codes personalizados",
							tags: ["qr", "compartilhamento"],
							intent: "generate",
						},
						{
							name: "Criador de Cartão fidelidade",
							href: "/ferramentas/cartao-fidelidade",
							description:
								"Crie cartões de fidelidade personalizados prontos para impressão em PDF",
							tags: ["pdf", "impressao", "fidelidade", "design"],
							intent: "generate",
							weight: 2,
						},
						{
							name: "Formatar Texto Para WhatsApp",
							href: "/ferramentas/formatador-de-texto-whatsapp",
							description: "Formate com negrito, itálico e código",
							tags: ["texto", "whatsapp", "formatacao"],
							intent: "format",
							weight: 1,
						},
						{
							name: "Converter CSV para PDF",
							href: "/ferramentas/converter-csv-para-pdf",
							description: "Transforme CSV em PDF formatado",
							tags: ["csv", "pdf", "exportacao"],
							intent: "convert",
						},
					]}
				/>
			}
			extraContent={<SeoContent />}
		>
			<MenuClient />
		</PageLayout>
	);
}
