#!/usr/bin/env node

/**
 * Force Netlify Deploy - Bypass Cancellation Issues
 * This script will try multiple approaches to get a successful deploy
 */

const { execSync } = require('child_process');
const fs = require('fs');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚀 FORCE NETLIFY DEPLOY - BYPASS CANCELLATION');
console.log('==============================================\n');

function tryCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit',
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(`✅ ${description} SUCCESS!`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    return false;
  }
}

// Strategy 1: Manual deploy with pre-built files
console.log('🎯 STRATEGY 1: Manual Deploy with Pre-built Files');
console.log('================================================\n');

console.log('Step 1: Building locally...');
process.chdir('client');

// Clean build
if (fs.existsSync('build')) {
  console.log('Cleaning previous build...');
  fs.rmSync('build', { recursive: true, force: true });
}

// Install dependencies
tryCommand('npm ci --only=production', 'Installing production dependencies');

// Build with minimal settings
console.log('Building with minimal configuration...');
const buildSuccess = tryCommand('npm run build:original', 'Building application');

if (buildSuccess && fs.existsSync('build/index.html')) {
  console.log('✅ Local build successful!');
  
  // Go back to root
  process.chdir('..');
  
  // Try manual deploy
  console.log('\nStep 2: Manual deployment...');
  const deploySuccess = tryCommand('netlify deploy --dir=client/build --prod --message="Manual deploy to bypass cancellation"', 'Manual deployment');
  
  if (deploySuccess) {
    console.log('🎉 MANUAL DEPLOY SUCCESSFUL!');
    console.log('Your site should now be live at https://startupnamer.org');
    process.exit(0);
  }
} else {
  console.log('❌ Local build failed');
  process.chdir('..');
}

// Strategy 2: Deploy with different build command
console.log('\n🎯 STRATEGY 2: Deploy with Simplified Build');
console.log('==========================================\n');

// Update netlify.toml temporarily
const originalNetlify = fs.readFileSync('netlify.toml', 'utf8');
const simplifiedNetlify = `[build]
  base = "client"
  command = "npm install && npm run build:original"
  publish = "build"
  environment = { NODE_VERSION = "18" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

fs.writeFileSync('netlify.toml', simplifiedNetlify);
console.log('Updated netlify.toml with simplified configuration');

// Trigger deploy
const triggerSuccess = tryCommand('netlify deploy --prod --trigger', 'Triggering simplified deploy');

if (!triggerSuccess) {
  // Strategy 3: Use build hook
  console.log('\n🎯 STRATEGY 3: Using Build Hook');
  console.log('===============================\n');
  
  tryCommand('netlify api createHookBySiteId --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e","type":"github"}\'', 'Creating build hook');
}

// Restore original netlify.toml
fs.writeFileSync('netlify.toml', originalNetlify);
console.log('Restored original netlify.toml');

console.log('\n📊 DEPLOYMENT ATTEMPTS COMPLETED');
console.log('=================================\n');

console.log('🔍 CHECK RESULTS:');
console.log('1. Visit https://startupnamer.org to see if site is updated');
console.log('2. Check Netlify dashboard for deploy status');
console.log('3. Look for any new successful deploys');

console.log('\n💡 IF STILL FAILING:');
console.log('The issue might be:');
console.log('- Account limits or restrictions');
console.log('- Repository permissions');
console.log('- Netlify service issues');
console.log('- Build environment conflicts');

console.log('\n🆘 EMERGENCY CONTACT:');
console.log('If all strategies fail, contact Netlify support with:');
console.log('- Site ID: 1072fe4e-6f6c-4ed3-afd4-043a52c5b33e');
console.log('- Issue: Builds being cancelled automatically');
console.log('- Account: rainking6693@gmail.com');