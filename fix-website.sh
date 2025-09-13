#!/bin/bash

echo "🔧 FIXING STARTUPNAMER.ORG WEBSITE"
echo "=================================="

# Navigate to client directory
cd client

echo "📦 Running fixed build process..."
node build-fixed.js

echo "🚀 Deploying to Netlify..."
netlify deploy --dir=build --prod

echo "✅ Website fix complete!"
echo "🌐 Check: https://startupnamer.org"