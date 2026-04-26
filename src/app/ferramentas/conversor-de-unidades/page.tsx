import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { UnitConverterClient } from "@/components/tools/unit-converter/unit-converter-client";

export const metadata: Metadata = {
	title: "Conversor de Unidades Online | Ferramenta Ninja",
	description:
		"Converta comprimento, massa, volume, área, tempo, velocidade, temperatura e armazenamento de dados online, gratuitamente. Resultados instantâneos no navegador.",
	keywords: [
		"conversor de unidades",
		"converter medidas",
		"metro para pé",
		"kg para libra",
		"celsius fahrenheit",
		"litro para galão",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o conversor de unidades
				</h2>
				<p>
					Ferramenta para converter qualquer unidade de medida em outra
					instantaneamente: comprimento, massa, volume, área, tempo, velocidade,
					temperatura e armazenamento digital. Tudo é processado no navegador,
					sem envio de dados.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Categorias suportadas
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Comprimento:</strong> mm, cm, m, km, polegada, pé, jarda,
						milha, milha náutica.
					</li>
					<li>
						<strong>Massa:</strong> mg, g, kg, tonelada, onça, libra.
					</li>
					<li>
						<strong>Volume:</strong> ml, l, m³, galão (US/UK), xícara, colher.
					</li>
					<li>
						<strong>Área:</strong> mm², cm², m², hectare, km², ft², acre,
						alqueire.
					</li>
					<li>
						<strong>Tempo:</strong> ms, s, min, h, dia, semana, mês, ano.
					</li>
					<li>
						<strong>Velocidade:</strong> m/s, km/h, mph, ft/s, nó.
					</li>
					<li>
						<strong>Temperatura:</strong> Celsius, Fahrenheit, Kelvin.
					</li>
					<li>
						<strong>Armazenamento:</strong> bit, byte, KB, MB, GB, TB e
						equivalentes binários (KiB, MiB, GiB, TiB).
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os cálculos são precisos?
						</h3>
						<p>
							Sim. Os fatores de conversão seguem padrões internacionais (SI e
							equivalências oficiais). A precisão é mantida até 6 casas
							decimais.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso converter entre Celsius e Fahrenheit?
						</h3>
						<p>
							Sim, basta escolher a categoria Temperatura. As escalas Celsius,
							Fahrenheit e Kelvin estão suportadas.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Funciona offline?
						</h3>
						<p>
							Após a página carregar, o conversor funciona totalmente offline —
							nada é enviado para servidores.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function UnitConverterPage() {
	return (
		<PageLayout
			title="Conversor de Unidades Online"
			description="Converta unidades de medida em segundos: comprimento, massa, volume, temperatura e mais."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/conversor-de-unidades" />
			}
			extraContent={<SeoContent />}
		>
			<UnitConverterClient />
		</PageLayout>
	);
}
