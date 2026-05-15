## Visual Design — Required Reading

**Before** planning any UI implementation or refactor, read:

1. [`DESIGN.md`](./DESIGN.md) — visual manifesto (philosophy, tokens,
   components, layouts, anti-patterns, checklists). The single source of
   truth for how the site and tools should look.
2. [`REFACTOR.md`](./REFACTOR.md) — migration plan. Required when
   touching existing code; describes phases, primitive overrides, and
   per-tool roadmap.

**After** implementing, run the post-implementation checklist in
`DESIGN.md` §15.

If `DESIGN.md` and `audit/02-design-system.md` conflict, `DESIGN.md`
wins. The `audit/02` document describes the **previous** state and is
historical.

The aesthetic target is **precision instrument** (Figma, Linear, Vercel,
Raycast), not "friendly SaaS". See `DESIGN.md` §1 for the full
philosophy and §13 for the soft-SaaS detector.

---
```

## Alterações nas sub-AGENTS.md (opcionais)

### `src/app/AGENTS.md`

Adicione no final:

```markdown
## Visual rules

Page chrome (h1, description, layout containers) follows
[`/DESIGN.md`](../../DESIGN.md) §11. In particular: H1 is `text-2xl
font-semibold tracking-tight`, description is `text-sm
text-muted-foreground`, page padding is `py-8` (not `py-12`).
```

### `src/components/AGENTS.md`

Adicione no final:

```markdown
## Visual rules

All component visual decisions (tokens, spacing, radii, shadows) follow
[`/DESIGN.md`](../../DESIGN.md). Key shortcuts:

- No shadows on cards, panels, inputs, buttons. Only popover/dialog/toast.
- Border radius max `rounded-lg` (8px). Default for inputs/buttons:
  `rounded-md` (6px).
- Section headers: `text-caption font-semibold uppercase tracking-wider
  text-muted-foreground`.
- Numbers/dimensions/IDs: `font-mono`.
- One `<Button variant="default">` per screen.