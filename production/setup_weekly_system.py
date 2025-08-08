#!/usr/bin/env python3
"""
Setup script for Kids Daily News Weekly Automation System
Installs dependencies, configures environment, and sets up the system
"""

import subprocess
import sys
import os
from pathlib import Path

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing Python dependencies...")
    
    dependencies = [
        "schedule",
        "feedparser", 
        "python-dotenv",
        "requests",
        "pillow",
        "spotipy",  # Spotify API
        "openai",   # OpenAI API
    ]
    
    for package in dependencies:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")

def setup_directories():
    """Create initial directory structure"""
    print("📁 Setting up directory structure...")
    
    base_dir = Path("kids_news_content")
    directories = [
        base_dir / "archive",
        base_dir / "templates", 
        base_dir / "logs",
        Path("kids_news_app_fixed/assets/videos"),
        Path("kids_news_app_fixed/assets/audio"),
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f"📂 Created: {directory}")

def create_systemd_service():
    """Create systemd service for Linux deployment"""
    service_content = """
[Unit]
Description=Kids Daily News Weekly Automation
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/python3 weekly_content_system.py
Restart=always
RestartSec=10
Environment=PYTHONPATH=/path/to/your/project

[Install]
WantedBy=multi-user.target
"""
    
    with open("kids-news-automation.service", "w") as f:
        f.write(service_content)
    
    print("⚙️ Created systemd service file: kids-news-automation.service")
    print("   To install: sudo cp kids-news-automation.service /etc/systemd/system/")
    print("   To enable: sudo systemctl enable kids-news-automation")
    print("   To start: sudo systemctl start kids-news-automation")

def create_docker_config():
    """Create Docker configuration for easy deployment"""
    dockerfile_content = """
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p kids_news_content

# Expose port for web interface (if you build one)
EXPOSE 8000

# Run the automation system
CMD ["python", "weekly_content_system.py"]
"""
    
    requirements_content = """
schedule==1.2.0
feedparser==6.0.10
python-dotenv==1.0.0
requests==2.31.0
Pillow==10.0.0
spotipy==2.22.1
openai==0.28.1
sqlite3
smtplib
email
"""
    
    docker_compose_content = """
version: '3.8'

services:
  kids-news-automation:
    build: .
    environment:
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
      - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
      - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./kids_news_content:/app/kids_news_content
      - ./kids_news_app_fixed/assets:/app/kids_news_app_fixed/assets
    restart: unless-stopped
    
  # Optional: Add a web interface for admin selections
  admin-interface:
    build: ./admin_web
    ports:
      - "8080:80"
    depends_on:
      - kids-news-automation
"""
    
    with open("Dockerfile", "w") as f:
        f.write(dockerfile_content)
    
    with open("requirements.txt", "w") as f:
        f.write(requirements_content)
    
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_content)
    
    print("🐳 Created Docker configuration files")

def setup_cron_jobs():
    """Setup cron jobs as alternative to systemd"""
    cron_content = """
# Kids Daily News Weekly Automation
# Friday 6 PM: Curate stories
0 18 * * 5 cd /path/to/project && python3 weekly_content_system.py curate

# Monday 9 AM: Generate content  
0 9 * * 1 cd /path/to/project && python3 weekly_content_system.py generate

# Tuesday 8 AM: Deliver content
0 8 * * 2 cd /path/to/project && python3 weekly_content_system.py deliver

# Wednesday 8 AM: Deliver content
0 8 * * 3 cd /path/to/project && python3 weekly_content_system.py deliver

# Friday 8 AM: Deliver content
0 8 * * 5 cd /path/to/project && python3 weekly_content_system.py deliver

# Sunday 11 PM: Upload to Spotify and cleanup
0 23 * * 0 cd /path/to/project && python3 weekly_content_system.py spotify && python3 weekly_content_system.py cleanup
"""
    
    with open("kids_news_cron.txt", "w") as f:
        f.write(cron_content)
    
    print("⏰ Created cron job configuration: kids_news_cron.txt")
    print("   To install: crontab kids_news_cron.txt")

def main():
    print("🚀 Setting up Kids Daily News Weekly Automation System")
    print("=" * 60)
    
    install_dependencies()
    setup_directories()
    create_systemd_service()
    create_docker_config()
    setup_cron_jobs()
    
    print("\n" + "=" * 60)
    print("✅ Setup complete!")
    print("\nNext steps:")
    print("1. Copy weekly_system.env to .env and fill in your API keys")
    print("2. Choose deployment method:")
    print("   - Systemd: Use kids-news-automation.service")
    print("   - Docker: Run docker-compose up -d")
    print("   - Cron: Install cron jobs from kids_news_cron.txt")
    print("3. Test with: python3 weekly_content_system.py curate")
    print("\n📧 Admin emails will be sent to:")
    print("   - aaddoshadrack@gmail.com")
    print("   - marfo.oduro@gmail.com")
    print("\n🎵 Audio will be uploaded to your Spotify podcast")
    print("📱 Videos will be delivered to the mobile app automatically")

if __name__ == "__main__":
    main()
