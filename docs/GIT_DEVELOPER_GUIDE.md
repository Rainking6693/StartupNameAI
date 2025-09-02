# Git Developer Guide for StartupNamer.ai

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Git Workflow Overview](#git-workflow-overview)
3. [Branch Strategy](#branch-strategy)
4. [Commit Guidelines](#commit-guidelines)
5. [Daily Workflow Commands](#daily-workflow-commands)
6. [Advanced Git Operations](#advanced-git-operations)
7. [Troubleshooting](#troubleshooting)
8. [Team Collaboration](#team-collaboration)
9. [VS Code Integration](#vs-code-integration)
10. [Best Practices](#best-practices)

---

## 🚀 Quick Start

### New Developer Setup
```bash
# Run the onboarding script
npm run team:onboard

# Check project status
npm run team:status

# Start development
npm run dev:full
```

### Essential Daily Commands
```bash
npm run git:status          # Check repository status
npm run git:sync            # Sync with remote
npm run git:smart-commit    # Interactive commit
npm run git:pr-ready        # Prepare for pull request
```

---

## 🔄 Git Workflow Overview

Our Git workflow is designed to maximize productivity while maintaining code quality. Here's how it works:

### 1. Feature Development Flow
```
main/master → feature/your-feature → Pull Request → main/master
```

### 2. Hotfix Flow  
```
main/master → hotfix/critical-fix → Pull Request → main/master
```

### 3. Release Flow
```
main/master → release/v1.2.0 → Pull Request → main/master → Tag
```

---

## 🌿 Branch Strategy

### Branch Naming Conventions

#### Feature Branches
```bash
feature/user-authentication
feature/payment-integration
feature/dashboard-redesign
```

#### Hotfix Branches
```bash
hotfix/security-vulnerability
hotfix/critical-payment-bug
hotfix/production-crash
```

#### Release Branches
```bash
release/v1.0.0
release/v2.1.0
release/v1.5.2
```

#### Other Branches
```bash
chore/dependency-updates
docs/api-documentation
refactor/code-cleanup
```

### Branch Lifecycle

1. **Create**: `npm run git:feature-branch`
2. **Develop**: Make changes, commit regularly
3. **Sync**: `npm run git:sync` (rebase on main)
4. **Prepare**: `npm run git:pr-ready`
5. **Review**: Create pull request
6. **Merge**: After approval
7. **Cleanup**: `npm run git:cleanup`

---

## 💬 Commit Guidelines

### Conventional Commits Format
```
<type>(<scope>): <description>

<body>

<footer>
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code changes that neither fix bugs nor add features
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples

#### Good Commits
```bash
feat: add user authentication with JWT
fix(api): resolve login endpoint timeout issue
docs: update installation guide with Docker steps
style: fix ESLint formatting issues
refactor: improve error handling in payment service
test: add unit tests for user registration
chore: update dependencies to latest versions
perf: optimize database queries for user dashboard
```

#### Bad Commits
```bash
# Too vague
fix: bug fix
update: changes

# Too long
feat: add user authentication system with JWT tokens, password hashing, email verification, and session management including refresh tokens

# Wrong format
Add new feature
Fixed the bug
```

### Commit Body Guidelines
```bash
feat: add user authentication

- Implement JWT-based authentication
- Add password hashing with bcrypt
- Create login/logout endpoints
- Include session management

Closes #123
```

---

## ⚡ Daily Workflow Commands

### Quick Status Checks
```bash
# Quick overview
npm run git:status

# Detailed project health
npm run team:status

# View recent commits
npm run git:log

# Check current branch
npm run git:current
```

### Branch Operations
```bash
# List all branches
npm run git:branches

# Create feature branch
npm run git:feature-branch

# Create hotfix branch
npm run git:hotfix-branch

# Sync current branch
npm run git:sync
```

### Commit Operations
```bash
# Interactive smart commit
npm run git:smart-commit

# Quick commit with validation
npm run git:pre-commit

# Safe push (with pre-commit checks)
npm run git:safe-push

# Amend last commit
npm run git:amend
```

### Stash Operations
```bash
# Save work in progress
npm run git:stash-save "work on feature X"

# Apply latest stash
npm run git:stash-pop

# List all stashes
npm run git:stash-list
```

### Diff Operations
```bash
# View unstaged changes
npm run git:diff

# View staged changes
npm run git:diff-staged
```

### Undo Operations
```bash
# Undo last commit (keep changes)
npm run git:uncommit

# Unstage all files
npm run git:unstage

# Discard all changes
npm run git:discard
```

---

## 🔧 Advanced Git Operations

### Interactive Rebase
```bash
# Clean up commit history
npm run git:rebase-interactive

# Manual rebase
git rebase -i HEAD~3
```

### Merge Strategies
```bash
# Merge main into current branch
npm run git:merge-main

# Manual merge with strategy
git merge main --no-ff
git merge main --squash
```

### Cherry Picking
```bash
# Pick specific commit
git cherry-pick <commit-hash>

# Pick multiple commits
git cherry-pick <commit1>..<commit2>
```

### Advanced Diff
```bash
# Compare branches
git diff main..feature/branch-name

# Compare specific files
git diff HEAD~1 HEAD -- src/components/Auth.js

# Word-level diff
git diff --word-diff
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Merge Conflicts
```bash
# When merge conflicts occur during sync
1. git status  # See conflicted files
2. # Edit files to resolve conflicts
3. git add .
4. git rebase --continue
# or
git merge --continue
```

#### Uncommitted Changes Blocking Operations
```bash
# Stash and continue
npm run git:stash-save "temporary work"
# ... perform operation ...
npm run git:stash-pop
```

#### Accidental Commits
```bash
# Undo last commit but keep changes
npm run git:uncommit

# Completely remove last commit
git reset --hard HEAD~1  # ⚠️ DESTRUCTIVE
```

#### Wrong Branch
```bash
# Move recent commits to correct branch
git log --oneline -5  # Find commit hashes
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1  # Remove from wrong branch
```

#### Diverged Branches
```bash
# When local and remote have diverged
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

#### Large File Issues
```bash
# Remove large file from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large/file' \
  --prune-empty --tag-name-filter cat -- --all
```

### Emergency Procedures

#### Broken Main Branch
```bash
# Revert problematic commit
git revert <commit-hash>
git push origin main
```

#### Lost Work Recovery
```bash
# Find lost commits
git reflog

# Recover lost commit
git checkout <commit-hash>
git checkout -b recovered-work
```

---

## 🤝 Team Collaboration

### Pull Request Process

1. **Prepare Branch**
   ```bash
   npm run git:pr-ready
   ```

2. **Create PR**
   - Use GitHub interface
   - Fill out PR template
   - Add reviewers and labels

3. **Address Feedback**
   ```bash
   # Make changes
   npm run git:smart-commit
   git push origin feature/branch-name
   ```

4. **Merge**
   - Use "Squash and merge" for feature branches
   - Use "Create merge commit" for releases

### Code Review Guidelines

#### As a Reviewer
- **Functionality**: Does it work as intended?
- **Code Quality**: Is it readable and maintainable?
- **Tests**: Are there adequate tests?
- **Performance**: Any performance implications?
- **Security**: Any security concerns?

#### Review Commands
```bash
# Checkout PR locally
gh pr checkout <PR-number>

# Test the changes
npm run test:all
npm run lint
```

### Conflict Resolution

#### Merge Conflicts
1. **Prevention**: Sync regularly with `npm run git:sync`
2. **Resolution**: 
   - Use VS Code's merge editor
   - Test after resolution
   - Commit with clear message

#### Communication
- Use clear commit messages
- Document breaking changes
- Update relevant documentation
- Communicate with team about conflicts

---

## 🎨 VS Code Integration

### Essential Extensions
Install these extensions for optimal Git experience:
- GitLens
- Git Graph  
- Git History
- GitHub Pull Requests

### Useful VS Code Commands
```
Ctrl+Shift+P → "Git: Sync"
Ctrl+Shift+P → "Git: Create Branch"
Ctrl+Shift+P → "Git: Merge Branch"
Ctrl+Shift+G → Open Source Control panel
F5 → Start debugging with Git integration
```

### VS Code Tasks
Use built-in tasks (Ctrl+Shift+P → "Tasks: Run Task"):
- Git: Quick Status
- Git: Smart Commit
- Git: Sync Branch
- Git: Create Feature Branch

### GitLens Features
- Inline blame annotations
- Repository overview
- Commit details on hover
- Branch comparison views

---

## ✨ Best Practices

### Commit Best Practices

1. **Commit Often**: Small, logical commits
2. **Clear Messages**: Follow conventional commits
3. **Test Before Commit**: Run `npm run git:pre-commit`
4. **Single Purpose**: One feature/fix per commit
5. **Complete Thoughts**: Don't commit half-done work

### Branch Best Practices

1. **Short-lived**: Keep feature branches small
2. **Up-to-date**: Sync regularly with main
3. **Descriptive Names**: Clear purpose in name
4. **Clean History**: Use interactive rebase
5. **Delete Merged**: Clean up with `npm run git:cleanup`

### Team Best Practices

1. **Communication**: Discuss major changes
2. **Code Review**: Always get reviews
3. **Documentation**: Update docs with features
4. **Testing**: Write tests for new code
5. **Standards**: Follow project conventions

### Performance Best Practices

1. **Avoid Large Files**: Use Git LFS if needed
2. **Clean History**: Don't keep unnecessary commits
3. **Ignore Generated**: Use comprehensive .gitignore
4. **Shallow Clones**: For CI/CD environments
5. **Regular Cleanup**: Remove old branches

---

## 🔗 Quick Reference

### Daily Workflow Cheat Sheet
```bash
# Start day
npm run git:sync

# Create feature
npm run workflow:new-feature

# Regular commits
npm run git:smart-commit

# End of feature
npm run git:pr-ready

# Cleanup
npm run git:cleanup
```

### Emergency Commands
```bash
# Undo last commit
npm run git:uncommit

# Discard all changes
npm run git:discard

# Stash everything
npm run git:stash-save "emergency backup"

# Check project health
npm run team:status
```

### Useful Aliases
Add these to your global git config:
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

---

## 📚 Additional Resources

- [Conventional Commits Specification](https://conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [VS Code Git Documentation](https://code.visualstudio.com/docs/editor/versioncontrol)

---

## 🎯 Getting Help

### Internal Resources
```bash
# Project status and health
npm run team:status

# Git workflow helper
node scripts/git-workflow-helper.js --help

# Team onboarding
npm run team:onboard
```

### Community Support
- **Stack Overflow**: [git] tag
- **GitHub Discussions**: Project discussions
- **Team Chat**: Internal communication
- **Documentation**: Check docs/ directory

---

*This guide is part of the StartupNamer.ai development workflow. For questions or improvements, please create an issue or pull request.*