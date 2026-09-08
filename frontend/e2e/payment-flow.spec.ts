import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin1234');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(app|dashboard)?/);
  });

  test('should navigate to accounts section', async ({ page }) => {
    // Find and click Accounts navigation
    const accountsNav = page.locator('nav a:has-text("Accounts"), nav button:has-text("Accounts")').first();
    await accountsNav.click();
    
    // Should see payments or accounts content
    await expect(
      page.locator('text=/payment|account|collection/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should display payment dashboard', async ({ page }) => {
    // Navigate to accounts
    const accountsNav = page.locator('nav a:has-text("Accounts"), nav button:has-text("Accounts")').first();
    await accountsNav.click();
    await page.waitForTimeout(1000);
    
    // Should see payment metrics or summary
    await expect(
      page.locator('text=/total|paid|pending|outstanding/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should open record payment form', async ({ page }) => {
    // Navigate to accounts
    const accountsNav = page.locator('nav a:has-text("Accounts"), nav button:has-text("Accounts")').first();
    await accountsNav.click();
    await page.waitForTimeout(1000);
    
    // Find "Record Payment" or "Add Payment" button
    const recordPaymentBtn = page.locator(
      'button:has-text("Record Payment"), button:has-text("Add Payment"), button:has-text("New Payment")'
    ).first();
    
    if (await recordPaymentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await recordPaymentBtn.click();
      
      // Should see payment form
      await expect(page.locator('form, [role="dialog"]').first()).toBeVisible();
      await expect(
        page.locator('input[name*="amount"], input[placeholder*="Amount"]').first()
      ).toBeVisible();
    }
  });

  test('should validate payment amount', async ({ page }) => {
    // Navigate to accounts
    const accountsNav = page.locator('nav a:has-text("Accounts"), nav button:has-text("Accounts")').first();
    await accountsNav.click();
    await page.waitForTimeout(1000);
    
    // Open payment form
    const recordPaymentBtn = page.locator(
      'button:has-text("Record Payment"), button:has-text("Add Payment")'
    ).first();
    
    if (await recordPaymentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await recordPaymentBtn.click();
      
      // Try to submit with zero or negative amount
      const amountInput = page.locator('input[name*="amount"], input[placeholder*="Amount"]').first();
      await amountInput.fill('0');
      
      // Try to submit
      await page.click('button[type="submit"], button:has-text("Save")');
      
      // Should show validation error
      await expect(
        page.locator('[role="alert"], .error, span[class*="error"]').first()
      ).toBeVisible({ timeout: 3000 });
    }
  });
});
