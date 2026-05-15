# Layout D — Análise com Sidebar

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout D — Análise com sidebar (NOVO)"
> Design: `DESIGN.md` §12.4
> Implementação de referência: `src/components/tools/character-counter/character-counter.tsx`

## Quando usar

Ferramentas onde o usuário **cola ou digita conteúdo** e a ferramenta **retorna métricas ou análises** sobre esse conteúdo — sem transformar o texto em outro formato. A sidebar exibe estatísticas em tempo real.

---

## Infraestrutura existente

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutD>` | `src/components/shared/layout-d.tsx` | Implementado e funcional — grid `[1fr 240px]` com header, main area e sidebar |
| `<StatusBar>` | `src/components/shared/status-bar.tsx` | Implementado — toolbar inferior com métricas mono e status dot |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | Implementado — botão de copiar com feedback |
| `<PageLayout>` | `src/components/shared/page-layout.tsx` | Implementado — shell da página com prop `compact` |
| shadcn UI | `src/components/ui/` | Base disponível (Button, Input, Textarea, Label) |

### Template canônico implementado

O `character-counter.tsx` é a **implementação de referência** oficial do Layout D. Ele demonstra:

- Uso correto de `<LayoutD>` com `header`, `sidebar` e children
- Header com título `text-sm font-semibold` + badge `TEMPO REAL` + ações (copiar/limpar)
- Sidebar com `<CharacterCounterStats>` (métricas label↔valor, ALL CAPS, `font-mono`)
- Textarea principal com `border-0 rounded-none bg-transparent`
- `<StatusBar>` inferior com métricas em mono e "Em tempo real"

---

## Grid estrutural (usar `<LayoutD>`)

```tsx
import { LayoutD } from "@/components/shared/layout-d";

<LayoutD
  header={<>
    <div className="flex items-center gap-3">
      <h1 className="text-sm font-semibold tracking-tight">Nome da ferramenta</h1>
      <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">TEMPO REAL</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="sm"><Copy className="mr-1.5 h-3 w-3" />Copiar</Button>
      <Button variant="ghost" size="icon-sm" aria-label="Limpar"><Trash2 className="h-3.5 w-3.5" /></Button>
    </div>
  </>}
  sidebar={<>
    {/* Métricas */}
    {/* Limites */}
    {/* Opções */}
    {/* Referências */}
  </>}
  sidebarWidth={240}
>
  {/* Área principal: textarea, tabela, ou preview */}
  
  <StatusBar items={[
    { label: "", value: "Em tempo real", mono: false },
    { label: "", value: `${count} items`, mono: true },
  ]} />
</LayoutD>
```

---

## Ferramentas mapeadas (2)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Visualizador de CSV** | `/ferramentas/visualizador-de-csv` | Usuário cola CSV na área principal → tabela renderizada. Sidebar exibe métricas (linhas, colunas, delimitador detectado, tamanho) e opções de formatação (delimitador manual, primeira linha como header). |
| **Prévia do Resultado Google** | `/ferramentas/previa-resultado-google` | Área principal com campos de meta tags (título, URL, descrição, keyword) + preview do snippet Google. Sidebar exibe contadores de caracteres com progress bars (título ~60, descrição ~160), palavra-chave e referências de limites. |

---

## Estrutura da sidebar

```tsx
<div className="flex flex-col bg-muted/30 divide-y divide-border overflow-y-auto">

  {/* Seção de métricas */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contagens</h3>
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">Linhas</span>
      <span className="font-mono text-xs font-medium tabular-nums">142</span>
    </div>
  </div>

  {/* Seção de limite */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Limites</h3>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs text-muted-foreground">Título</span>
      <span className="font-mono text-caption text-muted-foreground">58 / 60</span>
    </div>
    <div className="h-1 rounded-full bg-border overflow-hidden">
      <div className="h-full rounded-full bg-foreground/70 transition-all" style={{ width: "96%" }} />
    </div>
  </div>

  {/* Seção de opções */}
  <div className="p-4 space-y-3">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Opções</h3>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">Primeira linha como header</span>
      <button role="switch" aria-checked={true} className="...">{/* toggle */}</button>
    </div>
  </div>

  {/* Seção de referências */}
  <div className="p-4 space-y-2 mt-auto">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Referências</h3>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">Limite recomendado</span>
      <span className="font-mono text-caption bg-card border border-border rounded px-1.5 py-0.5 text-muted-foreground">60 caracteres</span>
    </div>
  </div>

</div>
```

---

## Análise detalhada por ferramenta

### 1. Visualizador de CSV

**Arquivo:** `src/components/tools/csv-viewer/csv-viewer.tsx`
**Estado atual:** Layout vertical empilhado — upload area → textarea → botão "Visualizar CSV" → resultado abaixo.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado — métricas ficam abaixo do conteúdo | 🔴 Alta | Estrutura geral |
| Usa `bg-secondary`, `bg-primary`, `font-bold` | 🔴 Alta | Upload area (`bg-secondary`), tabela (`bg-primary`, `font-bold`) |
| Botão "Visualizar CSV" com submit explícito | 🟡 Média | Deveria ser síncrono (colar → parse automático) |
| Ações (limpar) soltas no conteúdo, não no header | 🟡 Média | Botão "Limpar e começar novamente" |
| Ícone `Upload h-8 w-8` muito grande | 🟡 Média | DESIGN.md §7.2: nunca acima de 24px |
| `border-2 border-dashed` em vez de `border border-dashed` | 🟢 Baixa | DESIGN.md §6.2: toda borda é 1px |
| `SeoContent` na page usa `font-bold`, `text-xl` | 🟡 Média | `page.tsx` — viola DESIGN.md §4.2 |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬──────────────────┐
│ Visualizador de CSV            [badge LIVE]│ Contagens        │
│                                [copiar][x] │                  │
├────────────────────────────────────────────┤ Linhas: 142      │
│ Área de upload / textarea                  │ Colunas: 8       │
│ (auto-parse ao colar/upload)               │ Delimitador: ,   │
│                                            │ Tamanho: 24KB    │
├────────────────────────────────────────────┼──────────────────┤
│ Tabela paginada (quando parsed)            │ Opções           │
│                                            │ ○ Vírgula        │
│                                            │ ○ Ponto-e-vírgula│
│                                            │ ○ Tabulação      │
│                                            │ □ 1a linha header│
│                                            ├──────────────────┤
│                                            │ Exportar          │
├────────────────────────────────────────────┼──────────────────┤
│ [status: pag 1/3 · tempo real · limpar]   │                  │
└────────────────────────────────────────────┴──────────────────┘
```

#### Tarefas de refatoração

- [ ] Envolver componente em `<LayoutD>` com `header` + `sidebar` + children
- [ ] Header: título + badge `TEMPO REAL` + ações (copiar tabela, limpar)
- [ ] **Área principal:**
  - Estado "idle": upload area + textarea (colar → auto-parse, sem botão)
  - Estado "done": tabela paginada ocupa área principal (textarea some)
- [ ] **Sidebar — seção CONTAGENS:**
  - Linhas: `font-mono tabular-nums`
  - Colunas: `font-mono tabular-nums`
  - Delimitador detectado: `font-mono`
  - Tamanho do arquivo: `font-mono`
  - Linhas ignoradas (se houver): `font-mono`
- [ ] **Sidebar — seção OPÇÕES:**
  - Toggle: delimitador manual (vírgula / ponto-e-vírgula / tabulação)
  - Toggle: primeira linha como header
- [ ] **Sidebar — seção EXPORTAR:**
  - Botão "Copiar como JSON"
  - Botão "Baixar CSV"
- [ ] **Toolbar inferior:** `<StatusBar>` com página atual + "Em tempo real" + botão limpar
- [ ] Corrigir tabela: `thead` usar `bg-muted/40` + `text-foreground font-semibold` (nunca `bg-primary`, nunca `font-bold`)
- [ ] Corrigir upload area: `border border-dashed border-border bg-muted/40` (nunca `border-2`, nunca `bg-secondary`)
- [ ] Ícone de upload: `h-5 w-5 strokeWidth={1.75}` (nunca `h-8`)
- [ ] Parse automático para textos colados; manter botão apenas para arquivos grandes (> 100KB)

---

### 2. Prévia do Resultado Google

**Arquivos:**
- `src/components/tools/google-preview/google-preview-tool.tsx` (principal)
- `src/components/tools/google-preview/google-preview-input.tsx` (inputs)
- `src/components/tools/google-preview/google-preview-result.tsx` (preview)
- `src/components/tools/google-preview/seo-counter.tsx` (progress bars)
- `src/components/tools/google-preview/google-preview-url.tsx` (import por URL)
- `src/app/ferramentas/previa-resultado-google/page.tsx` (página)

**Estado atual:** Layout 100% vertical — URL import → separador → inputs → separador → preview snippet.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout 100% vertical, sem sidebar | 🔴 Alta | Estrutura geral |
| `<SeoCounter>` usa cores hardcoded (`bg-green-500`, `text-green-600`, etc.) | 🔴 Alta | `seo-counter.tsx` — viola DESIGN.md §3.5 |
| Progress bar com `h-1.5` em vez de `h-1` | 🟡 Média | `seo-counter.tsx` — LAYOUT-RESTRUCTURE.md §Layout D: `h-1` |
| `<GoogleSnippet>` usa cores inline (`#dfe1e5`, `#1a0dab`, etc.) | 🟡 Média | `google-preview-result.tsx` — aceitável pois simula Google, mas precisa de comentário |
| Page usa `compact` no `PageLayout` | 🟡 Média | `page.tsx` — remove H1 da página, mas componente interno define outro H1 inconsistente |
| Inputs de URL sem `font-mono` | 🟢 Baixa | `google-preview-input.tsx` e `google-preview-url.tsx` |
| Tab switcher desktop/mobile sem padrão do projeto | 🟢 Baixa | `google-preview-result.tsx` — usar estilo de botões em vez de tabs |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬──────────────────┐
│ Prévia do Google             [badge TEMPO] │ Título            │
│                              [copiar][x]   │  58 / 60          │
├────────────────────────────────────────────┤ [progress bar]    │
│ [Importar por URL] [Buscar]                │                   │
│ ───────── ou insira manualmente ─────────  │ Descrição         │
│ Título  [________________________]         │  142 / 160        │
│ Descrição [______________________]         │ [progress bar]    │
│ URL     [________________________]         │                   │
│ Keyword [________________________]         ├──────────────────┤
│                                            │ Palavra-chave     │
│ Preview snippet Google                     │ [input]           │
│ [Desktop] [Mobile]                         │                   │
│ ┌──────────────────────────────────┐      ├──────────────────┤
│ │  seusite.com                     │      │ Referências       │
│ │  Título da página               │       │ Título: 30–60     │
│ │  Descrição da página...         │       │ Descrição: 120–160│
│ └──────────────────────────────────┘      │ URL: limpa        │
└────────────────────────────────────────────┴──────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar `GooglePreviewTool` para usar `<LayoutD>`
- [ ] **Header:** título "Prévia do Google" + badge `TEMPO REAL` + ações (copiar snippet, limpar)
- [ ] **Área principal:**
  - Linha 1: `<GooglePreviewUrl>` (importar por URL + botão Buscar) — manter
  - Separador: "ou insira manualmente"
  - Campos: Título, Descrição, URL, Palavra-chave (movidos do `<GooglePreviewInput>`)
  - Preview snippet Google com tabs desktop/mobile
- [ ] **Sidebar — seção TÍTULO:**
  - Label + contador `font-mono` (ex: `58 / 60`)
  - Progress bar `h-1 rounded-full` com fill proporcional
  - Status: "Ideal" / "Muito curto" / "Muito longo" — usar tokens semânticos (`text-success`, `text-warning`, `text-destructive`)
- [ ] **Sidebar — seção DESCRIÇÃO:**
  - Mesma estrutura do título (contador + progress bar + status)
- [ ] **Sidebar — seção PALAVRA-CHAVE:**
  - Input para keyword (movido da área principal para sidebar)
- [ ] **Sidebar — seção REFERÊNCIAS:**
  - Título: `30–60 caracteres`
  - Descrição: `120–160 caracteres`
  - URL: `limpa e descritiva`
- [ ] **Refatorar `<SeoCounter>`** para usar tokens semânticos em vez de hardcoded:
  - `bg-success` em vez de `bg-green-500`
  - `bg-warning` em vez de `bg-yellow-500`
  - `bg-destructive` em vez de `bg-red-500`
  - `text-success` em vez de `text-green-600`
  - `text-warning` em vez de `text-yellow-600`
  - `text-destructive` em vez de `text-red-600`
  - Progress bar: `h-1` em vez de `h-1.5`
- [ ] Adicionar `<StatusBar>` inferior com status do preview + contadores
- [ ] Inputs de URL: adicionar `className="font-mono"`
- [ ] Corrigir `page.tsx`: remover `compact` do `PageLayout` (o H1 deve vir do PageLayout, não do componente interno)
- [ ] Corrigir `SeoContent` na page: `font-bold` → `font-semibold`, `text-xl` → `text-base`

---

## Componente compartilhado sugerido: `<LimitBar>`

O `<SeoCounter>` refatorado pode virar um componente genérico reutilizável para qualquer ferramenta que precise de contadores com progress bars na sidebar.

```tsx
// src/components/shared/limit-bar.tsx

import { cn } from "@/lib/utils";

type LimitBarProps = {
  label: string;
  current: number;
  min: number;
  max: number;
  status: "empty" | "short" | "good" | "long";
};

const statusConfig = {
  empty:  { label: "Vazio",       barClass: "bg-muted-foreground/20", textClass: "text-muted-foreground" },
  short:  { label: "Muito curto", barClass: "bg-warning",             textClass: "text-warning" },
  good:   { label: "Ideal",       barClass: "bg-success",             textClass: "text-success" },
  long:   { label: "Muito longo", barClass: "bg-destructive",         textClass: "text-destructive" },
};

export function LimitBar({ label, current, min, max, status }: LimitBarProps) {
  const config = statusConfig[status];
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-caption text-muted-foreground">{current} / {max}</span>
      </div>
      <div className="h-1 rounded-full bg-border overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", config.barClass)} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between">
        <span className={cn("text-caption", config.textClass)}>{config.label}</span>
        <span className="text-caption text-muted-foreground">Recomendado: {min}–{max}</span>
      </div>
    </div>
  );
}
```

---

## Anti-padrões a evitar

- ❌ Resultado abaixo do input — sidebar deve estar sempre visível
- ❌ Métricas em fonte sans — todo número/contagem em `font-mono`
- ❌ Botões soltos no meio do conteúdo — ações no header do card
- ❌ Scroll duplo na sidebar — usar `overflow-y-auto` com `divide-y`
- ❌ Cores hardcoded (`bg-green-500`, `text-blue-600`) — usar tokens semânticos
- ❌ Mais de um `variant="default"` por tela
- ❌ `font-bold`, `text-xl`, `text-3xl+` em UI chrome
- ❌ `border-2` em qualquer elemento — borda é sempre 1px
- ❌ Ícones maiores que 24px — max `h-5 w-5` (20px) para empty states

---

## Checklist de implementação

### Estrutura
- [ ] Usar componente `<LayoutD>` do `@/components/shared/layout-d`
- [ ] Header do card com título + badge de modo + ações (copiar/limpar)
- [ ] Área principal: textarea, tabela, ou preview com toolbar inferior `<StatusBar>`
- [ ] Sidebar 240px com seções: Métricas → Limites → Opções → Referências
- [ ] Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Valores de métrica: `font-mono text-xs font-medium tabular-nums`
- [ ] Progress bars para limites: `h-1 rounded-full bg-border` com fill via tokens semânticos

### Tokens
- [ ] Nenhum hex/rgb/cor de paleta Tailwind (`bg-green-500` etc) em chrome
- [ ] Toda borda usa `border-border` (1px)
- [ ] Cores de status: `text-success`, `text-warning`, `text-destructive`

### Tipografia
- [ ] Nenhum `font-bold` — apenas `font-semibold` (600) no máximo
- [ ] Todos os números/contagens/tamanhos em `font-mono tabular-nums`
- [ ] Labels em sans, nunca mono

### Densidade
- [ ] Padding interno de painel: `p-4`
- [ ] Gap entre rows de form: `space-y-3`
- [ ] Section headers sem ícone à esquerda

### Anti-soft-SaaS
- [ ] Reler DESIGN.md §13 — nenhum item bate
