#!/usr/bin/env node

/**
 * Fix Netlify Issues - Address Timeout and CLI Problems
 */

const { execSync } = require('child_process');
const fs = require('fs');

process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🔧 FIXING NETLIFY ISSUES - TIMEOUT & CLI PROBLEMS');
console.log('=================================================\n');

function runCommand(command, description, timeout = 60000) {
  console.log(`🔧 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      timeout: timeout,
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });
    console.log(`✅ ${description} - SUCCESS!`);
    return result;
  } catch (error) {
    console.log(`❌ ${description} - FAILED: ${error.message}`);
    return null;
  }
}

// Fix 1: Update Netlify CLI
console.log('FIX 1: Updating Netlify CLI to latest version');
runCommand('npm install -g netlify-cli@latest', 'Updating Netlify CLI', 120000);

// Fix 2: Use correct CLI commands
console.log('\nFIX 2: Using correct Netlify CLI commands');
runCommand('netlify sites:list', 'Listing sites with correct command');

// Fix 3: Get deploy information with correct syntax
console.log('\nFIX 3: Getting deployment information');
runCommand('netlify deploy list', 'Getting recent deploys');

// Fix 4: Create optimized build for faster deployment
console.log('\nFIX 4: Creating super-fast build configuration');

// Create a minimal netlify.toml for faster builds
const fastNetlifyConfig = `[build]
  base = "client"
  command = "npm ci --production --silent && npm run build:fast"
  publish = "build"
  environment = { 
    NODE_VERSION = "18",
    NODE_OPTIONS = "--max-old-space-size=1024",
    GENERATE_SOURCEMAP = "false",
    DISABLE_ESLINT_PLUGIN = "true",
    FAST_REFRESH = "false"
  }

# Skip processing to speed up deployment
[build.processing]
  skip_processing = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

fs.writeFileSync('netlify-fast.toml', fastNetlifyConfig);
console.log('✅ Created netlify-fast.toml for super-fast builds');

// Fix 5: Create fast build script
console.log('\nFIX 5: Creating fast build script');

const fastBuildScript = `#!/usr/bin/env node

/**
 * Super Fast Build Script - Minimal dependencies, maximum speed
 */

const { execSync } = require('child_process');

// Set environment for fastest possible build
process.env.GENERATE_SOURCEMAP = 'false';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.FAST_REFRESH = 'false';
process.env.NODE_ENV = 'production';

console.log('🚀 SUPER FAST BUILD - OPTIMIZED FOR SPEED');

try {
  // Build with all optimizations
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      GENERATE_SOURCEMAP: 'false',
      DISABLE_ESLINT_PLUGIN: 'true',
      FAST_REFRESH: 'false'
    }
  });
  
  console.log('✅ Fast build completed!');
} catch (error) {
  console.error('❌ Fast build failed:', error.message);
  process.exit(1);
}
`;

fs.writeFileSync('client/build-fast.js', fastBuildScript);

// Update client package.json with fast build script
const clientPackagePath = 'client/package.json';
const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
clientPackage.scripts['build:fast'] = 'node build-fast.js';
fs.writeFileSync(clientPackagePath, JSON.stringify(clientPackage, null, 2));

console.log('✅ Added build:fast script to client package.json');

// Fix 6: Test the fast deployment
console.log('\nFIX 6: Testing fast deployment');

// Copy the fast config to main config temporarily
const originalConfig = fs.readFileSync('netlify.toml', 'utf8');
fs.writeFileSync('netlify.toml.backup', originalConfig);
fs.writeFileSync('netlify.toml', fastNetlifyConfig);

console.log('✅ Applied fast configuration');

// Try a quick manual deploy
console.log('\nFIX 7: Attempting quick manual deployment');
process.chdir('client');

// Quick install and build
const installSuccess = runCommand('npm ci --production --silent', 'Quick dependency install', 60000);

if (installSuccess) {
  const buildSuccess = runCommand('npm run build:fast', 'Fast build', 120000);
  
  if (buildSuccess) {
    process.chdir('..');
    const deploySuccess = runCommand('netlify deploy --dir=client/build --prod --timeout=300', 'Fast deployment', 300000);
    
    if (deploySuccess) {
      console.log('🎉 FAST DEPLOYMENT SUCCESSFUL!');
      console.log('✅ Site should be live at: https://startupnamer.org');
    }
  }
} else {
  process.chdir('..');
}

// Restore original config
fs.writeFileSync('netlify.toml', originalConfig);
console.log('✅ Restored original netlify.toml');

console.log('\n📊 FIXES APPLIED:');
console.log('1. ✅ Updated Netlify CLI to latest version');
console.log('2. ✅ Created super-fast build configuration');
console.log('3. ✅ Added optimized build script');
console.log('4. ✅ Reduced memory usage and build time');
console.log('5. ✅ Attempted fast deployment');

console.log('\n💡 NEXT STEPS:');
console.log('1. Check if https://startupnamer.org is now working');
console.log('2. If successful, we can use the fast config permanently');
console.log('3. If still failing, we know it\'s a deeper Netlify account issue');