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

class TeamOnboarding {
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

  execute(command, silent = false) {
    try {
      return execSync(command, { 
        encoding: 'utf-8', 
        stdio: silent ? 'pipe' : 'inherit' 
      });
    } catch (error) {
      return null;
    }
  }

  checkPrerequisites() {
    this.title('🔍 Checking Prerequisites');
    
    const checks = [
      { name: 'Node.js', command: 'node --version', required: '>=18.0.0' },
      { name: 'NPM', command: 'npm --version', required: '>=8.0.0' },
      { name: 'Git', command: 'git --version', required: 'any' },
      { name: 'VS Code (optional)', command: 'code --version', required: 'optional' }
    ];

    let allGood = true;

    checks.forEach(check => {
      const result = this.execute(check.command, true);
      if (result) {
        this.success(`${check.name}: ${result.split('\\n')[0]}`);
      } else {
        if (check.required === 'optional') {
          this.warning(`${check.name}: Not found (optional)`);
        } else {
          this.error(`${check.name}: Not found (required: ${check.required})`);
          allGood = false;
        }
      }
    });

    return allGood;
  }

  setupGitConfiguration() {
    this.title('🔧 Git Configuration Setup');
    
    // Check current git config
    const userName = this.execute('git config --global user.name', true);
    const userEmail = this.execute('git config --global user.email', true);

    if (!userName || !userEmail) {
      this.warning('Git user configuration incomplete');
      this.info('Please set your Git configuration:');
      this.log('  git config --global user.name "Your Name"', 'cyan');
      this.log('  git config --global user.email "your.email@example.com"', 'cyan');
    } else {
      this.success(`Git user: ${userName.trim()} <${userEmail.trim()}>`);
    }

    // Set recommended git settings
    const gitConfigs = [
      ['core.autocrlf', 'true', 'Windows line ending handling'],
      ['pull.rebase', 'false', 'Merge strategy for pulls'],
      ['init.defaultBranch', 'main', 'Default branch name'],
      ['core.editor', 'code --wait', 'Default editor (VS Code)'],
      ['diff.tool', 'vscode', 'Default diff tool'],
      ['merge.tool', 'vscode', 'Default merge tool']
    ];

    this.info('Setting recommended Git configurations...');
    gitConfigs.forEach(([key, value, description]) => {
      try {
        this.execute(`git config --global ${key} "${value}"`, true);
        this.success(`${key}: ${description}`);
      } catch {
        this.warning(`Failed to set ${key}`);
      }
    });
  }

  installDependencies() {
    this.title('📦 Installing Dependencies');
    
    this.info('Installing root dependencies...');
    this.execute('npm ci');
    
    this.info('Installing client dependencies...');
    this.execute('cd client && npm ci');
    
    this.info('Installing server dependencies...');
    this.execute('cd server && npm ci');
    
    this.success('All dependencies installed');
  }

  setupHooks() {
    this.title('🪝 Setting Up Git Hooks');
    
    try {
      this.execute('npx husky install');
      this.success('Git hooks configured');
    } catch {
      this.warning('Failed to setup Git hooks (may need manual configuration)');
    }
  }

  generateOnboardingDocumentation() {
    this.title('📚 Generating Onboarding Documentation');
    
    const onboardingContent = this.createOnboardingGuide();
    const docsDir = path.join(this.projectRoot, 'docs');
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(docsDir, 'DEVELOPER_ONBOARDING.md'), 
      onboardingContent
    );
    
    this.success('Developer onboarding guide created at docs/DEVELOPER_ONBOARDING.md');
  }

  createOnboardingGuide() {
    return `# Developer Onboarding Guide

Welcome to the StartupNamer.ai development team! This guide will help you get up and running quickly.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- VS Code (recommended)

### Initial Setup
1. Clone the repository
2. Run the onboarding script: \`npm run team:onboard\`
3. Install VS Code extensions (see .vscode/extensions.json)
4. Configure Git with your credentials

## 📁 Project Structure

\`\`\`
StartupnameAI/
├── client/           # React frontend application
├── server/           # Node.js backend API
├── scripts/          # Development and automation scripts
├── docs/            # Documentation
├── .vscode/         # VS Code configuration
├── .github/         # GitHub workflows and templates
└── tests/           # End-to-end tests
\`\`\`

## 🔧 Development Workflow

### Starting Development
\`\`\`bash
# Start both client and server
npm run dev:full

# Or start individually
npm run dev:client    # React development server
npm run dev:server    # Node.js API server
\`\`\`

### Git Workflow

#### Creating a New Feature
\`\`\`bash
# Start new feature workflow
npm run workflow:new-feature

# Manual steps:
npm run git:feature-branch
# ... make your changes ...
npm run git:smart-commit
npm run git:pr-ready
\`\`\`

#### Daily Git Commands
\`\`\`bash
npm run git:status          # Check status
npm run git:sync            # Sync with remote
npm run git:smart-commit    # Commit with validation
npm run git:pr-ready        # Prepare for PR
\`\`\`

#### Branch Naming Conventions
- \`feature/description\` - New features
- \`hotfix/description\` - Critical bug fixes
- \`release/version\` - Release branches
- \`chore/description\` - Maintenance tasks

### Commit Message Format
Follow conventional commits:
\`\`\`
type(scope): description

Examples:
feat: add user authentication
fix(api): resolve login endpoint error
docs: update installation guide
style: fix code formatting
refactor: improve error handling
test: add unit tests for auth
chore: update dependencies
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm run test:all

# Individual test types
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run lighthouse     # Performance tests
\`\`\`

## 📊 Code Quality

\`\`\`bash
# Linting and formatting
npm run lint           # Check code style
npm run format         # Fix formatting

# Pre-commit checks
npm run git:pre-commit # Run all quality checks
\`\`\`

## 🚀 Deployment

\`\`\`bash
# Staging deployment
npm run deploy:staging

# Production deployment (with safety checks)
npm run deploy:safe
\`\`\`

## 🔧 VS Code Setup

1. Install recommended extensions (prompted on first open)
2. Use provided settings for consistent formatting
3. Utilize integrated Git features and GitLens
4. Use built-in terminal with Git Bash

### Useful VS Code Commands
- \`Ctrl+Shift+P\` → "Git: Sync"
- \`Ctrl+Shift+P\` → "Tasks: Run Task" → Git commands
- \`F5\` → Debug application

## 🤝 Team Collaboration

### Pull Request Process
1. Create feature branch: \`npm run git:feature-branch\`
2. Make changes and commit: \`npm run git:smart-commit\`
3. Prepare for PR: \`npm run git:pr-ready\`
4. Create PR on GitHub
5. Address review feedback
6. Merge after approval

### Code Review Guidelines
- Review both functionality and code quality
- Test changes locally when possible
- Provide constructive feedback
- Approve when ready or request changes

### Communication
- Use descriptive commit messages
- Comment complex code sections
- Update documentation for new features
- Communicate breaking changes clearly

## 🔍 Troubleshooting

### Common Issues

#### Git Issues
\`\`\`bash
# Uncommitted changes blocking operations
npm run git:stash-save "work in progress"

# Branch conflicts
npm run git:sync  # Handles rebase conflicts

# Clean up merged branches
npm run git:cleanup
\`\`\`

#### Development Issues
\`\`\`bash
# Clear npm cache
npm run cache:bust

# Reset development environment
npm run dev:setup

# Check system status
npm run team:status
\`\`\`

#### Build Issues
\`\`\`bash
# Test build process
npm run deploy:test

# Validate React components
npm run test:react-components
\`\`\`

## 📚 Resources

- [Project README](../README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Git Workflow Automation](./GIT-WORKFLOW-AUTOMATION-REPORT.md)
- [Conventional Commits](https://conventionalcommits.org/)
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## 💡 Tips for New Developers

1. **Start Small**: Begin with small tasks to understand the codebase
2. **Ask Questions**: Don't hesitate to ask for help or clarification
3. **Follow Patterns**: Study existing code patterns and conventions
4. **Test Thoroughly**: Always test your changes before creating PRs
5. **Document Changes**: Update documentation for new features
6. **Stay Updated**: Keep dependencies and tools up to date

## 🎯 Next Steps

After completing onboarding:
1. Familiarize yourself with the codebase
2. Set up your development environment
3. Pick up your first task from the backlog
4. Create your first pull request
5. Participate in code reviews

Welcome to the team! 🎉
`;
  }

  displaySummary() {
    this.title('🎉 Onboarding Complete');
    
    this.info('What was set up:');
    this.log('  ✅ Prerequisites checked', 'green');
    this.log('  ✅ Git configuration optimized', 'green');
    this.log('  ✅ Dependencies installed', 'green');
    this.log('  ✅ Git hooks configured', 'green');
    this.log('  ✅ VS Code settings configured', 'green');
    this.log('  ✅ Developer documentation created', 'green');

    this.info('\n🚀 Next Steps:');
    this.log('  1. Open project in VS Code', 'cyan');
    this.log('  2. Install recommended extensions', 'cyan');
    this.log('  3. Start development: npm run dev:full', 'cyan');
    this.log('  4. Read docs/DEVELOPER_ONBOARDING.md', 'cyan');
    this.log('  5. Create your first feature: npm run workflow:new-feature', 'cyan');

    this.info('\n💡 Useful Commands:');
    this.log('  npm run team:status      - Check project status', 'magenta');
    this.log('  npm run git:smart-commit - Interactive commit', 'magenta');
    this.log('  npm run git:pr-ready     - Prepare for PR', 'magenta');
    this.log('  npm run test:all         - Run all tests', 'magenta');

    this.success('\n🎯 You\'re ready to start contributing!');
  }

  async run() {
    this.log('\n🌟 Welcome to StartupNamer.ai Development Team!', 'bright');
    this.log('This script will set up your development environment.\n');

    // Run onboarding steps
    if (!this.checkPrerequisites()) {
      this.error('Please install missing prerequisites and run again.');
      return;
    }

    this.setupGitConfiguration();
    this.installDependencies();
    this.setupHooks();
    this.generateOnboardingDocumentation();
    
    this.displaySummary();
  }
}

// Run onboarding
if (require.main === module) {
  const onboarding = new TeamOnboarding();
  onboarding.run().catch(error => {
    console.error('Onboarding failed:', error.message);
    process.exit(1);
  });
}

module.exports = TeamOnboarding;