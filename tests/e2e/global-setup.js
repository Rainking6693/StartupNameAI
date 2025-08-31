// Global setup for E2E tests
const { chromium } = require('@playwright/test');

async function globalSetup() {
  console.log('🎭 Setting up E2E test environment...');
  
  // Perform any global setup tasks here
  // For example, seed test data, start additional services, etc.
  
  // Warm up the browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Pre-warm the application
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application warmed up successfully');
  } catch (error) {
    console.error('❌ Failed to warm up application:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ E2E test environment setup complete');
}

module.exports = globalSetup;