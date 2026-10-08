# Judgement: what I would do differently in a real project

*Drafted with AI, edited by me.*

The reasons for each decision are in [plan-output.md](./plan-output.md). This file only records how my choice changes with scale.

```text
1. Four packages
   └─ Real project:  Add typescript-config, eslint-config, tailwind-config and
                     ui packages. Apps override shared config locally.

2. Features in packages/
   └─ Real project:  Start with apps/web/src/features/*. Extract to packages
                     only when a second app or independent testing needs them.

3. users and todos never import each other
   └─ Real project:  Keep the ESLint rule. Types, fake DB and shared state live
                     in shared, not duplicated per feature.

4. shared stays small
   └─ Real project:  Keep it to what two or more features need. Split it
                     (core, app-state) before it becomes a dumping ground.

5. Flat files per feature
   └─ Real project:  Split by role (api, model, hooks, components) once a feature
                     passes about 10 to 15 files, or its logic needs React-free
                     tests.
                       components -> hooks -> api / model   (one-way rule)
                     Export only index.ts.

6. Custom hooks
   └─ Real project:  Put cross-cutting behaviour (logging, error reporting) once
                     at the QueryClient level.

7. No build step
   └─ Real project:  Add a real build only if a package is published or used
                     outside the repo ( CI/CD, deploy ... )

8. Fake in-memory API
   └─ Real project:  Use MSW or a real test backend so tests cover headers,
                     status codes and serialisation.

9. Optimistic create
   └─ Real project:  Use it only for actions that nearly always succeed (adding
                     a todo), not for risky ones such as payments.

10. Jotai for the selected user
    └─ Real project:  Use the URL first (/todos?userId=...). It survives refresh
                      and can be shared.

11. Shareable state in the URL
    └─ Real project:  Rule: if opening the same link should show the same screen,
                      it belongs in the URL.
                        - preload on hover or focus
                        - keep previous data while a filter loads
                        - router preload stale time 0, so only Query caches

12. Zod
    └─ Real project:  Same choice. For a single-field form, hand-written
                      validation would be enough.

13. Code-based Router
    └─ Real project:  Move to file-based routing: the route tree is assembled
                      automatically and code-splitting is automatic.

14. Accessibility
    └─ Real project:  Add axe checks to component tests and Playwright, plus a
                      screen reader pass.

15. Minimal turbo.json
    └─ Real project:  Add caching for build, lint and test, and a remote cache
                      for CI.

16. Tests: rollback and schemas only
    └─ Real project:  Keep the rollback test, then add:
                        - component tests (Testing Library + MSW) for validation
                        - axe checks
                        - one Playwright test: create user, add todo, forced failure
```
