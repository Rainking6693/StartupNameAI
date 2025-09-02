#!/usr/bin/env node

/**
 * Netlify Multer Dependency Recovery Script
 * 
 * Automatically recovers from multer dependency conflicts in Netlify builds
 * by removing server-side dependencies from client-side builds
 * 
 * Author: QA Engineer - Error Correlation System
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class NetlifyMulterRecovery {
  constructor() {
    this.errorContext = null;
    this.backupPath = './scripts/recovery/backups';
    this.recoverySteps = [];
    this.success = false;
    
    // Parse error context if provided
    if (process.env.ERROR_CONTEXT) {
      try {
        this.errorContext = JSON.parse(process.env.ERROR_CONTEXT);
      } catch (error) {
        console.error('⚠️ Failed to parse error context:', error);
      }
    }
  }

  async execute() {
    console.log('🔧 Starting Netlify Multer Dependency Recovery...');
    
    try {
      await this.createBackup();
      await this.removeMulterDependency();
      await this.cleanWorkspacesConfig();
      await this.updatePackageJson();
      await this.reinstallDependencies();
      await this.validateBuild();
      
      this.success = true;
      console.log('✅ Netlify Multer recovery completed successfully');
      return this.generateRecoveryReport();
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      await this.rollback();
      throw error;
    }
  }

  async createBackup() {
    console.log('📦 Creating backup of current configuration...');
    
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
      
      // Backup package.json
      const packageJsonPath = './package.json';
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      await fs.writeFile(
        path.join(this.backupPath, `package-backup-${timestamp}.json`),
        packageJsonContent
      );
      
      // Backup client package.json if exists
      try {
        const clientPackagePath = './client/package.json';
        const clientPackageContent = await fs.readFile(clientPackagePath, 'utf8');
        await fs.writeFile(
          path.join(this.backupPath, `client-package-backup-${timestamp}.json`),
          clientPackageContent
        );
      } catch {
        // Client package.json doesn't exist, skip
      }

      this.recoverySteps.push('Created configuration backups');
      console.log('✅ Backup created successfully');
      
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw error;
    }
  }

  async removeMulterDependency() {
    console.log('🗑️ Removing multer dependency from package.json...');
    
    try {
      const packageJsonPath = './package.json';
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      let modified = false;
      
      // Remove multer from dependencies
      if (packageJson.dependencies && packageJson.dependencies.multer) {
        delete packageJson.dependencies.multer;
        modified = true;
        console.log('  Removed multer from dependencies');
      }
      
      // Remove multer from devDependencies
      if (packageJson.devDependencies && packageJson.devDependencies.multer) {
        delete packageJson.devDependencies.multer;
        modified = true;
        console.log('  Removed multer from devDependencies');
      }
      
      // Remove other server-only dependencies that might cause issues
      const serverOnlyDeps = ['express', 'body-parser', 'cors', 'helmet', 'morgan'];
      serverOnlyDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          delete packageJson.dependencies[dep];
          modified = true;
          console.log(`  Removed ${dep} from dependencies`);
        }
      });
      
      if (modified) {
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        this.recoverySteps.push('Removed server-side dependencies');
        console.log('✅ Dependencies cleaned successfully');
      } else {
        console.log('ℹ️ No multer or server dependencies found to remove');
      }
      
    } catch (error) {
      console.error('❌ Failed to remove dependencies:', error);
      throw error;
    }
  }

  async cleanWorkspacesConfig() {
    console.log('🧹 Cleaning workspaces configuration...');
    
    try {
      const packageJsonPath = './package.json';
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.workspaces) {
        delete packageJson.workspaces;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        this.recoverySteps.push('Removed workspaces configuration');
        console.log('✅ Workspaces configuration removed');
      } else {
        console.log('ℹ️ No workspaces configuration found');
      }
      
    } catch (error) {
      console.error('❌ Failed to clean workspaces config:', error);
      throw error;
    }
  }

  async updatePackageJson() {
    console.log('📝 Updating package.json for client-only build...');
    
    try {
      const packageJsonPath = './package.json';
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Ensure scripts are optimized for client build
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      // Update build scripts to focus on client
      packageJson.scripts.build = packageJson.scripts.build || 'react-scripts build';
      packageJson.scripts.start = packageJson.scripts.start || 'react-scripts start';
      
      // Add explicit client build script
      packageJson.scripts['build:client'] = 'cd client && npm run build';
      
      // Update main entry point if needed
      if (packageJson.main && packageJson.main.includes('server')) {
        delete packageJson.main;
      }
      
      // Ensure proper build configuration
      if (!packageJson.engines) {
        packageJson.engines = {};
      }
      packageJson.engines.node = '>=14.0.0';
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.recoverySteps.push('Updated package.json for client-only build');
      console.log('✅ Package.json updated successfully');
      
    } catch (error) {
      console.error('❌ Failed to update package.json:', error);
      throw error;
    }
  }

  async reinstallDependencies() {
    console.log('🔄 Reinstalling dependencies...');
    
    try {
      // Remove node_modules
      console.log('  Removing node_modules...');
      await execAsync('rm -rf node_modules package-lock.json', { 
        cwd: process.cwd() 
      }).catch(() => {
        // Try Windows command if Unix fails
        return execAsync('rmdir /s /q node_modules & del package-lock.json', { 
          cwd: process.cwd() 
        });
      });
      
      // Clean npm cache
      console.log('  Cleaning npm cache...');
      await execAsync('npm cache clean --force');
      
      // Reinstall dependencies
      console.log('  Installing dependencies...');
      const installResult = await execAsync('npm install', { 
        cwd: process.cwd(),
        timeout: 300000 // 5 minute timeout
      });
      
      if (installResult.stderr && !installResult.stderr.includes('warn')) {
        throw new Error(`npm install failed: ${installResult.stderr}`);
      }
      
      this.recoverySteps.push('Reinstalled dependencies successfully');
      console.log('✅ Dependencies reinstalled successfully');
      
    } catch (error) {
      console.error('❌ Failed to reinstall dependencies:', error);
      throw error;
    }
  }

  async validateBuild() {
    console.log('🔍 Validating build process...');
    
    try {
      // Try to run the build
      const buildResult = await execAsync('npm run build', {
        cwd: process.cwd(),
        timeout: 600000 // 10 minute timeout
      });
      
      if (buildResult.stderr && buildResult.stderr.includes('error')) {
        throw new Error(`Build validation failed: ${buildResult.stderr}`);
      }
      
      // Check if build output exists
      try {
        await fs.access('./build');
        console.log('✅ Build directory created successfully');
      } catch {
        await fs.access('./client/build');
        console.log('✅ Client build directory created successfully');
      }
      
      this.recoverySteps.push('Build validation passed');
      console.log('✅ Build validation successful');
      
    } catch (error) {
      console.error('❌ Build validation failed:', error);
      throw error;
    }
  }

  async rollback() {
    console.log('🔄 Rolling back changes due to recovery failure...');
    
    try {
      // Find most recent backup
      const backupFiles = await fs.readdir(this.backupPath);
      const packageBackups = backupFiles
        .filter(file => file.startsWith('package-backup-'))
        .sort()
        .reverse();
      
      if (packageBackups.length > 0) {
        const latestBackup = packageBackups[0];
        const backupContent = await fs.readFile(
          path.join(this.backupPath, latestBackup), 
          'utf8'
        );
        
        await fs.writeFile('./package.json', backupContent);
        console.log('✅ Restored package.json from backup');
      }
      
      // Restore client package.json if exists
      const clientBackups = backupFiles
        .filter(file => file.startsWith('client-package-backup-'))
        .sort()
        .reverse();
      
      if (clientBackups.length > 0) {
        const latestClientBackup = clientBackups[0];
        const clientBackupContent = await fs.readFile(
          path.join(this.backupPath, latestClientBackup), 
          'utf8'
        );
        
        await fs.writeFile('./client/package.json', clientBackupContent);
        console.log('✅ Restored client package.json from backup');
      }
      
      console.log('🔄 Rollback completed');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
    }
  }

  generateRecoveryReport() {
    return {
      success: this.success,
      timestamp: new Date().toISOString(),
      recoveryType: 'netlify_multer_dependency',
      errorContext: this.errorContext,
      recoverySteps: this.recoverySteps,
      recommendations: [
        'Keep server and client dependencies separated',
        'Use distinct package.json files for client and server',
        'Configure Netlify to build only client code',
        'Implement dependency audit automation'
      ]
    };
  }
}

// Execute recovery if run directly
if (require.main === module) {
  const recovery = new NetlifyMulterRecovery();
  
  recovery.execute()
    .then(report => {
      console.log('\n📊 Recovery Report:');
      console.log(JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Recovery failed:', error.message);
      process.exit(1);
    });
}

module.exports = NetlifyMulterRecovery;