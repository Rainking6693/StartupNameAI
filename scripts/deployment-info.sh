#!/bin/bash

# StartupNamer.org - Deployment Infrastructure Information Script
# Quick overview of the deployment validation infrastructure

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 StartupNamer.org - Deployment Infrastructure Overview${NC}"
echo -e "${PURPLE}====================================================${NC}"
echo ""

# System Information
echo -e "${BLUE}📋 System Information${NC}"
echo "  OS: $(uname -s) $(uname -r)"
echo "  Architecture: $(uname -m)"
echo "  Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "  npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "  Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo "  Docker Compose: $(docker-compose --version 2>/dev/null || echo 'Not installed')"
echo ""

# Netlify Configuration
echo -e "${BLUE}🌐 Netlify Configuration${NC}"
if [ -f "netlify.toml" ]; then
    echo "  ✅ netlify.toml found"
    echo "  Node Version: $(grep NODE_VERSION netlify.toml | cut -d'"' -f2 2>/dev/null || echo 'Not specified')"
    echo "  npm Version: $(grep NPM_VERSION netlify.toml | cut -d'"' -f2 2>/dev/null || echo 'Not specified')"
    echo "  Build Base: $(grep base netlify.toml | cut -d'"' -f2 2>/dev/null || echo 'Not specified')"
    echo "  Publish Directory: $(grep publish netlify.toml | cut -d'"' -f2 2>/dev/null || echo 'Not specified')"
else
    echo "  ❌ netlify.toml not found"
fi
echo ""

# Infrastructure Components
echo -e "${BLUE}🏗️  Infrastructure Components${NC}"

# DevContainer
if [ -f ".devcontainer/devcontainer.json" ]; then
    echo "  ✅ DevContainer Configuration"
    echo "    📁 .devcontainer/devcontainer.json"
    echo "    🔧 .devcontainer/setup.sh"
else
    echo "  ❌ DevContainer not configured"
fi

# Scripts
echo "  📜 Deployment Scripts:"
for script in "test-netlify-build.sh" "cache-bust-deploy.sh" "test-isolated-build.sh"; do
    if [ -f "scripts/$script" ]; then
        echo "    ✅ scripts/$script $([ -x "scripts/$script" ] && echo '(executable)' || echo '(not executable)')"
    else
        echo "    ❌ scripts/$script (missing)"
    fi
done

# Docker Configuration
if [ -f "docker-compose.yml" ]; then
    echo "  ✅ Docker Environment"
    echo "    🐳 docker-compose.yml"
    echo "    ⚙️  docker/nginx.conf"
    
    # Check if Docker is running
    if docker info >/dev/null 2>&1; then
        echo "    🟢 Docker daemon: Running"
        
        # Check running containers
        RUNNING_CONTAINERS=$(docker-compose ps --services --filter status=running 2>/dev/null || echo "")
        if [ -n "$RUNNING_CONTAINERS" ]; then
            echo "    📦 Running containers:"
            echo "$RUNNING_CONTAINERS" | while read -r container; do
                echo "      - $container"
            done
        else
            echo "    📦 No containers running"
        fi
    else
        echo "    🔴 Docker daemon: Not running"
    fi
else
    echo "  ❌ Docker environment not configured"
fi
echo ""

# Available Commands
echo -e "${BLUE}🎯 Available Commands${NC}"
echo "  Development:"
echo "    npm run dev:netlify           # Start Netlify dev server"
echo "    npm run env:setup             # Setup development environment"
echo ""
echo "  Testing & Validation:"
echo "    npm run test:netlify          # Test build in Netlify-like environment"
echo "    npm run deploy:test           # Test in Docker isolation"
echo "    npm run deploy:validate       # Run both tests"
echo ""
echo "  Cache Management:"
echo "    npm run cache:bust            # Nuclear cache clearing & rebuild"
echo ""
echo "  Deployment:"
echo "    npm run deploy:safe           # Safe deployment with validation"
echo "    npm run deployment:full-validation  # Complete validation pipeline"
echo ""
echo "  Docker Management:"
echo "    npm run docker:up             # Start Docker environment"
echo "    npm run docker:down           # Stop Docker environment"
echo "    npm run docker:logs           # View Docker logs"
echo "    npm run docker:clean          # Complete Docker cleanup"
echo ""

# Recent Test Results
echo -e "${BLUE}📊 Recent Activity${NC}"
if [ -d "test-results" ]; then
    RECENT_RESULTS=$(find test-results -name "*.json" -mtime -7 2>/dev/null | wc -l)
    echo "  📈 Test results (last 7 days): $RECENT_RESULTS"
    
    if [ $RECENT_RESULTS -gt 0 ]; then
        echo "  🏆 Recent tests:"
        find test-results -name "*.json" -mtime -7 2>/dev/null | head -3 | while read -r file; do
            echo "    - $(basename "$file")"
        done
    fi
else
    echo "  📈 No test results directory"
fi

if [ -d "lighthouse-reports" ]; then
    RECENT_LIGHTHOUSE=$(find lighthouse-reports -name "*.html" -mtime -7 2>/dev/null | wc -l)
    echo "  🔍 Lighthouse reports (last 7 days): $RECENT_LIGHTHOUSE"
else
    echo "  🔍 No Lighthouse reports directory"
fi
echo ""

# Health Check
echo -e "${BLUE}🏥 Health Check${NC}"

# Check critical files
CRITICAL_FILES=(
    "package.json"
    "client/package.json"
    "netlify.toml"
    ".devcontainer/devcontainer.json"
    "scripts/test-netlify-build.sh"
    "scripts/cache-bust-deploy.sh"
    "scripts/test-isolated-build.sh"
    "docker-compose.yml"
)

HEALTHY_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        ((HEALTHY_FILES++))
    fi
done

HEALTH_PERCENTAGE=$((HEALTHY_FILES * 100 / ${#CRITICAL_FILES[@]}))
echo "  🏥 Infrastructure Health: $HEALTH_PERCENTAGE% ($HEALTHY_FILES/${#CRITICAL_FILES[@]} components)"

if [ $HEALTH_PERCENTAGE -eq 100 ]; then
    echo -e "  ${GREEN}✅ All components healthy${NC}"
elif [ $HEALTH_PERCENTAGE -ge 80 ]; then
    echo -e "  ${YELLOW}⚠️  Minor issues detected${NC}"
else
    echo -e "  ${RED}❌ Significant issues detected${NC}"
fi
echo ""

# Quick Actions
echo -e "${BLUE}⚡ Quick Actions${NC}"
echo "  🧪 Test your build now:"
echo "    npm run test:netlify"
echo ""
echo "  🐳 Start Docker environment:"
echo "    npm run docker:up"
echo ""
echo "  💥 Having build issues? Try cache-busting:"
echo "    npm run cache:bust"
echo ""
echo "  📖 Read full documentation:"
echo "    cat DEPLOYMENT-VALIDATION-PROTOCOL.md"
echo ""

# Recommendations
echo -e "${BLUE}💡 Recommendations${NC}"
if ! command -v docker >/dev/null 2>&1; then
    echo "  🐳 Install Docker for complete testing capabilities"
fi

if [ ! -f ".devcontainer/devcontainer.json" ]; then
    echo "  📦 Set up DevContainer for consistent development environment"
fi

if [ $HEALTH_PERCENTAGE -lt 100 ]; then
    echo "  🔧 Fix missing components for optimal deployment validation"
fi

echo "  📊 Run regular validation: npm run deployment:full-validation"
echo "  🔄 Keep environment updated: npm run env:setup"
echo ""

echo -e "${GREEN}🎉 StartupNamer.org deployment infrastructure is ready!${NC}"
echo -e "${GREEN}For help: ./scripts/deployment-info.sh --help${NC}"