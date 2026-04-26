import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { DecodificadorPixClient } from "@/components/tools/decodificador-pix/decodificador-pix-client";

export const metadata: Metadata = {
	title: "Decodificador PIX Copia e Cola Online | Ferramenta Ninja",
	description:
		"Veja o destinatário, valor e chave PIX antes de pagar. Cole o código PIX Copia e Cola e descubra os dados do recebedor em segundos, direto no navegador.",
	keywords: [
		"decodificador pix",
		"pix copia e cola",
		"ler pix",
		"verificar pix",
		"validar pix",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o PIX Copia e Cola?
				</h2>
				<p>
					O PIX Copia e Cola é uma string de texto que contém os dados de uma
					cobrança PIX no formato{" "}
					<strong className="text-foreground">EMV BR Code</strong>, o mesmo
					padrão usado nos QR Codes de pagamento. Quando você recebe um código
					desse tipo, ele contém — em campos codificados — a chave do
					beneficiário, o valor cobrado, o nome da pessoa ou empresa, a cidade e
					um identificador único da transação (TxID).
				</p>
				<p className="mt-3">
					O problema: o texto em si não é legível para humanos. Este
					decodificador traduz o código em informações claras para que você
					confira os dados <strong>antes</strong> de pagar, evitando golpes de
					troca de cobrança.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o decodificador
				</h2>
				<ol className="mt-4 list-decimal space-y-2 pl-6">
					<li>
						Copie o código PIX recebido (em um e-mail, mensagem ou aplicativo).
					</li>
					<li>Cole no campo acima.</li>
					<li>
						Clique em <strong>Decodificar</strong>.
					</li>
					<li>
						Confira o beneficiário, valor e chave antes de abrir seu app do
						banco.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que o decodificador mostra
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Beneficiário:</strong> nome da
						pessoa ou empresa que receberá o pagamento.
					</li>
					<li>
						<strong className="text-foreground">Chave PIX:</strong> CPF, CNPJ,
						e-mail, telefone ou chave aleatória de quem vai receber.
					</li>
					<li>
						<strong className="text-foreground">Valor:</strong> quanto será
						cobrado (quando o valor estiver fixo no código).
					</li>
					<li>
						<strong className="text-foreground">Cidade e PSP:</strong>{" "}
						instituição que gerou o código.
					</li>
					<li>
						<strong className="text-foreground">TxID:</strong> identificador
						único da cobrança.
					</li>
					<li>
						<strong className="text-foreground">CRC:</strong> verificação de
						integridade — se o código foi alterado, o CRC não bate.
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
							O código PIX é enviado para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento acontece no seu navegador. O código
							colado nunca sai do seu computador ou celular.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar para verificar cobranças que recebi?
						</h3>
						<p>
							Sim, essa é a principal utilidade. Antes de pagar qualquer PIX
							Copia e Cola recebido por WhatsApp, e-mail ou SMS, cole aqui e
							confira se o nome do beneficiário e o valor batem com o que foi
							combinado.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que significa CRC inválido?
						</h3>
						<p>
							O CRC é um código de verificação no final da string. Se ele não
							bate com o conteúdo, o código foi alterado ou copiado
							parcialmente. Peça um novo código ao recebedor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Funciona com QR Code?
						</h3>
						<p>
							Funciona com o texto dentro do QR Code. Se você tem apenas a
							imagem, use primeiro o Leitor de QR Code da Ferramenta Ninja para
							extrair o texto e depois cole aqui.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function DecodificadorPixPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/decodificador-pix"
			title="Decodificador PIX Copia e Cola"
			description="Cole um código PIX e veja beneficiário, valor e chave antes de pagar. Tudo acontece no seu navegador."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/decodificador-pix" />
			}
			extraContent={<SeoContent />}
		>
			<DecodificadorPixClient />
		</PageLayout>
	);
}
