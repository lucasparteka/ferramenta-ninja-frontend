import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { DrawingCanvasClient } from "@/components/tools/drawing-canvas/drawing-canvas-client";

export const metadata: Metadata = {
	title: "Desenhar Online Grátis (Tipo Paint) | Ferramenta Ninja",
	description:
		"Desenhe online grátis direto no navegador. Ferramenta tipo Paint com lápis, borracha, formas, cores e exportação em PNG. Sem instalação, sem cadastro.",
	keywords: [
		"desenhar online grátis",
		"paint online",
		"quadro branco online",
		"desenho online",
		"ferramenta de desenho online",
		"desenhar no navegador",
		"whiteboard online grátis",
		"desenhar e salvar imagem",
		"canvas online desenho",
	],
	openGraph: {
		title: "Desenhar Online Grátis (Tipo Paint) | Ferramenta Ninja",
		description:
			"Desenhe online grátis direto no navegador. Lápis, borracha, formas, cores e exportação em PNG. Sem instalação.",
	},
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um desenhador online?
				</h2>
				<p>
					Um desenhador online é uma ferramenta que funciona diretamente no
					navegador, permitindo criar desenhos, esboços e ilustrações sem
					precisar instalar nenhum programa. Funciona como um Paint digital
					acessível de qualquer dispositivo — computador, tablet ou celular.
				</p>
				<p className="mt-3">
					Com recursos como lápis livre, borracha, formas geométricas e paleta
					de cores, é possível criar desde rabiscos rápidos até apresentações
					visuais mais elaboradas. Todo o processamento ocorre no seu navegador:
					nenhum dado é enviado a servidores externos.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar este paint online
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						Escolha a ferramenta desejada: Lápis, Borracha, Retângulo ou
						Círculo.
					</li>
					<li>
						Selecione a cor e o tamanho do pincel nas opções da barra lateral.
					</li>
					<li>Desenhe livremente na área de canvas clicando e arrastando.</li>
					<li>
						Para criar formas, selecione Retângulo ou Círculo e arraste no
						canvas para definir o tamanho.
					</li>
					<li>
						Clique em <strong className="text-foreground">Salvar imagem</strong>{" "}
						para baixar seu desenho em PNG com resolução dobrada.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Rascunhos rápidos:</strong>{" "}
						capture ideias visualmente sem precisar de papel ou lápis físico.
						Ideal para reuniões remotas e brainstormings.
					</p>
					<p>
						<strong className="text-foreground">Explicações visuais:</strong>{" "}
						ilustre conceitos, fluxos ou esquemas de forma simples e compartilhe
						como imagem.
					</p>
					<p>
						<strong className="text-foreground">Estudos e anotações:</strong>{" "}
						faça anotações visuais, diagramas ou mapas mentais durante estudos
						ou aulas online.
					</p>
					<p>
						<strong className="text-foreground">Planejamento:</strong> esboce
						layouts, wireframes simples ou planos de projetos de forma rápida e
						visual.
					</p>
					<p>
						<strong className="text-foreground">
							Quadro branco em reuniões:
						</strong>{" "}
						use como whiteboard compartilhado para apresentações e colaboração
						visual durante chamadas de vídeo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Diferença entre paint e quadro branco online
				</h2>
				<p>
					Um <strong className="text-foreground">paint online</strong> é focado
					em criar imagens pixel a pixel ou com traços livres, como o clássico
					Paint do Windows. Já um{" "}
					<strong className="text-foreground">quadro branco online</strong>{" "}
					(whiteboard) é voltado para colaboração em tempo real, com formas
					geométricas, textos e múltiplos usuários editando ao mesmo tempo.
				</p>
				<p className="mt-3">
					Esta ferramenta combina o melhor dos dois mundos: o traço livre de um
					paint com as formas geométricas de um whiteboard, tudo funcionando
					localmente no navegador sem necessidade de conta ou conexão com
					servidor.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como desenhar online grátis?
						</h3>
						<p>
							Basta acessar esta página, escolher a ferramenta Lápis na barra
							lateral e começar a desenhar clicando e arrastando na área de
							canvas. Não é necessário criar conta ou instalar nada.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esse paint online funciona no celular?
						</h3>
						<p>
							Sim. A ferramenta é responsiva e funciona com toque em smartphones
							e tablets. A barra de ferramentas se adapta para telas menores,
							ficando no topo da tela.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Preciso instalar algo?
						</h3>
						<p>
							Não. Tudo funciona diretamente no navegador, sem extensões,
							plugins ou instalações. Basta abrir a página e começar a desenhar.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como salvar meu desenho?
						</h3>
						<p>
							Clique no botão{" "}
							<strong className="text-foreground">Salvar imagem</strong> na
							barra de ferramentas. O arquivo será baixado automaticamente no
							formato PNG com resolução 2x para maior qualidade.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar como quadro branco online?
						</h3>
						<p>
							Sim. Com as ferramentas de formas geométricas (retângulo e
							círculo) e o lápis livre, é possível usar o canvas como um
							whiteboard para explicações visuais, esquemas e planejamentos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A imagem exportada perde qualidade?
						</h3>
						<p>
							Não. A exportação usa multiplicador de resolução 2x, garantindo
							que a imagem salva tenha o dobro da resolução exibida na tela, com
							qualidade superior para impressão ou compartilhamento.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function DesenharOnlinePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/desenhar-online"
			title="Desenhar Online Grátis (Tipo Paint)"
			description="Desenhe livremente no navegador com lápis, borracha, formas e cores. Exporte em PNG sem instalar nada."
			relatedTools={<RelatedTools currentHref="/ferramentas/desenhar-online" />}
			extraContent={<SeoContent />}
		>
			<DrawingCanvasClient />
		</PageLayout>
	);
}
