#!/usr/bin/env node

/**
 * Netlify Deployment Debug Script
 * Helps diagnose deployment cancellation issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 NETLIFY DEPLOYMENT DIAGNOSTIC TOOL\n');

// Check if we're in the right directory
if (!fs.existsSync('netlify.toml')) {
  console.log('❌ Error: netlify.toml not found. Run this script from the project root.');
  process.exit(1);
}

console.log('📋 CONFIGURATION ANALYSIS\n');

// 1. Check netlify.toml configuration
console.log('1. 📄 Netlify Configuration (netlify.toml):');
try {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  // Extract key settings
  const baseMatch = netlifyConfig.match(/base\s*=\s*"([^"]+)"/);
  const commandMatch = netlifyConfig.match(/command\s*=\s*"([^"]+)"/);
  const publishMatch = netlifyConfig.match(/publish\s*=\s*"([^"]+)"/);
  const nodeVersionMatch = netlifyConfig.match(/NODE_VERSION\s*=\s*"([^"]+)"/);
  
  console.log(`   Base Directory: ${baseMatch ? baseMatch[1] : 'Not specified'}`);
  console.log(`   Build Command: ${commandMatch ? commandMatch[1] : 'Not specified'}`);
  console.log(`   Publish Directory: ${publishMatch ? publishMatch[1] : 'Not specified'}`);
  console.log(`   Node Version: ${nodeVersionMatch ? nodeVersionMatch[1] : 'Not specified'}`);
  
  // Check for potential issues
  if (commandMatch && commandMatch[1].includes('npm install')) {
    console.log('   ✅ Build command includes npm install');
  } else {
    console.log('   ⚠️  Build command might be missing npm install');
  }
  
} catch (error) {
  console.log('   ❌ Error reading netlify.toml');
}

console.log('\n2. 📦 Package Configuration:');

// Check client package.json
try {
  const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  console.log(`   Client Package Name: ${clientPackage.name}`);
  console.log(`   React Version: ${clientPackage.dependencies?.react || 'Not found'}`);
  console.log(`   React Scripts Version: ${clientPackage.dependencies?.['react-scripts'] || 'Not found'}`);
  
  // Check for build script
  if (clientPackage.scripts?.build) {
    console.log(`   Build Script: ${clientPackage.scripts.build}`);
  } else {
    console.log('   ❌ No build script found in client/package.json');
  }
  
  // Check engines
  if (clientPackage.engines?.node) {
    console.log(`   Node Engine Requirement: ${clientPackage.engines.node}`);
  } else {
    console.log('   ⚠️  No Node.js engine requirement specified');
  }
  
} catch (error) {
  console.log('   ❌ Error reading client/package.json');
}

console.log('\n3. 🏗️ Build Environment Check:');

// Check if build directory exists
if (fs.existsSync('client/build')) {
  console.log('   ✅ client/build directory exists');
  
  // Check build size
  try {
    const buildStats = fs.statSync('client/build');
    console.log('   📊 Build directory found (previous build exists)');
  } catch (error) {
    console.log('   ⚠️  Build directory access issue');
  }
} else {
  console.log('   ⚠️  client/build directory does not exist (no previous build)');
}

// Check node_modules
if (fs.existsSync('client/node_modules')) {
  console.log('   ✅ client/node_modules exists');
} else {
  console.log('   ⚠️  client/node_modules does not exist');
}

// Check package-lock.json
if (fs.existsSync('client/package-lock.json')) {
  console.log('   ✅ client/package-lock.json exists');
} else {
  console.log('   ⚠️  client/package-lock.json does not exist');
}

console.log('\n4. 🔧 Common Issues Check:');

// Check for common problematic patterns
const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');

// Check for memory issues
if (netlifyConfig.includes('max-old-space-size')) {
  console.log('   ✅ Memory optimization configured');
} else {
  console.log('   ⚠️  No memory optimization configured');
}

// Check for source map generation
const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
if (clientPackage.scripts?.build?.includes('GENERATE_SOURCEMAP=false')) {
  console.log('   ✅ Source map generation disabled (good for build speed)');
} else {
  console.log('   ⚠️  Source maps might be generated (can slow build)');
}

console.log('\n📊 DIAGNOSTIC SUMMARY\n');

console.log('🎯 RECOMMENDED ACTIONS:');
console.log('1. Check Netlify dashboard for exact error messages');
console.log('2. Look at deploy logs for cancellation timing');
console.log('3. Try manual deploy with: netlify deploy --dir=client/build --prod');
console.log('4. Clear Netlify cache if builds are timing out');
console.log('5. Check environment variables in Netlify dashboard');

console.log('\n🔍 NETLIFY CLI COMMANDS TO TRY:');
console.log('   netlify status                    # Check site status');
console.log('   netlify deploy:list              # List recent deploys');
console.log('   netlify logs:deploy              # Show deploy logs');
console.log('   netlify open                     # Open site in browser');

console.log('\n💡 COMMON FIXES:');
console.log('   • Clear cache and redeploy');
console.log('   • Update build command to use npm ci');
console.log('   • Add GENERATE_SOURCEMAP=false to build');
console.log('   • Increase memory limit with NODE_OPTIONS');
console.log('   • Check repository permissions');

console.log('\n🚨 IF DEPLOYS ARE STILL CANCELLED:');
console.log('   1. Check exact error message in Netlify dashboard');
console.log('   2. Note the timing of cancellation (immediate vs during build)');
console.log('   3. Try deploying a minimal test site');
console.log('   4. Contact Netlify support with site ID and logs');

console.log('\n✅ Configuration analysis complete!');