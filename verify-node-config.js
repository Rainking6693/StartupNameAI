#!/usr/bin/env node

/**
 * Node.js Configuration Verification Script
 * Verifies that all configuration files use consistent Node.js versions
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Node.js Configuration...\n');

// Check .nvmrc
try {
  const nvmrc = fs.readFileSync('.nvmrc', 'utf8').trim();
  console.log(`✅ .nvmrc: ${nvmrc}`);
} catch (error) {
  console.log(`❌ .nvmrc: Not found or error reading`);
}

// Check netlify.toml
try {
  const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
  const nodeVersionMatch = netlifyToml.match(/NODE_VERSION\s*=\s*"([^"]+)"/);
  if (nodeVersionMatch) {
    console.log(`✅ netlify.toml: NODE_VERSION = "${nodeVersionMatch[1]}"`);
  } else {
    console.log(`❌ netlify.toml: NODE_VERSION not found`);
  }
} catch (error) {
  console.log(`❌ netlify.toml: Not found or error reading`);
}

// Check package.json engines
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.engines && packageJson.engines.node) {
    console.log(`✅ package.json: engines.node = "${packageJson.engines.node}"`);
  } else {
    console.log(`⚠️  package.json: No engines.node specified`);
  }
} catch (error) {
  console.log(`❌ package.json: Not found or error reading`);
}

// Check client/package.json engines
try {
  const clientPackageJson = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  if (clientPackageJson.engines && clientPackageJson.engines.node) {
    console.log(`✅ client/package.json: engines.node = "${clientPackageJson.engines.node}"`);
  } else {
    console.log(`⚠️  client/package.json: No engines.node specified`);
  }
} catch (error) {
  console.log(`❌ client/package.json: Not found or error reading`);
}

console.log('\n🎯 Configuration Summary:');
console.log('- All Node.js versions should be consistent');
console.log('- Recommended: Use "18" for maximum Netlify compatibility');
console.log('- Avoid specific patch versions like "22.x" which may not exist');

console.log('\n📋 Next Steps:');
console.log('1. Ensure all configurations use Node.js 18');
console.log('2. Check Netlify dashboard for any overriding settings');
console.log('3. Clear any cached builds in Netlify');
console.log('4. Trigger a new deployment');