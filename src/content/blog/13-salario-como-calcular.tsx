import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "13-salario-como-calcular",
	title:
		"13º salário: como calcular, datas de pagamento e o que fazer se não receber",
	description:
		"Cálculo proporcional do 13º salário, datas das parcelas, tributação INSS e IRRF, e o que fazer quando o empregador atrasa. Guia com exemplos práticos.",
	publishedAt: "2026-04-26",
	updatedAt: "2026-04-26",
	author: "Equipe Ferramenta Ninja",
	category: "Trabalhista",
	relatedTools: [
		"/ferramentas/calculadora-13-salario",
		"/ferramentas/calculadora-de-ferias",
		"/ferramentas/calculadora-salario-liquido",
		"/ferramentas/calculadora-de-rescisao",
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
				O 13º salário (gratificação natalina) foi instituído pela Lei 4.090/1962
				e regulamentado pela Lei 4.749/1965. É direito de todo empregado CLT —
				urbano, rural, doméstico ou avulso — e corresponde a um salário extra,
				pago anualmente. Mas o valor exato e as datas das parcelas geram dúvidas
				todo fim de ano. Este guia destrincha o cálculo, tributação e seus
				direitos caso o empregador atrase.
			</p>

			<h2 className={H2}>Quem tem direito</h2>
			<p>
				Todo empregado registrado em CLT que tenha trabalhado pelo menos{" "}
				<strong>15 dias no mês</strong> dentro do ano-base recebe a gratificação
				proporcional aos meses trabalhados. Aposentados e pensionistas do INSS
				também recebem. Autônomos, pejotas e MEIs não têm direito legal — salvo
				se houver vínculo empregatício reconhecido.
			</p>

			<h2 className={H2}>Como funciona o cálculo (avos)</h2>
			<p>
				O 13º é calculado em <strong>avos</strong>: cada mês trabalhado (com
				pelo menos 15 dias) vale 1/12 do salário. Se você trabalhou os 12 meses,
				recebe 12/12 = 1 salário cheio. Se foi admitido em julho, recebeu 6/12
				(de julho a dezembro), ou seja, meio salário.
			</p>

			<h2 className={H2}>Datas de pagamento das parcelas</h2>
			<p>A Lei 4.749/65 estabelece duas parcelas:</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Parcela</th>
						<th className={TH}>Prazo limite</th>
						<th className={TH}>Valor</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>1ª parcela</td>
						<td className={TD}>Entre 1º de fevereiro e 30 de novembro</td>
						<td className={TD}>50% do bruto, sem descontos</td>
					</tr>
					<tr>
						<td className={TD}>2ª parcela</td>
						<td className={TD}>Até 20 de dezembro</td>
						<td className={TD}>50% restante, com INSS e IRRF</td>
					</tr>
				</tbody>
			</table>
			<p>
				A 1ª parcela pode ser adiantada junto com as férias do ano (Lei 4.749/65
				art. 2º §2º), se o empregado solicitar até janeiro do mesmo ano.
			</p>

			<h2 className={H2}>
				Cálculo passo a passo: exemplo R$ 3.000 por 12 meses
			</h2>

			<h3 className={H3}>Passo 1 — Bruto</h3>
			<p>12/12 × R$ 3.000,00 = R$ 3.000,00.</p>

			<h3 className={H3}>Passo 2 — 1ª parcela (até 30/nov)</h3>
			<p>50% do bruto, sem descontos: R$ 1.500,00.</p>

			<h3 className={H3}>Passo 3 — 2ª parcela (até 20/dez): INSS</h3>
			<p>
				O INSS incide sobre o bruto total (R$ 3.000,00), aplicado de forma
				progressiva:
			</p>
			<ul className="list-disc space-y-1 pl-6 text-muted-foreground">
				<li>1ª faixa: 1.518 × 7,5% = 113,85</li>
				<li>2ª faixa: 1.275,88 × 9% = 114,83</li>
				<li>3ª faixa: 206,12 × 12% = 24,73</li>
			</ul>
			<p>
				INSS sobre o 13º: <strong>R$ 253,41</strong>.
			</p>

			<h3 className={H3}>Passo 4 — IRRF</h3>
			<p>
				Base = R$ 3.000,00 − R$ 253,41 = R$ 2.746,59. Cai na 2ª faixa (7,5%,
				deduzir R$ 182,16):
			</p>
			<p>R$ 2.746,59 × 7,5% − R$ 182,16 = R$ 205,99 − R$ 182,16 = R$ 23,83.</p>

			<h3 className={H3}>Passo 5 — 2ª parcela líquida</h3>
			<p>
				Bruto da 2ª parcela: R$ 1.500,00.
				<br />
				Descontos (INSS + IRRF): R$ 253,41 + R$ 23,83 = R$ 277,24.
				<br />
				Líquido da 2ª parcela: <strong>R$ 1.222,76</strong>.
			</p>

			<h3 className={H3}>Total recebido</h3>
			<p>R$ 1.500,00 (1ª parcela) + R$ 1.222,76 (2ª) = R$ 2.722,76.</p>
			<p className="text-sm text-muted-foreground">
				Use a{" "}
				<Link
					href="/ferramentas/calculadora-13-salario"
					className="text-primary underline"
				>
					calculadora de 13º salário
				</Link>{" "}
				para simular cenários com adicionais habituais, dependentes e meses
				parciais.
			</p>

			<h2 className={H2}>Adicionais habituais entram no 13º</h2>
			<p>
				Horas extras, adicional noturno, insalubridade, periculosidade,
				comissões e gratificações habituais integram o cálculo do 13º. A base é
				a média mensal recebida no ano. Se você fez horas extras em 6 dos 12
				meses, somam à média e aumentam o 13º.
			</p>

			<h2 className={H2}>13º proporcional na demissão</h2>
			<p>
				Quem é demitido (sem ou com justa causa, pedido de demissão, acordo)
				recebe 13º proporcional aos meses trabalhados no ano. Exceção: demissão
				por <strong>justa causa</strong> tira o direito ao 13º proporcional do
				ano corrente.
			</p>
			<p>
				Exemplo: admitido em janeiro, demitido em junho sem justa causa. Recebe
				6/12 do salário como 13º na rescisão.
			</p>

			<h2 className={H2}>Trabalho intermitente</h2>
			<p>
				O empregado intermitente recebe 13º a cada chamado, junto com a
				remuneração da convocação. Cada serviço prestado já carrega o 13º
				proporcional embutido.
			</p>

			<h2 className={H2}>O que fazer se o empregador atrasar</h2>
			<p>A 2ª parcela deve ser paga até 20 de dezembro. Atrasou?</p>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>Multa administrativa:</strong> a empresa pode ser multada em
					R$ 170,16 por empregado pelo Ministério do Trabalho.
				</li>
				<li>
					<strong>Denúncia:</strong> registre reclamação no portal{" "}
					<a
						href="https://www.gov.br/trabalho-e-emprego"
						className="text-primary underline"
						rel="noopener noreferrer"
						target="_blank"
					>
						gov.br/trabalho-e-emprego
					</a>{" "}
					ou em sindicato da categoria.
				</li>
				<li>
					<strong>Ação trabalhista:</strong> exige pagamento + multa do art. 467
					CLT (50% sobre verbas incontroversas) caso vá a juízo.
				</li>
				<li>
					<strong>Rescisão indireta (CLT 483):</strong> em casos extremos, o
					empregado pode pedir desligamento por descumprimento contratual e
					recebe verbas como em demissão sem justa causa.
				</li>
			</ul>

			<h2 className={H2}>Casos especiais</h2>

			<h3 className={H3}>Auxílio-doença / acidente de trabalho</h3>
			<p>
				Os primeiros 15 dias de afastamento são pagos pelo empregador e contam
				para o 13º. Após 15 dias, o INSS assume — esse período não conta para o
				13º proporcional, mas o INSS paga o "abono anual" (equivalente) sobre o
				benefício recebido.
			</p>

			<h3 className={H3}>Licença-maternidade</h3>
			<p>
				A licença-maternidade conta integralmente para o 13º. A empregada recebe
				normalmente os 12/12 do ano, mesmo em licença.
			</p>

			<h3 className={H3}>Faltas injustificadas</h3>
			<p>
				Diferente das férias, faltas injustificadas <em>não</em> reduzem o
				número de avos, desde que o empregado tenha trabalhado pelo menos 15
				dias no mês. Já meses com menos de 15 dias trabalhados não contam como
				avo.
			</p>

			<h3 className={H3}>Aposentado</h3>
			<p>
				Aposentados do INSS recebem o "abono anual" — equivalente ao 13º — em
				duas parcelas, geralmente pagas com a primeira em maio/junho e a segunda
				em novembro/dezembro.
			</p>

			<h2 className={H2}>Erros comuns</h2>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					<strong>Aplicar IRRF na 1ª parcela.</strong> Errado: a 1ª parcela é
					paga sem descontos. INSS e IRRF só incidem na 2ª.
				</li>
				<li>
					<strong>Calcular INSS e IRRF junto com o salário do mês.</strong> O
					13º tem cálculo separado de INSS/IRRF — não soma à base do salário
					mensal para fins de progressividade.
				</li>
				<li>
					<strong>Ignorar adicionais habituais.</strong> Hora extra, comissão,
					adicional noturno habituais entram na base.
				</li>
				<li>
					<strong>
						Considerar mês incompleto inicial sem 15 dias como avo.
					</strong>{" "}
					Mês com menos de 15 dias trabalhados não conta.
				</li>
			</ul>

			<h2 className={H2}>Perguntas frequentes</h2>

			<h3 className={H3}>Quando recebo o 13º se fui admitido em outubro?</h3>
			<p>
				Você recebe 13º proporcional. Outubro, novembro e dezembro = 3/12 do
				salário. A 2ª parcela é paga até 20 de dezembro normalmente; a 1ª, se
				não houver tempo hábil, costuma ir junto da 2ª.
			</p>

			<h3 className={H3}>Posso pedir adiantamento da 1ª parcela?</h3>
			<p>
				A 1ª parcela já é considerada um adiantamento. Se você quer recebê-la em
				data específica (ex.: junto com as férias), solicite por escrito ao RH
				até janeiro do mesmo ano (Lei 4.749/65 art. 2º §2º).
			</p>

			<h3 className={H3}>O 13º conta para FGTS?</h3>
			<p>
				Sim. O empregador deposita 8% do bruto do 13º na conta vinculada do
				FGTS, junto com o depósito do mês.
			</p>

			<h3 className={H3}>Estagiário recebe 13º?</h3>
			<p>
				Não. Estágio (Lei 11.788/2008) não é vínculo empregatício, então não
				gera direito a 13º, FGTS ou férias remuneradas com terço — apenas
				recesso de 30 dias após 12 meses, preferencialmente nas férias
				escolares.
			</p>

			<h3 className={H3}>Recebo 13º em rescisão por justa causa?</h3>
			<p>
				Não no ano corrente. A justa causa elimina o direito ao 13º proporcional
				do ano. Anos anteriores quitados continuam pagos.
			</p>

			<h3 className={H3}>Como conferir o valor do meu holerite de dezembro?</h3>
			<p>
				Use a{" "}
				<Link
					href="/ferramentas/calculadora-13-salario"
					className="text-primary underline"
				>
					calculadora de 13º
				</Link>{" "}
				informando salário bruto, meses trabalhados, dependentes e adicionais.
				Compare com o holerite — divergência relevante? Solicite memória de
				cálculo ao RH (CLT art. 464).
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
