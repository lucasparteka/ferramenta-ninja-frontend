import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "como-calcular-rescisao-trabalhista",
	title: "Como calcular rescisão trabalhista passo a passo (2026)",
	description:
		"Entenda quais verbas entram na rescisão, como calcular cada uma delas e quanto você tem direito a receber. Com exemplo real e valores atualizados para 2026.",
	publishedAt: "2026-05-15",
	updatedAt: "2026-05-15",
	author: "Equipe Ferramenta Ninja",
	category: "Trabalhista",
	relatedTools: [
		"/ferramentas/calculadora-de-rescisao",
		"/ferramentas/calculadora-de-ferias",
		"/ferramentas/calculadora-13-salario",
		"/ferramentas/calculadora-salario-liquido",
		"/ferramentas/calculadora-de-hora-extra",
	],
};

const H2 = "mb-3 mt-10 text-2xl font-bold text-foreground";
const H3 = "mb-2 mt-6 text-lg font-semibold text-foreground";
const TABLE = "my-4 w-full border-collapse text-sm";
const TH =
	"border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground";
const TD = "border border-border px-3 py-2 text-foreground";

function PostBody() {
	return (
		<>
			<p>
				Você foi chamado na sala do RH e saiu com a notícia que ninguém quer
				ouvir. Ou talvez tenha sido você quem decidiu dar o passo e pedir as
				contas. De qualquer forma, agora surge aquela pergunta que todo mundo
				tem: <strong>quanto eu realmente vou receber?</strong>
			</p>
			<p>
				Rescisão trabalhista não é um assunto simples. Tem parcela de salário,
				13º, férias, FGTS, multa... e cada tipo de demissão muda o que entra ou
				sai dessa conta. A maioria das pessoas chega no momento da assinatura
				sem saber se o valor está certo, e só assina pra acabar com o drama.
				Isso pode sair caro.
			</p>
			<p>
				Esse guia mostra, de forma simples e direta, como funciona o cálculo da
				rescisão trabalhista. Com exemplos reais e os valores atualizados para
				2026.
			</p>

			<h2 className={H2}>Primeiro: qual foi o tipo de demissão?</h2>
			<p>
				Antes de calcular qualquer coisa, é importante entender que o tipo de
				demissão muda tudo. As verbas que você tem direito dependem de como o
				contrato foi encerrado. Existem quatro situações principais:
			</p>

			<h3 className={H3}>Demissão sem justa causa</h3>
			<p>
				É quando a empresa te demite sem que você tenha cometido nenhum erro. É
				o tipo mais comum. Nesse caso, você tem direito a tudo: salário
				acumulado, aviso prévio, 13º proporcional, férias proporcionais e
				vencidas, saque total do FGTS mais a multa de 40%, e também pode pedir o
				seguro-desemprego (quando se aplica).
			</p>

			<h3 className={H3}>Pedido de demissão</h3>
			<p>
				Quando você decide sair por vontade própria. Aí o roteiro muda: você
				ainda recebe o salário em dia, o 13º proporcional e as férias, mas perde
				a multa do FGTS, não pode sacar o fundo (só pode usar pra comprar imóvel
				ou em situações específicas) e não tem direito ao seguro-desemprego. E
				tem mais: precisa cumprir o aviso prévio, ou pagar por ele se quiser
				sair antes.
			</p>

			<h3 className={H3}>Demissão por justa causa</h3>
			<p>
				Acontece quando você comete uma infração grave prevista no artigo 482 da
				CLT: abandono de emprego, desídia, falta de conduta ou atos que violem a
				disciplina. Nesse caso, você recebe apenas o que já ganhou até o dia da
				demissão e as férias que já estavam devidas. Não tem direito a aviso
				prévio, 13º proporcional, multa do FGTS nem ao seguro-desemprego. É o
				cenário mais difícil para o trabalhador.
			</p>

			<h3 className={H3}>Acordo mútuo (art. 484-A da CLT)</h3>
			<p>
				Criado com a Reforma Trabalhista de 2017. É quando o empregado e a
				empresa decidem juntos encerrar o contrato. As regras mudam: a multa do
				FGTS cai pra 20% (metade do normal), o aviso prévio indenizado é pago só
				pela metade, e você consegue sacar 80% do saldo do FGTS. Não dá pra
				pedir seguro-desemprego nesse caso. Serve pra quando as duas partes
				acham que a saída é boa pra ambos.
			</p>

			<h2 className={H2}>O que entra no cálculo: verba por verba</h2>
			<p>
				Agora vamos entender cada uma das verbas rescisórias, como elas
				funcionam e como calcular. Vou usar o mesmo exemplo ao longo de todo o
				texto pra ficar mais fácil de acompanhar:
			</p>
			<p>
				<strong>Exemplo — Ana:</strong> trabalhou na empresa por 2 anos e 4
				meses (28 meses). Foi demitida sem justa causa em 15 de maio de 2026,
				tendo trabalhado apenas 15 dias naquele mês. Ela não tirou as férias do
				segundo período aquisitivo (12 meses completos em aberto). Salário:{" "}
				<strong>R$&nbsp;3.500,00</strong>.
			</p>

			<h3 className={H3}>1. Saldo de salário</h3>
			<p>
				É o valor que você tem direito pelos dias trabalhados no mês em que foi
				demitido, mas ainda não recebeu. Se você saiu no dia 15, trabalhou
				metade do mês e por isso recebe metade do salário.
			</p>
			<p>
				<strong>Fórmula:</strong> (Salário ÷ 30) × dias trabalhados
			</p>
			<p>
				No caso da Ana: R$&nbsp;3.500 ÷ 30 = R$&nbsp;116,67 por dia.
				Multiplicando por 15 dias: <strong>R$&nbsp;1.750,00</strong>.
			</p>
			<p>
				Esse valor entra em qualquer tipo de demissão. Não existe rescisão em
				que você não receba pelo que trabalhou.
			</p>

			<h3 className={H3}>2. Aviso prévio</h3>
			<p>
				É o tempo que a empresa precisa te avisar antes de te demitir, ou o
				prazo que você precisa informar se for pedir demissão. Pode ser{" "}
				<strong>trabalhado</strong> (você fica na empresa por mais 30 dias) ou{" "}
				<strong>indenizado</strong> (você não precisa ir, mas recebe o valor
				correspondente).
			</p>
			<p>
				Desde a Lei 12.506/2011, o aviso prévio é proporcional ao tempo de
				empresa: <strong>30 dias base + 3 dias por ano completo</strong>,
				limitado a 90 dias no total.
			</p>
			<p>
				Para a Ana (2 anos completos): 30 + (2 × 3) = <strong>36 dias</strong>.
				Valor do aviso prévio indenizado: R$&nbsp;3.500 ÷ 30 × 36 ={" "}
				<strong>R$&nbsp;4.200,00</strong>.
			</p>
			<p>
				Atenção: se você for demitido sem justa causa, a empresa paga o aviso.
				Se for você quem pede demissão, é você que deve trabalhar ou indenizar.
				Um detalhe importante: os dias de aviso prévio{" "}
				<strong>contam como tempo de serviço</strong> para calcular o 13º e as
				férias proporcionais.
			</p>

			<h3 className={H3}>3. 13º salário proporcional</h3>
			<p>
				É calculado como 1/12 do salário por cada mês trabalhado no ano da
				demissão, ou por fração superior a 14 dias.
			</p>
			<p>
				<strong>Fórmula:</strong> (Salário ÷ 12) × meses trabalhados no ano
			</p>
			<p>
				Para a Ana, demitida em maio com aviso de 36 dias: o contrato termina em
				junho, totalizando 6 meses no ano. R$&nbsp;3.500 ÷ 12 × 6 ={" "}
				<strong>R$&nbsp;1.750,00</strong>.
			</p>
			<p>
				Se você foi demitido em dezembro, recebe o 13º inteiro. Se foi em
				janeiro, pega apenas um doze avos. O mês da demissão faz toda a
				diferença.
			</p>

			<h3 className={H3}>4. Férias vencidas (se houver)</h3>
			<p>
				São as férias que você já tinha direito a tirar, mas não tirou. A cada
				12 meses de trabalho você ganha 30 dias de férias. Se o prazo passou e
				você não tirou, a empresa paga o valor das férias mais o{" "}
				<strong>adicional constitucional de 1/3</strong>.
			</p>
			<p>
				No caso da Ana, ela completou o segundo período aquisitivo (2 anos) e
				ainda não tirou as férias desse período.
			</p>
			<p>
				Férias vencidas = salário + 1/3: R$&nbsp;3.500 + R$&nbsp;1.166,67 ={" "}
				<strong>R$&nbsp;4.666,67</strong>.
			</p>
			<p>
				Férias vencidas entram em qualquer tipo de rescisão, inclusive na
				demissão por justa causa. É o único direito que sobrevive mesmo no
				cenário mais difícil para o trabalhador.
			</p>

			<h3 className={H3}>5. Férias proporcionais</h3>
			<p>
				São calculadas pelo tempo trabalhado no período aquisitivo que ainda não
				fechou 12 meses. Para cada mês trabalhado, você ganha 1/12 dos 30 dias.
			</p>
			<p>
				Para a Ana, o aviso prévio de 36 dias faz o contrato terminar por volta
				de 20 de junho. O terceiro período aquisitivo começou em março de 2026
				(depois dos 2 anos completos), então ela acumula cerca de 4 meses nesse
				período.
			</p>
			<p>
				<strong>Fórmula:</strong> (Salário ÷ 12) × meses × (1 + 1/3)
				<br />
				(R$&nbsp;3.500 ÷ 12) × 4 × 1,333 = <strong>R$&nbsp;1.555,56</strong>.
			</p>

			<h3 className={H3}>6. FGTS + multa de 40%</h3>
			<p>
				O FGTS é um depósito mensal que a empresa faz na sua conta vinculada,
				equivalente a 8% do salário bruto. Esse dinheiro fica guardado e você só
				pode sacar em situações específicas: demissão sem justa causa,
				aposentadoria, compra de imóvel e algumas doenças graves.
			</p>
			<p>
				Na demissão sem justa causa, além de poder sacar todo o saldo, você tem
				direito à <strong>multa de 40%</strong> sobre o total depositado desde o
				início do contrato naquela empresa.
			</p>
			<p>
				Para a Ana: R$&nbsp;3.500 × 8% = R$&nbsp;280,00 por mês. Em 28 meses:
				R$&nbsp;280 × 28 = R$&nbsp;7.840,00 (estimativa, o valor real fica na
				conta com rendimentos). Multa de 40%: R$&nbsp;7.840 × 40% ={" "}
				<strong>R$&nbsp;3.136,00</strong>.
			</p>
			<p>
				Importante: a multa de 40% é paga pela empresa e não sai do seu saldo. O
				FGTS continua intacto para saque, e a multa é um valor extra que a
				empresa deposita separadamente.
			</p>

			<h2 className={H2}>Resumo: quanto a Ana recebe</h2>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Verba</th>
						<th className={TH}>Valor</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Saldo de salário (15 dias)</td>
						<td className={TD}>R$&nbsp;1.750,00</td>
					</tr>
					<tr>
						<td className={TD}>Aviso prévio indenizado (36 dias)</td>
						<td className={TD}>R$&nbsp;4.200,00</td>
					</tr>
					<tr>
						<td className={TD}>13º proporcional (6/12)</td>
						<td className={TD}>R$&nbsp;1.750,00</td>
					</tr>
					<tr>
						<td className={TD}>Férias vencidas + 1/3 (2º período)</td>
						<td className={TD}>R$&nbsp;4.666,67</td>
					</tr>
					<tr>
						<td className={TD}>Férias proporcionais + 1/3 (4 meses)</td>
						<td className={TD}>R$&nbsp;1.555,56</td>
					</tr>
					<tr>
						<td className={TD}>FGTS (saque do saldo acumulado)</td>
						<td className={TD}>R$&nbsp;7.840,00</td>
					</tr>
					<tr>
						<td className={TD}>Multa do FGTS (40%)</td>
						<td className={TD}>R$&nbsp;3.136,00</td>
					</tr>
					<tr>
						<td className={`${TD} font-semibold`}>Total bruto estimado</td>
						<td className={`${TD} font-semibold`}>R$&nbsp;24.898,23</td>
					</tr>
				</tbody>
			</table>
			<p className="text-sm text-muted-foreground">
				Sobre esse valor ainda incidem INSS e IRRF, mas as verbas indenizatórias
				(aviso prévio indenizado, multa do FGTS e férias) são isentas. Apenas o
				saldo de salário e o 13º sofrem desconto.
			</p>

			<h2 className={H2}>Descontos: INSS e imposto de renda na rescisão</h2>
			<p>
				Nem tudo que a empresa paga chega até você, há descontos legais que se
				aplicam a algumas verbas. A regra geral é:
			</p>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>Saldo de salário e 13º proporcional:</strong> sofrem desconto
					de INSS e, dependendo do valor, de IRRF.
				</li>
				<li>
					<strong>Aviso prévio indenizado, multa do FGTS, férias + 1/3:</strong>{" "}
					são verbas indenizatórias e por tanto, isentas de INSS e IRRF.
				</li>
			</ul>

			<h3 className={H3}>Tabela INSS 2026</h3>
			<p>
				O cálculo é progressivo: você não paga a alíquota mais alta sobre o
				salário inteiro, mas sim a alíquota correspondente a cada faixa.
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Faixa de salário</th>
						<th className={TH}>Alíquota</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até R$&nbsp;1.621,00</td>
						<td className={TD}>7,5%</td>
					</tr>
					<tr>
						<td className={TD}>De R$&nbsp;1.621,01 a R$&nbsp;2.902,84</td>
						<td className={TD}>9%</td>
					</tr>
					<tr>
						<td className={TD}>De R$&nbsp;2.902,85 a R$&nbsp;4.354,27</td>
						<td className={TD}>12%</td>
					</tr>
					<tr>
						<td className={TD}>De R$&nbsp;4.354,28 a R$&nbsp;8.475,55</td>
						<td className={TD}>14%</td>
					</tr>
				</tbody>
			</table>

			<h3 className={H3}>Imposto de renda 2026</h3>
			<p>
				A partir de 2026, quem recebe até R$&nbsp;5.000,00 por mês está isento
				de imposto de renda (Lei 15.270/2025). Para valores acima disso, a
				tabela progressiva continua valendo com os redutores aplicados.
			</p>
			<p>
				Para a Ana, o saldo de salário de R$&nbsp;1.750 e o 13º de R$&nbsp;1.750
				ficam bem abaixo do limite de isenção e ela provavelmente não vai pagar
				IR na rescisão.
			</p>

			<h2 className={H2}>Seguro-desemprego</h2>
			<p>
				Além das verbas rescisórias, quem foi demitido sem justa causa tem
				direito ao seguro-desemprego, sendo um benefício pago pelo governo, não
				pela empresa.
			</p>
			<p>
				Para ter direito, você precisa ter carteira assinada por pelo menos 12
				meses nos últimos 18 meses (se for a primeira solicitação). Em pedidos
				seguintes, os requisitos ficam mais rigorosos.
			</p>

			<h3 className={H3}>Número de parcelas</h3>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>1ª solicitação:</strong> 4 parcelas (12 a 23 meses
					trabalhados) ou 5 parcelas (24 meses ou mais)
				</li>
				<li>
					<strong>2ª solicitação:</strong> 3 ou 4 parcelas, conforme o caso
				</li>
				<li>
					<strong>3ª solicitação em diante:</strong> sempre 5 parcelas
				</li>
			</ul>

			<h3 className={H3}>Como calcular o valor</h3>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Salário médio dos últimos 3 meses</th>
						<th className={TH}>Cálculo da parcela</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até R$&nbsp;2.222,17</td>
						<td className={TD}>Salário médio × 0,8</td>
					</tr>
					<tr>
						<td className={TD}>De R$&nbsp;2.222,18 a R$&nbsp;3.703,99</td>
						<td className={TD}>(Excedente × 0,5) + R$&nbsp;1.777,74</td>
					</tr>
					<tr>
						<td className={TD}>Acima de R$&nbsp;3.703,99</td>
						<td className={TD}>R$&nbsp;2.518,65 (teto)</td>
					</tr>
				</tbody>
			</table>
			<p>
				Para a Ana (salário de R$&nbsp;3.500): (R$&nbsp;3.500 −
				R$&nbsp;2.222,17) × 0,5 + R$&nbsp;1.777,74 = R$&nbsp;638,92 +
				R$&nbsp;1.777,74 = <strong>R$&nbsp;2.416,66 por parcela</strong>. Com 28
				meses de empresa (1ª solicitação), ela recebe 5 parcelas:{" "}
				<strong>R$&nbsp;12.083,30 no total</strong>.
			</p>
			<p className="text-sm text-muted-foreground">
				Valor mínimo: R$&nbsp;1.621,00 (salário mínimo 2026). Você tem até 120
				dias após a demissão para dar entrada no benefício.
			</p>

			<h2 className={H2}>Prazos que você precisa conhecer</h2>
			<p>
				A empresa tem <strong>10 dias corridos</strong> após o término do
				contrato para pagar todas as verbas rescisórias, seja quando o aviso
				prévio foi trabalhado (os 10 dias contam do último dia de trabalho) ou
				quando foi indenizado (contam da data da comunicação da demissão).
			</p>
			<p>
				Se a empresa não pagar dentro do prazo, você tem direito a uma{" "}
				<strong>multa igual a um salário</strong>, paga pela empresa diretamente
				a você. Está no art. 477, § 8º da CLT e é automática, não precisando
				comprovar nenhum prejuízo.
			</p>

			<h2 className={H2}>Como verificar se a conta está certa</h2>
			<p>
				Quando for assinar a rescisão, você recebe o{" "}
				<strong>TRCT (Termo de Rescisão do Contrato de Trabalho)</strong>. Ele
				discrimina todas as verbas e os descontos aplicados. Antes de assinar,
				verifique:
			</p>
			<ul className="list-disc space-y-2 pl-6">
				<li>
					O tempo de empresa está correto? Confira a data de admissão e a data
					de desligamento.
				</li>
				<li>
					As férias estão todas contabilizadas? Veja se constam tanto as
					vencidas (se houver) quanto as proporcionais.
				</li>
				<li>
					O aviso prévio foi calculado com proporcionalidade? São 30 dias base
					mais 3 por ano trabalhado.
				</li>
				<li>
					A multa do FGTS está presente? Na demissão sem justa causa, os 40% são
					obrigatórios.
				</li>
				<li>
					Os descontos fazem sentido? Verifique se estão descontando INSS e IR
					apenas das verbas que realmente devem ter esses descontos.
				</li>
			</ul>
			<p>
				Se algum número não fechar, questione antes de assinar. A assinatura do
				TRCT não te impede de entrar com ação trabalhista depois, mas resolver
				na hora é sempre mais rápido.
			</p>

			<h2 className={H2}>O que fazer se a empresa não pagar direito</h2>
			<p>
				Se você assinou e depois percebeu que algo estava errado (Ou se a
				empresa simplesmente não pagou) você pode:
			</p>
			<ul className="list-disc space-y-2 pl-6">
				<li>
					Tentar resolver diretamente com o RH ou departamento de pessoal.
				</li>
				<li>
					Procurar a{" "}
					<strong>Superintendência Regional do Trabalho (ex-DRT)</strong> da sua
					cidade, que oferece atendimento gratuito e ajuda a resolver conflitos
					entre empregador e empregado.
				</li>
				<li>
					Entrar com ação trabalhista. O prazo é de{" "}
					<strong>2 anos a partir da demissão</strong> para reclamar na Justiça
					do Trabalho.
				</li>
			</ul>
			<p>
				A maioria dos advogados trabalhistas atua com honorários condicionados
				ao resultado, então você não paga nada no início.
			</p>

			<h2 className={H2}>Calcule o seu valor em segundos</h2>
			<p>
				Se quiser saber exatamente o que vai receber ou o que já deveria ter
				recebido, a{" "}
				<Link
					href="/ferramentas/calculadora-de-rescisao"
					className="text-primary underline"
				>
					calculadora de rescisão do Ferramenta Ninja
				</Link>{" "}
				faz isso automaticamente. Basta informar o salário, o tempo na empresa,
				o tipo de demissão, os dias trabalhados e as férias não gozadas. O
				resultado sai na hora, com cada verba discriminada.
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
