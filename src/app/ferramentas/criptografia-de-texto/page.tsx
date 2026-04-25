import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { TextCipher } from "@/components/tools/text-cipher/text-cipher";

export const metadata: Metadata = {
	title: "Criptografia de Texto Online Grátis | Ferramenta Ninja",
	description:
		"Cifre e decifre textos com AES-256-GCM, Base64 ou ROT13 diretamente no navegador. Sem cadastro, sem servidor — seus dados nunca saem do dispositivo.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é criptografia de texto?
				</h2>
				<p>
					Criptografia é o processo de transformar informações legíveis em um
					formato ilegível para quem não possui a chave de acesso. Ao cifrar um
					texto, você garante que apenas pessoas autorizadas — que conhecem a
					senha ou o método utilizado — consigam ler o conteúdo original.
				</p>
				<p className="mt-3">
					Esta ferramenta oferece três métodos: criptografia simétrica real com
					AES-256-GCM, codificação em Base64 e a clássica cifra de substituição
					ROT13. Cada um tem casos de uso distintos, descritos abaixo.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<ol className="list-decimal space-y-2 pl-6">
					<li>Cole ou digite o texto no campo de entrada.</li>
					<li>Escolha o algoritmo desejado no seletor.</li>
					<li>
						Se usar AES-256-GCM, informe uma senha. Guarde-a com segurança — sem
						ela, o texto não pode ser recuperado.
					</li>
					<li>
						Clique em <strong className="text-foreground">Cifrar</strong> para
						criptografar ou em{" "}
						<strong className="text-foreground">Decifrar</strong> para recuperar
						o texto original.
					</li>
					<li>
						Copie o resultado com o botão{" "}
						<strong className="text-foreground">Copiar</strong>.
					</li>
				</ol>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Algoritmos disponíveis
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							AES-256-GCM — criptografia com senha
						</h3>
						<p>
							O AES (Advanced Encryption Standard) com chave de 256 bits e modo
							GCM (Galois/Counter Mode) é um dos padrões de criptografia
							simétrica mais seguros disponíveis. É utilizado em aplicações
							bancárias, comunicações militares e sistemas de segurança ao redor
							do mundo.
						</p>
						<p className="mt-2">
							Nesta ferramenta, a senha é transformada em uma chave
							criptográfica usando PBKDF2 com 100.000 iterações e SHA-256, com
							salt aleatório a cada cifragem. O resultado é um texto em Base64
							que só pode ser decifrado com a mesma senha.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Base64 — codificação
						</h3>
						<p>
							Base64 não é criptografia — é uma codificação que representa dados
							binários usando apenas caracteres imprimíveis (letras, números e
							símbolos). É amplamente utilizado para transmitir dados em
							sistemas que aceitam apenas texto, como e-mails, URLs e APIs.
							Qualquer pessoa pode decodificar um texto em Base64 sem
							necessidade de senha.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							ROT13 — cifra de substituição
						</h3>
						<p>
							ROT13 é uma cifra de substituição simples que desloca cada letra
							13 posições no alfabeto. Por ser simétrica (aplicar ROT13 duas
							vezes retorna ao texto original), cifrar e decifrar são a mesma
							operação. É utilizado apenas para ofuscar texto levemente, sem
							qualquer garantia de segurança.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Casos de uso</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">
							Proteção de anotações sensíveis:
						</strong>{" "}
						cifre senhas, chaves de API, notas pessoais ou qualquer informação
						confidencial antes de armazená-las em locais menos seguros, como
						e-mails ou documentos compartilhados.
					</p>
					<p>
						<strong className="text-foreground">
							Compartilhamento seguro:
						</strong>{" "}
						envie textos cifrados por canais inseguros e compartilhe a senha por
						um meio diferente, garantindo que apenas o destinatário correto
						possa ler a mensagem.
					</p>
					<p>
						<strong className="text-foreground">
							Desenvolvimento e integração:
						</strong>{" "}
						use o Base64 para codificar payloads de API, tokens de autenticação
						ou dados binários que precisam ser transmitidos como texto.
					</p>
					<p>
						<strong className="text-foreground">Aprendizado e testes:</strong> o
						ROT13 é amplamente utilizado em comunidades online para ocultar
						spoilers e respostas de puzzles, e como exemplo didático de cifras
						de substituição.
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
							Meus dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Todo o processamento ocorre diretamente no seu navegador
							usando a Web Crypto API nativa. Nenhum texto, senha ou resultado é
							transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que acontece se eu esquecer a senha do AES?
						</h3>
						<p>
							O texto cifrado com AES-256-GCM não pode ser recuperado sem a
							senha correta. Não há backdoor, recuperação por e-mail nem forma
							de contornar a criptografia. Guarde a senha em um local seguro.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Base64 é uma forma segura de ocultar informações?
						</h3>
						<p>
							Não. Base64 é uma codificação reversível sem chave — qualquer
							pessoa pode decodificá-la instantaneamente. Use-o apenas para
							compatibilidade de formato, nunca como método de segurança.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso cifrar arquivos com esta ferramenta?
						</h3>
						<p>
							Esta ferramenta é destinada a textos. Para criptografar arquivos,
							utilize ferramentas específicas como VeraCrypt, GPG ou o recurso
							de criptografia do seu sistema operacional.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O AES-256-GCM gerado aqui é compatível com outras ferramentas?
						</h3>
						<p>
							O formato de saída (Base64 com salt, IV e texto cifrado
							concatenados) é específico desta ferramenta. Para
							interoperabilidade com outras bibliotecas, verifique o formato
							esperado e adapte a implementação conforme necessário.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CriptografiaDeTextoPage() {
	return (
		<PageLayout
			title="Criptografia de Texto Online Grátis"
			description="Cifre e decifre textos com AES-256-GCM, Base64 ou ROT13 diretamente no navegador. Seus dados nunca saem do dispositivo."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/criptografia-de-texto" />
			}
			extraContent={<SeoContent />}
		>
			<TextCipher />
		</PageLayout>
	);
}
