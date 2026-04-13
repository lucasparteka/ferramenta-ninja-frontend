import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { CreditCardValidator } from '@/components/tools/credit-card-generator/credit-card-validator'

export const metadata: Metadata = {
  title: 'Validador de Cartão de Crédito Online Grátis | Ferramenta Ninja',
  description:
    'Valide números de cartão de crédito pelo algoritmo de Luhn e identifique automaticamente a bandeira: Visa, Mastercard, American Express, Elo e Hipercard. Ferramenta gratuita, sem cadastro.',
  keywords: [
    'validador de cartão de crédito',
    'validar número de cartão',
    'algoritmo de luhn',
    'verificar cartão',
    'identificar bandeira',
  ],
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          O que valida o número de um cartão de crédito?
        </h2>
        <p>
          A validação de um número de cartão de crédito é feita em duas etapas: verificação do
          formato e verificação matemática. A etapa matemática utiliza o{' '}
          <strong className="text-foreground">algoritmo de Luhn</strong>, um método simples de
          soma e módulo que permite detectar erros de digitação e confirmar se o número segue
          a estrutura esperada para cartões de pagamento.
        </p>
        <p className="mt-3">
          Vale ressaltar que passar na verificação de Luhn não significa que o cartão existe ou
          tem saldo disponível — apenas que o número é matematicamente consistente. A confirmação
          de um cartão real só é possível mediante consulta à instituição financeira emissora.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Como identificar a bandeira pelo número?
        </h2>
        <p>
          Cada bandeira de cartão reserva faixas específicas de prefixos para seus números. A
          identificação é feita automaticamente ao analisar os primeiros dígitos:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">Visa:</strong> sempre começa com{' '}
            <code className="rounded bg-secondary px-1">4</code>, com 16 dígitos.
          </li>
          <li>
            <strong className="text-foreground">Mastercard:</strong> começa com{' '}
            <code className="rounded bg-secondary px-1">51</code> a{' '}
            <code className="rounded bg-secondary px-1">55</code>, ou no intervalo{' '}
            <code className="rounded bg-secondary px-1">2221</code> a{' '}
            <code className="rounded bg-secondary px-1">2720</code>, com 16 dígitos.
          </li>
          <li>
            <strong className="text-foreground">American Express:</strong> começa com{' '}
            <code className="rounded bg-secondary px-1">34</code> ou{' '}
            <code className="rounded bg-secondary px-1">37</code>, com 15 dígitos.
          </li>
          <li>
            <strong className="text-foreground">Elo:</strong> utiliza uma série de prefixos
            específicos como <code className="rounded bg-secondary px-1">4011</code>,{' '}
            <code className="rounded bg-secondary px-1">6362</code> e outros, com 16 dígitos.
          </li>
          <li>
            <strong className="text-foreground">Hipercard:</strong> começa com{' '}
            <code className="rounded bg-secondary px-1">6062</code> ou{' '}
            <code className="rounded bg-secondary px-1">3841</code>, com 16 dígitos.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Aviso importante</h2>
        <p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
          Esta ferramenta verifica apenas a validade matemática do número pelo algoritmo de Luhn.
          Ela <strong>não realiza consultas a bancos ou operadoras</strong> e não confirma se o
          cartão existe, está ativo ou possui saldo. Não utilize esta ferramenta para tentar
          validar cartões de terceiros sem autorização.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Um cartão válido aqui funciona para compras?
            </h3>
            <p>
              Não necessariamente. A validação confirma apenas que o número é matematicamente
              correto. Para funcionar em uma transação, o cartão precisa existir em uma instituição
              financeira, estar ativo e ter limite disponível.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              O validador aceita cartões com ou sem espaços?
            </h3>
            <p>
              Sim. O validador aceita o número digitado com ou sem espaços e hífens, pois remove
              automaticamente qualquer caractere não numérico antes de processar.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Por que meu número válido aparece como bandeira desconhecida?
            </h3>
            <p>
              A detecção de bandeira é feita com base nos prefixos mais comuns. Algumas bandeiras
              menos populares ou cartões de débito de redes específicas podem não ser reconhecidos,
              mas ainda terão a validade Luhn verificada corretamente.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Como gerar um número de cartão para testes?
            </h3>
            <p>
              Use o{' '}
              <a
                href="/ferramentas/gerador-de-cartao-de-credito"
                className="text-primary underline underline-offset-4"
              >
                Gerador de Cartão de Crédito
              </a>{' '}
              desta ferramenta para criar números válidos das principais bandeiras e testá-los
              aqui em seguida.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Os dados digitados são enviados para algum servidor?
            </h3>
            <p>
              Não. A validação ocorre inteiramente no seu navegador. Nenhum número digitado é
              transmitido ou armazenado em qualquer servidor.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function ValidadorDeCartaoDeCreditoPage() {
  return (
    <PageLayout
      title="Validador de Cartão de Crédito Online Grátis"
      description="Valide números de cartão de crédito pelo algoritmo de Luhn e identifique automaticamente a bandeira. Funciona com Visa, Mastercard, American Express, Elo e Hipercard."
      extraContent={<SeoContent />}
    >
      <CreditCardValidator />
    </PageLayout>
  )
}
