import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { BarcodeGenerator } from '@/components/tools/barcode-generator/barcode-generator'

export const metadata: Metadata = {
  title: 'Gerador de Código de Barras Online Grátis | Ferramenta Ninja',
  description:
    'Gere códigos de barras EAN-13, UPC-A, EAN-8, CODE 128, CODE 39 e ITF-14 online. Baixe em SVG. Ferramenta gratuita, sem cadastro.',
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          O que é um código de barras 1D?
        </h2>
        <p>
          Códigos de barras unidimensionais (1D) são representações gráficas de dados em uma
          sequência de barras verticais de larguras variadas. Cada padrão de barras e espaços
          representa um caractere ou conjunto de caracteres, que pode ser lido por scanners a
          laser ou câmeras. São usados há décadas no varejo, logística, saúde e bibliotecas.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Formatos disponíveis</h2>
        <div className="space-y-4">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">EAN-13</h3>
            <p>Padrão internacional para produtos no varejo. Usado na Europa, América Latina e na maioria dos países. Composto por 13 dígitos, sendo o último o dígito verificador.</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">UPC-A</h3>
            <p>Usado principalmente nos Estados Unidos e Canadá para produtos de varejo. Composto por 12 dígitos.</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">EAN-8</h3>
            <p>Versão compacta do EAN-13 para produtos com pouco espaço na embalagem. Composto por 8 dígitos.</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">CODE 128</h3>
            <p>Formato de alta densidade que suporta todos os caracteres ASCII. Amplamente usado em logística, e-commerce e etiquetas industriais.</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">CODE 39</h3>
            <p>Um dos formatos mais antigos e compatíveis. Suporta letras maiúsculas, números e alguns símbolos. Comum em documentos de saúde e governo.</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">ITF-14</h3>
            <p>Usado em embalagens de transporte e caixas de produtos. Baseado no formato Interleaved 2 of 5, com 14 dígitos.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              O código gerado pode ser usado em produtos reais?
            </h3>
            <p>
              Tecnicamente sim, mas para produtos comercializados em lojas físicas é necessário
              registrar o código em uma organização certificadora como a GS1 Brasil, que garante
              a unicidade do código no mercado. Esta ferramenta é ideal para testes, protótipos
              e uso interno.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Por que o download é em SVG?
            </h3>
            <p>
              O formato SVG é vetorial, o que significa que o código de barras pode ser
              redimensionado para qualquer tamanho sem perda de qualidade — ideal para impressão
              em alta resolução. A maioria dos softwares de design aceita SVG diretamente.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              O que é o dígito verificador?
            </h3>
            <p>
              O dígito verificador é o último número do código, calculado matematicamente a partir
              dos demais dígitos. Ele permite que o leitor confirme se o código foi lido
              corretamente. Esta ferramenta calcula o dígito verificador automaticamente para
              EAN-13, UPC-A, EAN-8 e ITF-14.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function GeradorDeCodigoDeBarrasPage() {
  return (
    <PageLayout
      title="Gerador de Código de Barras 1D"
      description="Gere códigos de barras EAN-13, UPC-A, EAN-8, CODE 128, CODE 39 e ITF-14. Baixe em SVG com qualidade para impressão."
      extraContent={<SeoContent />}
    >
      <BarcodeGenerator />
    </PageLayout>
  )
}
