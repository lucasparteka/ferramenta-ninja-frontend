# CLAUDE.md – Components

## General Rules

- Extract reusable logic into components
- Avoid duplication
- Keep components small and focused

---

## shadcn/ui

- Use shadcn components as base
- Customize via Tailwind + design tokens
- Do not modify library core files directly

---

## Styling

- Use Tailwind utility classes only
- Do not hardcode colors
- Always use design tokens from global CSS
- Follow predefined tokens (colors, spacing, radius)

---

## Forms

- Use `react-hook-form`
- Validate with `zod`
- Do not implement manual validation logic
- All inputs must have labels

---

## State Management

- Use local React state
- Avoid global state unless strictly necessary
- Avoid unnecessary re-renders

---

## Accessibility

- All inputs have labels
- Buttons are keyboard accessible
- Proper focus states
- Semantic HTML throughout

---

## Performance

- Avoid large dependencies
- Lazy load when appropriate
- Optimize for Core Web Vitals