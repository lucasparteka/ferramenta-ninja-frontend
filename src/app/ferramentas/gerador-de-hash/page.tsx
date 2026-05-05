import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { HashGenerator } from "@/components/tools/hash-generator/hash-generator";

export const metadata: Metadata = {
	title: "Gerador de Hash MD5 SHA256 SHA512 Online Grátis | Ferramenta Ninja",
	description:
		"Gere hash MD5, SHA-1, SHA-256 e SHA-512 de textos e arquivos online. Suporte a HMAC com chave secreta e verificação de hash. 100% gratuito e seguro.",
};

function SeoContent() {
	return (
		<section className="space-y-4">
			<div>
				<h2>O que é um Hash?</h2>
				<p>
					Hash é uma função matemática que transforma qualquer entrada (texto ou arquivo) em uma
					string de tamanho fixo. Diferente da criptografia, o hash é unidirecional — não é
					possível reverter o hash para obter o valor original. É amplamente usado para verificar
					integridade de arquivos, armazenar senhas com segurança e gerar identificadores únicos.
				</p>
			</div>

			<div>
				<h2>Qual a diferença entre MD5, SHA-1, SHA-256 e SHA-512?</h2>
				<p>
					O MD5 produz hashes de 128 bits (32 caracteres hexadecimais), mas é considerado
					inseguro para fins criptográficos devido a vulnerabilidades conhecidas. SHA-1 (160 bits)
					também é considerado obsoleto. SHA-256 e SHA-512 fazem parte da família SHA-2 e são
					os recomendados para uso em segurança. O SHA-256 produz hashes de 256 bits (64 caracteres),
					enquanto o SHA-512 produz 512 bits (128 caracteres).
				</p>
			</div>

			<div>
				<h2>O que é HMAC?</h2>
				<p>
					HMAC (Hash-based Message Authentication Code) é um hash que utiliza uma chave secreta
					adicional. Apenas quem possui a mesma chave consegue verificar se o hash foi gerado por
					você. É comumente usado em APIs para autenticar requisições e garantir que os dados não
					foram alterados durante a transmissão.
				</p>
			</div>

			<div>
				<h2>Como usar o gerador de hash?</h2>
				<p>
					Digite ou cole o texto na área de entrada, selecione o algoritmo desejado e clique em
					"Calcular Hash". Você também pode fazer hash de arquivos clicando em "Escolher arquivo".
					Para usar HMAC, ative a opção e digite uma chave secreta. Use o modo "Verificar" para
					confirmar se um hash corresponde ao texto ou arquivo original.
				</p>
			</div>
		</section>
	);
}

const faq = [
	{
		question: "Qual algoritmo de hash devo usar?",
		answer:
			"Para segurança, prefira SHA-256 ou SHA-512. MD5 e SHA-1 são considerados obsoletos para fins criptográficos, mas ainda são úteis para checksums e sistemas legados.",
	},
	{
		question: "É possível reverter um hash?",
		answer:
			"Não. Hash é uma função unidirecional. A única forma de 'reverter' é comparar o hash de entradas conhecidas (tabelas rainbow) ou usar ataques de força bruta, o que é inviável para algoritmos seguros como SHA-256.",
	},
	{
		question: "O hash é calculado no servidor?",
		answer:
			"Não. Todo o processamento é feito diretamente no seu navegador usando a Web Crypto API. Nenhum dado é enviado para servidores externos.",
	},
];

export default function GeradorDeHashPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/gerador-de-hash"
			title="Gerador de Hash Online"
			description="Gere hash MD5, SHA-1, SHA-256 e SHA-512 de textos e arquivos. Suporte a HMAC com chave secreta e verificação de hash."
			relatedTools={<RelatedTools currentHref="/ferramentas/gerador-de-hash" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<HashGenerator />
		</PageLayout>
	);
}
