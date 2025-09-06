#!/usr/bin/env python3
"""
Junior News Digest - Automation Startup Script
==============================================

Starts the complete automated editorial system that runs 24/7
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def install_dependencies():
    """Install required Python packages"""
    required_packages = ['schedule', 'sqlite3']
    
    for package in required_packages:
        try:
            __import__(package)
            logger.info(f"✅ {package} already installed")
        except ImportError:
            logger.info(f"📦 Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

def start_automation():
    """Start the automated editorial system"""
    logger.info("🚀 Starting Junior News Digest Automated Editorial System...")
    logger.info("📰 Editorial Portal: https://ornate-crumble-ffc133.netlify.app/")
    logger.info("📅 Your Schedule: Every Sunday 8:00 PM - Review and approve stories")
    logger.info("🤖 System Schedule:")
    logger.info("   • Sunday 9:00 AM - Generate 15-20 candidate stories")
    logger.info("   • Sunday 10:00 PM - Process your approved stories")
    logger.info("   • Monday 8:00 AM - Publish story #1")
    logger.info("   • Wednesday 8:00 AM - Publish story #2")
    logger.info("   • Friday 8:00 AM - Publish story #3")
    logger.info("")
    logger.info("🔄 System will run continuously in the background...")
    logger.info("Press Ctrl+C to stop the system")
    logger.info("=" * 60)
    
    # Import and run the automation system
    try:
        from automated_editorial_system import run_automation_system
        run_automation_system()
    except Exception as e:
        logger.error(f"Error starting automation system: {e}")
        sys.exit(1)

if __name__ == '__main__':
    try:
        # Install dependencies
        install_dependencies()
        
        # Start the automation system
        start_automation()
        
    except KeyboardInterrupt:
        logger.info("\n👋 Automation system stopped by user")
    except Exception as e:
        logger.error(f"Startup error: {e}")
        sys.exit(1)
