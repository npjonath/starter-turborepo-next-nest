# End-to-end tests

Playwright runs the API contract test once through `APIRequestContext` and the
`web` and `docs` browser scenarios on Chromium and WebKit. Firefox is also
enabled outside macOS.

The Playwright Firefox 153 build currently fails macOS code-signature checks
before creating its temporary profile. Set `E2E_INCLUDE_FIREFOX=true` to retry
it explicitly after upgrading Playwright.

The root Turbo task builds all three applications into `dist/<app>` first.
Playwright then starts their production servers and shuts them down after the
suite. In CI, Playwright targets the hardened production Compose stack instead,
so the same scenarios validate the built containers.

```bash
# Headless suite
bun run test:e2e

# Install the matching browser binaries
bun run test:e2e:install

# Interactive Playwright UI
bun run test:e2e:ui
```

Override the local targets when running against an existing environment:

```bash
E2E_API_URL=https://api.example.com \
E2E_WEB_URL=https://example.com \
E2E_DOCS_URL=https://docs.example.com \
bun run test:e2e
```
