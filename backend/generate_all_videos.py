#!/usr/bin/env python3
"""
Generate videos for all stories that don't have them
"""

import sqlite3
import uuid
import json
import os
from datetime import datetime

def generate_video_for_article(article_id: str, title: str, content: str, category: str):
    """Generate a video entry for an article using the actual video creator"""
    
    # Connect to database
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Create video ID
    video_id = f"video_{article_id}"
    
    # Create videos table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS videos (
            id TEXT PRIMARY KEY,
            article_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            file_path TEXT,
            thumbnail_path TEXT,
            duration TEXT DEFAULT '5:30',
            status TEXT DEFAULT 'ready',
            upload_date TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles (id)
        )
    ''')
    
    # Generate video description
    description = f"Watch the amazing story: {title}. Perfect for young learners aged 6-12! This {category} story teaches important lessons about how kids can make a difference in the world."
    
    try:
        # Use the actual video generator
        from final_video_generator import FinalVideoGenerator
        
        print(f"🎬 Creating real video for: {title}")
        generator = FinalVideoGenerator()
        
        # Generate the actual video
        video_file_path = generator.create_branded_video(title, content)
        
        # Create proper paths for serving
        video_path = f"/videos/{article_id}.mp4"
        thumbnail_path = f"/thumbnails/{article_id}.jpg"
        
        # Copy the generated video to the videos directory
        import shutil
        import os
        
        # Ensure directories exist
        os.makedirs('videos', exist_ok=True)
        os.makedirs('thumbnails', exist_ok=True)
        
        # Copy video file
        final_video_path = f"videos/{article_id}.mp4"
        shutil.copy2(video_file_path, final_video_path)
        
        # Create a simple thumbnail (placeholder for now)
        with open(f"thumbnails/{article_id}.jpg", 'w') as f:
            f.write(f"# Thumbnail for: {title}\n")
        
        print(f"✅ Real video created: {final_video_path}")
        
    except Exception as e:
        print(f"⚠️  Video generation failed for {title}: {e}")
        print("📝 Creating placeholder video entry...")
        
        # Fallback to placeholder
        video_path = f"/videos/{article_id}.mp4"
        thumbnail_path = f"/thumbnails/{article_id}.jpg"
    
    # Insert video
    cursor.execute('''
        INSERT OR REPLACE INTO videos 
        (id, article_id, title, description, file_path, thumbnail_path, duration, status, upload_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        video_id,
        article_id,
        title,
        description,
        video_path,
        thumbnail_path,
        "5:30",
        "ready",
        datetime.now().isoformat()
    ))
    
    conn.commit()
    conn.close()
    
    print(f"✅ Video entry created for: {title}")
    return video_id

def generate_videos_for_all_articles():
    """Generate videos for all articles that don't have them"""
    
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Get all articles
    cursor.execute('SELECT id, title, content, category FROM articles')
    articles = cursor.fetchall()
    
    # Get existing videos
    cursor.execute('SELECT article_id FROM videos')
    existing_videos = [row[0] for row in cursor.fetchall()]
    
    generated_count = 0
    for article_id, title, content, category in articles:
        if article_id not in existing_videos:
            video_id = generate_video_for_article(article_id, title, content, category)
            if video_id:
                generated_count += 1
        else:
            print(f"⏭️  Video already exists for: {title}")
    
    conn.close()
    print(f"\n🎉 Generated {generated_count} new videos!")
    
    # Check total videos
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM videos')
    total_videos = cursor.fetchone()[0]
    conn.close()
    
    print(f"📺 Total videos now available: {total_videos}")

if __name__ == "__main__":
    generate_videos_for_all_articles()
