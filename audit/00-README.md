# Auditoria de UI/Design System — Ferramenta Ninja

## Visão Geral

O design system do Ferramenta Ninja está em um estágio **sólido para um projeto de porte médio-grande** (~84 ferramentas, ~140 componentes). A base adota shadcn/ui (base-nova sobre `@base-ui/react`) com Tailwind CSS v4 e OKLCH para cores, resultando em tokens semânticos consistentes entre light/dark mode. A arquitetura de Server Components no App Router com client components isolados é limpa e previsível. No entanto, existem 32 inconsistências identificadas, das quais 5 são de alta severidade (2 delas afetam a renderização visual de funcionalidades existentes) e 7 de média severidade (principalmente dívida técnica). O maior problema estrutural é a ausência de `loading.tsx`/`error.tsx` em todas as rotas e o uso de tokens CSS inexistentes (`--warning`, `--success`).

## Pontos Fortes

1. **Arquitetura Server/Client Component limpa** — 100% das páginas em `src/app/` são Server Components, com `"use client"` apenas em componentes que precisam de interatividade. Nenhum vazamento de padrão.

2. **Sistema de cores OKLCH** — Cores semânticas no espaço OKLCH garantem percepção consistente entre light/dark. Tema escuro bem implementado com contraste adequado na maioria dos tokens.

3. **Padronização de formulários** — 12/13 formulários complexos seguem RHF+Zod+shadcn `<Form>` com resolver. Schema compartilhado, erros inline, tipagem forte.

4. **Componentes shadcn bem implementados** — Os 14 componentes em `components/ui/` seguem a versão base-nova do shadcn, com `cva` para variantes, `data-slot` attributes, e acessibilidade via `@base-ui/react`.

5. **Separação clara de responsabilidades** — Lógica pura em `src/lib/`, componentes em `src/components/`, hooks em `src/hooks/`. Catálogo de ferramentas centralizado em `lib/data/tools.ts`.

6. **SEO estruturado** — JSON-LD (Organization, WebApplication, BreadcrumbList, FAQ, Article, CollectionPage) injetado consistentemente via `PageLayout`. Metadata exportada em todas as páginas.

7. **Performance client-side** — 100% das ferramentas processam dados no navegador, sem dependência de servidor para funcionalidades core.

## Pontos Fracos

1. **Tokens ausentes que quebram features** — `--warning` e `--success` não existem no tema, mas são usados em `result-box.tsx` e `json-formatter`. O json-formatter usa `rgb(var(--primary))` que não funciona com OKLCH. Isso afeta a exibição de JSON formatado.

2. **Sem loading/error states** — Nenhuma rota tem `loading.tsx` ou `error.tsx`. Em caso de erro de servidor, o usuário vê tela em branco. A app não tem skeleton screens ou spinners.

3. **SSR forçado sem necessidade** — `await headers()` no root layout impede static generation em toda a app. Poderia ser movido para middleware.

4. **Dois padrões concorrentes de formulário** — 13 ferramentas usam RHF+Zod, ~70 usam `useState` puro. O email-signature usa RHF mas sem o wrapper shadcn `<Form>`, criando um terceiro padrão.

5. **Acessibilidade com falhas pontuais** — Mobile drawer usa `<div onClick>` em vez de `<button>`. `sr-only` em inglês. Falta `aria-current` em alguns locais.

## Roadmap Sugerido

### Sprint 1 — Correções Críticas (🔴)

| Tarefa | Esforço | Impacto |
|--------|---------|---------|
| Adicionar `--warning` e `--success` ao tema CSS + @theme | 1h | Corrige JSON formatter + ResultBox |
| Corrigir `rgb(var(--primary))` no json-formatter para OKLCH | 30min | Corrige highlight de JSON |
| Adicionar `loading.tsx` e `error.tsx` globais | 2h | Previne tela branca em erros |
| Substituir `<div onClick>` por `<button>` no mobile drawer | 30min | Acessibilidade de teclado |
| Corrigir `text-[#0000FF]` em `related-tools.tsx` para `text-primary` | 5min | Consistência de cor |

### Sprint 2 — Dívida Técnica (🟡)

| Tarefa | Esforço | Impacto |
|--------|---------|---------|
| Refatorar `email-signature` para usar shadcn `<Form>` + `<FormField>` | 4h | Consistência de formulários |
| Revisar `outline-ring/50` para sintaxe Tailwind v4 | 1h | Compatibilidade futura |
| Substituir `border-gray-200`/`bg-gray-100` nas tabelas SEO por tokens | 2h | Consistência visual |
| Extrair cores hardcoded do meta-tag-generator para tokens | 1h | Dark mode adequado |
| Adicionar type guards no custom-qr-code em vez de `as any` | 1h | Type safety |
| Avaliar possibilidade de remover `await headers()` do root layout | 3h | Static generation |

### Sprint 3 — Melhorias (🟢)

| Tarefa | Esforço | Impacto |
|--------|---------|---------|
| Corrigir `sr-only "Close"` para "Fechar" em dialog.tsx e sheet.tsx | 10min | Localização |
| Adicionar `font-heading` como token ou remover dependência | 30min | Consistência |
| Unificar padrão de checkbox label (`<FormLabel>` vs `<label htmlFor>`) | 1h | Consistência |
| Diferenciar `--shadow` de `--shadow-sm` | 30min | Correção de token |
| Adicionar loading state nos botões de submit de formulários | 2h | UX |
| Refatorar `not-found.tsx` para usar `<Button>` component | 30min | Consistência |

## Documentos Relacionados

| Documento | Conteúdo |
|-----------|----------|
| [`01-inventory.md`](./01-inventory.md) | Mapeamento completo: estrutura, tokens, componentes, rotas, formulários |
| [`02-design-system.md`](./02-design-system.md) | Documentação oficial do design system com tabelas de tokens, props e padrões |
| [`03-inconsistencies.md`](./03-inconsistencies.md) | 32 inconsistências com severidade, sugestão e exemplos antes/depois |
