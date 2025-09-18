#!/usr/bin/env node

/**
 * Netlify Deployment Fix Script with API Token
 * Uses Netlify CLI to diagnose and fix deployment issues
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Netlify API Token
const NETLIFY_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚨 NETLIFY DEPLOYMENT FIX WITH API TOKEN');
console.log('==========================================\n');

// Set environment variable for Netlify CLI
process.env.NETLIFY_AUTH_TOKEN = NETLIFY_TOKEN;

function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return null;
  }
}

function runCommandWithOutput(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return null;
  }
}

async function fixNetlifyDeployments() {
  console.log('1. 📦 Checking Netlify CLI installation...');
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'pipe' });
    console.log('✅ Netlify CLI is installed');
  } catch (error) {
    console.log('📦 Installing Netlify CLI...');
    try {
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
      console.log('✅ Netlify CLI installed');
    } catch (installError) {
      console.log('❌ Failed to install Netlify CLI. Please install manually: npm install -g netlify-cli');
      return;
    }
  }

  console.log('\n2. 🔍 Checking Netlify authentication...');
  const statusOutput = runCommandWithOutput('netlify status', 'Checking Netlify status');
  
  if (!statusOutput || statusOutput.includes('Not logged in')) {
    console.log('❌ Authentication failed. Please check the token.');
    return;
  }

  console.log('\n3. 📋 Getting site information...');
  const sitesOutput = runCommandWithOutput('netlify sites:list', 'Listing sites');

  console.log('\n4. 📊 Checking recent deployments...');
  const deploysOutput = runCommandWithOutput('netlify deploy:list --limit=10', 'Getting recent deployments');

  console.log('\n5. 🔍 Getting deployment logs...');
  runCommandWithOutput('netlify logs:deploy', 'Getting deployment logs');

  console.log('\n6. 🚀 Attempting fixes...');

  // Fix 1: Clear cache and redeploy
  console.log('\n   Fix 1: Clearing cache and triggering redeploy...');
  const clearCacheOutput = runCommand('netlify build --clear-cache', 'Clearing build cache');

  // Fix 2: Check environment variables
  console.log('\n   Fix 2: Checking environment variables...');
  runCommandWithOutput('netlify env:list', 'Listing environment variables');

  // Fix 3: Check build settings
  console.log('\n   Fix 3: Checking build settings...');
  runCommandWithOutput('netlify api getSite', 'Getting site configuration');

  // Fix 4: Try manual deployment
  console.log('\n   Fix 4: Testing manual deployment...');
  
  // First, let's build locally
  console.log('   Building locally first...');
  const buildOutput = runCommand('cd client && npm install && npm run build', 'Building application locally');
  
  if (buildOutput !== null) {
    console.log('   ✅ Local build successful, attempting manual deploy...');
    runCommandWithOutput('netlify deploy --dir=client/build --prod', 'Manual deployment');
  } else {
    console.log('   ❌ Local build failed, cannot attempt manual deploy');
  }

  console.log('\n7. 🔧 Applying configuration fixes...');
  
  // Apply optimized netlify.toml
  const optimizedConfig = `[build]
  base = "client"
  command = "npm ci --only=production --no-audit --no-fund && npm run build"
  publish = "build"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- client/"
  environment = { 
    NODE_VERSION = "18", 
    NPM_VERSION = "9.8.1", 
    NODE_OPTIONS = "--max-old-space-size=2048",
    NODE_ENV = "production",
    GENERATE_SOURCEMAP = "false"
  }

# Build optimization
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-XSS-Protection = "1; mode=block"

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

  try {
    fs.writeFileSync('netlify.toml', optimizedConfig);
    console.log('   ✅ Applied optimized netlify.toml configuration');
  } catch (error) {
    console.log('   ❌ Failed to update netlify.toml:', error.message);
  }

  // Update client package.json for better builds
  try {
    const packagePath = 'client/package.json';
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Optimize build script
    packageJson.scripts.build = 'GENERATE_SOURCEMAP=false react-scripts build';
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('   ✅ Optimized client build script');
  } catch (error) {
    console.log('   ❌ Failed to update client package.json:', error.message);
  }

  console.log('\n8. 🎯 Final deployment test...');
  
  // Trigger a new deployment
  console.log('   Triggering new deployment...');
  runCommandWithOutput('netlify deploy --prod --dir=client/build', 'Final deployment test');

  console.log('\n✅ NETLIFY FIX SCRIPT COMPLETED');
  console.log('\n📊 SUMMARY:');
  console.log('- Checked authentication and site status');
  console.log('- Retrieved deployment logs and history');
  console.log('- Applied configuration optimizations');
  console.log('- Attempted manual deployment');
  console.log('\n🔍 Check the output above for any specific error messages.');
  console.log('🚀 If issues persist, the deployment logs should show the exact problem.');
}

// Run the fix script
fixNetlifyDeployments().catch(console.error);