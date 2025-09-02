#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class TeamStatus {
  constructor() {
    this.projectRoot = process.cwd();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
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

  execute(command, silent = true) {
    try {
      return execSync(command, { 
        encoding: 'utf-8', 
        stdio: silent ? 'pipe' : 'inherit' 
      }).trim();
    } catch (error) {
      return null;
    }
  }

  checkGitStatus() {
    this.title('🔍 Git Repository Status');

    const currentBranch = this.execute('git rev-parse --abbrev-ref HEAD');
    const gitStatus = this.execute('git status --porcelain');
    const unpushedCommits = this.execute('git log --oneline @{u}..HEAD 2>/dev/null || echo ""');
    const stashList = this.execute('git stash list');

    this.info(`Current Branch: ${currentBranch || 'Unknown'}`);
    
    if (gitStatus) {
      this.warning(`Uncommitted changes: ${gitStatus.split('\n').length} files`);
      this.log('  Modified files:', 'yellow');
      gitStatus.split('\n').forEach(line => {
        if (line.trim()) {
          this.log(`    ${line}`, 'yellow');
        }
      });
    } else {
      this.success('Working directory clean');
    }

    if (unpushedCommits) {
      this.warning(`Unpushed commits: ${unpushedCommits.split('\n').length}`);
      this.log('  Commits to push:', 'yellow');
      unpushedCommits.split('\n').forEach(line => {
        if (line.trim()) {
          this.log(`    ${line}`, 'yellow');
        }
      });
    } else {
      this.success('All commits pushed to remote');
    }

    if (stashList) {
      this.info(`Stashed changes: ${stashList.split('\n').length}`);
    } else {
      this.info('No stashed changes');
    }
  }

  checkBranchStatus() {
    this.title('🌿 Branch Information');

    const localBranches = this.execute('git branch');
    const remoteBranches = this.execute('git branch -r');
    const recentBranches = this.execute('git for-each-ref --format="%(refname:short) %(committerdate:relative)" refs/heads --sort=-committerdate --count=5');

    if (localBranches) {
      const branchCount = localBranches.split('\n').length;
      this.info(`Local branches: ${branchCount}`);
      
      if (branchCount > 10) {
        this.warning('Consider cleaning up old branches');
        this.log('  Run: npm run git:cleanup', 'cyan');
      }
    }

    if (remoteBranches) {
      const remoteCount = remoteBranches.split('\n').length;
      this.info(`Remote branches: ${remoteCount}`);
    }

    if (recentBranches) {
      this.info('Recent branches:');
      recentBranches.split('\n').forEach(line => {
        if (line.trim()) {
          this.log(`  ${line}`, 'cyan');
        }
      });
    }
  }

  checkDependencyHealth() {
    this.title('📦 Dependency Health');

    // Check for outdated packages
    const outdatedRoot = this.execute('npm outdated --json 2>/dev/null || echo "{}"');
    const outdatedClient = this.execute('cd client && npm outdated --json 2>/dev/null || echo "{}"');
    const outdatedServer = this.execute('cd server && npm outdated --json 2>/dev/null || echo "{}"');

    try {
      const rootOutdated = JSON.parse(outdatedRoot);
      const clientOutdated = JSON.parse(outdatedClient);
      const serverOutdated = JSON.parse(outdatedServer);

      const rootCount = Object.keys(rootOutdated).length;
      const clientCount = Object.keys(clientOutdated).length;
      const serverCount = Object.keys(serverOutdated).length;
      const totalOutdated = rootCount + clientCount + serverCount;

      if (totalOutdated === 0) {
        this.success('All dependencies up to date');
      } else {
        this.warning(`${totalOutdated} outdated dependencies`);
        this.log(`  Root: ${rootCount}, Client: ${clientCount}, Server: ${serverCount}`, 'yellow');
        
        if (totalOutdated > 5) {
          this.log('  Consider updating: npm update && cd client && npm update && cd ../server && npm update', 'cyan');
        }
      }
    } catch {
      this.info('Could not check dependency status');
    }

    // Check for security vulnerabilities
    const auditResult = this.execute('npm audit --json 2>/dev/null || echo \'{"vulnerabilities":{}}\'');
    try {
      const audit = JSON.parse(auditResult);
      const vulnCount = Object.keys(audit.vulnerabilities || {}).length;
      
      if (vulnCount === 0) {
        this.success('No security vulnerabilities found');
      } else {
        this.error(`${vulnCount} security vulnerabilities found`);
        this.log('  Run: npm audit fix', 'red');
      }
    } catch {
      this.info('Could not check security audit');
    }
  }

  checkBuildHealth() {
    this.title('🏗️  Build Health');

    // Check if builds are working
    const clientBuildStatus = fs.existsSync(path.join(this.projectRoot, 'client', 'build'));
    const testResults = fs.existsSync(path.join(this.projectRoot, 'test-results'));
    
    if (clientBuildStatus) {
      this.success('Client build directory exists');
    } else {
      this.warning('Client build not found - run npm run build');
    }

    // Check recent test results
    if (testResults) {
      const testDir = path.join(this.projectRoot, 'test-results');
      const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.json'));
      
      if (testFiles.length > 0) {
        const latestTest = testFiles.sort().pop();
        const testPath = path.join(testDir, latestTest);
        const stats = fs.statSync(testPath);
        const age = Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60));
        
        if (age < 24) {
          this.success(`Tests run recently (${age} hours ago)`);
        } else {
          this.warning(`Tests last run ${age} hours ago`);
          this.log('  Consider running: npm run test:all', 'cyan');
        }
      }
    } else {
      this.info('No test results found');
    }

    // Check lint status
    const lintResult = this.execute('npm run lint 2>&1', false);
    // Note: We don't check the result directly as lint might fail
    this.info('Lint check available - run npm run lint to validate');
  }

  checkDevEnvironment() {
    this.title('💻 Development Environment');

    // Check Node.js version
    const nodeVersion = this.execute('node --version');
    const npmVersion = this.execute('npm --version');
    const gitVersion = this.execute('git --version');

    this.info(`Node.js: ${nodeVersion}`);
    this.info(`NPM: ${npmVersion}`);
    this.info(`Git: ${gitVersion}`);

    // Check VS Code setup
    const vscodeConfig = fs.existsSync(path.join(this.projectRoot, '.vscode', 'settings.json'));
    if (vscodeConfig) {
      this.success('VS Code configuration found');
    } else {
      this.warning('VS Code configuration missing');
    }

    // Check environment files
    const clientEnv = fs.existsSync(path.join(this.projectRoot, 'client', '.env'));
    const serverEnv = fs.existsSync(path.join(this.projectRoot, 'server', '.env'));

    if (clientEnv) {
      this.success('Client environment configuration found');
    } else {
      this.info('Client .env file not found (may not be needed)');
    }

    if (serverEnv) {
      this.success('Server environment configuration found');
    } else {
      this.info('Server .env file not found (may not be needed)');
    }
  }

  checkProjectHealth() {
    this.title('🏥 Project Health Summary');

    const healthChecks = [];

    // Git health
    const hasUncommitted = this.execute('git status --porcelain');
    const hasUnpushed = this.execute('git log --oneline @{u}..HEAD 2>/dev/null || echo ""');
    
    if (!hasUncommitted && !hasUnpushed) {
      healthChecks.push({ name: 'Git Status', status: 'healthy', message: 'Clean and synced' });
    } else {
      healthChecks.push({ name: 'Git Status', status: 'attention', message: 'Has uncommitted or unpushed changes' });
    }

    // Build health
    const hasBuild = fs.existsSync(path.join(this.projectRoot, 'client', 'build'));
    healthChecks.push({ 
      name: 'Build Status', 
      status: hasBuild ? 'healthy' : 'attention', 
      message: hasBuild ? 'Build exists' : 'No build found' 
    });

    // Dependencies health
    const hasNodeModules = fs.existsSync(path.join(this.projectRoot, 'node_modules'));
    const hasClientModules = fs.existsSync(path.join(this.projectRoot, 'client', 'node_modules'));
    const hasServerModules = fs.existsSync(path.join(this.projectRoot, 'server', 'node_modules'));
    
    if (hasNodeModules && hasClientModules && hasServerModules) {
      healthChecks.push({ name: 'Dependencies', status: 'healthy', message: 'All installed' });
    } else {
      healthChecks.push({ name: 'Dependencies', status: 'unhealthy', message: 'Missing dependencies' });
    }

    // VS Code setup
    const hasVSCodeConfig = fs.existsSync(path.join(this.projectRoot, '.vscode'));
    healthChecks.push({ 
      name: 'VS Code Setup', 
      status: hasVSCodeConfig ? 'healthy' : 'attention', 
      message: hasVSCodeConfig ? 'Configured' : 'Not configured' 
    });

    // Display health summary
    healthChecks.forEach(check => {
      const icon = check.status === 'healthy' ? '✅' : check.status === 'attention' ? '⚠️' : '❌';
      const color = check.status === 'healthy' ? 'green' : check.status === 'attention' ? 'yellow' : 'red';
      this.log(`${icon} ${check.name}: ${check.message}`, color);
    });

    // Overall health score
    const healthyCount = healthChecks.filter(c => c.status === 'healthy').length;
    const totalChecks = healthChecks.length;
    const healthPercentage = Math.round((healthyCount / totalChecks) * 100);

    this.log(`\n🏆 Overall Health Score: ${healthPercentage}%`, healthPercentage >= 80 ? 'green' : healthPercentage >= 60 ? 'yellow' : 'red');
  }

  displayQuickActions() {
    this.title('⚡ Quick Actions');

    this.log('Git Operations:', 'cyan');
    this.log('  npm run git:status        - Detailed git status', 'cyan');
    this.log('  npm run git:sync          - Sync with remote', 'cyan');
    this.log('  npm run git:smart-commit  - Interactive commit', 'cyan');
    this.log('  npm run git:cleanup       - Clean merged branches', 'cyan');

    this.log('\nDevelopment:', 'cyan');
    this.log('  npm run dev:full          - Start full stack development', 'cyan');
    this.log('  npm run test:all          - Run all tests', 'cyan');
    this.log('  npm run lint              - Check code style', 'cyan');
    this.log('  npm run build             - Build for production', 'cyan');

    this.log('\nWorkflow:', 'cyan');
    this.log('  npm run workflow:new-feature - Start new feature', 'cyan');
    this.log('  npm run git:pr-ready      - Prepare for pull request', 'cyan');
    this.log('  npm run team:onboard      - Run onboarding setup', 'cyan');

    this.log('\nDeployment:', 'cyan');
    this.log('  npm run deploy:staging    - Deploy to staging', 'cyan');
    this.log('  npm run deploy:safe       - Safe production deploy', 'cyan');
  }

  async run() {
    this.log('\n📊 StartupNamer.ai Team Status Dashboard', 'bright');
    this.log('='.repeat(45), 'bright');

    this.checkGitStatus();
    this.checkBranchStatus();
    this.checkDependencyHealth();
    this.checkBuildHealth();
    this.checkDevEnvironment();
    this.checkProjectHealth();
    this.displayQuickActions();

    this.log('\n🎯 Status check complete!', 'green');
  }
}

// Run status check
if (require.main === module) {
  const status = new TeamStatus();
  status.run().catch(error => {
    console.error('Status check failed:', error.message);
    process.exit(1);
  });
}

module.exports = TeamStatus;