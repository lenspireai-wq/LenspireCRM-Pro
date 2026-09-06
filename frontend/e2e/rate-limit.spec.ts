import { test, expect } from "@playwright/test";

test.describe("Rate-limit dashboard", () => {
  test("admin sees stats, status mix, and clear-metrics flow", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Settings$/ }).click();
    const settingsViews = page.getByRole("navigation", { name: "Settings views" });
    const rateLimitButton = settingsViews.getByRole("button", { name: /^Rate limits$/ });
    await rateLimitButton.scrollIntoViewIfNeeded();
    await rateLimitButton.click({ force: true });
    await expect(
      page.getByRole("heading", { name: "Rate-limit dashboard" }),
    ).toBeVisible();

    const hourStat = page.locator(".rateLimitStat", { hasText: "Last hour" });
    await expect(hourStat).toBeVisible();
    await expect(page.locator(".rateLimitStat", { hasText: "Last 24h" })).toBeVisible();
    await expect(page.locator(".rateLimitStat", { hasText: "Status mix" })).toBeVisible();

    const bucketHeadings = page.locator(".rateLimitBucket h2");
    await expect(bucketHeadings.nth(0)).toBeVisible();
    await expect(bucketHeadings.nth(0)).toContainText("Top paths");
    await expect(bucketHeadings.nth(1)).toContainText("Top IPs");
    await expect(bucketHeadings.nth(2)).toContainText("Top users");
    await expect(bucketHeadings.nth(3)).toContainText("last hour");

    await page.getByRole("button", { name: /Show recent events/ }).click();
    await expect(
      page.locator(".auditTable thead th", { hasText: "Path" }),
    ).toBeVisible();
    await expect(
      page.locator(".auditTable tbody tr").first(),
    ).toBeVisible();

    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Clear metrics" }).click();
    await expect(page.getByText("Throttle metrics cleared.")).toBeVisible({
      timeout: 5000,
    });
  });
});
