# Layouts Canônicos — Índice e Roadmap

> Este documento é o ponto de entrada para o sistema de layouts da Ferramenta Ninja.
> Cada layout representa um padrão estrutural distinto, otimizado para um tipo específico
> de interação. Nenhuma ferramenta deve inventar seu próprio grid.
>
> Filosofia: **instrumento de trabalho**, não formulário de site.

---

## Os 5 layouts

| Layout | Nome | Quando usar | Ferramentas | Arquivo |
|---|---|---|---|---|
| **A** | 3 painéis | Gerador com preview visual em tempo real | 6 | [`layout-a.md`](./layout-a.md) |
| **B** | Form + resultado | Calculadora com submit explícito | 22 | [`layout-b.md`](./layout-b.md) |
| **C** | Input ↔ output | Conversor/formatter síncrono | 16 | [`layout-c.md`](./layout-c.md) |
| **D** | Análise com sidebar | Ferramenta que analisa e retorna métricas | 2 | [`layout-d.md`](./layout-d.md) |
| **E** | Inspector | Busca por ID → ficha de resultado | 6 | [`layout-e.md`](./layout-e.md) |

**Total: 38+ ferramentas mapeadas**

---

## Matriz de decisão

```
O usuário precisa...
│
├─ ...gerar um artefato visual com preview em tempo real?
│  └─ Layout A (3 painéis: modo + preview + estilo)
│
├─ ...preencher dados e calcular um resultado?
│  └─ Layout B (form + resultado sticky)
│
├─ ...converter/formatar texto de um formato para outro?
│  └─ Layout C (input ↔ output síncrono)
│
├─ ...analisar conteúdo e ver métricas/limites?
│  └─ Layout D (análise com sidebar)
│
└─ ...consultar um identificador e obter uma ficha?
   └─ Layout E (search bar + ficha estruturada)
```

---

## Estado da implementação

### Componentes de layout

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutA>` | `src/components/shared/layout-a.tsx` | ❌ **Não existe** — precisa ser criado |
| `<LayoutB>` | `src/components/shared/layout-b.tsx` | ✅ Existe e funcional |
| `<LayoutC>` | `src/components/shared/layout-c.tsx` | ❌ **Não existe** — precisa ser criado |
| `<LayoutD>` | `src/components/shared/layout-d.tsx` | ✅ Existe e funcional |
| `<LayoutE>` | `src/components/shared/layout-e.tsx` | ❌ **Não existe** — precisa ser criado |
| `<StatusBar>` | `src/components/shared/status-bar.tsx` | ✅ Existe |
| `<SectionLabel>` | `src/components/shared/layout-b/section-label.tsx` | ✅ Existe |
| `<Chip>` | `src/components/shared/layout-b/chip.tsx` | ✅ Existe |
| `<ResultRow>` | `src/components/shared/layout-b/result-row.tsx` | ✅ Existe |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | ✅ Existe |
| `<OptionSwitch>` | `src/components/shared/option-switch.tsx` | ✅ Existe |
| `<Slider>` | `src/components/shared/slider.tsx` | ✅ Existe |
| `<ResultBox>` | `src/components/shared/result-box.tsx` | ✅ Existe (genérico) |

### Referências canônicas (implementações modelo)

| Layout | Ferramenta modelo | Arquivo |
|---|---|---|
| A | (nenhuma — componente não existe) | — |
| B | Cálculo de Rescisão | `src/components/tools/termination-calculator/termination-calculator-client.tsx` |
| C | Base64 | `src/components/tools/base64/base64.tsx` |
| D | Contador de Caracteres | `src/components/tools/character-counter/character-counter.tsx` |
| E | (nenhuma — componente não existe) | — |

---

## Problemas transversais (afetam todos os layouts)

### `PageLayout`

**Arquivo:** `src/components/shared/page-layout.tsx`

| Problema | Onde | Fix |
|---|---|---|
| `font-bold` no h1 | Linha ~52 | `font-semibold` (DESIGN.md §4.1) |
| `text-2xl font-bold` | Linha ~52 | `text-2xl font-semibold tracking-tight` |

### Tokens visuais violados recorrentemente

| Violação | Layouts afetados | Fix |
|---|---|---|
| `bg-green-600` hardcoded | C (10 ferramentas) | `bg-success` |
| `bg-primary text-primary-foreground` para seleção de modo | A, B, C | `bg-foreground/10 text-foreground` |
| `rounded-full` em swatches, tabs, badges | A, E | max `rounded-lg` para swatches, `rounded-md` para badges |
| Labels em `text-sm` | A, B, C, E | `text-xs font-medium` |
| `font-bold` em valores | B, C, D | `font-semibold` ou `font-medium` |
| `max-w-*` nos containers | A, B, C | Remover — layouts canônicos usam largura total |
| Preview vazio em `bg-secondary` | A, B | `bg-muted/40` |
| `border-dashed` em preview que não é dropzone | A, B, E | Usar apenas em empty states explícitos |
| `variant="secondary"` para limpar/reset | B, C, E | `variant="ghost"` ou `outline` |
| Mais de um `variant="default"` por tela | B | Apenas o CTA primário |
| Footer inline em vez de `<StatusBar>` | C (10 ferramentas) | Usar `<StatusBar>` |

### Componentes que precisam ser criados

| Componente | Propósito | Layouts que usam |
|---|---|---|
| `<LayoutA>` | Grid `[280px_1fr_300px]` com sticky header | A |
| `<LayoutC>` | Grid `[1fr_1fr]` com header de colunas e `<StatusBar>` | C |
| `<LayoutE>` | Search bar + estados + ficha de resultado | E |
| `<ColorField>` | Color picker + input HEX em `font-mono` | A |
| `<LimitBar>` | Progress bar semântica (`bg-success`/`warning`/`destructive`) | D |
| `<ResultSheet>` | Ficha de sections com `divide-y` e grid `md:grid-cols-2` | E |
| `<FormFooter>` | Botões de ação agrupados com separador `border-t` | B |

---

## Roadmap de prioridade

### Fase 1 — Componentes base (bloqueantes)

- [ ] Criar `<LayoutA>` (`src/components/shared/layout-a.tsx`)
- [ ] Criar `<LayoutC>` (`src/components/shared/layout-c.tsx`)
- [ ] Criar `<LayoutE>` (`src/components/shared/layout-e.tsx`)
- [ ] Criar `<ColorField>` (`src/components/shared/color-field.tsx`)
- [ ] Criar `<LimitBar>` (`src/components/shared/limit-bar.tsx`)
- [ ] Criar `<ResultSheet>` (`src/components/shared/result-sheet.tsx`)
- [ ] Criar `<FormFooter>` (`src/components/shared/form-footer.tsx`)

### Fase 2 — Correções rápidas (alto impacto, baixo esforço)

- [ ] Corrigir `font-bold` → `font-semibold` no `PageLayout`
- [ ] Corrigir `bg-green-600` → `bg-success` nas 10 ferramentas Layout C
- [ ] Corrigir `rounded-full` → `rounded-md` em badges do Layout E
- [ ] Corrigir labels `text-sm` → `text-xs` nas ferramentas Layout A/B/E
- [ ] Corrigir `variant="secondary"` → `ghost`/`outline` em botões secundários

### Fase 3 — Migrações estruturais

- [ ] Migrar 4 calculadoras manuais para `<LayoutB>` (`salary-client`, `bmi-client`, `compound-interest-client`, `loan-calculator-client`)
- [ ] Migrar `business-days-calculator` para `<LayoutB>`
- [ ] Migrar 4 geradores para `<LayoutB>` (`password-generator`, `cpf-generator`, `uuid-generator`, `meta-tag-generator`)
- [ ] Migrar `color-palette` para `<LayoutA>`
- [ ] Migrar `custom-qr-code` para `<LayoutA>`
- [ ] Migrar `barcode-generator` para `<LayoutA>`
- [ ] Migrar `box-shadow-generator` para `<LayoutA>`
- [ ] Migrar `csv-viewer` para `<LayoutD>`
- [ ] Migrar `google-preview-tool` para `<LayoutD>`
- [ ] Migrar `consulta-cnpj` para `<LayoutE>`
- [ ] Migrar `decodificador-pix` para `<LayoutE>`
- [ ] Migrar `consulta-cep` para `<LayoutE>`
- [ ] Migrar `validador-boleto` para `<LayoutE>`
- [ ] Migrar `validador-de-cartao` para `<LayoutE>`

### Fase 4 — Refinamentos

- [ ] Refatorar `SeoCounter` → `<LimitBar>` com tokens semânticos
- [ ] Ajustar `PageLayout` das páginas Layout D para remover `max-w-xl` da description
- [ ] Corrigir SEO content (`font-bold` → `font-semibold`) em páginas Layout D
- [ ] Unificar Hash Generator para remover botão "Calcular" ( Layout C deve ser síncrono)
- [ ] Verificar `random-picker` — está em `<LayoutD>` mas o LAYOUT-RESTRUCTURE.md mapeia como Layout D

---

## Checklist universal (aplica a todos os layouts)

### Estrutura
- [ ] Nenhuma ferramenta inventa seu próprio grid — usar componente de layout
- [ ] Container principal com `border border-border rounded-lg overflow-hidden`
- [ ] Painéis laterais com `bg-card` + bordas de separação
- [ ] Área de conteúdo principal com `bg-muted/40`
- [ ] Header de página: `text-2xl font-semibold tracking-tight` + `text-sm text-muted-foreground`
- [ ] Apenas UM `variant="default"` por tela
- [ ] Botões secundários em `outline` ou `ghost`

### Tokens
- [ ] Cores via design tokens, nunca hardcoded
- [ ] Seleção ativa: `bg-foreground/10 text-foreground` (nunca `bg-primary`)
- [ ] Badge de status: `bg-success/10`, `bg-warning/10`, `bg-destructive/10`
- [ ] Status dot: `bg-success`, `bg-warning`, `bg-destructive`
- [ ] Preview vazio: `bg-muted/40`
- [ ] Empty state: `border-dashed bg-muted/30`

### Tipografia
- [ ] Section headers: `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Labels de campo: `text-xs font-medium text-muted-foreground`
- [ ] Valores técnicos (números, IDs, códigos, HEX): `font-mono text-xs`
- [ ] Título h1: `text-2xl font-semibold tracking-tight`
- [ ] **Nenhum `font-bold` em nenhum lugar**
- [ ] Prose (labels, descrições) em sans — nunca mono

### Densidade
- [ ] Padding de painel: `p-4`
- [ ] Gap entre seções: `border-t border-border pt-3 mt-3`
- [ ] Gap entre campos: `space-y-3`
- [ ] Gap entre label e input: `space-y-1.5`
- [ ] Section header com `mb-3` antes do conteúdo

### Anti-soft-SaaS
- [ ] Resultado visível enquanto edita (Layouts B/D)
- [ ] Preview no centro, nunca abaixo dos controles (Layout A)
- [ ] Controles densos, próximos uns dos outros
- [ ] Valores técnicos em mono, sempre visíveis
- [ ] Estados claros: vazio/loading/erro/resultado (Layouts B/E)
- [ ] Síncrono: sem botão "Converter" em Layout C
- [ ] Nenhum espaço vazio sem propósito
- [ ] Nenhum card flutuante com shadow e gap

---

## Referências

- [`DESIGN.md`](../DESIGN.md) — tokens visuais, tipografia, componentes, anti-padrões
- [`LAYOUT-RESTRUCTURE.md`](../LAYOUT-RESTRUCTURE.md) — definição formal dos 5 layouts
- [`REFACTOR.md`](../REFACTOR.md) — plano de migração por fase
- [`AGENTS.md`](../AGENTS.md) — regras visuais para agents
