import { test, expect } from '@playwright/test';

// Basic sanity test for the Vite React app
// BASE_URL can be overridden via PLAYWRIGHT_BASE_URL to match the dev server port

test('homepage loads and displays expected content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Content Mapping Audit/i);
  // await expect(page.getByText('Welcome')).toBeVisible();
});
