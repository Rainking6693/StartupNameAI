// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:5000'
      }
    },
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['api-tests']
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['api-tests']
    },
    {
      name: 'e2e-webkit',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['api-tests']
    },
    {
      name: 'mobile-chrome',
      testDir: './tests/mobile',
      use: { ...devices['Pixel 5'] },
      dependencies: ['api-tests']
    },
    {
      name: 'mobile-safari',
      testDir: './tests/mobile',
      use: { ...devices['iPhone 12'] },
      dependencies: ['api-tests']
    }
  ],
  webServer: [
    {
      command: 'cd server && npm run dev',
      port: 5000,
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'npm run dev:client',
      port: 3000,
      reuseExistingServer: !process.env.CI
    }
  ]
});
