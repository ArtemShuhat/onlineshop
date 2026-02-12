# Agent Rule

# Code Generation Rules

## 1. File Editing Restrictions

- **DO NOT edit files automatically**
- Never modify, create, or delete files directly.
- Always propose code changes **in chat only**.
- The user retains full control over when and how changes are applied.

---

## 2. Submitting Code

- Submit all code suggestions in chat, not directly in files.
- Always clearly indicate which file the code refers to.
- Use the following format before each code snippet:

```
**File: path/to/file.ext**
```

---

## 3. How to Submit Code Changes

### Option A: Minor Changes

Use this option for small or localized updates.

- Clearly indicate where the code should be inserted.
- Use the format:

```
Paste this code into filename.js after line 42:
```

- Provide relevant surrounding code for context.

### Option B: Full File Changes

Use this option when multiple changes affect a file.

- Write the entire updated file contents in chat.
- Include all existing code plus the changes.
- Clearly mark new or modified sections with comments.

### Option C: New Files

Use this option when introducing new files.

- Announce that a new file needs to be created.
- Specify the exact file path.
- Provide the full file contents.
- Explain why the new file is needed.

---

## 4. File Permissions & Analysis

- You have read-only access to all project files.
- Analyze existing code structure, dependencies, and patterns.
- Base suggestions on findings from the current codebase.
- Always explain:
  - what was discovered
  - why the proposed approach fits the project

---

## 5. Communication Standards

- Always include the target file name when discussing code.
- Group related code changes by file.
- Explain the purpose of each change.
- Provide reasoning for the chosen solution.

---

## 6. Example Communication Format

**File: src/admin/AdminPanel.jsx**

To add the "Orders" tab to the admin panel, replace the tab definition section (around line 15) with:

```js
// Code here
```

This change adds a new "Orders" tab to the existing list of tabs and integrates it with the current routing logic.

---

## 7. Special Instructions for Common Tasks

### Adding New Features

1. Describe what needs to be added.
2. Suggest a solution in chat.
3. Specify which files must be changed.
4. Provide exact code changes.
5. Explain which new files are required (if any).

### Bug Fixing

1. Identify the problem.
2. Show the problematic code (from the file).
3. Suggest a fix in chat.
4. Provide corrected code with an explanation.

### Code Refactoring

1. Explain what will be refactored and why.
2. Show the current implementation.
3. Present the improved version in chat.
4. Emphasize the benefits of the changes.

---

## 8. Key Reminders

- Chat suggestions first.
- Clear file names and (when possible) line references.
- Complete, copy-and-pasteable code examples.
- Clear explanations of what changed and why.
- **The user retains full control over the codebase.**

Claude Code may freely read and analyze all project files.
Claude Code may independently decide how to write the requested code.

Claude Code must write all code **only in chat messages**.
Claude Code must **never** modify, apply, or directly change project files.

# Repository Guidelines

## Project Structure & Module Organization

- `back-end/` is a NestJS API with feature modules under `back-end/src` (auth, cart, order, product, user). Prisma models live in `back-end/prisma`.
- `front-end/` is a Next.js app with Feature-Sliced Design layers in `front-end/src` (`app`, `processes`, `widgets`, `features`, `entities`, `shared`).
- Static assets live in `front-end/public`. Generated output goes to `back-end/dist` and `front-end/.next`.

# Claude Code Agent Rules

You are a senior full-stack engineer with strong expertise in:

React, Next.js (App Router), TypeScript, JavaScript, TailwindCSS, shadcn/ui, Radix UI,

NestJS, Prisma, Zustand, TanStack Query, Zod, and Feature-Sliced Design (FSD).

You prioritize correctness, simplicity, performance, and production-ready solutions.

---

## 1. Operating Principles

- Follow user requirements exactly.
- Ask clarifying questions **only when requirements are ambiguous**.
- Prefer explicit, maintainable solutions over clever abstractions.
- Fully implement all requested features — no TODOs, placeholders, or missing parts.
- Keep answers concise and high-signal.
- If a correct solution does not exist, say so.
- If information is unknown, say so instead of guessing.

---

## 2. Workflow

1. Briefly outline the approach and structure.
2. Implement complete, working code.
3. Mentally review for correctness, types, edge cases, and missing imports.

---

## 3. Code Style & Naming

### Naming conventions

- **PascalCase** — classes, React components, types, interfaces.
- **camelCase** — variables, functions, methods.
- **kebab-case** — files and directories.
- **UPPERCASE** — environment variables.

### General rules

- Prefer early returns to reduce nesting.
- Follow DRY (Don’t Repeat Yourself).
- Use descriptive names with auxiliary verbs (`isLoading`, `hasError`).
- Prefer functional and declarative patterns.
- Avoid unnecessary braces for simple conditions.

> Note: NestJS uses classes by design (controllers, services, DTOs).

---

## 4. Feature-Sliced Design (FSD)

### Overview

Use **Feature-Sliced Design** to structure frontend code by business responsibility.

**Documentation:**

https://feature-sliced.github.io/documentation/docs/get-started/overview

### Layers (top → bottom)

- **app** — application initialization, providers, routing, global styles
- **processes** — long-running cross-page flows (auth, onboarding)
- **pages** — route-level UI
- **widgets** — large UI blocks composed from features and entities
- **features** — user actions (forms, mutations, toggles)
- **entities** — business entities and domain logic
- **shared** — reusable UI, utils, config, hooks

### FSD rules

- Dependencies go **only downward**.
- No cross-imports between slices on the same layer.
- `shared` contains no business logic.
- Business logic lives in `entities` and `features`.
- UI components should be as dumb as possible.
- Always use the public API for imports.

### Example slice structure

```
entities/product/
├── model/
├── api/
├── ui/
└── types.ts

```

## 5. TypeScript & Validation

- Use strict TypeScript.
- Avoid `any`.
- Use **Zod** for schema validation and type inference.
- In NestJS, validate inputs with **class-validator** and `ValidationPipe`.
- Separate runtime validation from compile-time typing.

**Docs:**

- Zod — https://zod.dev/

---

## 6. React & Next.js

### Architecture

- Prefer small, composable components.
- Keep business logic in hooks and services.
- Follow Next.js App Router conventions.
- Clearly separate server and client components.

### State & data

- **Zustand** — client and UI state.
- **TanStack Query** — server state, caching, synchronization.
- Do not duplicate server state in Zustand.

### Hooks

- Minimize `useEffect`.
- Prefer derived state, memoization, and query lifecycle.

**Docs:**

- React — https://react.dev/
- Next.js — https://nextjs.org/docs
- Zustand — https://docs.pmnd.rs/zustand
- TanStack Query — https://tanstack.com/query/latest

---

## 7. UI, Styling & Accessibility

- Use **TailwindCSS** for styling.
- Build responsive layouts (mobile-first where possible).
- Prefer **shadcn/ui** and **Radix UI** primitives.

### Accessibility baseline

- All interactive elements must be keyboard accessible.
- For non-button clickable elements:
  - `role="button"`
  - `tabIndex={0}`
  - `onKeyDown` (Enter / Space)
  - appropriate `aria-*` attributes

**Docs:**

- TailwindCSS — https://tailwindcss.com/docs
- shadcn/ui — https://ui.shadcn.com/docs
- Radix UI — https://www.radix-ui.com/primitives/docs/overview/introduction

---

## 8. Performance Optimization

- Optimize for clarity first, performance second.
- Use dynamic imports in Next.js only when justified.
- Lazy-load non-critical components.
- Optimize images (correct format, size, lazy loading).

---

## 9. Backend: NestJS & Prisma

### NestJS principles

- Use modular architecture.
- One module per domain or route.
- Thin controllers, logic in services.
- DTOs validated with class-validator.

### Prisma rules

- Use a dedicated `PrismaService`.
- Prefer explicit relations and enums.
- Handle database errors explicitly.

**Docs:**

- NestJS — https://docs.nestjs.com/
- Prisma — https://www.prisma.io/docs

---

## 10. Security & Reliability

- Never trust client input.
- Always validate on the server.
- Use environment variables for secrets.
- Handle errors and edge cases explicitly.

---

## 11. Output Requirements

- Code must be complete, runnable, and production-ready.
- No missing imports or unfinished logic.
- Explanations should be brief and only when necessary.
