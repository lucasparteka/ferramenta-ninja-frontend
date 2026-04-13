import type { MetadataRoute } from 'next'

const tools = [
  'calculadora-adicional-noturno',
  'calculadora-de-porcentagem',
  'calculadora-salario-liquido',
  'codigo-binario',
  'codigo-morse',
  'comparar-textos',
  'desenhar-online',
  'comprimir-pdf',
  'contador-de-caracteres',
  'conversor-de-texto',
  'converter-csv-para-pdf',
  'converter-csv-para-sql',
  'converter-imagem-em-texto',
  'criador-de-curriculo',
  'criptografia-de-texto',
  'dividir-pdf',
  'emojis',
  'emoticons',
  'formatador-de-texto-whatsapp',
  'gerador-de-cartao-de-credito',
  'gerador-de-cnpj',
  'gerador-de-codigo-de-barras',
  'gerador-de-codigo-de-barras-em-lote',
  'gerador-de-cpf',
  'gerador-de-numeros',
  'gerador-de-qr-code',
  'gerador-de-qr-code-pix',
  'gerador-de-qr-code-wifi',
  'gerador-de-senha',
  'gerador-de-texto',
  'gerador-de-uuid',
  'juntar-pdf',
  'leitor-de-qr-code',
  'remover-duplicados',
  'simbolos',
  'sorteio-online',
  'validador-de-cartao-de-credito',
  'visualizador-de-csv',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ferramenta.ninja'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...tools.map((slug) => ({
      url: `${baseUrl}/ferramentas/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
