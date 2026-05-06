# Auditoria de UI/Design System

Você é um auditor sênior de frontend. Analise esta base de código e produza documentação dos padrões de UI + relatório de inconsistências. Seja exaustivo — não há limite de tokens, prefira completude a brevidade.

## Stack do projeto
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (config via `@theme` no CSS, não mais `tailwind.config.js`)
- shadcn/ui como base de componentes
- React Hook Form + Zod para formulários
- Biome para lint/format

## Instruções gerais de execução
- Navegue pela base inteira antes de concluir qualquer fase. Não pule arquivos.
- **Toda afirmação precisa de evidência**: cite `caminho/do/arquivo.tsx:linha` para cada padrão identificado e cada inconsistência apontada. Se não tem evidência, não afirme.
- Se encontrar ambiguidade (ex: dois padrões concorrentes igualmente usados), reporte ambos em vez de escolher arbitrariamente.
- Não invente componentes, tokens ou arquivos. Se algo não existe, diga que não existe.
- Trabalhe em fases sequenciais. Ao final de cada fase, salve o output em arquivo antes de seguir.

---

## FASE 1 — Mapeamento

Produza `audit/01-inventory.md` contendo:

### 1.1 Estrutura
- Árvore de `app/`, `components/`, `lib/`, `hooks/` (até 3 níveis)
- Identifique convenção de organização: feature-based, atomic, flat, etc.

### 1.2 Tokens de design
Leia o CSS global (provavelmente `app/globals.css` ou similar) e extraia do bloco `@theme`:
- Cores (incluindo tokens semânticos do shadcn: `--background`, `--foreground`, `--primary`, `--muted`, `--border`, etc.)
- Tipografia (font-family, escalas de tamanho, pesos)
- Espaçamentos customizados
- Border-radius (`--radius` e variantes)
- Sombras, breakpoints, animações customizadas

### 1.3 Componentes
Separe em três categorias:
- **shadcn/ui** (instalados em `components/ui/`): liste cada um, versão se identificável, e se foi customizado em relação ao default
- **Componentes próprios reutilizáveis**: localização, props públicas, onde são consumidos
- **Componentes "soltos"**: JSX inline em páginas que deveria virar componente (cards, headers, etc. duplicados em 3+ lugares)

### 1.4 Telas (rotas)
Liste todas as rotas do App Router com: caminho, tipo (server/client component), layout pai, principais componentes consumidos.

### 1.5 Formulários
Liste cada formulário, com: schema Zod usado, componentes de input, padrão de submit, tratamento de erro.

---

## FASE 2 — Extração de padrões

Produza `audit/02-design-system.md` — este é o **documento oficial do design system** que serve como referência futura.

Para cada categoria abaixo, identifique a versão **canônica** (mais usada ou melhor estruturada) e documente:

### 2.1 Tokens
Tabela com: token | valor | uso semântico | exemplos de onde aplicar.

### 2.2 Componentes
Para cada componente reutilizável, documente:
- **Propósito** (1 frase)
- **Props** (tabela: nome, tipo, default, descrição)
- **Variantes** (extraídas do `cva` quando aplicável)
- **Estados**: default, hover, focus, active, disabled, loading, error
- **Quando usar** vs. **Quando NÃO usar**
- **Exemplo de uso** (snippet real da base, com path)
- **Acessibilidade**: roles ARIA, navegação por teclado, foco visível

### 2.3 Padrões de layout
- Estrutura de páginas (header, sidebar, container, max-widths)
- Grids e responsividade (breakpoints usados, abordagem mobile-first ou desktop-first)
- Spacing rhythm (qual escala é a "oficial")

### 2.4 Padrões de formulário
- Como integrar RHF + Zod + shadcn `<Form>` (mostre o padrão canônico encontrado)
- Tratamento de erro de validação (inline, toast, ambos)
- Estados de loading no submit
- Mensagens de sucesso

### 2.5 Padrões de feedback
- Loading states (skeleton, spinner, suspense)
- Empty states
- Error boundaries
- Toasts/notificações

### 2.6 Padrões de data fetching e UI
- Server Components vs Client Components: quando usar cada um
- Suspense boundaries
- Onde fica `"use client"` e por quê

---

## FASE 3 — Auditoria de inconsistências

Produza `audit/03-inconsistencies.md` com tabela:

| # | Arquivo:linha | Categoria | Problema | Sugestão | Severidade |
|---|---|---|---|---|---|

**Categorias a verificar:**

### Tokens e estilo
- Cores hardcoded (`#fff`, `bg-[#1a1a1a]`, `text-blue-500`) em vez de tokens semânticos
- Espaçamentos fora da escala (`mt-[13px]`, `p-[7px]`)
- Font-sizes arbitrários (`text-[15px]`)
- Uso de `style={{}}` quando classe Tailwind resolveria
- Classes Tailwind v3 que mudaram na v4 (ex: `shadow-sm` → `shadow-xs`, opacity sintaxe)

### Componentes
- Botões/inputs/cards reimplementados em vez de usar shadcn/ui
- Componentes do shadcn modificados localmente (deveriam ser modificados no source)
- Variantes "implícitas" (mesmo componente com 5 jeitos diferentes de aparência via className override)
- JSX duplicado em 3+ lugares que deveria ser componente

### Formulários
- Forms sem Zod
- Forms sem RHF (useState manual)
- Validação client-only sem schema compartilhado
- Mensagens de erro inconsistentes (algumas em pt, outras em en; algumas via toast, outras inline)

### Acessibilidade
- Botões sem `aria-label` quando só têm ícone
- Inputs sem `<Label>` associado
- Modais sem trap de foco
- Contraste insuficiente (sinalize suspeitas baseadas nos tokens)
- `<div onClick>` em vez de `<button>`
- Imagens sem `alt`

### Next.js / App Router
- `"use client"` desnecessário (componente que poderia ser server)
- `<img>` em vez de `next/image`
- `<a>` em vez de `next/link` para rotas internas
- Data fetching em client component que poderia ser server
- Falta de `loading.tsx` / `error.tsx` em rotas

### TypeScript
- `any` explícito ou implícito em props de componente
- Props sem interface/type exportado
- `React.FC` (anti-pattern atual)

**Severidades:**
- 🔴 **Alta**: quebra acessibilidade, performance crítica, ou inconsistência visível ao usuário
- 🟡 **Média**: dívida técnica que dificulta manutenção
- 🟢 **Baixa**: melhoria de consistência sem impacto funcional

Ao final do arquivo, inclua:
- **Resumo executivo**: contagem por severidade e por categoria
- **Top 10 prioridades**: o que atacar primeiro
- **Padrões de refatoração recomendados**: para os 3 problemas mais frequentes, mostre código antes/depois

---

## FASE 4 — Sumário

Produza `audit/00-README.md` com:
- Visão geral do estado do design system (1 parágrafo)
- Pontos fortes (o que já está bem padronizado)
- Pontos fracos (3-5 maiores problemas)
- Roadmap sugerido de remediação em 3 sprints
- Links para os outros 3 documentos

---

## Restrições finais
- Não modifique nenhum arquivo de código nesta auditoria. Apenas leia e documente.
- Se encontrar arquivo de configuração crítico que não consegue interpretar, reporte explicitamente.
- Se a base usar algum padrão que você não reconhece, descreva-o objetivamente em vez de classificá-lo como erro.