import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { UuidGenerator } from "@/components/tools/uuid-generator/uuid-generator";
import { UuidValidator } from "@/components/tools/uuid-generator/uuid-validator";

export const metadata: Metadata = {
	title: "Gerador de UUID Online Grátis | Ferramenta Ninja",
	description:
		"Gere UUIDs únicos nas versões v1, v3, v4 e v5 e valide UUIDs existentes. Ferramenta gratuita, sem cadastro, funciona diretamente no navegador.",
	keywords: [
		"gerador de uuid",
		"uuid online",
		"gerar uuid",
		"uuid v4",
		"uuid v1",
		"uuid v3",
		"uuid v5",
		"validar uuid",
		"unique identifier",
		"guid generator",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um UUID?
				</h2>
				<p>
					UUID (Universally Unique Identifier) é um identificador de 128 bits
					padronizado pela RFC 4122, representado como uma sequência de 32
					caracteres hexadecimais no formato{" "}
					<code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>. É amplamente
					utilizado em sistemas de software para identificar recursos de forma
					única, sem necessidade de um servidor central de coordenação.
				</p>
				<p className="mt-3">
					A probabilidade de dois UUIDs gerados independentemente serem
					idênticos é tão baixa que, na prática, é considerada impossível. Por
					isso, UUIDs são ideais para identificar registros em bancos de dados,
					sessões de usuário, transações, arquivos e qualquer outra entidade que
					precise de um identificador global único.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Diferenças entre as versões
				</h2>
				<div className="space-y-4">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID v1 — baseado em data/hora
						</h3>
						<p>
							Gerado a partir do timestamp atual e do endereço MAC da máquina.
							Garante unicidade cronológica, mas pode expor informações sobre a
							máquina e o momento da geração. Menos utilizado em aplicações
							modernas por questões de privacidade.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID v3 — baseado em namespace (MD5)
						</h3>
						<p>
							Gerado a partir de um namespace e um nome usando o algoritmo de
							hash MD5. O mesmo par namespace + nome sempre produz o mesmo UUID,
							tornando-o determinístico. Útil quando você precisa de um
							identificador estável para um recurso conhecido, como uma URL ou
							nome de domínio.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID v4 — aleatório
						</h3>
						<p>
							Completamente aleatório, exceto por alguns bits reservados para
							indicar a versão. É a versão mais utilizada na prática por ser
							simples, rápida e não depender de nenhuma informação externa.
							Ideal para identificadores de sessão, registros de banco de dados
							e qualquer caso em que a aleatoriedade é suficiente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID v5 — baseado em namespace (SHA-1)
						</h3>
						<p>
							Semelhante ao v3, mas usa o algoritmo SHA-1 em vez de MD5,
							oferecendo maior resistência a colisões. Também é determinístico:
							o mesmo namespace e nome sempre resultam no mesmo UUID. Preferível
							ao v3 quando a qualidade do hash importa.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Quando usar cada versão?
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full border border-gray-200 text-sm text-left">
						<thead className="bg-gray-100">
							<tr>
								<th className="border border-gray-200 px-4 py-2">Versão</th>
								<th className="border border-gray-200 px-4 py-2">
									Determinístico?
								</th>
								<th className="border border-gray-200 px-4 py-2">
									Quando usar
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border border-gray-200 px-4 py-2 font-mono">
									v1
								</td>
								<td className="border border-gray-200 px-4 py-2">Não</td>
								<td className="border border-gray-200 px-4 py-2">
									Logs com ordem cronológica garantida
								</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2 font-mono">
									v3
								</td>
								<td className="border border-gray-200 px-4 py-2">Sim (MD5)</td>
								<td className="border border-gray-200 px-4 py-2">
									Identificadores estáveis para recursos conhecidos
								</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2 font-mono">
									v4
								</td>
								<td className="border border-gray-200 px-4 py-2">Não</td>
								<td className="border border-gray-200 px-4 py-2">
									Uso geral: banco de dados, sessões, arquivos
								</td>
							</tr>
							<tr>
								<td className="border border-gray-200 px-4 py-2 font-mono">
									v5
								</td>
								<td className="border border-gray-200 px-4 py-2">
									Sim (SHA-1)
								</td>
								<td className="border border-gray-200 px-4 py-2">
									Identificadores estáveis com hash mais seguro que o v3
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID e GUID são a mesma coisa?
						</h3>
						<p>
							Na prática, sim. GUID (Globally Unique Identifier) é o nome usado
							pela Microsoft para o mesmo conceito. Ambos seguem o mesmo padrão
							de 128 bits e são intercambiáveis na maioria dos contextos.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os UUIDs gerados são enviados para algum servidor?
						</h3>
						<p>
							Não. Toda a geração acontece diretamente no seu navegador usando a
							API nativa do JavaScript. Nenhum dado é transmitido ou armazenado
							externamente.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O que é o namespace no UUID v3 e v5?
						</h3>
						<p>
							O namespace é um UUID que define o contexto do identificador. Os
							namespaces predefinidos são DNS (para nomes de domínio) e URL
							(para endereços web). Você também pode usar um UUID personalizado
							como namespace para criar um espaço de nomes próprio para sua
							aplicação.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							UUID v4 pode colidir com outro UUID gerado?
						</h3>
						<p>
							Teoricamente sim, mas a probabilidade é astronomicamente baixa.
							Para gerar uma colisão, seriam necessários cerca de 2,7
							quatrilhões de UUIDs. Na prática, colisões são consideradas
							impossíveis para qualquer sistema real.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como usar UUID em banco de dados?
						</h3>
						<p>
							UUIDs podem ser usados como chaves primárias em tabelas. A maioria
							dos bancos de dados modernos (PostgreSQL, MySQL, SQLite, MongoDB)
							oferece suporte nativo a UUIDs. O v4 é a versão mais comum para
							esse caso de uso por ser simples e completamente aleatório.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function GeradorDeUuidPage() {
	return (
		<PageLayout
			title="Gerador de UUID Online"
			description="Gere UUIDs únicos nas versões v1, v3, v4 e v5 ou valide um UUID existente. Tudo funciona diretamente no navegador, sem enviar dados a nenhum servidor."
			extraContent={<SeoContent />}
		>
			<div className="space-y-8">
				<div>
					<h2 className="mb-5 text-lg font-semibold text-foreground">
						Gerar UUID
					</h2>
					<UuidGenerator />
				</div>
				<div className="border-t border-border pt-8">
					<h2 className="mb-5 text-lg font-semibold text-foreground">
						Validar UUID
					</h2>
					<UuidValidator />
				</div>
			</div>
		</PageLayout>
	);
}
