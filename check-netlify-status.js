#!/usr/bin/env node

/**
 * Check Netlify Status and Get Cancellation Details
 */

const { execSync } = require('child_process');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚨 CHECKING NETLIFY BUILD CANCELLATION STATUS');
console.log('==============================================\n');

function getNetlifyData(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return null;
  }
}

// Check recent deploys with specific focus on cancelled ones
console.log('1. 📊 Checking recent deploy status...');
getNetlifyData('netlify api listSiteDeploys --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e","per_page":10}\'', 'Recent deploys');

// Get build settings that might cause cancellations
console.log('\n2. ⚙️ Checking build configuration...');
getNetlifyData('netlify api getSite --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e"}\'', 'Site configuration');

// Check for any build timeouts or limits
console.log('\n3. ⏱️ Checking build limits...');
getNetlifyData('netlify api getAccount', 'Account limits');

// Get the exact error from the most recent failed deploy
console.log('\n4. 🔍 Getting latest deploy details...');
getNetlifyData('netlify api listSiteDeploys --data=\'{"site_id":"1072fe4e-6f6c-4ed3-afd4-043a52c5b33e","per_page":1}\'', 'Latest deploy');

console.log('\n🎯 WHAT TO LOOK FOR:');
console.log('- Deploy state: "cancelled", "error", "timeout"');
console.log('- Error messages in deploy logs');
console.log('- Build time limits exceeded');
console.log('- Memory or resource constraints');
console.log('- Repository access issues');

console.log('\n📞 NEXT STEPS:');
console.log('1. Find the specific error message in the output above');
console.log('2. Look for patterns in cancelled deploys');
console.log('3. Check build duration vs time limits');
console.log('4. Report the exact error message for targeted fix');