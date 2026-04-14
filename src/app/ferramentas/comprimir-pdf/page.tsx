import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { CompressPDF } from "@/components/tools/pdf/compress/compress-pdf";

export const metadata: Metadata = {
	title: "Comprimir PDF Online Grátis | Ferramenta Ninja",
	description:
		"Reduza o tamanho de arquivos PDF online e gratuitamente. Processamento local — seus arquivos não são enviados a nenhum servidor.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é compressão de PDF
				</h2>
				<p>
					Comprimir um PDF significa reduzir o tamanho do arquivo sem alterar
					seu conteúdo visível. Isso é feito otimizando a estrutura interna do
					documento: removendo objetos não utilizados, reorganizando fluxos de
					dados e eliminando informações redundantes.
				</p>
				<p className="mt-3">
					Arquivos PDF menores são mais fáceis de enviar por e-mail,
					compartilhar em plataformas com limite de tamanho e armazenar em
					dispositivos com espaço reduzido.
				</p>
				<p className="mt-3">
					Toda a compressão ocorre diretamente no seu navegador. Nenhum arquivo
					é enviado a servidores externos, garantindo total privacidade.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como comprimir PDFs online
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Selecione o PDF:</strong>{" "}
						clique na área de upload ou arraste o arquivo que deseja comprimir.
					</p>
					<p>
						<strong className="text-foreground">
							2. Escolha o nível de compressão:
						</strong>{" "}
						selecione entre Baixo (maior compatibilidade), Médio (equilíbrio) ou
						Alto (máxima redução — recomprime imagens no servidor para reduções
						significativas).
					</p>
					<p>
						<strong className="text-foreground">
							3. Clique em "Comprimir PDF":
						</strong>{" "}
						o processamento ocorre no navegador e o resultado mostrará o tamanho
						original, tamanho final e o percentual de redução.
					</p>
					<p>
						<strong className="text-foreground">4. Baixe o resultado:</strong>{" "}
						clique em "Baixar PDF comprimido" para salvar o arquivo otimizado.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Envio por e-mail:</strong>{" "}
						reduza PDFs que excedem o limite de tamanho de anexos de provedores
						de e-mail corporativos ou pessoais.
					</p>
					<p>
						<strong className="text-foreground">Portais e sistemas:</strong>{" "}
						muitos sistemas de RH, jurídicos e acadêmicos impõem limite de
						tamanho nos uploads. Comprima o PDF antes de enviar.
					</p>
					<p>
						<strong className="text-foreground">Armazenamento em nuvem:</strong>{" "}
						otimize PDFs para economizar espaço em serviços como Google Drive,
						Dropbox e OneDrive.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Limitações da compressão no navegador
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							PDFs com muitas imagens:
						</strong>{" "}
						a maior parte do tamanho de um PDF costuma estar nas imagens
						incorporadas. A compressão estrutural não recodifica imagens,
						portanto a redução pode ser pequena nesses casos.
					</p>
					<p>
						<strong className="text-foreground">PDFs já otimizados:</strong>{" "}
						arquivos gerados por ferramentas modernas já podem estar bem
						comprimidos. Nessa situação, o resultado pode ter tamanho igual ou
						ligeiramente diferente do original.
					</p>
					<p>
						<strong className="text-foreground">Compressão avançada:</strong>{" "}
						reduções significativas em PDFs com imagens de alta resolução
						requerem recodificação de imagem, o que demanda processamento no
						servidor. Esta ferramenta foca na otimização estrutural do
						documento.
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
							Os arquivos são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre localmente no seu navegador.
							Nenhum dado é transmitido ou armazenado em servidores externos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A compressão reduz a qualidade do PDF?
						</h3>
						<p>
							Não. A compressão realizada aqui é estrutural: remove objetos não
							utilizados e otimiza o arquivo sem alterar o conteúdo visível,
							fontes ou imagens. A qualidade do documento é preservada.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que o tamanho não reduziu muito?
						</h3>
						<p>
							Se o PDF já estava bem otimizado ou contém principalmente imagens,
							a redução estrutural tende a ser pequena. Para PDFs com imagens de
							alta resolução, a compressão real exige recodificação de imagem,
							que não é possível apenas no navegador.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar o PDF comprimido com segurança?
						</h3>
						<p>
							Sim. O arquivo gerado é um PDF padrão compatível com qualquer
							leitor. O nível "Alto" remove metadados e recomprime imagens JPEG
							em menor qualidade, o que pode causar leve perda visual em imagens
							fotográficas, mas preserva texto e vetores integralmente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de tamanho de arquivo?
						</h3>
						<p>
							Não há limite imposto pela ferramenta. O limite prático é
							determinado pela memória disponível no seu dispositivo. Arquivos
							muito grandes podem levar mais tempo para processar.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ComprimirPDFPage() {
	return (
		<PageLayout
			title="Comprimir PDF Online Grátis"
			description="Reduza o tamanho de arquivos PDF diretamente no navegador. Selecione o nível de compressão e veja a redução de tamanho antes de baixar."
			extraContent={<SeoContent />}
		>
			<CompressPDF />
		</PageLayout>
	);
}
