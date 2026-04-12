export default function SalaryArticle() {
  return (
    <article className="prose prose-neutral max-w-3xl mt-10">
      <h2 className="text-2xl font-bold py-4">O que é salário líquido?</h2>
      <p>
        <strong>Salário líquido</strong> é o valor que o funcionário recebe após
        os <strong> descontos obrigatórios exigidos por lei, </strong>como INSS
        e imposto de renda. Além disso, inclui também descontos que dependem de
        cada empresa, como o vale-transporte e o plano de saúde. Após esses
        descontos serem aplicados sobre o salário bruto registrado em carteira,
        temos então o que chamamos de <strong>salário líquido.</strong>
      </p>
      <br />
      <h2 className="text-2xl font-bold mt-10  py-4">Como funciona o INSS?</h2>
      <p>
        Sendo obrigatório, o <strong>INSS</strong> é o desconto responsável por
        custear a aposentadoria, o auxílio-doença, pensão, entre outros. A
        contribuição funciona de maneira
        <strong> progressiva</strong>, ou seja, cada faixa salarial paga um
        percentual diferente apenas sobre o valor dentro daquela faixa.
      </p>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">
                Faixa salarial (R$)
              </th>
              <th className="border border-gray-200 px-4 py-2">Alíquota (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Até 1.518,00</td>
              <td className="border border-gray-200 px-4 py-2">7,5%</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                1.518,01 até 2.793,88
              </td>
              <td className="border border-gray-200 px-4 py-2">9%</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                2.793,89 até 4.190,83
              </td>
              <td className="border border-gray-200 px-4 py-2">12%</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                4.190,84 até 8.157,41
              </td>
              <td className="border border-gray-200 px-4 py-2">14%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4">
        Assim, os que recebem salários maiores tem as maiores alíquotas
        descontadas, enquanto quem recebe menos contribui com percentuais
        menores.
      </p>

      <h2 className="text-2xl font-bold mt-10 py-4">Como funciona o IRRF?</h2>
      <p>
        O <strong>IRRF (Imposto de Renda Retido na Fonte)</strong>é também
        obrigatório, e é o imposto descontado diretamente do salário, baseado na
        renda mensal do funcionário e no número de dependentes dele. Esse
        imposto segue uma tabela progressiva, parecida com a do INSS, porém com
        deduções fixas por faixa de renda.
      </p>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">
                Base de cálculo (R$)
              </th>
              <th className="border border-gray-200 px-4 py-2">Alíquota (%)</th>
              <th className="border border-gray-200 px-4 py-2">
                Parcela a deduzir (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Até 2.259,20</td>
              <td className="border border-gray-200 px-4 py-2">Isento</td>
              <td className="border border-gray-200 px-4 py-2">0,00</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                2.259,21 até 2.826,65
              </td>
              <td className="border border-gray-200 px-4 py-2">7,5%</td>
              <td className="border border-gray-200 px-4 py-2">169,44</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                2.826,66 até 3.751,05
              </td>
              <td className="border border-gray-200 px-4 py-2">15%</td>
              <td className="border border-gray-200 px-4 py-2">381,44</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                3.751,06 até 4.664,68
              </td>
              <td className="border border-gray-200 px-4 py-2">22,5%</td>
              <td className="border border-gray-200 px-4 py-2">662,77</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                Acima de 4.664,68
              </td>
              <td className="border border-gray-200 px-4 py-2">27,5%</td>
              <td className="border border-gray-200 px-4 py-2">896,00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4">
        Além da faixa salarial, o IRRF leva em conta deduções como dependentes e
        contribuições ao INSS. Essas deduções diminuem a base de cálculo,
        tornando o imposto um pouco mais justo conforme a situação do
        trabalhador.
      </p>

      <h2 className="text-2xl font-bold mt-10 py-4">
        Perguntas comuns sobre salário líquido
      </h2>

      <h3 className="text-xl font-semibold mt-6 py-2">
        1. O FGTS também deve entrar no cálculo do salário líquido?
      </h3>
      <p>
        Não. O <strong>FGTS</strong> é uma contribuição feita pelo empregador,
        equivalente a <strong>8% do salário bruto. </strong>
      </p>
      <br />
      <p>
        Esse valor nunca deve ser descontado do trabalhador e também não reduz o
        valor de salário líquido. Ele funciona através de deposito mensal para
        uma conta vinculada ao trabalhador, e pode ser sacado em alguns casos
        específicos, como demissão sem justa causa, compra de imóvel ou
        aposentadoria.
      </p>
      <h3 className="text-xl font-semibold mt-6 py-2">
        2. Quais descontos não são obrigatórios?
      </h3>
      <p>
        Alguns descontos como <strong>vale-transporte</strong>,{" "}
        <strong>plano de saúde</strong> e{" "}
        <strong>vale-refeição ou vale-alimentação</strong> são opcionais e
        dependem de cada empresa. No caso do vale-transporte, a empresa pode
        descontar até 6% do salário bruto.
      </p>
      <h3 className="text-xl font-semibold mt-6 py-2">
        3. Por que usar uma calculadora de salário líquido?
      </h3>
      <p>
        Uma <strong>calculadora de salário líquido</strong> mostra de maneira
        simples o que um funcionário recebe após todos os descontos. Os cálculos
        de impostos muitas vezes podem ser complicados e confusos, e uma
        calculadora já considera todos esses valores pré-definidos.
      </p>
    </article>
  );
}
