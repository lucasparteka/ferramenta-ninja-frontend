import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { MergePDF } from "@/components/tools/pdf/merge/merge-pdf";

export const metadata: Metadata = {
	title: "Juntar PDF Online Grátis | Ferramenta Ninja",
	description:
		"Una múltiplos arquivos PDF em um único documento online e gratuitamente. Processamento local — seus arquivos não são enviados a nenhum servidor.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é juntar PDF
				</h2>
				<p>
					Juntar PDFs significa combinar dois ou mais arquivos PDF em um único
					documento. O resultado é um arquivo PDF que contém todas as páginas
					dos documentos originais, na ordem em que foram adicionados.
				</p>
				<p className="mt-3">
					É uma operação útil para organizar documentos, enviar múltiplos
					arquivos como um único anexo ou consolidar relatórios, contratos e
					apresentações em um só lugar.
				</p>
				<p className="mt-3">
					Todo o processamento acontece diretamente no seu navegador. Nenhum
					arquivo é transmitido para servidores externos, garantindo total
					privacidade e segurança.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como juntar PDFs online
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							1. Selecione os arquivos:
						</strong>{" "}
						clique na área de upload ou arraste os PDFs que deseja unir. Você
						pode adicionar quantos arquivos quiser.
					</p>
					<p>
						<strong className="text-foreground">2. Organize a ordem:</strong> os
						arquivos serão combinados na ordem em que aparecem na lista. Remova
						e adicione novamente para reordenar.
					</p>
					<p>
						<strong className="text-foreground">
							3. Clique em "Juntar PDFs":
						</strong>{" "}
						o processamento ocorre no seu navegador e o arquivo resultante
						ficará pronto em segundos.
					</p>
					<p>
						<strong className="text-foreground">4. Baixe o resultado:</strong>{" "}
						clique em "Baixar PDF" para salvar o documento combinado no seu
						dispositivo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Documentos de trabalho:</strong>{" "}
						combine relatórios, planilhas exportadas e apresentações em um único
						PDF para enviar por e-mail ou arquivar.
					</p>
					<p>
						<strong className="text-foreground">Arquivos acadêmicos:</strong>{" "}
						una trabalhos, referências bibliográficas e anexos em um documento
						só para entrega de atividades escolares ou universitárias.
					</p>
					<p>
						<strong className="text-foreground">
							Contratos e formulários:
						</strong>{" "}
						junte múltiplos documentos contratuais, termos e assinaturas
						digitalizadas em um único arquivo organizado.
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
							Não. Todo o processamento ocorre localmente no seu navegador
							usando a biblioteca pdf-lib. Nenhum arquivo é transmitido ou
							armazenado externamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar esses PDFs com segurança?
						</h3>
						<p>
							Sim. O arquivo gerado é um PDF padrão compatível com leitores como
							Adobe Acrobat, visualizador do navegador, Google Drive e outros.
							Seus dados originais não são modificados.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Existe limite de tamanho ou quantidade de arquivos?
						</h3>
						<p>
							Não há limite imposto pela ferramenta. O limite prático depende da
							memória disponível no seu dispositivo. Para arquivos muito
							grandes, o processamento pode ser mais lento.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como juntar PDFs sem instalar programas?
						</h3>
						<p>
							Basta acessar esta página, selecionar os arquivos e clicar em
							"Juntar PDFs". Não é necessário instalar nenhum programa, criar
							conta ou fazer cadastro.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A ordem das páginas é preservada?
						</h3>
						<p>
							Sim. As páginas de cada PDF são mantidas na ordem original. A
							ordem final do documento combinado segue a sequência dos arquivos
							adicionados na lista.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function JuntarPDFPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/juntar-pdf"
			title="Juntar PDF Online Grátis"
			description="Una múltiplos arquivos PDF em um único documento. Selecione os arquivos, organize a ordem e baixe o resultado — sem enviar dados para servidores."
			relatedTools={<RelatedTools currentHref="/ferramentas/juntar-pdf" />}
			extraContent={<SeoContent />}
		>
			<MergePDF />
		</PageLayout>
	);
}
