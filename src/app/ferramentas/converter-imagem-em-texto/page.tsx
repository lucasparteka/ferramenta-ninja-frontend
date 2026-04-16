import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ImageToText } from "@/components/tools/image-to-text/image-to-text";

export const metadata: Metadata = {
	title: "Converter Imagem em Texto (OCR) Online Grátis | Ferramenta Ninja",
	description:
		"Extraia texto de imagens, prints e documentos escaneados com OCR online e gratuito. Processamento local — suas imagens não são enviadas a nenhum servidor.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">O que é OCR</h2>
				<p>
					OCR (Optical Character Recognition, ou Reconhecimento Óptico de
					Caracteres) é uma tecnologia que analisa os pixels de uma imagem e
					identifica os caracteres presentes nela, convertendo o conteúdo visual
					em texto editável.
				</p>
				<p className="mt-3">
					Com ela, é possível extrair automaticamente o texto de fotos, capturas
					de tela, documentos digitalizados e qualquer imagem que contenha
					conteúdo escrito — sem precisar digitar manualmente.
				</p>
				<p className="mt-3">
					Nesta ferramenta, todo o processamento acontece diretamente no seu
					navegador. Nenhuma imagem é enviada a servidores externos, garantindo
					total privacidade.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como converter imagem em texto
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Selecione a imagem:</strong>{" "}
						clique na área de upload ou arraste um arquivo PNG, JPG ou WebP
						diretamente para ela.
					</p>
					<p>
						<strong className="text-foreground">2. Escolha o idioma:</strong>{" "}
						selecione o idioma principal do texto presente na imagem para
						melhorar a precisão do reconhecimento.
					</p>
					<p>
						<strong className="text-foreground">
							3. Clique em "Extrair texto":
						</strong>{" "}
						o OCR será executado no seu navegador e o resultado aparecerá na
						área de texto ao lado.
					</p>
					<p>
						<strong className="text-foreground">4. Edite e copie:</strong> o
						texto extraído pode ser editado diretamente. Clique em "Copiar
						texto" para copiá-lo para a área de transferência.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Extrair texto de prints:
						</strong>{" "}
						converta capturas de tela recebidas por WhatsApp, e-mail ou redes
						sociais em texto que pode ser copiado e editado.
					</p>
					<p>
						<strong className="text-foreground">
							Converter documentos escaneados:
						</strong>{" "}
						digitalize contratos, formulários e relatórios físicos e extraia o
						conteúdo em texto editável.
					</p>
					<p>
						<strong className="text-foreground">Digitalizar anotações:</strong>{" "}
						fotografe suas anotações escritas à mão ou impressas e converta-as
						em texto para edição ou armazenamento digital.
					</p>
					<p>
						<strong className="text-foreground">Acessibilidade:</strong> extraia
						texto de imagens para facilitar a leitura por tecnologias assistivas
						ou para tradução de conteúdo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Limitações do OCR
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Qualidade da imagem:</strong>{" "}
						imagens com baixa resolução, muito escuras, desfocadas ou com muito
						ruído podem resultar em reconhecimento impreciso ou falho.
					</p>
					<p>
						<strong className="text-foreground">Texto manuscrito:</strong>{" "}
						escrita à mão é significativamente mais difícil de reconhecer do que
						texto impresso ou digital, especialmente quando a caligrafia é
						irregular.
					</p>
					<p>
						<strong className="text-foreground">Fontes estilizadas:</strong>{" "}
						fontes decorativas, caligráficas ou com muito ornamento podem não
						ser reconhecidas corretamente.
					</p>
					<p>
						<strong className="text-foreground">Idioma:</strong> selecionar o
						idioma correto melhora a precisão. Textos em idiomas não listados
						podem apresentar erros de reconhecimento.
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
							Como converter imagem em texto online?
						</h3>
						<p>
							Selecione uma imagem PNG, JPG ou WebP, escolha o idioma do texto e
							clique em "Extrair texto". O resultado aparece em segundos na área
							de texto ao lado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esse OCR funciona offline?
						</h3>
						<p>
							Na primeira utilização, a ferramenta precisa baixar os dados de
							reconhecimento do idioma selecionado. Após esse download, o
							processamento ocorre completamente no navegador, sem necessidade
							de conexão constante com a internet.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Minhas imagens são enviadas para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento OCR acontece localmente no seu navegador
							usando a biblioteca Tesseract.js. Nenhuma imagem ou dado é
							transmitido para servidores externos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O texto extraído é 100% preciso?
						</h3>
						<p>
							A precisão depende da qualidade da imagem, da clareza do texto e
							do idioma selecionado. Imagens nítidas com texto impresso em
							fontes comuns costumam ter alta precisão. Texto manuscrito ou em
							fontes decorativas pode apresentar erros.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar em documentos escaneados?
						</h3>
						<p>
							Sim. Exporte a página do documento como imagem PNG ou JPG e faça o
							upload normalmente. Para melhores resultados, use scans com
							resolução mínima de 150 DPI e boa iluminação.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ConverterImagemEmTextoPage() {
	return (
		<PageLayout
			title="Converter Imagem em Texto (OCR) Online Grátis"
			description="Extraia texto de imagens, prints e documentos escaneados diretamente no navegador. Selecione a imagem, escolha o idioma e copie o resultado."
			relatedTools={<RelatedTools currentHref="/ferramentas/converter-imagem-em-texto" />}
			extraContent={<SeoContent />}
		>
			<ImageToText />
		</PageLayout>
	);
}
