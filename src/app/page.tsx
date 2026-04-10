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
    ],
  },
  {
    id: 'imagens',
    name: 'Imagens',
    description: 'Ferramentas para gerar e converter imagens',
    tools: [
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
