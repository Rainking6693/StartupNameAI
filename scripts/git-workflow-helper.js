#!/usr/bin/env node

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
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

class GitWorkflowHelper {
  constructor() {
    this.projectRoot = process.cwd();
  }

  // Helper methods
  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  error(message) {
    this.log(`❌ ${message}`, 'red');
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
        process.exit(1);
      }
      return null;
    }
  }

  async prompt(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(`${colors.cyan}${question}${colors.reset} `, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  getCurrentBranch() {
    return this.execute('git rev-parse --abbrev-ref HEAD', { silent: true });
  }

  getMainBranch() {
    // Check if main or master exists
    const branches = this.execute('git branch -r', { silent: true, ignoreErrors: true });
    if (branches && branches.includes('origin/main')) {
      return 'main';
    }
    return 'master';
  }

  hasUncommittedChanges() {
    const status = this.execute('git status --porcelain', { silent: true });
    return status.length > 0;
  }

  hasUnpushedCommits() {
    const currentBranch = this.getCurrentBranch();
    try {
      const result = this.execute(`git log origin/${currentBranch}..HEAD --oneline`, { 
        silent: true, 
        ignoreErrors: true 
      });
      return result && result.length > 0;
    } catch {
      return true; // Assume yes if we can't check
    }
  }

  // Git workflow commands
  async sync() {
    this.info('Syncing branch with remote...');
    
    const currentBranch = this.getCurrentBranch();
    const mainBranch = this.getMainBranch();

    if (this.hasUncommittedChanges()) {
      this.warning('You have uncommitted changes. Please commit or stash them first.');
      const answer = await this.prompt('Do you want to stash your changes? (y/n)');
      if (answer.toLowerCase() === 'y') {
        this.execute(`git stash push -m "Auto-stash before sync - $(date)"`);
        this.success('Changes stashed successfully');
      } else {
        this.error('Please handle your changes before syncing');
        return;
      }
    }

    try {
      // Fetch latest changes
      this.execute('git fetch origin');
      
      // If on main/master, just pull
      if (currentBranch === mainBranch) {
        this.execute(`git pull origin ${mainBranch}`);
        this.success(`${mainBranch} branch synced with origin`);
      } else {
        // Update main branch
        this.execute(`git checkout ${mainBranch}`);
        this.execute(`git pull origin ${mainBranch}`);
        this.execute(`git checkout ${currentBranch}`);
        
        // Rebase current branch on main
        const answer = await this.prompt(`Rebase ${currentBranch} on ${mainBranch}? (y/n)`);
        if (answer.toLowerCase() === 'y') {
          this.execute(`git rebase ${mainBranch}`);
          this.success(`${currentBranch} rebased on ${mainBranch}`);
        }
      }
    } catch (error) {
      this.error('Sync failed. Please resolve conflicts manually.');
    }
  }

  async smartCommit() {
    this.info('Starting smart commit process...');

    if (!this.hasUncommittedChanges()) {
      this.warning('No changes to commit');
      return;
    }

    // Show status
    this.execute('git status --short');

    const message = await this.prompt('Enter commit message:');
    if (!message.trim()) {
      this.error('Commit message cannot be empty');
      return;
    }

    // Validate commit message format
    const commitRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,50}/;
    if (!commitRegex.test(message)) {
      this.warning('Commit message should follow conventional commits format');
      this.info('Examples:');
      this.info('  feat: add new user authentication');
      this.info('  fix(api): resolve login endpoint error');
      this.info('  docs: update installation guide');
      
      const proceed = await this.prompt('Continue anyway? (y/n)');
      if (proceed.toLowerCase() !== 'y') {
        return;
      }
    }

    // Stage and commit
    this.execute('git add .');
    this.execute(`git commit -m "${message}"`);
    this.success('Commit created successfully');

    // Ask about pushing
    const push = await this.prompt('Push to remote? (y/n)');
    if (push.toLowerCase() === 'y') {
      this.execute(`git push origin ${this.getCurrentBranch()}`);
      this.success('Changes pushed to remote');
    }
  }

  async createFeatureBranch() {
    const branchName = await this.prompt('Enter feature branch name (without feature/ prefix):');
    if (!branchName.trim()) {
      this.error('Branch name cannot be empty');
      return;
    }

    const fullBranchName = `feature/${branchName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
    
    // Ensure we're on main/master and up to date
    const mainBranch = this.getMainBranch();
    this.execute(`git checkout ${mainBranch}`);
    this.execute(`git pull origin ${mainBranch}`);
    
    // Create and switch to new branch
    this.execute(`git checkout -b ${fullBranchName}`);
    this.success(`Created and switched to branch: ${fullBranchName}`);
    
    // Push new branch to remote
    this.execute(`git push -u origin ${fullBranchName}`);
    this.success('Branch pushed to remote and tracking set up');
  }

  async createHotfixBranch() {
    const branchName = await this.prompt('Enter hotfix branch name (without hotfix/ prefix):');
    if (!branchName.trim()) {
      this.error('Branch name cannot be empty');
      return;
    }

    const fullBranchName = `hotfix/${branchName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
    
    // Create hotfix from main/master
    const mainBranch = this.getMainBranch();
    this.execute(`git checkout ${mainBranch}`);
    this.execute(`git pull origin ${mainBranch}`);
    this.execute(`git checkout -b ${fullBranchName}`);
    
    this.success(`Created hotfix branch: ${fullBranchName}`);
    this.execute(`git push -u origin ${fullBranchName}`);
  }

  cleanup() {
    this.info('Cleaning up merged branches...');
    
    const mainBranch = this.getMainBranch();
    this.execute(`git checkout ${mainBranch}`);
    this.execute(`git pull origin ${mainBranch}`);
    
    // Get merged branches
    const merged = this.execute('git branch --merged', { silent: true })
      .split('\n')
      .map(b => b.trim().replace('* ', ''))
      .filter(b => b && b !== mainBranch && !b.startsWith('origin/'));

    if (merged.length === 0) {
      this.info('No merged branches to clean up');
      return;
    }

    this.info('Merged branches found:');
    merged.forEach(branch => this.log(`  - ${branch}`, 'yellow'));

    // Delete merged branches
    merged.forEach(branch => {
      try {
        this.execute(`git branch -d ${branch}`);
        this.success(`Deleted branch: ${branch}`);
      } catch {
        this.warning(`Could not delete branch: ${branch} (may have unmerged changes)`);
      }
    });

    // Clean up remote tracking branches
    this.execute('git remote prune origin');
    this.success('Cleaned up remote tracking branches');
  }

  validateCommit() {
    this.info('Running pre-commit validation...');
    
    if (!this.hasUncommittedChanges()) {
      this.success('No changes to validate');
      return;
    }

    // Check if files are staged
    const staged = this.execute('git diff --cached --name-only', { silent: true });
    if (!staged) {
      this.warning('No files staged for commit');
      return;
    }

    this.success('Pre-commit validation passed');
  }

  async prReady() {
    this.info('Preparing branch for pull request...');
    
    const currentBranch = this.getCurrentBranch();
    const mainBranch = this.getMainBranch();

    if (currentBranch === mainBranch) {
      this.error('Cannot create PR from main branch');
      return;
    }

    // Ensure branch is up to date
    await this.sync();

    // Run quality checks
    this.info('Running quality checks...');
    try {
      this.execute('npm run lint');
      this.execute('npm run test');
      this.success('All quality checks passed');
    } catch {
      this.error('Quality checks failed. Please fix issues before creating PR.');
      return;
    }

    // Push branch
    if (this.hasUnpushedCommits()) {
      this.execute(`git push origin ${currentBranch}`);
    }

    this.success(`Branch ${currentBranch} is ready for pull request!`);
    
    // Generate PR template content
    const prTemplate = this.generatePRTemplate(currentBranch);
    const templatePath = path.join(this.projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md');
    
    if (!fs.existsSync(path.dirname(templatePath))) {
      fs.mkdirSync(path.dirname(templatePath), { recursive: true });
    }
    
    if (!fs.existsSync(templatePath)) {
      fs.writeFileSync(templatePath, prTemplate);
      this.success('Created PR template');
    }

    this.info('Next steps:');
    this.log('1. Go to GitHub and create a pull request', 'cyan');
    this.log('2. Add reviewers and labels', 'cyan');
    this.log('3. Update PR description with details', 'cyan');
  }

  generatePRTemplate(branchName) {
    return `## Summary

Brief description of changes made in this PR.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Test updates

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots/Videos

Add screenshots or videos if applicable.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Build succeeds locally
- [ ] Lint checks pass

## Related Issues

Closes #(issue number)

## Additional Notes

Any additional information or context about the PR.
`;
  }

  // Workflow orchestration methods
  async newFeatureWorkflow() {
    this.info('🚀 Starting new feature workflow...');
    await this.createFeatureBranch();
    this.info('📝 Feature branch created. Start coding!');
    this.info('💡 When ready, use: npm run git:pr-ready');
  }

  async hotfixWorkflow() {
    this.info('🔥 Starting hotfix workflow...');
    await this.createHotfixBranch();
    this.info('🔧 Hotfix branch created. Fix the issue and test thoroughly!');
    this.info('💡 When ready, use: npm run git:pr-ready');
  }

  async releaseWorkflow() {
    this.info('📦 Starting release workflow...');
    
    const version = await this.prompt('Enter version number (e.g., 1.2.0):');
    if (!version.trim()) {
      this.error('Version number is required');
      return;
    }

    const mainBranch = this.getMainBranch();
    
    // Create release branch
    const releaseBranch = `release/${version}`;
    this.execute(`git checkout ${mainBranch}`);
    this.execute(`git pull origin ${mainBranch}`);
    this.execute(`git checkout -b ${releaseBranch}`);
    
    this.success(`Created release branch: ${releaseBranch}`);
    this.info('📋 Complete your release checklist:');
    this.log('1. Update version numbers', 'cyan');
    this.log('2. Update CHANGELOG.md', 'cyan');
    this.log('3. Run full test suite', 'cyan');
    this.log('4. Create PR to main branch', 'cyan');
    this.log('5. After merge, tag the release', 'cyan');
  }

  // Main command dispatcher
  async run() {
    const command = process.argv[2];
    
    if (!command) {
      this.showHelp();
      return;
    }

    switch (command) {
      case 'sync':
        await this.sync();
        break;
      case 'smart-commit':
        await this.smartCommit();
        break;
      case 'create-feature':
        await this.createFeatureBranch();
        break;
      case 'create-hotfix':
        await this.createHotfixBranch();
        break;
      case 'cleanup':
        this.cleanup();
        break;
      case 'validate-commit':
        this.validateCommit();
        break;
      case 'pr-ready':
        await this.prReady();
        break;
      case 'new-feature-workflow':
        await this.newFeatureWorkflow();
        break;
      case 'hotfix-workflow':
        await this.hotfixWorkflow();
        break;
      case 'release-workflow':
        await this.releaseWorkflow();
        break;
      default:
        this.error(`Unknown command: ${command}`);
        this.showHelp();
    }
  }

  showHelp() {
    this.log('\n📋 Git Workflow Helper Commands\n', 'bright');
    
    this.log('Basic Git Operations:', 'cyan');
    this.log('  sync              - Sync current branch with remote');
    this.log('  smart-commit      - Interactive commit with validation');
    this.log('  cleanup           - Clean up merged branches');
    this.log('  validate-commit   - Run pre-commit validation');
    this.log('  pr-ready          - Prepare branch for pull request\n');
    
    this.log('Branch Management:', 'cyan');
    this.log('  create-feature    - Create new feature branch');
    this.log('  create-hotfix     - Create hotfix branch\n');
    
    this.log('Workflows:', 'cyan');
    this.log('  new-feature-workflow  - Complete new feature setup');
    this.log('  hotfix-workflow      - Complete hotfix setup');
    this.log('  release-workflow     - Complete release setup\n');
    
    this.log('Quick Commands (npm scripts):', 'yellow');
    this.log('  npm run git:status        - Show git status');
    this.log('  npm run git:sync          - Sync branch');
    this.log('  npm run git:smart-commit  - Smart commit');
    this.log('  npm run git:pr-ready      - Prepare for PR');
    this.log('  npm run workflow:new-feature - Start new feature\n');
  }
}

// Run the helper
if (require.main === module) {
  const helper = new GitWorkflowHelper();
  helper.run().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = GitWorkflowHelper;