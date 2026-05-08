# REFACTOR-PLAN.md

> Plano operacional para alinhar todo o frontend ao [`DESIGN.md`](./DESIGN.md).
> **Fase 1 (globals.css) já concluída.** Cada fase é independente — pode ser
> implementada e verificada antes da próxima, mesmo que o resto do projeto
> fique temporariamente fora do padrão.

---

obs: obrigatoriamente sempre aplicar um ✅ DONE no que for feito para organização

## Estado atual

| Item | Status |
|---|---|
| `globals.css` — tokens oklch, --radius 6px, success/warning, JSON formatter | ✅ DONE |
| `src/app/error.tsx` e `loading.tsx` — verificar receita | pendente |
| `src/components/ui/` primitivos | pendente |
| `src/components/layout/` shell | pendente |
| `src/components/shared/` utilitários | pendente |
| 84 ferramentas individuais | pendente |

---

## Fase 2 — UI Primitives

**Escopo:** `src/components/ui/`

Os primitivos têm `rounded-lg` (8px), `h-8` no default e `ring-3 ring-ring/50` — todos divergem do DESIGN.md.
Corrigi-los primeiro dá ganho global imediato pois cascateiam em todas as ferramentas.

### 2.1 `button.tsx`

Base da CVA (linha 7):
- `rounded-lg` → `rounded-md`
- `ring-3 ring-ring/50` → `ring-2 ring-ring/30`
- `aria-invalid:ring-3` → `aria-invalid:ring-2`

Variant `destructive` — adicionar border (linha 19):
```
"bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
```

Tamanhos (todos uma etapa menor que o DESIGN.md §10.1 pede):

| size | atual | correto |
|---|---|---|
| `default` | `h-8 gap-1.5 px-2.5` | `h-9 gap-1.5 px-4` |
| `sm` | `h-7 gap-1 px-2.5 text-[0.8rem]` | `h-8 gap-1.5 px-3 text-xs` |
| `lg` | `h-9 gap-1.5 px-2.5` | `h-10 gap-1.5 px-6` |
| `icon` | `size-8` | `size-9` |
| `icon-sm` | `size-7` | `size-8` |
| `icon-lg` | `size-9` | `size-10` |

### 2.2 `input.tsx`

Linha 12:
- `rounded-lg` → `rounded-md`
- `text-base` → `text-sm` (remover `md:text-sm` redundante)
- `ring-3 ring-ring/50` → `ring-2 ring-ring/30`
- `aria-invalid:ring-3` → `aria-invalid:ring-2`

### 2.3 `textarea.tsx`

- `rounded-lg` → `rounded-md`
- `text-base` → `text-sm` (remover `md:text-sm`)
- `ring-3 ring-ring/50` → `ring-2 ring-ring/30`
- `aria-invalid:ring-3` → `aria-invalid:ring-2`

### 2.4 `dialog.tsx`

- `DialogOverlay` (backdrop): `bg-black/10` → `bg-black/40`
- `DialogContent`: `rounded-xl` → `rounded-lg`
- `DialogTitle`: `font-heading` → `font-semibold` (`font-heading` não é token CSS válido)
- `DialogClose` sr-only: `"Close"` → `"Fechar"`

### 2.5 `sheet.tsx`

- `SheetTitle`: `font-heading` → `font-semibold`
- `SheetClose` sr-only: `"Close"` → `"Fechar"`

### 2.6 `alert-dialog.tsx`

- `AlertDialogOverlay`: `bg-black/10` → `bg-black/40`
- `AlertDialogContent`: `rounded-xl` → `rounded-lg`
- `AlertDialogTitle`: `font-heading` → `font-semibold`

### 2.7 `select-native.tsx`

- `rounded-lg` → `rounded-md`
- `focus-visible:ring-1 focus-visible:ring-ring` → `focus-visible:ring-2 focus-visible:ring-ring/30`
- Confirmar `border border-input` explícito (não só `border`)

### 2.8 `checkbox.tsx`

- `ring-3 ring-ring/50` → `ring-2 ring-ring/30`
- `aria-invalid:ring-3` → `aria-invalid:ring-2`
- `size-4` e `rounded-sm` estão corretos — não alterar

**Verificação:** abrir `gerador-de-senha`, `formatador-json`, `calculadora-de-rescisao`. Button primary com 36px de altura, raio 6px. Botão destructive com borda vermelha discreta. Input sem `text-base` no mobile.

---

## Fase 3 — Layout Shell

**Escopo:** `src/components/layout/` + `src/components/shared/page-layout.tsx`

### 3.1 `header.tsx`

- `<header>` (ln 50): `bg-card/80` → `bg-background/80`
- Inner div (ln 51): `h-16` → `h-14`
- Logo "ferramenta" (ln 54): `font-bold` → `font-semibold`
- Logo ".ninja" (ln 55): `font-bold` → `font-semibold`
- Drawer wrapper (ln 158): `h-16` → `h-14`
- Drawer "Menu" span (ln 160): `font-bold` → `font-semibold`

O backdrop mobile (ln 150) já usa `<button type="button" aria-label="Fechar menu">` — correto, não alterar.

### 3.2 `footer.tsx`

- Grid (ln 25): `gap-10` → `gap-6`
- Logo spans (ln 28–29): `font-bold` → `font-semibold` (ambos)
- Headings de coluna (ln 37, 55, 73, 105): `text-sm font-semibold text-foreground` → `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`
- Links de coluna (todas as `<ul>`): `text-sm` → `text-xs`
- Bottom row (ln 153): `mt-10` → `mt-8`

### 3.3 `page-layout.tsx`

- Wrapper externo (ln 49): `py-12` → `py-8`
- Header wrapper (ln 52): `mb-8 max-w-2xl` → `mb-6 space-y-1`
- H1 (ln 53): `text-3xl font-bold tracking-tight text-foreground sm:text-4xl` → `text-2xl font-semibold tracking-tight text-foreground`; remover `mb-4`
- Descrição (ln 56): `text-lg` → `text-sm`
- Separador (ln 58): `<Separator className="mb-5 lg:mb-7" />` → `<div className="border-t border-border my-6" />`; remover import `Separator` se não usado em outro lugar
- Compact mode (ln 61): `md:rounded-xl md:border md:bg-card md:p-8 md:shadow-2xs` → `md:rounded-lg md:border md:bg-card md:p-5`
- FaqSection h2 (ln 102): `text-xl font-bold` → `text-base font-semibold`

**Verificação:** header com 56px, logo sem font-bold. Footer headings ALL CAPS em muted-foreground, links menores. PageLayout H1 em 24px semibold, separador como `border-t` div, compact sem sombra.

---

## Fase 4 — Shared Components + Bugs Críticos

**Escopo:** `src/components/shared/` + `src/app/`

### 4.1 `result-box.tsx`

- ResultBox wrapper (ln 31): `rounded-lg` → `rounded-md`
- ResultBox value (ln 34): `text-3xl font-bold` → `text-2xl font-semibold`
- ResultRow (ln 52): `rounded-lg` → `rounded-md`

### 4.2 `related-tools.tsx`

- H2 "Veja também" (ln 84): `text-xl font-bold text-foreground` → `text-base font-semibold text-foreground`
- Links (ln 90): `text-primary underline underline-offset-4` — correto, manter

### 4.3 `not-found.tsx`

- H1 "404" (ln 6): `text-6xl font-bold text-primary` → `text-4xl font-semibold text-foreground`
- H2 texto (ln 8): `"Pagina nao encontrada"` → `"Página não encontrada"`
- Parágrafo (ln 10): adicionar acentos
- Link "Voltar" (ln 13–17): substituir `<Link>` inline por `<Button asChild variant="default"><Link href="/">Voltar ao início</Link></Button>`; adicionar import de `Button`

### 4.4 `error.tsx` e `loading.tsx`

Verificar se batem com as receitas abaixo. Se não, reescrever:

```tsx
// error.tsx
"use client";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
      <h1 className="text-2xl font-semibold tracking-tight">Algo deu errado</h1>
      <p className="text-sm text-muted-foreground">Não foi possível carregar esta página. Tente novamente.</p>
      <Button onClick={reset} className="mt-2">Tentar novamente</Button>
    </div>
  );
}
```

```tsx
// loading.tsx
import { Loader2 } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
```

**Verificação:** ResultBox com valor em `text-2xl font-semibold` e raio 6px. RelatedTools heading 16px semibold. Navegar para `/xyz` — texto com acentos, botão via `<Button asChild>`.

---

## Fase 5 — Refatoração por ferramenta (84 ferramentas)

### Roteiro genérico

Aplicar a cada ferramenta antes de editar:

1. Identificar layout: **A** (3 painéis), **B** (form+resultado), **C** (input→output)
2. Section headers internos: `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`
3. Tokens de cor: nenhum `text-gray-*`, `bg-blue-*`, `text-[#hex]` fora de simulações de UI externa
4. CTA único: apenas um `variant="default"` por tela
5. Tipografia: sem `text-3xl+`, sem `font-bold` em chrome, números em `font-mono`
6. Paddings: `p-4` em painel, `space-y-3` em form rows, `space-y-6` entre seções
7. Sombras: remover de elementos em fluxo; manter apenas em popovers/dialogs/toast
8. Raios: `rounded-xl/2xl` → `rounded-lg` (painéis grandes) ou `rounded-md` (cards/inputs/botões)

**Exceções documentadas** (não alterar):
- Conteúdo de output do usuário (templates de email, CVs, recibos, código gerado)
- Simulações de UI externa (preview Google Search, preview WhatsApp)
- Simulações de objeto físico (cartão fidelidade, cartão de crédito, folha A4 de currículo/recibo)

---

### Fase 5.1 — Geradores principais (Layout A)

**Ferramentas:** `favicon-generator`, `custom-qr-code`, `qr-generator`, `pix-qr`, `wifi-qr`

Além do roteiro genérico:

`favicon-generator`:
- `favicon-shell.tsx`: `rounded-xl` → `rounded-lg` nos painéis
- `export-panel.tsx`: `font-bold` → `font-semibold`

`custom-qr-code`:
- Criar type guards para 4× `as any` (auditoria §15):
  ```ts
  type DotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  type CornerType = "dot" | "square" | "extra-rounded";
  function isDotType(v: string): v is DotType { ... }
  function isCornerType(v: string): v is CornerType { ... }
  ```

---

### Fase 5.2 — Geradores visuais (Layout A/C)

**Ferramentas:** `barcode-generator`, `batch-barcode`, `password-generator`, `gradient-generator`, `color-palette`, `box-shadow`

Além do roteiro genérico:

- `gradient-generator`: verificar `shadow-lg` em painéis em fluxo — remover
- `password-generator`: confirmar único `variant="default"` (botão "Gerar senha")
- `color-palette`, `box-shadow`: `rounded-lg` em cards internos → `rounded-md`

---

### Fase 5.3 — Calculadoras (Layout B)

**Ferramentas:** `termination-calculator`, `salary-calculator`, `vacation-calculator`, `christmas-bonus-calculator`, `bmi-calculator`, `compound-interest`, `fixed-income`, `loan-calculator`, `business-days-calculator`, `age-calculator`, `night-allowance`, `overtime-calculator`, `percentage-calculator`

Além do roteiro genérico:

- ResultBox corrigido na Fase 4 — herança automática
- Verificar overrides inline `text-2xl font-bold` → `text-2xl font-semibold` (bmi-calculator ~ln119, age-calculator ~ln119)
- Confirmar `space-y-3` em form rows (não `space-y-6`)

---

### Fase 5.4 — Conversores de texto e dados (Layout C)

**Ferramentas:** `base64`, `binary-converter`, `morse-converter`, `text-converter`, `temperature-converter`, `unit-converter`, `url-encoder`, `timestamp-converter`, `csv-json`, `json-formatter`, `css-minifier`, `markdown-to-html`, `text-cipher`, `hash-generator`, `uuid-generator`, `image-base64`, `number-generator`, `numero-por-extenso`

Além do roteiro genérico:

- `base64`: `bg-white` hardcoded → `bg-card`; `rounded-lg` → `rounded-md`
- `css-minifier`: `text-3xl font-bold` → `text-2xl font-semibold`
- `json-formatter`: `rounded-lg` no bloco de output → `rounded-md`
- Todos: blocos de código devem usar `bg-card` (não `bg-white`), `font-mono text-sm`

---

### Fase 5.5 — Ferramentas de texto e utilidades (Layout C/B)

**Ferramentas:** `character-counter`, `text-diff`, `text-generator`, `remove-duplicates`, `text-cleaner`, `whatsapp-formatter`, `whatsapp-link`, `random-picker`, `stopwatch`, `keep-awake`, `typing-test`

Além do roteiro genérico:

- `character-counter`: stat principal `font-bold` → `font-semibold`
- `remove-duplicates`: `text-xl font-bold` → `text-xl font-semibold`
- `stopwatch`: `text-5xl font-bold` → `text-4xl font-semibold font-mono tabular-nums` (exceção ao text-2xl para displays de tempo)
- `keep-awake`: idem
- `typing-test`: `text-3xl font-bold` → `text-2xl font-semibold`
- `whatsapp-formatter` preview: `shadow-lg` é **exceção documentada** (simulação de UI do WhatsApp)

---

### Fase 5.6 — Ferramentas de imagem (Layout A/C)

**Ferramentas:** `qr-reader`, `image-cropper`, `resize-image`, `compress-image`, `convert-image`, `image-to-text`

Além do roteiro genérico:

- `compress-image`: `text-3xl font-bold` → `text-2xl font-semibold font-mono`
- `convert-image`: idem
- Dropzones: `border-dashed border-border bg-muted/40` (DESIGN.md §10.12)
- Preview de imagem: `border border-border` sem sombra

---

### Fase 5.7 — Visualizadores e Inspetores (Layout C)

**Ferramentas:** `consulta-cep`, `consulta-cnpj`, `tabela-fipe`, `csv-viewer`, `meta-tag-generator`, `google-preview`, `decodificador-pix`, `validador-boleto`

Além do roteiro genérico:

`google-preview`:
- H1 `text-2xl font-bold` → `text-2xl font-semibold`
- Container do preview Google: manter `bg-white border-[#dfe1e5]` (**exceção documentada**); `rounded-xl` → `rounded-lg`; remover `shadow-sm`

`meta-tag-generator`: mesma exceção do google-preview para cores hardcoded dentro do preview
`validador-boleto`: `text-xl font-bold` → `text-xl font-semibold`

---

### Fase 5.8 — Documentos, impressos e dados (Layout A/B)

**Ferramentas:** `email-signature`, `curriculo`, `menu`, `ordem-servico`, `receipt`, `pdf`, `loyalty-card`, `inventario`, `checklist`, `drawing-canvas`, `mock-data`, `credit-card-generator`, `cpf-generator`, `cnpj-generator`, `work-hours`

Além do roteiro genérico:

`email-signature` (bug crítico auditoria §8 e §28):
- Migrar de `useForm` + `register()` direto → padrão `<Form>` + `<FormField>` (referência: `vacation-calculator-client.tsx`)
- Schema: `.or(z.literal(""))` → `.optional().default("")`
- Templates em `templates/`: **exceção documentada** (conteúdo de output, não chrome)

`curriculo`:
- Chrome ao redor do preview A4: roteiro genérico
- Preview da folha A4 (`shadow-xl ring-1`): **exceção documentada** (papel impresso)
- Conteúdo de templates (`font-bold`, `text-[28px]`): **exceção documentada**

`receipt`, `ordem-servico`, `checklist`: chrome → roteiro genérico; preview de papel → **exceção documentada**

`loyalty-card`:
- Tab ativa com `shadow-sm` → remover
- Canvas do cartão → **exceção documentada**

`credit-card-generator`: preview do cartão físico → **exceção documentada**
`work-hours`: `text-3xl font-bold` → `text-2xl font-semibold`

---

## Critérios de conclusão

- [ ] Fases 2, 3, 4 aplicadas e verificadas
- [ ] 84 ferramentas passaram pelo roteiro da Fase 5
- [ ] Nenhum `font-bold` em chrome de UI (exceções documentadas: conteúdo de output)
- [ ] Nenhum `text-3xl+` em chrome de UI (exceção: displays de cronômetro/timer)
- [ ] Nenhum `bg-white` hardcoded fora de simulações de UI externa ou papel
- [ ] Nenhuma sombra em elementos em fluxo
- [ ] Section headers: `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Um designer externo olha 3 ferramentas aleatórias e diz "parece Linear/Vercel/Figma"
