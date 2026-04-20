import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ResumeBuilder } from "@/components/tools/curriculo/resume-builder";

export const metadata: Metadata = {
	title: "Criador de Currículo Online Grátis | Ferramenta Ninja",
	description:
		"Crie seu currículo profissional gratuitamente com templates modernos. Preencha o formulário, personalize o visual e baixe em PDF — sem cadastro, sem instalação.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o Criador de Currículo
				</h2>
				<p>
					O Criador de Currículo do Ferramenta Ninja é uma ferramenta gratuita e
					online para montar um currículo profissional em minutos. Escolha entre
					seis templates modernos, personalize cores e fontes, e baixe o
					resultado em PDF pronto para enviar.
				</p>
				<p className="mt-3">
					Seus dados ficam salvos localmente no navegador — não enviamos nenhuma
					informação para servidores externos. Você pode fechar e voltar a
					qualquer momento sem perder o que preencheu.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como criar seu currículo
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Preencha seus dados:</strong>{" "}
						nome, cargo desejado, contato, resumo profissional, experiências,
						formação, habilidades e idiomas. Todos os campos são opcionais,
						exceto nome, e-mail e telefone.
					</p>
					<p>
						<strong className="text-foreground">2. Escolha um template:</strong>{" "}
						são seis modelos disponíveis — Clássico, Tradicional, Minimalista,
						Executivo, Moderno e Elegante. Cada um pode ter a cor de destaque,
						fonte e tamanho ajustados.
					</p>
					<p>
						<strong className="text-foreground">3. Salve o progresso:</strong>{" "}
						clique em "Salvar" para guardar os dados no navegador. O currículo
						fica disponível mesmo após fechar a página.
					</p>
					<p>
						<strong className="text-foreground">4. Baixe em PDF:</strong> quando
						estiver satisfeito com o resultado, clique em "Baixar PDF" para
						gerar e salvar o arquivo no seu dispositivo.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Templates disponíveis
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Clássico:</strong> layout em
						duas colunas com barra lateral colorida. Organizado e de fácil
						leitura, indicado para a maioria das áreas.
					</p>
					<p>
						<strong className="text-foreground">Tradicional:</strong> modelo com
						cabeçalho destacado e seções bem definidas. Transmite seriedade e é
						amplamente aceito em processos seletivos formais.
					</p>
					<p>
						<strong className="text-foreground">Minimalista:</strong> design
						limpo, sem elementos visuais pesados. Ideal para áreas que valorizam
						clareza e objetividade.
					</p>
					<p>
						<strong className="text-foreground">Executivo:</strong> visual
						refinado com tipografia destacada e hierarquia visual clara.
						Recomendado para posições de liderança e gestão.
					</p>
					<p>
						<strong className="text-foreground">Moderno:</strong> estrutura
						contemporânea com uso criativo de espaço e cor. Adequado para áreas
						criativas, tecnologia e startups.
					</p>
					<p>
						<strong className="text-foreground">Elegante:</strong> combinação
						equilibrada entre sofisticação e funcionalidade. Versátil para
						diferentes perfis e setores.
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
							Os dados do meu currículo ficam salvos?
						</h3>
						<p>
							Sim. Ao clicar em "Salvar", os dados são armazenados no
							localStorage do seu navegador. Eles persistem entre sessões, mas
							são específicos do dispositivo e navegador que você está usando.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Meus dados são enviados para algum servidor?
						</h3>
						<p>
							Apenas no momento de gerar o PDF. Os dados são transmitidos
							temporariamente para o servidor gerar o arquivo, mas não são
							armazenados permanentemente. A foto não é salva no navegador,
							somente usada durante a sessão e para o PDF.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso adicionar uma foto no currículo?
						</h3>
						<p>
							Sim. É possível carregar uma foto em formatos JPG, PNG ou WebP. A
							imagem aparecerá no template, desde que o modelo escolhido suporte
							esse campo. A foto não é salva localmente — ela precisa ser
							selecionada novamente após recarregar a página.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O PDF gerado é de boa qualidade?
						</h3>
						<p>
							Sim. O PDF é gerado por um navegador headless (Puppeteer) com
							fidelidade total ao visual exibido na tela, incluindo fontes,
							cores e formatação. O resultado é adequado para envio por e-mail
							ou upload em plataformas de recrutamento.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como apagar os dados salvos?
						</h3>
						<p>
							Você pode limpar os dados do currículo acessando as configurações
							do navegador e limpando o armazenamento local do site, ou usando a
							opção "Reverter alterações" para desfazer mudanças não salvas.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CriadorDeCurriculoPage() {
	return (
		<PageLayout
			title="Criador de Currículo Online Grátis"
			description="Monte seu currículo profissional com templates modernos. Personalize o visual, salve no navegador e baixe em PDF — sem cadastro e sem enviar seus dados."
			relatedTools={
				<RelatedTools
					currentHref="/ferramentas/criador-de-curriculo"
					customTools={[
						{
							name: "Calculadora de Salário Líquido",
							href: "/ferramentas/calculadora-salario-liquido",
							description: "INSS, IRRF e descontos",
							tags: ["calculo", "financeiro"],
							intent: "analyze",
						},
						{
							name: "Calculadora Adicional Noturno",
							href: "/ferramentas/calculadora-adicional-noturno",
							description: "Calcule o adicional noturno",
							tags: ["calculo", "financeiro"],
							intent: "analyze",
						},
						{
							name: "Gerador de Senha",
							href: "/ferramentas/gerador-de-senha",
							description: "Senhas seguras",
							tags: ["seguranca", "senha"],
							intent: "generate",
							weight: 1,
						},
						{
							name: "Juntar PDF",
							href: "/ferramentas/juntar-pdf",
							description: "Una PDFs",
							tags: ["pdf"],
							intent: "convert",
						},
						{
							name: "Dividir PDF",
							href: "/ferramentas/dividir-pdf",
							description: "Separe páginas",
							tags: ["pdf"],
							intent: "convert",
						},
						{
							name: "Comprimir PDF",
							href: "/ferramentas/comprimir-pdf",
							description: "Reduza tamanho",
							tags: ["pdf"],
							intent: "convert",
						},
						{
							name: "Checklist Personalizado",
							href: "/ferramentas/checklist-personalizado",
							description: "Crie e imprima checklists personalizados",
							tags: ["pdf", "impressao", "organizacao"],
							intent: "generate",
						},
					]}
				/>
			}
			extraContent={<SeoContent />}
		>
			<ResumeBuilder />
		</PageLayout>
	);
}
