#!/bin/bash
# deployment-info.sh - Essential deployment information and validation

echo "📋 StartupNamer.ai Deployment Information"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Show project info
echo "📦 Project: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "🏷️  Version: $(grep '"version"' package.json | cut -d'"' -f4)"
echo "📁 Current directory: $(pwd)"
echo ""

echo "🔧 Available Commands:"
echo "--------------------"
echo "npm run build        - Build the application"
echo "npm test             - Run tests"
echo "npm run lint         - Run linting"
echo "npm run serve        - Serve built files locally"
echo "npm run dev:client   - Start development server"
echo ""

echo "🚀 Deployment Commands:"
echo "----------------------"
echo "npm run deploy:staging    - Deploy to staging"
echo "npm run deploy:production - Deploy to production"
echo ""

# Check build status
if [ -d "client/build" ]; then
    BUILD_SIZE=$(du -sh client/build | cut -f1)
    echo "📦 Last build size: $BUILD_SIZE"
    echo "📅 Last build: $(stat -c %y client/build 2>/dev/null || stat -f %Sm client/build)"
else
    echo "⚠️  No build directory found. Run 'npm run build' first."
fi

echo ""
echo "✅ Deployment Info Complete"