# FASE 3 — Auditoria de Inconsistências

## Tabela de Inconsistências

| # | Arquivo:linha | Categoria | Problema | Sugestão | Severidade |
|---|---|---|---|---|---|
| 1 | `src/app/globals.css:218-222` | Tokens e estilo | `rgb(var(--primary))` no `.json-formatter .token-key`. `--primary` é OKLCH, não RGB — o valor não é interpretado corretamente. | Usar `oklch(from var(--primary) l c h)` ou extrair valores RGB separados | 🔴 Alta |
| 2 | `src/app/globals.css:223` | Tokens e estilo | `rgb(var(--success))` — token `--success` não existe no tema | Adicionar `--success` ao tema ou usar `--primary`/`--accent` | 🔴 Alta |
| 3 | `src/app/globals.css:226` | Tokens e estilo | `rgb(var(--warning))` — token `--warning` não existe no tema | Adicionar `--warning` ao tema ou usar `--muted-foreground` | 🔴 Alta |
| 4 | `src/components/shared/result-box.tsx:7-8` | Tokens e estilo | `border-warning/40` e `bg-warning/10` usados, mas token `warning` não existe no tema | Adicionar `--warning` como token de cor semântico ou criar variante temporária | 🔴 Alta |
| 5 | `src/app/layout.tsx:58` | Next.js / App Router | `await headers()` na root layout força **SSR dinâmico** em TODAS as páginas. A app não pode ser static generation. | Mover lógica de PDF render para middleware (já existe parcialmente em `middleware.ts`) ou usar cabeçalhos apenas nos layouts que precisam | 🟡 Média |
| 6 | `src/app/` | Next.js / App Router | Nenhuma rota tem `loading.tsx` ou `error.tsx`. Em caso de erro em server component, o usuário vê uma tela em branco. | Adicionar `loading.tsx` e `error.tsx` globais e por segmento | 🔴 Alta |
| 7 | `src/components/layout/header.tsx:148` | Acessibilidade | `<div onClick>` para fechar o mobile drawer — div não é interativa por natureza, não recebe foco por teclado | Substituir por `<button>` com `aria-label="Fechar menu"` | 🔴 Alta |
| 8 | `src/components/tools/email-signature/email-signature.tsx` | Componentes | Email-signature usa `useForm` com `register()` direto (RHF cru) em vez do padrão shadcn `<Form>` + `<FormField>` usado por todas as outras ferramentas | Refatorar para usar `<Form>` + `<FormField>` + shadcn inputs | 🟡 Média |
| 9 | `src/components/tools/email-signature/email-signature.tsx:378-410` | Componentes | Swatches de cor são `<button>` com `style={{ backgroundColor: color }}` inline. Consistente com o padrão de cores dinâmicas, mas foge do padrão de usar tokens sempre que possível | Aceitável para cores dinâmicas. Documentar como excessão. | 🟢 Baixa |
| 10 | `src/components/tools/meta-tag-generator/meta-tag-generator.tsx:168-200` | Tokens e estilo | Cores hardcoded do Google Search: `text-[#1a0dab]`, `text-[#006621]`, `text-[#4d5156]`, `bg-[#f0f2f5]` — sem suporte a dark mode adequado (usa `dark:text-[...]` mas não resolve contraste) | Extrair para tokens CSS semânticos com suporte a dark mode | 🟡 Média |
| 11 | `src/components/tools/curriculo/resume-templates/moderno.tsx:34-256` | Tokens e estilo | Uso intensivo de `style={{}}` para cores inline (accent, bordas, backgrounds). ~13 ocorrências. Templates de currículo são renderizados como HTML para PDF — estilo inline é justificado. | Documentar como excessão aceitável. | 🟢 Baixa |
| 12 | `src/components/tools/curriculo/resume-templates/elegante.tsx:41-228` | Tokens e estilo | Mesmo padrão do moderno — ~10 ocorrências de `style={{}}` | Documentar como excessão aceitável. | 🟢 Baixa |
| 13 | `src/components/tools/curriculo/resume-templates/executivo.tsx:31-241` | Tokens e estilo | Mesmo padrão — ~9 ocorrências de `style={{}}` | Documentar como excessão aceitável. | 🟢 Baixa |
| 14 | `src/components/tools/curriculo/resume-templates/traditional.tsx:67` | Tokens e estilo | 1 ocorrência de `style={{ backgroundColor: "var(--accent)" }}` | Documentar como excessão aceitável. | 🟢 Baixa |
| 15 | `src/components/tools/custom-qr-code/custom-qr-code.tsx:187,191,219,223` | TypeScript | 4x `as any` para forçar type de `dotType` e `cornerType`. A lib `qr-code-styling` tem tipos imprecisos. | Criar type guard ou usar `@ts-expect-error` com comentário explicativo | 🟡 Média |
| 16 | `src/app/not-found.tsx` | Componentes | Botão "Voltar ao inicio" usa `<Link>` com classes inline em vez do componente `<Button>` que é o padrão do design system | Usar `<Button variant="default" asChild><Link href="/">Voltar ao inicio</Link></Button>` | 🟢 Baixa |
| 17 | `src/components/ui/dialog.tsx:63` | Acessibilidade | Botão de fechar tem `sr-only "Close"` em inglês, inconsistente com locale pt-BR do layout | Mudar para `sr-only "Fechar"` | 🟢 Baixa |
| 18 | `src/components/ui/sheet.tsx:64` | Acessibilidade | Mesmo problema: `sr-only "Close"` | Mudar para `sr-only "Fechar"` | 🟢 Baixa |
| 19 | `src/components/tools/vacation-calculator/vacation-calculator-client.tsx:191-196` | Componentes | Checkbox "Vender abono" usa `<label htmlFor="sell-abono">` em vez do componente shadcn `<Label>` | Usar `<FormLabel>` do shadcn, que é o padrão nas outras ferramentas | 🟢 Baixa |
| 20 | `src/app/ferramentas/calculadora-salario-liquido/page.tsx:165-264` | Tokens e estilo | Tabelas INSS/IRRF no conteúdo SEO usam `border-gray-200`, `bg-gray-100` — classes do Tailwind v2/v3 que podem não funcionar consistentemente no Tailwind v4 | Usar `border-border`, `bg-muted` com tokens semânticos | 🟡 Média |
| 21 | `src/components/ui/dialog.tsx:115` | Componentes | `DialogTitle` usa `font-heading` que não está definido como token CSS. Herda `font-sans` por fallback, mas cria dependência implícita. | Adicionar `--font-heading` ao tema ou substituir por `font-bold` | 🟢 Baixa |
| 22 | `src/components/ui/sheet.tsx:107` | Componentes | `SheetTitle` também usa `font-heading` | Adicionar `--font-heading` ao tema ou substituir por `font-bold` | 🟢 Baixa |
| 23 | `src/components/ui/alert-dialog.tsx:119` | Componentes | `AlertDialogTitle` também usa `font-heading` | Adicionar `--font-heading` ao tema ou substituir por `font-bold` | 🟢 Baixa |
| 24 | `src/app/globals.css:56-57` | Tokens e estilo | `--shadow` e `--shadow-sm` têm exatamente o mesmo valor (sombras idênticas). Provavelmente um erro de copypaste. | Revisar e diferenciar os valores | 🟢 Baixa |
| 25 | `src/app/ferramentas/calculadora-de-rescisao/page.tsx:98-103` | Formulários | Erro de validação manual (`useState<string | null>`) duplicando validação do Zod. O schema já valida as datas, mas o client component adiciona verificação extra com `new Date()` | Unificar validação no schema Zod ou criar transform custom | 🟢 Baixa |
| 26 | `src/app/ferramentas/` | Formulários | ~70 ferramentas usam `useState` puro sem RHF/Zod. Inconsistente com as 13 que usam RHF+Zod. Para ferramentas simples (1-2 inputs) é aceitável, mas cria dois padrões concorrentes. | Documentar threshold: ferramentas com 3+ campos devem usar RHF+Zod | 🟢 Baixa |
| 27 | `src/components/shared/related-tools.tsx:63` | Tokens e estilo | Link "Veja também" usa `text-[#0000FF]` (azul puro hardcoded) — não usa `text-primary` | Substituir por `text-primary` | 🟡 Média |
| 28 | `src/components/tools/email-signature/email-signature.tsx` | Formulários | Schema Zod usa `.or(z.literal(""))` em vários campos (email, website, urls sociais) para aceitar string vazia. Isso funciona mas é um padrão diferente do resto da base. | Usar `.optional().default("")` para consistência | 🟢 Baixa |
| 29 | `src/app/` | Formulários | `sonner` `<Toaster>` está no root layout, mas nenhum formulário usa toast para sucesso/erro. Todo feedback é inline ou não existe. | Considerar usar toast como complemento ao feedback inline (ex: "Copiado!" com sonner em vez de useState no CopyButton) | 🟢 Baixa |
| 30 | `src/app/globals.css:196` | Tokens e estilo | `outline-ring/50` no `@layer base` — usa `outline-*` que é classe Tailwind v3. No Tailwind v4, a sintaxe de opacidade pode ser diferente. | Verificar compatibilidade Tailwind v4 — usar `outline-ring outline-[length:var(--ring-width, 2px)]` | 🟡 Média |
| 31 | `src/components/shared/category-tools-section.tsx:39-42` | Acessibilidade | Categoria atual usa `<div>` com bolinha verde (`rounded-full bg-primary`) e texto — sem `aria-current="page"` | Adicionar `aria-current="page"` ao container | 🟢 Baixa |
| 32 | `src/app/ferramentas/gerador-de-senha/page.tsx` | Componentes | `<PasswordGenerator />` é importado de um caminho diferente do esperado. A maioria das ferramentas usa `*-client.tsx` (ex: `VacationCalculatorClient`), mas password-generator não segue o padrão. | Renomear para `password-generator-client.tsx` ou documentar padrão alternativo. | 🟢 Baixa |

## Resumo Executivo

### Contagem por Severidade

| Severidade | Contagem |
|------------|----------|
| 🔴 Alta | 5 |
| 🟡 Média | 7 |
| 🟢 Baixa | 20 |
| **Total** | **32** |

### Contagem por Categoria

| Categoria | Contagem |
|-----------|----------|
| Tokens e estilo | 12 |
| Componentes | 7 |
| Acessibilidade | 3 |
| Next.js / App Router | 2 |
| TypeScript | 1 |
| Formulários | 4 |
| **Total** | **32** |

### Top 10 Prioridades

| # | Prioridade | Arquivo | Problema | Severidade |
|---|---|---|---|---|
| 1 | 🔴 | `globals.css:218-226` | JSON formatter quebrado — `rgb()` com tokens OKLCH | 🔴 Alta |
| 2 | 🔴 | `globals.css` + `result-box.tsx:7-8` | `--warning` e `--success` não existem mas são usados | 🔴 Alta |
| 3 | 🔴 | `src/app/` | Sem `loading.tsx`/`error.tsx` em nenhuma rota | 🔴 Alta |
| 4 | 🔴 | `header.tsx:148` | `<div onClick>` sem acessibilidade de teclado | 🔴 Alta |
| 5 | 🟡 | `layout.tsx:58` | `await headers()` impede static generation | 🟡 Média |
| 6 | 🟡 | `related-tools.tsx:63` | `text-[#0000FF]` hardcoded | 🟡 Média |
| 7 | 🟡 | `meta-tag-generator.tsx:168-200` | Cores hardcoded do Google Search | 🟡 Média |
| 8 | 🟡 | `email-signature/` | Padrão RHF diferente do resto da base | 🟡 Média |
| 9 | 🟡 | `globals.css:196` | `outline-ring/50` sintaxe Tailwind v3 | 🟡 Média |
| 10 | 🟡 | `custom-qr-code.tsx:187` | 4x `as any` sem type guard | 🟡 Média |

### Padrões de Refatoração Recomendados

#### Problema 1: Tokens semânticos ausentes (warning, success)

**Antes:**
```css
/* globals.css — tokens que não existem */
.json-formatter .token-string {
  color: rgb(var(--success)); /* não funciona — --success não existe */
}

/* result-box.tsx */
const toneStyles = {
  warning: "border-warning/40 bg-warning/10", /* token não existe */
};
```

**Depois:**
```css
/* globals.css — adicionar ao bloco :root e .dark */
:root {
  --success: oklch(0.6 0.2 145);
  --warning: oklch(0.8 0.15 85);
}
/* @theme inline */
--color-success: var(--success);
--color-warning: var(--warning);
```

---

#### Problema 2: Accessibility — div onClick sem button

**Antes:**
```tsx
{/* header.tsx:148 — div clickável sem acessibilidade */}
<div
  className="absolute inset-0 bg-black/50"
  onClick={() => setMobileOpen(false)}
  aria-hidden="true"
/>
```

**Depois:**
```tsx
<button
  type="button"
  className="absolute inset-0 bg-black/50"
  onClick={() => setMobileOpen(false)}
  aria-label="Fechar menu"
/>
```

---

#### Problema 3: Cores hardcoded em vez de tokens

**Antes:**
```tsx
{/* related-tools.tsx:63 */}
<a className="text-[#0000FF] underline-offset-3 underline">
```

**Depois:**
```tsx
<Link className="text-primary underline underline-offset-3">
```
