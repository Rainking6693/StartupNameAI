// Jest global teardown
module.exports = async () => {
  console.log('🧹 Cleaning up Jest test environment...');
  
  // Restore original console methods
  // (Any cleanup would go here)
  
  console.log('✅ Jest test environment cleanup complete');
};