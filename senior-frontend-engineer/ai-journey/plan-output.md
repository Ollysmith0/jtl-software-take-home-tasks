# Plan and architecture

*Drafted with AI, edited by me. Implemented with Copilot (Agent mode).*

## Steps

1. [x] Monorepo: `apps/web`, `packages/shared|users|todos`
2. [x] `shared`: `queryClient`, `fakeDb`, `selectedUserIdAtom`
3. [x] `todos`: optimistic create + rollback (first, highest risk)
4. [x] `users`: create form, detail view
5. [x] Routing
6. [x] Tailwind, a11y
7. [x] ESLint rule blocking cross-feature imports
8. [x] Tests: optimistic rollback and both schemas (the rest is outlined in the README)

## Changes from plan

- `TextField`, `toFieldErrors` and the Tailwind class constants went into `shared`,
  because both forms need them. This makes `shared` a little bigger than planned.
- The failure toggle became a checkbox in the header, so the rollback can be shown in the UI.
- `turbo.json` also has `typecheck` and `test` tasks.
- The selected user lives in Jotai only. There is no filter yet, so nothing uses search params.
- pnpm 11 blocks dependency build scripts, so `esbuild` is approved in `pnpm-workspace.yaml`.

## Key decisions

```text
1. Four packages: web, users, todos, shared
   ├─ Why:        The task asks for visible boundaries. web composes, features
   │              are independent, shared holds common parts.
   └─ Trade-off:  A larger app would add more (ui, config).

2. users and todos never import each other (ESLint no-restricted-imports)
   ├─ Why:        Sideways dependencies turn into a tangled monolith.
   └─ Trade-off:  Anything both need must move to shared.

3. shared stays small: types, queryClient, fake DB, selectedUserIdAtom,
   TextField, toFieldErrors
   ├─ Why:        Holds only what two or more features need. The atom stores a
   │              user ID, not a copy of the User.
   └─ Trade-off:  shared is a coupling point. If it grows, split by
                  responsibility or let web own the state. Never duplicate atoms.

4. Features live in packages/, not apps/
   ├─ Why:        apps/ holds deployable entry points. packages/ holds libraries
   │              that web composes.
   └─ Trade-off:  Features are not independently deployable (no micro-frontends).

5. Flat files per feature (api, schema, hooks, components)
   ├─ Why:        Data access, logic and UI are separate files. Layer folders are
   │              overhead for about 5 files.
   └─ Trade-off:  Layering is by convention only.

6. Custom hooks, no command/handler layer
   ├─ Why:        TanStack Query already gives cache, status and mutations.
   └─ Trade-off:  No single place for cross-cutting behaviour.

7. Packages consumed from src/index.ts, no build step
   ├─ Why:        Vite compiles workspace sources directly.
   └─ Trade-off:  Packages are not publishable.

8. Fake in-memory API with latency and a failure toggle
   ├─ Why:        Fast to set up. The toggle demonstrates rollback. The swap
   │              point to a real backend is each api.ts.
   └─ Trade-off:  The real network layer is not exercised.

9. Optimistic create for ToDoItems
   ├─ Why:        Key requirement, built first.
   │                onMutate   -> cancel queries, snapshot, insert
   │                onError    -> restore snapshot
   │                onSettled  -> refetch
   └─ Trade-off:  More code, and the UI briefly shows unconfirmed data.

10. Jotai for the selected user only
    ├─ Why:        Client-only state read by several routes. Not server state,
    │              so it does not belong in Query.
    └─ Trade-off:  Lost on refresh. In a real project the URL is better. Used
                   here because the task asks for Jotai.

11. Route params and URL as the shareable state
    ├─ Why:        Same link, same screen. The user route prefetches with
    │              ensureQueryData and the page reads the same queryOptions, so
    │              the same URL gives the same cache entry.
    └─ Trade-off:  Only the user route uses it so far. URL schema and query keys
                   must stay in sync. Same URL means same request, not the same
                   data forever.

12. Zod for validation
    ├─ Why:        One schema gives validation and the TypeScript type, with
    │              consistent messages.
    └─ Trade-off:  Extra dependency.

13. Code-based TanStack Router
    ├─ Why:        Three routes (/users/new, /users/$userId, /todos) are visible
    │              in one file.
    └─ Trade-off:  Routes are registered by hand and code-splitting is manual.

14. Accessibility built in (see below)
    ├─ Why:        Semantic HTML, labelled fields and keyboard support are cheaper
    │              at the start than as a retrofit.
    └─ Trade-off:  Checked with the browser accessibility tree only, no screen
                   reader pass and no automated axe tests yet.

15. Minimal turbo.json (build, lint, typecheck, test, dev)
    ├─ Why:        The task says structure matters more than tooling.
    └─ Trade-off:  Slower builds at scale without tuned caching.

16. Tests: the rollback and schemas only
    ├─ Why:        The optimistic update is the key signal, so it is tested
    │              against a real QueryClient without React or a DOM.
    └─ Trade-off:  No component or end-to-end tests yet.
```

## State ownership

```text
State
├── Server state          -> TanStack Query
│                            e.g. user detail, todo list, loading/error status
├── Shared client state   -> Jotai
│                            e.g. selected user ID
├── Shareable view state  -> URL (route params, typed search params)
│                            e.g. user ID in /users/$userId; later filter, sort
└── Local state           -> useState
                             e.g. form inputs, validation errors
```

## Accessibility

```text
Accessibility
├── Semantics      header / nav / main landmarks, one h1 per page, todos in a ul,
│                  native button and router Link (no clickable div), skip link
├── Forms          every input has a label bound with htmlFor
│                  errors linked with aria-describedby and aria-invalid
├── Announcements  server and rollback errors use role="alert"
│                  loading states use role="status"
│                  field errors are read through aria-describedby on focus
├── Keyboard       native controls, so Tab, Enter and Space work
│                  visible focus ring (focus-visible)
│                  failed submit moves focus to the first invalid field
└── Not done       no screen reader pass, no automated axe checks
```

## Folder structure

```text
.
├── turbo.json                    # Tasks: dev / build / lint / typecheck / test
├── pnpm-workspace.yaml           # Workspaces: apps/*, packages/*
├── tsconfig.base.json            # Shared TS config
├── eslint.config.js              # Blocks users <-> todos imports
├── apps/
│   └── web/src/                  # Routing + composition only
│       ├── main.tsx              # Providers: QueryClient, Jotai, Router
│       ├── router.tsx            # Code-based TanStack Router
│       ├── routes/               # NewUserPage, UserPage, TodosPage, ...
│       └── layout/RootLayout.tsx # Semantic shell + failure toggle
└── packages/
    ├── shared/src/               # Only what crosses feature lines
    │   ├── types.ts, errors.ts   # User, ToDoItem, ApiError
    │   ├── queryClient.ts        # Query defaults
    │   ├── fakeDb.ts             # In-memory DB, latency, failure toggle
    │   ├── state.ts              # selectedUserIdAtom
    │   └── TextField.tsx, validation.ts, styles.ts
    ├── users/src/                # No import from todos
    │   ├── api.ts, schema.ts, hooks.ts, schema.test.ts
    │   ├── CreateUserForm.tsx, UserDetail.tsx
    │   └── index.ts              # Public API
    └── todos/src/                # No import from users
        ├── api.ts, schema.ts, hooks.ts   # createTodoMutationOptions: optimistic + rollback
        ├── hooks.test.ts         # rollback and success path
        ├── CreateTodoForm.tsx, TodoList.tsx
        └── index.ts              # Public API
```
