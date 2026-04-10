import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { PixQR } from '@/components/tools/pix-qr/pix-qr'

export const metadata: Metadata = {
  title: 'Gerador de QR Code Pix Online Grátis | Ferramenta Ninja',
  description:
    'Gere QR Codes Pix estáticos para receber pagamentos. Suporte a CPF, CNPJ, telefone, e-mail e chave aleatória. Gratuito, sem cadastro.',
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">O que é o QR Code Pix?</h2>
        <p>
          O QR Code Pix é um código gerado no padrão EMV (Europay, Mastercard e Visa), adotado
          pelo Banco Central do Brasil para o sistema de pagamentos instantâneos Pix. Ao escanear
          o código com o aplicativo do banco, o pagador vê automaticamente os dados do
          beneficiário e o valor (quando definido), bastando confirmar a transação.
        </p>
        <p className="mt-3">
          Esta ferramenta gera QR Codes <strong className="text-foreground">estáticos</strong>,
          que podem ser reutilizados indefinidamente. São ideais para receber cobranças sem valor
          fixo (como doações) ou cobranças de valor fixo recorrente. Para cobranças únicas com
          rastreamento individual, é necessário um QR Code dinâmico gerado por uma instituição
          financeira.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Como usar</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Selecione o tipo de chave Pix cadastrado na sua conta.</li>
          <li>Digite a chave no campo correspondente.</li>
          <li>Informe o nome do beneficiário e a cidade (necessários pelo padrão EMV).</li>
          <li>Opcionalmente, defina um valor fixo e uma descrição.</li>
          <li>Clique em <strong className="text-foreground">Gerar QR Code Pix</strong> e baixe a imagem.</li>
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Tipos de chave Pix</h2>
        <div className="space-y-3">
          <p><strong className="text-foreground">CPF:</strong> 11 dígitos, com ou sem formatação.</p>
          <p><strong className="text-foreground">CNPJ:</strong> 14 dígitos, com ou sem formatação.</p>
          <p><strong className="text-foreground">Telefone:</strong> número com DDD, sem o prefixo +55 (ele é adicionado automaticamente).</p>
          <p><strong className="text-foreground">E-mail:</strong> endereço de e-mail cadastrado no banco.</p>
          <p><strong className="text-foreground">Chave aleatória (EVP):</strong> sequência UUID gerada pelo banco, no formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              O QR Code gerado é compatível com todos os bancos?
            </h3>
            <p>
              Sim. O padrão EMV/Pix é obrigatório para todas as instituições financeiras
              participantes do Pix no Brasil. O QR Code gerado por esta ferramenta segue
              exatamente o padrão definido pelo Banco Central.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Qual a diferença entre QR Code estático e dinâmico?
            </h3>
            <p>
              O QR Code estático pode ser reutilizado e é gerado localmente. O dinâmico é gerado
              pela instituição financeira para cada cobrança individual e permite rastreamento,
              expiração e conciliação automática. Para cobranças pontuais e de negócios, o
              dinâmico é mais adequado.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Os dados são enviados para algum servidor?
            </h3>
            <p>
              Não. Todo o processamento — incluindo a geração do payload EMV e o cálculo do CRC16 —
              ocorre diretamente no seu navegador. Nenhuma chave Pix ou dado pessoal é transmitido.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Por que o nome e a cidade aparecem sem acentos no payload?
            </h3>
            <p>
              O padrão EMV do Pix exige que o nome do beneficiário e a cidade sejam em ASCII puro,
              sem caracteres acentuados. A ferramenta converte automaticamente os acentos para
              garantir compatibilidade com todas as instituições.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function GeradorDeQrCodePixPage() {
  return (
    <PageLayout
      title="Gerador de QR Code Pix"
      description="Gere QR Codes Pix estáticos para receber pagamentos instantâneos. Suporte a CPF, CNPJ, telefone, e-mail e chave aleatória."
      extraContent={<SeoContent />}
    >
      <PixQR />
    </PageLayout>
  )
}
