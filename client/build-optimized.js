#!/usr/bin/env node

/**
 * Cross-platform optimized build script
 * Sets environment variables and runs React build
 */

const { execSync } = require('child_process');

// Set environment variables for optimized build
process.env.GENERATE_SOURCEMAP = 'false';
process.env.INLINE_RUNTIME_CHUNK = 'false';
process.env.NODE_ENV = 'production';

console.log('🚀 Starting optimized React build...');
console.log('📊 Build settings:');
console.log('   - Source maps: DISABLED (faster build)');
console.log('   - Inline runtime: DISABLED (smaller bundle)');
console.log('   - Environment: PRODUCTION');

try {
  // Run the React build with optimized settings
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      GENERATE_SOURCEMAP: 'false',
      INLINE_RUNTIME_CHUNK: 'false',
      NODE_ENV: 'production'
    }
  });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build output available in: client/build/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}