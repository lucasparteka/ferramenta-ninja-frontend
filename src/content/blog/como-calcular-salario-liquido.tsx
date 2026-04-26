import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "como-calcular-salario-liquido",
	title:
		"Como calcular salário líquido em 2026: passo a passo com exemplo real",
	description:
		"Aprenda a calcular o salário líquido aplicando a tabela INSS 2026, IRRF e descontos legais. Exemplo prático passo a passo e calculadora pronta.",
	publishedAt: "2026-04-26",
	updatedAt: "2026-04-26",
	author: "Equipe Ferramenta Ninja",
	category: "Trabalhista",
	relatedTools: [
		"/ferramentas/calculadora-salario-liquido",
		"/ferramentas/calculadora-de-hora-extra",
		"/ferramentas/calculadora-13-salario",
		"/ferramentas/calculadora-de-ferias",
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
				Receber a folha de pagamento e ver um valor menor que o esperado é
				frustrante. A diferença entre o salário <strong>bruto</strong>{" "}
				(combinado em contrato) e o salário <strong>líquido</strong> (depositado
				na conta) vem de descontos obrigatórios — INSS, IRRF e, em alguns casos,
				vale-transporte e plano de saúde. Neste guia mostramos como esse cálculo
				funciona em 2026, com tabelas oficiais, exemplo passo a passo e quando
				você pode contestar valores.
			</p>

			<h2 className={H2}>O que é salário bruto e líquido</h2>
			<p>
				<strong>Salário bruto</strong> é o valor antes de qualquer desconto. É o
				que está registrado em contrato e na CTPS. Sobre ele incidem
				contribuição previdenciária (INSS) e imposto de renda (IRRF).
			</p>
			<p>
				<strong>Salário líquido</strong> é o que efetivamente cai na conta:
				salário bruto menos INSS menos IRRF menos descontos opcionais
				(vale-transporte, plano de saúde, contribuição sindical autorizada,
				adiantamentos).
			</p>
			<p>
				Benefícios como vale-refeição, vale-alimentação e auxílio home-office
				não entram no líquido — são pagos separadamente, e a Reforma Trabalhista
				(Lei 13.467/2017) deixou claro que vale-alimentação não integra o
				salário para fins de INSS/IRRF.
			</p>

			<h2 className={H2}>Tabela INSS 2026 (alíquotas progressivas)</h2>
			<p>
				O INSS para empregados CLT é progressivo: cada faixa do salário paga uma
				alíquota diferente. A alíquota <strong>efetiva</strong> (média ponderada
				que aparece no holerite) sai do cálculo abaixo. Limite: contribuição
				capada no teto.
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Faixa de salário</th>
						<th className={TH}>Alíquota nominal</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até R$ 1.518,00</td>
						<td className={TD}>7,5%</td>
					</tr>
					<tr>
						<td className={TD}>De R$ 1.518,01 até R$ 2.793,88</td>
						<td className={TD}>9%</td>
					</tr>
					<tr>
						<td className={TD}>De R$ 2.793,89 até R$ 4.190,83</td>
						<td className={TD}>12%</td>
					</tr>
					<tr>
						<td className={TD}>De R$ 4.190,84 até R$ 8.157,41 (teto)</td>
						<td className={TD}>14%</td>
					</tr>
				</tbody>
			</table>
			<p className="text-sm text-muted-foreground">
				Valores referentes às últimas atualizações oficiais publicadas no Diário
				Oficial. Acima do teto, a contribuição é fixa no valor máximo, calculado
				sobre o teto.
			</p>

			<h2 className={H2}>Tabela IRRF 2026</h2>
			<p>
				O Imposto de Renda Retido na Fonte (IRRF) também é progressivo, mas
				incide sobre a base de cálculo (salário bruto menos INSS menos
				dependentes). Cada dependente reduz a base em R$ 189,59.
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Base de cálculo (R$)</th>
						<th className={TH}>Alíquota</th>
						<th className={TH}>Parcela a deduzir (R$)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até 2.428,80</td>
						<td className={TD}>Isento</td>
						<td className={TD}>—</td>
					</tr>
					<tr>
						<td className={TD}>De 2.428,81 até 2.826,65</td>
						<td className={TD}>7,5%</td>
						<td className={TD}>182,16</td>
					</tr>
					<tr>
						<td className={TD}>De 2.826,66 até 3.751,05</td>
						<td className={TD}>15%</td>
						<td className={TD}>394,16</td>
					</tr>
					<tr>
						<td className={TD}>De 3.751,06 até 4.664,68</td>
						<td className={TD}>22,5%</td>
						<td className={TD}>675,49</td>
					</tr>
					<tr>
						<td className={TD}>Acima de 4.664,68</td>
						<td className={TD}>27,5%</td>
						<td className={TD}>908,73</td>
					</tr>
				</tbody>
			</table>

			<h2 className={H2}>Passo a passo: exemplo com R$ 5.000,00 brutos</h2>
			<p>
				Vamos calcular o líquido de quem ganha R$ 5.000,00 brutos, sem
				dependentes e sem descontos opcionais.
			</p>

			<h3 className={H3}>Passo 1 — INSS progressivo</h3>
			<p>Aplicamos a alíquota faixa por faixa:</p>
			<ul className="list-disc space-y-1 pl-6 text-muted-foreground">
				<li>1ª faixa: R$ 1.518,00 × 7,5% = R$ 113,85</li>
				<li>
					2ª faixa: (R$ 2.793,88 − R$ 1.518,00) × 9% = R$ 1.275,88 × 9% = R$
					114,83
				</li>
				<li>
					3ª faixa: (R$ 4.190,83 − R$ 2.793,88) × 12% = R$ 1.396,95 × 12% = R$
					167,63
				</li>
				<li>
					4ª faixa: (R$ 5.000,00 − R$ 4.190,83) × 14% = R$ 809,17 × 14% = R$
					113,28
				</li>
			</ul>
			<p>
				<strong>INSS total: R$ 509,59</strong> (alíquota efetiva ≈ 10,2%).
			</p>

			<h3 className={H3}>Passo 2 — Base de cálculo do IRRF</h3>
			<p>R$ 5.000,00 − R$ 509,59 (INSS) = R$ 4.490,41.</p>

			<h3 className={H3}>Passo 3 — IRRF</h3>
			<p>
				A base de R$ 4.490,41 cai na 4ª faixa (de 3.751,06 a 4.664,68 → 22,5%):
			</p>
			<p>
				R$ 4.490,41 × 22,5% − R$ 675,49 = R$ 1.010,34 − R$ 675,49 = R$ 334,85.
			</p>
			<p>
				<strong>IRRF: R$ 334,85.</strong>
			</p>

			<h3 className={H3}>Passo 4 — Líquido</h3>
			<p>
				R$ 5.000,00 − R$ 509,59 (INSS) − R$ 334,85 (IRRF) ={" "}
				<strong>R$ 4.155,56</strong>.
			</p>
			<p className="text-sm text-muted-foreground">
				Isso ainda sem considerar vale-transporte, plano de saúde ou outros
				descontos opcionais que podem reduzir o líquido.
			</p>

			<h2 className={H2}>Quando o IRRF é zero</h2>
			<p>
				Se a base de cálculo (bruto menos INSS menos dependentes) for menor ou
				igual ao limite de isenção, não há retenção. Em 2026 o limite de isenção
				corresponde a aproximadamente R$ 2.428,80 de base — somando INSS e
				dependentes, salários até cerca de R$ 2.640,00 brutos costumam ficar
				isentos de IRRF.
			</p>

			<h2 className={H2}>O que NÃO entra no salário líquido</h2>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>Vale-refeição e vale-alimentação</strong>: pagos
					separadamente, não somam ao bruto nem ao líquido.
				</li>
				<li>
					<strong>Vale-transporte</strong>: pode descontar até 6% do salário
					bruto, mas o cartão é separado.
				</li>
				<li>
					<strong>Plano de saúde</strong>: desconto opcional, varia conforme o
					plano.
				</li>
				<li>
					<strong>FGTS (8% sobre o bruto)</strong>: pago pelo empregador, NÃO
					sai do seu salário. Vai para conta vinculada na Caixa, sacável em
					rescisão sem justa causa, financiamento de imóvel ou outras hipóteses
					legais.
				</li>
			</ul>

			<h2 className={H2}>Erros comuns no holerite</h2>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>INSS calculado pela alíquota nominal cheia.</strong> Errado: a
					alíquota é progressiva. Quem ganha R$ 5.000 não paga 14% sobre tudo,
					só sobre a parcela acima de R$ 4.190,83.
				</li>
				<li>
					<strong>IRRF sem deduzir INSS.</strong> A base do IRRF é o bruto MENOS
					o INSS, não o bruto direto.
				</li>
				<li>
					<strong>Esquecer dependentes.</strong> Cada dependente reduz a base em
					R$ 189,59. Se você tem filhos, declare em RH.
				</li>
				<li>
					<strong>Vale-transporte cobrado a mais.</strong> O desconto máximo é
					6% do bruto. Acima disso, é irregular.
				</li>
			</ul>

			<h2 className={H2}>Como conferir rápido</h2>
			<p>
				A forma mais simples é usar uma{" "}
				<Link
					href="/ferramentas/calculadora-salario-liquido"
					className="text-primary underline"
				>
					calculadora de salário líquido
				</Link>{" "}
				atualizada com as tabelas vigentes. Em segundos você compara com o
				holerite e identifica divergências.
			</p>
			<p>
				Se a diferença for relevante, peça ao RH a memória de cálculo — todo
				empregado tem direito de saber como o líquido foi formado (CLT art.
				464).
			</p>

			<h2 className={H2}>Perguntas frequentes</h2>

			<h3 className={H3}>O salário líquido muda todo ano?</h3>
			<p>
				As alíquotas em si não mudam todo ano, mas as faixas (limites em R$) são
				reajustadas conforme política governamental. Em geral, o teto do INSS e
				o limite de isenção do IRRF são os primeiros a subir.
			</p>

			<h3 className={H3}>Quem paga o FGTS sou eu?</h3>
			<p>
				Não. O FGTS (8% sobre o bruto) é pago pelo empregador em conta vinculada
				na Caixa, não desconta do seu salário. Você só recebe rendimento de TR +
				3% ao ano sobre o saldo.
			</p>

			<h3 className={H3}>Tenho dois empregos. Como fica IRRF?</h3>
			<p>
				Cada empregador faz o cálculo separadamente. Mas, na declaração anual do
				IR, os dois rendimentos são somados — pode haver imposto a pagar.
				Considere ajustar dependentes ou guardar uma reserva.
			</p>

			<h3 className={H3}>13º e férias seguem a mesma regra?</h3>
			<p>
				13º salário tem cálculo separado de INSS e IRRF, mas as alíquotas são as
				mesmas. Férias têm o terço constitucional e tributação específica. Para
				detalhes, veja nossos guias dedicados sobre{" "}
				<Link
					href="/blog/13-salario-como-calcular"
					className="text-primary underline"
				>
					13º salário
				</Link>{" "}
				e{" "}
				<Link
					href="/blog/ferias-clt-guia-completo"
					className="text-primary underline"
				>
					férias CLT
				</Link>
				.
			</p>

			<h3 className={H3}>Posso descontar pensão alimentícia do IRRF?</h3>
			<p>
				Sim, pensão judicial reduz a base de cálculo do IRRF. O empregador
				precisa do mandado para aplicar o desconto antes da incidência do
				imposto.
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
