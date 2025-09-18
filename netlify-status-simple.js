#!/usr/bin/env node

/**
 * Simple Netlify Status Check - Windows Compatible
 */

const { execSync } = require('child_process');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚨 NETLIFY STATUS CHECK - WINDOWS COMPATIBLE');
console.log('============================================\n');

function runCommand(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(result);
    console.log(`✅ ${description} completed\n`);
    return result;
  } catch (error) {
    console.log(`❌ ${description} failed:`);
    console.log('Error:', error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    console.log('');
    return null;
  }
}

// Use simpler commands that work on Windows
console.log('1. 📊 Getting site status...');
runCommand('netlify status', 'Site status');

console.log('2. 📋 Getting recent deploys (simple)...');
runCommand('netlify deploy:list', 'Recent deploys');

console.log('3. 🔍 Getting deploy logs...');
runCommand('netlify logs:deploy', 'Deploy logs');

console.log('4. 🔧 Getting environment variables...');
runCommand('netlify env:list', 'Environment variables');

console.log('5. 🏗️ Getting build info...');
runCommand('netlify build --dry', 'Build info (dry run)');

console.log('6. 📊 Getting site info...');
runCommand('netlify open:admin --json', 'Site admin info');

console.log('\n🎯 ANALYSIS:');
console.log('Look through the output above for:');
console.log('- Any "cancelled" or "failed" deploys');
console.log('- Error messages in deploy logs');
console.log('- Build command issues');
console.log('- Environment variable problems');

console.log('\n💡 COMMON ISSUES TO LOOK FOR:');
console.log('- "Build exceeded maximum allowed runtime"');
console.log('- "Command failed with exit code"');
console.log('- "Out of memory"');
console.log('- "Repository access denied"');
console.log('- Build timeouts or cancellations');

console.log('\n📞 NEXT STEPS:');
console.log('1. Look for specific error patterns in the output');
console.log('2. Note any cancelled or failed deploy states');
console.log('3. Check build duration and timeout issues');
console.log('4. Report the exact error message found');