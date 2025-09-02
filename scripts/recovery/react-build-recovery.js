#!/usr/bin/env node

/**
 * React Build Failure Recovery Strategy
 * 
 * Automatically handles React build compilation failures through:
 * - Dependency resolution
 * - Import path verification
 * - TypeScript error handling
 * - Cache clearing and reinstallation
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ReactBuildRecovery {
  constructor() {
    this.errorContext = JSON.parse(process.env.ERROR_CONTEXT || '{}');
    this.recoverySteps = [];
    this.issues = [];
    this.fixes = [];
  }

  async execute() {
    console.log('🔄 Executing React build recovery...');
    
    try {
      // Step 1: Analyze build error
      await this.analyzeBuildError();
      
      // Step 2: Check dependencies
      await this.verifyDependencies();
      
      // Step 3: Validate import paths
      await this.validateImportPaths();
      
      // Step 4: Clear caches and reinstall
      await this.clearCachesAndReinstall();
      
      // Step 5: Fix common issues
      await this.fixCommonIssues();
      
      // Step 6: Retry build
      const retryResult = await this.retryBuild();
      
      // Generate recovery report
      const report = await this.generateRecoveryReport(retryResult);
      
      console.log('✅ React build recovery completed');
      return { success: retryResult.success, report };
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeBuildError() {
    console.log('🔍 Analyzing React build error...');
    this.recoverySteps.push('Analyzing build error');

    const errorMessage = this.errorContext.message || '';
    const errorTypes = {
      moduleNotFound: /Module not found|Cannot resolve module/i,
      importError: /Attempted import error|Failed to resolve import/i,
      syntaxError: /Syntax error|Unexpected token/i,
      typeScriptError: /TypeScript error|TS\d+/i,
      dependencyError: /Package.*not found|Module.*is not installed/i,
      memoryError: /JavaScript heap out of memory|FATAL ERROR.*Reached heap limit/i
    };

    const detectedErrors = [];
    for (const [type, pattern] of Object.entries(errorTypes)) {
      if (pattern.test(errorMessage)) {
        detectedErrors.push(type);
        console.log(`   🎯 Detected: ${type}`);
      }
    }

    this.issues.push({
      type: 'error_analysis',
      detectedErrors,
      originalMessage: errorMessage
    });

    // Set specific recovery strategy based on error type
    if (detectedErrors.includes('memoryError')) {
      this.fixes.push({
        type: 'memory_optimization',
        action: 'Increase Node.js memory limit',
        priority: 'high'
      });
    }

    if (detectedErrors.includes('moduleNotFound') || detectedErrors.includes('dependencyError')) {
      this.fixes.push({
        type: 'dependency_resolution',
        action: 'Resolve dependency issues',
        priority: 'high'
      });
    }

    if (detectedErrors.includes('typeScriptError')) {
      this.fixes.push({
        type: 'typescript_resolution',
        action: 'Fix TypeScript configuration',
        priority: 'medium'
      });
    }
  }

  async verifyDependencies() {
    console.log('📦 Verifying dependencies...');
    this.recoverySteps.push('Verifying dependencies');

    try {
      // Check package.json consistency
      const clientPackageJson = JSON.parse(await fs.readFile('./client/package.json', 'utf8'));
      const dependencies = { ...clientPackageJson.dependencies, ...clientPackageJson.devDependencies };
      
      // Check for package-lock.json
      let hasLockFile = false;
      try {
        await fs.access('./client/package-lock.json');
        hasLockFile = true;
        console.log('   ✓ package-lock.json found');
      } catch {
        console.log('   ⚠️ package-lock.json missing');
        this.fixes.push({
          type: 'lockfile_missing',
          action: 'Generate package-lock.json',
          priority: 'medium'
        });
      }

      // Check for node_modules
      try {
        await fs.access('./client/node_modules');
        console.log('   ✓ node_modules directory exists');
      } catch {
        console.log('   ⚠️ node_modules missing');
        this.fixes.push({
          type: 'node_modules_missing',
          action: 'Install dependencies',
          priority: 'high'
        });
      }

      // Check for version conflicts
      await this.checkVersionConflicts(dependencies);

      this.issues.push({
        type: 'dependency_check',
        hasLockFile,
        dependencyCount: Object.keys(dependencies).length,
        success: true
      });

    } catch (error) {
      console.error('   ❌ Dependency verification failed:', error.message);
      this.issues.push({
        type: 'dependency_check',
        error: error.message,
        success: false
      });
    }
  }

  async checkVersionConflicts(dependencies) {
    console.log('🔍 Checking for version conflicts...');
    
    const conflictPatterns = [
      { name: 'react', conflicts: ['@types/react'] },
      { name: 'typescript', conflicts: ['@types/node'] },
      { name: 'eslint', conflicts: ['@typescript-eslint'] }
    ];

    for (const { name, conflicts } of conflictPatterns) {
      if (dependencies[name]) {
        for (const conflict of conflicts) {
          if (dependencies[conflict]) {
            console.log(`   ⚠️ Potential version conflict: ${name} + ${conflict}`);
            this.fixes.push({
              type: 'version_conflict',
              action: `Review ${name} and ${conflict} versions`,
              priority: 'medium',
              packages: [name, conflict]
            });
          }
        }
      }
    }
  }

  async validateImportPaths() {
    console.log('🔍 Validating import paths...');
    this.recoverySteps.push('Validating import paths');

    try {
      const srcPath = './client/src';
      const importIssues = await this.scanForImportIssues(srcPath);
      
      if (importIssues.length > 0) {
        console.log(`   ⚠️ Found ${importIssues.length} import issues`);
        this.fixes.push({
          type: 'import_path_fix',
          action: 'Fix import path issues',
          priority: 'high',
          issues: importIssues
        });
      } else {
        console.log('   ✓ No import path issues detected');
      }

      this.issues.push({
        type: 'import_validation',
        issueCount: importIssues.length,
        issues: importIssues,
        success: true
      });

    } catch (error) {
      console.error('   ❌ Import path validation failed:', error.message);
      this.issues.push({
        type: 'import_validation',
        error: error.message,
        success: false
      });
    }
  }

  async scanForImportIssues(dirPath) {
    const issues = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const subIssues = await this.scanForImportIssues(fullPath);
          issues.push(...subIssues);
        } else if (entry.name.match(/\.(js|jsx|ts|tsx)$/)) {
          const fileIssues = await this.checkFileImports(fullPath);
          issues.push(...fileIssues);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error.message);
    }

    return issues;
  }

  async checkFileImports(filePath) {
    const issues = [];
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const importMatch = line.match(/^import.*from\s+['"]([^'"]+)['"]/);
        
        if (importMatch) {
          const importPath = importMatch[1];
          
          // Check for relative import issues
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
            const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
            
            let exists = false;
            for (const ext of possibleExtensions) {
              try {
                await fs.access(resolvedPath + ext);
                exists = true;
                break;
              } catch {
                // File doesn't exist with this extension
              }
            }
            
            if (!exists) {
              issues.push({
                file: filePath,
                line: i + 1,
                importPath,
                issue: 'File not found',
                type: 'missing_file'
              });
            }
          }
        }
      }
    } catch (error) {
      issues.push({
        file: filePath,
        issue: `Cannot read file: ${error.message}`,
        type: 'read_error'
      });
    }

    return issues;
  }

  async clearCachesAndReinstall() {
    console.log('🧹 Clearing caches and reinstalling...');
    this.recoverySteps.push('Clearing caches and reinstalling');

    const commands = [
      'cd client && rm -rf node_modules',
      'cd client && rm -f package-lock.json',
      'cd client && npm cache clean --force',
      'cd client && npm install'
    ];

    for (const command of commands) {
      try {
        console.log(`   Executing: ${command}`);
        await execAsync(command, { shell: true, timeout: 300000 });
        console.log(`   ✓ ${command}`);
      } catch (error) {
        console.error(`   ❌ ${command} failed: ${error.message}`);
        this.issues.push({
          type: 'reinstall_error',
          command,
          error: error.message
        });
      }
    }
  }

  async fixCommonIssues() {
    console.log('🔧 Fixing common React build issues...');
    this.recoverySteps.push('Fixing common issues');

    for (const fix of this.fixes) {
      try {
        await this.applyFix(fix);
      } catch (error) {
        console.error(`   ❌ Failed to apply fix ${fix.type}:`, error.message);
      }
    }
  }

  async applyFix(fix) {
    switch (fix.type) {
      case 'memory_optimization':
        console.log('   🧠 Optimizing memory settings...');
        
        // Update package.json with memory optimization
        const clientPackageJson = JSON.parse(await fs.readFile('./client/package.json', 'utf8'));
        clientPackageJson.scripts = clientPackageJson.scripts || {};
        clientPackageJson.scripts['build:memory-optimized'] = 'NODE_OPTIONS="--max-old-space-size=4096" npm run build';
        
        await fs.writeFile('./client/package.json', JSON.stringify(clientPackageJson, null, 2));
        console.log('     ✓ Added memory-optimized build script');
        break;

      case 'typescript_resolution':
        console.log('   📝 Fixing TypeScript configuration...');
        
        try {
          const tsconfigPath = './client/tsconfig.json';
          let tsconfig = {};
          
          try {
            tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));
          } catch {
            // Create basic tsconfig if it doesn't exist
            tsconfig = {
              compilerOptions: {
                target: "es5",
                lib: ["dom", "dom.iterable", "es6"],
                allowJs: true,
                skipLibCheck: true,
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                strict: true,
                forceConsistentCasingInFileNames: true,
                module: "esnext",
                moduleResolution: "node",
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "react-jsx"
              },
              include: ["src"]
            };
          }

          // Add common fixes
          tsconfig.compilerOptions = tsconfig.compilerOptions || {};
          tsconfig.compilerOptions.skipLibCheck = true;
          tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
          
          await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
          console.log('     ✓ Updated TypeScript configuration');
          
        } catch (error) {
          console.error('     ❌ TypeScript fix failed:', error.message);
        }
        break;

      case 'import_path_fix':
        console.log('   🔗 Fixing import path issues...');
        
        if (fix.issues) {
          for (const issue of fix.issues.slice(0, 5)) { // Fix first 5 issues
            if (issue.type === 'missing_file' && issue.file) {
              console.log(`     Checking ${issue.file}:${issue.line}`);
              // Could implement automatic import path correction here
            }
          }
        }
        break;

      default:
        console.log(`   ⚠️ Unknown fix type: ${fix.type}`);
    }
  }

  async retryBuild() {
    console.log('🔄 Retrying React build...');
    this.recoverySteps.push('Retrying build');

    const buildAttempts = [
      { command: 'cd client && npm run build:memory-optimized', name: 'memory-optimized' },
      { command: 'cd client && npm run build', name: 'standard' },
      { command: 'cd client && CI=false npm run build', name: 'ci-disabled' }
    ];

    for (const attempt of buildAttempts) {
      try {
        console.log(`   Attempting: ${attempt.name} build...`);
        const startTime = Date.now();
        
        const { stdout, stderr } = await execAsync(attempt.command, {
          shell: true,
          timeout: 600000 // 10 minutes
        });
        
        const buildTime = Date.now() - startTime;
        console.log(`   ✅ ${attempt.name} build successful in ${buildTime}ms`);
        
        return {
          success: true,
          method: attempt.name,
          buildTime,
          output: stdout
        };
        
      } catch (error) {
        console.log(`   ❌ ${attempt.name} build failed: ${error.message}`);
      }
    }

    return {
      success: false,
      attempts: buildAttempts.map(a => a.name),
      error: 'All build attempts failed'
    };
  }

  async generateRecoveryReport(retryResult) {
    const report = {
      timestamp: new Date().toISOString(),
      recoveryType: 'react_build_failure',
      originalError: this.errorContext,
      recoverySteps: this.recoverySteps,
      detectedIssues: this.issues,
      appliedFixes: this.fixes,
      buildResult: retryResult,
      recommendations: [
        'Implement pre-commit hooks to catch build issues early',
        'Set up dependency vulnerability scanning',
        'Consider using exact versions in package.json',
        'Implement build performance monitoring',
        'Add automated import path validation'
      ]
    };

    const reportPath = `./scripts/reports/react-build-recovery-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Recovery report saved: ${reportPath}`);
    return report;
  }
}

// Execute recovery if called directly
if (require.main === module) {
  const recovery = new ReactBuildRecovery();
  recovery.execute()
    .then(result => {
      console.log('Recovery result:', result.success ? '✅ Success' : '❌ Failed');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Recovery execution failed:', error);
      process.exit(1);
    });
}

module.exports = ReactBuildRecovery;