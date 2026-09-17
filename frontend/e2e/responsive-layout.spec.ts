import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-360", width: 360, height: 740 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-393", width: 393, height: 852 },
  { name: "mobile-412", width: 412, height: 915 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-600", width: 600, height: 960 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-820", width: 820, height: 1180 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
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
      await expect.poll(() => page.evaluate(() => ({
        pageFits: document.documentElement.scrollWidth <= window.innerWidth + 1,
        mainFits: !document.querySelector("main") || document.querySelector("main")!.scrollWidth <= window.innerWidth + 1,
      }))).toEqual({ pageFits: true, mainFits: true });
    }

    await page.screenshot({
      path: `test-results/responsive-${viewport.name}.png`,
      fullPage: false,
    });
  });
}
