# JTL Frontend Take-Home

*Drafted with AI, edited by me.*

Create users, view a user by ID, add todos with an **optimistic update and rollback**,
and list a user's todos. React + TypeScript + Vite in a Turborepo (pnpm).

## Run

Node 20+ and pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

**See the rollback:** tick *Simulate server failure* in the header, then add a todo.
It appears as "Saving…", disappears, and an error says why. User `1` (alice) is seeded.

## Structure

```text
apps/web          routing, layout, pages (composes the features)
packages/users    User feature: api, schema, hooks, components
packages/todos    ToDoItem feature: same shape
packages/shared   types, queryClient, fake API, selected-user atom, form field
```

- **Split by feature, not by layer:** each feature owns its data, logic and UI.
- **Features never import each other:** `package.json` lists only `shared`, and an
  ESLint rule fails on any cross-feature import. `apps/web` does the wiring.
- **`shared` holds only what two or more features need.**

## Decisions

- **Optimistic create:** cancel queries, snapshot, insert; restore on error; refetch when
  settled. Lives in `createTodoMutationOptions`, so it is tested without React.
- **State:** server data in TanStack Query; Jotai only for the selected user ID. A real
  project would use the URL; Jotai is here because the task asks for it.
- **Zod:** one schema gives validation and the type, with consistent messages.
- **Fake in-memory API** instead of MSW: its failure switch demonstrates the rollback.
  Each feature's `api.ts` is the swap point.
- **Code-based router:** three routes are readable in one file.
- **Accessibility:** labelled inputs, errors linked with `aria-describedby`,
  `role="alert"`, focus moves to the first invalid field, skip link.

## Reflection

**Performance**
- `staleTime` 30s, no retry on 404 or conflict, and a mutation invalidates only the
  list it changed.
- The user route prefetches and links preload on intent; the atom holds an ID, so few
  components re-render.
- Not done: route-level code-splitting (one 130 kB gzip chunk).

**Testing**
- Done: rollback, success path and both Zod schemas (Vitest, real `QueryClient`).
- Next: component tests (Testing Library + MSW), `axe` checks, and one Playwright test
  of create user, add todo, failure, rollback.

AI usage: [`ai-journey/`](./ai-journey)
