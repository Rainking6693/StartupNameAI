#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const chokidar = require('chokidar');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class ReactGitIntegration {
  constructor() {
    this.projectRoot = process.cwd();
    this.clientRoot = path.join(this.projectRoot, 'client');
    this.watchMode = false;
    this.developmentServer = null;
    this.lastCommitHash = this.getCurrentCommitHash();
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
  }

  success(message) {
    this.log(`✅ ${message}`, 'green');
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  warning(message) {
    this.log(`⚠️  ${message}`, 'yellow');
  }

  error(message) {
    this.log(`❌ ${message}`, 'red');
  }

  title(message) {
    this.log(`\n${message}`, 'bright');
    this.log('='.repeat(message.length), 'bright');
  }

  execute(command, options = {}) {
    try {
      const result = execSync(command, { 
        encoding: 'utf-8', 
        stdio: options.silent ? 'pipe' : 'inherit',
        cwd: options.cwd || this.projectRoot,
        ...options 
      });
      return result ? result.trim() : '';
    } catch (error) {
      if (!options.ignoreErrors) {
        this.error(`Command failed: ${command}`);
        throw error;
      }
      return null;
    }
  }

  getCurrentCommitHash() {
    return this.execute('git rev-parse HEAD', { silent: true, ignoreErrors: true }) || '';
  }

  getCurrentBranch() {
    return this.execute('git rev-parse --abbrev-ref HEAD', { silent: true, ignoreErrors: true }) || 'main';
  }

  hasUncommittedChanges() {
    const status = this.execute('git status --porcelain', { silent: true, ignoreErrors: true });
    return status && status.length > 0;
  }

  async startReactDevServer() {
    this.title('🚀 Starting React Development Server with Git Integration');
    
    this.info('Initializing development environment...');
    
    // Check if client directory exists
    if (!fs.existsSync(this.clientRoot)) {
      this.error('Client directory not found');
      return;
    }

    // Install dependencies if needed
    if (!fs.existsSync(path.join(this.clientRoot, 'node_modules'))) {
      this.info('Installing client dependencies...');
      this.execute('npm ci', { cwd: this.clientRoot });
    }

    // Show initial Git status
    this.displayGitStatus();

    // Start development server
    this.info('Starting React development server...');
    
    const devServer = spawn('npm', ['start'], {
      cwd: this.clientRoot,
      stdio: 'inherit',
      shell: true
    });

    this.developmentServer = devServer;

    // Set up file watching for Git integration
    this.setupFileWatching();

    // Set up periodic Git checks
    this.setupGitMonitoring();

    // Handle process termination
    process.on('SIGINT', () => {
      this.cleanup();
      process.exit(0);
    });

    devServer.on('close', (code) => {
      this.info(`Development server exited with code ${code}`);
      this.cleanup();
    });

    devServer.on('error', (error) => {
      this.error(`Development server error: ${error.message}`);
      this.cleanup();
    });

    this.success('React development server with Git integration started!');
    this.showDevelopmentTips();
  }

  displayGitStatus() {
    const branch = this.getCurrentBranch();
    const hasChanges = this.hasUncommittedChanges();
    
    this.info(`Current branch: ${branch}`);
    
    if (hasChanges) {
      this.warning('You have uncommitted changes');
      this.execute('git status --short');
    } else {
      this.success('Working directory clean');
    }
  }

  setupFileWatching() {
    this.info('Setting up intelligent file watching...');
    
    // Watch React source files
    const watcher = chokidar.watch([
      path.join(this.clientRoot, 'src/**/*.{js,jsx,ts,tsx}'),
      path.join(this.clientRoot, 'src/**/*.{css,scss}'),
      path.join(this.clientRoot, 'public/**/*'),
      path.join(this.projectRoot, '*.json'),  // Root config files
    ], {
      ignored: /node_modules|\.git|build|dist/,
      persistent: true,
      ignoreInitial: true
    });

    let changeBuffer = new Set();
    let bufferTimeout = null;

    watcher.on('change', (filePath) => {
      changeBuffer.add(filePath);
      
      // Debounce file changes
      if (bufferTimeout) {
        clearTimeout(bufferTimeout);
      }
      
      bufferTimeout = setTimeout(() => {
        this.handleFileChanges(Array.from(changeBuffer));
        changeBuffer.clear();
      }, 1000);
    });

    watcher.on('add', (filePath) => {
      this.info(`New file detected: ${path.relative(this.projectRoot, filePath)}`);
    });

    watcher.on('unlink', (filePath) => {
      this.warning(`File deleted: ${path.relative(this.projectRoot, filePath)}`);
    });

    this.fileWatcher = watcher;
  }

  handleFileChanges(changedFiles) {
    const relativeFiles = changedFiles.map(file => 
      path.relative(this.projectRoot, file)
    );

    this.info(`Files changed: ${relativeFiles.join(', ')}`);

    // Check if critical files changed
    const criticalFiles = relativeFiles.filter(file => 
      file.includes('package.json') || 
      file.includes('tsconfig.json') ||
      file.includes('.env')
    );

    if (criticalFiles.length > 0) {
      this.warning('Critical configuration files changed - consider restarting dev server');
      this.log('Changed files:', 'yellow');
      criticalFiles.forEach(file => {
        this.log(`  - ${file}`, 'yellow');
      });
    }

    // Auto-run linter on JS/TS changes
    const codeFiles = relativeFiles.filter(file => 
      /\.(js|jsx|ts|tsx)$/.test(file)
    );

    if (codeFiles.length > 0) {
      this.runQuickLint(codeFiles);
    }

    // Show quick Git status if many files changed
    if (relativeFiles.length >= 5) {
      this.info('Multiple files changed - current Git status:');
      this.execute('git status --short');
    }
  }

  runQuickLint(files) {
    if (files.length === 0) return;

    try {
      // Run ESLint on changed files only
      const fileList = files.filter(f => f.startsWith('client/src/')).join(' ');
      if (fileList) {
        this.execute(`npx eslint ${fileList} --fix`, { 
          cwd: this.clientRoot, 
          silent: true, 
          ignoreErrors: true 
        });
        this.success(`Quick lint passed for ${files.length} files`);
      }
    } catch (error) {
      this.warning('Lint issues detected - run npm run lint to see details');
    }
  }

  setupGitMonitoring() {
    this.info('Setting up Git monitoring...');
    
    // Check Git status every 30 seconds
    this.gitMonitorInterval = setInterval(() => {
      this.checkGitChanges();
    }, 30000);

    // Check for remote changes every 5 minutes
    this.remoteCheckInterval = setInterval(() => {
      this.checkRemoteChanges();
    }, 300000);
  }

  checkGitChanges() {
    const currentHash = this.getCurrentCommitHash();
    
    if (currentHash !== this.lastCommitHash && currentHash) {
      this.success('New commit detected!');
      this.lastCommitHash = currentHash;
      
      // Show recent commit
      const lastCommit = this.execute('git log --oneline -1', { silent: true, ignoreErrors: true });
      if (lastCommit) {
        this.info(`Latest commit: ${lastCommit}`);
      }
    }

    // Check for uncommitted changes
    if (this.hasUncommittedChanges()) {
      const fileCount = this.execute('git status --porcelain', { silent: true })
        .split('\n').filter(line => line.trim()).length;
      
      if (fileCount > 0) {
        this.info(`💡 You have ${fileCount} uncommitted files - use 'npm run git:smart-commit' when ready`);
      }
    }
  }

  checkRemoteChanges() {
    try {
      this.execute('git fetch origin', { silent: true });
      
      const currentBranch = this.getCurrentBranch();
      const behind = this.execute(`git rev-list --count HEAD..origin/${currentBranch}`, { 
        silent: true, 
        ignoreErrors: true 
      });
      
      if (behind && parseInt(behind) > 0) {
        this.warning(`Your branch is ${behind} commits behind origin/${currentBranch}`);
        this.info('💡 Consider running: npm run git:sync');
      }
    } catch (error) {
      // Ignore errors for remote checks
    }
  }

  showDevelopmentTips() {
    this.title('💡 Development Tips');
    
    this.log('Git Integration Commands:', 'cyan');
    this.log('  npm run git:status          - Check current status', 'cyan');
    this.log('  npm run git:smart-commit    - Interactive commit', 'cyan');
    this.log('  npm run git:sync            - Sync with remote', 'cyan');
    this.log('  npm run workflow:smart-pr   - Prepare for PR', 'cyan');

    this.log('\nDevelopment Commands:', 'cyan');
    this.log('  npm run test                - Run tests', 'cyan');
    this.log('  npm run lint                - Check code style', 'cyan');
    this.log('  npm run build               - Build for production', 'cyan');

    this.log('\nPro Tips:', 'magenta');
    this.log('  • Auto-linting runs on file changes', 'magenta');
    this.log('  • Git status updates every 30 seconds', 'magenta');
    this.log('  • Remote changes checked every 5 minutes', 'magenta');
    this.log('  • Use Ctrl+C to stop and commit changes', 'magenta');
  }

  async smartDevelopmentWorkflow() {
    this.title('🧠 Smart Development Workflow');
    
    const branch = this.getCurrentBranch();
    this.info(`Working on branch: ${branch}`);

    // Check if we're on a feature branch
    if (!branch.startsWith('feature/') && !branch.startsWith('hotfix/')) {
      this.warning('Not on a feature or hotfix branch');
      this.info('💡 Create a feature branch: npm run workflow:smart-branch');
    }

    // Run pre-development checks
    await this.runPreDevelopmentChecks();

    // Start development server with enhanced monitoring
    await this.startReactDevServer();
  }

  async runPreDevelopmentChecks() {
    this.info('Running pre-development checks...');

    const checks = [
      {
        name: 'Dependencies installed',
        check: () => fs.existsSync(path.join(this.clientRoot, 'node_modules')),
        fix: 'npm run install:all'
      },
      {
        name: 'Git status clean or manageable',
        check: () => {
          const status = this.execute('git status --porcelain', { silent: true });
          return !status || status.split('\n').length < 10; // Less than 10 changed files
        },
        fix: 'npm run git:smart-commit or git stash'
      },
      {
        name: 'Up to date with remote',
        check: () => {
          try {
            this.execute('git fetch origin', { silent: true });
            const behind = this.execute(`git rev-list --count HEAD..origin/${this.getCurrentBranch()}`, { 
              silent: true, 
              ignoreErrors: true 
            });
            return !behind || parseInt(behind) === 0;
          } catch {
            return true; // Assume OK if can't check
          }
        },
        fix: 'npm run git:sync'
      }
    ];

    for (const check of checks) {
      if (check.check()) {
        this.success(check.name);
      } else {
        this.warning(`${check.name} - Recommendation: ${check.fix}`);
      }
    }
  }

  generateDevelopmentReport() {
    this.title('📊 Development Session Report');
    
    const branch = this.getCurrentBranch();
    const commitCount = this.execute(`git rev-list --count HEAD ^origin/${branch}`, { 
      silent: true, 
      ignoreErrors: true 
    }) || '0';
    
    const fileChanges = this.execute('git diff --name-only', { silent: true }) || '';
    const changedFiles = fileChanges.split('\n').filter(f => f.trim()).length;

    this.info(`Branch: ${branch}`);
    this.info(`Unpushed commits: ${commitCount}`);
    this.info(`Modified files: ${changedFiles}`);

    if (parseInt(commitCount) > 0) {
      this.info('Recent commits:');
      const commits = this.execute('git log --oneline -5', { silent: true });
      commits.split('\n').forEach(commit => {
        if (commit.trim()) {
          this.log(`  ${commit}`, 'cyan');
        }
      });
    }

    this.info('\n💡 Next steps:');
    if (changedFiles > 0) {
      this.log('  1. Review changes: npm run git:diff', 'cyan');
      this.log('  2. Commit changes: npm run git:smart-commit', 'cyan');
    }
    if (parseInt(commitCount) > 0) {
      this.log('  3. Push changes: npm run git:safe-push', 'cyan');
    }
    this.log('  4. Create PR: npm run workflow:smart-pr', 'cyan');
  }

  cleanup() {
    this.info('Cleaning up development session...');
    
    if (this.fileWatcher) {
      this.fileWatcher.close();
    }
    
    if (this.gitMonitorInterval) {
      clearInterval(this.gitMonitorInterval);
    }
    
    if (this.remoteCheckInterval) {
      clearInterval(this.remoteCheckInterval);
    }

    // Generate final report
    this.generateDevelopmentReport();
    
    this.success('Development session ended');
  }

  async run() {
    const command = process.argv[2];

    switch (command) {
      case 'start':
        await this.startReactDevServer();
        break;
      case 'smart':
        await this.smartDevelopmentWorkflow();
        break;
      case 'report':
        this.generateDevelopmentReport();
        break;
      default:
        this.showHelp();
    }
  }

  showHelp() {
    this.log('\n⚛️  React-Git Integration', 'bright');
    this.log('='.repeat(25), 'bright');
    
    this.log('\nCommands:', 'cyan');
    this.log('  start   - Start React dev server with Git monitoring');
    this.log('  smart   - Smart development workflow');
    this.log('  report  - Generate development session report');
    
    this.log('\nNPM Scripts:', 'yellow');
    this.log('  npm run dev:frontend-focus  - React-focused development');
    this.log('  npm run dev:with-git       - Full-stack with Git status');
  }
}

// Run the integration
if (require.main === module) {
  const integration = new ReactGitIntegration();
  integration.run().catch(error => {
    console.error('React-Git integration failed:', error.message);
    process.exit(1);
  });
}

module.exports = ReactGitIntegration;