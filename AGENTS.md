# Agent guide

This file applies to the entire repository. It is the operational reference for
AI coding agents and complements the human-facing `README.md` and
`CONTRIBUTING.md`.

## Mission

Keep this repository a secure, current, reusable community template for a
full-stack Turborepo. Prefer changes that improve the template for many users
over product-specific abstractions.

## Repository map

- `apps/api`: NestJS API, Jest unit tests, port `3002`.
- `apps/web`: Next.js App Router application, port `3000`.
- `apps/docs`: Next.js App Router documentation application, port `3001`.
- `apps/e2e`: Playwright API and browser end-to-end tests.
- `packages/ui`: shared shadcn/ui components, utilities, and Tailwind styles.
- `packages/eslint-config`: shared base, NestJS, Next.js, and React ESLint
  profiles.
- `packages/typescript-config`: shared strict TypeScript profiles.
- `scripts`: repository build and runtime helpers.
- `dist/<app>`: generated deployable output for `api`, `docs`, and `web`.
- `compose.yaml`: development stack and Compose Watch rules.
- `compose.prod.yaml`: production overrides and runtime hardening.

## Toolchain invariants

- Use Bun exclusively for dependency installation and package scripts.
- Use the exact Bun version declared in `packageManager`.
- Use `bun install --frozen-lockfile` for reproducible installs and CI.
- Run workspace commands from the repository root with
  `bun run --cwd <workspace> <script>` when possible.
- Use Turbo for repository-wide task orchestration.
- Do not introduce npm, pnpm, Yarn, or a second lockfile.
- `@typescript/native` provides the TypeScript 7 `tsc` binary.
- `typescript@6` intentionally remains installed as the compiler API used by
  ESLint, Jest, NestJS tooling, and other integrations. Do not remove or
  upgrade it to TypeScript 7 until every integration is verified compatible.

## Build contract

All deployable production outputs must live at the repository root:

```text
dist/
├── api/
├── docs/
└── web/
```

- NestJS emits directly to `dist/api`.
- Next.js must not set `distDir` outside its application directory; Next.js
  forbids that configuration.
- Next.js builds use `.next` only as an intermediate directory.
- `scripts/package-next.mjs` packages standalone Next.js output, public files,
  and static assets into `dist/web` or `dist/docs`, then removes `.next`.
- Keep the Turbo output declarations app-specific and rooted with
  `$TURBO_ROOT$`. Never let parallel app tasks cache the entire root `dist`
  directory as one shared output.
- Do not commit `dist`, `.next`, `.turbo`, coverage, Playwright reports, test
  results, or dependency directories.
- Do not edit generated build output.

## Code standards

- Preserve strict TypeScript. Avoid `any`, unsafe assertions, and disabled
  checks unless a narrow, documented exception is necessary.
- Use the shared ESLint and TypeScript configurations rather than duplicating
  rules in an application.
- Let Prettier own formatting. Do not add formatting rules to ESLint.
- Keep imports explicit and respect workspace package boundaries.
- Prefer small, testable functions and framework-native patterns.
- Update documentation and tests whenever public behavior, commands, ports,
  environment variables, or architecture changes.

### Next.js and React

- Default to React Server Components. Add `"use client"` only when browser
  state, effects, event handlers, or client-only APIs require it.
- Use `next/image`, `next/font`, and App Router metadata APIs where applicable.
- Preserve accessible names, keyboard behavior, focus states, semantic HTML,
  and adequate contrast.
- Avoid hydration work, client-side data fetching, and new dependencies when a
  server-side or platform-native solution is sufficient.
- Put reusable primitives, hooks, utilities, tokens, and global UI styles in
  `packages/ui`.
- Add shadcn primitives through
  `bun run --cwd packages/ui add:component <name>`.
- Keep application-specific compositions in their application.

### NestJS

- Use modules and dependency injection; avoid global mutable state.
- Validate external inputs at the application boundary.
- Keep controllers thin and move behavior into injectable services.
- Add or update Jest tests for service and controller behavior.
- Preserve graceful shutdown and environment-driven port configuration.

### Tests

- Jest is for NestJS unit tests.
- Playwright is the only end-to-end framework.
- Put API contracts in Playwright `APIRequestContext` tests.
- Put browser-visible flows in Playwright browser projects.
- Keep tests deterministic, isolated, and safe to retry.
- Never use production credentials or external mutable services in the default
  test suite.

## Docker contract

- Target Docker Compose 5 or newer and the current Compose Specification.
- Never add the obsolete top-level Compose `version` field.
- Keep `compose.yaml` optimized for development and Compose Watch.
- Keep production changes in `compose.prod.yaml`.
- Use the shared multi-stage `Dockerfile`; do not create divergent application
  Dockerfiles without a demonstrated need.
- Pin production and build base images by version and digest.
- Keep dependency installation in cacheable layers and use the frozen lockfile.
- Production images must contain runtime artifacts and dependencies only.
- Run production processes as a non-root user.
- Preserve health checks, `init`, dropped capabilities,
  `no-new-privileges`, read-only filesystems, bounded PIDs, writable tmpfs
  mounts, graceful shutdown, and log rotation.
- Keep BuildKit SBOM and provenance generation enabled for production.
- Do not use build arguments or image layers for secrets.
- Never copy `.env` files, credentials, local caches, or generated host output
  into an image.
- When testing containers, always stop the stack before handing work back.

Useful commands:

```bash
bun run docker:config
bun run docker:dev
bun run docker:down
bun run docker:prod
bun run docker:prod:down
```

## Dependency policy

- Confirm current versions from primary documentation or package registries
  before claiming a dependency is latest.
- Keep direct dependencies current unless a documented compatibility constraint
  applies.
- Run `bun outdated --recursive` after dependency work.
- Run `bun run audit` after every lockfile or dependency change.
- Preserve security overrides until the full dependency graph resolves to
  non-vulnerable versions without them.
- Review Docker base-image digest updates and GitHub Action SHA updates
  deliberately.

## Validation

Choose the smallest relevant checks while iterating, then run the complete
gate before handoff:

```bash
bun install --frozen-lockfile
bun run check
bun run audit
bun run build
bun run test:e2e
bun run docker:config
```

For Docker or runtime changes, additionally build and test the production
stack:

```bash
bun run docker:prod
E2E_API_URL=http://127.0.0.1:3002 \
E2E_DOCS_URL=http://127.0.0.1:3001 \
E2E_WEB_URL=http://127.0.0.1:3000 \
bun run --cwd apps/e2e test:e2e
bun run docker:prod:down
```

Verify that:

- only `dist/api`, `dist/docs`, and `dist/web` contain production output;
- no legacy `apps/*/dist` or production `.next` directory remains;
- Compose configuration renders without warnings;
- all containers become healthy;
- no container remains running after validation.

## Security and Git hygiene

- Never commit secrets, tokens, private keys, personal data, or real `.env`
  files.
- Use placeholders in `.env.example` files.
- Treat logs, screenshots, traces, issue content, and fixtures as possible
  secret sources.
- Do not weaken lint, type, test, audit, CodeQL, Dependabot, or CI gates to make
  a change pass.
- Preserve unrelated user changes in a dirty worktree.
- Do not stage, commit, push, open a pull request, publish an image, or mutate
  repository settings unless the user explicitly requests it.
- Before recommending a commit, run `git diff --check`, inspect all candidate
  files, and confirm generated output remains ignored.

## Definition of done

A change is complete when implementation, focused tests, full relevant gates,
documentation, generated-output checks, and cleanup all pass. Report any
skipped validation and its reason explicitly.
