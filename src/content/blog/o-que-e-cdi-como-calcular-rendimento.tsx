import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "o-que-e-cdi-como-calcular-rendimento",
	title: "O que é CDI e como calcular o rendimento das suas aplicações (2026)",
	description:
		"Entenda o que é o CDI, qual a taxa atual em 2026 e como calcular quanto seu dinheiro rende em CDB, LCI e LCA. Com exemplos reais e comparação com a poupança.",
	publishedAt: "2026-05-15",
	updatedAt: "2026-05-15",
	author: "Equipe Ferramenta Ninja",
	category: "Financeiro",
	relatedTools: ["/ferramentas/rendimento-cdi-selic"],
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
				Se você já viu uma oferta de CDB com &ldquo;110% do CDI&rdquo; e ficou
				se perguntando o que isso realmente quer dizer, não se preocupe. Muita
				gente passa por isso. O CDI aparece em quase todos os investimentos de
				renda fixa no Brasil, mas poucas pessoas têm clareza sobre o que ele é,
				de onde vem e como usar esse valor para entender melhor as opções de
				aplicação.
			</p>
			<p>
				Neste artigo, você vai entender o que é o CDI, qual é a taxa atual em
				2026, como calcular de verdade o rendimento do seu dinheiro e por que
				comparar com a poupança pode fazer toda a diferença na hora de escolher
				onde investir.
			</p>

			<h2 className={H2}>O que é o CDI?</h2>
			<p>
				CDI significa Certificado de Depósito Interbancário. É um título que os
				bancos usam para emprestar dinheiro entre si. A operação geralmente dura
				apenas um dia, por isso é chamada de overnight.
			</p>
			<p>
				Esses empréstimos existem porque os bancos precisam terminar o dia com
				saldo positivo no Banco Central. Quando um banco fica sem dinheiro, ele
				pega emprestado de outro que tenha sobra. O CDI é o instrumento usado
				nessa negociação.
			</p>
			<p>
				A taxa média dessas operações é o que chamamos de taxa DI, ou CDI. Ela é
				calculada e divulgada todo dia pela B3, que assumiu essa responsabilidade
				da antiga CETIP.
			</p>
			<p>
				Na prática, o CDI é a referência para quase toda renda fixa do mercado.
				Quando um banco oferece um CDB a &ldquo;100% do CDI&rdquo;, ele está
				dizendo que vai pagar exatamente o que o CDI render no período. A 110%, o
				rendimento é 10% maior que o CDI.
			</p>

			<h2 className={H2}>Qual é a taxa CDI hoje (2026)?</h2>
			<p>
				Em maio de 2026, o CDI está perto de{" "}
				<strong>14,40% ao ano</strong>, o que equivale a aproximadamente{" "}
				<strong>1,09% ao mês</strong>.
			</p>
			<p>
				Essa taxa está bem perto da Selic, que é a taxa básica de juros da
				economia, definida pelo Banco Central. Em abril de 2026, o Copom (Comitê
				de Política Monetária) reduziu a Selic para 14,50% ao ano, seguindo um
				ciclo de cortes graduais que começou em março. Antes disso, a Selic havia
				ficado em 15% ao ano por quase um ano, o maior patamar em quase 20 anos.
			</p>
			<p>
				O CDI costuma ficar cerca de 0,10 ponto percentual abaixo da Selic. Isso
				não é definido por lei, mas é um padrão que se mantém há algum tempo, já
				que os empréstimos entre bancos usam a Selic como referência principal.
			</p>
			<p>
				Para acompanhar a taxa CDI atual, o site da B3 é a fonte oficial, com
				dados atualizados diariamente.
			</p>

			<h2 className={H2}>Como funciona o rendimento percentual do CDI?</h2>
			<p>
				Quando um investimento rende &ldquo;X% do CDI&rdquo;, isso significa que
				o retorno será uma porção da taxa CDI do período. A lógica é simples:
				você multiplica o CDI pelo percentual que o produto oferece, e o resultado
				é a taxa bruta antes do Imposto de Renda.
			</p>
			<p>Com o CDI em 14,40% ao ano:</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Percentual do CDI</th>
						<th className={TH}>Taxa bruta ao ano</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>80% do CDI</td>
						<td className={TD}>11,52%</td>
					</tr>
					<tr>
						<td className={TD}>100% do CDI</td>
						<td className={TD}>14,40%</td>
					</tr>
					<tr>
						<td className={TD}>110% do CDI</td>
						<td className={TD}>15,84%</td>
					</tr>
					<tr>
						<td className={TD}>120% do CDI</td>
						<td className={TD}>17,28%</td>
					</tr>
				</tbody>
			</table>

			<h2 className={H2}>Como calcular o rendimento CDI na prática?</h2>
			<p>A fórmula usada é a de juros compostos:</p>
			<p>
				<strong>M = C &times; (1 + i)^n</strong>
			</p>
			<p>
				Onde M é o montante final, C representa o capital inicial, i indica a
				taxa do período e n corresponde ao número de períodos.
			</p>

			<h3 className={H3}>Exemplo 1: CDB de 100% do CDI por 12 meses</h3>
			<p>
				R$&nbsp;10.000 aplicados em um CDB que rende 100% do CDI por 12 meses:
			</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>i = 14,40% ao ano = 0,1440</li>
				<li>
					M = 10.000 &times; (1 + 0,1440)^1 = 10.000 &times; 1,1440 ={" "}
					<strong>R$&nbsp;11.440,00 bruto</strong>
				</li>
			</ul>
			<p>
				Para um prazo de 12 meses (entre 181 e 360 dias), a alíquota de IR é de
				20% sobre o rendimento bruto:
			</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>IR = 1.440,00 &times; 20% = R$&nbsp;288,00</li>
				<li>Rendimento líquido = R$&nbsp;1.152,00</li>
				<li>
					<strong>Montante final: R$&nbsp;11.152,00</strong>
				</li>
			</ul>

			<h3 className={H3}>Exemplo 2: CDB de 110% do CDI por 12 meses</h3>
			<p>
				R$&nbsp;10.000 em um CDB de 110% do CDI pelo mesmo período:
			</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>i = 14,40% &times; 1,10 = 15,84% ao ano = 0,1584</li>
				<li>
					M = 10.000 &times; (1 + 0,1584)^1 = <strong>R$&nbsp;11.584,00 bruto</strong>
				</li>
				<li>IR = 1.584,00 &times; 20% = R$&nbsp;316,80</li>
				<li>
					<strong>Montante líquido final: R$&nbsp;11.267,20</strong>
				</li>
			</ul>

			<h2 className={H2}>Tabela de Imposto de Renda sobre renda fixa</h2>
			<p>
				O IR na renda fixa funciona como uma tabela regressiva. Quanto mais tempo
				o dinheiro fica aplicado, menor a alíquota que você paga no resgate. O
				imposto só incide sobre o rendimento, não sobre o capital investido.
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Prazo da aplicação</th>
						<th className={TH}>Alíquota de IR</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até 180 dias</td>
						<td className={TD}>22,5%</td>
					</tr>
					<tr>
						<td className={TD}>De 181 a 360 dias</td>
						<td className={TD}>20,0%</td>
					</tr>
					<tr>
						<td className={TD}>De 361 a 720 dias</td>
						<td className={TD}>17,5%</td>
					</tr>
					<tr>
						<td className={TD}>Acima de 720 dias</td>
						<td className={TD}>15,0%</td>
					</tr>
				</tbody>
			</table>
			<p>
				Atenção: se você resgatar nos primeiros 30 dias, além do IR também incide
				o IOF (Imposto sobre Operações Financeiras). O imposto é cobrado de forma
				regressiva, dia a dia, e chega a zero no 30º dia. Nos primeiros dias, ele
				pode consumir boa parte do rendimento, então evite aplicar dinheiro que
				possa precisar antes desse período.
			</p>
			<p>
				<strong>LCI, LCA e poupança são isentas de IR para pessoa física.</strong>
			</p>

			<h2 className={H2}>CDI x Poupança: qual rende mais em 2026?</h2>
			<p>
				Com a Selic acima de 8,5% ao ano, a poupança rende 0,5% ao mês mais a TR
				(Taxa Referencial). Essa combinação dá cerca de{" "}
				<strong>10,45% ao ano</strong>, considerando a TR atual.
			</p>
			<p>
				Um investimento a 100% do CDI (14,40% ao ano), com IR de 15% no longo
				prazo, resulta em aproximadamente <strong>12,24% ao ano líquido</strong>.
				Isso é cerca de 17% mais rentável do que a poupança.
			</p>
			<p>
				Comparando diretamente com R$&nbsp;10.000 investidos por 24 meses:
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Investimento</th>
						<th className={TH}>Cálculo</th>
						<th className={TH}>Montante final</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Poupança (10,45% a.a.)</td>
						<td className={TD}>R$&nbsp;10.000 &times; (1,1045)²</td>
						<td className={TD}>R$&nbsp;12.180,42</td>
					</tr>
					<tr>
						<td className={TD}>CDB 100% CDI (IR 15% após 720 dias)</td>
						<td className={TD}>
							Bruto R$&nbsp;13.107,36 &minus; IR R$&nbsp;466,10
						</td>
						<td className={TD}>
							<strong>R$&nbsp;12.641,26</strong>
						</td>
					</tr>
				</tbody>
			</table>
			<p>
				Diferença de <strong>R$&nbsp;460,84</strong> a mais no CDB, sem sair do
				conforto da renda fixa e com cobertura do FGC até R$&nbsp;250.000.
			</p>
			<p>
				A poupança ainda é o produto mais popular do Brasil, mas em termos de
				rentabilidade ela fica bem atrás de CDBs, LCIs e LCAs disponíveis no
				mercado.
			</p>

			<h2 className={H2}>Principais investimentos atrelados ao CDI</h2>

			<h3 className={H3}>CDB (Certificado de Depósito Bancário)</h3>
			<p>
				Emitido por bancos, rende um percentual do CDI. Tem cobertura do FGC até
				R$&nbsp;250.000 por CPF por instituição. Tributado pelo IR regressivo. Em
				bancos grandes, o retorno costuma ficar entre 90% e 103% do CDI. Em
				bancos menores e fintechs, é comum encontrar de 105% a 120% do CDI.
			</p>

			<h3 className={H3}>LCI e LCA</h3>
			<p>
				LCI (Letra de Crédito Imobiliário) e LCA (Letra de Crédito do
				Agronegócio) são isentas de IR para pessoa física. Por isso, um LCI a
				85% do CDI pode render o mesmo ou mais do que um CDB a 100% do CDI,
				dependendo do prazo. Também têm cobertura do FGC, mas costumam exigir um
				período mínimo de carência antes do resgate.
			</p>

			<h3 className={H3}>Tesouro Selic</h3>
			<p>
				Título público federal que acompanha a Selic, ficando muito próximo de
				100% do CDI. Tributado pelo IR regressivo. É considerado o investimento
				mais seguro do Brasil, garantido pelo governo federal.
			</p>

			<h3 className={H3}>Fundos DI</h3>
			<p>
				Investem em títulos pós-fixados ligados ao CDI. Cobram taxa de
				administração, que reduz o retorno final. Para fundos com taxas acima de
				0,5% ao ano, o CDB direto costuma ser mais vantajoso.
			</p>

			<h2 className={H2}>Como comparar um CDB tributado com uma LCA isenta?</h2>
			<p>
				Para comparar um produto tributado (CDB) com um isento (LCA) de forma
				justa, é preciso calcular a taxa equivalente líquida:
			</p>
			<p>
				<strong>Taxa equivalente = taxa bruta &times; (1 &minus; alíquota IR)</strong>
			</p>
			<p>Exemplo com prazo de 12 meses (IR de 20%):</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>CDB a 100% CDI (14,40% a.a.) = 14,40% &times; 0,80 = <strong>11,52% líquido</strong></li>
				<li>LCA a 82% CDI (11,81% a.a.) = <strong>11,81% líquido</strong> (isenta)</li>
			</ul>
			<p>Neste caso, a LCA seria melhor. Para prazos acima de 720 dias (IR de 15%):</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>CDB a 100% CDI = 14,40% &times; 0,85 = <strong>12,24% líquido</strong></li>
				<li>LCA a 85% CDI (12,24% a.a.) = exatamente o ponto de equilíbrio</li>
			</ul>
			<p>
				Ou seja: para prazos longos, uma LCA precisa pagar pelo menos{" "}
				<strong>85% do CDI</strong> para ser equivalente a um CDB a 100% do CDI.
			</p>

			<h2 className={H2}>CDI x IPCA: o juro real</h2>
			<p>
				O IPCA (Índice de Preços ao Consumidor Amplo) é o índice oficial de
				inflação no Brasil. Nos últimos 12 meses, o IPCA está em torno de 4,39%.
			</p>
			<p>
				O juro real é o quanto o investimento rende acima da inflação. Com o CDI
				em 14,40% e o IPCA em 4,39%, o juro real bruto chega a cerca de{" "}
				<strong>10,0% ao ano</strong>, um dos maiores patamares entre as economias
				relevantes do mundo.
			</p>
			<p>
				Na prática, quem investe em renda fixa ligada ao CDI está vendo seu
				patrimônio crescer bem acima da inflação. O problema é que muita gente
				deixa o dinheiro parado em conta corrente ou na poupança, perdendo esse
				ganho.
			</p>

			<h2 className={H2}>O que acontece com o CDI quando a Selic cai?</h2>
			<p>
				O CDI acompanha a Selic de perto. Se o Banco Central continuar o ciclo de
				cortes iniciado em 2026, o CDI vai cair junto.
			</p>
			<p>
				Isso afeta todos os investimentos pós-fixados: CDB, LCI, LCA, Tesouro
				Selic. Para travar uma taxa maior por mais tempo, existem os{" "}
				<strong>prefixados</strong> (que pagam uma taxa fixa definida na
				contratação) e o <strong>IPCA+</strong> (inflação mais uma taxa fixa,
				como o Tesouro IPCA+).
			</p>
			<p>
				Para quem não quer se preocupar com isso, os produtos pós-fixados seguem
				sendo válidos, porque acompanham automaticamente a taxa vigente no período.
			</p>

			<h2 className={H2}>Perguntas frequentes sobre CDI</h2>

			<h3 className={H3}>O CDI é o mesmo que a Selic?</h3>
			<p>
				Não. São índices diferentes. A Selic é a taxa básica de juros definida
				pelo Banco Central. O CDI é a média das taxas das operações interbancárias.
				Na prática, o CDI costuma ficar cerca de 0,10 ponto percentual abaixo da
				Selic.
			</p>

			<h3 className={H3}>Quanto rende &ldquo;1% do CDI&rdquo; ao mês?</h3>
			<p>
				Essa expressão não significa 1% ao mês. &ldquo;1% do CDI&rdquo; é uma
				fração da taxa CDI. O CDI rende hoje cerca de 1,09% ao mês. Um produto a
				100% do CDI rende esses 1,09% ao mês. Um produto a 1% do CDI renderia
				apenas 0,0109% ao mês, valor quase insignificante.
			</p>

			<h3 className={H3}>CDI é seguro?</h3>
			<p>
				O CDI em si é um índice, não um investimento. Os produtos atrelados ao
				CDI, como CDB, LCI e LCA, têm cobertura do FGC até R$&nbsp;250.000 por
				CPF por instituição. O Tesouro Selic tem garantia do governo federal.
			</p>

			<h3 className={H3}>Preciso declarar IR sobre rendimentos atrelados ao CDI?</h3>
			<p>
				O imposto já é descontado na fonte no momento do resgate. Na declaração
				anual de IR, você informa os rendimentos isentos e tributados
				separadamente. A instituição financeira envia um informe de rendimentos
				anual com todos os dados necessários.
			</p>

			<h3 className={H3}>Quanto rendem R$&nbsp;100.000 no CDI em 12 meses?</h3>
			<p>
				Com o CDI atual de 14,40% ao ano, o rendimento bruto seria de
				R$&nbsp;14.400. Descontando IR de 20% (prazo entre 181 e 360 dias), o
				rendimento líquido seria de R$&nbsp;11.520. Montante final:{" "}
				<strong>R$&nbsp;111.520</strong>.
			</p>

			<h2 className={H2}>Calcule o rendimento CDI sem fazer conta</h2>
			<p>
				Se você quiser saber exatamente quanto vai receber em uma aplicação
				atrelada ao CDI, sem precisar montar a fórmula na mão, a{" "}
				<Link
					href="/ferramentas/rendimento-cdi-selic"
					className="text-primary underline"
				>
					calculadora de rendimento CDI/Selic da Ferramenta Ninja
				</Link>{" "}
				faz isso automaticamente. Informe o valor investido, o percentual do CDI
				e o prazo. A ferramenta mostra o rendimento bruto, o IR descontado e o
				valor líquido final.
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
