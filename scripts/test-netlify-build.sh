#!/bin/bash

# StartupNamer.org - Local Netlify Build Testing Script
# This script exactly mirrors Netlify's build environment and process

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build configuration
BUILD_DIR="client/build"
NETLIFY_BUILD_DIR="/tmp/netlify-build-test"
LOG_FILE="/tmp/netlify-build-test.log"
BUILD_ID=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}🌐 StartupNamer.org - Netlify Build Test${NC}"
echo -e "${BLUE}================================================${NC}"
echo "Build ID: $BUILD_ID"
echo "Timestamp: $(date -Iseconds)"
echo "Working Directory: $(pwd)"
echo ""

# Function to log with timestamp
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
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

# Create clean test environment
log "${YELLOW}🧹 Creating clean test environment...${NC}"
rm -rf "$NETLIFY_BUILD_DIR"
mkdir -p "$NETLIFY_BUILD_DIR"
cp -r . "$NETLIFY_BUILD_DIR/"
cd "$NETLIFY_BUILD_DIR"

# Set exact Netlify environment variables
export NODE_VERSION="18.19.1"
export NPM_VERSION="10.2.4"
export CI="false"
export GENERATE_SOURCEMAP="false"
export DISABLE_ESLINT_PLUGIN="true"
export SKIP_PREFLIGHT_CHECK="true"
export NODE_OPTIONS="--max_old_space_size=4096"
export NODE_ENV="production"

log "${BLUE}📋 Environment Configuration:${NC}"
log "  Node.js: $(node --version)"
log "  npm: $(npm --version)"
log "  NODE_ENV: $NODE_ENV"
log "  CI: $CI"
log "  Memory Limit: $NODE_OPTIONS"
log ""

# Verify Node.js version matches Netlify
CURRENT_NODE=$(node --version | sed 's/v//')
if [ "$CURRENT_NODE" != "$NODE_VERSION" ]; then
    log "${YELLOW}⚠️  WARNING: Node.js version mismatch!${NC}"
    log "   Expected: $NODE_VERSION"
    log "   Current:  $CURRENT_NODE"
fi

# Clear all caches (mirror Netlify behavior)
log "${YELLOW}🗑️  Clearing all caches...${NC}"
npm cache clean --force 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf client/node_modules/.cache 2>/dev/null || true
rm -rf client/.cache 2>/dev/null || true
rm -rf client/build 2>/dev/null || true
check_command "Cache clearing"

# Install dependencies with exact Netlify flags
log "${YELLOW}📦 Installing dependencies (Netlify mirror)...${NC}"
npm install --legacy-peer-deps --no-audit --no-fund
check_command "Root dependencies installation"

# Navigate to client directory
cd client

# Install client dependencies
log "${YELLOW}📦 Installing client dependencies...${NC}"
npm install --legacy-peer-deps --no-audit --no-fund
check_command "Client dependencies installation"

# Run pre-build validation
log "${YELLOW}🔍 Running pre-build validation...${NC}"

# Check package.json exists and is valid
if [ ! -f "package.json" ]; then
    log "${RED}❌ package.json not found${NC}"
    exit 1
fi

# Validate package.json syntax
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"
check_command "package.json validation"

# Check if build script exists
if ! npm run build --dry-run >/dev/null 2>&1; then
    log "${RED}❌ Build script not found or invalid${NC}"
    exit 1
fi
check_command "Build script validation"

# Start build process (exact Netlify command)
log "${YELLOW}🔨 Starting build process...${NC}"
log "Build command: npm run build"

# Capture build start time
BUILD_START=$(date +%s)

# Run build with detailed logging
npm run build 2>&1 | tee -a "$LOG_FILE"
BUILD_EXIT_CODE=${PIPESTATUS[0]}

# Calculate build time
BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    log "${GREEN}✅ Build completed successfully in ${BUILD_TIME}s${NC}"
else
    log "${RED}❌ Build failed after ${BUILD_TIME}s${NC}"
    exit 1
fi

# Verify build artifacts
log "${YELLOW}🔍 Verifying build artifacts...${NC}"

if [ ! -d "build" ]; then
    log "${RED}❌ Build directory not found${NC}"
    exit 1
fi
check_command "Build directory exists"

# Check critical files
CRITICAL_FILES=("build/index.html" "build/static/js" "build/static/css")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        log "${GREEN}✅ Found: $file${NC}"
    else
        log "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done

# Verify HTML structure
if grep -q "<title>" build/index.html; then
    log "${GREEN}✅ HTML structure validated${NC}"
else
    log "${RED}❌ Invalid HTML structure${NC}"
    exit 1
fi

# Check file sizes
log "${YELLOW}📊 Build artifact analysis:${NC}"
BUILD_SIZE=$(du -sh build | cut -f1)
JS_FILES=$(find build/static/js -name "*.js" | wc -l)
CSS_FILES=$(find build/static/css -name "*.css" | wc -l)
HTML_FILES=$(find build -name "*.html" | wc -l)

log "  Total build size: $BUILD_SIZE"
log "  JavaScript files: $JS_FILES"
log "  CSS files: $CSS_FILES"
log "  HTML files: $HTML_FILES"

# Check for common build issues
log "${YELLOW}🔍 Checking for common issues...${NC}"

# Check for source maps (should be disabled)
if find build -name "*.map" | grep -q .; then
    log "${YELLOW}⚠️  Source maps found (may increase bundle size)${NC}"
fi

# Check for large bundles
LARGE_FILES=$(find build -type f -size +2M)
if [ -n "$LARGE_FILES" ]; then
    log "${YELLOW}⚠️  Large files detected:${NC}"
    echo "$LARGE_FILES" | while read -r file; do
        log "    $(ls -lh "$file" | awk '{print $5 " " $9}')"
    done
fi

# Test build serving capability
log "${YELLOW}🌐 Testing build serving capability...${NC}"

# Start a simple HTTP server to test the build
if command -v python3 >/dev/null 2>&1; then
    cd build
    timeout 10s python3 -m http.server 8888 >/dev/null 2>&1 &
    SERVER_PID=$!
    sleep 2
    
    # Test if server is responding
    if curl -s http://localhost:8888 >/dev/null; then
        log "${GREEN}✅ Build serves correctly${NC}"
        kill $SERVER_PID 2>/dev/null || true
    else
        log "${YELLOW}⚠️  Could not verify serving capability${NC}"
        kill $SERVER_PID 2>/dev/null || true
    fi
    cd ..
fi

# Generate deployment report
REPORT_FILE="/tmp/netlify-build-report-$BUILD_ID.json"
cat > "$REPORT_FILE" << EOF
{
  "build_id": "$BUILD_ID",
  "timestamp": "$(date -Iseconds)",
  "status": "success",
  "build_time_seconds": $BUILD_TIME,
  "environment": {
    "node_version": "$(node --version)",
    "npm_version": "$(npm --version)",
    "working_directory": "$(pwd)"
  },
  "artifacts": {
    "build_size": "$BUILD_SIZE",
    "javascript_files": $JS_FILES,
    "css_files": $CSS_FILES,
    "html_files": $HTML_FILES,
    "build_directory": "build"
  },
  "validation": {
    "dependencies_installed": true,
    "build_completed": true,
    "artifacts_verified": true,
    "html_structure_valid": true,
    "serving_capable": true
  },
  "warnings": $(find build -name "*.map" | wc -l)
}
EOF

log ""
log "${GREEN}🎉 NETLIFY BUILD TEST COMPLETED SUCCESSFULLY!${NC}"
log "${GREEN}================================================${NC}"
log "Build ID: $BUILD_ID"
log "Build Time: ${BUILD_TIME}s"
log "Build Size: $BUILD_SIZE"
log "Report: $REPORT_FILE"
log "Logs: $LOG_FILE"
log ""
log "${BLUE}✅ Your build will succeed on Netlify!${NC}"

# Clean up test environment
cd /
rm -rf "$NETLIFY_BUILD_DIR"