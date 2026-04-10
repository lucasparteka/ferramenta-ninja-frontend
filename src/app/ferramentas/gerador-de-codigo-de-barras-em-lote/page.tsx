import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { BatchBarcode } from '@/components/tools/batch-barcode/batch-barcode'

export const metadata: Metadata = {
  title: 'Gerador de Código de Barras em Lote Online Grátis | Ferramenta Ninja',
  description:
    'Gere vários códigos de barras de uma vez. Cole uma lista de valores e baixe cada código em SVG. EAN-13, CODE 128 e mais. Gratuito, sem cadastro.',
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Como usar</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Selecione o formato desejado (EAN-13, CODE 128, etc.).</li>
          <li>Cole ou digite os valores no campo de texto — um por linha.</li>
          <li>Clique em <strong className="text-foreground">Gerar todos</strong>.</li>
          <li>Baixe cada código individualmente no formato SVG, pronto para impressão.</li>
        </ol>
        <p className="mt-3">
          O limite é de 100 códigos por geração. Para listas maiores, divida em partes.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">Etiquetagem de produtos:</strong> gere os códigos
            para toda uma linha de produtos de uma vez, economizando tempo em comparação com a
            geração individual.
          </p>
          <p>
            <strong className="text-foreground">Controle de estoque:</strong> crie etiquetas
            para itens de almoxarifado, patrimônio ou inventário com códigos únicos por lote.
          </p>
          <p>
            <strong className="text-foreground">Desenvolvimento e testes:</strong> gere conjuntos
            de códigos de barras para testar scanners, sistemas de PDV e integrações de leitura
            em aplicações.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Posso gerar valores repetidos?
            </h3>
            <p>
              Sim. A ferramenta gera um código para cada linha do campo de entrada, incluindo
              valores repetidos. Se quiser evitar duplicatas, certifique-se de que a lista
              não contém linhas iguais antes de gerar.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Há como baixar todos os códigos de uma vez?
            </h3>
            <p>
              No momento, cada código pode ser baixado individualmente em SVG. Para consolidar
              em um único arquivo, importe os SVGs em um software de design como Figma, Inkscape
              ou Illustrator.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Os dados são enviados para algum servidor?
            </h3>
            <p>
              Não. Todo o processamento ocorre localmente no navegador. Nenhum valor é transmitido.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function GeradorDeCodigoDeBarrasEmLotePage() {
  return (
    <PageLayout
      title="Gerador de Código de Barras em Lote"
      description="Gere vários códigos de barras de uma só vez. Cole a lista de valores, escolha o formato e baixe cada código em SVG."
      extraContent={<SeoContent />}
    >
      <BatchBarcode />
    </PageLayout>
  )
}
