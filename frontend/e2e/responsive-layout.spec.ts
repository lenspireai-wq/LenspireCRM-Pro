import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const sections = [
  "Dashboard",
  "Sales",
  "Operations",
  "Accounts",
  "Production",
  "Admin",
  "Settings",
] as const;

for (const viewport of viewports) {
  test(`${viewport.name} pages stay inside the viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const section of sections) {
      await page.goto(`/?section=${encodeURIComponent(section)}`);
      await expect(page.locator("main")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        )
        .toBe(true);
    }

    await page.screenshot({
      path: `test-results/responsive-${viewport.name}.png`,
      fullPage: false,
    });
  });
}
