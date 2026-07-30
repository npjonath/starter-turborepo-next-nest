# API

NestJS application served on <http://localhost:3002>.

Run commands from the repository root:

```bash
bun run --cwd apps/api dev
bun run --cwd apps/api test
bun run --cwd apps/api test:watch
bun run --cwd apps/api test:cov
bun run --cwd apps/api lint
bun run --cwd apps/api check-types
bun run --cwd apps/api build
```

The production build is emitted to `dist/api` at the repository root:

```bash
bun run --cwd apps/api build
bun run --cwd apps/api start:prod
```

The repository-level Playwright suite verifies the production API contract:

```bash
bun run test:e2e
```

Docker development and production are managed from the repository root with
`bun run docker:dev` and `bun run docker:prod`.
