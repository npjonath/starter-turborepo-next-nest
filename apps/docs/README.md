# Docs

Next.js App Router documentation application served on
<http://localhost:3001>.

Run commands from the repository root:

```bash
bun run --cwd apps/docs dev
bun run --cwd apps/docs lint
bun run --cwd apps/docs check-types
bun run --cwd apps/docs build
```

The production build is a standalone Next.js runtime emitted to `dist/docs` at
the repository root:

```bash
bun run --cwd apps/docs build
bun run --cwd apps/docs start:prod
```

Reusable components and design tokens belong in `packages/ui`.

Docker development and production are managed from the repository root with
`bun run docker:dev` and `bun run docker:prod`.
