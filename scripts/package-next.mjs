import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const supportedApps = new Set(["docs", "web"]);
const appName = process.argv[2];

if (!appName || !supportedApps.has(appName)) {
  throw new Error(
    `Expected one of ${[...supportedApps].join(", ")}, received ${appName ?? "nothing"}.`,
  );
}

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const appRoot = path.join(repositoryRoot, "apps", appName);
const nextRoot = path.join(appRoot, ".next");
const standaloneRoot = path.join(nextRoot, "standalone");
const standaloneAppRoot = path.join(standaloneRoot, "apps", appName);
const outputRoot = path.join(repositoryRoot, "dist", appName);
const outputAppRoot = path.join(outputRoot, "apps", appName);

await stat(path.join(standaloneAppRoot, "server.js"));

await rm(outputRoot, { force: true, recursive: true });
await mkdir(path.dirname(outputRoot), { recursive: true });
await cp(standaloneRoot, outputRoot, {
  recursive: true,
  verbatimSymlinks: true,
});

const publicRoot = path.join(appRoot, "public");

try {
  await stat(publicRoot);
  await cp(publicRoot, path.join(outputAppRoot, "public"), {
    recursive: true,
  });
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

await cp(
  path.join(nextRoot, "static"),
  path.join(outputAppRoot, ".next", "static"),
  { recursive: true },
);

await rm(nextRoot, { force: true, recursive: true });

console.log(
  `Packaged ${appName} in ${path.relative(repositoryRoot, outputRoot)}.`,
);
