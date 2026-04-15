# CLAUDE.md – Frontend Development Guide

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

---

## Code Navigation (jCodeMunch MCP)

Use the jcodemunch MCP server for all code exploration tasks. Prefer it over reading full files.

### When to use jcodemunch:
- Before reading any file, use `get_file_outline` to see its structure first
- Use `search_symbols` to find functions/classes by name instead of grepping
- Use `get_symbol` to retrieve only the specific function/class you need
- Use `get_repo_outline` when you need a high-level understanding of the project
- Use `search_text` for full-text search across the codebase

### Workflow:
1. Start with `index_folder` if the project hasn't been indexed yet
2. Use `get_repo_outline` to understand the structure
3. Use `search_symbols` to locate relevant code
4. Use `get_symbol` to read only what's needed

Never open an entire file just to find one function. Always prefer symbol-level retrieval.

---

## Core Principles

1. **Simplicity first** — prefer simple solutions, avoid premature optimization
2. **Performance by default** — prefer Server Components, avoid unnecessary state and effects
3. **SEO-first** — every page follows the defined structure (see `/app/CLAUDE.md`)
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

## Project Structure

```
/app
/components
  /ui
  /tools
/lib
/hooks
/types
```

---

## What NOT to Do

- Do not add comments in code
- Do not introduce new libraries without clear need
- Do not break existing patterns
- Do not hardcode styles outside design tokens
- Do not use inline styles
- Do not expose env variables in code
- Do not expose internal errors to users

---

## Expected Behavior

When generating code:

- Follow all rules in this document and in subdirectory CLAUDE.md files
- Produce complete, working, production-ready code
- Avoid overengineering — prefer clarity over cleverness
- No unnecessary explanation unless requested
- If any requirement is unclear: default to simplicity, follow existing patterns