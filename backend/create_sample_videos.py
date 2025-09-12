#!/usr/bin/env python3
"""
Create sample video files for testing video playback
"""

import os
import sqlite3
from datetime import datetime

def create_sample_video_files():
    """Create sample video files for testing"""
    
    # Create videos directory if it doesn't exist
    videos_dir = 'videos'
    thumbnails_dir = 'thumbnails'
    
    os.makedirs(videos_dir, exist_ok=True)
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Get all articles
    cursor.execute('SELECT id, title FROM articles')
    articles = cursor.fetchall()
    
    print(f"Creating sample video files for {len(articles)} articles...")
    
    for article_id, title in articles:
        # Create a simple text file as placeholder for video
        video_path = f"{videos_dir}/{article_id}.mp4"
        thumbnail_path = f"{thumbnails_dir}/{article_id}.jpg"
        
        # Create placeholder files
        with open(video_path, 'w') as f:
            f.write(f"# Sample Video for: {title}\n")
            f.write(f"# This is a placeholder video file\n")
            f.write(f"# In production, this would be a real MP4 video\n")
        
        with open(thumbnail_path, 'w') as f:
            f.write(f"# Sample Thumbnail for: {title}\n")
            f.write(f"# This is a placeholder thumbnail file\n")
            f.write(f"# In production, this would be a real JPG image\n")
        
        print(f"✅ Created sample files for: {title[:50]}...")
    
    conn.close()
    print(f"\n🎉 Created sample video files for all {len(articles)} articles!")
    print("📁 Files created in:")
    print(f"   - {videos_dir}/ (video files)")
    print(f"   - {thumbnails_dir}/ (thumbnail files)")

if __name__ == "__main__":
    create_sample_video_files()
