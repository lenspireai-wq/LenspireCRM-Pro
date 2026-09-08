import { test, expect } from '@playwright/test';

test.describe('Lead Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(app|dashboard)?/);
  });

  test('should navigate to leads section', async ({ page }) => {
    // Find and click Sales or Leads navigation
    const leadsNav = page.locator('nav a:has-text("Sales"), nav button:has-text("Sales"), nav a:has-text("Leads"), nav button:has-text("Leads")').first();
    await leadsNav.click();
    
    // Should see leads table or list
    await expect(page.locator('table, [role="table"], .leads-list, [data-testid*="lead"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should open new lead form', async ({ page }) => {
    // Navigate to leads section
    const leadsNav = page.locator('nav a:has-text("Sales"), nav button:has-text("Sales")').first();
    await leadsNav.click();
    await page.waitForTimeout(1000);
    
    // Find and click "New Lead" or "Add Lead" button
    const newLeadBtn = page.locator('button:has-text("New Lead"), button:has-text("Add Lead"), button:has-text("Create Lead")').first();
    await newLeadBtn.click({ timeout: 5000 });
    
    // Should see lead form
    await expect(page.locator('form, [role="dialog"], .modal').first()).toBeVisible();
    await expect(page.locator('input[name*="name"], input[placeholder*="Name"]').first()).toBeVisible();
  });

  test('should create a new lead', async ({ page }) => {
    // Navigate to leads
    const leadsNav = page.locator('nav a:has-text("Sales"), nav button:has-text("Sales")').first();
    await leadsNav.click();
    await page.waitForTimeout(1000);
    
    // Open new lead form
    const newLeadBtn = page.locator('button:has-text("New Lead"), button:has-text("Add Lead")').first();
    await newLeadBtn.click({ timeout: 5000 });
    
    // Fill form
    await page.fill('input[name*="name"], input[placeholder*="Name"]', 'E2E Test Lead');
    await page.fill('input[name*="mobile"], input[placeholder*="Mobile"]', '9999999999');
    
    // Select event type if dropdown exists
    const eventTypeField = page.locator('select[name*="event"], select[name*="type"]').first();
    if (await eventTypeField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await eventTypeField.selectOption({ label: 'Wedding' });
    }
    
    // Fill event date
    const dateInput = page.locator('input[name*="date"], input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dateInput.fill('2026-12-25');
    }
    
    // Submit form
    await page.click('button[type="submit"], button:has-text("Save"), button:has-text("Create")');
    
    // Should show success message or return to list
    await expect(
      page.locator('text=/saved|created|success/i, [role="alert"]:has-text("success")').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should search for a lead', async ({ page }) => {
    // Navigate to leads
    const leadsNav = page.locator('nav a:has-text("Sales"), nav button:has-text("Sales")').first();
    await leadsNav.click();
    await page.waitForTimeout(1000);
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('E2E Test Lead');
      await page.waitForTimeout(500);
      
      // Should filter results
      const results = page.locator('table tbody tr, [data-testid*="lead-row"]');
      await expect(results.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Navigate to leads
    const leadsNav = page.locator('nav a:has-text("Sales"), nav button:has-text("Sales")').first();
    await leadsNav.click();
    await page.waitForTimeout(1000);
    
    // Open new lead form
    const newLeadBtn = page.locator('button:has-text("New Lead"), button:has-text("Add Lead")').first();
    await newLeadBtn.click({ timeout: 5000 });
    
    // Try to submit empty form
    await page.click('button[type="submit"], button:has-text("Save"), button:has-text("Create")');
    
    // Should show validation errors
    const errorMessages = page.locator('[role="alert"], .error, .invalid-feedback, span[class*="error"]');
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
  });
});
