# FASE 1 — Mapeamento

## 1.1 Estrutura

### Organização

O projeto adota uma organização **feature-based mista com atomic design**:

- `src/app/` — App Router (rotas, layouts, metadata)
- `src/components/ui/` — Componentes atômicos (shadcn/ui + @base-ui/react)
- `src/components/shared/` — Componentes reutilizáveis de layout/conteúdo
- `src/components/layout/` — Componentes de estrutura (header, footer)
- `src/components/theme/` — Provider + toggle de tema
- `src/components/seo/` — JSON-LD helpers
- `src/components/home/` — Componentes da home (search, tool-card)
- `src/components/tools/<nome-da-ferramenta>/` — Feature-based: cada ferramenta é um subdiretório isolado
- `src/lib/` — Lógica pura (sem React), dividida por domínio
- `src/hooks/` — Hooks customizados
- `src/utils/` — Funções utilitárias
- `src/content/blog/` — Conteúdo de blog em TSX

### Árvore (3 níveis)

```
src/
├── app/
│   ├── layout.tsx                  (root layout — Server Component)
│   ├── page.tsx                    (home — Server Component)
│   ├── not-found.tsx               (404 — Server Component)
│   ├── globals.css                 (Tailwind v4 + shadcn tokens)
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── middleware.ts
│   ├── api/
│   │   ├── comprimir-pdf/route.ts
│   │   ├── curriculo/gerar-pdf/route.ts
│   │   ├── fetch-meta/route.ts
│   │   ├── google-preview/route.ts
│   │   └── og/route.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── categorias/
│   │   └── [slug]/page.tsx
│   ├── contato/page.tsx
│   ├── curriculo-render/
│   │   ├── layout.tsx
│   │   └── [token]/page.tsx
│   ├── ferramentas/
│   │   ├── page.tsx                (listagem geral)
│   │   └── <80+ pastas>/page.tsx   (cada ferramenta)
│   ├── metodologia/page.tsx
│   ├── politica-de-privacidade/page.tsx
│   ├── sobre/page.tsx
│   └── termos-de-uso/page.tsx
├── components/
│   ├── ui/                         (14 componentes shadcn)
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── checkbox.tsx
│   │   ├── date-input.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select-native.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── textarea.tsx
│   ├── shared/                     (14 componentes reutilizáveis)
│   │   ├── blog-layout.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── category-tools-section.tsx
│   │   ├── copy-button.tsx
│   │   ├── copy-grid.tsx
│   │   ├── image-dropzone.tsx
│   │   ├── image-uploader.tsx
│   │   ├── option-switch.tsx
│   │   ├── page-layout.tsx
│   │   ├── related-tools.tsx
│   │   ├── result-box.tsx
│   │   ├── slider.tsx
│   │   ├── static-page.tsx
│   │   └── tool-sidebar.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   └── header.tsx
│   ├── theme/
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── seo/
│   │   └── json-ld.tsx
│   ├── home/
│   │   ├── tool-card.tsx
│   │   └── tool-search.tsx
│   └── tools/                      (~70 subdiretórios feature-based)
│       ├── vacation-calculator/
│       ├── salary-calculator/
│       ├── termination-calculator/
│       ├── curriculo/resume-builder/
│       ├── curriculo/resume-templates/
│       ├── email-signature/
│       ├── receipt/
│       └── ... (demais ferramentas)
├── lib/
│   ├── utils.ts                    (fn cn — clsx + tailwind-merge)
│   ├── data/
│   │   ├── tools.ts                (catálogo de ferramentas + categorias)
│   │   ├── blog-posts.ts
│   │   ├── category-content.ts
│   │   └── emojis.ts, emoticons.ts, symbols.ts
│   ├── seo/
│   │   ├── jsonld.ts
│   │   ├── metadata.ts
│   │   ├── highlight.ts
│   │   ├── format-url.ts
│   │   └── seo-preview.ts
│   ├── labor/                      (cálculos trabalhistas)
│   ├── payroll/                    (INSS, IRRF, FGTS)
│   ├── finance/                    (juros compostos, amortização)
│   ├── text/                       (transformações texto)
│   ├── image/                      (compressão, redimensionamento)
│   ├── pdf/                        (compressão, merge, split)
│   └── ... (demais domínios)
├── hooks/
│   └── use-theme.ts
├── utils/
│   ├── image.ts
│   └── number.ts
└── middleware.ts
```

## 1.2 Tokens de Design

Extraído de `src/app/globals.css:141-192` (bloco `@theme inline`).

### Cores (semânticas — OKLCH)

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--background` | oklch(0.9851 0 0) | oklch(0 0 0) | Fundo da página |
| `--foreground` | oklch(0 0 0) | oklch(1 0 0) | Texto principal |
| `--card` | oklch(1 0 267.51) | oklch(0.2103 0 267.51) | Fundo de cards |
| `--card-foreground` | oklch(0.2103 0 267.51) | oklch(0.9461 0 0) | Texto em cards |
| `--popover` | oklch(1 0 0) | oklch(0.2103 0 267.51) | Fundo de popovers |
| `--popover-foreground` | oklch(0 0 0) | oklch(1 0 0) | Texto em popovers |
| `--primary` | oklch(0.5144 0.1605 267.44) | idem | Cor primária (azul) |
| `--primary-foreground` | oklch(0.97 0.014 254.604) | idem | Texto sobre primary |
| `--secondary` | oklch(0.94 0 0) | oklch(0.25 0 0) | Cor secundária |
| `--secondary-foreground` | oklch(0.25 0 0) | oklch(0.94 0 0) | Texto sobre secondary |
| `--muted` | oklch(0.97 0 0) | oklch(0.23 0 0) | Fundo muted |
| `--muted-foreground` | oklch(0.44 0 0) | oklch(0.72 0 0) | Texto muted |
| `--accent` | oklch(0.9214 0.0248 257.65) | oklch(0.32 0 0) | Cor de destaque |
| `--accent-foreground` | oklch(0.2571 0.1161 272.24) | oklch(0.9214 0.0248 257.65) | Texto sobre accent |
| `--destructive` | oklch(0.58 0.22 27) | oklch(0.704 0.191 22.216) | Cor destrutiva |
| `--destructive-foreground` | oklch(0.97 0.014 254.604) | idem | Texto sobre destructive |
| `--border` | oklch(0.92 0 0) | oklch(0.26 0 0) | Bordas |
| `--input` | oklch(0.94 0 0) | oklch(0.32 0 0) | Input fields |
| `--ring` | oklch(0.5144 0.1605 267.44) | idem | Foco visível (focus ring) |
| `--chart-1..5` | variados | idem | Gráficos |
| `--sidebar-*` | variados | idem | Sidebar |

### Tipografia

- `--font-sans`: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
- `--font-serif`: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
- `--font-mono`: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
- Escala: não customizada (usa padrão Tailwind: `text-xs` 0.75rem, `text-sm` 0.875rem, `text-base` 1rem, `text-lg` 1.125rem, `text-xl` 1.25rem, `text-2xl` 1.5rem...)
- Font weight: `font-medium` e `font-bold` são os mais usados
- Sem `font-heading` definido (mas usado em dialog.tsx, sheet.tsx, alert-dialog.tsx)

### Espaçamentos

- `--spacing: 0.25rem` — default Tailwind (escala 1 = 4px)
- Sem customizações adicionais

### Border-Radius

| Token | Valor |
|-------|-------|
| `--radius` | 0.5rem (8px) |
| `--radius-sm` | calc(var(--radius) - 4px) = 0.25rem (4px) |
| `--radius-md` | calc(var(--radius) - 2px) = 0.375rem (6px) |
| `--radius-lg` | var(--radius) = 0.5rem (8px) |
| `--radius-xl` | calc(var(--radius) + 4px) = 0.75rem (12px) |

### Sombras

Todas as sombras compartilham a mesma cor base (hsl 236.583 64.225% 21.438% / opacidade variável):

| Token | Valores |
|-------|---------|
| `--shadow-2xs` / `--shadow-xs` | 0.25px 1px 3px 0px hsl(... / 0.07) |
| `--shadow-sm` | 0.25px 1px 3px 0px (/ 0.15), 0.25px 1px 2px -1px (/ 0.15) |
| `--shadow` | mesma sombra que `--shadow-sm` (duplicada) |
| `--shadow-md` | 0.25px 1px 3px (/ 0.15), 0.25px 2px 4px -1px (/ 0.15) |
| `--shadow-lg` | 0.25px 1px 3px (/ 0.15), 0.25px 4px 6px -1px (/ 0.15) |
| `--shadow-xl` | 0.25px 1px 3px (/ 0.15), 0.25px 8px 10px -1px (/ 0.15) |
| `--shadow-2xl` | 0.25px 1px 3px 0px (/ 0.38) |

Breakpoints, animações: não customizados (usam defaults Tailwind).

## 1.3 Componentes

### shadcn/ui (instalados em `components/ui/`)

| Componente | Base Library | Customizado? | Observações |
|-----------|-------------|-------------|-------------|
| `button.tsx` | `@base-ui/react/button` | Sim | 6 variantes + 8 tamanhos, cva |
| `input.tsx` | `@base-ui/react/input` | Sim | focus-visible, aria-invalid |
| `form.tsx` | Radix + RHF (shadcn wrapper) | Sim | FormField, FormItem, FormLabel, FormMessage, FormControl |
| `label.tsx` | Nativo `<label>` | Sim | data-slot="label" |
| `textarea.tsx` | Nativo `<textarea>` | Sim | focus-visible, aria-invalid |
| `dialog.tsx` | `@base-ui/react/dialog` | Sim | showCloseButton, DialogFooter com showCloseButton |
| `checkbox.tsx` | `@base-ui/react/checkbox` | Sim | size-4, aria-invalid |
| `calendar.tsx` | `react-day-picker` v9 | Sim | totalmente customizado, DayButton usa Button do shadcn |
| `sheet.tsx` | `@base-ui/react/dialog` | Sim | 4 sides, showCloseButton, animações |
| `popover.tsx` | `@base-ui/react/popover` | Sim | align, side, animações |
| `separator.tsx` | `@base-ui/react/separator` | Mínima | orientation |
| `select-native.tsx` | Nativo `<select>` | Sim | NativeSelect com chevron, mais leve que Radix |
| `alert-dialog.tsx` | `@base-ui/react/alert-dialog` | Sim | sizes, AlertDialogMedia, AlertDialogAction, AlertDialogCancel |
| `date-input.tsx` | Custom | 100% custom | Masked input + Calendar popover, date-fns, locale pt-BR |

**Versão:** shadcn/ui **base-nova** (style: "base-nova" em `components.json:3`). A versão do shadcn CLI é 4.2.0 (`"shadcn": "^4.2.0"` em `package.json:64`).

### Componentes próprios reutilizáveis (`components/shared/`)

| Componente | Props públicas | Consumido por |
|-----------|---------------|--------------|
| `PageLayout` | title, description, children, toolHref?, compact?, faq?, relatedTools?, extraContent? | Todas as páginas de ferramentas (~84) |
| `StaticPage` | title, description?, breadcrumbLabel, href, children | sobre, metodologia, termos-de-uso, politica-de-privacidade |
| `Breadcrumb` | items: {label, href?}[] | PageLayout, StaticPage, ferramentas list, blog |
| `ToolSidebar` | currentHref | PageLayout via CategoryToolsSection |
| `CategoryToolsSection` | currentHref | PageLayout |
| `RelatedTools` | currentHref, customTools?, excludeSameCategory? | PageLayout |
| `ResultBox` | label?, value?, hint?, tone?, className?, children? | ~15 ferramentas de cálculo |
| `ResultRow` | label, value, className? | ~15 ferramentas de cálculo |
| `ResultGrid` | children, className? | ~15 ferramentas de cálculo |
| `CopyButton` | text, label?, feedbackText?, duration?, iconOnly?, variant?, size? | ~20 ferramentas |
| `CopyGrid` | categories, itemClass | emojis, emoticons, simbolos |
| `Slider` | valor padrão Radix UI | email-signature |
| `OptionSwitch` | options, value, onChange | ~5 ferramentas |
| `ImageDropzone` | preview, isDragging, onFile, onClear, ... | compress-image, resize-image, etc. |
| `ImageUploader` | (upload de logo) | loyalty-card |
| `BlogLayout` | post, children | blog/[slug] |
| `ToolCard` | name, href, description, icon | home, listagens |
| `ToolSearch` | (nenhuma) | home |
| `JsonLd` | data | PageLayout, StaticPage, BlogLayout |

### Componentes "soltos" (JSX inline que deveria virar componente)

Os seguintes padrões aparecem em 3+ lugares e são candidatos a componente:

1. **Breadcrumbs inline** — algumas páginas usam `<Breadcrumb>` diretamente em vez de via `PageLayout` (ex: `ferramentas/page.tsx`, `categorias/[slug]/page.tsx`) — mas `<Breadcrumb>` já é componente, então está ok.

2. **Botão de "Voltar ao início"** — `not-found.tsx` usa `<Link>` com classes inline em vez de `<Button>`.

3. **Tabelas de conteúdo SEO** — HTML de tabelas (`<table>`, `<th>`, `<td>`) estão duplicadas entre várias páginas de calculadoras trabalhistas (ex: `calculadora-salario-liquido/page.tsx`, `calculadora-de-rescisao/page.tsx`). Seria candidato a componente `<TabelaFaixaSalarial>`.

4. **FaqSection** — está definida dentro de `PageLayout` mas poderia ser extraída para `shared/`.

5. **Grupo de seções de FAQ** — o padrão `<h3> + <p>` com as mesmas classes se repete em ~20 páginas.

## 1.4 Telas (rotas)

| Rota | Tipo | Layout Pai | Componentes Consumidos |
|------|------|-----------|----------------------|
| `/` | Server | Root | ToolSearch |
| `/ferramentas` | Server | Root | Breadcrumb, ToolCard, JsonLd |
| `/ferramentas/[slug]` (~84) | Server | Root | PageLayout (ou StaticPage) + Client tool |
| `/blog` | Server | Root | Breadcrumb, BlogList |
| `/blog/[slug]` | Server | Root | BlogLayout + BlogContent |
| `/categorias/[slug]` | Server | Root | Breadcrumb, CategoryContent, ToolCard |
| `/sobre` | Server | Root | StaticPage |
| `/metodologia` | Server | Root | StaticPage |
| `/termos-de-uso` | Server | Root | StaticPage |
| `/politica-de-privacidade` | Server | Root | StaticPage |
| `/contato` | Server | Root | PageLayout |
| `/curriculo-render/[token]` | Server (special) | curriculo-render | ResumeRenderer |
| `/not-found` | Server | Root | (404 inline) |

## 1.5 Formulários

### Com RHF + Zod (padrão canônico shadcn)

| Página | Schema Zod | Inputs | Submit | Tratamento de Erro |
|--------|-----------|-------|--------|-------------------|
| calculadora-de-ferias | `{ salary, monthsAtCompany, absences, sellAbono, dependents, daysToTake }` | CurrencyInput, Input, Checkbox | `handleSubmit` → `calculateVacation()` + `setResult` | FormMessage inline |
| calculadora-de-rescisao | `{ salary, admissionDate, terminationDate, type, noticePolicy, fgtsBalance, dependents, hasExpiredVacation }` | CurrencyInput, DateInput, NativeSelect, Checkbox | `handleSubmit` → `calculateTermination()` + `setResult` | FormMessage inline + error state |
| calculadora-salario-liquido | `{ grossSalary, dependents, otherDiscounts, benefits }` | CurrencyInput, Input | `handleSubmit` → `calculateSalary()` + callback | FormMessage inline |
| calculadora-adicional-noturno | `{ grossSalary, isRural, isNighttimeWork }` | CurrencyInput, Checkbox | `handleSubmit` → callback | FormMessage inline |
| calculadora-13-salario | `{ salary, additional, firstInstallmentTiming }` | CurrencyInput, NativeSelect | `handleSubmit` → callback | FormMessage inline |
| calculadora-hora-extra | `{ salary, includeDsr }` | CurrencyInput, Checkbox | `handleSubmit` → callback | FormMessage inline |
| calculadora-juros-compostos | `{ principal, monthlyContribution, annualRate, months, contributionTiming }` | CurrencyInput, Input, NativeSelect | `handleSubmit` → `calculateCompoundInterest()` + `setResult` | FormMessage inline |
| simulador-financiamento | `{ principal, system }` | CurrencyInput, NativeSelect | `handleSubmit` → callback | FormMessage inline |
| calculadora-imc | `{ weight, height, system }` | Input, NativeSelect | `handleSubmit` → callback | FormMessage inline |
| rendimento-cdi-selic | `{ principal, kind, indexType }` | CurrencyInput, NativeSelect | `handleSubmit` → callback | FormMessage inline |
| gerador-de-recibo | `{ nomePagador, nomeRecebedor, valor, descricao, data, cidade, formaPagamento }` | Input, CurrencyInput, Textarea, DateInput, NativeSelect | `handleSubmit` → `exportReceiptPdf()` | FormMessage inline |
| assinatura-de-email | `{ fullName, jobTitle, ..., primaryColor, fontSize, ..., socials[] }` | Input, Textarea, Slider, color picker, image upload, socials array | Manual (useForm register) | Validação nativa RHF |
| criador-de-curriculo | `{ fullName, jobTitle, experience[], education[], skills, languages, socials[] }` | Input, Textarea, sections com useFieldArray | `onSubmit` → PDF render + export | FormMessage inline |

### Sem RHF/Zod (useState puro — ~70 ferramentas)

A maioria das ferramentas opera com estado local (`useState`) e lógica pura em `src/lib/`. Exemplos:

- `contador-de-caracteres`: useState para texto, useEffect para contagem
- `conversor-csv-json`: useState para CSV/JSON input, lógica pura em lib/csv
- `compress-image`: useState para file, progress, resultado
- `gerador-de-senha`: useState para opções, resultado
- `qr-code`: useState para conteúdo, resultado
- `base64`, `timestamp-converter`, `conversor-de-unidades`, etc.
- `comparar-textos`: useState + useDiff hook customizado
- `desenhar-online`: useState + canvas refs
- `tabela-fipe`: useState + fetch fetching em client component
