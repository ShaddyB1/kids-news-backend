#!/bin/bash

echo "🚀 Starting Junior News Digest App (Simple Mode)..."
echo "=================================================="

# Kill any existing processes
pkill -f "expo start" 2>/dev/null || true
sleep 2

# Clear caches
echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache

# Start the app
echo "🎯 Starting Expo development server..."
echo "📱 This will show the QR code and connection details"
echo ""

npx expo start --clear --port 8081 --host localhost
