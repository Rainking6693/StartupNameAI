#!/usr/bin/env node

/**
 * Get Deployment Information - Direct Approach
 */

const { execSync } = require('child_process');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🔍 GETTING DEPLOYMENT INFORMATION');
console.log('=================================\n');

function safeCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return null;
  }
}

// Get basic site information
console.log('1. 🏠 Site Information:');
safeCommand('netlify status', 'Current site status');

console.log('\n2. 📋 Recent Deployments:');
safeCommand('netlify deploy:list', 'Recent deployment list');

console.log('\n3. 📝 Latest Deploy Logs:');
safeCommand('netlify logs:deploy', 'Latest deployment logs');

console.log('\n4. ⚙️ Build Settings:');
safeCommand('netlify build --dry-run', 'Build configuration check');

console.log('\n5. 🔧 Environment Check:');
safeCommand('netlify env:list', 'Environment variables');

// Try to get more specific information
console.log('\n6. 🚀 Manual Build Test:');
console.log('Testing if we can trigger a build manually...');
safeCommand('netlify build --context production', 'Manual build test');

console.log('\n📊 SUMMARY:');
console.log('==========');
console.log('Look through the output above for:');
console.log('');
console.log('🔍 DEPLOYMENT STATUS:');
console.log('- Look for "cancelled", "failed", or "error" states');
console.log('- Check deployment timestamps and duration');
console.log('- Note any timeout or memory issues');
console.log('');
console.log('🔍 BUILD ISSUES:');
console.log('- Command failures or exit codes');
console.log('- Dependency installation problems');
console.log('- Build script errors');
console.log('');
console.log('🔍 CONFIGURATION ISSUES:');
console.log('- Environment variable problems');
console.log('- Build command or publish directory issues');
console.log('- Node.js version conflicts');

console.log('\n🎯 WHAT TO REPORT:');
console.log('If you see any specific error messages, cancellation reasons,');
console.log('or patterns in the failed deployments, share those details');
console.log('so we can create a targeted fix!');