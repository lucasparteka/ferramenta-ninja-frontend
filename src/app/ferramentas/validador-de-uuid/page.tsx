import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { UuidValidator } from "@/components/tools/uuid-generator/uuid-validator";

export const metadata: Metadata = {
	title: "Validador de UUID Online Grátis | Ferramenta Ninja",
	description:
		"Valide qualquer UUID online de forma instantânea. Detecta a versão (v1 a v7) e confirma se o formato segue o padrão RFC 4122. Funciona no navegador, sem enviar dados.",
	keywords: [
		"validar uuid",
		"validador de uuid",
		"uuid válido",
		"verificar uuid",
		"uuid versão",
		"rfc 4122",
		"uuid inválido",
		"checar uuid",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a validação de UUID?
				</h2>
				<p>
					Um UUID (Universally Unique Identifier) segue o padrão RFC 4122 e é
					representado como uma sequência de 32 dígitos hexadecimais no formato{" "}
					<code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code> — 8-4-4-4-12
					caracteres separados por hífens.
				</p>
				<p className="mt-3">
					Além do formato, cada versão reserva bits específicos para indicar a
					versão (bits 12–15 do terceiro grupo) e a variante (bits mais
					significativos do quarto grupo). O validador verifica tanto o formato
					quanto esses bits para determinar se o UUID é válido e qual versão ele
					representa.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve um validador de UUID?
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Debug de integrações:</strong>{" "}
						confirme se um UUID recebido de uma API externa está bem formado
						antes de usá-lo como chave em banco de dados ou em chamadas
						subsequentes.
					</p>
					<p>
						<strong className="text-foreground">Testes de QA:</strong> verifique
						se os identificadores gerados pelo seu sistema seguem o padrão
						correto e a versão esperada.
					</p>
					<p>
						<strong className="text-foreground">Diagnóstico de erros:</strong>{" "}
						quando um sistema rejeita um UUID, use o validador para distinguir
						entre problemas de formato, versão incorreta ou valor malformado.
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
							O validador detecta a versão do UUID?
						</h3>
						<p>
							Sim. Ao validar um UUID, o resultado indica a versão detectada (v1
							a v7) com base nos bits reservados do padrão RFC 4122. Isso permite
							confirmar não apenas se o UUID é válido, mas também se é da versão
							esperada pela sua aplicação.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID nil (todos zeros) é considerado válido?
						</h3>
						<p>
							O UUID nil (
							<code>00000000-0000-0000-0000-000000000000</code>) segue o formato
							correto, mas não possui uma versão definida segundo o RFC 4122. O
							comportamento de validação depende da biblioteca usada — algumas
							aceitam, outras rejeitam. Este validador usa a biblioteca{" "}
							<code>uuid</code> do npm como referência.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O validador aceita UUID em maiúsculas?
						</h3>
						<p>
							Sim. O padrão RFC 4122 define o formato em letras minúsculas, mas
							UUIDs em maiúsculas são amplamente aceitos na prática. O validador
							trata ambas as formas como equivalentes.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a validação ocorre diretamente no seu navegador. Nenhum
							UUID digitado é transmitido ou armazenado em qualquer servidor.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ValidadorDeUuidPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/validador-de-uuid"
			title="Validador de UUID Online"
			description="Valide qualquer UUID instantaneamente e descubra sua versão. Aceita v1 a v7, verifica o padrão RFC 4122 e funciona direto no navegador, sem enviar dados."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/validador-de-uuid" />
			}
			extraContent={<SeoContent />}
		>
			<UuidValidator />
		</PageLayout>
	);
}
