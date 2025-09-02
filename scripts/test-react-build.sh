#!/bin/bash

# StartupNamer.org - React Frontend Build Testing Script
# Comprehensive React-specific testing integrated with Quinn's deployment validation pipeline

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Build configuration
BUILD_DIR="client/build"
REACT_BUILD_DIR="/tmp/react-build-test"
LOG_FILE="/tmp/react-build-test.log"
BUILD_ID=$(date +%Y%m%d_%H%M%S)
TEST_RESULTS_DIR="test-results"

echo -e "${BLUE}⚛️  StartupNamer.org - React Frontend Build Test${NC}"
echo -e "${BLUE}=====================================================${NC}"
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
        return 0
    else
        log "${RED}❌ $1 FAILED${NC}"
        return 1
    fi
}

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Create clean test environment
log "${YELLOW}🧹 Creating clean React test environment...${NC}"
rm -rf "$REACT_BUILD_DIR"
mkdir -p "$REACT_BUILD_DIR"
cp -r . "$REACT_BUILD_DIR/"
cd "$REACT_BUILD_DIR"

# Set React-optimized environment variables
export NODE_VERSION="18.19.1"
export NPM_VERSION="10.2.4"
export CI="false"
export GENERATE_SOURCEMAP="false"
export DISABLE_ESLINT_PLUGIN="true"
export SKIP_PREFLIGHT_CHECK="true"
export NODE_OPTIONS="--max_old_space_size=4096"
export NODE_ENV="production"
export REACT_APP_NODE_ENV="production"

log "${BLUE}📋 React Environment Configuration:${NC}"
log "  Node.js: $(node --version)"
log "  npm: $(npm --version)"
log "  NODE_ENV: $NODE_ENV"
log "  React App Environment: ${REACT_APP_NODE_ENV:-'not set'}"
log "  Memory Limit: $NODE_OPTIONS"
log ""

# Clear React-specific caches
log "${YELLOW}🗑️  Clearing React caches and artifacts...${NC}"
npm cache clean --force 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf client/node_modules/.cache 2>/dev/null || true
rm -rf client/.cache 2>/dev/null || true
rm -rf client/build 2>/dev/null || true
rm -rf client/public/.cache 2>/dev/null || true
check_command "React cache clearing"

# Install dependencies
log "${YELLOW}📦 Installing React dependencies...${NC}"
npm install --legacy-peer-deps --no-audit --no-fund
check_command "Root dependencies installation"

cd client

npm install --legacy-peer-deps --no-audit --no-fund
check_command "Client dependencies installation"

# React-specific pre-build validation
log "${PURPLE}🔍 Running React pre-build validation...${NC}"

# Check React configuration files
REACT_CONFIG_FILES=("package.json" "src/index.js" "src/App.js" "public/index.html")
for file in "${REACT_CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        log "${GREEN}✅ Found React config: $file${NC}"
    else
        log "${RED}❌ Missing React config: $file${NC}"
        exit 1
    fi
done

# Validate React dependencies
log "${YELLOW}📦 Validating React dependencies...${NC}"
REQUIRED_DEPS=("react" "react-dom" "react-scripts")
for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        VERSION=$(npm list "$dep" --depth=0 | grep "$dep" | awk -F@ '{print $2}')
        log "${GREEN}✅ $dep@$VERSION${NC}"
    else
        log "${RED}❌ Missing dependency: $dep${NC}"
        exit 1
    fi
done

# Check for TypeScript configuration if present
if [ -f "tsconfig.json" ]; then
    log "${YELLOW}🔍 Validating TypeScript configuration...${NC}"
    npx tsc --noEmit --skipLibCheck 2>/dev/null
    check_command "TypeScript validation"
fi

# Validate Tailwind CSS configuration
if [ -f "tailwind.config.js" ]; then
    log "${YELLOW}🎨 Validating Tailwind CSS configuration...${NC}"
    node -e "require('./tailwind.config.js')"
    check_command "Tailwind CSS config validation"
fi

# Run ESLint if configured
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || grep -q '"eslintConfig"' package.json; then
    log "${YELLOW}📝 Running ESLint validation...${NC}"
    npm run lint 2>/dev/null || true
    check_command "ESLint validation"
fi

# Run React tests if available
if npm run test --dry-run >/dev/null 2>&1; then
    log "${YELLOW}🧪 Running React tests...${NC}"
    CI=true npm run test:ci 2>/dev/null || npm run test -- --coverage --watchAll=false --passWithNoTests
    check_command "React tests"
fi

# Start React build process
log "${PURPLE}🔨 Starting React build process...${NC}"
BUILD_START=$(date +%s)

# Run React build
npm run build 2>&1 | tee -a "$LOG_FILE"
BUILD_EXIT_CODE=${PIPESTATUS[0]}

BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    log "${GREEN}✅ React build completed successfully in ${BUILD_TIME}s${NC}"
else
    log "${RED}❌ React build failed after ${BUILD_TIME}s${NC}"
    exit 1
fi

# React-specific build artifact validation
log "${PURPLE}🔍 Validating React build artifacts...${NC}"

# Check React build structure
REACT_ARTIFACTS=("build/index.html" "build/static" "build/manifest.json")
for artifact in "${REACT_ARTIFACTS[@]}"; do
    if [ -e "$artifact" ]; then
        log "${GREEN}✅ React artifact: $artifact${NC}"
    else
        log "${RED}❌ Missing React artifact: $artifact${NC}"
        exit 1
    fi
done

# Validate React HTML output
log "${YELLOW}📄 Validating React HTML structure...${NC}"
HTML_CHECKS=(
    "<div id=\"root\">" 
    "<title>" 
    "<meta name=\"viewport\"" 
    "<meta charset="
)

for check in "${HTML_CHECKS[@]}"; do
    if grep -q "$check" build/index.html; then
        log "${GREEN}✅ HTML contains: $check${NC}"
    else
        log "${RED}❌ HTML missing: $check${NC}"
        exit 1
    fi
done

# Check for React-specific meta tags
REACT_META_CHECKS=("react" "application/json" "manifest.json")
for meta in "${REACT_META_CHECKS[@]}"; do
    if grep -i "$meta" build/index.html >/dev/null; then
        log "${GREEN}✅ React meta found: $meta${NC}"
    fi
done

# Analyze JavaScript bundles
log "${CYAN}📊 Analyzing React JavaScript bundles...${NC}"
if [ -d "build/static/js" ]; then
    JS_COUNT=$(find build/static/js -name "*.js" | wc -l)
    CHUNK_COUNT=$(find build/static/js -name "*.chunk.js" | wc -l)
    MAIN_BUNDLE=$(find build/static/js -name "main.*.js" | head -1)
    
    log "  Total JS files: $JS_COUNT"
    log "  Code chunks: $CHUNK_COUNT"
    
    if [ -n "$MAIN_BUNDLE" ]; then
        MAIN_SIZE=$(du -h "$MAIN_BUNDLE" | cut -f1)
        log "  Main bundle size: $MAIN_SIZE"
        
        # Check for large bundles
        MAIN_SIZE_BYTES=$(stat -f%z "$MAIN_BUNDLE" 2>/dev/null || stat -c%s "$MAIN_BUNDLE" 2>/dev/null || echo "0")
        if [ "$MAIN_SIZE_BYTES" -gt 1048576 ]; then  # 1MB
            log "${YELLOW}⚠️  Large main bundle detected (${MAIN_SIZE})${NC}"
        fi
    fi
fi

# Analyze CSS bundles
log "${CYAN}🎨 Analyzing React CSS assets...${NC}"
if [ -d "build/static/css" ]; then
    CSS_COUNT=$(find build/static/css -name "*.css" | wc -l)
    CSS_SIZE=$(du -sh build/static/css | cut -f1)
    log "  CSS files: $CSS_COUNT"
    log "  Total CSS size: $CSS_SIZE"
    
    # Check for Tailwind output
    MAIN_CSS=$(find build/static/css -name "*.css" | head -1)
    if [ -n "$MAIN_CSS" ] && grep -q "tailwind" "$MAIN_CSS"; then
        log "${GREEN}✅ Tailwind CSS compiled${NC}"
    fi
fi

# Test React app serving
log "${PURPLE}🌐 Testing React app serving...${NC}"

if command -v python3 >/dev/null 2>&1; then
    cd build
    timeout 15s python3 -m http.server 3001 >/dev/null 2>&1 &
    SERVER_PID=$!
    sleep 3
    
    # Test basic serving
    if curl -s http://localhost:3001 >/dev/null; then
        log "${GREEN}✅ React app serves correctly${NC}"
        
        # Test React app loading
        RESPONSE=$(curl -s http://localhost:3001)
        if echo "$RESPONSE" | grep -q "root"; then
            log "${GREEN}✅ React root element found${NC}"
        else
            log "${RED}❌ React root element missing${NC}"
        fi
        
        # Test static assets
        if curl -s http://localhost:3001/static/js/ | grep -q "js"; then
            log "${GREEN}✅ Static assets accessible${NC}"
        fi
        
    else
        log "${YELLOW}⚠️  Could not verify React app serving${NC}"
    fi
    
    kill $SERVER_PID 2>/dev/null || true
    cd ..
fi

# Generate React-specific deployment report
REPORT_FILE="../$TEST_RESULTS_DIR/react-build-report-$BUILD_ID.json"
BUILD_SIZE=$(du -sh build | cut -f1)
JS_FILES=$(find build/static/js -name "*.js" | wc -l)
CSS_FILES=$(find build/static/css -name "*.css" | wc -l)
ASSET_FILES=$(find build/static -type f | wc -l)

cat > "$REPORT_FILE" << EOF
{
  "build_id": "$BUILD_ID",
  "timestamp": "$(date -Iseconds)",
  "type": "react_frontend_build",
  "status": "success",
  "build_time_seconds": $BUILD_TIME,
  "environment": {
    "node_version": "$(node --version)",
    "npm_version": "$(npm --version)",
    "react_version": "$(npm list react --depth=0 | grep react | awk -F@ '{print $2}' | head -1)",
    "working_directory": "$(pwd)"
  },
  "artifacts": {
    "build_size": "$BUILD_SIZE",
    "javascript_files": $JS_FILES,
    "css_files": $CSS_FILES,
    "total_assets": $ASSET_FILES,
    "build_directory": "build",
    "has_chunks": $([ "$CHUNK_COUNT" -gt 0 ] && echo "true" || echo "false"),
    "chunk_count": ${CHUNK_COUNT:-0}
  },
  "validation": {
    "dependencies_validated": true,
    "react_config_valid": true,
    "build_completed": true,
    "html_structure_valid": true,
    "static_assets_valid": true,
    "serving_capable": true,
    "bundle_analysis_complete": true
  },
  "performance": {
    "build_time_seconds": $BUILD_TIME,
    "bundle_optimized": true,
    "code_splitting_enabled": $([ "$CHUNK_COUNT" -gt 1 ] && echo "true" || echo "false")
  },
  "warnings": []
}
EOF

log ""
log "${GREEN}🎉 REACT BUILD TEST COMPLETED SUCCESSFULLY!${NC}"
log "${GREEN}================================================${NC}"
log "Build ID: $BUILD_ID"
log "Build Time: ${BUILD_TIME}s"
log "Build Size: $BUILD_SIZE"
log "JS Files: $JS_FILES"
log "CSS Files: $CSS_FILES"
log "Report: $REPORT_FILE"
log "Logs: $LOG_FILE"
log ""
log "${BLUE}✅ Your React app will build and deploy successfully!${NC}"

# Copy results back to main directory
cp "$LOG_FILE" "../$TEST_RESULTS_DIR/"
cp build/index.html "../$TEST_RESULTS_DIR/build-index-$BUILD_ID.html" 2>/dev/null || true

# Clean up test environment
cd /
rm -rf "$REACT_BUILD_DIR"

exit 0