import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ferramentas Online Gratuitas',
  description:
    'Acesse dezenas de ferramentas online gratuitas para desenvolvedores, designers e profissionais. Sem cadastro, sem instalação.',
};

type Tool = {
  name: string;
  href: string;
  description: string;
};

type ToolCategory = {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
};

const categories: ToolCategory[] = [
  {
    id: 'texto',
    name: 'Texto e Strings',
    description: 'Ferramentas para manipulação e conversão de texto',
    tools: [
      {
        name: 'Contador de Caracteres',
        href: '/ferramentas/contador-de-caracteres',
        description: 'Conta caracteres, palavras, linhas e parágrafos em tempo real',
      },
      {
        name: 'Conversor de Texto',
        href: '/ferramentas/conversor-de-texto',
        description: 'Maiúsculo, minúsculo, capitalizar, inverter, remover acentos e espaços extras',
      },
      {
        name: 'Gerador de Texto',
        href: '/ferramentas/gerador-de-texto',
        description: 'Gere Lorem Ipsum ou texto aleatório em palavras, frases ou parágrafos',
      },
      {
        name: 'Remover Duplicados',
        href: '/ferramentas/remover-duplicados',
        description: 'Remova linhas duplicadas de listas e textos em um clique',
      },
      {
        name: 'Código Binário',
        href: '/ferramentas/codigo-binario',
        description: 'Converta texto para código binário e código binário para texto',
      },
      {
        name: 'Código Morse',
        href: '/ferramentas/codigo-morse',
        description: 'Converta texto para código Morse e código Morse para texto',
      },
      {
        name: 'Visualizador de CSV',
        href: '/ferramentas/visualizador-de-csv',
        description: 'Visualize arquivos CSV como tabela formatada, com paginação e ordenação por coluna',
      },
      {
        name: 'Converter CSV para PDF',
        href: '/ferramentas/converter-csv-para-pdf',
        description: 'Converta arquivos CSV em PDF com tabela formatada, orientação automática e suporte a muitas colunas',
      },
      {
        name: 'Converter CSV para SQL',
        href: '/ferramentas/converter-csv-para-sql',
        description: 'Gere comandos SQL INSERT a partir de arquivos CSV, com suporte a MySQL, PostgreSQL, SQLite, Oracle e SQL Server',
      },
      {
        name: 'Formatar Texto Para WhatsApp',
        href: '/ferramentas/formatador-de-texto-whatsapp',
        description: 'Formate textos para envio no WhatsApp, com suporte a negrito, itálico, tachado e código',
      },
      {
        name: 'Comparador de Textos',
        href: '/ferramentas/comparar-textos',
        description: 'Compare dois textos e visualize as diferenças com destaque por cores',
      },
    ],
  },
  {
    id: 'documentos',
    name: 'Documentos',
    description: 'Geração e validação de documentos brasileiros',
    tools: [
      {
        name: 'Gerador de CPF',
        href: '/ferramentas/gerador-de-cpf',
        description: 'Gere CPFs válidos para testes e valide CPFs existentes',
      },
      {
        name: 'Gerador de CNPJ',
        href: '/ferramentas/gerador-de-cnpj',
        description: 'Gere CNPJs válidos para testes e valide CNPJs existentes',
      },
      {
        name: 'Gerador de Cartão de Crédito',
        href: '/ferramentas/gerador-de-cartao-de-credito',
        description: 'Gere números de cartão de crédito válidos para testes com Visa, Mastercard, Amex, Elo e Hipercard',
      },
      {
        name: 'Validador de Cartão de Crédito',
        href: '/ferramentas/validador-de-cartao-de-credito',
        description: 'Valide números de cartão de crédito pelo algoritmo de Luhn e identifique a bandeira automaticamente',
      },
    ],
  },
  {
    id: 'calculadoras',
    name: 'Calculadoras',
    description: 'Ferramentas de cálculo rápido e conversão numérica',
    tools: [
      {
        name: 'Calculadora de Porcentagem',
        href: '/ferramentas/calculadora-de-porcentagem',
        description: '5 calculadoras de porcentagem: valor, variação, desconto e aumento',
      },
      {
        name: 'Calculadora de Adicional Noturno',
        href: '/ferramentas/calculadora-adicional-noturno',
        description: 'Calcule o adicional noturno para empregados urbanos e rurais, com RSR/DSR',
      },
      {
        name: 'Calculadora de Salário Líquido',
        href: '/ferramentas/calculadora-salario-liquido',
        description: 'Calcule o salário líquido com desconto de INSS, IRRF e dependentes',
      },
    ],
  },
  {
    id: 'sorteios',
    name: 'Sorteios',
    description: 'Ferramentas para sorteios e seleção aleatória',
    tools: [
      {
        name: 'Sorteio Online',
        href: '/ferramentas/sorteio-online',
        description: 'Sorteie nomes, números ou qualquer lista de forma justa',
      },
      {
        name: 'Gerador de Números',
        href: '/ferramentas/gerador-de-numeros',
        description: 'Gere números aleatórios com intervalo, ordem e colunas personalizados',
      },
    ],
  },
  {
    id: 'seguranca',
    name: 'Segurança',
    description: 'Ferramentas para proteger suas contas e dados',
    tools: [
      {
        name: 'Gerador de Senha',
        href: '/ferramentas/gerador-de-senha',
        description: 'Gere senhas seguras e aleatórias com um clique',
      },
      {
        name: 'Criptografia de Texto',
        href: '/ferramentas/criptografia-de-texto',
        description: 'Cifre e decifre textos com AES-256-GCM, Base64 ou ROT13',
      },
      {
        name: 'Gerador de UUID',
        href: '/ferramentas/gerador-de-uuid',
        description: 'Gere UUIDs únicos nas versões v1, v3, v4 e v5 e valide UUIDs existentes',
      },
    ],
  },
  {
    id: 'imagens',
    name: 'Imagens',
    description: 'Ferramentas para gerar, converter e criar imagens',
    tools: [
      {
        name: 'Desenhar Online',
        href: '/ferramentas/desenhar-online',
        description: 'Desenhe livremente, crie formas e exporte imagens PNG direto no navegador',
      },
      {
        name: 'Gerador de QR Code',
        href: '/ferramentas/gerador-de-qr-code',
        description: 'Gere QR Codes a partir de qualquer texto ou URL e baixe em PNG',
      },
      {
        name: 'Gerador de QR Code Wi-Fi',
        href: '/ferramentas/gerador-de-qr-code-wifi',
        description: 'Gere QR Codes para conectar dispositivos à sua rede Wi-Fi automaticamente',
      },
      {
        name: 'Gerador de QR Code Pix',
        href: '/ferramentas/gerador-de-qr-code-pix',
        description: 'Gere QR Codes Pix estáticos para cobranças e pagamentos instantâneos',
      },
      {
        name: 'Leitor de QR Code Online',
        href: '/ferramentas/leitor-de-qr-code',
        description: 'Decodifique QR Codes a partir de imagens sem precisar de câmera',
      },
      {
        name: 'Converter Imagem em Texto (OCR)',
        href: '/ferramentas/converter-imagem-em-texto',
        description: 'Extraia texto de imagens, prints e documentos usando OCR no navegador',
      },
      {
        name: 'Gerador de Código de Barras 1D',
        href: '/ferramentas/gerador-de-codigo-de-barras',
        description: 'Gere códigos de barras EAN-13, CODE 128, UPC e outros em SVG',
      },
      {
        name: 'Gerador de Código de Barras em Lote',
        href: '/ferramentas/gerador-de-codigo-de-barras-em-lote',
        description: 'Gere vários códigos de barras de uma vez a partir de uma lista de valores',
      },
    ],
  },
  {
    id: 'curriculo',
    name: 'Currículo',
    description: 'Crie e exporte currículos profissionais em PDF',
    tools: [
      {
        name: 'Criador de Currículo',
        href: '/ferramentas/criador-de-curriculo',
        description: 'Monte seu currículo com templates modernos e baixe em PDF gratuitamente',
      },
    ],
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Ferramentas para manipular arquivos PDF no navegador',
    tools: [
      {
        name: 'Juntar PDF',
        href: '/ferramentas/juntar-pdf',
        description: 'Una múltiplos arquivos PDF em um único documento',
      },
      {
        name: 'Dividir PDF',
        href: '/ferramentas/dividir-pdf',
        description: 'Extraia páginas específicas ou divida um PDF em partes',
      },
      {
        name: 'Comprimir PDF',
        href: '/ferramentas/comprimir-pdf',
        description: 'Reduza o tamanho de arquivos PDF e veja a diferença antes de baixar',
      },
    ],
  },
  {
    id: 'colecoes',
    name: 'Coleções',
    description: 'Emojis, emoticons e símbolos para copiar e colar',
    tools: [
      {
        name: 'Emojis para Copiar',
        href: '/ferramentas/emojis',
        description: 'Copie emojis com um clique — rostos, animais, comida e muito mais',
      },
      {
        name: 'Emoticons para Copiar',
        href: '/ferramentas/emoticons',
        description: 'Copie emoticons de texto com um clique — clássicos e kaomoji',
      },
      {
        name: 'Símbolos para Copiar',
        href: '/ferramentas/simbolos',
        description: 'Copie símbolos especiais — matemática, setas, moedas e formas',
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border bg-card/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Ferramentas online{' '}
              <span className="text-primary">gratuitas</span> para o seu dia a dia
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Acesse dezenas de ferramentas para desenvolvedores e profissionais. Sem cadastro, sem
              instalação, direto no navegador.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
                  <p className="mt-1 text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Por que usar o Ferramenta Ninja?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Gratuito',
                text: 'Todas as ferramentas são completamente gratuitas, sem limites de uso.',
              },
              {
                title: 'Sem cadastro',
                text: 'Não é necessário criar conta. Acesse e use imediatamente.',
              },
              {
                title: 'Privacidade',
                text: 'O processamento acontece no seu navegador. Seus dados não saem do dispositivo.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
