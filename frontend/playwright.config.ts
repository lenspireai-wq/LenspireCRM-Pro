import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

const WEB_URL = process.env.PLAYWRIGHT_WEB_URL ?? "http://127.0.0.1:3000";
const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://127.0.0.1:8000";
const AUTH_FILE = resolve(__dirname, "e2e/.auth/admin.json");

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { channel: "chrome" },
        storageState: AUTH_FILE,
      },
    },
  ],
  webServer: [
    {
      command: `node -e "fetch('${WEB_URL}').then(()=>process.exit(0)).catch(()=>process.exit(1))"`,
      url: WEB_URL,
      timeout: 30_000,
      reuseExistingServer: true,
    },
    {
      command: `node -e "fetch('${API_URL}/api/health/').then(()=>process.exit(0)).catch(()=>process.exit(1))"`,
      url: `${API_URL}/api/health/`,
      timeout: 30_000,
      reuseExistingServer: true,
    },
  ],
});
