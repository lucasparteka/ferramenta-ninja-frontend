# DESIGN.md — Manifesto Visual

> **Esta é a fonte de verdade prescritiva** sobre como o site e as ferramentas
> devem se parecer. Toda IA de código deve ler este documento **antes de
> planejar** qualquer implementação ou refatoração e **depois de implementar**
> para verificar conformidade. Conflitos entre este documento e
> `audit/02-design-system.md` (descritivo, histórico) são resolvidos a favor
> deste documento.

---

## Índice

1. [Filosofia](#1-filosofia)
2. [Os 7 princípios não-negociáveis](#2-os-7-princípios-não-negociáveis)
3. [Sistema de tokens](#3-sistema-de-tokens)
4. [Tipografia](#4-tipografia)
5. [Espaçamento e densidade](#5-espaçamento-e-densidade)
6. [Bordas, raios e sombras](#6-bordas-raios-e-sombras)
7. [Iconografia](#7-iconografia)
8. [Microinteração e movimento](#8-microinteração-e-movimento)
9. [Copywriting](#9-copywriting)
10. [Componentes — anatomia detalhada](#10-componentes--anatomia-detalhada)
11. [Layout — anatomia das páginas](#11-layout--anatomia-das-páginas)
12. [Receitas por tipo de ferramenta](#12-receitas-por-tipo-de-ferramenta)
13. [Anti-padrões — detector de "soft SaaS"](#13-anti-padrões--detector-de-soft-saas)
14. [Checklist pré-implementação](#14-checklist-pré-implementação)
15. [Checklist pós-implementação](#15-checklist-pós-implementação)
16. [Glossário de decisões](#16-glossário-de-decisões)

---

## 1. Filosofia

### O que estamos construindo

Um conjunto de **instrumentos de precisão** acessados pelo navegador. Cada
ferramenta tem uma função clara, executa rápido, dá controle sobre todos os
parâmetros, e o usuário sai com um arquivo ou uma resposta.

Referências mentais corretas:

- **Figma** — densidade, painéis laterais, número exibido em fonte mono ao
  lado de sliders, ícones 16px.
- **Linear** — neutralidade cromática, hierarquia tipográfica sutil, atalhos
  de teclado, quase nenhuma sombra.
- **Vercel Dashboard** — bordas 1px sempre, fundos brancos, primária discreta.
- **Raycast** — densidade extrema, mono em metadados, foco em ação.
- **GitHub UI** — layout em 3 colunas, paleta neutra, badges discretos.

Referências mentais **erradas**:

- Stripe Atlas, Notion, Webflow templates — bonitos mas "produto de venda".
- Landing pages de SaaS B2C — gradientes, ilustrações 3D, "wow factor".
- Material You, iOS Health — corners generosos, animações lúdicas.
- Linktree, Carrd — minimalismo decorativo, não funcional.

### O que comunicamos visualmente

| Comunicamos | Não comunicamos |
|---|---|
| "Foi feito por engenheiros" | "Foi feito por marketeiros" |
| "Cabe muita informação aqui" | "Está vazio para parecer limpo" |
| "Você está no controle" | "A ferramenta sabe o que é melhor pra você" |
| "Isto é uma planta industrial" | "Isto é um app de bem-estar" |
| "Confie nos números" | "Confie no nosso bom gosto" |

### Teste de cheiro

Se ao olhar a tela um terceiro descrever como **"limpinho"**, **"fofo"**,
**"convidativo"** ou **"moderno"** — está errado. As palavras certas são
**"sério"**, **"denso"**, **"profissional"**, **"controlado"**, **"preciso"**.

---

## 2. Os 7 princípios não-negociáveis

1. **Bordas > sombras.** Cada limite visual é uma borda 1px. Sombra existe
   apenas em elementos flutuantes (popover, dropdown, tooltip).
2. **Raios pequenos.** Nada acima de **8px**. Inputs/botões/badges ficam em
   **6px**. Pills e avatars circulares são exceção.
3. **Densidade alta.** Padding interno padrão de seção é 16px (não 24, não
   32). Gaps padrão entre elementos são 8–12px (não 16–24).
4. **Neutralidade dominante.** A primária aparece no máximo **uma vez por
   tela** (o CTA principal). Todo o resto é tons de cinza.
5. **Tipografia hierárquica via tamanho/peso, não cor.** Texto secundário
   pode ser `muted-foreground`, mas headings nunca usam cores quentes.
6. **Mono para dados.** Qualquer número que importa (dimensões, contagens,
   IDs, hashes, tamanhos de arquivo) é renderizado em fonte monoespaçada.
7. **Zero decoração.** Sem gradientes de fundo, sem emoji em UI, sem
   ilustrações, sem badges coloridos só para alegrar.

---

## 3. Sistema de tokens

Tokens definidos em `src/app/globals.css` via `@theme inline`. Use o arquivo
`globals.css.example` deste pacote como base.

### 3.1 Cores — paleta neutra (light)

| Token | Valor (oklch) | Aproximado | Uso |
|---|---|---|---|
| `--background` | `oklch(0.99 0 0)` | `#FCFCFC` | Fundo da página inteira |
| `--foreground` | `oklch(0.14 0 0)` | `#1A1A1A` | Texto principal |
| `--muted` | `oklch(0.97 0 0)` | `#F4F4F5` | Hover de itens, fundo de inputs vazios |
| `--muted-foreground` | `oklch(0.42 0 0)` | `#6B6B6E` | Texto secundário, labels, metadados |
| `--card` | `oklch(1 0 0)` | `#FFFFFF` | Fundo de painéis e cards |
| `--card-foreground` | `oklch(0.14 0 0)` | `#1A1A1A` | Texto sobre card |
| `--border` | `oklch(0.91 0 0)` | `#E5E5E7` | **Toda borda da UI** |
| `--input` | `oklch(0.91 0 0)` | `#E5E5E7` | Borda de input (igual a border) |
| `--ring` | `oklch(0.55 0.16 267)` | (azul/violeta) | Foco visível |
| `--accent` | `oklch(0.96 0.01 267)` | tonal sutil | Hover de itens selecionáveis |
| `--accent-foreground` | `oklch(0.20 0.10 267)` | | Texto sobre accent |

### 3.2 Cores — semânticas

A primária é **discreta** e usada com parcimônia. Não é "marca", é "ação".

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `oklch(0.55 0.16 267)` | CTA principal por tela. Links em prosa. |
| `--primary-foreground` | `oklch(0.99 0.01 267)` | Texto sobre primary |
| `--destructive` | `oklch(0.55 0.20 27)` | Excluir, remover, alertas críticos |
| `--destructive-foreground` | `oklch(0.99 0.01 27)` | Texto sobre destructive |
| `--success` | `oklch(0.56 0.13 150)` | Confirmação ("Copiado!", "Salvo") |
| `--warning` | `oklch(0.65 0.13 75)` | Atenção, valores próximos a limite |
| `--warning-surface` | light: `oklch(0.976 0.016 72)` / dark: `oklch(0.215 0.024 76)` | Fundo de banners de aviso — creme quente (light) / escuro quente (dark) |
| `--warning-line` | light: `oklch(0.862 0.038 72)` / dark: `oklch(0.462 0.082 78)` | Borda de banners de aviso — pedra quente (light) / âmbar médio (dark) |
| `--info` | `oklch(0.55 0.13 220)` | (opcional) — evite, prefira muted |

> Os tokens `success` e `warning` **devem existir** em `globals.css` —
> hoje estão referenciados em `result-box.tsx` mas não declarados (ver
> `audit/03-inconsistencies.md` itens 2–4).

### 3.3 Cores — dark mode

Mesma estrutura, valores invertidos. Conforme `globals.css.example`. Regra
crítica: **mantenha a hierarquia entre `background → card → muted`**. Se em
light o card é mais claro que o background, em dark o card é mais claro que
o background (não pode inverter a relação).

### 3.4 Quando usar cada cor

| Quero pintar | Use | Não use |
|---|---|---|
| Texto principal | `text-foreground` | `text-black`, `text-gray-900` |
| Texto auxiliar (labels, metadados) | `text-muted-foreground` | `text-gray-500` |
| Borda de qualquer container | `border-border` | `border-gray-200` |
| Fundo de seção principal | `bg-background` | branco hardcoded |
| Fundo de painel/card | `bg-card` | branco hardcoded |
| Fundo de hover discreto | `hover:bg-muted` | `hover:bg-gray-100` |
| Fundo de hover seletivo | `hover:bg-accent` | cor inventada |
| CTA único da tela | `bg-primary text-primary-foreground` | gradiente, neon |
| Erro inline | `text-destructive border-destructive/40 bg-destructive/5` | `bg-red-100` |
| Confirmação ephemeral | `text-success` | `bg-green-100` |
| Fundo/borda de banner de aviso | `bg-warning-surface border-warning-line` | `bg-warning/5 border-warning/30`, `bg-amber-*` |

### 3.5 O que **nunca** fazer com cor

- **Nunca** use classes Tailwind de paleta (`bg-blue-500`, `text-gray-700`,
  etc) em código de produção. Apenas tokens semânticos.
- **Nunca** use hex/rgb hardcoded em JSX/TSX, exceto em conteúdo dinâmico do
  usuário (color picker, swatches que ele escolhe).
- **Nunca** invente cores via `oklch(...)` inline.
- **Nunca** aplique `bg-primary` em mais de um elemento por tela. Se precisa
  de "destaque secundário", use borda primary com fundo neutro.
- **Nunca** use gradiente como fundo de container, hero, ou card.

---

## 4. Tipografia

### 4.1 Família

Duas famílias, carregadas via `next/font/google` (não via `<link>`):

- **Inter** — sans-serif para todo o chrome (títulos, labels, botões, prose)
- **JetBrains Mono** — para números, métricas, códigos, hashes, IDs

Configuradas em `app/layout.tsx` como CSS variables `--font-sans` e `--font-mono`. O `globals.css` declara apenas os fallbacks de sistema, que entram em ação se o Google Fonts falhar.

> Razão: ferramentas precisam de FCP rápido. `next/font` faz self-hosting com font-display swap, então não há FOIT nem round-trip pro CDN do Google.

> Exceção: **fontes selecionáveis dentro de uma ferramenta** (ex: editor de texto do gerador de favicon). Aí carrega via `<link>` — é conteúdo da ferramenta, não chrome.

### 4.2 Escala (pixel-exact)

| Uso | Classe | Tamanho | Peso | Tracking |
|---|---|---|---|---|
| **H1 página** (título da ferramenta) | `text-2xl font-semibold tracking-tight` | 24px | 600 | -0.01em |
| **H2 seção principal** | `text-base font-semibold` | 16px | 600 | normal |
| **H3 subseção** | `text-sm font-semibold` | 14px | 600 | normal |
| **Section header** (ALL CAPS) | `text-caption font-semibold uppercase tracking-wider text-muted-foreground` | 11px | 600 | 0.05em |
| **Corpo padrão** | `text-sm` | 14px | 400 | normal |
| **Corpo descritivo grande** | `text-base text-muted-foreground` | 16px | 400 | normal |
| **Label de input** | `text-xs font-medium` | 12px | 500 | normal |
| **Texto auxiliar / hint** | `text-xs text-muted-foreground` | 12px | 400 | normal |
| **Microcopy / metadata** | `text-caption text-muted-foreground` | 11px | 400 | normal |
| **Mono — números** | `font-mono text-xs` ou `text-caption` | 11–12px | 400 | normal |
| **Mono — código inline** | `font-mono text-caption bg-muted px-1 py-0.5 rounded-sm` | 11px | 400 | normal |
| **Mono — bloco de código** | `font-mono text-caption leading-relaxed` | 11px | 400 | normal |

### 4.3 Regras

- **Nunca** use `font-bold` (peso 700) em UI chrome. `font-semibold` (600) é
  o teto. Razão: 700 dá ar de marketing.
- **Nunca** use `text-3xl`, `text-4xl`, `text-5xl` em página de ferramenta.
  O título é `text-2xl` (24px) e ponto. Tipografia gigante é landing page.
- **Sempre** use `tracking-tight` em títulos `text-2xl+`. System fonts em
  tamanhos grandes ficam excessivamente espaçadas no default.
- **Sempre** use `tracking-wider` em ALL CAPS metadata (`text-caption`).
- **Sempre** use mono para dimensões (`512×512`), tamanhos (`24KB`), IDs,
  hashes, contadores, percentuais ao lado de sliders.
- `text-pretty` em parágrafos longos (descrições, FAQ).
- `text-wrap: balance` em títulos de página (`h1`).
- **Sempre** use mono para conteúdo cujo valor primário é numérico, código ou identificador técnico — ver § 4.5 abaixo.
- **Sempre** acompanhar mono de `tabular-nums` (já garantido globalmente em `.font-mono`). Sem isso, o ganho de mono é metade.
- **Nunca** use mono em labels, hints, opções de seleção, status humanizado, botões ou prose.

### 4.4 Hierarquia em uma ferramenta — exemplo

```tsx
{/* Página */}
<h1 className="text-2xl font-semibold tracking-tight text-foreground">
  Gerador de favicon
</h1>
<p className="mt-1 text-sm text-muted-foreground">
  Gere favicons em PNG e ICO a partir de imagem, SVG, texto ou emoji.
</p>

{/* Seção dentro da ferramenta */}
<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
  Origem
</h3>

{/* Label de input */}
<label className="text-xs font-medium text-foreground">
  Cor de fundo
</label>

{/* Metadata em mono */}
<span className="font-mono text-caption text-muted-foreground">
  512×512 · 24KB
</span>
```

### 4.5 Regra dos números

| Categoria | Mono? | Exemplos |
|---|---|---|
| Valores monetários | ✅ | `R$ 8.800,00`, `R$ 26.671,33` |
| Métricas e contadores | ✅ | `52 chars`, `142 palavras`, `+37%` |
| Tempos e durações | ✅ | `90 dias`, `2.1ms`, `20a 0m` |
| Datas em formato curto | ✅ | `01/01/2026`, `2026-05-09` |
| Dimensões e tamanhos | ✅ | `512×512`, `24KB` |
| Códigos e normas | ✅ | `RFC 4648`, `sha256:a7f3…`, `cs:fa3b` |
| Conteúdo técnico em I/O | ✅ | texto base64, URL-encoded, JSON |
| Adornos numéricos em inputs | ✅ | `R$` à esquerda do campo |
| Labels de campos | ❌ | "Salário bruto mensal" |
| Opções de select/radio | ❌ | "Demissão sem justa causa" |
| Status humano | ❌ | "Com direito", "Pronto", "Aguardando" |
| Hints e descrições | ❌ | "Em branco usa estimativa de 8%" |
| Botões | ❌ | "Copiar resumo", "Gerar texto" |

**Inputs**: `type="number"`, `type="date"`, `type="time"` e `inputmode="decimal|numeric"` recebem `font-family: var(--font-mono)` automaticamente via seletor global em `globals.css`. Você não precisa adicionar `font-mono` manualmente nesses casos.

**Casos limítrofes**:
- Tabela com muitos valores numéricos em prose: pode usar `Inter + tabular-nums` se o mono "roubar personalidade" — escolha estética. Mantenha consistência dentro da mesma tabela.
- Quantidade isolada em meio a texto ("3 parágrafos" em legenda): mono se for o foco, sans se for prosa fluida.

---

## 5. Espaçamento e densidade

### 5.1 Escala (4px base)

Use **somente** estes valores. Não invente `gap-7`, `p-5` em casos esquisitos.

| Token Tailwind | Valor | Uso típico |
|---|---|---|
| `0.5` | 2px | Separadores hairline (raro) |
| `1` | 4px | Gap entre ícone e texto adjacente |
| `1.5` | 6px | Gap entre ícone e label em `text-caption` |
| `2` | 8px | Gap entre elementos de um cluster (botões agrupados) |
| `3` | 12px | Gap entre rows de um form, entre cards em grid |
| `4` | 16px | **Padding padrão de seção dentro de painel** |
| `5` | 20px | Padding de painel principal |
| `6` | 24px | Gap entre seções dentro de uma coluna |
| `8` | 32px | Gap entre blocos maiores (preview ↔ grid de tamanhos) |
| `10`, `12` | 40, 48px | Margens de página |
| `16` | 64px | Padding vertical em landing/SEO blocks |

### 5.2 Regras

- **Padding interno de painel/card:** `p-4` (16px) é o default. `p-5`
  (20px) só em painel principal de tela. **Nunca** `p-6` ou `p-8`.
- **Padding interno de seção dentro de painel:** `py-3` (12px vertical),
  separado do próximo por `border-t border-border`.
- **Gap entre rows de form:** `space-y-3` (12px). **Nunca** `space-y-6`.
- **Gap entre seções principais da página:** `space-y-6` (24px).
- **Gap entre painéis em layout 3-colunas:** `gap-4` (16px).
- **Margem em torno do título da página:** `space-y-1` entre `h1` e
  descrição. Não `space-y-2`, não `space-y-4`.

### 5.3 Hit targets

- Botão `default`: altura 36px (`h-9`).
- Botão `sm`: altura 32px (`h-8`).
- Botão `xs`: altura 24px (`h-6`) — só em barras de ferramentas densas.
- Inputs: altura 36px (`h-9`).
- Itens de lista clicáveis em mobile: mínimo 44px de altura efetiva (use
  `py-2.5` + altura natural do conteúdo).

---

## 6. Bordas, raios e sombras

### 6.1 Border radius

```css
--radius: 0.375rem; /* 6px — base */
```

Derivados via `@theme inline`:

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 2px | Code inline, badges minúsculos |
| `rounded` | 4px | Tags, chips |
| `rounded-md` | 6px | **Inputs, botões, cards padrão** |
| `rounded-lg` | 8px | Painéis grandes, dialogs |
| `rounded-xl` | 10px | (raro) modals fullscreen, tooltips ricos |
| `rounded-full` | 9999px | Apenas circulares (avatar, dot indicator) |

**Nunca** `rounded-2xl`, `rounded-3xl`, `rounded-[12px]+`.

**Nunca** misture raios em uma mesma escala visual. Se um botão é `rounded-md`,
o input ao lado é `rounded-md`. Se o painel é `rounded-lg`, todos os painéis
da tela são `rounded-lg`.

### 6.2 Bordas

- **Toda** caixa de UI (input, botão outline, card, painel, dialog, popover)
  tem `border border-border` (1px sólido).
- Separação interna em painel: `divide-y divide-border` ou `border-t border-border`
  na seção. **Nunca** sombra interna como separador.
- Borda de input em foco: `border-ring ring-2 ring-ring/30`. **Não** use
  `ring-4`, **não** use `ring-offset`.
- Borda em elementos seletivos ativos: `border-primary` (destaque) ou
  `border-foreground/30` (neutro).

### 6.3 Sombras

**Filosofia:** sombra significa "eu floto acima da camada da página". Se o
elemento está em fluxo, ele não floto. Logo: cards, painéis, inputs e
botões **não levam sombra**.

| Onde usar | Token | Valor |
|---|---|---|
| Popover, dropdown, tooltip | `shadow-md` | `0px 4px 8px 0px rgb(0 0 0 / 0.06)` |
| Dialog (modal) | `shadow-lg` | `0px 12px 24px 0px rgb(0 0 0 / 0.10)` |
| Toast | `shadow-lg` | idem |
| Header sticky (acentuar separação no scroll) | `shadow-xs` | `0px 1px 0px rgb(0 0 0 / 0.04)` |

**Nunca:** sombra em card, painel, input, botão, badge, tab.

### 6.4 Painéis conectados vs. cards flutuantes

Painéis que compõem uma mesma ferramenta formam um instrumento único, não uma coleção de cards independentes. A regra:

O container externo tem border border-border rounded-lg overflow-hidden
Divisões internas usam border-r, border-b ou divide-* — nunca gap com bordas individuais em cada painel
gap-* entre painéis de uma ferramenta é proibido — gap cria separação física entre objetos; border cria compartimentos dentro de um objeto

```tsx
{/* ✅ Correto — instrumento */}
<div className="rounded-lg border border-border overflow-hidden grid grid-cols-[280px_1fr_300px]">
  <div className="border-r border-border p-4">...</div>
  <div className="border-r border-border p-4">...</div>
  <div className="p-4">...</div>
</div>

{/* ❌ Errado — brinquedo */}
<div className="grid grid-cols-[280px_1fr_300px] gap-4">
  <div className="rounded-lg border border-border p-4">...</div>
  <div className="rounded-lg border border-border p-4">...</div>
  <div className="rounded-lg border border-border p-4">...</div>
</div>
```

A única exceção é o layout B (calculadoras) onde o painel de resultado pode ser um card separado quando há hierarquia clara de principal → complementar.

---

## 7. Iconografia

### 7.1 Biblioteca

- **lucide-react** — única lib de ícones permitida.
- **Não** misturar com Heroicons, Phosphor, Tabler, Material Icons.
- **Não** desenhar ícones SVG inline em JSX (exceção: logo do site).

### 7.2 Tamanhos

| Contexto | Tamanho | Classe |
|---|---|---|
| Inline em label/badge | 12px | `h-3 w-3` |
| Em metadata `text-caption` | 12px | `h-3 w-3` |
| Em botão `xs` | 14px | `h-3.5 w-3.5` |
| Em botão padrão | 14px | `h-3.5 w-3.5` |
| Em input/icon button padrão | 16px | `h-4 w-4` |
| Em "ícone hero" de empty state | 20px | `h-5 w-5` |
| **Nunca** acima de 24px | — | — |

### 7.3 Stroke

`lucide-react` default é `strokeWidth={2}`. Use **`strokeWidth={1.75}`** em
ícones decorativos/empty states para parecer mais técnico. Botões e ações
deixe no default 2.

### 7.4 Cor

- Em chrome neutro (toolbars, listas): `text-muted-foreground`.
- Em ação primária (dentro de botão primary): herda do texto.
- **Nunca** colorir ícones com `text-blue-500`, `text-green-600` etc. Estado
  e cor ficam por conta do componente que os contém.

### 7.5 Quando NÃO usar ícone

- Em botão com label claro: o ícone é redundante. Só adicione se ajuda
  scanabilidade em uma toolbar densa.
- Em hero de página de ferramenta: nunca. O título já é claro.
- Em ALL-CAPS section header: nunca. O texto já é o âncora.

---

## 8. Microinteração e movimento

### 8.1 Princípios

- Animação serve **transição de estado**, nunca decoração.
- Duração padrão: **150ms** (`duration-150`). Qualquer coisa acima de 250ms
  é lento demais para uma ferramenta.
- Curva: `ease-out` para entrada, `ease-in` para saída, `ease-in-out` para
  transformações reversíveis.

### 8.2 Permitido

- Fade + leve slide (`translate-y-1` → `translate-y-0`) na entrada de
  popovers, dropdowns, dialogs.
- `opacity-0 → opacity-100` em revelação de conteúdo gerado (preview, lista).
- `scale-95 → scale-100` em entrada de dialogs (combinado com fade).
- `active:translate-y-px` em botões (pressed state).
- `transition-colors` em hovers (background, border).

### 8.3 Proibido

- `hover:scale-105` em cards. Soft SaaS clássico.
- `hover:rotate-*`. Lúdico demais.
- Spring physics, bouncing.
- Glass morphism, blur grande, parallax.
- Animação de loop infinito que não comunique progresso (gradientes
  movendo, partículas).

### 8.4 Loading

- Spinner: `<Loader2 className="animate-spin" />` em 14–16px.
- Skeleton: `<div className="animate-pulse bg-muted rounded-md" />` com a
  mesma altura do conteúdo final. **Nunca** shimmer animado, **nunca** com
  gradiente.
- Botão durante ação: ícone `Loader2` à esquerda do texto, label muda para
  gerúndio ("Gerando...", "Salvando...").

---

## 9. Copywriting

### 9.1 Tom

- **Direto e técnico.** O usuário é um adulto que veio fazer uma tarefa.
- **Português brasileiro** (instruction explícita do `AGENTS.md`).
- **Verbos no imperativo** em CTAs: "Gerar favicon", "Baixar .zip", "Copiar".
- **Sem exclamação.** "Pronto!" → "Pronto." ou "Concluído.".
- **Sem expressões de hospitalidade.** "Vamos começar!", "Bem-vindo!", "É
  só clicar aqui!" estão proibidos.
- **Sem perguntas retóricas.** "Que tal um favicon?" → "Insira sua imagem".

### 9.2 Capitalização

| Onde | Estilo | Exemplo |
|---|---|---|
| Título de página (`h1`) | Sentence case | "Gerador de favicon" |
| Section header ALL CAPS | UPPERCASE | "ORIGEM" |
| Label de input | Sentence case | "Cor de fundo" |
| Botão | Sentence case | "Gerar favicon" |
| Tab | Sentence case | "Imagem" |
| Tooltip / hint | Sentence case + ponto final | "Aceita PNG, JPG, WebP." |

**Nunca** Title Case ("Gerador De Favicon", "Cor De Fundo"). Português
brasileiro não usa Title Case — fica falso.

### 9.3 Tamanhos

- Título de página: 2–6 palavras. Se passou, é descrição.
- Descrição da página (subtítulo): 1 frase, máx 20 palavras.
- Label de input: 1–3 palavras.
- Hint abaixo do input: 1 frase, máx 12 palavras.
- Botão: 1–3 palavras. Se passou, simplifique.

### 9.4 Mensagens de estado

| Estado | Padrão |
|---|---|
| Vazio | "Envie uma imagem para começar" |
| Loading | "Gerando..." (gerúndio + reticências) |
| Sucesso | "Copiado", "Salvo" (sem exclamação, sem ícone só de marketing) |
| Erro | Frase declarativa: "Não foi possível ler o arquivo." |
| Confirmação destrutiva | "Excluir" (não "Sim, tenho certeza") |

---

## 10. Componentes — anatomia detalhada

Cada componente abaixo descreve **estrutura DOM**, **classes obrigatórias**,
**variantes**, **quando usar/quando não**.

### 10.1 Button (`<Button>`)

Base: `src/components/ui/button.tsx` (cva).

**Variantes:**

| Variante | Visual | Quando usar |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | **Único CTA da tela** (gerar, salvar, baixar zip) |
| `secondary` | `bg-secondary text-secondary-foreground border border-border` | Ação secundária ao lado do CTA primário |
| `outline` | `bg-background border border-border hover:bg-muted` | Ações neutras (cancelar, voltar, alternar arquivo) |
| `ghost` | `hover:bg-muted` | Ícones em toolbars, ações de baixa hierarquia |
| `destructive` | `bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20` | Excluir, remover |
| `link` | `text-primary underline-offset-4 hover:underline` | Links inline em prosa apenas |

**Tamanhos:**

| Tamanho | Altura | Padding-x | Texto |
|---|---|---|---|
| `xs` | 24px (`h-6`) | 8px (`px-2`) | `text-caption` |
| `sm` | 32px (`h-8`) | 12px (`px-3`) | `text-xs` |
| `default` | 36px (`h-9`) | 16px (`px-4`) | `text-sm` |
| `lg` | 40px (`h-10`) | 24px (`px-6`) | `text-sm` |
| `icon-xs` | 24px quadrado | — | — |
| `icon-sm` | 32px quadrado | — | — |
| `icon` | 36px quadrado | — | — |

**Regras:**

- Apenas **um** `variant="default"` por tela. Se você precisa de dois CTAs,
  o segundo é `outline` ou `secondary`.
- Ícone à esquerda do texto: `<Icon className="mr-2 h-3.5 w-3.5" />`. Para
  `size="xs"` use `mr-1.5 h-3 w-3`.
- `disabled` aplica `opacity-50 pointer-events-none` automaticamente.
- Loading: troque o ícone por `<Loader2 className="animate-spin ..." />`.

### 10.2 Input (`<Input>`)

Base: `src/components/ui/input.tsx`.

```tsx
<Input
  id="favicon-text"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Ex: A, AB, JS"
/>
```

**Regras:**

- Altura `h-9` (36px). Sem variantes de tamanho.
- Border `border-input` (1px), radius `rounded-md` (6px).
- Foco: `border-ring ring-2 ring-ring/30`. **Nunca** `ring-4`, **nunca**
  `ring-offset-2`.
- `aria-invalid="true"` aplica `border-destructive ring-destructive/20`.
- Sempre acompanhado de **label** acima OU placeholder declarativo (não
  ambos).

### 10.3 Label

```tsx
<label
  htmlFor="favicon-text"
  className="text-xs font-medium text-foreground"
>
  Texto do favicon
</label>
```

- 12px, peso 500, cor foreground (não muted).
- Sempre `htmlFor` apontando para o `id` do input.
- Em forms RHF, use `<FormLabel>` do shadcn — já segue esse padrão.
- **Nunca** label flutuante (Material Design). **Nunca** placeholder
  fingindo ser label.

### 10.4 NativeSelect (`<NativeSelect>`)

Use `<NativeSelect>` em vez de Radix Select para reduzir peso. Já existe em
`src/components/ui/select-native.tsx`.

```tsx
<NativeSelect
  value={fontFamily}
  onChange={(e) => setFontFamily(e.target.value)}
  className="w-full"
>
  <optgroup label="Sistema">
    <option value="...">...</option>
  </optgroup>
</NativeSelect>
```

- Mesma altura/borda/raio do `<Input>`.
- Chevron lucide à direita.
- `<optgroup>` é encorajado para grupos lógicos (sistema vs Google fonts).

### 10.5 Section header (dentro de painel)

Padrão único — **toda** seção interna em painel começa com:

```tsx
<div className="space-y-2">
  <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
    Origem
  </h3>
  {/* conteúdo da seção */}
</div>
```

- 11px ALL CAPS, peso 600, tracking 0.05em, cor muted-foreground.
- **Sem** ícone à esquerda.
- Quando há múltiplas seções verticalmente: separe por `border-t border-border pt-4`
  na seção seguinte.

### 10.6 Card / Painel

Não use `<Card>` do shadcn em ferramentas (ele tem padding/sombra que não
seguem este manifesto). Use `<div>` com classes:

```tsx
<div className="rounded-md border border-border bg-card p-4">
  {/* conteúdo */}
</div>
```

- `rounded-md` (6px), `border` (1px), `bg-card` (branco/quase-branco).
- **Sem** `shadow-*`.
- Padding `p-4` em painéis padrão. `p-5` apenas em painel hero. `p-3` em
  cards densos (lista de tamanhos exportados, swatches).

### 10.7 Tabs / Mode switcher

Para alternar entre modos de uma ferramenta (favicon: imagem/svg/texto/emoji),
use **botões verticais** na coluna esquerda — não tabs horizontais. Padrão:

```tsx
<div className="space-y-1">
  {modes.map(mode => (
    <button
      key={mode.value}
      type="button"
      onClick={() => setMode(mode.value)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
        active === mode.value
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <mode.icon className="h-3.5 w-3.5" />
      {mode.label}
    </button>
  ))}
</div>
```

Para tabs horizontais (apenas 2–3 opções rápidas), use `<OptionSwitch>` que
já existe em `src/components/shared/option-switch.tsx`.

### 10.8 Slider (controle de número)

Padrão: label à esquerda, valor à direita em mono, slider full-width abaixo.

```tsx
<div className="space-y-1.5">
  <div className="flex items-center justify-between">
    <label htmlFor="size" className="text-xs font-medium text-foreground">
      Tamanho
    </label>
    <span className="font-mono text-caption text-muted-foreground">
      {value}%
    </span>
  </div>
  <Slider id="size" min={20} max={100} value={value} onChange={setValue} />
</div>
```

- O número **sempre** em mono.
- Unidade (`%`, `px`, `°`) sem espaço antes em valores percentuais, com
  espaço em outros (`24 px`, `45 °`).

### 10.9 Color field (entrada de cor)

```tsx
<div className="flex items-center gap-2">
  <input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent"
  />
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="font-mono text-xs"
    placeholder="#000000"
  />
</div>
```

- Swatch 32px quadrado à esquerda, input mono à direita.
- Valor sempre em hex (lowercase é opcional, mas seja consistente — eu
  recomendo UPPERCASE).
- Para presets/swatches predefinidos: linha de 6–8 quadrados 24px (`h-6 w-6`)
  com `rounded-sm border border-border` separados por `gap-1`.

### 10.10 Preview frame (canvas + grid)

Para ferramentas que mostram um preview do output (favicon, QR code,
imagem):

```tsx
<div className="rounded-md border border-border bg-card p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
      Preview
    </h3>
    <span className="font-mono text-caption text-muted-foreground">
      512×512
    </span>
  </div>
  <div className={cn(
    "flex aspect-square items-center justify-center rounded border border-border",
    transparent && "checkerboard-bg"
  )}>
    <canvas ref={canvasRef} />
  </div>
</div>
```

- Canvas com `aspect-square` ou proporção exata do output.
- Para fundos transparentes: classe `.checkerboard-bg` (já em globals.css).
- Borda 1px ao redor do canvas, **sem** sombra.

### 10.11 Result block

Quando uma ferramenta gera um resultado a ser baixado/copiado, o bloco
final é:

```tsx
<section className="rounded-md border border-border bg-card p-4 space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold">Pacote pronto</h3>
      <p className="text-xs text-muted-foreground">
        6 tamanhos PNG + favicon.ico + manifest
      </p>
    </div>
    <Button onClick={onDownload}>
      <Download className="mr-2 h-3.5 w-3.5" />
      Baixar .zip
    </Button>
  </div>
  {/* listagem detalhada abaixo */}
</section>
```

### 10.12 Empty state

```tsx
<div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 p-8 text-center">
  <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
  <p className="text-sm text-foreground">Envie uma imagem para começar</p>
  <p className="text-xs text-muted-foreground">PNG, JPG, WebP · até 10MB</p>
</div>
```

- Borda **tracejada** (`border-dashed`) — único caso onde dashed é OK.
- `bg-muted/40` (ou `bg-muted/30` em dark) para diferenciar de painel ativo.
- Ícone 20px com stroke 1.75.

### 10.13 Erro inline

```tsx
<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
  <div className="flex items-start gap-2">
    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
    <p className="text-xs text-destructive">
      Não foi possível ler o arquivo. Tente um PNG ou JPG válido.
    </p>
  </div>
</div>
```

- Em forms RHF use `<FormMessage>`. Erro genérico fora de form usa o bloco
  acima.
- Cor destructive não é `bg-red-100`. É `border-destructive/30 bg-destructive/5`.

### 10.14 Toast (sonner)

Hoje `<Toaster>` está disponível mas não é usado (audit item 29).

**Use toast quando:** ação aconteceu fora do contexto visual atual ("Copiado"
quando o botão está em outra parte da tela), ou ação assíncrona terminou
("Pacote gerado").

**Não use toast para:** validação inline (use `FormMessage`), preview
imediato (use o canvas), confirmação destrutiva (use Dialog).

Sonner config recomendada (`<Toaster>` no `layout.tsx`):

```tsx
<Toaster
  position="bottom-right"
  toastOptions={{
    classNames: {
      toast: "rounded-md border border-border bg-card text-foreground",
      description: "text-muted-foreground text-xs",
      actionButton: "bg-primary text-primary-foreground",
    },
  }}
/>
```

---

## 11. Layout — anatomia das páginas

### 11.1 Site shell

```
<Header>                    ← sticky top-0, h-14, border-b border-border, bg-background/80 backdrop-blur
  <main>
    <PageLayout>            ← max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
      <Breadcrumb />        ← text-xs muted-foreground, separator chevron
      <header>              ← space-y-1
        <h1>title</h1>
        <p>description</p>
      </header>
      <Separator />         ← border-t my-6
      {tool}                ← componente da ferramenta
      <RelatedTools />      ← border-t pt-8 mt-8
      <SeoContent />        ← prose dn:prose-invert max-w-none
      <Faq />
    </PageLayout>
  </main>
<Footer>                    ← border-t border-border, py-12
```

**Mudanças vs layout atual:**
- `py-12` da PageLayout → `py-8` (32px) — economiza scroll.
- `text-3xl` do h1 → `text-2xl` (24px).
- Header `h-16` → `h-14` (56px).
- Footer 5-coluna fica, mas reduzir gap interno (`gap-8` → `gap-6`).

### 11.2 Tool page anatomy — 3 padrões canônicos

#### A) **3 painéis** — para ferramentas com input, preview e ajustes

Use quando: o usuário ajusta parâmetros e o output muda em tempo real
(favicon generator, QR code, imagem).

```
┌─────────────────────────────────────────────────────────────────┐
│  Sticky header com título + CTA principal à direita             │
├──────────────┬───────────────────────────┬───────────────────────┤
│              │                            │                       │
│  Esquerda    │       Centro               │       Direita         │
│  (input/     │       (preview vivo)       │       (estilo)        │
│   modos)     │                            │                       │
│              │                            │                       │
│  280px       │       flex-1               │       320px           │
│              │                            │                       │
└──────────────┴───────────────────────────┴───────────────────────┘
```

Implementação: `grid grid-cols-[280px_1fr_320px] gap-4`.

#### B) **Form vertical + result inline** — para calculadoras

Use quando: o usuário preenche um form e clica calcular; o resultado
aparece abaixo.

```
┌──────────────────────────────┐
│  Title + descrição           │
├──────────────────────────────┤
│  Form (max-w-2xl)            │
│  └ rows com space-y-3        │
├──────────────────────────────┤
│  [ Calcular ]                │
├──────────────────────────────┤
│  ResultBox (após submit)     │
└──────────────────────────────┘
```

Implementação: `max-w-2xl mx-auto space-y-6`.

#### C) **Input → output** — para conversores

Use quando: input de um lado, output do outro, transformação síncrona.

```
┌────────────────────┬────────────────────┐
│  Input (textarea)  │  Output (read-only)│
│                    │                    │
└────────────────────┴────────────────────┘
```

Implementação: `grid md:grid-cols-2 gap-4`. Sem botão "converter" — atualiza
ao digitar.

### 11.3 Header sticky de ferramenta (no padrão A)

Em ferramentas com layout 3-painéis, o título da página vira sticky:

```tsx
<div className="sticky top-14 z-10 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Gerador de favicon</h1>
      <p className="text-xs text-muted-foreground">PNG, ICO, manifest</p>
    </div>
    <Button onClick={handleGenerate} disabled={!canGenerate}>
      Gerar favicon
    </Button>
  </div>
</div>
```

---

## 12. Receitas por tipo de ferramenta

### 12.1 Gerador (favicon, QR, signature)
→ Usar layout **A (3 painéis)**. CTA único no header sticky. Resultado
inline abaixo do shell, não em rota separada.

### 12.2 Calculadora (rescisão, salário líquido, férias)
→ Usar layout **B**. Form RHF+Zod canônico, ResultBox abaixo. Sem 3 painéis.

### 12.3 Conversor (CSV→JSON, JSON formatter, base64)
→ Usar layout **C**. Sem botão de ação — transformação ao digitar.
Botão único no canto superior direito é "Copiar resultado".

### 12.4 Visualizador (CSV viewer, meta tag preview)
→ Layout **C** ou **B** dependendo se há configurações. Read-only do lado
do output.

### 12.5 Inspector (consulta CEP, CNPJ, FIPE)
→ Layout **B** com input compacto + ResultGrid abaixo. Estados de loading
com Skeleton.

---

## 13. Anti-padrões — detector de "soft SaaS"

Se você terminou de implementar e qualquer item abaixo é **verdadeiro**, há
correção a fazer:

- [ ] Algum elemento usa `rounded-2xl` ou `rounded-3xl`.
- [ ] Algum card/painel/input/botão tem `shadow-*` (exceto popover/dialog/toast/header sticky).
- [ ] Existe `bg-gradient-*` ou `bg-[linear-gradient(...)]` em chrome.
- [ ] Algum h1 está em `text-3xl`+ ou `font-bold`.
- [ ] Mais de um `<Button variant="default">` na mesma tela.
- [ ] Cor hardcoded (`text-blue-500`, `bg-[#FFE]`, `text-[#xxx]`) em chrome.
- [ ] Uma "pill" de status com emoji decorativo (✨, 🚀, 💎).
- [ ] `hover:scale-105` em card.
- [ ] Texto auxiliar em fonte sans para um número que cabe em mono.
- [ ] Padding de seção `p-6` ou maior.
- [ ] Ícone com `text-blue-500`/`text-green-600` colorido independente do contexto.
- [ ] Label flutuante (estilo Material).
- [ ] Spinner em loop infinito sem progresso visível.
- [ ] CTA com 5+ palavras ("Vamos gerar seu favicon agora!").
- [ ] Title Case em label/botão em português ("Gerar Favicon" → errado).
- [ ] Empty state com ilustração SVG colorida.
- [ ] Border `border-2` em qualquer lugar (1px é o teto).
- [ ] Espaçamento entre cards em grid > `gap-3`.
- [ ] `text-pretty` ausente em parágrafo descritivo de 2+ linhas.
- [ ] Mais de uma família de fonte na mesma tela (sans + mono é o limite).

---

## 14. Checklist pré-implementação

Antes de começar a planejar uma refatoração ou nova ferramenta, responda:

1. **Qual layout (A/B/C)?** Justifique em uma frase.
2. **Qual o CTA único da tela?** Se há mais de um, repense.
3. **Quais seções terá o painel principal?** Liste os section headers em
   ALL CAPS.
4. **Que dado é numérico?** Esses precisam estar em mono.
5. **Que tokens de cor semântica este componente usa?** Liste por nome
   (foreground, muted-foreground, border, primary, etc.) — se algum não
   está na lista da seção 3, NÃO crie cor nova.
6. **Há estado de erro? Estado vazio? Estado loading?** Cada um tem padrão
   na seção 10.12–10.13.
7. **Há controle de cor pelo usuário?** Se sim, use o padrão 10.9 e nunca
   permita "qualquer cor" sem swatches sugeridos.
8. **Há modal/dialog?** Se for confirmação simples, talvez não precise —
   inline é mais denso.
9. **Estou copiando padrão de outra ferramenta?** Liste qual e cole o
   trecho de referência.
10. **Quantos web fonts vou carregar?** Default: zero.

---

## 15. Checklist pós-implementação

Faça uma varredura rápida da tela renderizada e confirme:

### Estrutura
- [ ] Página segue layout A/B/C escolhido.
- [ ] H1 é `text-2xl font-semibold tracking-tight`.
- [ ] Existe **um único** CTA primary.
- [ ] Section headers são `text-caption uppercase tracking-wider muted-foreground`.

### Tokens
- [ ] Nenhum hex/rgb/cor de paleta Tailwind (`bg-blue-500` etc) em chrome.
- [ ] Toda borda usa `border-border`.
- [ ] Todo fundo usa `bg-background`, `bg-card`, `bg-muted` ou `bg-accent`.
- [ ] Texto auxiliar usa `text-muted-foreground`.

### Densidade
- [ ] Padding interno de painel é `p-4` (ou `p-5` no painel hero).
- [ ] Gap entre rows de form é `space-y-3`.
- [ ] Gap entre seções na coluna é `space-y-6`.
- [ ] Botão padrão é `h-9` (36px); inputs `h-9`.

### Tipografia
- [ ] Nenhum `font-bold`. Apenas `font-semibold` no máximo.
- [ ] Todo número de dimensão/contagem/tamanho está em `font-mono`.
- [ ] Todo `text-2xl+` tem `tracking-tight`.

### Bordas, raios, sombras
- [ ] Todo container tem `rounded-md` ou `rounded-lg` (nada acima).
- [ ] Cards/painéis/inputs/botões **não** têm sombra.
- [ ] Apenas popovers/dialogs/toast têm `shadow-*`.

### Iconografia
- [ ] Todos os ícones são lucide-react.
- [ ] Tamanhos: 12/14/16px conforme contexto.
- [ ] Cor neutra (`text-muted-foreground`) ou herdada do botão.

### Interação
- [ ] Foco visível em todos interactives (`ring-2 ring-ring/30`).
- [ ] Estados hover claros (mudança de bg ou border).
- [ ] Sem `hover:scale-*`.

### Copy
- [ ] Tudo em pt-BR, sentence case, sem exclamação.
- [ ] CTAs em verbo imperativo curto.
- [ ] Sem emoji em chrome.

### Acessibilidade
- [ ] Toda input tem `<label htmlFor>` ou `aria-label`.
- [ ] Botões "fechar"/"abrir" têm `aria-label`.
- [ ] Contraste AA (foreground em background, muted-foreground em background).
- [ ] Keyboard navigation funciona (Tab, Enter, Escape).

### Anti-soft-SaaS
- [ ] Reli a seção 13. Nenhum item bate.

### Teste do amigo
- [ ] Se eu mostrar essa tela para um designer de produto e disser "isso
  é Linear/Figma/Vercel", ele aceita sem rir? Se não, corrija.

---

## 16. Glossário de decisões

Decisões que parecem opinativas mas têm razão técnica documentada:

- **Por que 6px de raio e não 8px?** 8px é o default do shadcn que dá
  conotação de "produto SaaS amigável". 6px alinha com Figma, Linear,
  Vercel — produtos que comunicam precisão.
- **Por que sem sombra em cards?** Sombra introduz uma terceira dimensão
  visual que sugere "elemento flutuando, jogue com ele". Em ferramenta de
  produção, cada caixa é um compartimento estático, não um objeto físico.
- **Por que mono em números?** Tabular figures alinham verticalmente em
  listas. Também sinaliza "este número é dado, não é decoração".
- **Por que apenas system fonts?** Web fonts custam ~50KB-150KB e atrasam
  FCP. System UI já é boa e familiar.
- **Por que apenas `font-semibold`, nunca `font-bold`?** 700 em system
  fonts (especialmente Segoe UI Bold no Windows) tem traços muito
  marcados que aproximam de "marketing display". 600 entrega hierarquia
  com sobriedade.
- **Por que ALL CAPS section headers?** Cria âncora visual sem competir
  com o conteúdo (font-size pequena). Padrão consagrado em Vercel,
  GitHub, Linear settings panels.
- **Por que primary só uma vez por tela?** Se tudo é destaque, nada é. O
  CTA primário comunica "esta é a ação que importa agora".

---

**Fim do manifesto. Volte ao topo se sentir dúvida durante a implementação.**
