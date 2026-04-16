import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { WifiQR } from "@/components/tools/wifi-qr/wifi-qr";

export const metadata: Metadata = {
	title: "Gerador de QR Code Wi-Fi Online Grátis | Ferramenta Ninja",
	description:
		"Gere QR Codes para compartilhar sua rede Wi-Fi sem digitar senha. Suporte a WPA, WPA2, WPA3, WEP e redes abertas. Gratuito, sem cadastro.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um QR Code de Wi-Fi?
				</h2>
				<p>
					Um QR Code de Wi-Fi armazena as credenciais de uma rede sem fio — nome
					(SSID), senha e tipo de segurança — em um formato padronizado que
					smartphones reconhecem automaticamente. Ao escanear o código com a
					câmera do celular, o dispositivo se conecta à rede sem que o usuário
					precise digitar nada.
				</p>
				<p className="mt-3">
					O formato é amplamente suportado no Android (desde a versão 10) e no
					iOS (desde o iOS 11 com a câmera nativa). Em versões mais antigas,
					aplicativos de leitura de QR Code também reconhecem e configuram a
					conexão automaticamente.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Como usar</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>
						Informe o nome exato da rede Wi-Fi (SSID), incluindo maiúsculas e
						minúsculas.
					</li>
					<li>
						Selecione o tipo de segurança da rede (WPA/WPA2 é o mais comum).
					</li>
					<li>Digite a senha da rede, se houver.</li>
					<li>Marque a opção de rede oculta, se aplicável.</li>
					<li>
						Clique em <strong className="text-foreground">Gerar QR Code</strong>{" "}
						e baixe a imagem.
					</li>
					<li>Imprima ou exiba o QR Code para seus convidados escanearem.</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Estabelecimentos e eventos:
						</strong>{" "}
						restaurantes, cafés, hotéis e espaços de coworking podem imprimir o
						QR Code e afixá-lo em locais visíveis, facilitando o acesso de
						clientes e visitantes à rede Wi-Fi.
					</p>
					<p>
						<strong className="text-foreground">Residências:</strong> crie um QR
						Code para sua rede doméstica e cole na geladeira, na entrada ou em
						um porta-retrato — seus convidados se conectam instantaneamente, sem
						precisar perguntar a senha.
					</p>
					<p>
						<strong className="text-foreground">Escritórios:</strong>{" "}
						simplifique o onboarding de novos colaboradores e visitantes com um
						QR Code da rede de convidados impresso na recepção.
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
							A senha fica armazenada em algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre diretamente no seu navegador. A
							senha da rede nunca é enviada a nenhum servidor — ela é
							incorporada ao QR Code localmente e não sai do seu dispositivo.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual tipo de segurança devo selecionar?
						</h3>
						<p>
							A maioria das redes domésticas e corporativas usa{" "}
							<strong className="text-foreground">WPA / WPA2 / WPA3</strong>.
							Verifique nas configurações do seu roteador. Redes antigas podem
							usar WEP, e redes abertas (sem senha) devem usar a opção "Sem
							senha".
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que é uma rede oculta?
						</h3>
						<p>
							Redes ocultas não transmitem o nome (SSID) publicamente. Para que
							o QR Code funcione corretamente com redes ocultas, marque a opção
							correspondente — o código incluirá essa informação para que o
							dispositivo encontre a rede.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O QR Code funciona em qualquer celular?
						</h3>
						<p>
							Android 10+ e iOS 11+ reconhecem o formato nativamente pela
							câmera. Em versões anteriores, utilize qualquer aplicativo de
							leitura de QR Code disponível nas lojas.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeQrCodeWifiPage() {
	return (
		<PageLayout
			title="Gerador de QR Code Wi-Fi"
			description="Compartilhe sua rede Wi-Fi sem digitar senha. Gere um QR Code que conecta qualquer celular automaticamente ao escanear."
			relatedTools={<RelatedTools currentHref="/ferramentas/gerador-de-qr-code-wifi" />}
			extraContent={<SeoContent />}
		>
			<WifiQR />
		</PageLayout>
	);
}
