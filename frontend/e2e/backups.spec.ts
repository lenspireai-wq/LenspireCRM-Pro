import { test, expect } from "@playwright/test";

test.describe("Backups workspace", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
  });

  const openBackups = async (page: import("@playwright/test").Page) => {
    await page.getByRole("button", { name: /^Settings$/ }).click();
    const settingsViews = page.getByRole("navigation", { name: "Settings views" });
    const backupButton = settingsViews.getByRole("button", { name: /^Backups$/ });
    await backupButton.scrollIntoViewIfNeeded();
    await backupButton.click({ force: true });
  };

  test("admin opens Backups from Settings tabs", async ({ page }) => {
    await openBackups(page);
    await expect(
      page
        .getByRole("region", { name: "Backups" })
        .getByRole("heading", { name: "Backups" }),
    ).toBeVisible();
    await expect(page.locator(".backupSummary")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Create backup now/i }),
    ).toBeVisible();
  });

  test("create-backup action persists a new file in the list", async ({ page }) => {
    await openBackups(page);
    await expect(
      page
        .getByRole("region", { name: "Backups" })
        .getByRole("heading", { name: "Backups" }),
    ).toBeVisible();

    const before = await page.locator(".auditTable tbody tr").count();
    await page.getByRole("button", { name: /Create backup now/i }).click();
    await expect(page.locator(".auditTable tbody tr")).toHaveCount(before + 1, {
      timeout: 15_000,
    });
  });
});
