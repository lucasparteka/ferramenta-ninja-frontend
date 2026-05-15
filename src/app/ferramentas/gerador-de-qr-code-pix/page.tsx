import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CustomQrCode } from "@/components/tools/custom-qr-code/custom-qr-code";

export const metadata: Metadata = {
	title: "Gerador de QR Code PIX | Ferramenta Ninja",
	description:
		"Crie QR codes PIX gratuitos e válidos para pagamento. Suporte a CPF, CNPJ, celular, e-mail e chave aleatória. Padrão EMV do Banco Central.",
	keywords: [
		"qr code pix",
		"gerador qr code pix",
		"qr code pix grátis",
		"criar qr code pix",
		"qr pix pagamento",
		"qr code pix cnpj cpf",
	],
};

const faq = [
	{
		question: "O QR Code PIX gerado aqui é válido para pagamento?",
		answer:
			"Sim. O payload segue o padrão EMV QR Code definido pelo Banco Central do Brasil e é aceito por todos os bancos e carteiras digitais que operam o PIX.",
	},
	{
		question: "Quais tipos de chave PIX são suportados?",
		answer:
			"Suportamos CPF, CNPJ, número de celular, e-mail e chave aleatória (EVP). Selecione o tipo correto e informe a chave no campo indicado.",
	},
	{
		question: "Posso definir um valor fixo no QR Code?",
		answer:
			"Sim. Preencha o campo 'Valor' com o valor desejado (ex: 10,50). Deixe em branco para criar um QR Code de valor aberto, onde o pagador define o valor.",
	},
	{
		question: "O QR Code PIX expira?",
		answer:
			"Não. QR codes estáticos gerados aqui não expiram. Eles são diferentes dos QR codes dinâmicos gerados pelos bancos para cobranças com vencimento.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar um QR Code PIX
				</h2>
				<p>
					Selecione o tipo de chave PIX (CPF, CNPJ, celular, e-mail ou chave
					aleatória), informe a chave, o nome do beneficiário e a cidade.
					Opcionalmente, defina um valor e uma descrição. O QR Code é gerado
					instantaneamente e pode ser impresso ou compartilhado digitalmente.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Casos de uso comuns
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Cobranças recorrentes com valor fixo:</strong> crie um QR
						Code com o valor já definido para mensalidades, assinaturas ou
						serviços.
					</li>
					<li>
						<strong>Balcão e ponto de venda:</strong> imprima e afixe o QR Code
						para que clientes paguem rapidamente sem precisar digitar a chave.
					</li>
					<li>
						<strong>Vaquinhas e doações:</strong> gere um QR de valor aberto e
						compartilhe o link ou imagem.
					</li>
					<li>
						<strong>Orçamentos e recibos:</strong> inclua o QR Code em PDFs para
						facilitar o pagamento imediato.
					</li>
				</ul>
			</section>
		</>
	);
}

export default function GeradorQrCodePixPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-qr-code-pix"
			title="Gerador de QR Code PIX"
			description="Crie QR codes PIX válidos para pagamento com CPF, CNPJ, celular, e-mail ou chave aleatória. Exporte em PNG, JPG ou SVG."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-pix" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<CustomQrCode initialTab="pix" />
		</PageLayout>
	);
}
