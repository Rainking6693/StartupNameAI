// Global teardown for E2E tests
async function globalTeardown() {
  console.log('🧹 Cleaning up E2E test environment...');
  
  // Perform any global cleanup tasks here
  // For example, cleanup test data, stop services, etc.
  
  console.log('✅ E2E test environment cleanup complete');
}

module.exports = globalTeardown;