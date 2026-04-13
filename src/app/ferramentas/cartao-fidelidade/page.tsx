import type { Metadata } from 'next'
import { PageLayout } from '@/components/shared/page-layout'
import { LoyaltyCardClient } from '@/components/tools/loyalty-card/loyalty-card-client'

export const metadata: Metadata = {
  title: 'Criador de Cartão Fidelidade para Imprimir | Ferramenta Ninja',
  description:
    'Crie cartões fidelidade personalizados para imprimir gratuitamente. Templates prontos para barbearia, cafeteria, restaurante e mais. Sem cadastro, sem instalação.',
  keywords: [
    'cartão fidelidade para imprimir',
    'cartão fidelidade editável',
    'cartão de pontos para clientes',
    'modelo cartão fidelidade',
    'cartão fidelidade barbearia',
    'cartão fidelidade cafeteria',
    'cartão fidelidade simples',
    'cartão fidelidade grátis',
    'criar cartão fidelidade',
    'cartão fidelidade personalizado',
  ],
  openGraph: {
    title: 'Criador de Cartão Fidelidade para Imprimir | Ferramenta Ninja',
    description:
      'Crie cartões fidelidade personalizados gratuitamente. Templates para barbearia, cafeteria, restaurante e mais. Exporte em PNG pronto para imprimir.',
  },
}

function SeoContent() {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">O que é cartão fidelidade?</h2>
        <p>
          O cartão fidelidade é uma estratégia simples e eficaz para reter clientes e estimular
          visitas recorrentes ao seu negócio. Funciona como um sistema de recompensas: a cada
          compra ou visita, o cliente recebe um carimbo ou marcação. Ao completar o cartão, ele
          ganha um benefício — desconto, produto grátis ou serviço especial.
        </p>
        <p className="mt-3">
          É uma das ferramentas de marketing mais acessíveis para pequenos negócios, pois não exige
          aplicativo, sistema digital ou investimento em tecnologia. Um cartão impresso já é
          suficiente para criar um programa de fidelidade profissional.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Como usar cartão fidelidade</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            <strong className="text-foreground">Escolha o template</strong> mais adequado ao seu
            tipo de negócio — cafeteria, barbearia, restaurante ou genérico.
          </li>
          <li>
            <strong className="text-foreground">Personalize a frente</strong> com o nome do seu
            negócio, slogan e endereço ou redes sociais.
          </li>
          <li>
            <strong className="text-foreground">Adicione seu logo</strong> para reforçar a
            identidade visual — aceita PNG e JPG.
          </li>
          <li>
            <strong className="text-foreground">Configure o verso</strong> escolhendo a quantidade
            de carimbos (5, 6, 8 ou 10) e o estilo (círculo ou quadrado).
          </li>
          <li>
            <strong className="text-foreground">Exporte em PNG</strong> e imprima uma folha A4 com
            8 cartões prontos para distribuir.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Como imprimir corretamente</h2>
        <p>
          O arquivo exportado é uma folha A4 (21cm × 29,7cm) com 8 cartões no tamanho padrão de
          9cm × 5cm. Para garantir a melhor qualidade:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Imprima em papel couchê 250g ou cartão branco para maior durabilidade.</li>
          <li>
            Configure a impressora para <strong className="text-foreground">alta qualidade</strong>{' '}
            e <strong className="text-foreground">sem margens</strong> (borderless).
          </li>
          <li>
            Após imprimir, corte com estilete e régua seguindo as linhas guia tracejadas do
            arquivo.
          </li>
          <li>
            Imprima a frente e o verso separadamente e cole os dois lados para um acabamento
            profissional.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Para quais negócios serve?</h2>
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">Cafeteria e café:</strong> ofereça um café grátis
            após 8 visitas. O cliente carrega o cartão e retorna com mais frequência para completar
            os carimbos.
          </p>
          <p>
            <strong className="text-foreground">Barbearia:</strong> na décima visita, o cliente
            ganha um corte com desconto ou serviço gratuito. Aumenta a lealdade e reduz a
            rotatividade de clientes.
          </p>
          <p>
            <strong className="text-foreground">Restaurante e lanchonete:</strong> distribua
            carimbos a cada refeição e ofereça uma sobremesa ou prato especial como recompensa ao
            completar o cartão.
          </p>
          <p>
            <strong className="text-foreground">Lava jato e estética automotiva:</strong> a cada
            lavagem, um carimbo. Ao completar, o cliente ganha uma lavagem gratuita ou desconto em
            polimento.
          </p>
          <p>
            <strong className="text-foreground">Qualquer serviço recorrente:</strong> salões de
            beleza, pet shops, farmácias, padarias e outros negócios que dependem de clientes
            frequentes se beneficiam de um programa de fidelidade simples.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Como criar cartão fidelidade?</h3>
            <p>
              Basta acessar esta página, escolher um template, personalizar com o nome e cores do
              seu negócio, adicionar seu logo e clicar em Exportar Frente ou Exportar Verso. O
              arquivo PNG é gerado instantaneamente no seu navegador, sem precisar criar conta ou
              instalar nada.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Posso imprimir em casa?</h3>
            <p>
              Sim. O arquivo exportado é um PNG em alta resolução (equivalente a 300 DPI) pronto
              para imprimir em qualquer impressora doméstica ou gráfica. Para melhor resultado, use
              papel mais grosso como sulfite 120g ou papel cartão.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Qual o tamanho do cartão?</h3>
            <p>
              O tamanho padrão é 9cm × 5cm, que corresponde aproximadamente ao tamanho de um
              cartão de visita. É o formato mais prático para caber na carteira do cliente.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Posso colocar meu logo?</h3>
            <p>
              Sim. Na aba Frente, clique em Carregar logo e selecione um arquivo PNG ou JPG de até
              2MB. O logo é redimensionado automaticamente e posicionado no canto superior direito
              do cartão.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">Quantos cartões vêm na folha?</h3>
            <p>
              Cada arquivo exportado contém uma folha A4 com 8 cartões dispostos em 2 colunas e 4
              linhas, com linhas guia para corte. Isso significa que com uma única impressão você
              já tem 8 cartões prontos para distribuir.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default function CartaoFidelidadePage() {
  return (
    <PageLayout
      title="Criador de Cartão Fidelidade para Imprimir"
      description="Crie cartões fidelidade personalizados com seu logo e cores. Templates prontos para barbearia, cafeteria, restaurante e mais. Exporte em PNG pronto para imprimir."
      extraContent={<SeoContent />}
    >
      <LoyaltyCardClient />
    </PageLayout>
  )
}
