import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceModules = path.join(
  repositoryRoot,
  "apps",
  "api",
  "node_modules",
);
const nodePath = [workspaceModules, process.env.NODE_PATH]
  .filter(Boolean)
  .join(path.delimiter);

const child = spawn(
  process.execPath,
  [path.join(repositoryRoot, "dist", "api", "main.js")],
  {
    env: {
      ...process.env,
      NODE_PATH: nodePath,
    },
    stdio: "inherit",
  },
);

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.once("SIGINT", forwardSignal);
process.once("SIGTERM", forwardSignal);

child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.once("exit", (code) => {
  process.exit(code ?? 0);
});
