#!/bin/bash

echo "🚀 Starting Junior News Digest App..."
echo "=================================="

# Clear caches
echo "🧹 Clearing caches..."
rm -rf node_modules/.cache
rm -rf .expo
npm cache clean --force

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the app
echo "🎯 Starting Expo development server..."
npx expo start --clear --port 8081

echo "✅ App should be running at http://localhost:8081"
echo "📱 Scan the QR code with Expo Go app on your phone"
