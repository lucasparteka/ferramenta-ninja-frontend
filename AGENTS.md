# AGENTS.md – Frontend Development Guide

## Project Overview

Next.js application focused on building SEO-driven utility tools.

### Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui
- React Hook Form + Zod
- pnpm
- Biome
- lucide-react

---

## Core Principles

1. **Simplicity first** — prefer simple solutions, avoid premature optimization
2. **Performance by default** — prefer Server Components, avoid unnecessary state and effects
3. **SEO-first** — every page follows the defined structure (see `/app/AGENTS.md`)
4. **Accessibility first** — semantic HTML, keyboard navigation, ARIA when needed
5. **Consistency over preference** — follow existing patterns strictly

---

## Code Style

- Language: **English** (UI labels in **pt-BR**)
- No comments, no emojis
- Prefer `type` over `interface`
- Prefer `function` over arrow functions
- Components: PascalCase | Functions: camelCase | Files: kebab-case
- Use descriptive names, avoid abbreviations

---

## What NOT to Do

- Do not add comments in code
- Do not add extra empty lines between html tags
- Do not introduce new libraries without clear need
- Do not break existing patterns
- Do not hardcode styles outside design tokens
- Do not use inline styles
- Do not expose env variables in code
- Do not expose internal errors to users

---

## Expected Behavior

When generating code:

- Follow all rules in this document and in subdirectory AGENTS.md files
- Produce complete, working, production-ready code
- Avoid overengineering — prefer clarity over cleverness
- No unnecessary explanation unless requested
- If any requirement is unclear: default to simplicity, follow existing patterns