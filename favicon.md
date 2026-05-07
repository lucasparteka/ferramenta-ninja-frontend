# Plano de Implementação — Gerador de Favicon (Item 2.4)

> **Referências pesquisadas:**
> - [favicon.io](https://favicon.io/) — principal referência de UX. Home com 3 cards (Imagem, Texto, Emoji), cada um levando a um editor específico. Gera pacote completo (.ico, .png, manifest, HTML tags).
> - [realfavicongenerator.net](https://realfavicongenerator.net/) — foco em upload único de imagem, preview por plataforma (iOS, Android, desktop), geração de SVG favicon.
> - [favicomatic.com](https://favicomatic.com/) — upload de imagem, presets de tamanho (lazy, obsessive, apocalypse), geração de .ico multi-resolução e .png.
>
> **Decisão de UX:** Seguir o modelo do favicon.io com tela de escolha inicial (4 modos), mas manter tudo em uma única página com transição de estado, ao invés de rotas separadas. Isso reduz complexidade de navegação e é mais fluido no mobile.

---

## Visão Geral

| Item | Detalhe |
|------|---------|
| **Slug** | `/gerador-de-favicon` |
| **Categoria** | Desenvolvedor |
| **Tempo estimado total** | 5h |
| **Dependências novas** | `jszip` (para pacote .zip) |
| **Dificuldade** | ★★☆☆☆ |
| **Status** | 📝 Plano criado |

**Fluxo do usuário (mobile-first):**
1. Usuário acessa `/ferramentas/gerador-de-favicon`
2. Vê tela com 4 opções de criação em cards grandes (Imagem, SVG, Texto, Emoji)
3. Toque em uma opção → transição suave para o editor daquele modo
4. No editor: configura/cria o favicon com preview em tempo real
5. Botão "Gerar Favicon" → gera todos os tamanhos
6. Vê grid de previews em todos os tamanhos + opções de download
7. Pode voltar ao início para criar outro favicon

---

## Estrutura de Arquivos

```
src/
  lib/
    image/
      favicon.ts              # tipos, geração de tamanhos, criação de .ico, zip
  components/
    tools/
      favicon-generator/
        favicon-generator.tsx     # componente principal (state machine)
        mode-selector.tsx         # tela inicial com 4 opções
        # editores por modo:
        image-editor.tsx          # upload PNG/JPG + crop centralizado
        svg-editor.tsx            # upload/cola SVG
        text-editor.tsx           # texto + fonte + cores
        emoji-editor.tsx          # picker de emojis + cor de fundo
        # etapa de resultado:
        preview-grid.tsx          # grid com todos os tamanhos gerados
        export-panel.tsx          # download .zip, .ico individual, tags HTML
  app/
    ferramentas/
      gerador-de-favicon/
        page.tsx                # rota + SEO metadata
```

---

## Parte 1: Setup e Estrutura Base

**Objetivo:** Preparar o terreno com tipos, funções utilitárias e registro da ferramenta.

**Tarefas:**
- [x] Instalar `jszip`: `pnpm add jszip`
- [x] Criar `src/lib/image/favicon.ts` com:
  - Tipos: `FaviconMode = "image" | "svg" | "text" | "emoji"`
  - Tipos: `FaviconSize`, `GeneratedFaviconFile`, `FaviconPackage`
  - Constante `FAVICON_SIZES` com 6 tamanhos (16, 32, 48, 180, 192, 512)
  - Constante `ICO_SIZES` (16, 32, 48)
  - Função `renderToSize(sourceCanvas, size)` — cover crop
  - Função `generateFaviconPng(sourceCanvas, size)` — gera Blob PNG
  - Função `generateIco(pngs)` — gera .ico multi-resolução com PNGs embutidos (moderno e compatível)
  - Função `createWebManifest()` — JSON do site.webmanifest
  - Função `generateHtmlTags()` — tags `<link>`
  - Função `createZipPackage(files)` — gera Blob .zip via JSZip (lazy import)
- [x] Criar `src/components/tools/favicon-generator/favicon-generator.tsx` esqueleto com state machine:
  - `Step = "select-mode" | "edit" | "preview"`
  - `mode: FaviconMode | null`
  - Placeholders visuais para `ModeSelector`, `FaviconEditor` e `FaviconPreview`
  - Callbacks `onSelectMode`, `onGenerate`, `onBack`, `onReset`
- [x] Registrar em `src/lib/data/tools.ts`:
  - Nome: "Gerador de Favicon"
  - href: `/ferramentas/gerador-de-favicon`
  - Categoria: Desenvolvedor
  - Ícone: `Image` (Lucide)
  - Tags: `["favicon", "ico", "png", "icone", "site", "web", "desenvolvedor"]`
  - intent: `generate`
- [x] Criar `src/app/ferramentas/gerador-de-favicon/page.tsx` com SEO completo:
  - Title, description, keywords
  - `SeoContent()` com 4 seções explicativas
  - FAQ com 5 perguntas
  - `RelatedTools` e `PageLayout`
- [x] Atualizar `src/lib/image/index.ts` exportando tudo do novo módulo

**Critérios de aceitação:**
- [x] `pnpm run build` passa sem erro ✅
- [x] Ferramenta aparece no catálogo ✅
- [x] Arquivo `favicon.ts` compila e exporta todas as funções tipadas ✅

---

## Parte 2: Tela de Seleção de Modo

**Objetivo:** Criar a tela inicial onde o usuário escolhe como quer criar o favicon.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/mode-selector.tsx`
- [x] Layout mobile-first: 1 coluna em telas muito pequenas, 2 colunas a partir de `sm`, 4 colunas a partir de `lg`
- [x] 4 cards grandes e clicáveis, cada um com:
  - Ícone grande (Lucide): `Image` (imagem), `FileCode` (SVG), `Type` (texto), `Smile` (emoji)
  - Título: "Imagem", "SVG", "Texto", "Emoji"
  - Descrição curta (1 linha)
  - Cores temáticas por card (azul, roxo, verde, âmbar)
  - Hover/active states com transição suave (`whileHover`, `whileTap` do framer-motion)
- [x] Callback `onSelect(mode: FaviconMode)` para o componente pai trocar de step
- [x] Botão de "voltar" não aparece nesta tela (é a primeira)
- [x] Animação de entrada: cards aparecem com stagger (delay progressivo de 80ms)
- [x] Título e subtítulo com animação fade-in
- [x] Instalada dependência `framer-motion` para animações

**Critérios de aceitação:**
- [x] Visualmente equilibrado em telas de 320px+ ✅
- [x] Toque em qualquer card avança para o editor correspondente ✅
- [x] Transição suave entre telas (slide da direita ao avançar, da esquerda ao voltar) ✅
- [x] Build passa sem erro ✅

---

## Parte 3: Editor de Imagem (PNG/JPG)

**Objetivo:** Permitir upload de imagem e pré-visualização antes da geração.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/image-editor.tsx`
- [x] Área de upload customizada com drag & drop + clique (não havia `ImageDropzone` no projeto)
- [x] Após upload:
  - Preview da imagem em canvas quadrado 320×320px com fundo xadrez (transparência)
  - Aviso textual: "A imagem será cortada centralmente para caber no quadrado"
  - Crop automático centralizado via Canvas 2D (cover) — preenche todo o quadrado
- [x] Controles:
  - Botão "Trocar imagem" para limpar e recomeçar
  - Botão "Gerar Favicon" (ícone Wand2) dispara `onGenerate` com canvas 512×512
- [x] Estados de loading (spinner no ícone) e erro (toast-like banner vermelho)
- [x] Animações de transição entre upload e preview via `framer-motion`
- [x] Acessibilidade: `role="button"`, `aria-label`, suporte a teclado (Enter/Space)

**Regras de negócio:**
- Formatos aceitos: `image/*` (PNG, JPG, WebP, GIF, etc.)
- Tamanho máximo: 10MB
- Canvas fonte gerado em 512×512px para máxima qualidade nos redimensionamentos
- Crop: cover centralizado (preenche todo o quadrado, corta as bordas)

**Critérios de aceitação:**
- [x] Upload funciona via drag-and-drop (desktop) e input file (mobile) ✅
- [x] ~~Preview mostra como ficará o favicon~~ → **Removido**: geração automática após upload ✅
- [x] ~~Botão "Gerar" só aparece após upload válido~~ → **Removido**: `onGenerate` chamado automaticamente no `img.onload` ✅
- [x] Build passa sem erro ✅

**Alteração pós-entrega (UX):**
- O step intermediário de preview 320×320 + botões "Trocar imagem"/"Gerar Favicon" foi eliminado.
- Assim que a imagem carrega (`img.onload`), `createSourceCanvas(img)` é chamado e em seguida `onGenerate(sourceCanvasRef.current)` dispara a transição automática para o `PreviewGrid`.
- O componente foi simplificado: sem `image` state, sem `previewCanvasRef`, sem `handleReset`, sem `handleGenerateClick`.
- O upload dropzone é sempre visível quando o componente está montado (step="edit").
- Transição visual: spinner no dropzone durante o upload → `AnimatePresence` do pai (`favicon-generator.tsx`) transiciona `ImageEditor` → `PreviewGrid` com skeleton.

---

## Parte 4: Editor de SVG

**Objetivo:** Permitir envio de SVG via arquivo ou colagem de código.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/svg-editor.tsx`
- [x] Abas/tabs: "Arquivo" | "Código" (usar `OptionSwitch` existente)
- [x] Aba "Arquivo": upload drag & drop aceitando `.svg`
- [x] Aba "Código": textarea grande para colar código SVG
  - Validação básica: checar se começa com `<svg` (case-insensitive)
  - Se inválido: mostrar erro em tempo real
- [x] Preview do SVG renderizado em um quadrado (aspect-ratio 1/1)
  - Se o SVG não tiver `width`/`height`, injeta 512×512 no tag raiz
- [x] Renderização para Canvas: desenhar SVG em canvas temporário via blob URL
- [x] Botão "Gerar Favicon" → `onGenerate(canvas: HTMLCanvasElement)`
- [x] Botão "Voltar"

**Regras de negócio:**
- Aceitar SVG com ou sem viewBox
- Sanitização mínima: não executar scripts (innerHTML é seguro em contexto local, mas validar que é SVG)
- Tamanho do textarea: mínimo 5 linhas visíveis

**Critérios de aceitação:**
- [x] SVG de arquivo e de código produzem o mesmo resultado visual ✅
- [x] ~~Preview atualiza em tempo real (aba código) ou após upload (aba arquivo)~~ → **Removido**: preview 320×320 eliminado ✅
- [x] Erros de SVG inválido são exibidos de forma amigável ✅
- [x] Build passa sem erro ✅

**Alteração pós-entrega (UX + Bug fix):**
- **Bug fix**: SVGs que começam com `<!-- comentário -->`, `<?xml version="1.0" encoding="UTF-8"?>`, `<!DOCTYPE svg ...>`, ou qualquer combinação desses elementos antes do `<svg` agora são aceitos. A função `stripSvgPreamble()` remove **comentários** (`<!-- -->`), **XML declarations** (`<?xml ...?>`) e **DOCTYPE declarations** antes da validação (`validateSvg`) e antes do processamento de atributos (`prepareSvgForCanvas`). Isso evita que o regex `/^\s*<svg\b/i` falhe e que a injeção de `width`/`height`/`xmlns` seja aplicada no tag raiz correto.
- **Mensagem de erro atualizada**: de `"O SVG deve começar com '<svg'"` para `"O documento não contém um elemento <svg> válido."`, mais precisa para usuários que colam SVGs com XML declaration.
- **Auto-generate aba "Arquivo"**: igual ao `image-editor` — assim que o SVG é carregado e validado, `svgToCanvas(text, SOURCE_SIZE)` gera o canvas 512×512 e dispara `onGenerate(canvas)` automaticamente. Não há mais preview intermediário nem botão "Gerar Favicon" nessa aba.
- **Aba "Código"**: textarea com validação live, sem preview canvas. O botão "Gerar Favicon" aparece apenas quando o código é válido (`svgString !== null`). Clique no botão gera o canvas e transiciona para `PreviewGrid`.
- **Simplificações**: removidos `PREVIEW_SIZE`, `previewCanvasRef`, `drawPreview()`, `handleReset()`, `handleSvgLoaded()` (inlined em `handleFile`), bloco JSX de preview canvas + botões, e o `useEffect` de re-renderização de preview.

---

## Parte 5: Editor de Texto

**Objetivo:** Criar favicon a partir de texto (letra/monograma) com fonte e cores customizáveis.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/text-editor.tsx`
- [x] 2 inputs: texto (1-2 chars) e cor do texto
- [x] Seletor de fonte do sistema (dropdown/select)
- [x] Cor de fundo do quadrado (color picker + presets)
- [x] Preview em canvas
- [x] Renderização para Canvas
- [x] Botão "Gerar Favicon" → `onGenerate(canvas: HTMLCanvasElement)`
- [x] Botão "Voltar"

**Regras de negócio:**
- Texto vazio → mostrar placeholder "A" no preview, mas botão desabilitado
- Fontes carregadas do sistema do usuário (sem carregar Google Fonts externas — evita dependência de rede)
- Canvas gerado em 512x512 para máxima qualidade na exportação

**Critérios de aceitação:**
- Preview atualiza em <100ms após qualquer alteração
- Texto centralizado perfeitamente no quadrado
- Funciona em iOS Safari (algumas fontes podem não existir, fallback para sans-serif)

---

## Parte 6: Editor de Emoji

**Objetivo:** Criar favicon a partir de um emoji com cor de fundo customizável.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/emoji-editor.tsx`
- [x] Grid de emojis organizados por categoria (reaproveitada lista de `src/lib/data/emojis.ts`):
  - 7 categorias existentes: Rostos e emoções, Gestos e pessoas, Animais e natureza, Comida e bebida, Viagens e lugares, Atividades e objetos, Corações e símbolos
  - Mobile: grid 6 colunas (h-10 w-10), desktop: 8-10 colunas
  - Scroll horizontal de chips de categoria no topo + opção "Todos"
- [x] Search/filter: **não implementado** (escolha deliberada por simplicidade — opção 1)
- [x] Emoji selecionado: destaque com ring âmbar + badge abaixo do preview
- [x] Cor de fundo: color picker nativo + 10 presets (padrão: `#F59E0B`)
- [x] Slider de tamanho do emoji: 40% a 90% do canvas (padrão: 70%)
- [x] Preview em tempo real usando Canvas 2D (320×320)
  - Fundo com cor selecionada
  - Emoji centralizado (`fillText` com font-size proporcional)
  - Font stack: `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
- [x] Botão "Gerar Favicon" → `onGenerate(canvas: HTMLCanvasElement)`
- [x] Botão "Voltar"

**Decisão:** Reaproveitada lista existente de `src/lib/data/emojis.ts` sem busca por keyword. Trade-off: menos funcionalidade de busca, mas muito mais rápido de implementar e sem duplicação de dados.

**Critérios de aceitação:**
- [x] Emoji selecionado persiste ao trocar categoria
- [x] Preview renderiza o emoji corretamente
- [x] Performance: renderização do grid não trava em mobile

---

## Parte 7: Preview Grid e Geração dos Tamanhos

**Objetivo:** Após o usuário clicar "Gerar", mostrar todos os tamanhos lado a lado e gerar os blobs.

**Tarefas:**
- [ ] Criar `src/components/tools/favicon-generator/preview-grid.tsx`
- [ ] Recebe `sourceCanvas: HTMLCanvasElement` e `mode: FaviconMode`
- [ ] Gera todos os tamanhos em paralelo usando `Promise.all`:
  ```
  Para cada tamanho em FAVICON_SIZES:
    1. Criar canvas off-screen do tamanho
    2. Desenhar sourceCanvas redimensionado (cover/contain — usar cover para preencher)
    3. Chamar canvas.toBlob() para PNG
    4. Armazenar: { name, width, height, blob, dataUrl }
  ```
- [ ] Gera também o `.ico` (multi-resolução: 16, 32, 48) usando `generateIco()`
- [ ] Layout mobile-first:
  - Grid de previews: 2 colunas no mobile, 4 no tablet, 6 no desktop
  - Cada card mostra: preview da imagem, label com nome e dimensões (ex: "32x32")
  - Preview do 16x16 deve ser ampliado visualmente (renderizado maior com CSS) para o usuário enxergar
- [ ] Estados:
  - Loading: skeleton/shimmer enquanto gera
  - Erro: mensagem se Canvas falhar
- [ ] Botão "Voltar ao editor" — permite ajustar e regenerar
- [ ] Botão "Começar do zero" — volta para seleção de modo

**Critérios de aceitação:**
- Todos os 6 tamanhos + .ico são gerados em <2s no mobile moderno
- Visualização nítida mesmo do 16x16 (ampliada via CSS)
- Estado de loading claro para o usuário

---

## Parte 8: Exportação e Download

**Objetivo:** Permitir ao usuário baixar os arquivos individualmente ou em pacote.

**Tarefas:**
- [x] Criar `src/components/tools/favicon-generator/export-panel.tsx`
- [x] Recebe `files: GeneratedFaviconFile[]` e `icoBlob: Blob`
- [x] Seções:
  1. **Download do pacote .zip**: card destacado com botão primário grande
     - Usa `createZipPackage()` para agrupar 6 PNGs + .ico + site.webmanifest
     - Nome do zip: `favicon-package.zip`
     - Loading state com spinner: "Criando pacote..."
  2. **Downloads individuais**: grid responsivo (2 cols desktop) com mini-preview (24×24), nome, dimensão e botão download
     - Feedback visual: ícone muda para ✓ após download
     - `image-rendering: pixelated` para previews 16×16 e 32×32
     - .ico mostra badge "ICO" (sem preview visual)
  3. **Tags HTML**: bloco de código com `bg-muted` + `CopyButton` no canto
     - Instrução: "Copie e cole dentro da tag `<head>`"
  4. **site.webmanifest**: toggle/accordion com JSON formatado + `CopyButton`
     - Animação de abertura com framer-motion
- [x] Instruções rápidas em card destacado: "Coloque os arquivos na raiz do seu site e cole as tags no `<head>`"
- [x] Layout responsivo: empilhado no mobile, HTML + Manifest lado a lado no desktop (lg:grid-cols-2)
- [x] Integração: `FaviconPreview` wrapper compõe `PreviewGrid` + `ExportPanel` na step "preview"

**Critérios de aceitação:**
- [x] Download de .zip funciona em Chrome, Safari, Firefox
- [x] Tags HTML são copiáveis com um clique
- [x] Cada arquivo individual tem nome correto e extensão correta
- [x] Build passa sem erro ✅

---

## Parte 9: Testes Unitários e SEO

**Objetivo:** Garantir qualidade da lib e visibilidade nos buscadores.

**Tarefas:**
- [ ] Criar `src/lib/image/favicon.test.ts` com Vitest:
  - Testar `generateFaviconPng`: verificar se blob é criado e tem type `image/png`
  - Testar `generateIco`: verificar se blob tem type `image/x-icon` e tamanho > 0
  - Testar `createWebManifest`: verificar se JSON parseia e tem `name`, `icons`
  - Testar `generateHtmlTags`: verificar se contém `<link rel="icon"` e `<link rel="apple-touch-icon"`
  - Testar `createZipPackage`: verificar se blob tem type `application/zip`
- [ ] Adicionar conteúdo SEO em `page.tsx`:
  - `SeoContent()` component com seções:
    - "O que é um favicon?"
    - "Como usar o gerador"
    - "Quais formatos são gerados?"
    - "Como instalar no meu site?"
  - FAQ com 5 perguntas:
    1. O que é um favicon?
    2. Quais tamanhos de favicon são gerados?
    3. Posso usar uma imagem que não é quadrada?
    4. O que é o arquivo site.webmanifest?
    5. Como adicionar o favicon no meu site?
- [ ] Adicionar `RelatedTools` na página
- [ ] Verificar metadata: title, description, keywords
- [ ] Teste manual mobile: iPhone SE (375px), iPhone 14 (390px), Android médio (360px)

**Critérios de aceitação:**
- Todos os testes passam: `pnpm test`
- Build passa: `pnpm run build`
- Lighthouse SEO score ≥ 90

---

## Parte 10: Polish, Animações e Acessibilidade

**Objetivo:** Deixar a ferramenta fluida, bonita e acessível.

**Tarefas:**
- [ ] Animações entre steps:
  - Select → Editor: slide da direita ou fade-in
  - Editor → Preview: fade-in com scale-up sutil
  - Preview → Editor: slide da esquerda
- [ ] Estados de loading:
  - Upload de imagem: spinner no dropzone
  - Geração dos tamanhos: skeleton grid
  - Download do zip: botão com spinner e texto "Criando pacote..."
- [ ] Acessibilidade:
  - Todos os botões com `aria-label` descritivo
  - Inputs com `<label>` associado
  - Color pickers com descrição textual da cor atual
  - Grid de emojis: navegação por teclado (tab + enter)
  - Toast/alert para ações (usar `sonner` já instalado)
- [ ] Dark mode:
  - Verificar que color pickers, canvas previews e cards funcionam no tema escuro
  - Bordas sutis nos cards de preview para separação
- [ ] Performance:
  - Lazy load da lista de emojis (se muito grande, carregar sob demanda)
  - Debounce no slider de tamanho de fonte/emoji (100ms)
  - Liberar object URLs após download (`URL.revokeObjectURL`)
- [ ] Tratamento de erros:
  - Imagem corrompida: mensagem clara + botão "Tentar outra imagem"
  - Canvas não suportado (navegador muito antigo): mensagem informativa
  - Memória insuficiente (imagem muito grande): validar antes de processar

**Critérios de aceitação:**
- Navegação completa via teclado (Tab, Enter, Escape para voltar)
- Animações suaves a 60fps
- Sem memory leaks (URLs revogados)
- Visual consistente nos temas claro e escuro

---

## Resumo de Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| `jszip` | ^3.10 | Criar pacote .zip com todos os arquivos |

> Nota: `fabric` já está instalado mas **não será usado** nesta ferramenta. A complexidade do Fabric.js é desnecessária para favicons simples. Usaremos Canvas 2D nativo que é mais leve, mais rápido e melhor para mobile.

---

## Notas Técnicas

### Geração de .ICO
O formato .ico exige um header específico. Implementação simplificada:
1. Ícone dir header (6 bytes base + 16 bytes por imagem)
2. Para cada tamanho (16, 32, 48):
   - BITMAPINFOHEADER (40 bytes)
   - Dados XOR (pixels RGBA32)
   - Dados AND (máscara de 1bpp, opcional — pode ser tudo 0 para opaco)
3. Concatenar tudo em um Uint8Array e criar Blob

Referência: [favicon.js](https://github.com/johnsorrentino/favicon.js) (usado pelo favicon.io)

### Renderização de SVG no Canvas
Para converter SVG para canvas:
```js
const img = new Image();
const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(svgBlob);
img.onload = () => {
  ctx.drawImage(img, 0, 0, size, size);
  URL.revokeObjectURL(url);
};
img.src = url;
```
Importante: adicionar `width` e `height` ao elemento `<svg>` se não existirem, antes de converter.

### Emojis no Canvas
Emojis são renderizados pelo sistema operacional via fonte emoji nativa. No Canvas:
```js
ctx.font = `${size}px serif`; // 'serif' ou 'sans-serif' funciona como fallback
ctx.fillText(emoji, x, y);
```
Alguns emojis mais novos podem não renderizar em sistemas antigos. Aceitável para v1.

---

## Checklist Final

- [ ] Ícone definido em `tools.ts` (`Image` ou similar do Lucide)
- [ ] Tags relevantes para busca PT-BR
- [ ] Breadcrumb funcional (via PageLayout)
- [ ] SEO metadata (title, description, keywords)
- [ ] Conteúdo SEO na página (seções de texto explicativo)
- [ ] Relacionadas automáticas (via RelatedTools)
- [ ] Responsivo (mobile-first, testado em 320px+)
- [ ] Dark mode compatível
- [ ] CopyButton nos snippets de código
- [ ] Teste unitário para `lib/image/favicon.ts`
- [ ] Build sem erros (`pnpm run build`)
- [ ] Animações entre telas
- [ ] Estados de erro tratados
- [ ] Acessibilidade (labels, aria, keyboard nav)
