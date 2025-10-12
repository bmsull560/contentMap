import { test, expect } from '@playwright/test';

// Basic sanity test for the Vite React app
// BASE_URL can be overridden via PLAYWRIGHT_BASE_URL to match the dev server port

test('homepage loads and displays expected content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Content Mapping Audit/i);
  // await expect(page.getByText('Welcome')).toBeVisible();
});

test('component showcase loads with query parameter', async ({ page }) => {
  await page.goto('/?showcase');
  await expect(page.getByRole('heading', { name: 'Component Showcase', level: 1 })).toBeVisible();
  await expect(page.getByText(/Interactive gallery of the core ContentMap components/i)).toBeVisible();
});

test('component showcase displays all major components', async ({ page }) => {
  await page.goto('/?showcase');
  
  // Check for major component sections
  await expect(page.getByRole('heading', { name: 'Audit Request Form', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Audit Processor', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Audit Report', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Content Audit Dashboard', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Content Library', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Content Recommendations', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'FAQ', level: 2 })).toBeVisible();
});

test('component showcase works with /showcase path', async ({ page }) => {
  await page.goto('/showcase');
  await expect(page.getByRole('heading', { name: 'Component Showcase', level: 1 })).toBeVisible();
});
