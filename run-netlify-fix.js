#!/usr/bin/env node

/**
 * Execute Netlify Fix Commands
 * This script will run Netlify CLI commands with the provided token
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');

// Set the Netlify token
process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';

console.log('🚨 EXECUTING NETLIFY FIX WITH TOKEN');
console.log('====================================\n');

function executeCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`);
    
    const childProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NETLIFY_AUTH_TOKEN: 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27' }
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Command completed successfully\n`);
        resolve();
      } else {
        console.log(`❌ Command failed with code ${code}\n`);
        resolve(); // Continue with other commands even if one fails
      }
    });

    childProcess.on('error', (error) => {
      console.log(`❌ Command error: ${error.message}\n`);
      resolve(); // Continue with other commands
    });
  });
}

async function runNetlifyFix() {
  try {
    // Check if Netlify CLI is installed
    console.log('1. 📦 Checking Netlify CLI installation...');
    try {
      execSync('netlify --version', { stdio: 'pipe' });
      console.log('✅ Netlify CLI is installed\n');
    } catch (error) {
      console.log('📦 Installing Netlify CLI...');
      await executeCommand('npm', ['install', '-g', 'netlify-cli']);
    }

    // Check authentication
    console.log('2. 🔍 Checking Netlify authentication...');
    await executeCommand('netlify', ['status']);

    // List sites
    console.log('3. 📋 Listing Netlify sites...');
    await executeCommand('netlify', ['sites:list']);

    // Get recent deployments
    console.log('4. 📊 Getting recent deployments...');
    await executeCommand('netlify', ['deploy:list', '--limit=10']);

    // Get deployment logs
    console.log('5. 🔍 Getting deployment logs...');
    await executeCommand('netlify', ['logs:deploy']);

    // Check environment variables
    console.log('6. 🔧 Checking environment variables...');
    await executeCommand('netlify', ['env:list']);

    // Try to build locally first
    console.log('7. 🏗️ Testing local build...');
    console.log('   Installing dependencies...');
    await executeCommand('npm', ['install'], { cwd: 'client' });
    
    console.log('   Building application...');
    await executeCommand('npm', ['run', 'build'], { cwd: 'client' });

    // Try manual deployment
    console.log('8. 🚀 Attempting manual deployment...');
    await executeCommand('netlify', ['deploy', '--dir=client/build', '--prod']);

    console.log('✅ NETLIFY FIX COMPLETED!');
    console.log('\n📊 If you see any errors above, those indicate the specific issues.');
    console.log('🔍 Check the deployment logs for detailed error messages.');

  } catch (error) {
    console.error('❌ Script execution error:', error.message);
  }
}

// Run the fix
runNetlifyFix();