import { test, expect } from "@playwright/test";

test.describe("Audit workspace", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /^Main Dashboard$/i })).toBeVisible();
  });

  const openAudit = async (page: import("@playwright/test").Page) => {
    await page.getByRole("button", { name: /Admin Console/i }).click();
    await page.getByRole("button", { name: /^Audit$/i }).click();
  };

  test("admin sees the Admin Console tabs and can open Audit", async ({ page }) => {
    const adminConsole = page.getByRole("button", { name: /Admin Console/i });
    await expect(adminConsole).toBeVisible();
    await adminConsole.click();
    const auditButton = page.getByRole("button", { name: /^Audit$/i });
    await expect(auditButton).toBeVisible();
    await auditButton.click();

    await expect(page.getByRole("heading", { name: "Audit Log" })).toBeVisible();
    await expect(page.locator(".auditSummary")).toBeVisible();
  });

  test("audit workspace renders filter controls and seed data", async ({ page }) => {
    await openAudit(page);
    await expect(page.getByRole("heading", { name: "Audit Log" })).toBeVisible();

    await expect(page.getByRole("combobox", { name: "Source" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Actor" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Action" })).toBeVisible();

    await expect(page.locator(".auditTable tbody tr").first()).toBeVisible();
    const rowCount = await page.locator(".auditTable tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("source filter narrows the table to a single source", async ({ page }) => {
    await openAudit(page);
    await expect(page.getByRole("heading", { name: "Audit Log" })).toBeVisible();
    await expect(page.locator(".auditTable tbody tr").first()).toBeVisible();

    const before = await page.locator(".auditTable tbody tr").count();
    expect(before).toBeGreaterThan(0);

    await page.getByRole("combobox", { name: "Source" }).selectOption("user");
    await expect(page.locator(".auditSource").first()).toBeVisible();
    const after = await page.locator(".auditTable tbody tr").count();
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThanOrEqual(before);

    const sourceCells = await page.locator(".auditSource").allTextContents();
    expect(sourceCells.length).toBeGreaterThan(0);
    for (const value of sourceCells) {
      expect(value.trim().toLowerCase()).toBe("user");
    }
  });

  test("search filter narrows the table by free text", async ({ page }) => {
    await openAudit(page);
    await expect(page.getByRole("heading", { name: "Audit Log" })).toBeVisible();
    await expect(page.locator(".auditTable tbody tr").first()).toBeVisible();

    await page.getByRole("searchbox", { name: "Search", exact: true }).fill("audit_test");
    await expect(page.locator(".auditTable tbody tr").first()).toBeVisible();
    const after = await page.locator(".auditTable tbody tr").count();
    expect(after).toBeGreaterThan(0);

    const rows = await page.locator(".auditTable tbody tr").all();
    for (const row of rows) {
      const text = (await row.textContent())?.toLowerCase() ?? "";
      expect(text).toContain("audit_test");
    }
  });
});
