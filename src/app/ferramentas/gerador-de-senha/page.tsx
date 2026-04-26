import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { PasswordGenerator } from "@/components/tools/password-generator/password-generator";

export const metadata: Metadata = {
	title: "Gerador de Senha Online Gratuito | Ferramenta Ninja",
	description:
		"Gere senhas seguras e aleatórias com um clique. Personalize o tamanho e os tipos de caracteres. Ferramenta gratuita, sem cadastro, funciona no navegador.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é uma senha forte?
				</h2>
				<p>
					Uma senha forte combina diferentes tipos de caracteres para dificultar
					tentativas de invasão. Os principais fatores que determinam a força de
					uma senha são:
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-6">
					<li>
						<strong className="text-foreground">Comprimento:</strong> senhas
						mais longas são exponencialmente mais difíceis de quebrar. O mínimo
						recomendado é 12 caracteres.
					</li>
					<li>
						<strong className="text-foreground">Variedade:</strong> misturar
						letras maiúsculas, minúsculas, números e símbolos aumenta
						drasticamente o número de combinações possíveis.
					</li>
					<li>
						<strong className="text-foreground">Aleatoriedade:</strong> evite
						palavras do dicionário, datas de nascimento ou sequências
						previsíveis como "123456".
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que a segurança de senhas é importante?
				</h2>
				<div className="space-y-3">
					<p>
						Senhas fracas são a principal causa de invasões de contas. Com
						ferramentas modernas, um atacante pode testar bilhões de combinações
						por segundo. Uma senha de 8 caracteres apenas com letras minúsculas
						pode ser quebrada em minutos.
					</p>
					<p>
						Já uma senha gerada aleatoriamente com 16 caracteres misturando
						letras, números e símbolos levaria centenas de anos para ser
						descoberta por força bruta, mesmo com hardware avançado.
					</p>
					<p>
						Além disso, vazamentos de dados são frequentes. Se você reutiliza a
						mesma senha em vários sites, um único vazamento compromete todas as
						suas contas.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Dicas para criar e gerenciar senhas seguras
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Use uma senha diferente para cada serviço ou site.</li>
					<li>
						Prefira senhas com pelo menos 16 caracteres para contas importantes.
					</li>
					<li>
						Utilize um gerenciador de senhas para armazenar e organizar suas
						credenciais.
					</li>
					<li>Ative a autenticação em dois fatores sempre que disponível.</li>
					<li>Nunca compartilhe senhas por e-mail, mensagem ou papel.</li>
					<li>
						Troque imediatamente senhas de contas que sofreram vazamento de
						dados.
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
							O que é uma senha forte?
						</h3>
						<p>
							Uma senha forte tem pelo menos 12 caracteres e combina letras
							maiúsculas, minúsculas, números e símbolos. Ela não deve conter
							palavras comuns, nomes ou datas previsíveis.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Quantos caracteres uma senha segura deve ter?
						</h3>
						<p>
							Para uso geral, recomenda-se pelo menos 12 caracteres. Para contas
							críticas como banco ou e-mail principal, prefira 16 ou mais
							caracteres.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar a mesma senha em vários sites?
						</h3>
						<p>
							Não. Se um site sofrer vazamento, todas as contas onde você usa a
							mesma senha ficam expostas. Use sempre senhas únicas para cada
							serviço.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							As senhas geradas são armazenadas?
						</h3>
						<p>
							Não. Todo o processo acontece diretamente no seu navegador.
							Nenhuma senha gerada é enviada ou salva em qualquer servidor.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como a aleatoriedade das senhas é garantida?
						</h3>
						<p>
							Esta ferramenta usa a API <code>crypto.getRandomValues</code> do
							navegador, que fornece aleatoriedade criptograficamente segura, ao
							contrário do <code>Math.random</code> comum.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeSenhaPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-de-senha"
			title="Gerador de Senha"
			description="Crie senhas seguras e aleatórias em segundos. Configure o tamanho e os tipos de caracteres conforme sua necessidade."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-de-senha" />
			}
			extraContent={<SeoContent />}
		>
			<PasswordGenerator />
		</PageLayout>
	);
}
