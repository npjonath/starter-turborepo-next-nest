# starter-turborepo-next-nest

[![CI](https://github.com/npjonath/starter-turborepo-next-nest/actions/workflows/ci.yml/badge.svg)](https://github.com/npjonath/starter-turborepo-next-nest/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, batteries-included full-stack Turborepo template powered by Bun,
Next.js, NestJS, React, shadcn/ui, Tailwind CSS, Playwright, TypeScript, ESLint,
and Prettier.

Use it when you want a typed monorepo with two Next.js applications, a NestJS
API, a shared design system, strict quality gates, and real end-to-end tests
already wired into Turbo.

## Highlights

- Bun workspaces and Turborepo task orchestration
- Next.js App Router applications for `web` and `docs`
- NestJS API with Jest unit tests
- Shared shadcn/ui package built on Base UI and Tailwind CSS
- Playwright API and cross-browser end-to-end tests
- Shared, type-aware ESLint flat configurations
- Shared strict TypeScript configurations
- Repository-wide Prettier formatting
- Production builds and E2E servers managed automatically
- TypeScript 7 compiler with a TypeScript 6 compatibility layer

## Current stack

Versions were verified on July 30, 2026.

| Tool                    |                  Version | Purpose                           |
| ----------------------- | -----------------------: | --------------------------------- |
| Bun                     |                   1.3.14 | Package manager, workspace runner |
| Node.js                 | `^22.13.0` or `>=24.0.0` | Runtime                           |
| Turborepo               |                   2.10.7 | Task graph and caching            |
| TypeScript CLI          |                    7.0.2 | Type checking                     |
| TypeScript compiler API |                    6.0.2 | Tooling compatibility             |
| Next.js                 |                  16.2.12 | `web` and `docs` applications     |
| React / React DOM       |                   19.2.8 | Frontend runtime                  |
| NestJS                  |                  11.1.28 | API framework                     |
| shadcn                  |                   4.16.0 | Shared component management       |
| Base UI                 |                    1.6.0 | Accessible UI primitives          |
| Tailwind CSS            |                    4.3.3 | Shared styling system             |
| ESLint                  |                   10.8.0 | Static analysis                   |
| Prettier                |                    3.9.6 | Formatting                        |
| Jest                    |                   30.4.2 | NestJS unit tests                 |
| Playwright              |                   1.62.0 | API and browser E2E tests         |

## Repository structure

```text
.
├── apps
│   ├── api                  # NestJS API — http://localhost:3002
│   ├── docs                 # Next.js docs app — http://localhost:3001
│   ├── e2e                  # Playwright API and browser tests
│   └── web                  # Next.js web app — http://localhost:3000
├── packages
│   ├── eslint-config        # Shared base, Nest, Next, and React rules
│   ├── typescript-config    # Shared strict TypeScript profiles
│   └── ui                   # Shared shadcn/ui design system
├── prettier.config.mjs
├── turbo.json
└── package.json
```

## Getting started

### Use the GitHub template

Select **Use this template** on GitHub, create your repository, and clone it:

```bash
git clone https://github.com/YOUR_ORG/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Install dependencies

```bash
bun install --frozen-lockfile
```

Install the browser binaries required by Playwright:

```bash
bun run test:e2e:install
```

On Linux CI runners, install the browser system dependencies as well:

```bash
bunx playwright@1.62.0 install --with-deps chromium firefox webkit
```

### Start development

```bash
bun run dev
```

Turbo starts all development servers in parallel:

| Application | URL                     |
| ----------- | ----------------------- |
| Web         | <http://localhost:3000> |
| Docs        | <http://localhost:3001> |
| API         | <http://localhost:3002> |

Run a single workspace when needed:

```bash
bunx turbo dev --filter=web
bunx turbo dev --filter=docs
bunx turbo dev --filter=api
```

## Commands

Run these commands from the repository root.

| Command                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| `bun run audit`            | Fail on high-severity dependency advisories   |
| `bun run dev`              | Start all development servers through Turbo   |
| `bun run build`            | Build the API, web, and docs applications     |
| `bun run check`            | Check formatting, lint, types, and unit tests |
| `bun run lint`             | Run ESLint in every applicable workspace      |
| `bun run check-types`      | Run TypeScript checks through Turbo           |
| `bun run typecheck`        | Alias for `check-types`                       |
| `bun run format`           | Format the repository with Prettier           |
| `bun run format:check`     | Check formatting without changing files       |
| `bun run test`             | Run unit tests                                |
| `bun run test:e2e`         | Build the apps and run Playwright headlessly  |
| `bun run test:e2e:install` | Install Playwright browser binaries           |
| `bun run test:e2e:ui`      | Build the apps and open Playwright UI mode    |

Useful workspace-specific commands:

```bash
# NestJS unit tests
bun run --cwd apps/api test
bun run --cwd apps/api test:watch
bun run --cwd apps/api test:cov

# Playwright debugging and reports
bun run --cwd apps/e2e test:e2e:debug
bun run --cwd apps/e2e test:e2e:report

# Inspect outdated dependencies
bun outdated
```

## How the quality pipeline works

`bun run check` runs the fast, deterministic repository checks:

```text
Prettier check
└── Turbo
    ├── ESLint
    ├── TypeScript
    └── Jest unit tests
```

E2E tests remain a separate command because they build and start three
production applications:

```text
bun run test:e2e
└── Turbo builds api + docs + web
    └── Playwright starts the production servers
        ├── API contract test
        ├── Web browser test
        └── Docs browser test
```

The Playwright configuration records screenshots and videos on failures,
captures a trace on the first retry, and generates an HTML report.

## End-to-end testing

The suite in `apps/e2e` covers:

- `GET /` on the NestJS API through Playwright `APIRequestContext`
- The production `web` application
- The production `docs` application
- Shared shadcn/Tailwind styling in both frontends

Chromium and WebKit run on macOS. Firefox is automatically included on Linux
and Windows. The Playwright Firefox 153 binary currently has a macOS
code-signature/profile issue; set `E2E_INCLUDE_FIREFOX=true` to retry it after a
Playwright upgrade.

To test an existing environment instead of starting local servers, provide all
three URLs:

```bash
E2E_API_URL=https://api.example.com \
E2E_WEB_URL=https://example.com \
E2E_DOCS_URL=https://docs.example.com \
bun run test:e2e
```

## Shared shadcn/ui package

All reusable UI primitives, utilities, hooks, theme tokens, and global Tailwind
styles live in `packages/ui`.

Import shared components from either Next.js application:

```tsx
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
```

Add a shared UI primitive:

```bash
bun run --cwd packages/ui add:component dialog
```

Add a shadcn block from the target application when the block may also generate
application-specific files:

```bash
bunx shadcn@4.16.0 add login-01 --cwd apps/web
```

The `components.json` files route reusable primitives back to `packages/ui`, so
`web` and `docs` consume one shared design system.

## Shared ESLint configuration

`@repo/eslint-config` exposes:

| Export                               | Consumer                                     |
| ------------------------------------ | -------------------------------------------- |
| `@repo/eslint-config/base`           | Framework-agnostic TypeScript and Playwright |
| `@repo/eslint-config/nest-js`        | NestJS and Jest                              |
| `@repo/eslint-config/next-js`        | Next.js and Core Web Vitals                  |
| `@repo/eslint-config/react-internal` | Shared React libraries                       |

The configurations use strict, type-aware `typescript-eslint` rules. Prettier
is responsible for formatting, while `eslint-config-prettier` disables
conflicting rules.

## Shared TypeScript configuration

`@repo/typescript-config` exposes:

| Profile              | Consumer                       |
| -------------------- | ------------------------------ |
| `base.json`          | Node.js tooling and Playwright |
| `nestjs.json`        | NestJS applications            |
| `nextjs.json`        | Next.js applications           |
| `react-library.json` | Shared React packages          |

### Why both TypeScript 7 and TypeScript 6?

Every TypeScript workspace installs:

- `@typescript/native`, aliased to `typescript@7.0.2`, which provides the `tsc`
  binary used by the scripts
- `typescript@6.0.2`, which provides the compiler API currently required by
  tools such as `typescript-eslint`, `ts-jest`, and the Nest CLI

This keeps the repository on the TypeScript 7 compiler without breaking tools
that have not yet migrated their compiler API integration.

## Environment variables

| Variable              | Default                 | Description                                                    |
| --------------------- | ----------------------- | -------------------------------------------------------------- |
| `PORT`                | `3002`                  | NestJS API port                                                |
| `CI`                  | unset                   | Enables CI retries, one Playwright worker, and forbids `.only` |
| `E2E_API_URL`         | `http://127.0.0.1:3002` | API target for Playwright                                      |
| `E2E_DOCS_URL`        | `http://127.0.0.1:3001` | Docs target for Playwright                                     |
| `E2E_WEB_URL`         | `http://127.0.0.1:3000` | Web target for Playwright                                      |
| `E2E_INCLUDE_FIREFOX` | unset                   | Force Firefox into the macOS test matrix                       |

When all three E2E URLs are supplied, Playwright tests that environment without
starting the local production servers.

## Turbo behavior

- Builds depend on upstream workspace builds and cache `.next` and `dist`
  outputs.
- Lint and type checks follow workspace dependency order.
- Unit tests wait for upstream builds.
- E2E tests explicitly depend on the API, docs, and web production builds.
- Development and E2E server processes are intentionally not cached.
- `.env*` files participate in build cache invalidation.

## Before publishing your project

After creating a repository from this template:

1. Replace package names such as `@repo/*` if you need a public organization
   scope.
2. Update the application metadata and starter pages.
3. Replace this README title and description with your product name.
4. Add your environment variables and deployment configuration.
5. Review the MIT license and community files for your project.
6. Run the complete validation:

```bash
bun run check
bun run audit
bun run build
bun run test:e2e
```

## Contributing and support

Contributions are welcome. Before opening a pull request, read:

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support guide](SUPPORT.md)
- [Project governance](GOVERNANCE.md)

This project is released under the [MIT License](LICENSE).

## Documentation

- [Turborepo](https://turborepo.com/docs)
- [Bun workspaces](https://bun.com/docs/pm/workspaces)
- [Next.js](https://nextjs.org/docs)
- [NestJS](https://docs.nestjs.com)
- [shadcn/ui monorepos](https://ui.shadcn.com/docs/monorepo)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright](https://playwright.dev/docs/intro)
- [TypeScript](https://www.typescriptlang.org/docs)
