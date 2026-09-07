import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/');
    
    // Check for login form elements
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[name="username"]', 'invalid');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.error, [role="alert"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Use credentials from test setup
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button.loginSubmit');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/(app|dashboard)?/, { timeout: 10000 });
    
    // Should see user profile or navigation
    await expect(page.locator('nav, aside, [role="navigation"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button.loginSubmit');
    await page.waitForURL(/\/(app|dashboard)?/);
    
    // Find and click logout button
    const logoutButton = page.locator('button[aria-label*="ign"], button:has-text("Logout"), button:has-text("Sign out")').first();
    await logoutButton.click();
    
    // Should return to login page
    await expect(page.locator('input[name="username"]')).toBeVisible({ timeout: 5000 });
  });

  test('should persist session on page reload', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button.loginSubmit');
    await page.waitForURL(/\/(app|dashboard)?/);
    
    // Reload page
    await page.reload();
    
    // Should still be authenticated
    await expect(page.locator('nav, aside, [role="navigation"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).not.toBeVisible();
  });
});
