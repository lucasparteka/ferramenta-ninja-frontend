import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { BinaryConverter } from "@/components/tools/binary-converter/binary-converter";

export const metadata: Metadata = {
	title: "Conversor de Código Binário Online Grátis | Ferramenta Ninja",
	description:
		"Converta texto para código binário e código binário para texto. Suporte a UTF-8 e todos os caracteres. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é código binário?
				</h2>
				<p>
					O código binário é o sistema de numeração de base 2, que utiliza
					apenas dois dígitos: 0 e 1. É a linguagem fundamental dos
					computadores, pois os processadores trabalham com sinais elétricos que
					representam dois estados: ligado (1) e desligado (0).
				</p>
				<p className="mt-3">
					Para representar texto em binário, cada caractere é convertido em seu
					valor numérico correspondente na tabela de codificação (como UTF-8 ou
					ASCII) e então esse número é expresso em binário com 8 bits — o que
					chamamos de um byte.
				</p>
				<p className="mt-3">
					Por exemplo, a letra <strong className="text-foreground">A</strong>{" "}
					tem o valor 65 na tabela ASCII, que em binário é{" "}
					<code className="text-foreground">01000001</code>.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Texto → Binário
						</h3>
						<ol className="list-decimal space-y-1 pl-6">
							<li>Digite ou cole o texto no campo de entrada.</li>
							<li>
								Escolha se quer os bytes separados por espaços ou sem separação.
							</li>
							<li>
								Clique em{" "}
								<strong className="text-foreground">Texto → Binário</strong>.
							</li>
						</ol>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Binário → Texto
						</h3>
						<ol className="list-decimal space-y-1 pl-6">
							<li>Cole o código binário no campo de entrada.</li>
							<li>
								Com espaços: cada grupo de 8 bits separado por espaço será
								tratado como um byte.
							</li>
							<li>
								Sem espaços: o binário será dividido automaticamente a cada 8
								caracteres.
							</li>
							<li>
								Clique em{" "}
								<strong className="text-foreground">Binário → Texto</strong>.
							</li>
						</ol>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Aprendizado e educação:</strong>{" "}
						entender como computadores armazenam texto é fundamental para
						estudantes de ciência da computação, engenharia e áreas afins.
						Visualizar a representação binária de palavras ajuda a fixar
						conceitos de sistemas de numeração e codificação de caracteres.
					</p>
					<p>
						<strong className="text-foreground">
							Programação de baixo nível:
						</strong>
						desenvolvedores que trabalham com manipulação de bits, protocolos de
						comunicação, drivers e sistemas embarcados frequentemente precisam
						converter entre texto e binário para depurar e analisar dados.
					</p>
					<p>
						<strong className="text-foreground">
							Segurança e criptografia:
						</strong>{" "}
						análise de dados binários é comum em engenharia reversa, análise de
						malware e estudo de protocolos de rede.
					</p>
					<p>
						<strong className="text-foreground">Curiosidade e diversão:</strong>{" "}
						escrever mensagens em código binário é uma forma clássica de
						codificação usada em desafios de programação, CTFs e comunidades de
						tecnologia.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tabela de referência
				</h2>
				<p className="mb-4">
					Abaixo estão alguns caracteres comuns e suas representações em código
					binário (UTF-8):
				</p>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-border">
								<th className="py-2 pr-6 text-left font-semibold text-foreground">
									Caractere
								</th>
								<th className="py-2 pr-6 text-left font-semibold text-foreground">
									Decimal
								</th>
								<th className="py-2 text-left font-semibold text-foreground">
									Binário
								</th>
							</tr>
						</thead>
						<tbody>
							{[
								{ char: "A", dec: 65, bin: "01000001" },
								{ char: "B", dec: 66, bin: "01000010" },
								{ char: "Z", dec: 90, bin: "01011010" },
								{ char: "a", dec: 97, bin: "01100001" },
								{ char: "z", dec: 122, bin: "01111010" },
								{ char: "0", dec: 48, bin: "00110000" },
								{ char: "9", dec: 57, bin: "00111001" },
								{ char: " ", dec: 32, bin: "00100000" },
							].map((row) => (
								<tr key={row.char} className="border-b border-border/50">
									<td className="py-2 pr-6 font-mono text-foreground">
										{row.char === " " ? "(espaço)" : row.char}
									</td>
									<td className="py-2 pr-6 font-mono">{row.dec}</td>
									<td className="py-2 font-mono">{row.bin}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Esta ferramenta suporta acentos e caracteres especiais?
						</h3>
						<p>
							Sim. A ferramenta utiliza a codificação UTF-8, que suporta todos
							os caracteres Unicode — incluindo letras acentuadas, ideogramas,
							emojis e símbolos de qualquer língua. Caracteres fora do intervalo
							ASCII podem ser representados por mais de um byte.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre com espaços e sem espaços?
						</h3>
						<p>
							Com espaços, cada byte (caractere) é separado visualmente,
							facilitando a leitura. Sem espaços, os bytes ficam concatenados em
							uma sequência contínua de 0s e 1s. Ambos representam o mesmo
							conteúdo; a diferença é apenas na formatação.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Por que cada caractere tem 8 bits?
						</h3>
						<p>
							Um byte é composto por 8 bits, o que permite representar 256
							valores diferentes (0 a 255). Para a maioria dos caracteres ASCII
							básicos, um único byte é suficiente. Caracteres UTF-8 de outras
							línguas podem usar 2, 3 ou 4 bytes.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre diretamente no seu navegador.
							Nenhum texto é transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CodigoBinarioPage() {
	return (
		<PageLayout
			title="Conversor de Código Binário Online Grátis"
			description="Converta texto para código binário e código binário para texto. Suporte completo a UTF-8 e todos os caracteres Unicode."
			relatedTools={<RelatedTools currentHref="/ferramentas/codigo-binario" />}
			extraContent={<SeoContent />}
		>
			<BinaryConverter />
		</PageLayout>
	);
}
