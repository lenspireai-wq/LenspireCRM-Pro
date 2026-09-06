import { spawn } from "node:child_process";
import { resolve } from "node:path";

const cli = resolve("node_modules/@playwright/test/cli.js");
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    PLAYWRIGHT_BROWSERS_PATH: resolve(".playwright-browsers"),
  },
});

child.on("exit", (code) => process.exit(code ?? 1));
