#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Husky pre-commit hook...');

try {
  // Check if we're in a git repository
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  console.log('✅ Git repository detected');
  
  // Reinstall Husky
  console.log('📦 Reinstalling Husky...');
  execSync('npm run prepare', { stdio: 'inherit' });
  
  // Ensure pre-commit hook has correct content
  const huskyDir = path.join(__dirname, '.husky');
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  
  const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`;
  
  fs.writeFileSync(preCommitPath, preCommitContent);
  console.log('✅ Pre-commit hook updated');
  
  // Make the file executable (on Unix systems)
  if (process.platform !== 'win32') {
    execSync(`chmod +x "${preCommitPath}"`);
    console.log('✅ Pre-commit hook made executable');
  }
  
  console.log('🎉 Husky fix completed! You should now be able to commit.');
  
} catch (error) {
  console.error('❌ Error fixing Husky:', error.message);
  
  // Provide manual fix instructions
  console.log('\n📋 Manual fix instructions:');
  console.log('1. Run: npm run prepare');
  console.log('2. If that fails, run: npx husky install');
  console.log('3. Then run: npx husky add .husky/pre-commit "npx lint-staged"');
  console.log('4. Try committing again');
  
  process.exit(1);
}