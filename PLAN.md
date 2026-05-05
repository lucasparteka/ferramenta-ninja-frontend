# Plano de Implementação — Novas Ferramentas

Estratégia baseada na análise do cenário atual: 82 ferramentas existentes, lacunas identificadas em nichos com alto volume de busca PT-BR e baixa concorrência.

---

## ✅ Concluídas

- **1.1 Calculadora de Horas Trabalhadas** — `/ferramentas/calcular-horas-trabalhadas`
  - `src/lib/work-hours/` — lógica pura (types, calculate, index)
  - `src/components/tools/work-hours/` — componente React
  - `src/app/ferramentas/calcular-horas-trabalhadas/page.tsx` — rota + SEO
  - Registrado em `src/lib/data/tools.ts` (categoria Calculadoras, ícone Timer)

- **1.2 Gerador de Hash (MD5 / SHA)** — `/ferramentas/gerador-de-hash`
  - `src/lib/crypto/hash.ts` — wrappers Web Crypto API + MD5 polyfill
  - `src/components/tools/hash-generator/` — componente React com HMAC, verificação e upload de arquivo
  - `src/app/ferramentas/gerador-de-hash/page.tsx` — rota + SEO
  - Registrado em `src/lib/data/tools.ts` (categoria Segurança, ícone ScanText)

- **1.3 Gerador de Link WhatsApp** — `/ferramentas/gerador-de-link-whatsapp`
  - `src/lib/whatsapp/validation.ts` — validação de telefone BR
  - `src/lib/whatsapp/link.ts` — geração de URL wa.me
  - `src/components/tools/whatsapp-link/` — componente React com formatação automática, QR Code e download
  - `src/app/ferramentas/gerador-de-link-whatsapp/page.tsx` — rota + SEO
  - Registrado em `src/lib/data/tools.ts` (categoria Utilitários, ícone MessageCircle)

---

## Fase 1 — Quick Wins (alta prioridade)

Ferramentas simples de implementar, alto volume de busca, baixa concorrência.

### 1.1 Calculadora de Horas Trabalhadas

| Item | Detalhe |
|------|---------|
| **Slug** | `/calcular-horas-trabalhadas` |
| **Categoria** | Calculadoras |
| **Tempo estimado** | 4h |
| **Dependências** | Nenhuma (matemática pura) |
| **Dificuldade** | ★☆☆☆☆ |
| **Status** | ✅ Implementado |

**Funcionalidades:**
- Entrada de hora início e hora fim (formato HH:MM)
- Opção de intervalo/almoco (HH:MM)
- Suporte a período noturno (adicional noturno automático se entre 22h-5h)
- Cálculo de total de horas no dia
- Cálculo de total semanal e mensal (com base nos dias preenchidos)
- Exibição em horas decimais e horas:minutos
- Botão para adicionar múltiplos dias da semana
- Salva localmente os registros (localStorage)

**Estrutura de arquivos:**
```
src/
  lib/
    work-hours/           # Lógica pura
      types.ts
      calculate.ts        # diff horários, calcular adicional noturno
      format.ts           # formatar HH:MM e decimal
  components/
    tools/
      work-hours/
        WorkHoursCalculator.tsx
        DayEntry.tsx       # linha individual de dia
        WeekSummary.tsx    # resumo semanal/mensal
```

**SEO:**
- Meta title: "Calculadora de Horas Trabalhadas Online Grátis"
- H1: "Calculadora de Horas Trabalhadas"
- Foco: calcular horas trabalhadas, calculadora jornada de trabalho

---

### 1.2 Gerador de Hash (MD5 / SHA)

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-hash` |
| **Categoria** | Segurança |
| **Tempo estimado** | 2h |
| **Dependências** | Web Crypto API (nativa do browser) |
| **Dificuldade** | ★☆☆☆☆ |
| **Status** | ✅ Implementado |

**Funcionalidades:**
- Input de texto livre
- Seleção de algoritmo: MD5, SHA-1, SHA-256, SHA-512
- Hash em tempo real (on input change)
- Opção de fazer hash de arquivo (via FileReader)
- Copiar hash com um clique
- Comparação: colar hash e texto para verificar correspondência
- Suporte HMAC (com chave secreta)

**Estrutura de arquivos:**
```
src/
  lib/
    crypto/
      hash.ts             # wrappers para Web Crypto API + MD5 polyfill
  components/
    tools/
      hash-generator/
        HashGenerator.tsx
        HashResult.tsx     # exibe hash com copy
        HashVerifier.tsx   # modo comparação
```

**Dependência extra:** `npm install md5` (MD5 não tem no Web Crypto nativo; SHA-1/256/512 sim)

**SEO:**
- Meta title: "Gerador de Hash MD5 SHA256 SHA512 Online Grátis"
- H1: "Gerador de Hash Online"
- Foco: gerar hash md5, sha256 online

---

### 1.3 Gerador de Link WhatsApp

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-link-whatsapp` |
| **Categoria** | Utilitários |
| **Tempo estimado** | 3h |
| **Dependências** | Nenhuma |
| **Dificuldade** | ★☆☆☆☆ |
| **Status** | ✅ Implementado |

**Funcionalidades:**
- Input de número de telefone (formatação automática BR: (XX) XXXXX-XXXX)
- Input de mensagem pré-preenchida (textarea)
- Preview do link gerado em tempo real: `https://wa.me/55XXXXXXXXXXX?text=...`
- Botão copiar link
- Botão abrir WhatsApp direto
- Validação: número precisa ter DDD + 8/9 dígitos
- Opção de link sem mensagem
- QR Code do link (reutilizar componente de QR existente)
- Shortener de link (opcional: usar API encurtador)

**Estrutura de arquivos:**
```
src/
  lib/
    whatsapp/
      link.ts             # gerar URL wa.me
      validation.ts       # validar número BR
  components/
    tools/
      whatsapp-link/
        WhatsAppLinkGenerator.tsx
        LinkPreview.tsx
        PhoneInput.tsx
```

**Importante:** Reutilizar `lib/whatsapp/` existente? Verificar se já tem algo lá.

**SEO:**
- Meta title: "Gerador de Link do WhatsApp Online Grátis"
- H1: "Gerador de Link do WhatsApp"
- Foco: gerador de link whatsapp, link wa.me, criar link whatsapp

---

### 1.4 Conversor Imagem para Base64

| Item | Detalhe |
|------|---------|
| **Slug** | `/converter-imagem-para-base64` |
| **Categoria** | Desenvolvedor |
| **Tempo estimado** | 2h |
| **Dependências** | Nenhuma (FileReader nativo) |
| **Dificuldade** | ★☆☆☆☆ |

**Funcionalidades:**
- Dropzone para imagem (reutilizar `ImageDropzone` existente)
- Suporte a PNG, JPG, GIF, SVG, WebP
- Conversão automática ao carregar
- Exibição do data URI completo
- Opção de copiar só o base64 puro (sem `data:image/...`)
- Preview da imagem
- Info: tamanho original vs tamanho base64
- Upload via URL remota (fetch + blob)

**Estrutura de arquivos:**
```
src/
  lib/
    encoding/
      image.ts            # fileToBase64, urlToBase64, getImageSize
  components/
    tools/
      image-base64/
        ImageToBase64.tsx
        Base64Output.tsx
```

**SEO:**
- Meta title: "Converter Imagem para Base64 Online Grátis"
- H1: "Converter Imagem para Base64"
- Foco: imagem para base64, codificar imagem base64, data uri

---

### 1.5 Codificador de URL

| Item | Detalhe |
|------|---------|
| **Slug** | `/codificador-de-url` |
| **Categoria** | Desenvolvedor |
| **Tempo estimado** | 1h |
| **Dependências** | Nenhuma (`encodeURIComponent` nativo) |
| **Dificuldade** | ★☆☆☆☆ |

**Funcionalidades:**
- Input de texto
- Conversão bidirecional: Encode ↔ Decode
- Em tempo real
- Botão copiar
- Opção de encodeURI vs encodeURIComponent (explicar diferença)
- Input de URL inteira vs parte

**Estrutura de arquivos:**
```
src/
  lib/
    encoding/
      url.ts              # encode/decode wrappers
  components/
    tools/
      url-encoder/
        URLEncoder.tsx
```

**SEO:**
- Meta title: "Codificador de URL Online Grátis"
- H1: "Codificador de URL Online"
- Foco: codificar url, decodificar url, url encode online

---

## Fase 2 — Ferramentas Visuais (média prioridade)

Ferramentas com apelo visual/interativo, bom para engajamento e compartilhamento.

### 2.1 Gerador de Box Shadow CSS

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-box-shadow-css` |
| **Categoria** | Design |
| **Tempo estimado** | 6h |
| **Dependências** | Nenhuma (CSS inline puro) |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- 6 sliders: deslocamento X, Y, blur, spread, opacidade, cor
- Preview em tempo real em um quadrado
- Código CSS gerado automaticamente
- Botão copiar CSS
- Suporte a múltiplas camadas de shadow (add/remove)
- Opção de `inset`
- Presets prontos (sombra suave, sombra forte, neon, etc.)
- Preview em botão real (para testar em elemento interativo)
- Background color selector

**Estrutura de arquivos:**
```
src/
  lib/
    color/
      box-shadow.ts       # gerar string CSS box-shadow
  components/
    tools/
      box-shadow/
        BoxShadowGenerator.tsx
        ShadowControls.tsx   # sliders + inputs numéricos
        ShadowPreview.tsx    # preview visual
        ShadowPresets.tsx    # presets
        ShadowLayer.tsx      # controle de múltiplas camadas
```

**Dicas:** Reutilizar `Slider` component existente.

**SEO:**
- Meta title: "Gerador de Box Shadow CSS Online Grátis"
- H1: "Gerador de Box Shadow CSS"
- Foco: gerador de sombra css, box shadow generator, sombra em css

---

### 2.2 Gerador de Flexbox CSS

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-flexbox-css` |
| **Categoria** | Design |
| **Tempo estimado** | 6h |
| **Dependências** | Nenhuma |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Editor visual de Flexbox
- Controles: `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `align-content`
- Controles de itens filhos: `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`, `order`
- 3-5 quadrados coloridos dentro do container para demonstrar
- Preview em tempo real
- Código CSS gerado automaticamente (container + itens)
- Botão adicionar/remover itens
- Animar transições
- Grid de exemplos visuais para cada combinação
- Modo sandbox com editor de texto para CSS extra

**Estrutura de arquivos:**
```
src/
  lib/
    css/
      flexbox.ts          # gerar CSS a partir do estado
  components/
    tools/
      flexbox-generator/
        FlexboxGenerator.tsx
        ContainerControls.tsx
        ItemControls.tsx
        FlexPreview.tsx      # o preview visual com quadrados
        CodeOutput.tsx       # CSS gerado
```

**SEO:**
- Meta title: "Gerador de Flexbox CSS Online Grátis"
- H1: "Gerador de Flexbox CSS"
- Foco: gerador de flexbox, flexbox css, aprender flexbox

---

### 2.3 Verificador de Contraste de Cores

| Item | Detalhe |
|------|---------|
| **Slug** | `/verificador-de-contraste-de-cores` |
| **Categoria** | Design |
| **Tempo estimado** | 4h |
| **Dependências** | Nenhuma (math pura via WCAG formulas) |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Dois color pickers: cor do texto e cor do fundo
- Cálculo da taxa de contraste (WCAG 2.1)
- Classificação: "Fail", "AA Normal", "AA Large", "AAA"
- Preview visual com texto de exemplo em vários tamanhos
- Simuladores de daltonismo (protanopia, deuteranopia, tritanopia)
- Sugestão automática de cor próxima que atende WCAG
- Input HEX, RGB, HSL
- Salvar cores favoritas (localStorage)

**Estrutura de arquivos:**
```
src/
  lib/
    color/
      contrast.ts         # luminance, contrast ratio, WCAG pass/fail
      blindness.ts        # simuladores de daltonismo
      palette.ts          # sugerir cores que passam WCAG
  components/
    tools/
      color-contrast/
        ColorContrastChecker.tsx
        ColorInput.tsx       # input com color picker
        ContrastResult.tsx   # mostra score + classificação
        PreviewPanel.tsx     # texto preview em vários contextos
        BlindnessSimulator.tsx
```

**SEO:**
- Meta title: "Verificador de Contraste de Cores WCAG Online Grátis"
- H1: "Verificador de Contraste de Cores"
- Foco: verificar contraste cores, taxa de contraste, WCAG contraste

---

### 2.4 Gerador de Favicon

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-favicon` |
| **Categoria** | Desenvolvedor |
| **Tempo estimado** | 5h |
| **Dependências** | Fabric.js (já instalado) |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Modos de criação:
  - Texto (letra sobre fundo) — gerar monograma
  - Upload de imagem
  - Canvas de desenho (reutilizar componente de desenho existente)
  - Emoji picker
- Geração automática nos tamanhos: 16x16, 32x32, 48x48, 64x64, 128x128, 192x192, 512x512
- Preview lado a lado de todos os tamanhos
- Download como `.ico`, `.png` (pacote), ou `.zip` com todos
- Geração de `manifest.json` básico
- Geração de tags HTML para colar no `<head>`

**Estrutura de arquivos:**
```
src/
  lib/
    image/
      favicon.ts          # redimensionar canvas, gerar ico, zip
  components/
    tools/
      favicon-generator/
        FaviconGenerator.tsx
        FaviconCreator.tsx   # text/emoji/image/draw
        FaviconPreview.tsx   # grid de previews
        FaviconExport.tsx    # download options
```

**Dependência extra:** `npm install jszip` (para zip com todos os tamanhos)

**SEO:**
- Meta title: "Gerador de Favicon Online Grátis"
- H1: "Gerador de Favicon Online"
- Foco: gerador de favicon, criar favicon, favicon 32x32

---

### 2.5 Extrair Cor de Imagem

| Item | Detalhe |
|------|---------|
| **Slug** | `/extrair-cor-de-imagem` |
| **Categoria** | Design |
| **Tempo estimado** | 4h |
| **Dependências** | Canvas API nativa |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Upload de imagem (dropzone)
- Extrair paleta dominante (algoritmo de cluster/MCC)
- Número de cores configurável (3-12)
- Click em qualquer ponto da imagem para capturar cor exata
- Exibir cores em cards com HEX, RGB, HSL
- Copiar cor com clique
- Preview da imagem com overlay de paleta

**Estrutura de arquivos:**
```
src/
  lib/
    color/
      extract.ts          # extrair cores dominantes via Canvas pixel data
      mcc.ts              # median cut algorithm (quantização)
  components/
    tools/
      color-extract/
        ColorExtractor.tsx
        ImageCanvas.tsx      # imagem clicável para capturar pixel
        PaletteResult.tsx    # grid de cores extraídas
        ColorDetail.tsx      # HEX/RGB/HSL + copy
```

**SEO:**
- Meta title: "Extrair Cores de Imagem Online Grátis"
- H1: "Extrair Cores de Imagem"
- Foco: extrair cor de imagem, paleta de cores de imagem, capturar cor

---

## Fase 3 — Expansão (média/baixa prioridade)

### 3.1 Converter SVG para PNG

| Item | Detalhe |
|------|---------|
| **Slug** | `/converter-svg-para-png` |
| **Categoria** | Imagens |
| **Tempo estimado** | 3h |
| **Dependências** | Canvas API nativa |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Upload de SVG (dropzone ou textarea com código)
- Preview do SVG renderizado
- Opção de tamanho de saída (width x height) ou manter original
- Background color (transparente ou cor sólida)
- Download como PNG
- Suporte a SVG com elementos `<foreignObject>` (fallback)
- Conversão em lote (múltiplos SVGs)

**Estrutura de arquivos:**
```
src/
  lib/
    image/
      svg.ts              # svgToPng, svgToCanvas, getSvgDimensions
  components/
    tools/
      svg-to-png/
        SvgToPngConverter.tsx
        SvgInput.tsx
        PngPreview.tsx
```

**SEO:**
- Meta title: "Converter SVG para PNG Online Grátis"
- H1: "Converter SVG para PNG"
- Foco: converter svg para png, svg para png online

---

### 3.2 Gerador de Imagem Placeholder

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-imagem-placeholder` |
| **Categoria** | Desenvolvedor |
| **Tempo estimado** | 3h |
| **Dependências** | Canvas API |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- Escolher tamanho (presets: 300x250, 728x90, 1200x630, custom)
- Cor de fundo e texto (color pickers)
- Texto customizado no centro da imagem
- Preview em tempo real
- Download PNG
- Gerar URL da imagem (data URI)
- Presets para: blog banner, social media, ads, thumbnails
- Padrão de fundo opcional (grid, dots, stripes)

**Estrutura de arquivos:**
```
src/
  lib/
    image/
      placeholder.ts      # gerar canvas com texto centralizado
  components/
    tools/
      placeholder-generator/
        PlaceholderGenerator.tsx
        PlaceholderPreview.tsx
        PlaceholderExport.tsx
```

**SEO:**
- Meta title: "Gerador de Imagem Placeholder Online Grátis"
- H1: "Gerador de Imagem Placeholder"
- Foco: gerador de imagem placeholder, imagem de placeholder

---

### 3.3 Gerador de Border Radius CSS

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-border-radius-css` |
| **Categoria** | Design |
| **Tempo estimado** | 4h |
| **Dependências** | Nenhuma |
| **Dificuldade** | ★★☆☆☆ |

**Funcionalidades:**
- 4 sliders individuais (top-left, top-right, bottom-right, bottom-left)
- Opção locked/unlocked (valores iguais ou independentes)
- Preview visual em um quadrado
- Valores em px, %, rem, em
- Exibição do código CSS gerado
- Botão copiar
- Presets: círculo, pill, arredondado suave, sem borda
- Modo "visual click" (clicar nas bordas e arrastar)

**Estrutura de arquivos:**
```
src/
  lib/
    css/
      border-radius.ts    # gerar string CSS border-radius
  components/
    tools/
      border-radius/
        BorderRadiusGenerator.tsx
        RadiusControls.tsx
        RadiusPreview.tsx
```

**SEO:**
- Meta title: "Gerador de Border Radius CSS Online Grátis"
- H1: "Gerador de Border Radius CSS"
- Foco: border radius generator, arredondar bordas css, border radius online

---

### 3.4 Baixar Thumbnail do YouTube

| Item | Detalhe |
|------|---------|
| **Slug** | `/baixar-thumbnail-youtube` |
| **Categoria** | Utilitários |
| **Tempo estimado** | 3h |
| **Dependências** | Nenhuma (YouTube URLs públicas) |
| **Dificuldade** | ★☆☆☆☆ |

**Funcionalidades:**
- Input de URL do YouTube
- Extração automática do video ID
- Preview das 3 resoluções disponíveis: maxresdefault, hqdefault, mqdefault
- Download direto (download via link)
- Suporte a short links (youtu.be)
- Campo para colar imagem como data URI se quiser editar antes

**Atenção:** Isso usa URLs públicas do YouTube (`https://img.youtube.com/vi/{id}/maxresdefault.jpg`). Legalmente é permitido pois são thumbnails públicos. Mas não recomendar uso comercial sem verificação.

**Estrutura de arquivos:**
```
src/
  lib/
    youtube/
      thumbnail.ts        # extract video ID, gerar URLs thumbnail
  components/
    tools/
      youtube-thumbnail/
        YouTubeThumbnailDownloader.tsx
        ThumbnailPreview.tsx
```

**SEO:**
- Meta title: "Baixar Thumbnail do YouTube Online Grátis"
- H1: "Baixar Thumbnail do YouTube"
- Foco: baixar thumbnail youtube, download thumbnail youtube

---

### 3.5 Gerador de Link PIX (BR Code)

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-link-pix` |
| **Categoria** | Utilitários |
| **Tempo estimado** | 5h |
| **Dependências** | Nenhuma (gerar BR Code string) |
| **Dificuldade** | ★★★☆☆ |

**Funcionalidades:**
- Inputs obrigatórios: chave PIX (CPF/CNPJ/Telefone/Email/Aleatória), nome do recebedor, cidade
- Inputs opcionais: valor, descrição
- Geração do BR Code (copia e cola PIX)
- Preview do QR Code (reutilizar componente QR existente)
- Validação de chave PIX (CPF, CNPJ, email, telefone, UUID)
- Botão copiar código PIX
- Gerar QR Code estilizado (reutilizar componente personalizado)
- Histórico de PIX gerados (localStorage)

**Estrutura de arquivos:**
```
src/
  lib/
    pix/
      brcode.ts           # gerar string BR Code conforme spec
      validation.ts       # validar tipo de chave PIX
  components/
    tools/
      pix-link/
        PixLinkGenerator.tsx
        PixKeyInput.tsx
        PixPayloadPreview.tsx
```

**Importante:** Não confundir com `/gerador-de-qr-code-pix` existente. Esta ferramenta foca no texto BR Code copiável, e opcionalmente gera QR.

**SEO:**
- Meta title: "Gerador de Link PIX Copia e Cola Online Grátis"
- H1: "Gerador de Link PIX"
- Foco: gerar pix copia e cola, gerar codigo pix, criar pix online

---

## Resumo de Esforço

| Fase | Ferramenta | Esforço | Dependências novas |
|------|-----------|---------|-------------------|
| 1 | Calculadora de Horas | 4h | Nenhuma |
| 1 | Gerador de Hash | 2h | `md5` |
| 1 | Link WhatsApp | 3h | Nenhuma |
| 1 | Imagem → Base64 | 2h | Nenhuma |
| 1 | Codificador URL | 1h | Nenhuma |
| | **Subtotal Fase 1** | **12h** | |
| 2 | Box Shadow CSS | 6h | Nenhuma |
| 2 | Flexbox CSS | 6h | Nenhuma |
| 2 | Contraste Cores | 4h | Nenhuma |
| 2 | Favicon | 5h | `jszip` |
| 2 | Extrair Cor | 4h | Nenhuma |
| | **Subtotal Fase 2** | **25h** | |
| 3 | SVG → PNG | 3h | Nenhuma |
| 3 | Placeholder | 3h | Nenhuma |
| 3 | Border Radius | 4h | Nenhuma |
| 3 | Thumbnail YT | 3h | Nenhuma |
| 3 | Link PIX | 5h | Nenhuma |
| | **Subtotal Fase 3** | **18h** | |
| | **Total** | **55h** | |

---

## Padrão de Implementação (seguir para todas)

1. **Registrar no catálogo** — adicionar em `src/lib/data/tools.ts` (categoria, nome, href, ícone Lucide, tags, intent)
2. **Criar lib/** — lógica pura sem React (testável com Vitest)
3. **Criar page** — `src/app/ferramentas/[slug]/page.tsx` com SEO metadata
4. **Criar component** — `src/components/tools/[tool-name]/` com `"use client"`
5. **SEO content** — adicionar parágrafo descritivo e seções de conteúdo na page
6. **Testes unitários** — testar lib/ functions com Vitest
7. **Build check** — `pnpm run build` para validar

### Checklist por ferramenta

- [ ] Ícone definido em `tools.ts`
- [ ] Tags relevantes para busca
- [ ] Breadcrumb funcional
- [ ] SEO metadata (title, description, keywords)
- [ ] Conteúdo SEO na página (seções de texto explicativo)
- [ ] Relacionadas automáticas (via RelatedTools)
- [ ] Responsivo (mobile-first)
- [ ] Dark mode compatível
- [ ] CopyButton nos resultados
- [ ] Teste unitário para lib/
- [ ] Build sem erros
