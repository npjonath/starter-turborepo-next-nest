# Web

Next.js App Router application served on <http://localhost:3000>.

Run commands from the repository root:

```bash
bun run --cwd apps/web dev
bun run --cwd apps/web lint
bun run --cwd apps/web check-types
bun run --cwd apps/web build
```

The production build is a standalone Next.js runtime emitted to `dist/web` at
the repository root:

```bash
bun run --cwd apps/web build
bun run --cwd apps/web start:prod
```

Reusable components and design tokens belong in `packages/ui`.

Docker development and production are managed from the repository root with
`bun run docker:dev` and `bun run docker:prod`.
