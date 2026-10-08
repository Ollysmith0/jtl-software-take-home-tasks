# Prompts

*Drafted with AI, edited by me.*

Paraphrased and translated from Vietnamese.

## Planning

1. Extract the core requirements and non-requirements from `instructions.md` and propose a plan in 45-minute blocks (2 to 4 hour time box, no gold-plating). Keep the output very short.

## Architecture

2. Act as a Staff Engineer. Critique my architecture for a 3-hour task, name the over-engineering risks, suggest a pragmatic structure, and write each choice as Decision and Explain.
3. Why `packages/` and not `apps/`? When would a feature belong in `apps/web/src/features`?
4. How should shared state be organised as `shared` grows, without duplicating atoms?
5. Why only a user ID in the atom and not the object? Should shared state go to its own package or stay in the app? What if the URL needs a complex object?
6. Compare keeping the selected user ID in Jotai or in the URL.
7. Should an active filter live in the URL so a shared link shows the same view?

## Documentation

8. Review the files in ai-journey/ against the task's evaluation criteria and list the gaps.
9. Shorten the ai-journey/ files so they are easy to read.

## Where I overrode the AI

- The AI said `shared` should hold "only primitives". I questioned it, and the rule became "do not copy server data into client state". The atom stores a user ID, and the User stays in TanStack Query.
- The AI listed "active filter" and "sidebar collapsed" as Jotai examples. I disagreed: a shareable filter belongs in the URL, and a sidebar used by one component is local state.

## Checks the agent ran that I reviewed

- The latest npm majors were new and unfamiliar (Zod 4, Vite 8, TypeScript 7, ESLint 10, Jotai 3, Vitest 5). The agent pinned stable majors (Zod 3, Vite 6, TypeScript 5.9, ESLint 9, Jotai 2, Vitest 3) so the code matches APIs I can review.
- pnpm 11 blocked the `esbuild` build script and `pnpm install` exited 1. The agent first bypassed it with an environment variable, then replaced that with an explicit `allowBuilds` entry so a fresh clone installs cleanly.
- Turbo replayed cached logs, so a green run did not prove the latest change. The agent re-ran everything with `--force`.
- The agent mutation-tested the rollback test: removing the rollback line made it fail. The test also avoids an active observer, so a refetch cannot hide a broken rollback.
