# Toolchain

*Drafted with AI, edited by me.*

| Tool | Model | Used for |
| --- | --- | --- |
| GitHub Copilot Chat (VS Code), Ask mode | Claude Sonnet 5.5 | Planning: extracting requirements, critiquing architecture, drafting plan.md |
| GitHub Copilot Chat (VS Code), Agent mode | Claude Sonnet 5.5 | Scaffolding the monorepo, implementing hooks/components, fixing lint/type errors |
| VS Code integrated browser (agent tool) | n/a | Manual smoke test of the running app, including the rollback |

## Skills / instructions
- None used.

## MCP servers
- None used.

## How AI output was verified (run by the agent, reviewed by me)
- Ran `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` from a clean `node_modules`, and again with `turbo --force` because cached runs replay old logs.
- Mutation-checked the tests: removed the rollback line and confirmed the rollback test fails; added a `users` to `todos` import and confirmed the ESLint boundary rule fails.
- Clicked through the running app in the browser: validation errors, duplicate username, create user, show todos, optimistic item with "Saving…", forced failure with rollback, and a successful add.
- Not done: screen reader pass, automated `axe` checks.