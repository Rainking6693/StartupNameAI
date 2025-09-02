#!/bin/bash

# StartupNamer.org - Netlify Mirror Environment Setup Script
# This script exactly mirrors Netlify's deployment environment

set -euo pipefail

echo "🚀 Setting up StartupNamer.org Netlify Mirror Environment..."

# Set exact Netlify versions
NODE_VERSION="18.19.1"
NPM_VERSION="10.2.4"

echo "📋 Environment Configuration:"
echo "  Node.js: $NODE_VERSION"
echo "  npm: $NPM_VERSION"
echo "  Architecture: $(uname -m)"
echo "  OS: $(uname -s)"

# Verify Node.js version
CURRENT_NODE=$(node --version | sed 's/v//')
if [ "$CURRENT_NODE" != "$NODE_VERSION" ]; then
    echo "⚠️  WARNING: Node.js version mismatch!"
    echo "   Expected: $NODE_VERSION"
    echo "   Current:  $CURRENT_NODE"
fi

# Update npm to exact Netlify version
echo "📦 Installing npm $NPM_VERSION..."
npm install -g npm@$NPM_VERSION

# Install Netlify CLI for local development
echo "🌐 Installing Netlify CLI..."
npm install -g netlify-cli@latest

# Install global development tools
echo "🔧 Installing development tools..."
npm install -g concurrently@latest
npm install -g lighthouse@latest
npm install -g html-validate@latest

# Set up workspace permissions
echo "🔒 Setting up workspace permissions..."
sudo chown -R node:node /workspace
chmod +x /workspace/scripts/*.sh 2>/dev/null || true

# Install project dependencies with exact Netlify flags
echo "📥 Installing project dependencies..."
cd /workspace

# Root dependencies
npm install --legacy-peer-deps --no-audit --no-fund

# Client dependencies
if [ -d "client" ]; then
    cd client
    npm install --legacy-peer-deps --no-audit --no-fund
    cd ..
fi

# Server dependencies  
if [ -d "server" ]; then
    cd server
    npm install --legacy-peer-deps --no-audit --no-fund
    cd ..
fi

# Create build cache directories
echo "📁 Creating build cache directories..."
mkdir -p /workspace/.cache/netlify
mkdir -p /workspace/.cache/npm
mkdir -p /workspace/.cache/terser-webpack-plugin

# Set npm cache directory
npm config set cache /workspace/.cache/npm

# Verify installation
echo "✅ Verifying installation..."
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  Netlify CLI: $(netlify --version)"

# Create environment info file
cat > /workspace/.devcontainer/environment-info.json << EOF
{
  "created": "$(date -Iseconds)",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "netlify_cli": "$(netlify --version)",
  "architecture": "$(uname -m)",
  "os": "$(uname -s)",
  "working_directory": "/workspace",
  "cache_directories": [
    "/workspace/.cache/netlify",
    "/workspace/.cache/npm", 
    "/workspace/.cache/terser-webpack-plugin"
  ]
}
EOF

echo "🎉 Environment setup complete!"
echo "🏁 Ready for StartupNamer.org development and deployment testing!"
echo ""
echo "🔍 Available commands:"
echo "  npm run dev:netlify     - Start Netlify dev server"
echo "  npm run test:netlify    - Test Netlify build locally"
echo "  npm run cache:bust      - Clear all caches and rebuild"
echo "  npm run deploy:test     - Test isolated deployment"
echo ""