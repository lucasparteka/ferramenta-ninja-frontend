import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "ferias-clt-guia-completo",
	title:
		"Férias CLT: guia completo de dias, fracionamento, abono e cálculo passo a passo",
	description:
		"Direito a férias, regras de fracionamento, abono pecuniário, terço constitucional e tributação. Guia completo com exemplos e calculadora.",
	publishedAt: "2026-04-26",
	updatedAt: "2026-04-26",
	author: "Equipe Ferramenta Ninja",
	category: "Trabalhista",
	relatedTools: [
		"/ferramentas/calculadora-de-ferias",
		"/ferramentas/calculadora-13-salario",
		"/ferramentas/calculadora-de-rescisao",
		"/ferramentas/calculadora-salario-liquido",
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
				Férias são direito constitucional (CF/88 art. 7º, XVII) e regulado pela
				CLT (artigos 129 a 153). Em tese é simples: 30 dias por ano. Na prática
				há detalhes que mudam o quanto você recebe e quando: faltas,
				fracionamento, abono pecuniário, terço constitucional, INSS e IRRF. Este
				guia cobre tudo passo a passo.
			</p>

			<h2 className={H2}>Quem tem direito e a partir de quando</h2>
			<p>
				Todo empregado CLT adquire direito a férias após 12 meses de trabalho na
				mesma empresa — esse é o <strong>período aquisitivo</strong>. Após
				adquirido, o empregador tem mais 12 meses (período concessivo) para
				conceder as férias. Passou desse prazo? Devem ser pagas em dobro (CLT
				art. 137).
			</p>

			<h2 className={H2}>Quantos dias de férias você tem direito?</h2>
			<p>
				A CLT (art. 130) prevê redução por faltas injustificadas no período
				aquisitivo:
			</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Faltas injustificadas</th>
						<th className={TH}>Dias de férias</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>Até 5</td>
						<td className={TD}>30 dias</td>
					</tr>
					<tr>
						<td className={TD}>6 a 14</td>
						<td className={TD}>24 dias</td>
					</tr>
					<tr>
						<td className={TD}>15 a 23</td>
						<td className={TD}>18 dias</td>
					</tr>
					<tr>
						<td className={TD}>24 a 32</td>
						<td className={TD}>12 dias</td>
					</tr>
					<tr>
						<td className={TD}>Mais de 32</td>
						<td className={TD}>Sem direito a férias</td>
					</tr>
				</tbody>
			</table>
			<p className="text-sm text-muted-foreground">
				Faltas justificadas (atestado médico, doação de sangue, casamento,
				falecimento de familiar, exames vestibular, entre outras previstas em
				lei) não contam.
			</p>

			<h2 className={H2}>Fracionamento (até 3 períodos)</h2>
			<p>
				A Reforma Trabalhista (Lei 13.467/2017) permite fracionar as férias em
				até três períodos, desde que:
			</p>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>Um dos períodos tenha pelo menos 14 dias corridos</li>
				<li>Os outros dois tenham, cada um, no mínimo 5 dias corridos</li>
				<li>Haja concordância do empregado (CLT art. 134 §1º)</li>
			</ul>
			<p>
				Para empregados menores de 18 ou maiores de 50 anos, o fracionamento é
				vedado — devem tirar tudo de uma vez.
			</p>

			<h2 className={H2}>Abono pecuniário (vender 1/3 das férias)</h2>
			<p>
				O empregado pode "vender" até 1/3 dos dias de férias e receber em
				dinheiro (CLT art. 143). Em 30 dias de direito, isso significa
				transformar até 10 dias em pagamento.
			</p>
			<p>
				A solicitação deve ser feita até 15 dias antes do término do período
				aquisitivo. O valor pago corresponde aos dias vendidos + 1/3 sobre eles,
				e <strong>é isento de INSS e IRRF</strong>.
			</p>

			<h2 className={H2}>Terço constitucional</h2>
			<p>
				Sobre o salário das férias incide um adicional de 1/3 (CF/88 art. 7º,
				XVII). Esse "terço" é direito mínimo — algumas convenções coletivas dão
				mais, mas nunca menos.
			</p>

			<h2 className={H2}>
				Cálculo passo a passo: exemplo R$ 4.000 por 30 dias
			</h2>

			<h3 className={H3}>Passo 1 — Salário-base de férias</h3>
			<p>
				Para 30 dias completos, o salário de férias é igual ao salário mensal:
				R$ 4.000,00.
			</p>

			<h3 className={H3}>Passo 2 — Terço constitucional</h3>
			<p>R$ 4.000,00 ÷ 3 = R$ 1.333,33.</p>

			<h3 className={H3}>Passo 3 — Bruto das férias</h3>
			<p>R$ 4.000,00 + R$ 1.333,33 = R$ 5.333,33.</p>

			<h3 className={H3}>Passo 4 — INSS</h3>
			<p>
				Aplicação progressiva (mesmas faixas do salário mensal). Para R$
				5.333,33:
			</p>
			<ul className="list-disc space-y-1 pl-6 text-muted-foreground">
				<li>1ª faixa (até 1.518): 1.518 × 7,5% = 113,85</li>
				<li>2ª faixa: 1.275,88 × 9% = 114,83</li>
				<li>3ª faixa: 1.396,95 × 12% = 167,63</li>
				<li>4ª faixa: 142,50 × 14% = 19,95</li>
			</ul>
			<p>
				<strong>INSS: R$ 416,26.</strong>
			</p>

			<h3 className={H3}>Passo 5 — IRRF</h3>
			<p>
				Base = R$ 5.333,33 − R$ 416,26 = R$ 4.917,07. Cai na faixa de 27,5%
				(parcela a deduzir R$ 908,73):
			</p>
			<p>
				R$ 4.917,07 × 27,5% − R$ 908,73 = R$ 1.352,19 − R$ 908,73 = R$ 443,46.
			</p>

			<h3 className={H3}>Passo 6 — Líquido</h3>
			<p>
				R$ 5.333,33 − R$ 416,26 − R$ 443,46 = <strong>R$ 4.473,61</strong>.
			</p>
			<p className="text-sm text-muted-foreground">
				Use a{" "}
				<Link
					href="/ferramentas/calculadora-de-ferias"
					className="text-primary underline"
				>
					calculadora de férias
				</Link>{" "}
				para simular cenários com faltas, fracionamento e abono.
			</p>

			<h2 className={H2}>Cálculo com abono pecuniário</h2>
			<p>
				Suponha o mesmo R$ 4.000,00, mas vendendo 10 dias de férias (tirando 20
				efetivos):
			</p>
			<ul className="list-disc space-y-1 pl-6 text-muted-foreground">
				<li>Férias (20 dias): R$ 4.000 × (20/30) = R$ 2.666,67</li>
				<li>Terço sobre férias: R$ 888,89</li>
				<li>Abono (10 dias): R$ 4.000 × (10/30) = R$ 1.333,33</li>
				<li>Terço sobre abono: R$ 444,44</li>
			</ul>
			<p>
				INSS e IRRF incidem sobre férias + terço sobre férias (R$ 3.555,56).
				Abono e terço sobre abono são isentos.
			</p>

			<h2 className={H2}>Quando as férias devem ser pagas?</h2>
			<p>
				O pagamento deve ocorrer até <strong>2 dias antes</strong> do início das
				férias (CLT art. 145). Pago depois? Devem ser pagas em dobro. Aviso de
				férias deve chegar com no mínimo 30 dias de antecedência (CLT art. 135).
			</p>

			<h2 className={H2}>Casos especiais</h2>

			<h3 className={H3}>Gestante</h3>
			<p>
				A gestante pode escolher iniciar férias em qualquer momento dos 12 meses
				concessivos. A licença-maternidade não interrompe nem suspende férias já
				programadas — se houver conflito, prevalece a licença.
			</p>

			<h3 className={H3}>Comissionado</h3>
			<p>
				Quem ganha por comissões usa a média dos últimos 12 meses como base de
				férias. Variável recebida (gorjetas, prêmios habituais) também integra a
				base.
			</p>

			<h3 className={H3}>Trabalho intermitente</h3>
			<p>
				Empregado intermitente recebe férias proporcionais a cada 12 meses,
				calculadas sobre os meses efetivamente trabalhados, junto com o
				pagamento de cada chamado.
			</p>

			<h3 className={H3}>Doméstica</h3>
			<p>
				Doméstica registrada CLT tem direito aos mesmos 30 dias e mesmo terço
				constitucional. A LC 150/2015 equiparou a maioria dos direitos.
			</p>

			<h2 className={H2}>Erros comuns</h2>
			<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
				<li>
					Esquecer o terço constitucional. Não é "bônus" — é obrigatório por
					Constituição.
				</li>
				<li>Aplicar INSS/IRRF sobre o abono pecuniário. Abono é isento.</li>
				<li>
					Pagar férias depois do início. Gera obrigação de pagamento em dobro.
				</li>
				<li>
					Conceder férias só nos primeiros 14 dias e fracionar o resto em
					períodos menores que 5 dias. Ilegal.
				</li>
				<li>
					Forçar empregado a vender abono. A escolha é exclusiva do empregado.
				</li>
			</ul>

			<h2 className={H2}>Perguntas frequentes</h2>

			<h3 className={H3}>Posso emendar férias com feriados?</h3>
			<p>
				Sim, mas as férias não podem começar nos 2 dias que antecedem feriado ou
				folga (CLT art. 134 §3º). Início costuma ser na segunda-feira ou dia
				útil para evitar essa restrição.
			</p>

			<h3 className={H3}>Sou demitido. Recebo férias?</h3>
			<p>
				Sim. Em qualquer modalidade de rescisão, férias vencidas e proporcionais
				devem ser pagas, com terço constitucional. Veja detalhes no nosso guia
				de{" "}
				<Link
					href="/blog/calculo-rescisao-modalidades"
					className="text-primary underline"
				>
					rescisão
				</Link>{" "}
				(em breve).
			</p>

			<h3 className={H3}>O empregador pode cancelar férias já marcadas?</h3>
			<p>
				Pode, mas precisa avisar com antecedência razoável e indenizar prejuízos
				comprovados (passagens, hospedagens). A jurisprudência exige
				justificativa real e excepcional.
			</p>

			<h3 className={H3}>Posso "guardar" férias para o próximo ano?</h3>
			<p>
				Não acumular indefinidamente — após o fim do período concessivo (2º
				ano), as férias não tiradas devem ser pagas em dobro pelo empregador,
				mesmo sem demissão.
			</p>

			<h3 className={H3}>
				Tenho dois períodos aquisitivos vencidos. Como fica?
			</h3>
			<p>
				O período aquisitivo mais antigo deve ser quitado primeiro. Se ambos
				estão vencidos, o empregador deve pagar em dobro o que excedeu o prazo
				concessivo. Procure um advogado trabalhista se houver divergência.
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
