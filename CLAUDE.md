# CLAUDE.md – Frontend Development Guide

## Purpose

This document provides structured guidance for Claude (AI coding assistant) to work effectively within this frontend project.

The goal is to ensure:

* Consistency
* High-quality code
* Predictable structure
* Alignment with project standards

---

# Project Overview

This is a **Next.js application** focused on building SEO-driven utility tools.

### Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS (v4)
* shadcn/ui
* React Hook Form
* Zod
* pnpm
* Biome

---

# Core Principles

## 1. Simplicity First

* Prefer simple solutions over complex abstractions
* Avoid premature optimization
* Avoid unnecessary dependencies

---

## 2. Performance by Default

* Prefer **Server Components** whenever possible
* Use Client Components only when necessary (interactivity)
* Avoid unnecessary state and effects
* Optimize for Core Web Vitals

---

## 3. SEO-First Architecture

Every page must follow this structure:

1. H1 title
2. Supporting description
3. Tool component
4. Additional SEO content (text / FAQ)

This must be implemented via a reusable **Server Component wrapper**.

---

## 4. Accessibility First

* Use semantic HTML
* Ensure keyboard navigation
* Add ARIA attributes when necessary
* Inputs must always have labels

---

## 5. Consistency Over Preference

* Follow existing patterns strictly
* Do not introduce new patterns unless necessary

---

# Code Style Rules

## General

* Code must be written in **English**
* No comments
* No emojis
* Prefer `type` over `interface`
* Prefer `function` over arrow functions

---

## Naming

* Use descriptive names
* Avoid abbreviations
* Components: PascalCase
* Functions: camelCase
* Files: kebab-case

---

## Example

```ts
type CharacterCountResult = {
  characters: number
  words: number
}
```

---

# Project Structure

```id="pjk32a"
/app
/components
  /ui
  /tools
/lib
/hooks
/types
```

---

# Component Guidelines

## Server vs Client

### Use Server Components when:

* Static content
* SEO content
* Layouts

### Use Client Components when:

* User input
* Event handling
* Dynamic UI updates

---

## Reusability

* Extract reusable logic into components
* Avoid duplication
* Keep components small and focused

---

# Styling Rules

## Tailwind Usage

* Use Tailwind utility classes
* Do not hardcode colors
* Always use design tokens from global CSS

---

## Design System

* Follow predefined tokens (colors, spacing, radius)
* Ensure visual consistency across pages

---

# Forms

* Use `react-hook-form`
* Validate with `zod`
* Do not implement manual validation logic

---

# State Management

* Use local React state
* Avoid global state unless strictly necessary

---

# Data Handling

* No backend integration by default
* All tools should run client-side unless explicitly required

---

# Environment Variables

* Never expose env variables in code
* Use `.env` for local development
* Use platform secrets for production

---

# Error Handling

* Fail gracefully
* Do not expose internal errors to users
* Provide user-friendly messages (pt-BR)

---

# Internationalization

* UI labels must be in **pt-BR**
* Code must remain in English

---

# Performance Guidelines

* Avoid unnecessary re-renders
* Avoid large dependencies
* Lazy load when appropriate

---

# Accessibility Checklist

* All inputs have labels
* Buttons are keyboard accessible
* Proper focus states
* Semantic HTML usage

---

# SEO Guidelines

* Use proper heading hierarchy
* Include meaningful text content
* Avoid empty pages
* Prefer server-rendered content

---

# shadcn/ui Usage

* Use shadcn components as base
* Customize via Tailwind + tokens
* Do not modify library core files directly

---

# What NOT to Do

* Do not add comments in code
* Do not introduce new libraries without clear need
* Do not break existing patterns
* Do not hardcode styles outside tokens
* Do not use inline styles

---

# Expected Behavior from Claude

When generating code, Claude should:

* Follow all rules in this document
* Respect project structure
* Produce clean, production-ready code
* Avoid overengineering
* Prefer clarity over cleverness

---

# Output Expectations

Claude should generate:

* Complete, working code
* Proper typing
* Clean structure
* No unnecessary explanation unless requested

---

# Final Note

If any requirement is unclear:

* Default to simplicity
* Follow existing patterns
* Optimize for performance and SEO
