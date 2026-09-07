import { chromium, type FullConfig } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const STORAGE_DIR = resolve(__dirname, ".auth");
const STORAGE_FILE = resolve(STORAGE_DIR, "admin.json");
const WEB_URL = process.env.PLAYWRIGHT_WEB_URL ?? "http://127.0.0.1:3000";

export default async function globalSetup(_config: FullConfig) {
  if (!existsSync(STORAGE_DIR)) mkdirSync(STORAGE_DIR, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(WEB_URL, { waitUntil: "domcontentloaded" });

  await page.locator('input[name="username"]').fill("sandeepj");
  await page.locator('input[name="password"]').fill("Test@123");
  await page.locator("button.loginSubmit").click();

  await page.waitForTimeout(3000);
  
  const html = await page.content();
  console.log("HTML after login:", html.substring(0, 1000));
  console.log("URL:", page.url());
  
  await page.waitForSelector('nav.sidebar, .sidebar, [data-testid="sidebar"]', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);

  const storage = await context.storageState();
  writeFileSync(STORAGE_FILE, JSON.stringify(storage, null, 2));

  await browser.close();
}

export { STORAGE_FILE };
