#!/bin/bash

# Quick Netlify Deployment Fix Script
echo "🚨 QUICK NETLIFY DEPLOYMENT FIX"
echo "================================"

# Check if we have Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Set the auth token
export NETLIFY_AUTH_TOKEN="nfp_TqZCh5N6X1PvH5BBBAHbJUonTa1u3Czk8186"

echo "🔍 Checking Netlify status..."
netlify status

echo "📋 Listing recent deploys..."
netlify deploy:list --limit=5

echo "📊 Checking site info..."
netlify sites:list

echo "🔧 Attempting to clear cache and redeploy..."
echo "Go to your Netlify dashboard and:"
echo "1. Click 'Site Settings'"
echo "2. Go to 'Build & Deploy'"
echo "3. Click 'Clear cache and deploy site'"

echo "💡 Manual deploy test:"
echo "cd client && npm run build && netlify deploy --dir=build --prod"

echo "✅ Quick fix script complete!"
echo "Check the output above for any error messages."