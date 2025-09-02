#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

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

class SmartWorkflowAutomation {
  constructor() {
    this.projectRoot = process.cwd();
    this.workflowConfigPath = path.join(this.projectRoot, '.workflow-config.json');
    this.loadConfig();
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

  execute(command, options = {}) {
    try {
      const result = execSync(command, { 
        encoding: 'utf-8', 
        stdio: options.silent ? 'pipe' : 'inherit',
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

  async prompt(question, defaultValue = '') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const questionText = defaultValue ? 
        `${colors.cyan}${question} (${defaultValue})${colors.reset} ` : 
        `${colors.cyan}${question}${colors.reset} `;
        
      rl.question(questionText, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  loadConfig() {
    this.config = {
      branchPrefix: {
        feature: 'feature/',
        hotfix: 'hotfix/',
        release: 'release/',
        chore: 'chore/'
      },
      commitTypes: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci'],
      defaultReviewer: '',
      autoRunTests: true,
      autoSync: true,
      notifications: true
    };

    if (fs.existsSync(this.workflowConfigPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(this.workflowConfigPath, 'utf-8'));
        this.config = { ...this.config, ...userConfig };
      } catch (error) {
        this.warning('Invalid workflow config, using defaults');
      }
    }
  }

  saveConfig() {
    fs.writeFileSync(this.workflowConfigPath, JSON.stringify(this.config, null, 2));
    this.success('Workflow configuration saved');
  }

  async setupWorkflowConfig() {
    this.title('🔧 Smart Workflow Configuration');
    
    this.info('Let\\'s customize your workflow preferences...');

    this.config.defaultReviewer = await this.prompt(
      'Default reviewer GitHub username:', 
      this.config.defaultReviewer
    );

    const autoTests = await this.prompt('Auto-run tests before commits? (y/n):', 'y');
    this.config.autoRunTests = autoTests.toLowerCase() === 'y';

    const autoSync = await this.prompt('Auto-sync with remote before creating branches? (y/n):', 'y');
    this.config.autoSync = autoSync.toLowerCase() === 'y';

    const notifications = await this.prompt('Show workflow notifications? (y/n):', 'y');
    this.config.notifications = notifications.toLowerCase() === 'y';

    this.saveConfig();
  }

  generateBranchName(type, description) {
    const prefix = this.config.branchPrefix[type] || `${type}/`;
    const cleanDescription = description
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${prefix}${cleanDescription}`;
  }

  async smartBranchCreation() {
    this.title('🌿 Smart Branch Creation');

    const types = Object.keys(this.config.branchPrefix);
    this.info('Available branch types:');
    types.forEach((type, index) => {
      this.log(`  ${index + 1}. ${type}`, 'cyan');
    });

    const typeIndex = await this.prompt('Select branch type (1-4):', '1');
    const selectedType = types[parseInt(typeIndex) - 1] || 'feature';
    
    const description = await this.prompt('Branch description (e.g., "user authentication"):');
    if (!description) {
      this.error('Branch description is required');
      return;
    }

    const branchName = this.generateBranchName(selectedType, description);
    this.info(`Creating branch: ${branchName}`);

    try {
      // Sync with remote if configured
      if (this.config.autoSync) {
        this.info('Syncing with remote...');
        this.execute('git fetch origin');
        const mainBranch = this.getMainBranch();
        this.execute(`git checkout ${mainBranch}`);
        this.execute(`git pull origin ${mainBranch}`);
      }

      // Create and switch to new branch
      this.execute(`git checkout -b ${branchName}`);
      this.success(`Created and switched to branch: ${branchName}`);

      // Push to remote and set upstream
      this.execute(`git push -u origin ${branchName}`);
      this.success('Branch pushed to remote');

      // Log workflow activity
      this.logWorkflowActivity('branch_created', { branchName, type: selectedType });

      if (this.config.notifications) {
        this.info(`💡 Next steps:`);
        this.log(`  1. Make your changes`, 'cyan');
        this.log(`  2. Commit with: npm run git:smart-commit`, 'cyan');
        this.log(`  3. Prepare PR with: npm run git:pr-ready`, 'cyan');
      }

    } catch (error) {
      this.error(`Failed to create branch: ${error.message}`);
    }
  }

  async smartCommitWizard() {
    this.title('💬 Smart Commit Wizard');

    // Check for staged changes
    const stagedFiles = this.execute('git diff --cached --name-only', { silent: true });
    const unstagedFiles = this.execute('git diff --name-only', { silent: true });

    if (!stagedFiles && !unstagedFiles) {
      this.warning('No changes to commit');
      return;
    }

    // Show current status
    this.info('Current changes:');
    if (unstagedFiles) {
      this.log('Unstaged files:', 'yellow');
      unstagedFiles.split('\n').forEach(file => {
        if (file.trim()) this.log(`  📝 ${file}`, 'yellow');
      });
    }

    if (stagedFiles) {
      this.log('Staged files:', 'green');
      stagedFiles.split('\n').forEach(file => {
        if (file.trim()) this.log(`  ✅ ${file}`, 'green');
      });
    }

    // Stage files if needed
    if (unstagedFiles && !stagedFiles) {
      const stageAll = await this.prompt('Stage all changes? (y/n):', 'y');
      if (stageAll.toLowerCase() === 'y') {
        this.execute('git add .');
        this.success('All changes staged');
      } else {
        this.info('Please stage your changes manually with git add');
        return;
      }
    }

    // Get commit type
    this.info('Available commit types:');
    this.config.commitTypes.forEach((type, index) => {
      this.log(`  ${index + 1}. ${type}`, 'cyan');
    });

    const typeIndex = await this.prompt('Select commit type (1-9):', '1');
    const commitType = this.config.commitTypes[parseInt(typeIndex) - 1] || 'feat';

    // Get scope (optional)
    const scope = await this.prompt('Commit scope (optional, e.g., "api", "ui"):');
    
    // Get description
    const description = await this.prompt('Commit description (max 50 chars):');
    if (!description) {
      this.error('Commit description is required');
      return;
    }

    // Get body (optional)
    const needsBody = await this.prompt('Add detailed commit body? (y/n):', 'n');
    let body = '';
    if (needsBody.toLowerCase() === 'y') {
      this.info('Enter commit body (press Ctrl+D when done):');
      // For simplicity, we'll skip multi-line input in this example
      body = await this.prompt('Body (single line):');
    }

    // Construct commit message
    const scopePart = scope ? `(${scope})` : '';
    const commitMessage = `${commitType}${scopePart}: ${description}`;
    
    if (body) {
      this.execute(`git commit -m "${commitMessage}" -m "${body}"`);
    } else {
      this.execute(`git commit -m "${commitMessage}"`);
    }

    this.success('Commit created successfully!');
    this.info(`Commit: ${commitMessage}`);

    // Log activity
    this.logWorkflowActivity('commit_created', { type: commitType, scope, description });

    // Ask about pushing
    const push = await this.prompt('Push to remote? (y/n):', 'y');
    if (push.toLowerCase() === 'y') {
      const currentBranch = this.execute('git rev-parse --abbrev-ref HEAD', { silent: true });
      this.execute(`git push origin ${currentBranch}`);
      this.success('Changes pushed to remote');
    }
  }

  async smartPRPreparation() {
    this.title('🚀 Smart PR Preparation');

    const currentBranch = this.execute('git rev-parse --abbrev-ref HEAD', { silent: true });
    const mainBranch = this.getMainBranch();

    if (currentBranch === mainBranch) {
      this.error('Cannot create PR from main branch');
      return;
    }

    // Run pre-PR checks
    this.info('Running pre-PR validation...');

    const checks = [
      { name: 'Lint check', command: 'npm run lint', required: true },
      { name: 'Tests', command: 'npm run test', required: this.config.autoRunTests },
      { name: 'Build check', command: 'npm run build', required: true }
    ];

    let allChecksPassed = true;

    for (const check of checks) {
      if (!check.required) continue;

      this.info(`Running ${check.name}...`);
      try {
        this.execute(check.command, { silent: false });
        this.success(`${check.name} passed`);
      } catch (error) {
        this.error(`${check.name} failed`);
        allChecksPassed = false;
        
        const continueAnyway = await this.prompt('Continue anyway? (y/n):', 'n');
        if (continueAnyway.toLowerCase() !== 'y') {
          return;
        }
        allChecksPassed = true; // User chose to continue
      }
    }

    if (!allChecksPassed) {
      this.error('Pre-PR checks failed. Please fix issues and try again.');
      return;
    }

    // Sync with main branch
    this.info('Syncing with main branch...');
    try {
      this.execute('git fetch origin');
      this.execute(`git rebase origin/${mainBranch}`);
      this.success('Branch rebased on main');
    } catch (error) {
      this.warning('Rebase conflicts detected. Please resolve manually.');
      return;
    }

    // Push changes
    this.info('Pushing final changes...');
    this.execute(`git push origin ${currentBranch} --force-with-lease`);

    // Generate PR information
    const prInfo = await this.generatePRInformation(currentBranch);
    
    this.success('Branch is ready for pull request!');
    this.info('PR Information:');
    this.log(`Title: ${prInfo.title}`, 'cyan');
    this.log(`Description: ${prInfo.description}`, 'cyan');

    if (this.config.defaultReviewer) {
      this.log(`Suggested reviewer: @${this.config.defaultReviewer}`, 'cyan');
    }

    // Log activity
    this.logWorkflowActivity('pr_prepared', { branch: currentBranch, title: prInfo.title });

    const openGitHub = await this.prompt('Open GitHub to create PR? (y/n):', 'y');
    if (openGitHub.toLowerCase() === 'y') {
      try {
        // Try to use GitHub CLI if available
        this.execute(`gh pr create --title "${prInfo.title}" --body "${prInfo.description}"`);
        this.success('PR created with GitHub CLI');
      } catch (error) {
        // Fallback to opening browser
        const repoUrl = this.getRepositoryUrl();
        if (repoUrl) {
          const prUrl = `${repoUrl}/compare/${currentBranch}?expand=1`;
          this.info(`Opening: ${prUrl}`);
          // On Windows, use start command
          this.execute(`start ${prUrl}`, { ignoreErrors: true });
        }
      }
    }
  }

  async generatePRInformation(branchName) {
    // Extract information from branch name and recent commits
    const commits = this.execute('git log --oneline origin/main..HEAD', { silent: true });
    const branchParts = branchName.split('/');
    const branchType = branchParts[0];
    const branchDesc = branchParts.slice(1).join('/').replace(/-/g, ' ');

    let title = '';
    let description = '';

    // Generate title based on branch type
    switch (branchType) {
      case 'feature':
        title = `feat: ${branchDesc}`;
        break;
      case 'hotfix':
        title = `fix: ${branchDesc}`;
        break;
      case 'chore':
        title = `chore: ${branchDesc}`;
        break;
      default:
        title = branchDesc;
    }

    // Generate description from commits
    description = `## Summary\n\nThis PR implements ${branchDesc}.\n\n## Changes\n`;
    
    if (commits) {
      const commitList = commits.split('\n')
        .filter(line => line.trim())
        .map(line => `- ${line.substring(8)}`) // Remove commit hash
        .join('\n');
      description += commitList;
    }

    description += '\n\n## Testing\n- [ ] Unit tests pass\n- [ ] Manual testing completed';

    return { title, description };
  }

  getMainBranch() {
    try {
      const branches = this.execute('git branch -r', { silent: true });
      return branches.includes('origin/main') ? 'main' : 'master';
    } catch {
      return 'main';
    }
  }

  getRepositoryUrl() {
    try {
      const remoteUrl = this.execute('git config --get remote.origin.url', { silent: true });
      if (remoteUrl.includes('github.com')) {
        return remoteUrl
          .replace('git@github.com:', 'https://github.com/')
          .replace('.git', '');
      }
    } catch {
      // Ignore errors
    }
    return null;
  }

  logWorkflowActivity(action, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      branch: this.execute('git rev-parse --abbrev-ref HEAD', { silent: true, ignoreErrors: true }),
      user: this.execute('git config user.name', { silent: true, ignoreErrors: true })
    };

    const logFile = path.join(this.projectRoot, '.workflow-activity.log');
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
  }

  async showWorkflowStats() {
    this.title('📊 Workflow Statistics');

    const logFile = path.join(this.projectRoot, '.workflow-activity.log');
    if (!fs.existsSync(logFile)) {
      this.info('No workflow activity recorded yet');
      return;
    }

    const logs = fs.readFileSync(logFile, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(entry => entry !== null);

    const stats = {
      totalActivities: logs.length,
      branchesCreated: logs.filter(l => l.action === 'branch_created').length,
      commitsCreated: logs.filter(l => l.action === 'commit_created').length,
      prsPrep: logs.filter(l => l.action === 'pr_prepared').length
    };

    this.info(`Total workflow activities: ${stats.totalActivities}`);
    this.info(`Branches created: ${stats.branchesCreated}`);
    this.info(`Commits created: ${stats.commitsCreated}`);
    this.info(`PRs prepared: ${stats.prsPrep}`);

    // Recent activity
    const recentLogs = logs.slice(-5);
    if (recentLogs.length > 0) {
      this.info('\nRecent activities:');
      recentLogs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleDateString();
        this.log(`  ${date}: ${log.action.replace(/_/g, ' ')}`, 'cyan');
      });
    }
  }

  async run() {
    const command = process.argv[2];

    switch (command) {
      case 'setup':
        await this.setupWorkflowConfig();
        break;
      case 'branch':
        await this.smartBranchCreation();
        break;
      case 'commit':
        await this.smartCommitWizard();
        break;
      case 'pr':
        await this.smartPRPreparation();
        break;
      case 'stats':
        await this.showWorkflowStats();
        break;
      default:
        this.showHelp();
    }
  }

  showHelp() {
    this.log('\n🤖 Smart Workflow Automation', 'bright');
    this.log('='.repeat(30), 'bright');
    
    this.log('\nCommands:', 'cyan');
    this.log('  setup   - Configure workflow preferences');
    this.log('  branch  - Smart branch creation wizard');
    this.log('  commit  - Smart commit wizard');
    this.log('  pr      - Smart PR preparation');
    this.log('  stats   - Show workflow statistics');
    
    this.log('\nQuick Access (npm scripts):', 'yellow');
    this.log('  npm run workflow:smart-branch');
    this.log('  npm run workflow:smart-commit'); 
    this.log('  npm run workflow:smart-pr');
  }
}

// Run the automation
if (require.main === module) {
  const automation = new SmartWorkflowAutomation();
  automation.run().catch(error => {
    console.error('Workflow automation failed:', error.message);
    process.exit(1);
  });
}

module.exports = SmartWorkflowAutomation;