#!/bin/bash

echo "🧹 Cleaning up unnecessary files..."

# Remove common temporary and cache files
find . -name "*.log" -delete
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove node_modules and package-lock.json (will be reinstalled)
rm -rf app/node_modules
rm -f app/package-lock.json

# Remove Expo cache
rm -rf app/.expo

# Remove Python cache
rm -rf backend/__pycache__
find backend -name "*.pyc" -delete

# Remove test files we don't need
rm -f app/test_start.js
rm -f app/test_expo.js

# Remove old start scripts (keep the good ones)
rm -f app/start_app.sh

echo "✅ Cleanup complete!"
echo "📦 Run 'npm install' in the app directory to reinstall dependencies"
