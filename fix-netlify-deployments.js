#!/usr/bin/env node

/**
 * Netlify Deployment Fix Script
 * Applies common fixes for deployment cancellation issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 NETLIFY DEPLOYMENT FIX SCRIPT\n');

let fixesApplied = [];

// Fix 1: Optimize netlify.toml for better build performance
console.log('1. 🚀 Optimizing netlify.toml configuration...');

try {
  let netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  // Check if we need to optimize the build command
  if (netlifyConfig.includes('npm install --no-audit --no-fund')) {
    console.log('   ✅ Build command already optimized');
  } else {
    // Update build command for better performance
    netlifyConfig = netlifyConfig.replace(
      /command\s*=\s*"[^"]*"/,
      'command = "npm ci --only=production --no-audit --no-fund && npm run build"'
    );
    fixesApplied.push('Optimized build command');
  }
  
  // Add source map optimization if not present
  if (!netlifyConfig.includes('GENERATE_SOURCEMAP')) {
    netlifyConfig = netlifyConfig.replace(
      /environment\s*=\s*{([^}]*)}/,
      'environment = {$1, GENERATE_SOURCEMAP = "false" }'
    );
    fixesApplied.push('Disabled source map generation');
  }
  
  // Reduce memory allocation if too high
  if (netlifyConfig.includes('--max-old-space-size=4096')) {
    netlifyConfig = netlifyConfig.replace(
      '--max-old-space-size=4096',
      '--max-old-space-size=2048'
    );
    fixesApplied.push('Reduced memory allocation');
  }
  
  fs.writeFileSync('netlify.toml', netlifyConfig);
  console.log('   ✅ netlify.toml updated');
  
} catch (error) {
  console.log('   ❌ Error updating netlify.toml:', error.message);
}

// Fix 2: Optimize client package.json build script
console.log('\n2. 📦 Optimizing client build script...');

try {
  const packagePath = 'client/package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Optimize build script
  if (packageJson.scripts && packageJson.scripts.build) {
    const currentBuild = packageJson.scripts.build;
    
    if (!currentBuild.includes('GENERATE_SOURCEMAP=false')) {
      packageJson.scripts.build = 'GENERATE_SOURCEMAP=false react-scripts build';
      fixesApplied.push('Optimized React build script');
    }
    
    // Add optimized build script variant
    packageJson.scripts['build:netlify'] = 'GENERATE_SOURCEMAP=false INLINE_RUNTIME_CHUNK=false react-scripts build';
    fixesApplied.push('Added Netlify-optimized build script');
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ client/package.json updated');
  
} catch (error) {
  console.log('   ❌ Error updating client/package.json:', error.message);
}

// Fix 3: Create .nvmrc if it doesn't exist or is incorrect
console.log('\n3. 🔧 Ensuring Node.js version consistency...');

try {
  const nvmrcPath = '.nvmrc';
  const currentNvmrc = fs.existsSync(nvmrcPath) ? fs.readFileSync(nvmrcPath, 'utf8').trim() : '';
  
  if (currentNvmrc !== '18') {
    fs.writeFileSync(nvmrcPath, '18');
    fixesApplied.push('Updated .nvmrc to Node.js 18');
  }
  
  console.log('   ✅ Node.js version consistency ensured');
  
} catch (error) {
  console.log('   ❌ Error updating .nvmrc:', error.message);
}

// Fix 4: Create optimized netlify.toml backup
console.log('\n4. 💾 Creating optimized netlify.toml...');

const optimizedNetlifyConfig = `[build]
  base = "client"
  command = "npm ci --only=production --no-audit --no-fund && npm run build:netlify"
  publish = "build"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- client/"
  environment = { 
    NODE_VERSION = "18", 
    NPM_VERSION = "9.8.1", 
    NODE_OPTIONS = "--max-old-space-size=2048",
    NODE_ENV = "production",
    GENERATE_SOURCEMAP = "false",
    INLINE_RUNTIME_CHUNK = "false"
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

[build.processing.html]
  pretty_urls = true

# Security Headers for Enterprise-Grade Protection
[[headers]]
  for = "/*"
  [headers.values]
    # Content Security Policy - Prevents XSS attacks
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.openai.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    
    # Prevent clickjacking attacks
    X-Frame-Options = "DENY"
    
    # Prevent MIME type sniffing
    X-Content-Type-Options = "nosniff"
    
    # Control referrer information
    Referrer-Policy = "strict-origin-when-cross-origin"
    
    # Permissions policy for enhanced privacy
    Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), vibrate=(), fullscreen=(self), sync-xhr=()"
    
    # HTTP Strict Transport Security
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    
    # XSS Protection
    X-XSS-Protection = "1; mode=block"
    
    # Cache control for security
    Cache-Control = "public, max-age=31536000, immutable"
    
    # Additional security headers
    X-Permitted-Cross-Domain-Policies = "none"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"

# Special headers for static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
# Headers for API endpoints
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"

# HTTPS Redirects - Force secure connections
[[redirects]]
  from = "http://startupnamer.org/*"
  to = "https://startupnamer.org/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.startupnamer.org/*"
  to = "https://startupnamer.org/:splat"
  status = 301
  force = true

# WWW to non-WWW redirect
[[redirects]]
  from = "https://www.startupnamer.org/*"
  to = "https://startupnamer.org/:splat"
  status = 301
  force = true

# SPA routing - Must be last
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

try {
  fs.writeFileSync('netlify-optimized.toml', optimizedNetlifyConfig);
  console.log('   ✅ Created netlify-optimized.toml');
  fixesApplied.push('Created optimized Netlify configuration');
} catch (error) {
  console.log('   ❌ Error creating optimized config:', error.message);
}

// Fix 5: Create deployment test script
console.log('\n5. 🧪 Creating deployment test script...');

const testScript = `#!/usr/bin/env node

/**
 * Test deployment locally before pushing to Netlify
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing deployment locally...\\n');

try {
  // Test 1: Check if we're in the right directory
  if (!fs.existsSync('client/package.json')) {
    throw new Error('client/package.json not found. Run from project root.');
  }
  
  console.log('✅ Project structure verified');
  
  // Test 2: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('cd client && npm ci --only=production --no-audit --no-fund', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
  
  // Test 3: Run build
  console.log('🏗️ Building application...');
  execSync('cd client && GENERATE_SOURCEMAP=false npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed');
  
  // Test 4: Check build output
  if (fs.existsSync('client/build/index.html')) {
    console.log('✅ Build output verified');
  } else {
    throw new Error('Build output missing');
  }
  
  console.log('\\n🎉 Local deployment test PASSED!');
  console.log('Ready to deploy to Netlify.');
  
} catch (error) {
  console.error('\\n❌ Local deployment test FAILED:', error.message);
  process.exit(1);
}
`;

try {
  fs.writeFileSync('test-deployment-local.js', testScript);
  console.log('   ✅ Created test-deployment-local.js');
  fixesApplied.push('Created local deployment test script');
} catch (error) {
  console.log('   ❌ Error creating test script:', error.message);
}

// Summary
console.log('\n📊 FIXES APPLIED SUMMARY\n');

if (fixesApplied.length > 0) {
  fixesApplied.forEach((fix, index) => {
    console.log(`   ${index + 1}. ✅ ${fix}`);
  });
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Test locally: node test-deployment-local.js');
  console.log('2. Commit changes: git add . && git commit -m "🔧 Fix Netlify deployment issues"');
  console.log('3. Push to trigger deploy: git push origin main');
  console.log('4. Monitor deploy in Netlify dashboard');
  
  console.log('\n💡 ALTERNATIVE: Use optimized config');
  console.log('   cp netlify-optimized.toml netlify.toml');
  console.log('   git add netlify.toml && git commit -m "🚀 Use optimized Netlify config"');
  
} else {
  console.log('   ℹ️  No fixes needed - configuration already optimized');
  
  console.log('\n🔍 MANUAL CHECKS NEEDED:');
  console.log('1. Check Netlify dashboard for exact error messages');
  console.log('2. Verify environment variables are set correctly');
  console.log('3. Check repository permissions and webhooks');
  console.log('4. Try manual deploy: netlify deploy --dir=client/build --prod');
}

console.log('\n✅ Deployment fix script complete!');
`;

fs.writeFileSync('fix-netlify-deployments.js', fixScript);
console.log('   ✅ Created fix-netlify-deployments.js');