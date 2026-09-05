import { test, expect } from "@playwright/test";

test.describe("Notification preferences", () => {
  test("Settings tabs navigate to Backups, Shortcuts, Rate limits", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Notification preferences" }),
    ).toBeVisible();

    const settingsViews = page.getByRole("navigation", {
      name: "Settings views",
    });
    await expect(settingsViews).toBeVisible();
    await expect(
      settingsViews.getByRole("button", { name: /^Backups$/ }),
    ).toBeVisible();
    await expect(
      settingsViews.getByRole("button", { name: /^Shortcuts$/ }),
    ).toBeVisible();
    await expect(
      settingsViews.getByRole("button", { name: /^Rate limits$/ }),
    ).toBeVisible();

    const backupButton = settingsViews.getByRole("button", { name: /^Backups$/ });
    await backupButton.scrollIntoViewIfNeeded();
    await backupButton.click({ force: true });
    await expect(
      page
        .getByRole("region", { name: "Backups" })
        .getByRole("heading", { name: "Backups" }),
    ).toBeVisible();

    await settingsViews.getByRole("button", { name: /^Settings$/ }).click({ force: true });
    await expect(
      page.getByRole("heading", { name: "Notification preferences" }),
    ).toBeVisible();

    await settingsViews.getByRole("button", { name: /^Shortcuts$/ }).click({ force: true });
    await expect(
      page
        .getByRole("region", { name: "Shortcuts" })
        .getByRole("heading", { name: "Shortcuts" }),
    ).toBeVisible();

    await settingsViews.getByRole("button", { name: /^Settings$/ }).click({ force: true });
    await expect(
      page.getByRole("heading", { name: "Notification preferences" }),
    ).toBeVisible();

    await settingsViews.getByRole("button", { name: /^Rate limits$/ }).click({ force: true });
    await expect(
      page.getByRole("heading", { name: "Rate-limit dashboard" }),
    ).toBeVisible();
  });

  test("Settings section renders, toggles persist, dirty state", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Notification preferences" }),
    ).toBeVisible();

    const salesRow = page.locator("tr", { hasText: "Sales" }).first();
    await expect(salesRow).toBeVisible();

    const inAppToggle = salesRow.locator('input[type="checkbox"]').first();
    const digestToggle = salesRow.locator('input[type="checkbox"]').nth(1);

    await inAppToggle.click();
    await digestToggle.click();
    await expect(inAppToggle).not.toBeChecked();
    await expect(digestToggle).not.toBeChecked();

    const save = page.getByRole("button", { name: "Save preferences" });
    await expect(save).toBeEnabled();
    await save.click();

    await expect(page.getByText(/Saved at/)).toBeVisible({ timeout: 5000 });
    await expect(save).toBeDisabled();

    await page.reload();
    await page.getByRole("button", { name: "Settings" }).click();
    const salesRow2 = page.locator("tr", { hasText: "Sales" }).first();
    const inAppAfter = salesRow2.locator('input[type="checkbox"]').first();
    const digestAfter = salesRow2.locator('input[type="checkbox"]').nth(1);
    await expect(inAppAfter).not.toBeChecked();
    await expect(digestAfter).not.toBeChecked();

    await inAppAfter.click();
    await digestAfter.click();
    await page.getByRole("button", { name: "Save preferences" }).click();
    await expect(page.getByText(/Saved at/)).toBeVisible({ timeout: 5000 });
  });

  test("Mute all + Enable all bulk actions", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Notification preferences" }),
    ).toBeVisible();
    await expect(
      page.locator('table tbody tr td:nth-child(2) input[type="checkbox"]').first(),
    ).toBeVisible();

    const inAppBoxes = page.locator(
      'table tbody tr td:nth-child(2) input[type="checkbox"]',
    );
    const count = await inAppBoxes.count();
    expect(count).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Mute all" }).click();
    await expect(inAppBoxes.first()).not.toBeChecked({ timeout: 5000 });
    for (let i = 0; i < count; i += 1) {
      await expect(inAppBoxes.nth(i)).not.toBeChecked();
    }

    await page.getByRole("button", { name: "Enable all" }).click();
    await expect(inAppBoxes.first()).toBeChecked({ timeout: 5000 });
    for (let i = 0; i < count; i += 1) {
      await expect(inAppBoxes.nth(i)).toBeChecked();
    }
  });
});
