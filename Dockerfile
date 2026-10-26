# syntax=docker/dockerfile:1.20

FROM oven/bun:1.3.14-slim@sha256:d56a2534ffd262e92c12fd3249d3924d296d97086da773f821d7d0477435ea04 AS base

WORKDIR /workspace

ENV BUN_INSTALL_CACHE_DIR=/root/.bun/install/cache \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1

FROM base AS manifests

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/docs/package.json apps/docs/package.json
COPY apps/e2e/package.json apps/e2e/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json

FROM manifests AS dependencies

RUN --mount=type=cache,id=bun-install,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM dependencies AS development

ENV NODE_ENV=development

COPY --chown=bun:bun . .

RUN mkdir -p /workspace/dist && chown bun:bun /workspace/dist

USER bun

FROM manifests AS api-production-dependencies

RUN --mount=type=cache,id=bun-install,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production --filter api --linker hoisted

FROM dependencies AS builder

ENV NODE_ENV=production

COPY . .

RUN bun run build

FROM node:26.12.1-bookworm-slim@sha256:28147155d47dc31abe0a46e0d12b59b2fb3d0a2dcc5dc65fce76a074180b16fe AS runtime

ENV NODE_ENV=production

LABEL org.opencontainers.image.source="https://github.com/npjonath/starter-turborepo-next-nest"

STOPSIGNAL SIGTERM

FROM runtime AS api

ENV PORT=3002

WORKDIR /app

COPY --from=api-production-dependencies --chown=node:node /workspace/node_modules ./node_modules
COPY --from=builder --chown=node:node /workspace/dist/api ./

USER node

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3002').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]

CMD ["node", "main.js"]

FROM runtime AS docs

ENV HOSTNAME=0.0.0.0 \
    PORT=3001

WORKDIR /app/apps/docs

COPY --from=builder --chown=node:node /workspace/dist/docs /app

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3001').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]

CMD ["node", "server.js"]

FROM runtime AS web

ENV HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /app/apps/web

COPY --from=builder --chown=node:node /workspace/dist/web /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
