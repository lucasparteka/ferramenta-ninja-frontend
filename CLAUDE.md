# CLAUDE.md

## Projeto

Ferramentas utilitárias web com foco em SEO. Next.js App Router, TypeScript, Tailwind v4, shadcn/ui, React Hook Form + Zod, pnpm, Biome.

## Estrutura

```
/app          — páginas e layouts (Server Components por padrão)
/components
  /ui         — shadcn/ui customizados
  /tools      — componentes de ferramentas
/lib          — utilitários
/hooks        — hooks customizados (useX.ts)
/types        — tipos compartilhados
```

## Convenções

- Código em inglês, UI em pt-BR
- Sem comentários no código
- `type` sobre `interface`, `function` sobre arrow
- PascalCase componentes, camelCase funções, kebab-case arquivos
- Forms: react-hook-form + zod, sem validação manual
- Estilo: só Tailwind utilities + design tokens do CSS global, sem inline styles
- Estado: local useState. Global só se estritamente necessário
- `"use client"` só quando necessário (inputs, eventos, estado)

## Estrutura de página

Toda página segue: H1 > descrição > componente da ferramenta > conteúdo SEO/FAQ. Hierarquia de headings H1→H2→H3. Erros exibidos em pt-BR, sem expor erros internos.

## Não fazer

- Não adicionar libs sem justificativa
- Não quebrar padrões existentes
- Não hardcodar cores fora dos tokens
- Não expor env vars ou erros internos