import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { WhatsAppFormatter } from "@/components/tools/whatsapp-formatter/whatsapp-formatter";

export const metadata: Metadata = {
	title: "Formatador de Texto para WhatsApp Online Grátis | Ferramenta Ninja",
	description:
		"Formate mensagens do WhatsApp com negrito, itálico, tachado e monoespaçado em segundos. Ferramenta gratuita, sem cadastro, funciona no celular.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como formatar texto no WhatsApp
				</h2>
				<p>
					O WhatsApp permite aplicar formatação especial nas mensagens usando
					caracteres específicos ao redor do texto. Basta envolver as palavras
					com os símbolos corretos e o aplicativo renderiza o estilo
					automaticamente.
				</p>
				<ul className="mt-4 list-disc space-y-3 pl-6">
					<li>
						<strong className="text-foreground">Negrito:</strong> envolva o
						texto com asteriscos — <code>*texto*</code>. Ideal para destacar
						informações importantes ou títulos em mensagens longas.
					</li>
					<li>
						<strong className="text-foreground">Itálico:</strong> envolva o
						texto com underlines — <code>_texto_</code>. Usado para dar ênfase
						sutil ou indicar termos técnicos.
					</li>
					<li>
						<strong className="text-foreground">Tachado:</strong> envolva o
						texto com til — <code>~texto~</code>. Útil para indicar algo
						cancelado, corrigido ou desatualizado.
					</li>
					<li>
						<strong className="text-foreground">Monoespaçado:</strong> envolva o
						texto com acento grave — <code>`texto`</code>. Perfeito para
						compartilhar códigos, comandos ou dados técnicos.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Exemplos de uso
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Mensagens profissionais:
						</strong>{" "}
						destaque prazos, valores e informações críticas em negrito para
						garantir que o destinatário não perca detalhes importantes.
					</p>
					<p>
						<strong className="text-foreground">Divulgação de produtos:</strong>{" "}
						use negrito para nomes de produtos e preços, itálico para descrições
						e tachado para mostrar o preço antigo em promoções.
					</p>
					<p>
						<strong className="text-foreground">
							Destaque de informações:
						</strong>{" "}
						em grupos e listas de transmissão, a formatação ajuda o leitor a
						identificar rapidamente o que é mais relevante sem precisar ler
						tudo.
					</p>
					<p>
						<strong className="text-foreground">Suporte técnico:</strong> use
						monoespaçado para compartilhar senhas, códigos, endereços de e-mail
						ou comandos de forma clara e sem ambiguidade.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Dicas de formatação
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Não exagere na formatação — usar negrito em tudo faz com que nada se
						destaque de verdade.
					</li>
					<li>
						Reserve o itálico para ênfases pontuais e o tachado para correções
						ou contexto humorístico.
					</li>
					<li>
						Em mensagens curtas, a formatação pode parecer excessiva. Use com
						moderação.
					</li>
					<li>
						Combine tipos de formatação quando necessário, mas evite misturar
						mais de dois estilos no mesmo trecho.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como escrever em negrito no WhatsApp?
						</h3>
						<p>
							Digite sua mensagem no campo acima, selecione o trecho desejado
							(ou deixe sem seleção para formatar o texto inteiro) e clique em{" "}
							<strong>Negrito</strong>. O texto ficará envolto com asteriscos, o
							que o WhatsApp interpreta como negrito ao enviar.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como usar itálico no WhatsApp?
						</h3>
						<p>
							Selecione o texto que deseja em itálico e clique em{" "}
							<strong>Itálico</strong>. O formatador adicionará underlines ao
							redor da seleção. Ao colar no WhatsApp e enviar, o texto aparecerá
							em itálico.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esse formatador funciona no celular?
						</h3>
						<p>
							Sim. A ferramenta funciona em qualquer navegador moderno,
							incluindo Chrome e Safari no celular. O layout é responsivo e os
							botões são adaptados para telas menores.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Preciso instalar algo?
						</h3>
						<p>
							Não. Tudo funciona diretamente no navegador, sem instalação, sem
							cadastro e sem custo. Seus dados não são enviados a nenhum
							servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O WhatsApp suporta esses formatos?
						</h3>
						<p>
							Sim. Negrito, itálico, tachado e monoespaçado são formatos nativos
							do WhatsApp, disponíveis tanto no aplicativo para celular quanto
							na versão web. Basta colar o texto formatado e enviar normalmente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso aplicar mais de uma formatação ao mesmo texto?
						</h3>
						<p>
							Sim. Selecione o trecho desejado e aplique os formatos um a um.
							Por exemplo, para negrito e itálico ao mesmo tempo, aplique os
							dois botões em sequência sobre a mesma seleção.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function FormatadorWhatsAppPage() {
	return (
		<PageLayout
			title="Formatador de Texto para WhatsApp Online"
			description="Escreva ou cole sua mensagem, aplique negrito, itálico, tachado ou monoespaçado e copie com um clique."
			relatedTools={<RelatedTools currentHref="/ferramentas/formatador-de-texto-whatsapp" />}
			extraContent={<SeoContent />}
		>
			<WhatsAppFormatter />
		</PageLayout>
	);
}
