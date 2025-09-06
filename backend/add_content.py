#!/usr/bin/env python3
"""
Content Management Script for Junior News Digest Backend
========================================================

This script allows you to add articles and videos to your backend database.
You can run it locally or on your production server.

Usage:
    python add_content.py --help
    python add_content.py add-article --title "Title" --content "Content" --category "tech"
    python add_content.py add-video --title "Video Title" --url "video.mp4" --description "Description"
    python add_content.py list-articles
    python add_content.py list-videos
"""

import argparse
import sys
import os
import sqlite3
from datetime import datetime
import json

# Add the production directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_api import DatabaseManager

class ContentManager:
    def __init__(self, db_path='junior_news.db'):
        """Initialize the content manager with database connection"""
        self.db_path = db_path
        # Initialize database structure using DatabaseManager
        db_manager = DatabaseManager(db_path)
        print(f"✅ Connected to database: {db_path}")
    
    def get_connection(self):
        """Get a database connection"""
        return sqlite3.connect(self.db_path)
    
    def add_article(self, title, content, category, author="Junior News Team", 
                   summary=None, is_breaking=False, is_trending=False, is_hot=False):
        """Add a new article to the database"""
        try:
            # Auto-generate summary if not provided
            if not summary:
                # Take first 150 characters and add ellipsis
                summary = content[:150] + "..." if len(content) > 150 else content
            
            # Generate ID and headline from title
            article_id = title.lower().replace(' ', '-').replace(',', '').replace('.', '') + f"-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            article_data = {
                'id': article_id,
                'title': title,
                'headline': title,  # Use title as headline
                'content': content,
                'summary': summary,
                'category': category.lower(),
                'author': author,
                'published_date': datetime.now().isoformat(),
                'is_breaking': is_breaking,
                'is_trending': is_trending,
                'is_hot': is_hot,
                'views': 0,
                'likes': 0,
                'read_time': f"{max(1, len(content.split()) // 200)} min read"
            }
            
            # Insert into database
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO articles (id, title, headline, content, summary, category, author, 
                                    published_date, is_breaking, is_trending, is_hot, 
                                    views, likes, read_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                article_data['id'], article_data['title'], article_data['headline'],
                article_data['content'], article_data['summary'], article_data['category'], 
                article_data['author'], article_data['published_date'], article_data['is_breaking'], 
                article_data['is_trending'], article_data['is_hot'], article_data['views'], 
                article_data['likes'], article_data['read_time']
            ))
            
            conn.commit()
            article_id = cursor.lastrowid
            conn.close()
            
            print(f"✅ Article added successfully!")
            print(f"   ID: {article_id}")
            print(f"   Title: {title}")
            print(f"   Category: {category}")
            print(f"   Summary: {summary[:50]}...")
            
            return article_data['id']
            
        except Exception as e:
            print(f"❌ Error adding article: {e}")
            return None
    
    def add_video(self, title, video_url, description, thumbnail_url=None, 
                 duration="5:30", category="general"):
        """Add a new video to the database"""
        try:
            # Generate ID from title
            video_id = title.lower().replace(' ', '-').replace(',', '').replace('.', '') + f"-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            video_data = {
                'id': video_id,
                'title': title,
                'description': description,
                'file_path': video_url,  # Use video_url as file_path
                'thumbnail_path': thumbnail_url or f"https://via.placeholder.com/320x180/4A90E2/FFFFFF?text={title[:10]}",
                'duration': duration,
                'status': 'ready'  # Set as ready since it's manually added
            }
            
            # Insert into database
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO videos (id, title, description, file_path, thumbnail_path, 
                                  duration, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                video_data['id'], video_data['title'], video_data['description'], 
                video_data['file_path'], video_data['thumbnail_path'], video_data['duration'],
                video_data['status']
            ))
            
            conn.commit()
            video_id = cursor.lastrowid
            conn.close()
            
            print(f"✅ Video added successfully!")
            print(f"   ID: {video_data['id']}")
            print(f"   Title: {title}")
            print(f"   URL: {video_url}")
            print(f"   Duration: {duration}")
            
            return video_data['id']
            
        except Exception as e:
            print(f"❌ Error adding video: {e}")
            return None
    
    def list_articles(self, limit=10):
        """List recent articles"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, title, category, author, published_date, is_breaking, is_trending, is_hot
                FROM articles 
                ORDER BY published_date DESC 
                LIMIT ?
            ''', (limit,))
            
            articles = cursor.fetchall()
            conn.close()
            
            if not articles:
                print("📰 No articles found in database")
                return
            
            print(f"\n📰 Recent Articles ({len(articles)}):")
            print("-" * 80)
            
            for article in articles:
                id, title, category, author, pub_date, is_breaking, is_trending, is_hot = article
                status_badges = []
                if is_breaking: status_badges.append("🔴 BREAKING")
                if is_trending: status_badges.append("🔥 TRENDING") 
                if is_hot: status_badges.append("⚡ HOT")
                
                status_str = " ".join(status_badges) if status_badges else ""
                
                print(f"ID: {id:<25} | {title[:50]:<50} | {category:10} | {author:15} {status_str}")
                print(f"        Published: {pub_date[:19]}")
                print()
                
        except Exception as e:
            print(f"❌ Error listing articles: {e}")
    
    def list_videos(self, limit=10):
        """List recent videos"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, title, duration, status, upload_date, file_path
                FROM videos 
                ORDER BY upload_date DESC 
                LIMIT ?
            ''', (limit,))
            
            videos = cursor.fetchall()
            conn.close()
            
            if not videos:
                print("🎥 No videos found in database")
                return
            
            print(f"\n🎥 Recent Videos ({len(videos)}):")
            print("-" * 80)
            
            for video in videos:
                id, title, duration, status, upload_date, file_path = video
                print(f"ID: {id:<25} | {title[:50]:<50} | {duration:8} | {status:10}")
                print(f"        URL: {file_path}")
                print(f"        Uploaded: {upload_date[:19] if upload_date else 'N/A'}")
                print()
                
        except Exception as e:
            print(f"❌ Error listing videos: {e}")

def main():
    parser = argparse.ArgumentParser(description='Junior News Digest Content Management')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Add Article command
    add_article = subparsers.add_parser('add-article', help='Add a new article')
    add_article.add_argument('--title', required=True, help='Article title')
    add_article.add_argument('--content', required=True, help='Article content')
    add_article.add_argument('--category', required=True, choices=['technology', 'science', 'environment', 'health', 'education', 'sports', 'culture', 'general'], help='Article category')
    add_article.add_argument('--author', default='Junior News Team', help='Article author')
    add_article.add_argument('--summary', help='Article summary (auto-generated if not provided)')
    add_article.add_argument('--breaking', action='store_true', help='Mark as breaking news')
    add_article.add_argument('--trending', action='store_true', help='Mark as trending')
    add_article.add_argument('--hot', action='store_true', help='Mark as hot topic')
    
    # Add Video command
    add_video = subparsers.add_parser('add-video', help='Add a new video')
    add_video.add_argument('--title', required=True, help='Video title')
    add_video.add_argument('--url', required=True, help='Video URL')
    add_video.add_argument('--description', required=True, help='Video description')
    add_video.add_argument('--thumbnail', help='Thumbnail URL')
    add_video.add_argument('--duration', default='5:30', help='Video duration (e.g., "5:30")')
    add_video.add_argument('--category', default='general', choices=['technology', 'science', 'environment', 'health', 'education', 'sports', 'culture', 'general'], help='Video category')
    
    # List commands
    subparsers.add_parser('list-articles', help='List recent articles')
    subparsers.add_parser('list-videos', help='List recent videos')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize content manager
    cm = ContentManager()
    
    if args.command == 'add-article':
        cm.add_article(
            title=args.title,
            content=args.content,
            category=args.category,
            author=args.author,
            summary=args.summary,
            is_breaking=args.breaking,
            is_trending=args.trending,
            is_hot=args.hot
        )
    
    elif args.command == 'add-video':
        cm.add_video(
            title=args.title,
            video_url=args.url,
            description=args.description,
            thumbnail_url=args.thumbnail,
            duration=args.duration,
            category=args.category
        )
    
    elif args.command == 'list-articles':
        cm.list_articles()
    
    elif args.command == 'list-videos':
        cm.list_videos()

if __name__ == '__main__':
    main()
