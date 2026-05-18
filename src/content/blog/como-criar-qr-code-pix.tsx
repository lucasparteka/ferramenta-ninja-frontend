import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog-posts";

const meta = {
	slug: "como-criar-qr-code-pix",
	title: "Como criar QR Code PIX para receber pagamentos (2026)",
	description:
		"Aprenda a gerar seu QR Code PIX de graça, entenda a diferença entre QR estático e dinâmico e veja como usar o código no dia a dia como MEI, autônomo ou pequeno negócio.",
	publishedAt: "2026-05-18",
	updatedAt: "2026-05-18",
	author: "Equipe Ferramenta Ninja",
	category: "QR Code",
	relatedTools: ["/ferramentas/gerador-de-qr-code-pix"],
};

const H2 = "mb-3 mt-10 text-2xl font-bold text-foreground";
const H3 = "mb-2 mt-6 text-lg font-semibold text-foreground";
const TABLE = "my-4 w-full border-collapse text-sm";
const TH =
	"border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground";
const TD = "border border-border px-3 py-2 text-foreground";

function PostBody() {
	return (
		<>
			<p>
				Você está atendendo um cliente, ele pergunta como vai pagar e você
				precisa passar sua chave PIX verbalmente, e ele ainda digita errado na
				primeira tentativa. É uma cena comum. O QR Code PIX resolve isso de
				forma simples: você gera uma imagem, o cliente aponta o celular, confirma
				o valor e pronto. Sem chave digitada na mão, sem erro de número de
				telefone.
			</p>
			<p>
				Mas muita gente ainda não sabe como gerar esse código, qual a diferença
				entre os tipos de QR, nem quando usar cada um. Neste artigo, você vai
				entender tudo isso: do básico até os casos de uso mais comuns para quem
				trabalha por conta própria ou tem um pequeno negócio.
			</p>

			<h2 className={H2}>O que é o QR Code PIX?</h2>
			<p>
				O QR Code PIX é uma imagem gerada a partir das informações de uma chave
				PIX cadastrada no Banco Central. Quando alguém escaneia esse código com
				o aplicativo do banco, os dados de pagamento são preenchidos
				automaticamente: beneficiário, chave, valor (quando configurado) e
				descrição.
			</p>
			<p>
				O PIX foi lançado pelo Banco Central em novembro de 2020 e virou o meio
				de pagamento mais usado no Brasil. Em 2025, o sistema processou mais de
				60 bilhões de transações. O QR Code é uma das formas de acessar o PIX,
				junto da chave digitada, do PIX copia e cola e do NFC.
			</p>
			<p>
				A tecnologia segue o padrão EMVCo, o mesmo dos QR Codes de cartão de
				débito e crédito no mundo todo. O Banco Central definiu as regras de como
				o payload, ou seja, o conteúdo codificado na imagem, deve ser estruturado. Por
				isso, qualquer banco ou carteira digital consegue ler o QR de qualquer
				outro banco.
			</p>

			<h2 className={H2}>O que você precisa ter antes de gerar o QR</h2>
			<p>
				Para criar um QR Code PIX, você precisa ter uma chave PIX cadastrada em
				alguma instituição financeira. A chave é o identificador que associa o QR
				ao seu CPF ou CNPJ no sistema do Banco Central.
			</p>
			<p>Existem quatro tipos de chave disponíveis:</p>
			<table className={TABLE}>
				<thead>
					<tr>
						<th className={TH}>Tipo de chave</th>
						<th className={TH}>Quando usar</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={TD}>CPF ou CNPJ</td>
						<td className={TD}>
							Mais usada por pessoas físicas e empresas. Não muda, é fácil de
							lembrar.
						</td>
					</tr>
					<tr>
						<td className={TD}>Número de celular</td>
						<td className={TD}>
							Precisa estar associado ao seu CPF. Muda se você trocar de número.
						</td>
					</tr>
					<tr>
						<td className={TD}>E-mail</td>
						<td className={TD}>
							Útil para quem prefere não compartilhar CPF ou telefone.
						</td>
					</tr>
					<tr>
						<td className={TD}>Chave aleatória (EVP)</td>
						<td className={TD}>
							Sequência gerada automaticamente. Boa opção para quem quer
							privacidade.
						</td>
					</tr>
				</tbody>
			</table>
			<p>
				Você pode cadastrar até 5 chaves por CPF (pessoa física) e até 20 por
				CNPJ (pessoa jurídica). O cadastro é feito no app do banco, no menu PIX.
			</p>

			<h2 className={H2}>QR Code estático x QR Code dinâmico</h2>
			<p>
				Essa é a diferença mais importante de entender antes de gerar o código.
			</p>

			<h3 className={H3}>QR Code estático</h3>
			<p>
				O QR estático é uma imagem fixa gerada a partir da sua chave PIX. Você
				pode deixar o valor em aberto (o pagador digita o valor na hora) ou
				pré-definir um valor fixo, útil para produtos com preço único.
			</p>
			<p>
				É o tipo mais simples e funciona bem para a maioria dos casos do dia a
				dia: atendimento presencial, cobrança informal, pessoas físicas e MEIs
				que não precisam de conciliação automática.
			</p>
			<p>
				A limitação é que o código é sempre o mesmo. Se você tem dez clientes
				comprando ao mesmo tempo, todos pagam para o mesmo QR, o que dificulta
				identificar qual pagamento corresponde a qual venda sem um controle
				manual.
			</p>

			<h3 className={H3}>QR Code dinâmico</h3>
			<p>
				O QR dinâmico é gerado por transação: um código diferente para cada
				cobrança. Ele pode conter o valor exato, data de vencimento, nome do
				pagador e campos para conciliação automática.
			</p>
			<p>
				É indicado para e-commerce, sistemas de gestão e negócios que precisam
				rastrear cada pagamento individualmente. A limitação é que ele não pode
				ser gerado manualmente: para isso você precisa de acesso à API PIX de uma
				instituição financeira ou de uma plataforma de cobrança integrada.
			</p>
			<p>
				Para a maioria dos autônomos e pequenos negócios, o QR estático já
				resolve bem.
			</p>

			<h2 className={H2}>Como gerar seu QR Code PIX passo a passo</h2>

			<h3 className={H3}>Passo 1: Reúna as informações</h3>
			<p>Antes de gerar, tenha em mãos:</p>
			<ul className="list-disc space-y-1 pl-6">
				<li>Sua chave PIX (CPF, telefone, e-mail ou chave aleatória)</li>
				<li>
					O nome do beneficiário, como vai aparecer para o pagador; pode ser seu
					nome ou o do seu negócio
				</li>
				<li>A cidade onde a conta está cadastrada</li>
				<li>
					O valor, opcional para QR estático; se deixar em branco, o pagador
					digita
				</li>
				<li>
					Uma descrição ou identificador da cobrança (opcional, mas útil para
					organização)
				</li>
			</ul>

			<h3 className={H3}>Passo 2: Acesse a ferramenta de geração</h3>
			<p>
				Abra o{" "}
				<Link
					href="/ferramentas/gerador-de-qr-code-pix"
					className="text-primary underline"
				>
					gerador de QR Code PIX da Ferramenta Ninja
				</Link>
				. Não é preciso criar conta nem instalar nada. A ferramenta roda
				diretamente no navegador e não armazena seus dados.
			</p>

			<h3 className={H3}>Passo 3: Preencha os campos</h3>
			<p>
				Informe sua chave PIX e os dados do beneficiário. Se quiser, adicione um
				valor fixo e uma descrição. Os campos opcionais podem ficar em branco se
				você quiser um QR genérico sem valor pré-definido.
			</p>

			<h3 className={H3}>Passo 4: Gere e salve</h3>
			<p>
				Clique em gerar. O código aparece na tela em formato PNG. Baixe e use
				como quiser: imprima, coloque no celular, envie por mensagem ou adicione
				no seu site.
			</p>

			<h3 className={H3}>Passo 5: Teste antes de usar</h3>
			<p>
				Antes de compartilhar com clientes, escaneie o QR com o aplicativo do
				seu próprio banco. Confirme que o nome do beneficiário e as informações
				aparecem corretamente. Não finalize o pagamento, apenas verifique os dados.
			</p>

			<h2 className={H2}>Como usar o QR Code PIX no dia a dia</h2>

			<h3 className={H3}>Impressão no balcão ou na mesa</h3>
			<p>
				Para estabelecimentos físicos, imprima o QR em tamanho suficiente para
				ser lido a cerca de 30 cm de distância. Um papel A5 já resolve. Coloque
				próximo ao caixa ou na mesa de atendimento.
			</p>

			<h3 className={H3}>Envio por WhatsApp ou e-mail</h3>
			<p>
				Salve a imagem no celular e envie diretamente para o cliente quando
				precisar cobrar. É mais rápido do que passar a chave e esperar a pessoa
				copiar.
			</p>

			<h3 className={H3}>Inserção em orçamentos e notas</h3>
			<p>
				Inclua o QR Code no PDF do orçamento ou da nota de serviço. O cliente
				recebe o documento e já pode pagar sem precisar de mais informações.
			</p>

			<h3 className={H3}>Site ou página de contato</h3>
			<p>
				Se você tem um site, adicione o QR na página de contato ou em uma seção
				de pagamento. Quem acessa pelo celular pode escanear diretamente; quem
				acessa pelo computador pode usar o PIX copia e cola gerado junto com o
				QR.
			</p>

			<h2 className={H2}>Quem se beneficia mais do QR Code PIX</h2>

			<h3 className={H3}>MEI e microempreendedor individual</h3>
			<p>
				Para quem tem CNPJ e atende clientes presencialmente ou online, o QR
				Code com o CNPJ como chave é a opção mais profissional. O cliente vê o
				nome do negócio na hora de confirmar o pagamento, o que passa mais
				confiança do que ver apenas um CPF.
			</p>

			<h3 className={H3}>Autônomo e freelancer</h3>
			<p>
				Para prestadores de serviço sem CNPJ, o QR com CPF ou chave aleatória
				funciona perfeitamente. A chave aleatória tem a vantagem de não expor
				dados pessoais.
			</p>

			<h3 className={H3}>Pequenos comércios</h3>
			<p>
				Bares, restaurantes, feiras e lojas físicas de pequeno porte costumam
				usar o QR estático fixado no balcão para receber sem maquininha. Não tem
				taxa, o dinheiro cai na hora e funciona 24 horas por dia.
			</p>

			<h3 className={H3}>Professores e prestadores de serviço</h3>
			<p>
				Aulas, consultas, sessões e outros serviços pagos antes ou depois da
				prestação se beneficiam do envio do QR por mensagem. O cliente paga sem
				precisar estar presencialmente.
			</p>

			<h2 className={H2}>Erros comuns ao gerar o QR Code PIX</h2>
			<p>
				<strong>Errado:</strong> usar uma chave que não está mais ativa ou foi
				portada para outra conta.
				<br />
				O pagamento pode ir para a conta errada ou simplesmente não funcionar.
				Sempre verifique no app do banco se a chave está ativa antes de gerar o
				QR.
			</p>
			<p>
				<strong>Errado:</strong> colocar um nome de beneficiário diferente do
				cadastrado na chave.
				<br />O aplicativo do pagador mostra o nome que está no sistema do Banco
				Central, não o que você digitou no gerador. Se o nome não bater, pode
				gerar desconfiança.
			</p>
			<p>
				<strong>Errado:</strong> imprimir o QR muito pequeno.
				<br />
				Códigos impressos abaixo de 2,5 cm × 2,5 cm costumam ter problemas de
				leitura, especialmente em celulares mais antigos. Prefira tamanhos
				maiores.
			</p>
			<p>
				<strong>Errado:</strong> não testar antes de distribuir.
				<br />
				Parece óbvio, mas muita gente distribui o QR sem escanear antes. Sempre
				faça um teste rápido no app do banco.
			</p>
			<p>
				<strong>Errado:</strong> compartilhar o QR em qualidade baixa ou
				comprimido demais.
				<br />
				Ao enviar por WhatsApp ou e-mail, prefira o arquivo PNG original.
				Compressão excessiva pode deixar o código ilegível.
			</p>

			<h2 className={H2}>Perguntas frequentes sobre QR Code PIX</h2>

			<h3 className={H3}>O QR Code PIX tem prazo de validade?</h3>
			<p>
				O QR estático não tem prazo de validade. Ele funciona enquanto a chave
				PIX associada estiver ativa. O QR dinâmico pode ter data de vencimento
				configurada; após essa data, o código não aceita pagamentos.
			</p>

			<h3 className={H3}>O pagador consegue ver meus dados pessoais?</h3>
			<p>
				No momento da confirmação, o pagador vê o nome do titular da chave e a
				instituição financeira. O CPF ou CNPJ completo não é exibido: a maioria
				dos aplicativos mostra apenas os últimos dígitos. Por isso muita gente
				prefere a chave aleatória (EVP): ela não vincula o pagamento a nenhum
				dado pessoal identificável.
			</p>

			<h3 className={H3}>Posso ter mais de um QR Code PIX?</h3>
			<p>
				Sim. Você pode gerar QR Codes diferentes para chaves diferentes, valores
				diferentes ou descrições diferentes. Todos os QRs gerados para a mesma
				chave apontam para a mesma conta.
			</p>

			<h3 className={H3}>Existe taxa para receber via QR Code PIX?</h3>
			<p>
				Para pessoas físicas, o recebimento via PIX é gratuito. Para pessoas
				jurídicas, algumas instituições cobram por transação recebida,
				geralmente com valores bem baixos. Vale verificar as condições da sua conta
				PJ.
			</p>

			<h3 className={H3}>
				O QR Code PIX funciona para pagamentos internacionais?
			</h3>
			<p>
				Por enquanto, não. O PIX opera apenas entre contas em instituições
				financeiras brasileiras. O Banco Central estuda parcerias para habilitar
				transações internacionais no futuro, mas não há prazo definido.
			</p>

			<h3 className={H3}>
				Qual a diferença entre QR Code PIX e PIX copia e cola?
			</h3>
			<p>
				São representações diferentes do mesmo conteúdo. O QR Code é a versão
				visual, escaneada com a câmera. O PIX copia e cola é a versão em texto:
				aquela sequência longa de caracteres que você cola no app do banco. Ambos contêm
				as mesmas informações e podem ser gerados juntos na mesma ferramenta.
			</p>

			<h2 className={H2}>Gere seu QR Code PIX agora</h2>
			<p>
				Se você quer criar seu QR Code PIX sem precisar instalar nada ou fazer
				cadastro, o{" "}
				<Link
					href="/ferramentas/gerador-de-qr-code-pix"
					className="text-primary underline"
				>
					gerador de QR Code PIX da Ferramenta Ninja
				</Link>{" "}
				faz isso em segundos. Informe sua chave, o nome do beneficiário e, se
				quiser, um valor fixo. O código é gerado na hora em formato PNG, pronto
				para imprimir ou compartilhar.
			</p>
		</>
	);
}

export const post: BlogPost = {
	...meta,
	Component: PostBody,
};
