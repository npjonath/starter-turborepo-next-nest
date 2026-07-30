# `@repo/eslint-config`

Shared ESLint flat configurations for the monorepo:

- `@repo/eslint-config/base` for framework-agnostic TypeScript
- `@repo/eslint-config/nest-js` for NestJS and Jest
- `@repo/eslint-config/next-js` for Next.js and Core Web Vitals
- `@repo/eslint-config/react-internal` for React libraries

All TypeScript profiles use type-aware strict and stylistic rules through
TypeScript's project service. Prettier runs separately and
`eslint-config-prettier` disables conflicting stylistic rules.
