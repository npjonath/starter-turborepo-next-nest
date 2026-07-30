# `@repo/ui`

Shared shadcn/ui design system for the `web` and `docs` applications.

## Add a component

For a UI primitive, run the command from this workspace:

```bash
bun run --cwd packages/ui add:component dialog
```

For a block that can also create app-specific files, run shadcn from the target
application:

```bash
bunx shadcn@4.16.0 add login-01 --cwd apps/web
```

The workspace aliases in `components.json` route shared UI primitives,
utilities, and hooks into this package.

## Import from an application

```tsx
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

The shared theme and Tailwind source are exposed as `@repo/ui/globals.css` and
loaded once by each application root layout.
