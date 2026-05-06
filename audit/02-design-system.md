# FASE 2 — Design System

## 2.1 Tokens

### Cores

| Token | Valor (light) | Uso semântico | Onde aplicar |
|-------|---------------|---------------|-------------|
| `bg-background` | oklch(0.9851 0 0) | Fundo da página | `body`, containers raiz |
| `text-foreground` | oklch(0 0 0) | Texto principal | `h1`, `h2`, `p` principais, labels |
| `text-muted-foreground` | oklch(0.44 0 0) | Texto secundário | `p` descritivos, hint, breadcrumb |
| `bg-card` | oklch(1 0 267.51) | Fundo de card | `<div>` de agrupamento, `<section>` |
| `border-border` | oklch(0.92 0 0) | Bordas | `border`, `divide`, `outline` |
| `bg-muted` | oklch(0.97 0 0) | Hover / destaque leve | `:hover`, estados passivos |
| `bg-primary` | oklch(0.5144 0.1605 267.44) | Ação primária | `<Button variant="default">`, links, badges |
| `text-primary-foreground` | oklch(0.97 0.014 254.604) | Texto sobre primary | Botões primary |
| `bg-destructive` / `text-destructive` | oklch(0.58 0.22 27) | Ação destrutiva | `Button variant="destructive"`, erros, remoção |
| `bg-accent` / `text-accent-foreground` | oklch(0.9214 0.0248 257.65) | Hover em interactive | Hover de botões ghost, itens de lista |
| `ring-ring` | oklch(0.5144 0.1605 267.44) | Foco visível | `focus-visible:ring-ring` |
| `border-input` | oklch(0.94 0 0) | Borda de input | `<input>`, `<textarea>`, `<select>` |

### Tipografia

- **Font stack:** `font-sans` (system-ui stack), sem web fonts carregadas
- **Escala:** Tailwind default (não customizada)
- **Padrões de uso:**
  - `text-3xl` + `font-bold` para `h1` em páginas
  - `text-lg` + `text-muted-foreground` para descrições
  - `text-sm` para labels, breadcrumbs, conteúdo secundário
  - `text-xs` para hints, tags, metadados
  - `text-sm` + `font-medium` para `FormLabel`
  - `text-base` para `Input` (mobile) → `md:text-sm` (desktop)
- **`font-heading`** é usado em `DialogTitle`, `SheetTitle`, `AlertDialogTitle` mas não está definido como token — herda `font-sans`

### Espaçamentos

- **Escala oficial:** Tailwind default (`--spacing: 0.25rem` = 4px base)
- **Rhythm:** `space-y-4`, `space-y-6`, `gap-4`, `gap-6` como padrões
- **Padding de página:** `px-4 py-12 sm:px-6 lg:px-8`
- **Padding de container:** `p-4` (cards), `p-3` (cards compactos)

### Border-Radius

- `rounded-lg` — padrão para containers, inputs, botões (var(--radius) = 0.5rem)
- `rounded-sm` — checkboxes, itens de lista
- `rounded-md` — hover states em listas
- `rounded-xl` — dialogs, sheets, alert-dialogs
- `rounded-full` — badges, pills, theme toggle buttons

### Sombras

- `shadow-lg` — dropdowns, dialogs
- `shadow-sm` — cards com hover
- `shadow-md` — popovers
- `shadow-2xs` — cards de ferramenta

### Breakpoints

Tailwind default (não customizados):
- `sm:` 640px | `md:` 768px | `lg:` 1024px | `xl:` 1280px

## 2.2 Componentes

### `Button`

**Propósito:** Botão de ação principal com variantes visuais e tamanhos.

**Props:** `{ variant, size, ...ButtonPrimitive.Props }` via `cva`

**Variantes (cva):**
| Variante | Visual | Uso |
|----------|--------|-----|
| `default` | `bg-primary text-primary-foreground` | Ação primária |
| `outline` | `border-border bg-background hover:bg-muted` | Ação secundária |
| `secondary` | `bg-secondary text-secondary-foreground` | Alternativa |
| `ghost` | `hover:bg-muted hover:text-foreground` | Ação leve |
| `destructive` | `bg-destructive/10 text-destructive hover:bg-destructive/20` | Exclusão/risco |
| `link` | `text-primary underline-offset-4 hover:underline` | Link estilizado como botão |

**Tamanhos:** `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

**Estados:** default, hover, focus-visible (`ring-3 ring-ring/50`), active (`translate-y-px`), disabled (`opacity-50 pointer-events-none`), aria-invalid.

**Quando usar:** Qualquer ação interativa (submit, abrir modal, copiar, etc.).
**Quando NÃO usar:** Navegação entre páginas (use `<Link>`). Ações inline em texto (use `<button>` nativo).

**Exemplo:** `src/components/ui/button.tsx`
**Acessibilidade:** Usa `@base-ui/react/button` — suporte a ARIA nativo, focus visível gerenciado, `cursor-pointer`.

---

### `Input`

**Propósito:** Campo de texto monolinha.

**Props:** `{ type, ...React.ComponentProps<"input"> }`

**Estados:** default, focus-visible (`border-ring ring-3 ring-ring/50`), disabled (`bg-input/50 opacity-50`), aria-invalid (`border-destructive ring-3 ring-destructive/20`).

**Exemplo:** `src/components/ui/input.tsx`

---

### `Form` (shadcn wrapper)

**Propósito:** Sistema de formulário integrando React Hook Form + shadcn. Consiste em:
- `<Form>` — re-export de `FormProvider`
- `<FormField>` — wrapper do `Controller` do RHF
- `<FormItem>` — container com `grid gap-2`
- `<FormLabel>` — label com estado de erro
- `<FormControl>` — slot com `aria-invalid` automático
- `<FormMessage>` — mensagem de erro inline (retorna null se sem erro)
- `<FormDescription>` — texto descritivo

**Padrão canônico** (ex: `vacation-calculator-client.tsx`):
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="salary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salário bruto</FormLabel>
          <FormControl>
            <CurrencyInput
              value={field.value}
              onChangeValue={(_, __, masked) => field.onChange(masked)}
              InputElement={<Input type="text" {...field} />}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Calcular</Button>
  </form>
</Form>
```

---

### `Dialog`

**Propósito:** Modal de confirmação/exibição.

**Props adicionais:** `showCloseButton` (boolean, default true)

**Subcomponentes:** `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`

**Estados:** open (`animate-in fade-in-0 zoom-in-95`), closed (`animate-out fade-out-0 zoom-out-95`)

**Acessibilidade:** Foco é gerenciado pelo `@base-ui/react/dialog`. Backdrop (`bg-black/10`). Fechamento via Esc. Botão close com `sr-only "Close"`.

---

### `Checkbox`

**Propósito:** Campo binário.

**Props:** `CheckboxPrimitive.Root.Props`

**Estados:** unchecked, checked (`bg-primary`), disabled, focus-visible, aria-invalid.

---

### `NativeSelect`

**Propósito:** `<select>` estilizado sem dependência de Radix (mais leve).

**Props:** `SelectHTMLAttributes<HTMLSelectElement>`

**Visual:** Chevron customizado (lucide), borda e altura consistentes com Input.

---

### `Calendar` + `DateInput`

**Propósito:** Seletor de data com input mascarado (`DD/MM/AAAA`) + calendário popover.

**Dependências:** `react-day-picker` v9, `date-fns`, locale `ptBR`.

**Padrão de uso conjugado:** `DateInput` renderiza `<Input>` + `<Popover>` com `<Calendar>`.

---

### `ResultBox` / `ResultRow` / `ResultGrid`

**Propósito:** Exibição de resultados de cálculo.

**Variantes (tone):** `primary` (default, muted), `warning` (amarelo), `destructive` (vermelho), `muted` (card)

**Uso:** Agrupado como `<ResultGrid>` contendo vários `<ResultRow>`, com um `<ResultBox>` destacado para o valor principal.

**Exemplo:** `src/components/tools/vacation-calculator/vacation-calculator-client.tsx`

---

### `CopyButton`

**Propósito:** Botão que copia texto para o clipboard com feedback visual.

**Estados:** idle (ícone Copy), copied (ícone Check + feedback text por 3s).

**Props adicionais:** `text`, `label`, `feedbackText`, `duration`, `iconOnly`

---

### `PageLayout`

**Propósito:** Layout padrão de páginas de ferramenta.

**Comportamento:**
- Container `max-w-7xl` com padding responsivo
- Breadcrumb automático (se `toolHref` for passado)
- Título + descrição + separator
- Modo `compact`: children centralizado em card `md:rounded-xl md:border md:bg-card md:p-8 md:shadow-2xs`
- Modo normal: children sem wrapper
- `CategoryToolsSection` ao final (se toolHref)
- `extraContent` para SEO text
- `FaqSection` (se items)
- JSON-LD injection (WebApplication, BreadcrumbList, FAQ)

---

### `ToolCard`

**Propósito:** Card de link para ferramenta individual.

**Uso:** Home (`ToolSearch`), listagens (`ferramentas/page.tsx`, `categorias/[slug]/page.tsx`)

---

### `RelatedTools`

**Propósito:** Seção "Veja também" baseada em score de tags/intent/peso.

**Algoritmo de scoring:** tags em comum (+3), mesmo intent (+2), mesma categoria (+1), weight (+N). Mínimo 3 tools para exibir.

---

## 2.3 Padrões de Layout

### Estrutura de páginas

```
<Header>                 ← sticky top-0, z-50, backdrop-blur, border-b
  <main class="flex-1">
    <PageLayout>         ← max-w-7xl, px-4 py-12 sm:px-6 lg:px-8
      <Breadcrumb />
      <h1 /> <p />       ← título + descrição
      <Separator />
      {children}          ← tool client component
      <CategoryToolsSection />
      <RelatedTools />
      <FaqSection />
    </PageLayout>
  </main>
<Footer>                 ← mt-auto, border-t, grid 5-column
```

### Grids e responsividade

- **Abordagem:** mobile-first (classes sem prefixo são mobile, `sm:`, `md:`, `lg:` para breakpoints maiores)
- **Padrões de grid:**
  - Tool cards: `grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - Footer: `grid gap-10 sm:grid-cols-2 lg:grid-cols-5`
  - Form fields: `grid gap-4 sm:grid-cols-2`
  - Results: `grid gap-2 sm:grid-cols-2`
- **Max-widths:**
  - Páginas de ferramenta: `max-w-7xl`
  - Páginas estáticas/blog: `max-w-3xl`
  - Dialogs: `sm:max-w-sm`

### Spacing rhythm

- **Escala oficial:** Tailwind default (base 4px)
- **Unidades mais comuns:** `2`, `3`, `4`, `5`, `6`, `7`, `8`, `10`, `12`, `16`
- **Padding de seção:** `py-12` / `py-16` (top/bottom)
- **Gap entre cards:** `gap-3`
- **Gap entre form items:** `gap-4`
- **Gap entre sections:** `space-y-12` / `mt-12`

## 2.4 Padrões de Formulário

### Padrão canônico: RHF + Zod + shadcn `<Form>`

Encontrado em 12 das 13 ferramentas com formulário. O padrão é:

1. Definir schema Zod com `z.object({ ... })`
2. Tipar com `type FormValues = z.infer<typeof schema>`
3. Inicializar `useForm` com `resolver: zodResolver(schema) as Resolver<FormValues>`
4. Envolver em `<Form {...form}>` + `<form onSubmit={form.handleSubmit(onSubmit)}>`
5. Usar `<FormField render={({ field }) => ( ... )}>` para cada campo
6. Componentes de input: `Input`, `CurrencyInput` (react-currency-mask), `DateInput`, `NativeSelect`, `Checkbox`, `Textarea`
7. `FormMessage` para erro inline
8. Submit define estado com `useState<ResultType | null>(null)` e renderiza condicionalmente

**Exemplo canônico:** `src/components/tools/vacation-calculator/vacation-calculator-client.tsx:18-55`

### Tratamento de erro

- **Inline:** `FormMessage` em todos os formulários com RHF+Zod (padrão)
- **Toast:** Via `sonner` `<Toaster>` no root layout (disponível globalmente, mas sem uso em formulários atuais)
- **Error state manual:** `calculadora-de-rescisao` tem `useState<string | null>(null)` para erros de validação adicionais (ex: data inválida)

### Estados de loading no submit

- **Sem loading state** na maioria dos formulários (botão fica ativo)
- **Exceção:** `receipt-client.tsx` tem `useState(false)` para `isExporting`

### Mensagens de sucesso

- Resultados são exibidos inline (não toast) — `ResultBox`, `ResultGrid`, `ResultRow`
- `CopyButton` tem feedback visual inline ("Copiado!" por 3s)

## 2.5 Padrões de Feedback

### Loading states
- **Skeleton/spinner:** Nenhum encontrado. Ferramentas são 100% client-side sem data fetching.
- **Botão de submit:** Sem `disabled` durante processamento na maioria dos casos.
- **Upload de arquivos:** `compress-image`, `resize-image`, `convert-image` têm estado de progresso via `useState`.

### Empty states
- **ToolSearch:** Quando query não encontra resultados, mostra categorias vazias (lista vazia para cada categoria).
- **Tabelas vazias:** `csv-viewer` mostra tabela sem linhas.
- **ResultBox tone="warning"** usado para resultados vazios (ex: "Sem direito a férias").

### Error boundaries
- Nenhum `error.tsx` encontrado em nenhuma rota.
- Erros de formulário são tratados inline via `FormMessage`.

### Toasts/notificações
- `sonner` está instalado e `<Toaster>` está no root layout (`layout.tsx:80`).
- Atualmente **não é utilizado** por nenhum formulário ou ação. Apenas disponível para uso futuro.

## 2.6 Padrões de Data Fetching e UI

### Server Components vs Client Components

- **Todas as páginas** (`src/app/**/page.tsx`) são **Server Components** — exportam `metadata`, contêm conteúdo SEO, e importam client components.
- **Nenhum `"use client"`** em `src/app/`.
- **Client components** (`"use client"`) estão em `src/components/` e `src/hooks/`.

### Onde fica `"use client"` e por quê

| Arquivo | Motivo |
|---------|--------|
| Componentes `tools/*-client.tsx` | Interatividade (forms, estado, event handlers) |
| `header.tsx` | Estado de menu mobile, dropdown, theme toggle |
| `copy-button.tsx` | `navigator.clipboard`, estado `copied` |
| `image-dropzone.tsx` | Drag & drop, file input |
| `theme-provider.tsx` / `theme-toggle.tsx` | `localStorage`, `matchMedia`, toggle |
| `use-theme.ts` | `useState`, `useEffect`, `localStorage` |
| `resume-builder/*` | Form complexo com `useFieldArray` |
| `copy-grid.tsx` | `IntersectionObserver`, `navigator.clipboard` |
| `slider.tsx` | `@radix-ui/react-slider` (precisa de estado) |
| `option-switch.tsx` | Estado de seleção |

### Suspense boundaries

- **Nenhum `<Suspense>` encontrado** em nenhum lugar da base.
- O root layout é `async` (Server Component) e chama `headers()`, o que torna toda a app **dynamic SSR**.

### Data fetching

- **Sem fetching externo** nos client components (ferramentas são 100% offline/calculam no browser).
- **Exceções:** `consulta-cep` (fetch para ViaCEP), `consulta-cnpj` (fetch), `tabela-fipe` (fetch), `fetch-meta` (API route), `google-preview` (fetch).
- API routes no `src/app/api/` para: compressão de PDF (server-side), geração de currículo (Puppeteer), OG images, preview de meta tags.
