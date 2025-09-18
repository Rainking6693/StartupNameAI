#!/usr/bin/env node

/**
 * Simple Netlify Fix Script
 * Uses execSync for more reliable command execution
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Set the Netlify token
process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚨 NETLIFY DEPLOYMENT FIX - SIMPLE VERSION');
console.log('===========================================\n');

function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(output);
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`);
    console.log(error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    console.log('');
    return false;
  }
}

console.log('1. 🔍 Checking Netlify authentication...');
const authSuccess = runCommand('netlify status', 'Authentication check');

if (!authSuccess) {
  console.log('❌ Authentication failed. Please check the token.');
  console.log('Token being used: nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27');
  process.exit(1);
}

console.log('2. 📋 Getting site information...');
runCommand('netlify sites:list', 'Site listing');

console.log('3. 📊 Getting recent deployments...');
runCommand('netlify deploy:list --limit=5', 'Recent deployments');

console.log('4. 🔍 Getting deployment logs...');
runCommand('netlify logs:deploy', 'Deployment logs');

console.log('5. 🔧 Checking environment variables...');
runCommand('netlify env:list', 'Environment variables');

console.log('6. 🏗️ Testing local build...');
console.log('   Installing dependencies...');
const installSuccess = runCommand('cd client && npm install', 'Dependency installation');

if (installSuccess) {
  console.log('   Building application...');
  const buildSuccess = runCommand('cd client && npm run build', 'Application build');
  
  if (buildSuccess) {
    console.log('7. 🚀 Attempting manual deployment...');
    runCommand('netlify deploy --dir=client/build --prod', 'Manual deployment');
  } else {
    console.log('❌ Build failed, cannot attempt deployment');
  }
} else {
  console.log('❌ Dependency installation failed, cannot proceed with build');
}

console.log('✅ NETLIFY FIX SCRIPT COMPLETED!');
console.log('\n📊 SUMMARY:');
console.log('- Check the output above for any specific error messages');
console.log('- If authentication worked, the token is valid');
console.log('- If builds failed, check the error messages for specific issues');
console.log('- If deployment succeeded, your site should be updated');

console.log('\n💡 NEXT STEPS:');
console.log('1. If you see "Deploy is live" message, the fix worked!');
console.log('2. If there are errors, note the specific error messages');
console.log('3. Check your Netlify dashboard for the deployment status');
console.log('4. Clear cache in Netlify dashboard if builds are still failing');