import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TypingTest } from "@/components/tools/typing-test/typing-test";

export const metadata: Metadata = {
	title: "Teste de Digitação Online Grátis | Ferramenta Ninja",
	description:
		"Meça sua velocidade de digitação em WPM e CPM. Teste de digitação online em português, com precisão e tempo real. Ferramenta gratuita.",
};

const faq = [
	{
		question: "O que é WPM?",
		answer:
			"WPM (Words Per Minute) mede quantas palavras você digita por minuto. Uma palavra padrão equivale a 5 caracteres. É a métrica mais comum para avaliar velocidade de digitação.",
	},
	{
		question: "O que é CPM?",
		answer:
			"CPM (Characters Per Minute) mede quantos caracteres você digita por minuto. É útil para avaliar a velocidade bruta, independentemente da contagem de palavras.",
	},
	{
		question: "Qual é uma boa velocidade de digitação?",
		answer:
			"A média geral é de 40 WPM. Profissionais de escritório costumam ter entre 60-80 WPM. Digitadores experientes podem ultrapassar 100 WPM.",
	},
	{
		question: "Como a precisão é calculada?",
		answer:
			"A precisão é a porcentagem de caracteres digitados corretamente em relação ao total. Um erro reduz tanto a precisão quanto o WPM, já que caracteres errados não contam.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o teste de digitação?
				</h2>
				<p>
					O teste apresenta um texto em português que você deve digitar o mais
					rápido e corretamente possível. À medida que digita, a ferramenta
					calcula em tempo real sua velocidade em WPM (palavras por minuto), CPM
					(caracteres por minuto) e precisão.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que praticar digitação?
				</h2>
				<div className="space-y-3">
					<p>Digitar rápido e com precisão economiza tempo no dia a dia:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Produtividade:</strong>{" "}
							escreva e-mails, documentos e código mais rápido.
						</li>
						<li>
							<strong className="text-foreground">Menos fadiga:</strong> digitar
							sem olhar para o teclado reduz esforço mental.
						</li>
						<li>
							<strong className="text-foreground">Mais foco:</strong> quando a
							digitação é automática, você concentra-se no conteúdo.
						</li>
						<li>
							<strong className="text-foreground">
								Vantagem profissional:
							</strong>{" "}
							especialmente para programadores, redatores e administrativos.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Escolha a duração (30s, 1min ou 2min), clique na área de texto e
						comece a digitar. O teste inicia automaticamente no primeiro
						caractere. Quando terminar ou o tempo acabar, veja seu resultado
						completo com WPM, CPM e precisão.
					</p>
				</div>
			</section>
		</>
	);
}

export default function TesteDigitacaoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/teste-digitacao"
			title="Teste de Digitação"
			description="Meça sua velocidade de digitação em WPM e CPM. Teste em português com precisão em tempo real. Rápido, gratuito e sem cadastro."
			relatedTools={<RelatedTools currentHref="/ferramentas/teste-digitacao" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<TypingTest />
		</PageLayout>
	);
}
