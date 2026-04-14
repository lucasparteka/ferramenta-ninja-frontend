import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { MorseConverter } from "@/components/tools/morse-converter/morse-converter";

export const metadata: Metadata = {
	title: "Conversor de Código Morse Online Grátis | Ferramenta Ninja",
	description:
		"Converta texto para código Morse e código Morse para texto. Suporte a letras, números e pontuação. Ferramenta gratuita, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o código Morse?
				</h2>
				<p>
					O código Morse é um sistema de codificação que representa letras,
					números e sinais de pontuação por meio de sequências de pulsos curtos
					(pontos, <strong className="text-foreground">·</strong>) e longos
					(traços, <strong className="text-foreground">−</strong>). Foi
					desenvolvido por Samuel Morse e Alfred Vail na década de 1830 para uso
					no telégrafo elétrico, e se tornou o principal meio de comunicação à
					distância durante décadas.
				</p>
				<p className="mt-3">
					Mesmo com a chegada das comunicações digitais, o código Morse ainda é
					utilizado na aviação, radioamadorismo, comunicações de emergência e
					como forma de acessibilidade para pessoas com mobilidade reduzida.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Texto → Morse
						</h3>
						<ol className="list-decimal space-y-1 pl-6">
							<li>Digite ou cole o texto no campo de entrada.</li>
							<li>
								Clique em{" "}
								<strong className="text-foreground">Texto → Morse</strong>.
							</li>
							<li>
								As letras serão separadas por espaço e as palavras pelo símbolo{" "}
								<code className="text-foreground">/</code>.
							</li>
						</ol>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Morse → Texto
						</h3>
						<ol className="list-decimal space-y-1 pl-6">
							<li>Cole o código Morse no campo de entrada.</li>
							<li>
								Separe as letras com espaço e as palavras com{" "}
								<code className="text-foreground">/</code> (com ou sem espaço ao
								redor).
							</li>
							<li>
								Clique em{" "}
								<strong className="text-foreground">Morse → Texto</strong>.
							</li>
						</ol>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tabela de referência
				</h2>
				<p className="mb-4">
					Confira abaixo os códigos Morse para letras e números, conforme o
					padrão ITU:
				</p>
				<div className="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
					{[
						["A", ".-"],
						["B", "-..."],
						["C", "-.-."],
						["D", "-.."],
						["E", "."],
						["F", "..-."],
						["G", "--."],
						["H", "...."],
						["I", ".."],
						["J", ".---"],
						["K", "-.-"],
						["L", ".-.."],
						["M", "--"],
						["N", "-."],
						["O", "---"],
						["P", ".--."],
						["Q", "--.-"],
						["R", ".-."],
						["S", "..."],
						["T", "-"],
						["U", "..-"],
						["V", "...-"],
						["W", ".--"],
						["X", "-..-"],
						["Y", "-.--"],
						["Z", "--.."],
						["0", "-----"],
						["1", ".----"],
						["2", "..---"],
						["3", "...--"],
						["4", "....-"],
						["5", "....."],
						["6", "-...."],
						["7", "--..."],
						["8", "---.."],
						["9", "----."],
					].map(([char, code]) => (
						<div
							key={char}
							className="flex items-center gap-3 border-b border-border/40 py-1"
						>
							<span className="w-6 font-semibold text-foreground">{char}</span>
							<code className="font-mono">{code}</code>
						</div>
					))}
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Radioamadorismo:</strong>{" "}
						operadores de rádio amador (hams) utilizam o código Morse como forma
						de comunicação em frequências de ondas curtas. A habilidade de
						enviar e receber Morse é valorizada em situações de emergência e em
						competições de rádio.
					</p>
					<p>
						<strong className="text-foreground">
							Comunicações de emergência:
						</strong>{" "}
						o sinal internacional de socorro SOS (
						<code className="text-foreground">... --- ...</code>) é transmitido
						em código Morse e reconhecido globalmente, mesmo sem equipamentos
						sofisticados.
					</p>
					<p>
						<strong className="text-foreground">Acessibilidade:</strong>{" "}
						dispositivos modernos permitem que pessoas com mobilidade reduzida
						se comuniquem por meio do código Morse, utilizando piscar de olhos,
						sopros ou outros sinais como entrada.
					</p>
					<p>
						<strong className="text-foreground">Aprendizado e história:</strong>{" "}
						aprender código Morse é uma forma de se conectar com a história das
						telecomunicações e entender como informações eram transmitidas antes
						da era digital.
					</p>
					<p>
						<strong className="text-foreground">Desafios e CTFs:</strong> o
						código Morse é frequentemente utilizado em desafios de programação,
						Capture the Flag e puzzles de segurança como método de ofuscação de
						mensagens.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quais caracteres são suportados?
						</h3>
						<p>
							A ferramenta suporta todas as letras do alfabeto latino (A–Z, sem
							distinção entre maiúsculas e minúsculas), os dígitos de 0 a 9 e os
							principais sinais de pontuação definidos pelo padrão ITU: ponto,
							vírgula, interrogação, exclamação, aspas, parênteses, barra,
							hífen, sinal de mais, arroba, entre outros.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como separar letras e palavras no código Morse?
						</h3>
						<p>
							Letras dentro de uma mesma palavra são separadas por um espaço
							simples. Palavras diferentes são separadas pelo símbolo{" "}
							<code className="text-foreground">/</code>, com ou sem espaço ao
							redor. Por exemplo:{" "}
							<code className="text-foreground">
								.... --- .-.. .- / -- ..- -. -.. ---
							</code>{" "}
							representa "HOLA MUNDO".
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa SOS em Morse?
						</h3>
						<p>
							SOS é o sinal internacional de socorro. Em Morse:{" "}
							<code className="text-foreground">... --- ...</code>. A sequência
							foi escolhida por ser simples e inconfundível, não por ser uma
							abreviação de uma frase específica.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A ferramenta suporta letras acentuadas?
						</h3>
						<p>
							O padrão ITU de código Morse não define códigos para letras
							acentuadas do português, como ã, ç, é ou ô. Por isso, recomenda-se
							substituir letras acentuadas pelas suas versões sem acento antes
							de converter para Morse.
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

export default function CodigoMorsePage() {
	return (
		<PageLayout
			title="Conversor de Código Morse Online Grátis"
			description="Converta texto para código Morse e código Morse para texto. Suporte a letras, números e pontuação conforme o padrão ITU."
			extraContent={<SeoContent />}
		>
			<MorseConverter />
		</PageLayout>
	);
}
