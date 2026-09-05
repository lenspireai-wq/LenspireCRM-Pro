import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("admin reaches the workspace shell with a stored session", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Open Administration/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Open Administration/ }).click();
    await expect(page.getByRole("button", { name: /^Audit$/i })).toBeVisible();
  });

  test("sign-out returns to the login screen", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();

    await page.getByRole("button", { name: /Sign out/i }).click();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("wrong password is rejected with an error message", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Sign out/i }).click();

    await expect(page.locator('input[name="username"]')).toBeVisible();
    await page.locator('input[name="username"]').fill("admin");
    await page.locator('input[name="password"]').fill("definitely-wrong");
    await page.getByRole("button", { name: /Sign in/i }).click();

    await expect(page.locator(".error")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).not.toBeVisible();
  });
});
