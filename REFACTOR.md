# REFACTOR.md — Plano de migração

> Este documento ditcca a ordem e o conteúdo das mudanças para alinhar o
> código existente ao [`DESIGN.md`](./DESIGN.md). Leia o manifesto primeiro.
>
> Tudo aqui é prescritivo. Onde houver conflito com `audit/02-design-system.md`,
> este documento ganha (a auditoria descreve o estado **antigo**).

---

## Ordem de execução

A ordem importa: cada fase desbloqueia a próxima. Não pule.

| Fase | Escopo | Esforço | Risco |
|---|---|---|---|
| **1** | `globals.css` — tokens novos | 15 min | Baixo (visual cascata) |
| **2** | `ui/*` primitives — radius, shadow, sizes | 1–2h | Médio (testar todas as ferramentas) |
| **3** | Layout shell (`header`, `footer`, `PageLayout`) | 1h | Médio |
| **4** | Bugs críticos da auditoria 03 | 1–2h | Baixo |
| **5** | Refactor por ferramenta (uma a uma) | recorrente | Baixo (isolado) |

---

## Fase 1 — `globals.css` Status: OK, Já implementado

**Substitua** `src/app/globals.css` pelo `globals.css.example` deste pacote.

### O que muda

1. `--radius` de `0.5rem` → `0.375rem` (8px → 6px). Cascateia em **todo**
   componente shadcn que usa `rounded-lg` / `rounded-md`. É a mudança que
   mais impacta a sensação visual sozinha.
2. **Sombras** drasticamente reduzidas. `shadow-sm`, `shadow`, `shadow-2xs`
   ficam quase inexistentes. Sombra forte só em `shadow-md/lg/xl/2xl`
   (popover, dialog, toast).
3. Tokens `--success` e `--warning` agora **existem** (corrige itens 2–4
   da auditoria 03).
4. JSON formatter passa a usar `var(--color-primary)` em vez de
   `rgb(var(--primary))` quebrado (corrige item 1).
5. Cinzas com chroma zero (mais neutros, menos quentes). A primária
   permanece azul/violeta tonal.
6. Tabular nums automático em qualquer `.font-mono`.

### Validação

Após substituir:

1. Rodar `pnpm dev` e abrir 3 ferramentas diferentes. Visualmente, painéis
   devem ficar mais "apertados" e cards perdem a sombra.
2. Verificar `result-box.tsx` com tone="warning" — agora deve renderizar
   sem erro de token.
3. Verificar JSON formatter (ferramenta `formatador-json`) — keys/strings/
   números devem sair coloridos.

### Rollback

Se algo quebrar, basta reverter o arquivo. Nenhum componente fica em
estado inválido.

---

## Fase 2 — `ui/*` primitives

`src/components/ui/` tem os primitivos shadcn. Eles **já reagem** aos
tokens novos da Fase 1, mas algumas escolhas internas precisam mudar para
casar com o manifesto.

### 2.1 `button.tsx`

Mudanças:

- Remover `shadow-xs` e `shadow-sm` da variante `default` e `outline`.
  Botões **não** têm sombra.
- Tamanho `default`: trocar `h-10` → `h-9` (36px) se ainda não estiver
  assim. Conferir.
- Tamanho `sm`: `h-9 rounded-md gap-1.5 px-3` → `h-8 rounded-md gap-1.5 px-3 text-xs`.
- Tamanho `xs`: adicionar se não existe — `h-6 rounded-sm gap-1 px-2 text-[11px]`.
- Variante `default`: `bg-primary text-primary-foreground hover:bg-primary/90`
  (sem sombra, sem ring estático).
- Variante `outline`: `border border-border bg-background hover:bg-muted`.
- Variante `ghost`: `hover:bg-muted hover:text-foreground` (não `hover:bg-accent`).
- Focus visible em todas: `focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0`.
  **Remover** qualquer `ring-offset-2`.

### 2.2 `input.tsx`

- `h-10` → `h-9` (36px).
- `rounded-md` (já está, confirmar).
- `border border-input` (1px sólido, sem sombra).
- Focus: `focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30`.
  **Remover** `ring-3`, **remover** `ring-offset`.
- Mobile: `text-base` → `text-sm` (manter `md:text-sm` se existir, ou
  usar `text-sm` direto — 14px é OK em mobile moderno).

### 2.3 `card.tsx`

Hoje `Card` provavelmente tem `shadow-2xs`/`shadow-sm` — **remover toda
sombra**. Card vira:

```tsx
<div className="rounded-md border border-border bg-card" />
```

Se `Card` é usado intensivamente, em vez de modificar prefira **não usar
`<Card>`** em ferramentas e usar `<div>` direto com as classes acima
(documentar isso em DESIGN.md já feito na seção 10.6).

### 2.4 `dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`

- `font-heading` → `font-semibold` em todos os `*Title`. `font-heading`
  não é um token CSS válido — está herdando sans por fallback (itens
  21–23 da auditoria 03).
- `sr-only "Close"` → `sr-only "Fechar"` (itens 17–18).
- Dialog content: manter `shadow-lg` (é flutuante).
- Backdrop: `bg-black/40` (era 0.10 — fraco demais para dar foco no modal).
- Radius do content: `rounded-lg` (8px) — único caso onde 8px é OK.

### 2.5 `select-native.tsx`

Verificar se está coerente com `<Input>`: `h-9`, `rounded-md`, `border-input`,
mesmo focus visible. Se sim, OK. Se não, alinhar.

### 2.6 `slider.tsx` (radix)

- Track: `bg-muted` (1px de altura padrão? confirmar — manifesto pede 4px).
- Range: `bg-primary`.
- Thumb: 14×14 quadrado com `rounded-sm` border-2 (único caso) `border-primary`
  `bg-background`. **Não** circular grande estilo iOS.
- Focus: ring no thumb com `ring-2 ring-ring/30`.

### 2.7 `checkbox.tsx`

- `rounded-sm` (4px) — confirmar.
- Tamanho 14×14 (`h-3.5 w-3.5`).
- Border `border-input`. Quando checked: `bg-primary border-primary`.

### 2.8 `tabs.tsx` (se existir)

Hoje você não usa muito Tabs em ferramentas — para o padrão "modos"
prefira o `ModeTabs` vertical descrito em DESIGN.md 10.7. Se Tabs é
usado em outro contexto, alinhar visual: `h-8`, `rounded-md`,
`bg-muted` no list, `bg-card` no trigger ativo.

### 2.9 Validação da fase 2

Para cada primitive modificado, verifique 3 ferramentas que o usam.
Snapshot rápido a olho — densidade aumentou, sombras sumiram.

---

## Fase 3 — Layout shell

### 3.1 `components/layout/header.tsx`

- Altura: `h-16` → `h-14` (56px).
- Border-b `border-border` (já está) sem sombra. Apenas `shadow-xs` no
  scroll (opcional, pode dispensar).
- Bg: `bg-background/80 backdrop-blur` quando `position: sticky`.
- Logo + links: `text-sm font-medium`. Espaçamento `gap-6` entre links.
- ThemeToggle: ícone 16px, ghost button.
- **Bug crítico (auditoria item 7):** `<div onClick>` no backdrop mobile
  drawer → `<button type="button" aria-label="Fechar menu">`. Mesmas
  classes visuais.

### 3.2 `components/layout/footer.tsx`

- Padding vertical `py-12` (32px) — manter.
- Grid 5 colunas: `grid gap-6 sm:grid-cols-2 lg:grid-cols-5` (era `gap-10`).
- Headings de coluna: `text-[11px] uppercase tracking-wider font-semibold text-muted-foreground`
  (substituindo o que estiver lá).
- Links de coluna: `text-xs text-muted-foreground hover:text-foreground`.
- Bottom row (copyright + redes): `border-t border-border pt-6 mt-8`.

### 3.3 `components/layout/page-layout.tsx`

- Padding vertical `py-12` → `py-8` (32px).
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — manter.
- H1: `text-3xl` → `text-2xl font-semibold tracking-tight`.
- Descrição: `text-lg text-muted-foreground` → `text-sm text-muted-foreground`.
- Separator entre header e tool: trocar `<Separator />` shadcn por
  `<div className="border-t border-border my-6" />`.
- Modo `compact`: remover `shadow-2xs` do wrapper. Manter `border` e
  `rounded-lg`.

### 3.4 `not-found.tsx`

Auditoria item 16: botão "Voltar ao início" usa `<Link>` com classes
inline. Trocar por:

```tsx
<Button asChild variant="default">
  <Link href="/">Voltar ao início</Link>
</Button>
```

---

## Fase 4 — Bugs críticos da auditoria

Estes são listados em `audit/03-inconsistencies.md`. Tratar antes de
mexer em ferramentas individuais.

| # | Arquivo | Ação |
|---|---|---|
| 1 | `globals.css:218–226` | ✅ Resolvido na Fase 1 (oklch correto) |
| 2–4 | tokens success/warning | ✅ Resolvido na Fase 1 |
| 5 | `layout.tsx:58` | Mover `await headers()` para route handler ou middleware. **Investigação separada** — não bloqueia visual. |
| 6 | rotas sem `loading.tsx`/`error.tsx` | Adicionar `src/app/error.tsx` global + `src/app/loading.tsx`. Conteúdo simples (ver receita abaixo). |
| 7 | `header.tsx:148` div onClick | ✅ Resolvido na Fase 3 |
| 17–18 | sr-only "Close" → "Fechar" | ✅ Resolvido na Fase 2 |
| 21–23 | `font-heading` undefined | ✅ Resolvido na Fase 2 |
| 27 | `related-tools.tsx:63` `text-[#0000FF]` | Trocar por `text-primary` |
| 31 | category atual sem `aria-current` | Adicionar `aria-current="page"` |

### Receita: `error.tsx` global

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
			<AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
			<h1 className="text-2xl font-semibold tracking-tight">
				Algo deu errado
			</h1>
			<p className="text-sm text-muted-foreground">
				Não foi possível carregar esta página. Tente novamente.
			</p>
			<Button onClick={reset} className="mt-2">
				Tentar novamente
			</Button>
		</div>
	);
}
```

### Receita: `loading.tsx` global

```tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
		</div>
	);
}
```

---

## Fase 5 — Refactor por ferramenta

Refatorar **uma a uma**. Não tente refatorar todas no mesmo PR.

### Ordem sugerida (impacto × risco)

1. **`gerador-de-favicon`** — já tem o pacote pronto na pasta
   `refactored/favicon-generator/` deste projeto. Aplicar primeiro.
2. **`custom-qr-code`** — segundo gerador, mesmo padrão (3 painéis).
3. **`email-signature`** — refatorar para padrão RHF canônico (item 8 da
   auditoria) e aplicar 3 painéis (preview no centro).
4. **Calculadoras** (`calculadora-de-rescisao`, `calculadora-salario-liquido`,
   `vacation-calculator`, etc.) — apenas alinhamento tipográfico,
   espaçamento e ResultBox. Mudança pequena.
5. **Conversores** (`csv-to-json`, `formatador-json`, `base64`, etc.) —
   layout C (input → output).
6. **Visualizadores** (`csv-viewer`, `meta-tag-generator`,
   `consulta-cep`/`cnpj`/`fipe`).

### Roteiro genérico de refactor de uma ferramenta

Para cada ferramenta `src/components/tools/<name>/<name>-client.tsx`:

1. **Identificar layout (A/B/C)** conforme DESIGN.md seção 12.
2. **Listar seções** (section headers em ALL CAPS).
3. **Listar tokens de cor** usados — se algum não está na seção 3,
   substituir.
4. **Identificar CTA único** — se há mais de um `Button variant="default"`,
   reduzir.
5. **Conferir tamanhos**: H1 24px, labels 12px, metadata 11px mono.
6. **Conferir paddings**: `p-4` em painel, `space-y-3` em rows, `space-y-6`
   entre seções.
7. **Remover sombras** de tudo exceto popover/dialog.
8. **Ajustar raios**: `rounded-2xl`/`rounded-xl` → `rounded-md`/`rounded-lg`.
9. **Mover gerador para 3 painéis** se aplicável (modo selector vertical
   à esquerda como tabs persistentes).
10. **Rodar checklist pós-implementação** (DESIGN.md seção 15).

### Caso especial: `email-signature`

Auditoria item 8 — usa `useForm` com `register()` direto em vez do padrão
`<Form>` + `<FormField>`. Refatorar para o padrão canônico (referência:
`vacation-calculator-client.tsx`).

Auditoria item 28 — `.or(z.literal(""))` em vez de `.optional().default("")`.
Trocar.

### Caso especial: `meta-tag-generator`

Auditoria item 10 — preview do Google Search usa cores hardcoded sem
suporte a dark mode. Como esse preview **simula uma UI externa**
(Google), as cores são propositalmente as do Google. Solução:

```tsx
{/* sempre forçar light mode dentro do preview do Google */}
<div className="rounded-md border border-border bg-white p-4 text-black">
  {/* preview com cores do Google hardcoded permitidas aqui */}
</div>
```

E **documentar a exceção** com comentário CSS (mas o AGENTS.md proíbe
comentários — então documente em `audit/03-inconsistencies.md` como
exceção aceita).

### Caso especial: `custom-qr-code`

Auditoria item 15 — 4× `as any`. Criar type guard:

```ts
type DotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
type CornerType = "dot" | "square" | "extra-rounded";

function isDotType(v: string): v is DotType { /* ... */ }
function isCornerType(v: string): v is CornerType { /* ... */ }
```

---

## Acompanhamento

Mantenha um arquivo `docs/refactor-progress.md` com checklist por
ferramenta — qual fase concluída, qual pendente. Após cada ferramenta
refatorada, rodar o **checklist pós-implementação** do DESIGN.md (seção
15) e marcar.

---

## Quando terminar

A migração está completa quando:

- [ ] Todas as fases 1–4 aplicadas.
- [ ] Toda ferramenta passou pelo roteiro da Fase 5.
- [ ] `audit/03-inconsistencies.md` foi auditado e ou item está resolvido,
  ou marcado como exceção documentada.
- [ ] `audit/02-design-system.md` foi atualizado para refletir o estado
  novo, **ou** marcado como histórico (recomendo a segunda opção — fica
  mais limpo).
- [ ] Um designer externo olha 3 ferramentas aleatórias e diz "parece
  Linear/Vercel/Figma" sem ser provocado.
