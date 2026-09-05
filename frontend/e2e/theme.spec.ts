import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
  });

  test("starts in dark theme and the toggle is visible in the sidebar", async ({ page }) => {
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme === null || theme === "dark").toBeTruthy();
    await expect(page.getByRole("button", { name: /Switch to light theme/i })).toBeVisible();
  });

  test("toggle switches to light theme and persists across reloads", async ({ page }) => {
    await page.getByRole("button", { name: /Switch to light theme/i }).click();
    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("light");

    await expect(page.getByRole("button", { name: /Switch to dark theme/i })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("toggle back to dark theme persists across reloads", async ({ page }) => {
    await page.getByRole("button", { name: /Switch to light theme/i }).click();
    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("light");

    await page.getByRole("button", { name: /Switch to dark theme/i }).click();
    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("dark");

    await page.reload();
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("dark");
  });
});
