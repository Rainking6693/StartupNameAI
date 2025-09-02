#!/usr/bin/env node

/**
 * FALLBACK BUILD STRATEGY
 * 
 * This script provides multiple build strategies when the primary webpack/terser build fails.
 * Designed specifically to handle production build issues in Netlify.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🛡️  FALLBACK BUILD STRATEGY - Initializing...');

function createWebpackOverride() {
  const clientDir = process.cwd();
  const configOverridePath = path.join(clientDir, 'config-overrides.js');
  
  if (fs.existsSync(configOverridePath)) {
    console.log('📋 config-overrides.js already exists');
    return;
  }

  console.log('🔧 Creating webpack configuration override...');
  
  const configOverride = `
const path = require('path');

module.exports = function override(config, env) {
  console.log('🔧 Applying webpack configuration override...');
  
  // Disable terser minification if it's causing issues
  if (env === 'production') {
    console.log('📦 Production build - applying compatibility fixes');
    
    // Find and disable problematic terser plugin
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.filter(plugin => {
        const pluginName = plugin.constructor.name;
        if (pluginName === 'TerserPlugin') {
          console.log('⚠️  Removing problematic TerserPlugin');
          return false;
        }
        return true;
      });
    }
    
    // Disable source maps to reduce build complexity
    config.devtool = false;
    
    // Simplify optimization settings
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      },
    };
    
    console.log('✅ Applied production compatibility fixes');
  }
  
  return config;
};
`;

  fs.writeFileSync(configOverridePath, configOverride);
  console.log('✅ Created webpack configuration override');
}

function attemptBuild(strategy, command, options = {}) {
  console.log(`\n🚀 Attempting build with strategy: ${strategy}`);
  console.log(`📋 Command: ${command}`);
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const child = spawn('npm', ['run', command], {
      stdio: 'inherit',
      shell: true,
      env: { 
        ...process.env, 
        ...options.env 
      }
    });
    
    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      if (code === 0) {
        console.log(`✅ ${strategy} succeeded in ${duration}s`);
        resolve(true);
      } else {
        console.log(`❌ ${strategy} failed in ${duration}s (exit code: ${code})`);
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      console.error(`❌ ${strategy} error:`, err.message);
      reject(err);
    });
  });
}

function checkBuildOutput() {
  const buildDir = path.join(process.cwd(), 'build');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory does not exist');
    return false;
  }
  
  const indexPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found in build directory');
    return false;
  }
  
  // Check if build has meaningful content
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.length < 1000) {
    console.log('⚠️  Build output seems too small');
    return false;
  }
  
  console.log('✅ Build output validation passed');
  return true;
}

async function main() {
  console.log('🛡️  Starting Fallback Build Strategy...\n');
  
  // Clean any previous build
  const buildDir = path.join(process.cwd(), 'build');
  if (fs.existsSync(buildDir)) {
    console.log('🧹 Cleaning previous build...');
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  
  // Strategy 1: Try the patched production build
  try {
    await attemptBuild(
      'Strategy 1: Patched Production Build', 
      'build:production'
    );
    
    if (checkBuildOutput()) {
      console.log('\n🎉 SUCCESS: Patched production build worked!');
      return;
    }
  } catch (err) {
    console.log('⚠️  Strategy 1 failed, trying Strategy 2...');
  }
  
  // Strategy 2: Create webpack override and try standard build
  try {
    createWebpackOverride();
    await attemptBuild(
      'Strategy 2: Webpack Override Build',
      'build',
      { env: { DISABLE_TERSER: 'true' } }
    );
    
    if (checkBuildOutput()) {
      console.log('\n🎉 SUCCESS: Webpack override build worked!');
      return;
    }
  } catch (err) {
    console.log('⚠️  Strategy 2 failed, trying Strategy 3...');
  }
  
  // Strategy 3: Minimal build with all optimizations disabled
  try {
    await attemptBuild(
      'Strategy 3: Minimal Build',
      'build',
      { 
        env: { 
          GENERATE_SOURCEMAP: 'false',
          DISABLE_ESLINT_PLUGIN: 'true',
          DISABLE_TERSER: 'true',
          NODE_ENV: 'development'
        } 
      }
    );
    
    if (checkBuildOutput()) {
      console.log('\n🎉 SUCCESS: Minimal build worked!');
      return;
    }
  } catch (err) {
    console.log('⚠️  Strategy 3 failed, trying Strategy 4...');
  }
  
  // Strategy 4: Last resort - development build with production settings
  try {
    console.log('\n🆘 Last Resort: Development build with production environment');
    
    // Create a simple build process
    const simpleScript = \`
const { execSync } = require('child_process');
console.log('Building with minimal webpack configuration...');

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';

try {
  execSync('react-scripts build', { stdio: 'inherit' });
  console.log('✅ Simple build completed');
} catch (err) {
  console.error('❌ Simple build failed:', err.message);
  process.exit(1);
}
\`;

    fs.writeFileSync(path.join(process.cwd(), 'simple-build.js'), simpleScript);
    
    execSync('node simple-build.js', { stdio: 'inherit' });
    
    if (checkBuildOutput()) {
      console.log('\n🎉 SUCCESS: Last resort build worked!');
      return;
    }
  } catch (err) {
    console.error('❌ All build strategies failed');
    console.error('🆘 Manual intervention required');
    process.exit(1);
  }
  
  console.error('\n❌ All fallback strategies failed');
  console.error('🔍 Check the build logs for specific error details');
  process.exit(1);
}

// Execute if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('💥 Fallback build script error:', err.message);
    process.exit(1);
  });
}

module.exports = { main };