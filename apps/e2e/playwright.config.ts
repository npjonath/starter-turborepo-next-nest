import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const isCI = Boolean(process.env.CI);
const includeFirefox =
  process.platform !== "darwin" || process.env.E2E_INCLUDE_FIREFOX === "true";
const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));

const apiURL = process.env.E2E_API_URL ?? "http://127.0.0.1:3002";
const docsURL = process.env.E2E_DOCS_URL ?? "http://127.0.0.1:3001";
const webURL = process.env.E2E_WEB_URL ?? "http://127.0.0.1:3000";
const usesRemoteEnvironment = Boolean(
  process.env.E2E_API_URL &&
  process.env.E2E_DOCS_URL &&
  process.env.E2E_WEB_URL,
);

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  forbidOnly: isCI,
  fullyParallel: true,
  outputDir: "test-results",
  projects: [
    {
      name: "api",
      testMatch: /api\.spec\.ts/,
      use: {
        baseURL: apiURL,
      },
    },
    {
      name: "chromium",
      testMatch: /frontends\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    ...(includeFirefox
      ? [
          {
            name: "firefox",
            testMatch: /frontends\.spec\.ts/,
            use: {
              ...devices["Desktop Firefox"],
            },
          },
        ]
      : []),
    {
      name: "webkit",
      testMatch: /frontends\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  retries: isCI ? 2 : 0,
  testDir: "./tests",
  timeout: 30_000,
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: usesRemoteEnvironment
    ? []
    : [
        {
          command: "bun run --cwd apps/api start:prod",
          cwd: repositoryRoot,
          env: {
            ...process.env,
            PORT: "3002",
          },
          gracefulShutdown: {
            signal: "SIGTERM",
            timeout: 1_000,
          },
          name: "api",
          reuseExistingServer: !isCI,
          timeout: 30_000,
          url: apiURL,
        },
        {
          command: "bun run --cwd apps/docs start:prod",
          cwd: repositoryRoot,
          env: {
            ...process.env,
            HOSTNAME: "127.0.0.1",
            PORT: "3001",
          },
          gracefulShutdown: {
            signal: "SIGTERM",
            timeout: 1_000,
          },
          name: "docs",
          reuseExistingServer: !isCI,
          timeout: 30_000,
          url: docsURL,
        },
        {
          command: "bun run --cwd apps/web start:prod",
          cwd: repositoryRoot,
          env: {
            ...process.env,
            HOSTNAME: "127.0.0.1",
            PORT: "3000",
          },
          gracefulShutdown: {
            signal: "SIGTERM",
            timeout: 1_000,
          },
          name: "web",
          reuseExistingServer: !isCI,
          timeout: 30_000,
          url: webURL,
        },
      ],
  ...(isCI ? { workers: 1 } : {}),
});
