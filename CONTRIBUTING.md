# Contributing

Thank you for helping improve `starter-turborepo-next-nest`.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
For vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a
public issue.

## Before you start

- Search existing issues and pull requests to avoid duplicates.
- Open an issue before a large architectural change.
- Keep pull requests focused on one concern.

## Local setup

Install [Bun 1.3.14](https://bun.com/docs/installation) and Node.js 24 or newer,
then run:

```bash
bun install --frozen-lockfile
bun run test:e2e:install
```

Start the monorepo:

```bash
bun run dev
```

## Development guidelines

- Preserve strict TypeScript settings; avoid `any` and unsafe assertions.
- Reuse the shared ESLint and TypeScript profiles.
- Put reusable frontend primitives in `packages/ui`.
- Add unit tests for NestJS behavior and Playwright coverage for user-visible
  flows or cross-application contracts.
- Do not commit credentials, local environment files, generated builds, test
  reports, or dependency directories.
- Update documentation when behavior or commands change.

## Validation

Run the same gates as CI before opening a pull request:

```bash
bun install --frozen-lockfile
bun run check
bun run audit
bun run build
bun run test:e2e
bun run docker:config
```

If a change affects container builds or runtime configuration, also run:

```bash
bun run docker:prod
bun run docker:prod:down
```

On Linux, install Playwright and its system dependencies with:

```bash
bunx playwright@1.62.0 install --with-deps chromium firefox webkit
```

## Commits and pull requests

Clear, imperative commit messages are preferred. Conventional Commit prefixes
such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:` are
encouraged.

A pull request should:

- explain the problem and the chosen solution;
- link related issues;
- include tests appropriate to the change;
- include screenshots or recordings for visual changes;
- contain no unrelated formatting or generated-file churn;
- pass every required GitHub check.

Maintainers may ask for changes before merging. Reviews focus on correctness,
security, accessibility, maintainability, test coverage, and compatibility
with the template's supported toolchain.
