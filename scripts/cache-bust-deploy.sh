#!/bin/bash

# StartupNamer.org - Cache-Busting Deployment Protocol
# Systematic cache busting for problematic builds with enterprise reliability

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Generate unique build identifier
BUILD_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BUILD_UUID=$(uuidgen 2>/dev/null || echo "$(date +%s)_$(shuf -i 1000-9999 -n 1)" 2>/dev/null || echo "$(date +%s)_1234")
CACHE_BUST_ID="cb_${BUILD_TIMESTAMP}_${BUILD_UUID:0:8}"

echo -e "${PURPLE}💥 StartupNamer.org - Cache-Busting Deployment Protocol${NC}"
echo -e "${PURPLE}=====================================================${NC}"
echo "Cache-Bust ID: $CACHE_BUST_ID"
echo "Timestamp: $(date -Iseconds)"
echo "Working Directory: $(pwd)"
echo ""

# Function to log with timestamp
log() {
    echo -e "$(date '+%H:%M:%S') $1"
}

# Function to check command success
check_command() {
    if [ $? -eq 0 ]; then
        log "${GREEN}✅ $1${NC}"
    else
        log "${RED}❌ $1 FAILED${NC}"
        exit 1
    fi
}

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ]; then
    log "${RED}❌ Must be run from StartupNamer.org root directory${NC}"
    exit 1
fi

# Pre-deployment validation
log "${YELLOW}🔍 Running pre-deployment validation...${NC}"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    log "${YELLOW}⚠️  Working directory has uncommitted changes${NC}"
    git status --short
    echo ""
    read -p "Continue with uncommitted changes? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "${BLUE}ℹ️  Deployment cancelled${NC}"
        exit 0
    fi
fi

# Create backup branch
BACKUP_BRANCH="backup-before-cache-bust-${BUILD_TIMESTAMP}"
log "${YELLOW}💾 Creating backup branch: $BACKUP_BRANCH${NC}"
git checkout -b "$BACKUP_BRANCH" >/dev/null 2>&1 || true
git checkout - >/dev/null 2>&1
check_command "Backup branch created"

# Phase 1: Nuclear Cache Clearing
log "${YELLOW}💥 Phase 1: Nuclear Cache Clearing...${NC}"

# Clear npm caches
log "  🗑️  Clearing npm cache..."
npm cache clean --force
check_command "npm cache cleared"

# Clear yarn cache if it exists
if command -v yarn >/dev/null 2>&1; then
    log "  🗑️  Clearing yarn cache..."
    yarn cache clean --force >/dev/null 2>&1 || true
fi

# Remove all node_modules
log "  🗑️  Removing all node_modules..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
rm -rf node_modules client/node_modules server/node_modules
check_command "node_modules removed"

# Clear build artifacts
log "  🗑️  Clearing build artifacts..."
rm -rf client/build client/.cache client/dist
rm -rf server/build server/.cache server/dist  
rm -rf .cache dist build
check_command "Build artifacts cleared"

# Clear package-lock files for fresh resolution
log "  🗑️  Clearing lock files for fresh resolution..."
rm -f package-lock.json client/package-lock.json server/package-lock.json
rm -f yarn.lock client/yarn.lock server/yarn.lock
check_command "Lock files cleared"

# Clear system temp directories
log "  🗑️  Clearing system temp directories..."
rm -rf /tmp/npm-* 2>/dev/null || true
rm -rf /tmp/yarn-* 2>/dev/null || true
rm -rf ~/.npm/_cacache 2>/dev/null || true

# Phase 2: Version Bumping
log "${YELLOW}📈 Phase 2: Version Bumping...${NC}"

# Update version in package.json files
update_version() {
    local file="$1"
    if [ -f "$file" ]; then
        # Get current version
        CURRENT_VERSION=$(node -p "require('./$file').version" 2>/dev/null || echo "1.0.0")
        
        # Increment patch version
        IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
        major=${version_parts[0]:-1}
        minor=${version_parts[1]:-0}  
        patch=${version_parts[2]:-0}
        new_patch=$((patch + 1))
        NEW_VERSION="$major.$minor.$new_patch"
        
        # Update version with cache-bust metadata
        CACHE_BUST_VERSION="$NEW_VERSION-cache-bust-$BUILD_TIMESTAMP"
        
        # Use node to update version safely
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$file', 'utf8'));
        pkg.version = '$CACHE_BUST_VERSION';
        pkg.cacheBustId = '$CACHE_BUST_ID';
        pkg.cacheBustTimestamp = '$(date -Iseconds)';
        fs.writeFileSync('$file', JSON.stringify(pkg, null, 2) + '\n');
        "
        
        log "  📦 Updated $file: $CURRENT_VERSION → $CACHE_BUST_VERSION"
    fi
}

update_version "package.json"
update_version "client/package.json" 
update_version "server/package.json"

check_command "Version bumping completed"

# Phase 3: Environment Reset
log "${YELLOW}🔄 Phase 3: Environment Reset...${NC}"

# Unset potentially problematic environment variables
unset NODE_ENV
unset CI
unset GENERATE_SOURCEMAP

# Set clean environment for build
export NODE_OPTIONS="--max_old_space_size=4096"
export NPM_CONFIG_AUDIT="false"
export NPM_CONFIG_FUND="false"

log "  🌍 Environment variables reset"

# Phase 4: Fresh Dependency Installation  
log "${YELLOW}📦 Phase 4: Fresh Dependency Installation...${NC}"

# Install root dependencies
log "  📥 Installing root dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund --verbose
check_command "Root dependencies installed"

# Install client dependencies
log "  📥 Installing client dependencies..."
cd client
npm install --legacy-peer-deps --no-audit --no-fund --verbose
check_command "Client dependencies installed"
cd ..

# Install server dependencies if they exist
if [ -d "server" ] && [ -f "server/package.json" ]; then
    log "  📥 Installing server dependencies..."
    cd server
    npm install --legacy-peer-deps --no-audit --no-fund --verbose
    check_command "Server dependencies installed"
    cd ..
fi

# Phase 5: Build Verification
log "${YELLOW}🔨 Phase 5: Build Verification...${NC}"

# Test build process
log "  🏗️  Testing build process..."
cd client
npm run build
BUILD_SUCCESS=$?
cd ..

if [ $BUILD_SUCCESS -eq 0 ]; then
    check_command "Build verification successful"
else
    log "${RED}❌ Build failed - investigating...${NC}"
    
    # Diagnostic information
    log "${YELLOW}🔍 Build diagnostic information:${NC}"
    log "  Node.js version: $(node --version)"
    log "  npm version: $(npm --version)"
    log "  Working directory: $(pwd)"
    log "  Client directory exists: $([ -d client ] && echo 'yes' || echo 'no')"
    log "  Client package.json exists: $([ -f client/package.json ] && echo 'yes' || echo 'no')"
    
    # Show last few lines of build output for debugging
    if [ -f client/npm-debug.log ]; then
        log "  Last build errors:"
        tail -20 client/npm-debug.log | sed 's/^/    /'
    fi
    
    exit 1
fi

# Phase 6: Deployment Metadata Generation
log "${YELLOW}📋 Phase 6: Deployment Metadata Generation...${NC}"

# Generate deployment manifest
MANIFEST_FILE="deployment-manifest-${CACHE_BUST_ID}.json"
cat > "$MANIFEST_FILE" << EOF
{
  "deployment": {
    "cache_bust_id": "$CACHE_BUST_ID",
    "timestamp": "$(date -Iseconds)",
    "build_timestamp": "$BUILD_TIMESTAMP",
    "uuid": "$BUILD_UUID"
  },
  "environment": {
    "node_version": "$(node --version)",
    "npm_version": "$(npm --version)",
    "platform": "$(uname -s)",
    "architecture": "$(uname -m)"
  },
  "actions_performed": {
    "cache_cleared": true,
    "node_modules_removed": true,
    "lock_files_reset": true,
    "versions_bumped": true,
    "dependencies_reinstalled": true,
    "build_verified": true
  },
  "artifacts": {
    "backup_branch": "$BACKUP_BRANCH",
    "manifest_file": "$MANIFEST_FILE",
    "build_directory": "client/build"
  },
  "git_info": {
    "current_branch": "$(git branch --show-current)",
    "commit_hash": "$(git rev-parse HEAD)",
    "commit_message": "$(git log -1 --pretty=format:'%s')"
  }
}
EOF

log "  📄 Deployment manifest created: $MANIFEST_FILE"

# Phase 7: Git Commit with Cache-Bust Metadata
log "${YELLOW}📝 Phase 7: Git Commit with Cache-Bust Metadata...${NC}"

# Add all changes
git add .

# Create descriptive commit message
COMMIT_MSG="💥 CACHE-BUST DEPLOYMENT: $CACHE_BUST_ID

🔄 Cache-busting deployment protocol executed
⏰ Timestamp: $(date -Iseconds)
🆔 Cache-Bust ID: $CACHE_BUST_ID
🏗️  Build verified: SUCCESS
💾 Backup branch: $BACKUP_BRANCH

Actions performed:
- Nuclear cache clearing (npm, node_modules, build artifacts)
- Version bumping with cache-bust metadata
- Fresh dependency installation with --legacy-peer-deps
- Complete build verification
- Deployment manifest generation

This deployment includes systematic cache busting to ensure 
reliable builds and prevent deployment failures.

Generated with StartupNamer.org Deployment Protocol v2.0"

# Commit changes
git commit -m "$COMMIT_MSG"
check_command "Cache-bust commit created"

# Phase 8: Final Validation
log "${YELLOW}✅ Phase 8: Final Validation...${NC}"

# Verify build artifacts exist
if [ ! -d "client/build" ]; then
    log "${RED}❌ Build directory missing${NC}"
    exit 1
fi

# Check critical files
CRITICAL_FILES=("client/build/index.html" "client/build/static")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        log "  ✅ Verified: $file"
    else
        log "${RED}❌ Missing critical file: $file${NC}"
        exit 1
    fi
done

# Get final build size
BUILD_SIZE=$(du -sh client/build | cut -f1)

# Success summary
log ""
log "${GREEN}🎉 CACHE-BUST DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
log "${GREEN}===============================================${NC}"
log "${GREEN}Cache-Bust ID: $CACHE_BUST_ID${NC}"
log "${GREEN}Build Size: $BUILD_SIZE${NC}"
log "${GREEN}Backup Branch: $BACKUP_BRANCH${NC}"
log "${GREEN}Manifest File: $MANIFEST_FILE${NC}"
log ""
log "${BLUE}🚀 Ready for deployment!${NC}"
log "${BLUE}   Netlify: netlify deploy --dir=client/build --prod${NC}"
log "${BLUE}   Manual:  Upload client/build directory${NC}"
log ""
log "${PURPLE}📋 Post-deployment checklist:${NC}"
log "${PURPLE}   □ Verify deployment succeeded${NC}"
log "${PURPLE}   □ Test critical application functionality${NC}"
log "${PURPLE}   □ Monitor for any cache-related issues${NC}"
log "${PURPLE}   □ Clean up backup branch after verification${NC}"
log ""
log "${YELLOW}💡 If deployment fails, restore from backup branch:${NC}"
log "${YELLOW}   git checkout $BACKUP_BRANCH${NC}"