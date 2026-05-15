# Layout A — 3 Painéis (Geradores com Preview)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout A — 3 painéis (geradores com preview)"
> Design: `DESIGN.md` §11.2.A, §12.1
> Estado: **Nenhuma ferramenta implementa o Layout A canônico. Componente `<LayoutA>` não existe.**

## Quando usar

Ferramentas onde o usuário **configura parâmetros** em painéis laterais e vê um **preview visual em tempo real** no centro. Exemplos: geradores de QR code, paleta de cores, barcode, favicon, gradiente. O preview é a peça central — não um resultado secundário.

**Regra de ouro:** Se a ferramenta gera um artefato visual (imagem, código, cor) e o usuário precisa experimentar parâmetros para ver o resultado, é Layout A.

---

## Infraestrutura existente

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutA>` | `src/components/shared/layout-a.tsx` | ❌ **Não existe** |
| `<SectionLabel>` | `src/components/shared/layout-b/section-label.tsx` | ✅ Existe — pode ser reutilizado |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | ✅ Existe |
| `<OptionSwitch>` | `src/components/shared/option-switch.tsx` | ✅ Existe |
| `<Slider>` | `src/components/shared/slider.tsx` | ✅ Existe |
| shadcn UI | `src/components/ui/` | Base disponível |

### Componente sugerido: `<LayoutA>`

```tsx
// src/components/shared/layout-a.tsx

type LayoutAProps = {
  header?: React.ReactNode;      // sticky top-14 com título + CTA
  leftPanel: React.ReactNode;    // 280px — modo/arquivo/configuração principal
  centerPanel: React.ReactNode;  // flex-1 — preview vivo
  rightPanel: React.ReactNode;   // 300px — estilo/exportar/controles finos
  footer?: React.ReactNode;      // opcional — info ou ações secundárias
};

export function LayoutA({ header, leftPanel, centerPanel, rightPanel, footer }: LayoutAProps) {
  return (
    <div className="space-y-0">
      {header && (
        <div className="sticky top-14 z-10 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-4 py-3">
          {header}
        </div>
      )}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr_300px] border border-border rounded-lg overflow-hidden">
        <aside className="bg-card border-b lg:border-b-0 lg:border-r border-border">
          {leftPanel}
        </aside>
        <main className="bg-muted/40 flex flex-col">
          {centerPanel}
        </main>
        <aside className="bg-card border-t lg:border-t-0 lg:border-l border-border">
          {rightPanel}
        </aside>
      </div>
      {footer && (
        <div className="border-t border-border bg-muted/40 px-4 py-2">
          {footer}
        </div>
      )}
    </div>
  );
}
```

---

## Grid estrutural (canônico)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [sticky header] Título da ferramenta          [CTA: Gerar / Baixar] │
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                             │                        │
│  Esquerda    │  Centro (preview vivo)      │  Direita (estilo)      │
│  280px       │  flex-1                     │  300px                 │
│              │                             │                        │
│  ─ MODO      │  ┌──────────────────────┐   │  ─ APARÊNCIA           │
│  ○ Imagem    │  │                      │   │    cor de fundo        │
│  ○ SVG       │  │    preview 1:1       │   │    formato             │
│  ○ Texto     │  │                      │   │    escala              │
│  ○ Emoji     │  └──────────────────────┘   │                        │
│              │                             │  ─ EXPORTAR             │
│  ─ ARQUIVO   │  16px  32px  48px  64px     │    favicon.ico         │
│  logo.svg    │  (grid de tamanhos)          │    favicon-16.png      │
│  32×32       │                             │    apple-touch.png     │
│              │  ─ EM CONTEXTO              │                        │
│  [Trocar]    │  [simulação de browser tab] │  [Gerar pacote]        │
└──────────────┴─────────────────────────────┴────────────────────────┘
```

### Tokens de grid

- Container: `grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr_300px] border border-border rounded-lg overflow-hidden`
- Painel esquerdo: `bg-card` + `border-r border-border` (desktop)
- Painel central: `bg-muted/40` — sempre visível, nunca vazio
- Painel direito: `bg-card` + `border-l border-border` (desktop)
- Sticky header: `sticky top-14 z-10 bg-background/90 backdrop-blur border-b border-border`
- Ações no header: apenas UM `variant="default"` (gerar/baixar)

---

## Ferramentas mapeadas (6 + 2 extras)

### Status geral

| Ferramenta | Rota | Estado atual | Layout alvo | Problema principal |
|---|---|---|---|---|
| **Gerador de Favicon** | — | ❌ **Não existe** | A | Ferramenta não implementada |
| **Gerador de Gradiente** | — | ❌ **Não existe** | A | Ferramenta não implementada |
| **Gerador de Código de Barras** | `/ferramentas/gerador-de-codigo-de-barras` | ⚠️ Flex-row improvisado | A | `sm:flex-row sm:w-[30%]`, não usa 3 painéis |
| **QR Code Customizado** | `/ferramentas/qr-code-customizado` | ⚠️ Grid próprio `[1fr_320px]` | A | Grid com 2 colunas, não 3; tabs próprias violam tokens |
| **Paleta de Cores** | `/ferramentas/paleta-de-cores` | ❌ Layout vertical empilhado | A | `space-y-6`, preview abaixo dos controles |
| **Gerador de QR Code** | `/ferramentas/gerador-de-qr-code` | ❌ Layout vertical/flex-row | A | `flex-col sm:flex-row`, não usa painéis |
| **Gerador de Box Shadow** | `/ferramentas/gerador-de-box-shadow` | ❌ Layout vertical empilhado | A | `space-y-8`, controles acima do preview |

> Nota: O `password-generator` foi removido do Layout A — está corretamente mapeado como **Layout B** no `LAYOUT-RESTRUCTURE.md` (form esquerda + resultado sticky direita).

---

## Análise detalhada — ferramentas existentes

### 1. QR Code Customizado

**Arquivo:** `src/components/tools/custom-qr-code/custom-qr-code.tsx`
**Estado:** Grid próprio `lg:grid-cols-[1fr_320px]` com 2 colunas. Não usa `<LayoutA>`.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Grid com 2 colunas em vez de 3 | 🔴 Alta | Estrutura geral — falta painel esquerdo para modo |
| Tabs próprias com `bg-primary text-primary-foreground` | 🔴 Alta | Seleção de modo (URL/Wi-Fi/Email/Telefone/PIX) — viola DESIGN.md §6.3 |
| `rounded-full` nos swatches de cor | 🟡 Média | `rounded-full` viola DESIGN.md §6.2 (max `rounded-lg`) |
| `border-primary bg-primary text-primary-foreground` nas tabs ativas | 🔴 Alta | Mesmo problema acima — `bg-primary` para seleção |
| Labels em `text-sm font-medium` | 🟢 Baixa | DESIGN.md §4.2: labels de campo em `text-xs font-medium` |
| `file:bg-primary file:text-primary-foreground` no upload de logo | 🟡 Média | Upload de arquivo usa `bg-primary` — aceitável para CTA primário, mas verificar se é o único |
| Preview sem fundo `bg-muted/40` | 🟡 Média | Preview fica em `bg-card`, não em área de destaque |
| `space-y-6` no container | 🟡 Média | Densidade vertical excessiva — verificar se espaçamento é necessário |
| `rounded-full` no input type=color | 🟢 Baixa | `rounded-full` nos inputs de cor |

#### Estrutura proposta (Layout A)

```
┌─────────────────────────────────────────────────────────────────────┐
│ QR Code Customizado                          [Baixar PNG ▼]         │
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                             │                        │
│  MODO        │  ┌──────────────────────┐   │  APARÊNCIA             │
│  ─────────   │  │                      │   │                        │
│  ● URL       │  │     [QR CODE]        │   │  Cor dos pontos        │
│  ○ Wi-Fi     │  │                      │   │  [swatches]            │
│  ○ E-mail    │  └──────────────────────┘   │                        │
│  ○ Telefone  │                             │  Cor do fundo          │
│  ○ PIX       │  Tamanho: 200 300 400 500   │  [swatches]            │
│              │                             │                        │
│  CONTEÚDO    │                             │  Estilo dos pontos     │
│  ─────────   │                             │  [select]              │
│  [inputs     │                             │  Estilo dos cantos     │
│   condicionais│                             │  [select]              │
│   por modo]  │                             │                        │
│              │                             │  Correção de erro      │
│              │                             │  [select]              │
│              │                             │                        │
│              │                             │  Logo central          │
│              │                             │  [upload]              │
│              │                             │                        │
├──────────────┴─────────────────────────────┴────────────────────────┤
│ [info] Código gerado no navegador                              [?]  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Criar componente `<LayoutA>`
- [ ] **Painel esquerdo (280px):**
  - Seção "MODO" com `<OptionSwitch>` vertical (não tabs horizontais `rounded-full`)
  - Seção "CONTEÚDO" com inputs condicionais por modo
  - Padding `p-4`, separações com `border-t border-border pt-3 mt-3`
- [ ] **Painel central (flex-1):**
  - Fundo `bg-muted/40`
  - Preview do QR code centralizado, `aspect-square`, max `300px`
  - Grid de tamanhos abaixo: miniaturas clicáveis (200, 300, 400, 500)
  - Seção "Em contexto" opcional: simulação de leitura
- [ ] **Painel direito (300px):**
  - Seção "APARÊNCIA" com swatches de cor (max `rounded-lg`, nunca `rounded-full`)
  - Seletores de estilo (pontos, cantos, correção)
  - Upload de logo com `file:bg-foreground file:text-background`
  - Ações de exportação no rodapé
- [ ] **Header sticky:**
  - Título + badge modo + botão "Baixar" `variant="default"`
- [ ] Corrigir tabs: usar `<OptionSwitch>` ou botões verticais `w-full rounded-md` com `bg-foreground/10` para ativo
- [ ] Remover todos os `bg-primary text-primary-foreground` de seleção
- [ ] Remover `rounded-full` dos swatches — usar `rounded-md` ou `rounded-lg`
- [ ] Labels: `text-xs font-medium` (não `text-sm`)
- [ ] Corrigir input file: `file:bg-foreground file:text-background` ou manter se for CTA primário

---

### 2. Gerador de Código de Barras

**Arquivo:** `src/components/tools/barcode-generator/barcode-generator.tsx`
**Estado:** Layout `flex-col sm:flex-row` com `sm:w-[30%]` — 2 colunas improvisadas, não 3.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout com 2 colunas em vez de 3 | 🔴 Alta | `sm:flex-row sm:w-[30%]` — falta painel direito de estilo/exportação |
| Preview em `bg-secondary` vazio | 🟡 Média | Estado vazio usa `bg-secondary` — deve ser `bg-muted/40` |
| `border-dashed` no preview vazio | 🟡 Média | `border-dashed` é aceitável para dropzone, mas aqui é placeholder |
| `lineColor: "#000000"` e `background: "#ffffff"` hardcoded | 🟡 Média | JsBarcode recebe cores hardcoded — justificável (preview de código de barras) |
| Botão "Gerar código de barras" com `variant="default"` | 🟢 Baixa | OK como CTA primário |
| Checkbox com label `cursor-pointer text-sm` | 🟢 Baixa | Label de checkbox pode ser `text-sm` (mais legível) |
| `text-sm font-medium` nos labels | 🟢 Baixa | DESIGN.md §4.2 sugere `text-xs`, mas `text-sm` é aceitável para labels de seção |

#### Estrutura proposta (Layout A)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Gerador de Código de Barras                  [Gerar]  [Baixar SVG]  │
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                             │                        │
│  CONFIGURAÇÃO│  ┌──────────────────────┐   │  EXIBIÇÃO              │
│  ─────────   │  │                      │   │                        │
│  Formato     │  │   [BARCODE SVG]      │   │  ☑ Mostrar texto      │
│  [select]    │  │                      │   │                        │
│              │  └──────────────────────┘   │  COR                   │
│  Valor       │                             │  [swatch preto]        │
│  [input]     │  Dicas do formato:        │  [swatch branco]       │
│              │  "Digite 12 dígitos..."   │                        │
│              │                             │  FUNDO                 │
│              │                             │  [swatch branco]       │
│              │                             │                        │
│              │                             │  DIMENSÕES             │
│              │                             │  Altura: 80px          │
│              │                             │  Margem: 12px          │
│              │                             │                        │
└──────────────┴─────────────────────────────┴────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutA>` com 3 painéis
- [ ] **Painel esquerdo (280px):**
  - Seção "CONFIGURAÇÃO"
  - Select de formato com descrição em `text-xs text-muted-foreground`
  - Input de valor com hint dinâmico baseado no formato
  - Botão "Gerar" no footer do painel
- [ ] **Painel central (flex-1):**
  - Preview do barcode em SVG, centralizado
  - Hint do formato abaixo
  - Estado vazio: `bg-muted/40` com texto "Digite um valor e clique em Gerar"
- [ ] **Painel direito (300px):**
  - Seção "EXIBIÇÃO" com toggle "Mostrar texto"
  - Seção "COR" com swatches (preto, branco, cinza)
  - Seção "FUNDO" com swatches (branco, transparente)
  - Seção "DIMENSÕES" com inputs numéricos (altura, margem)
  - Botão "Baixar SVG" no footer
- [ ] Corrigir preview vazio: `bg-muted/40` em vez de `bg-secondary`
- [ ] Manter cores hardcoded no JsBarcode com comentário explicativo

---

### 3. Paleta de Cores

**Arquivo:** `src/components/tools/color-palette/color-palette.tsx`
**Estado:** Layout vertical empilhado — controles no topo, grid de cores abaixo.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | `space-y-6` — preview (grid de cores) está abaixo dos controles |
| `max-w-2xl` e `max-w-3xl` nos containers | 🟡 Média | Limita largura útil — Layout A usa largura total com 3 painéis |
| Labels em `text-sm font-medium` | 🟢 Baixa | DESIGN.md §4.2: `text-xs font-medium` |
| Cores exibidas em cards com `border border-border` | ✅ Bom | Já usa tokens corretos |
| Botões `size="xs"` no CopyButton | ✅ Bom | Densidade correta |
| HSL em `text-sm text-muted-foreground` | 🟢 Baixa | Poderia ser `font-mono text-xs` |
| `font-semibold` no hex dentro do card | 🟡 Média | DESIGN.md: nunca `font-bold`, mas `font-semibold` é aceitável para valor principal |
| `h-20` no preview de cor | 🟢 Baixa | Altura suficiente, mas no Layout A o preview seria maior |

#### Estrutura proposta (Layout A)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Paleta de Cores                                                      │
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                             │                        │
│  BASE        │  ┌──────────────────────┐   │  HARMONIA              │
│  ─────────   │  │                      │   │                        │
│  Cor base    │  │   [CÍRCULO GRANDE    │   │  ● Complementar        │
│  [swatch +   │  │    com cor base]     │   │  ○ Análoga             │
│   input hex] │  │                      │   │  ○ Triádica            │
│              │  │   HSL: 217°, 91%, 60%│   │  ○ Monocromática       │
│  HSL         │  │   RGB: 59, 130, 246  │   │                        │
│  217° 91% 60%│  └──────────────────────┘   │  INFORMAÇÕES           │
│              │                             │  Tons gerados: 5       │
│              │  [GRID DE CORES]            │  Variação: 15%         │
│              │  ┌──┬──┬──┬──┬──┐           │                        │
│              │  │  │  │  │  │  │           │  AÇÕES                 │
│              │  │  │  │  │  │  │           │  [Copiar CSS]          │
│              │  └──┴──┴──┴──┴──┘           │  [Copiar Tailwind]     │
│              │                             │                        │
└──────────────┴─────────────────────────────┴────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutA>` com 3 painéis
- [ ] **Painel esquerdo (280px):**
  - Seção "BASE" com color picker + input HEX em `font-mono`
  - Seção "HSL" com valores em `font-mono text-sm`
  - Seção "RGB" com valores em `font-mono text-sm`
- [ ] **Painel central (flex-1):**
  - Preview grande da cor base (círculo ou quadrado `aspect-square`)
  - Grid de paleta gerada abaixo, com cada cor como card clicável
  - Cada card: preview `h-20` + HEX + botões copiar (HEX/RGB/HSL)
- [ ] **Painel direito (300px):**
  - Seção "HARMONIA" com `<OptionSwitch>` vertical para tipo de paleta
  - Seção "INFORMAÇÕES" com metadados (tons gerados, variação)
  - Seção "AÇÕES" com botões para copiar CSS/Tailwind da paleta inteira
- [ ] Remover `max-w-*` — Layout A usa largura total
- [ ] Labels: `text-xs font-medium`
- [ ] Valores técnicos: `font-mono text-xs`

---

### 4. Gerador de QR Code (simples)

**Arquivo:** `src/components/tools/qr-generator/qr-generator.tsx`
**Estado:** Layout `flex-col sm:flex-row` com `sm:w-[30%]` — similar ao barcode.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout com 2 colunas | 🔴 Alta | `sm:flex-row sm:w-[30%]` — falta painel de estilo/exportação |
| Preview vazio em `bg-secondary` | 🟡 Média | `bg-secondary` deve ser `bg-muted/40` |
| `border-dashed` no preview vazio | 🟡 Média | Placeholder com dashed — aceitável, mas `bg-muted/40` melhor |
| Labels em `text-sm font-medium` | 🟢 Baixa | `text-xs font-medium` |
| `variant="outline"` no botão de download | 🟢 Baixa | OK para ação secundária |

#### Tarefas de refatoração

- [ ] Unificar com **QR Code Customizado** — o gerador simples pode ser um modo dentro do customizado
- [ ] Ou: refatorar para `<LayoutA>` com painel esquerdo (configuração), central (preview), direito (exportação)
- [ ] Painel direito: select de tamanho, formato de download (PNG/SVG), botão download

---

### 5. Gerador de Box Shadow

**Arquivo:** `src/components/tools/box-shadow/box-shadow-generator.tsx`
**Estado:** Layout vertical `space-y-8` — tabs de camada, controles, preview, presets, código.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | `space-y-8` — preview aparece abaixo de todos os controles |
| `max-w-2xl` nos controles | 🟡 Média | Limita largura útil |
| Tabs de camada com `variant="secondary"` e `variant="outline"` | 🟡 Média | `OptionSwitch` seria mais adequado; múltiplos botões com variantes diferentes |
| Preview com `style={{ backgroundColor: containerBgColor }}` | 🟢 Baixa | Cor de fundo do preview via style é aceitável (preview visual) |
| Botão de teste com `style={{ color: ... }}` | 🟢 Baixa | Lógica de contraste via style é aceitável |
| Presets em `hover:bg-muted` | 🟢 Baixa | OK |
| Section header "Presets" e "Código gerado" com `text-caption font-semibold uppercase tracking-wider` | ✅ Bom | Já segue o padrão correto |
| `pre` com `bg-muted` | 🟡 Média | `bg-muted` em vez de `bg-muted/20` |
| Código em `font-mono text-sm` | ✅ Bom | Correto |

#### Estrutura proposta (Layout A)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Gerador de Box Shadow                          [Copiar CSS]        │
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                             │                        │
│  CAMADAS     │  ┌──────────────────────┐   │  ESTILO                │
│  ─────────   │  │                      │   │                        │
│  ● Camada 1  │  │   [QUADRADO/BOTÃO    │   │  Cor da sombra         │
│  ○ Camada 2  │  │    com shadow]       │   │  [color picker]        │
│  ○ Camada 3  │  │                      │   │                        │
│              │  │   [BOTÃO DE TESTE]   │   │  Cor do elemento       │
│  [+ Adicionar│  │                      │   │  [color picker]        │
│   - Remover] │  └──────────────────────┘   │                        │
│              │                             │  Cor de fundo          │
│              │  Presets:                   │  [color picker]        │
│  [grid de    │  [preset1] [preset2] ...   │                        │
│   presets]   │                             │  Tipo                  │
│              │                             │  [Normal ○ Inset]      │
│              │                             │                        │
├──────────────┴─────────────────────────────┴────────────────────────┤
│ CÓDIGO GERADO                                                       │
│ <pre>box-shadow: ...</pre>                                    [Copiar]│
└─────────────────────────────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutA>`
- [ ] **Painel esquerdo (280px):**
  - Seção "CAMADAS" com `<OptionSwitch>` vertical ou lista de camadas
  - Botões "Adicionar" (`outline`) e "Remover" (`ghost`) no footer
  - Seção "PRESETS" com grid de miniaturas clicáveis
- [ ] **Painel central (flex-1):**
  - Preview em `bg-muted/40` com quadrado e botão de teste
  - Ambos aplicando o shadow gerado
  - Cor de fundo do container ajustável (aumenta preview)
- [ ] **Painel direito (300px):**
  - Seção "ESTILO" com controles da camada ativa
  - Color pickers (sombra, elemento, fundo)
  - Toggle Normal/Inset
  - Sliders: opacidade, offsetX, offsetY, blur, spread
  - Cada slider com label + valor `font-mono` na mesma linha
- [ ] **Footer (abaixo do grid):**
  - Seção "CÓDIGO GERADO" com `<pre>` em `bg-muted/20`
  - `<OptionSwitch>` CSS/Tailwind
  - Botão copiar
- [ ] Remover `max-w-2xl`
- [ ] Corrigir `bg-muted` do `<pre>` → `bg-muted/20`
- [ ] Unificar tabs de camada em `<OptionSwitch>`

---

## Problemas no `PageLayout` (afeta todas)

**Arquivo:** `src/components/shared/page-layout.tsx`

| Problema | Onde | Fix |
|---|---|---|
| `font-bold` no h1 | Linha 52 | `font-semibold` (DESIGN.md §4.1) |
| `text-2xl font-bold` | Linha 52 | `text-2xl font-semibold tracking-tight` |
| `max-w-xl` na description | Linha 55 | Aceitável, mas verificar se não limita Layouts A/D |
| `py-8` no container | Linha 48 | DESIGN.md §11: `py-8` (OK) |
| `space-y-1` entre h1 e description | Linha 51 | OK |

> Fix rápido: `font-bold` → `font-semibold`

---

## Componente compartilhado sugerido: `<ColorField>`

Para padronizar os pickers de cor usados em Layout A:

```tsx
// src/components/shared/color-field.tsx

import { Input } from "@/components/ui/input";

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ColorField({ label, value, onChange, className }: ColorFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded-md border-0 p-0"
        />
        <Input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-24 font-mono text-xs uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}
```

---

## Anti-padrões a evitar

- ❌ Layout vertical empilhado — preview deve estar no centro, visível enquanto edita
- ❌ 2 colunas em vez de 3 — Layout A precisa de painel esquerdo + centro + direito
- ❌ `bg-primary` para seleção de modo/tabs — usar `bg-foreground/10`
- ❌ `rounded-full` em swatches, tabs, ou botões — max `rounded-lg`
- ❌ `space-y-6` ou `space-y-8` entre seções — usar `space-y-4` max
- ❌ `max-w-*` no container da ferramenta — Layout A usa largura total
- ❌ Preview vazio em `bg-secondary` — usar `bg-muted/40`
- ❌ Labels em `text-sm` para campos individuais — usar `text-xs font-medium`
- ❌ Mais de um `variant="default"` por tela
- ❌ Botões de ação no meio do form — agrupar no header sticky ou footer

---

## Checklist de implementação

### Estrutura
- [ ] Criar componente `<LayoutA>` em `src/components/shared/layout-a.tsx`
- [ ] Grid: `grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr_300px] border border-border rounded-lg overflow-hidden`
- [ ] Painel esquerdo: `bg-card` + `border-r border-border`, padding `p-4`
- [ ] Painel central: `bg-muted/40`, preview centralizado
- [ ] Painel direito: `bg-card` + `border-l border-border`, padding `p-4`
- [ ] Header sticky: `sticky top-14 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3`
- [ ] Header: título + descrição + UM botão `variant="default"`
- [ ] Seções dentro dos painéis separadas por `border-t border-border pt-3 mt-3`
- [ ] Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Preview vazio: `bg-muted/40` com texto `text-sm text-muted-foreground`
- [ ] Footer opcional abaixo do grid: `border-t border-border bg-muted/40 px-4 py-2`

### Tokens
- [ ] Container: `border border-border`
- [ ] Painéis laterais: `bg-card`
- [ ] Painel central: `bg-muted/40`
- [ ] Seleção ativa: `bg-foreground/10 text-foreground` (nunca `bg-primary`)
- [ ] Swatches de cor: `rounded-md` ou `rounded-lg` (nunca `rounded-full`)

### Tipografia
- [ ] Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Labels de campo: `text-xs font-medium text-muted-foreground`
- [ ] Valores técnicos (hex, rgb, hsl): `font-mono text-xs`
- [ ] Título no header: `text-2xl font-semibold tracking-tight`
- [ ] Nenhum `font-bold`

### Densidade
- [ ] Padding de painel: `p-4`
- [ ] Gap entre seções: `border-t border-border pt-3 mt-3`
- [ ] Gap entre campos: `space-y-3`
- [ ] Gap entre label e input: `space-y-1.5`

### Anti-soft-SaaS
- [ ] Preview no centro, nunca abaixo dos controles
- [ ] Controles densos, próximos uns dos outros
- [ ] Valores técnicos em mono, sempre visíveis
- [ ] Ações principais no header sticky
