#!/usr/bin/env node

/**
 * Deep Netlify Diagnostic Script
 * This will get ALL the information we need to fix the cancellation issue
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Set the Netlify token
process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🔍 DEEP NETLIFY DIAGNOSTIC - FINDING THE EXACT ISSUE');
console.log('====================================================\n');

function runCommand(command, description, showOutput = true) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    if (showOutput) {
      console.log(output);
    }
    console.log(`✅ ${description} completed\n`);
    return output;
  } catch (error) {
    console.log(`❌ ${description} failed:`);
    console.log('Error:', error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    console.log('');
    return null;
  }
}

// 1. Get detailed site information
console.log('1. 📊 Getting detailed site information...');
const siteInfo = runCommand('netlify api getSite --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\'', 'Site details');

// 2. Get recent deploys with full details
console.log('2. 📋 Getting recent deploys...');
const deploys = runCommand('netlify api listSiteDeploys --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\'', 'Recent deploys');

// 3. Get build settings
console.log('3. ⚙️ Getting build settings...');
runCommand('netlify api getSite --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\' | jq .build_settings', 'Build settings');

// 4. Get environment variables
console.log('4. 🔧 Getting environment variables...');
runCommand('netlify env:list --json', 'Environment variables');

// 5. Get build hooks
console.log('5. 🪝 Getting build hooks...');
runCommand('netlify api listHooksBySiteId --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\'', 'Build hooks');

// 6. Check for any active builds
console.log('6. 🏗️ Checking for active builds...');
runCommand('netlify api listSiteBuilds --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\'', 'Active builds');

// 7. Get the most recent deploy log
console.log('7. 📝 Getting most recent deploy log...');
runCommand('netlify logs:deploy --json', 'Deploy logs');

// 8. Check site build status
console.log('8. 🔍 Checking current build status...');
runCommand('netlify open:admin', 'Opening admin (check manually)', false);

// 9. Test a manual build trigger
console.log('9. 🚀 Testing manual build trigger...');
runCommand('netlify build', 'Manual build test');

// 10. Get detailed error information
console.log('10. ❌ Getting error details...');
runCommand('netlify api listSiteDeploys --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e","state":"error"}\'', 'Error deploys');

console.log('🎯 DIAGNOSTIC COMPLETE!');
console.log('\n📊 ANALYSIS NEEDED:');
console.log('Look through the output above for:');
console.log('1. Any "cancelled" or "error" states in deploys');
console.log('2. Build timeout settings');
console.log('3. Memory or resource limits');
console.log('4. Environment variable conflicts');
console.log('5. Build command issues');

console.log('\n🔍 COMMON CANCELLATION PATTERNS:');
console.log('- "Build exceeded maximum allowed runtime"');
console.log('- "Out of memory" or memory limit errors');
console.log('- "Command failed with exit code"');
console.log('- "Repository access denied"');
console.log('- "Build cancelled by user" (automatic cancellation)');

console.log('\n💡 IMMEDIATE ACTIONS:');
console.log('1. Check the Netlify dashboard for the exact cancellation reason');
console.log('2. Look for patterns in the deploy history above');
console.log('3. Check if builds are timing out or hitting resource limits');
console.log('4. Verify the build command and environment variables');

console.log('\n🆘 IF YOU FIND THE ISSUE:');
console.log('Report back with the specific error message or pattern you see!');