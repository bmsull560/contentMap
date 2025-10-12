import { defineConfig, devices } from '@playwright/test';

const DEFAULT_PORT = Number(process.env.PLAYWRIGHT_PORT ?? '5173');
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${DEFAULT_PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${DEFAULT_PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
