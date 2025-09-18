#!/usr/bin/env node

/**
 * Manual Deploy Test - Bypass Automatic Cancellations
 */

const { execSync } = require('child_process');
const fs = require('fs');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚀 MANUAL DEPLOY TEST - BYPASS CANCELLATIONS');
console.log('=============================================\n');

function step(description, command) {
  console.log(`🔧 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit',
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(`✅ ${description} - SUCCESS!\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED: ${error.message}\n`);
    return false;
  }
}

// Step 1: Check current status
console.log('STEP 1: Checking current Netlify status');
step('Getting site status', 'netlify status');

// Step 2: Build locally first
console.log('STEP 2: Building locally to avoid build timeouts');
console.log('Changing to client directory...');
process.chdir('client');

// Clean any previous build
if (fs.existsSync('build')) {
  console.log('Removing previous build...');
  fs.rmSync('build', { recursive: true, force: true });
}

// Install dependencies
const installSuccess = step('Installing dependencies', 'npm install');

if (installSuccess) {
  // Build the application
  const buildSuccess = step('Building application', 'npm run build:original');
  
  if (buildSuccess && fs.existsSync('build/index.html')) {
    console.log('✅ Local build successful! Found build/index.html');
    
    // Go back to root directory
    process.chdir('..');
    
    // Step 3: Manual deployment
    console.log('STEP 3: Manual deployment to bypass automatic build');
    const deploySuccess = step('Deploying to production', 'netlify deploy --dir=client/build --prod --message="Manual deploy to fix cancellation issue"');
    
    if (deploySuccess) {
      console.log('🎉 DEPLOYMENT SUCCESSFUL!');
      console.log('✅ Your site should now be live at: https://startupnamer.org');
      console.log('✅ Check the site to verify it\'s working correctly');
      
      // Verify deployment
      step('Verifying deployment', 'netlify status');
      
    } else {
      console.log('❌ Manual deployment failed');
      console.log('This suggests the issue might be with:');
      console.log('- Account permissions or limits');
      console.log('- Site configuration');
      console.log('- Netlify service issues');
    }
    
  } else {
    console.log('❌ Local build failed or build output missing');
    console.log('Build issues need to be resolved first');
    process.chdir('..');
  }
  
} else {
  console.log('❌ Dependency installation failed');
  process.chdir('..');
}

console.log('\n📊 MANUAL DEPLOY TEST COMPLETE');
console.log('===============================');
console.log('');
console.log('🔍 RESULTS ANALYSIS:');
console.log('- If manual deploy succeeded: The issue is with automatic builds');
console.log('- If manual deploy failed: The issue is with site configuration or permissions');
console.log('- If local build failed: The issue is with the build process itself');
console.log('');
console.log('💡 NEXT STEPS:');
console.log('1. Check if https://startupnamer.org is now working');
console.log('2. If successful, we can focus on fixing the automatic build process');
console.log('3. If failed, we need to investigate site configuration issues');