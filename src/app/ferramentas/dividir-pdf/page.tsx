import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { SplitPDF } from '@/components/tools/pdf/split/split-pdf'

export const metadata: Metadata = {
  title: 'Dividir PDF Online Grátis | Ferramenta Ninja',
  description:
    'Divida um PDF em partes ou extraia páginas específicas online e gratuitamente. Processamento local — seus arquivos não são enviados a nenhum servidor.',
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">O que é dividir PDF</h2>
        <p>
          Dividir um PDF significa separar um documento em partes menores. Você pode extrair
          páginas específicas em um novo arquivo ou gerar um PDF separado para cada página do
          documento original.
        </p>
        <p className="mt-3">
          É especialmente útil para isolar conteúdos de documentos longos, compartilhar apenas
          partes de um arquivo ou reorganizar documentos de forma mais eficiente.
        </p>
        <p className="mt-3">
          Todo o processamento acontece no seu navegador. Nenhum arquivo é enviado a servidores
          externos, garantindo total privacidade.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Como dividir PDFs online</h2>
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">1. Selecione o PDF:</strong> clique na área de
            upload ou arraste o arquivo que deseja dividir.
          </p>
          <p>
            <strong className="text-foreground">2. Escolha o modo:</strong> selecione
            "Extrair páginas específicas" para escolher quais páginas incluir no resultado, ou
            "Dividir todas as páginas" para gerar um PDF separado por página.
          </p>
          <p>
            <strong className="text-foreground">3. Informe as páginas (se necessário):</strong>{' '}
            no modo de extração, insira os números das páginas separados por vírgula ou use
            hífens para intervalos, como <em>1,3,5-7</em>.
          </p>
          <p>
            <strong className="text-foreground">4. Clique em "Dividir PDF":</strong> o
            processamento ocorre no navegador e o resultado fica disponível para download em
            instantes.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">Extrair páginas de contratos:</strong> retire
            apenas as páginas que precisam ser assinadas ou enviadas, sem compartilhar o
            documento completo.
          </p>
          <p>
            <strong className="text-foreground">Separar capítulos de livros:</strong> divida
            um e-book ou apostila em partes para leitura ou distribuição individual.
          </p>
          <p>
            <strong className="text-foreground">Reorganizar documentos:</strong> extraia
            páginas de múltiplos PDFs para depois combiná-las em uma nova ordem usando a
            ferramenta de juntar PDFs.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Os arquivos são enviados para algum servidor?
            </h3>
            <p>
              Não. Todo o processamento ocorre localmente no seu navegador usando a biblioteca
              pdf-lib. Nenhum dado é transmitido externamente.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Como informar o intervalo de páginas?
            </h3>
            <p>
              Use vírgulas para separar páginas individuais (ex: <em>1,3,5</em>) e hífens para
              intervalos contínuos (ex: <em>2-6</em>). Você pode combinar os dois formatos,
              como <em>1,3-5,8</em>.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Posso usar esses PDFs com segurança?
            </h3>
            <p>
              Sim. Os arquivos gerados são PDFs padrão compatíveis com qualquer leitor. O
              conteúdo original é preservado integralmente nas páginas extraídas.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Existe limite de páginas ou tamanho de arquivo?
            </h3>
            <p>
              Não há limite imposto pela ferramenta. O limite prático depende da memória do
              dispositivo. PDFs muito grandes podem levar mais tempo para processar.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Como separar todas as páginas de um PDF?
            </h3>
            <p>
              Selecione o modo "Dividir todas as páginas" e clique em "Dividir PDF". A
              ferramenta gerará um arquivo PDF individual para cada página e disponibilizará
              todos para download.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function DividirPDFPage() {
  return (
    <PageLayout
      title="Dividir PDF Online Grátis"
      description="Extraia páginas específicas ou divida um PDF em partes no navegador. Selecione o arquivo, escolha as páginas e baixe o resultado."
      extraContent={<SeoContent />}
    >
      <SplitPDF />
    </PageLayout>
  )
}
