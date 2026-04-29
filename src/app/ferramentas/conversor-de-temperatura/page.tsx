import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TemperatureConverter } from "@/components/tools/temperature-converter/temperature-converter";

export const metadata: Metadata = {
	title: "Conversor de Temperatura Online | Ferramenta Ninja",
	description:
		"Converta temperaturas entre Celsius, Fahrenheit e Kelvin em tempo real. Ferramenta gratuita, rápida e fácil de usar.",
	keywords: [
		"conversor de temperatura",
		"celsius para fahrenheit",
		"fahrenheit para celsius",
		"kelvin para celsius",
		"converter graus",
		"temperatura online",
	],
};

const faq = [
	{
		question: "Como converter Celsius para Fahrenheit?",
		answer:
			"Use a fórmula: °F = (°C × 9/5) + 32. Por exemplo, 0°C = 32°F e 100°C = 212°F.",
	},
	{
		question: "Como converter Fahrenheit para Celsius?",
		answer:
			"Use a fórmula: °C = (°F − 32) × 5/9. Por exemplo, 32°F = 0°C e 212°F = 100°C.",
	},
	{
		question: "Qual é a fórmula de Celsius para Kelvin?",
		answer:
			"K = °C + 273.15. O zero absoluto é 0K, equivalente a −273,15°C.",
	},
	{
		question: "A conversão é precisa?",
		answer:
			"Sim. Os cálculos usam as fórmulas exatas de conversão térmica com precisão de até 4 casas decimais.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o conversor de temperatura
				</h2>
				<p>
					Nosso conversor de temperatura permite transformar valores entre as
					três escalas mais usadas no mundo: Celsius (°C), Fahrenheit (°F) e
					Kelvin (K). Basta digitar o valor, escolher a escala de origem e a
					escala de destino — o resultado aparece instantaneamente.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Fórmulas de conversão
				</h2>
				<div className="space-y-3">
					<p>As fórmulas utilizadas seguem os padrões científicos internacionais:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong>Celsius → Fahrenheit:</strong> °F = (°C × 9/5) + 32
						</li>
						<li>
							<strong>Fahrenheit → Celsius:</strong> °C = (°F − 32) × 5/9
						</li>
						<li>
							<strong>Celsius → Kelvin:</strong> K = °C + 273.15
						</li>
						<li>
							<strong>Kelvin → Celsius:</strong> °C = K − 273.15
						</li>
						<li>
							<strong>Fahrenheit → Kelvin:</strong> K = (°F − 32) × 5/9 + 273.15
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tabela de referência rápida
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-border">
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Celsius (°C)
								</th>
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Fahrenheit (°F)
								</th>
								<th className="px-3 py-2 text-left font-semibold text-foreground">
									Kelvin (K)
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-border">
								<td className="px-3 py-2">−273,15</td>
								<td className="px-3 py-2">−459,67</td>
								<td className="px-3 py-2">0</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">0</td>
								<td className="px-3 py-2">32</td>
								<td className="px-3 py-2">273,15</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">25</td>
								<td className="px-3 py-2">77</td>
								<td className="px-3 py-2">298,15</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">37</td>
								<td className="px-3 py-2">98,6</td>
								<td className="px-3 py-2">310,15</td>
							</tr>
							<tr className="border-b border-border">
								<td className="px-3 py-2">100</td>
								<td className="px-3 py-2">212</td>
								<td className="px-3 py-2">373,15</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</>
	);
}

export default function ConversorTemperaturaPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/conversor-de-temperatura"
			title="Conversor de Temperatura"
			description="Converta entre Celsius, Fahrenheit e Kelvin instantaneamente. Veja todas as escalas e as fórmulas usadas."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/conversor-de-temperatura" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<TemperatureConverter />
		</PageLayout>
	);
}
