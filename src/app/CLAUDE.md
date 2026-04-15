# CLAUDE.md – App Directory

## Page Structure

Every page must follow this order:

1. H1 title
2. Supporting description
3. Tool component
4. Additional SEO content (text / FAQ)

Implement via a reusable **Server Component wrapper**.

---

## Server vs Client Components

### Use Server Components when:
- Static content
- SEO content
- Layouts

### Use Client Components when:
- User input
- Event handling
- Dynamic UI updates

---

## SEO Guidelines

- Use proper heading hierarchy (H1 → H2 → H3)
- Include meaningful text content on every page
- Avoid empty pages
- Prefer server-rendered content
- All tools should run client-side unless explicitly required

---

## Error Handling

- Fail gracefully
- Do not expose internal errors to users
- Provide user-friendly messages in **pt-BR**