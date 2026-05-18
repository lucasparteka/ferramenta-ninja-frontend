import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code Wi-Fi | Ferramenta Ninja",
	description:
		"Crie QR codes para compartilhar sua rede Wi-Fi sem revelar a senha. Suporte a WPA, WEP e redes abertas. Exporte em PNG, JPG ou SVG.",
	keywords: [
		"qr code wifi",
		"qr code wi-fi",
		"qr code conectar wifi",
		"compartilhar wifi qr code",
		"gerador qr wifi grátis",
		"qr code senha wifi",
	],
};

const faq = [
	{
		question: "Quais padrões de segurança Wi-Fi são suportados?",
		answer:
			"Suportamos WPA/WPA2 (o mais comum), WEP (redes mais antigas) e redes abertas sem senha. Selecione o tipo correto na opção 'Segurança'.",
	},
	{
		question: "O visitante verá minha senha ao escanear?",
		answer:
			"Não. O QR Code conecta o dispositivo diretamente à rede sem exibir a senha na tela. A senha fica codificada dentro do QR Code.",
	},
	{
		question: "Funciona em iPhone e Android?",
		answer:
			"Sim. A maioria dos smartphones modernos (iOS 11+ e Android 10+) consegue ler QR codes Wi-Fi e conectar automaticamente à rede sem nenhum app adicional.",
	},
	{
		question: "E se minha rede for oculta (SSID oculto)?",
		answer:
			"Marque a opção 'Rede oculta' antes de gerar. O QR Code incluirá o flag correto para que dispositivos encontrem a rede mesmo sem ela ser visível na lista.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code Wi-Fi
				</h2>
				<p>
					Informe o nome da rede (SSID), a senha e o tipo de segurança. O QR
					Code é gerado instantaneamente — imprima e cole na porta da sua
					empresa, recepção ou quarto de hóspede para que qualquer pessoa se
					conecte com um escaneamento, sem precisar digitar a senha.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Estabelecimentos comerciais:</strong> restaurantes, cafés e
						hotéis que oferecem Wi-Fi para clientes.
					</li>
					<li>
						<strong>Eventos e conferências:</strong> distribua o QR Code no
						crachá ou telão para todos se conectarem rapidamente.
					</li>
					<li>
						<strong>Escritórios:</strong> facilite o acesso de visitantes e
						novos funcionários sem revelar a senha corporativa verbalmente.
					</li>
					<li>
						<strong>Residências:</strong> crie um QR Code para a rede de
						hóspedes e cole na geladeira ou sala.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodeWifiPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code-wifi"
			title="Gerador de QR Code Wi-Fi"
			description="Crie QR codes para compartilhar sua rede Wi-Fi com um escaneamento. Personalize cores e estilos. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-wifi" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode initialTab="wifi" hideMode />
		</PageLayout>
	);
}
