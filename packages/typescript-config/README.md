# `@repo/typescript-config`

Shared TypeScript configurations for NestJS, Next.js, and React libraries.

## TypeScript 7 compatibility

Application workspaces install two TypeScript packages during the TypeScript 7
transition:

- `@typescript/native` aliases `typescript@7.0.2` and provides the `tsc` binary
  used by typecheck scripts.
- `typescript@6.0.3` provides the compiler API still required by tools such as
  typescript-eslint, ts-jest, and the Nest CLI.

Keep both packages until those tools support the TypeScript 7 compiler API.
