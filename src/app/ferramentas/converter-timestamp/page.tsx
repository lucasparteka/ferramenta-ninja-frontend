import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TimestampConverter } from "@/components/tools/timestamp-converter/timestamp-converter";

export const metadata: Metadata = {
	title: "Converter Timestamp Online Grátis | Ferramenta Ninja",
	description:
		"Converta timestamp Unix para data legível e vice-versa. Suporte a segundos e milissegundos. Ferramenta gratuita e sem cadastro.",
};

const faq = [
	{
		question: "O que é um timestamp Unix?",
		answer:
			"Timestamp Unix é a contagem de segundos (ou milissegundos) desde 1º de janeiro de 1970, às 00:00:00 UTC. É o formato padrão para representar datas em sistemas Unix e em APIs.",
	},
	{
		question: "Qual a diferença entre segundos e milissegundos?",
		answer:
			"O timestamp em segundos conta o tempo em unidades de 1 segundo. Em milissegundos, cada unidade vale 1/1000 de segundo. A maioria das APIs modernas usa segundos, mas algumas linguagens como JavaScript nativamente usam milissegundos.",
	},
	{
		question: "A conversão é precisa?",
		answer:
			"Sim. A ferramenta converte exatamente o valor informado, considerando o fuso UTC. O resultado mostra a data e hora no formato brasileiro.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é timestamp Unix?
				</h2>
				<p>
					Timestamp Unix (ou Epoch time) é a quantidade de segundos decorridos
					desde a meia-noite de 1º de janeiro de 1970 em UTC. É um formato
					universal para representar pontos no tempo em sistemas computacionais,
					bancos de dados e APIs.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que converter timestamp?
				</h2>
				<div className="space-y-3">
					<p>
						Ao depurar APIs, analisar logs ou trabalhar com bancos de dados,
						você frequentemente encontra datas em formato timestamp. Converter
						para um formato legível ajuda a:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>Entender rapidamente quando um evento ocorreu</li>
						<li>Depurar problemas de timezone em aplicações</li>
						<li>Validar se uma data retornada pela API está correta</li>
						<li>Sincronizar dados entre sistemas com formatos diferentes</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Escolha a unidade (segundos ou milissegundos), insira o timestamp ou
						selecione uma data no calendário. A conversão acontece
						instantaneamente. Use o botão "Agora" para pegar o timestamp atual.
					</p>
				</div>
			</section>
		</>
	);
}

export default function ConverterTimestampPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/converter-timestamp"
			title="Converter Timestamp"
			description="Converta timestamp Unix para data legível e vice-versa. Suporte a segundos e milissegundos. Rápido, gratuito e 100% no navegador."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/converter-timestamp" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<TimestampConverter />
		</PageLayout>
	);
}
