#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('🔍 Running lint-staged...');
  execSync('npx lint-staged', { stdio: 'inherit' });
  console.log('✅ Pre-commit checks passed!');
} catch (error) {
  console.error('❌ Pre-commit checks failed!');
  process.exit(1);
}