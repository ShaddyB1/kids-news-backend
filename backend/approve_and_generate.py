#!/usr/bin/env python3
"""
Script to approve stories and generate videos/quizzes for testing
"""

import sqlite3
import json
from datetime import datetime
import uuid

def approve_stories_and_generate():
    """Approve stories and generate videos/quizzes"""
    
    # Connect to editorial database
    conn = sqlite3.connect('automated_editorial.db')
    cursor = conn.cursor()
    
    # Get pending stories
    cursor.execute('SELECT id, title, headline, content, script, category FROM automated_stories WHERE is_approved = 0')
    pending_stories = cursor.fetchall()
    
    if not pending_stories:
        print("❌ No pending stories found!")
        return
    
    print(f"📋 Found {len(pending_stories)} pending stories")
    
    # Publishing schedule (Mon, Wed, Fri)
    publishing_days = ['monday', 'wednesday', 'friday']
    
    # Approve first 3 stories
    approved_count = 0
    for i, (story_id, title, headline, content, script, category) in enumerate(pending_stories[:3]):
        publishing_day = publishing_days[i % 3]
        
        # Approve the story
        cursor.execute('''
            UPDATE automated_stories 
            SET is_approved = 1, approved_date = ?, publishing_day = ?, video_generated = 1, quiz_generated = 1
            WHERE id = ?
        ''', (datetime.now().isoformat(), publishing_day, story_id))
        
        # Add to main articles database
        add_to_main_database(story_id, title, headline, content, category)
        
        # Create a mock video entry
        create_mock_video(story_id, title, category)
        
        print(f"✅ Approved: {title} (scheduled for {publishing_day})")
        approved_count += 1
    
    conn.commit()
    conn.close()
    
    print(f"\n🎉 Successfully approved {approved_count} stories!")
    print("📺 Mock videos created and ready for the app!")
    print("🎯 Articles added to main database!")

def add_to_main_database(story_id, title, headline, content, category):
    """Add approved story to main articles database"""
    
    # Connect to main database
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Create articles table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            headline TEXT NOT NULL,
            summary TEXT,
            content TEXT NOT NULL,
            category TEXT NOT NULL,
            author TEXT DEFAULT 'Junior News Team',
            published_date TEXT NOT NULL,
            read_time TEXT DEFAULT '3 min read',
            is_breaking INTEGER DEFAULT 0,
            is_trending INTEGER DEFAULT 1,
            is_hot INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0
        )
    ''')
    
    # Create summary from first 150 characters of content
    summary = content[:150] + "..." if len(content) > 150 else content
    
    # Insert article
    cursor.execute('''
        INSERT OR REPLACE INTO articles 
        (id, title, headline, summary, content, category, author, published_date, read_time, is_breaking, is_trending, is_hot, views, likes, comments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        story_id,
        title,
        headline,
        summary,
        content,
        category,
        'Junior News Team',
        datetime.now().isoformat(),
        '3 min read',
        0,  # is_breaking
        1,  # is_trending
        0,  # is_hot
        0,  # views
        0,  # likes
        0   # comments
    ))
    
    conn.commit()
    conn.close()

def create_mock_video(story_id, title, category):
    """Create a mock video entry"""
    
    # Connect to main database
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Videos table already exists with correct schema
    
    video_id = f"video_{story_id}"
    description = f"Watch the amazing story: {title}. Perfect for young learners!"
    
    # Insert video using existing schema
    cursor.execute('''
        INSERT OR REPLACE INTO videos 
        (id, article_id, title, description, file_path, thumbnail_path, duration, status, upload_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        video_id,
        story_id,
        title,
        description,
        f"/videos/{story_id}.mp4",
        f"/thumbnails/{story_id}.jpg",
        "5:30",
        "ready",
        datetime.now().isoformat()
    ))
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    approve_stories_and_generate()
