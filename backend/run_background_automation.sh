#!/bin/bash

# Junior News Digest - Background Automation Runner
# This script runs the automated editorial system in the background

echo "🚀 Starting Junior News Digest Automated Editorial System..."
echo "📰 Editorial Portal: https://ornate-crumble-ffc133.netlify.app/"
echo "📅 Your Schedule: Every Sunday 8:00 PM - Review and approve stories"
echo ""

# Navigate to the backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -f "../.venv/bin/activate" ]; then
    echo "🐍 Activating virtual environment..."
    source "../.venv/bin/activate"
fi

# Install required packages
echo "📦 Installing required packages..."
pip install schedule sqlite3 2>/dev/null || echo "Packages already installed"

# Run the automation system
echo "🔄 Starting automation system..."
python3 start_automation.py

echo "👋 Automation system stopped"
