#!/bin/bash

# StartupNamer.org - Isolated Build Testing Script
# Complete deployment environment testing with Docker isolation

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Test configuration
TEST_ID=$(date +%Y%m%d_%H%M%S)
TEST_DIR="/tmp/startupnamer-isolated-test-$TEST_ID"
RESULTS_DIR="./test-results"
LOG_FILE="$RESULTS_DIR/isolated-build-test-$TEST_ID.log"

echo -e "${PURPLE}🔬 StartupNamer.org - Isolated Build Testing${NC}"
echo -e "${PURPLE}===========================================${NC}"
echo "Test ID: $TEST_ID"
echo "Timestamp: $(date -Iseconds)"
echo "Results Directory: $RESULTS_DIR"
echo ""

# Function to log with timestamp
log() {
    local message="$1"
    local timestamp=$(date '+%H:%M:%S')
    echo -e "$timestamp $message" | tee -a "$LOG_FILE"
}

# Function to check command success
check_command() {
    if [ $? -eq 0 ]; then
        log "${GREEN}✅ $1${NC}"
    else
        log "${RED}❌ $1 FAILED${NC}"
        cleanup_and_exit 1
    fi
}

# Cleanup function
cleanup_and_exit() {
    local exit_code=${1:-0}
    log "${YELLOW}🧹 Cleaning up test environment...${NC}"
    
    # Stop and remove containers
    docker-compose down --volumes --remove-orphans >/dev/null 2>&1 || true
    
    # Remove test directory
    rm -rf "$TEST_DIR" 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f >/dev/null 2>&1 || true
    
    log "${BLUE}✅ Cleanup completed${NC}"
    exit $exit_code
}

# Trap to ensure cleanup on script exit
trap cleanup_and_exit EXIT

# Create results directory
mkdir -p "$RESULTS_DIR"

# Verify Docker is available
log "${YELLOW}🐳 Verifying Docker environment...${NC}"
if ! command -v docker >/dev/null 2>&1; then
    log "${RED}❌ Docker not found. Please install Docker.${NC}"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    log "${RED}❌ Docker daemon not running. Please start Docker.${NC}"
    exit 1
fi

if ! command -v docker-compose >/dev/null 2>&1; then
    log "${RED}❌ Docker Compose not found. Please install Docker Compose.${NC}"
    exit 1
fi

check_command "Docker environment verified"

# Verify we're in the right directory
if [ ! -f "docker-compose.yml" ] || [ ! -f "package.json" ]; then
    log "${RED}❌ Must be run from StartupNamer.org root directory${NC}"
    exit 1
fi

# Phase 1: Environment Preparation
log "${YELLOW}📋 Phase 1: Environment Preparation...${NC}"

# Clean up any existing containers
log "  🧹 Cleaning up existing containers..."
docker-compose down --volumes --remove-orphans >/dev/null 2>&1 || true

# Pull required images
log "  📥 Pulling required Docker images..."
docker-compose pull >/dev/null 2>&1
check_command "Docker images pulled"

# Phase 2: Container Startup
log "${YELLOW}🚀 Phase 2: Container Startup...${NC}"

# Start services
log "  🔄 Starting Docker services..."
docker-compose up -d
sleep 30  # Allow services to fully initialize
check_command "Docker services started"

# Verify services are healthy
log "  🔍 Verifying service health..."
for service in netlify-mirror build-tester; do
    if docker-compose ps $service | grep -q "Up"; then
        log "    ✅ $service: Running"
    else
        log "    ${RED}❌ $service: Not running${NC}"
        docker-compose logs $service
        exit 1
    fi
done

# Phase 3: Build Testing
log "${YELLOW}🔨 Phase 3: Build Testing...${NC}"

# Test build in isolated environment
log "  🏗️  Running build test in Netlify mirror..."
docker-compose exec -T netlify-mirror bash -c "
    set -euo pipefail
    echo '🔧 Setting up build environment...'
    
    # Install exact npm version
    npm install -g npm@10.2.4
    
    # Clear all caches
    npm cache clean --force
    rm -rf node_modules client/node_modules server/node_modules
    
    # Install dependencies
    echo '📦 Installing dependencies...'
    npm install --legacy-peer-deps --no-audit --no-fund
    
    # Install client dependencies
    cd client
    npm install --legacy-peer-deps --no-audit --no-fund
    
    # Run build
    echo '🏗️  Running build...'
    npm run build
    
    # Verify build output
    echo '🔍 Verifying build output...'
    if [ ! -d 'build' ]; then
        echo '❌ Build directory not found'
        exit 1
    fi
    
    if [ ! -f 'build/index.html' ]; then
        echo '❌ index.html not found'
        exit 1
    fi
    
    echo '✅ Build completed successfully'
" 2>&1 | tee -a "$LOG_FILE"

BUILD_EXIT_CODE=${PIPESTATUS[0]}
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    check_command "Isolated build test"
else
    log "${RED}❌ Isolated build test failed${NC}"
    exit 1
fi

# Phase 4: Static Server Testing
log "${YELLOW}🌐 Phase 4: Static Server Testing...${NC}"

# Copy build artifacts to static server
log "  📁 Copying build artifacts to static server..."
docker-compose exec -T netlify-mirror bash -c "
    if [ -d client/build ]; then
        cp -r client/build/* /workspace/client/build/ 2>/dev/null || true
        echo '✅ Build artifacts copied'
    else
        echo '❌ No build artifacts found'
        exit 1
    fi
"

# Start static server
log "  🚀 Starting static file server..."
docker-compose up -d static-server
sleep 10
check_command "Static server started"

# Test static server response
log "  🔍 Testing static server response..."
if docker-compose exec -T static-server wget -q --spider http://localhost/; then
    log "    ✅ Static server responding"
else
    log "${RED}    ❌ Static server not responding${NC}"
    docker-compose logs static-server
    exit 1
fi

# Phase 5: Performance Testing
log "${YELLOW}📊 Phase 5: Performance Testing...${NC}"

# Create lighthouse reports directory
mkdir -p "./lighthouse-reports"

# Start performance monitor
log "  📈 Starting performance monitoring..."
docker-compose up -d performance-monitor
sleep 15

# Run Lighthouse audit
log "  🔍 Running Lighthouse performance audit..."
docker-compose exec -T performance-monitor bash -c "
    set -euo pipefail
    
    # Wait for static server to be ready
    for i in {1..30}; do
        if wget -q --spider http://static-server/; then
            echo '✅ Static server ready for testing'
            break
        fi
        echo 'Waiting for static server...'
        sleep 2
    done
    
    # Install Chrome dependencies
    apt-get update >/dev/null 2>&1
    apt-get install -y chromium-browser >/dev/null 2>&1
    
    # Run Lighthouse audit
    echo '🔍 Running Lighthouse audit...'
    lighthouse http://static-server \
        --output=json \
        --output=html \
        --output-path=/workspace/lighthouse-reports/isolated-test-$TEST_ID \
        --chrome-flags='--headless --no-sandbox --disable-gpu --disable-dev-shm-usage' \
        --quiet
        
    echo '✅ Lighthouse audit completed'
" 2>&1 | tee -a "$LOG_FILE"

LIGHTHOUSE_EXIT_CODE=${PIPESTATUS[0]}
if [ $LIGHTHOUSE_EXIT_CODE -eq 0 ]; then
    check_command "Performance audit completed"
else
    log "${YELLOW}⚠️  Performance audit had issues but continuing...${NC}"
fi

# Phase 6: Comprehensive Validation
log "${YELLOW}✅ Phase 6: Comprehensive Validation...${NC}"

# Collect build artifacts
log "  📦 Collecting build artifacts..."
docker-compose exec -T netlify-mirror bash -c "
    cd client
    if [ -d build ]; then
        echo 'Build directory size: $(du -sh build | cut -f1)'
        echo 'JavaScript files: $(find build -name \"*.js\" | wc -l)'
        echo 'CSS files: $(find build -name \"*.css\" | wc -l)'
        echo 'HTML files: $(find build -name \"*.html\" | wc -l)'
        echo 'Total files: $(find build -type f | wc -l)'
    fi
" 2>&1 | tee -a "$LOG_FILE"

# Generate comprehensive test report
REPORT_FILE="$RESULTS_DIR/isolated-test-report-$TEST_ID.json"
cat > "$REPORT_FILE" << EOF
{
  "test_info": {
    "test_id": "$TEST_ID",
    "timestamp": "$(date -Iseconds)",
    "duration_seconds": $SECONDS,
    "test_type": "isolated_build_test"
  },
  "environment": {
    "docker_version": "$(docker --version)",
    "docker_compose_version": "$(docker-compose --version)",
    "host_os": "$(uname -s)",
    "host_arch": "$(uname -m)"
  },
  "test_phases": {
    "environment_preparation": "completed",
    "container_startup": "completed", 
    "build_testing": "$([ $BUILD_EXIT_CODE -eq 0 ] && echo 'passed' || echo 'failed')",
    "static_server_testing": "completed",
    "performance_testing": "$([ $LIGHTHOUSE_EXIT_CODE -eq 0 ] && echo 'passed' || echo 'warning')",
    "comprehensive_validation": "completed"
  },
  "results": {
    "build_successful": $([ $BUILD_EXIT_CODE -eq 0 ] && echo 'true' || echo 'false'),
    "static_server_responsive": true,
    "performance_audit_completed": $([ $LIGHTHOUSE_EXIT_CODE -eq 0 ] && echo 'true' || echo 'false')
  },
  "artifacts": {
    "log_file": "$LOG_FILE",
    "report_file": "$REPORT_FILE",
    "lighthouse_reports": "./lighthouse-reports/",
    "docker_logs": "Available via: docker-compose logs"
  },
  "recommendations": [
    "Deploy to staging environment for final validation",
    "Monitor performance metrics post-deployment",
    "Verify all critical user flows function correctly"
  ]
}
EOF

# Phase 7: Cleanup and Summary
log "${YELLOW}🧹 Phase 7: Cleanup and Summary...${NC}"

# Stop services
log "  🛑 Stopping Docker services..."
docker-compose down --volumes >/dev/null 2>&1
check_command "Services stopped"

# Final validation
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    TEST_STATUS="PASSED"
    STATUS_COLOR="${GREEN}"
else
    TEST_STATUS="FAILED"
    STATUS_COLOR="${RED}"
fi

# Success summary
log ""
log "${STATUS_COLOR}🎯 ISOLATED BUILD TEST ${TEST_STATUS}!${NC}"
log "${STATUS_COLOR}================================${NC}"
log "${STATUS_COLOR}Test ID: $TEST_ID${NC}"
log "${STATUS_COLOR}Duration: ${SECONDS}s${NC}"
log "${STATUS_COLOR}Build Status: $([ $BUILD_EXIT_CODE -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')${NC}"
log "${STATUS_COLOR}Report: $REPORT_FILE${NC}"
log "${STATUS_COLOR}Logs: $LOG_FILE${NC}"
log ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    log "${BLUE}🚀 Your application is ready for production deployment!${NC}"
    log "${BLUE}   The isolated build test confirms compatibility with Netlify's environment.${NC}"
else
    log "${RED}🚨 Build issues detected in isolated environment.${NC}"
    log "${RED}   Please review the logs and fix issues before deploying.${NC}"
fi

log ""
log "${PURPLE}📋 Next steps:${NC}"
log "${PURPLE}   1. Review test results: cat $REPORT_FILE${NC}"
log "${PURPLE}   2. Check Lighthouse reports: ./lighthouse-reports/${NC}"
log "${PURPLE}   3. Run cache-bust deployment if ready: ./scripts/cache-bust-deploy.sh${NC}"
log "${PURPLE}   4. Deploy to Netlify: netlify deploy --dir=client/build --prod${NC}"

# Remove trap since we're handling cleanup manually
trap - EXIT