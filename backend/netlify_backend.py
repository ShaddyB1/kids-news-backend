#!/usr/bin/env python3
"""
Junior News Digest - Netlify Functions Backend
==============================================

Serverless backend for Netlify Functions deployment.
This version is optimized for serverless deployment.
"""

import os
import sys
import json
import uuid
import hashlib
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import sqlite3
import logging

# Setup logging for Netlify
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Simplified database manager for serverless
class SimpleDatabaseManager:
    """Simplified database for serverless deployment"""
    
    def __init__(self, db_path: str = "/tmp/junior_news.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database with sample data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Articles table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                headline TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT NOT NULL,
                category TEXT NOT NULL,
                author TEXT NOT NULL,
                published_date TEXT NOT NULL,
                read_time TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                comments INTEGER DEFAULT 0,
                is_breaking BOOLEAN DEFAULT FALSE,
                is_trending BOOLEAN DEFAULT FALSE,
                is_hot BOOLEAN DEFAULT FALSE,
                video_url TEXT,
                thumbnail_url TEXT,
                quiz_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Videos table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS videos (
                id TEXT PRIMARY KEY,
                article_id TEXT,
                title TEXT NOT NULL,
                description TEXT,
                file_path TEXT NOT NULL,
                thumbnail_path TEXT,
                duration TEXT,
                status TEXT DEFAULT 'ready',
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles (id)
            )
        ''')
        
        # Add sample data if empty
        cursor.execute("SELECT COUNT(*) FROM articles")
        if cursor.fetchone()[0] == 0:
            sample_articles = [
                {
                    'id': 'solar-robot-saves-environment-netlify',
                    'title': 'Kids Create Amazing Solar Robot to Save Environment',
                    'headline': 'Kids Create Amazing Solar Robot to Save Environment',
                    'content': 'A group of brilliant students from Green Valley School invented an incredible solar-powered robot that helps clean parks and protect our environment! The robot uses special solar panels to collect energy from the sun, so it doesn\'t need any harmful fuel. The students worked with their teacher for six months to build this amazing invention. The solar robot can work for 8 hours on a sunny day without stopping! This shows how young people can create solutions to help our planet.',
                    'summary': 'Students create solar-powered robot that cleans parks using renewable energy.',
                    'category': 'technology',
                    'author': 'Junior Science Team',
                    'published_date': datetime.now().isoformat(),
                    'read_time': '3 min read',
                    'is_trending': True,
                    'is_breaking': False,
                    'is_hot': False,
                    'likes': 45,
                    'views': 234,
                    'comments': 12
                },
                {
                    'id': 'ocean-cleanup-saves-animals-netlify',
                    'title': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
                    'headline': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
                    'content': 'An incredible robot named "Ocean Helper" has saved over 1,000 sea animals from plastic pollution! The robot was created by marine scientists in California. It swims through the ocean like a friendly whale, collecting plastic bottles, bags, and other trash that hurt sea creatures. Since it started working, Ocean Helper has cleaned 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes.',
                    'summary': 'Ocean-cleaning robot saves marine life by removing plastic pollution.',
                    'category': 'environment',
                    'author': 'Ocean News Team',
                    'published_date': (datetime.now() - timedelta(hours=2)).isoformat(),
                    'read_time': '4 min read',
                    'is_hot': True,
                    'is_breaking': False,
                    'is_trending': False,
                    'likes': 67,
                    'views': 456,
                    'comments': 23
                },
                {
                    'id': 'young-scientists-medicine-breakthrough-netlify',
                    'title': 'Young Scientists Help Create New Medicine for Kids',
                    'headline': 'Young Scientists Help Create New Medicine for Kids',
                    'content': 'Amazing young scientists have helped create a new medicine that helps children with allergies stay safe and healthy! The medicine works like a superhero shield, protecting kids from dangerous allergic reactions. The research team worked with students from Science Academy to test and improve the medicine. This breakthrough will help millions of children around the world feel safer when eating and playing.',
                    'summary': 'Young scientists contribute to breakthrough medicine for childhood allergies.',
                    'category': 'health',
                    'author': 'Dr. Health News',
                    'published_date': (datetime.now() - timedelta(hours=4)).isoformat(),
                    'read_time': '3 min read',
                    'is_breaking': True,
                    'is_trending': False,
                    'is_hot': False,
                    'likes': 89,
                    'views': 678,
                    'comments': 34
                },
                {
                    'id': 'space-discovery-kids-telescope-netlify',
                    'title': 'Kids Discover New Planet Using School Telescope',
                    'headline': 'Kids Discover New Planet Using School Telescope',
                    'content': 'Students at Star Academy made an incredible discovery - they found a new planet using their school telescope! The planet is called "Wonder World" and it\'s located 50 light-years away from Earth. The young astronomers worked every night for three months, carefully studying the stars. Scientists from NASA confirmed their amazing discovery! This shows that kids can make real contributions to space science.',
                    'summary': 'School students discover new planet using telescope, confirmed by NASA.',
                    'category': 'science',
                    'author': 'Space News Kids',
                    'published_date': (datetime.now() - timedelta(hours=6)).isoformat(),
                    'read_time': '5 min read',
                    'is_breaking': False,
                    'is_trending': True,
                    'is_hot': True,
                    'likes': 123,
                    'views': 890,
                    'comments': 56
                },
                {
                    'id': 'recycling-champions-save-city-netlify',
                    'title': 'Young Recycling Champions Save Their City',
                    'headline': 'Young Recycling Champions Save Their City',
                    'content': 'A group of 8-year-old environmental heroes started a recycling program that saved their entire city! They collected over 10,000 plastic bottles, 5,000 aluminum cans, and 2,000 newspapers in just one month. The mayor gave them a special award for helping make their city cleaner. Other cities are now copying their amazing recycling program. These young champions prove that kids can make a big difference!',
                    'summary': 'Young recycling program saves city, wins mayor\'s award.',
                    'category': 'environment',
                    'author': 'Green Kids News',
                    'published_date': (datetime.now() - timedelta(hours=8)).isoformat(),
                    'read_time': '4 min read',
                    'is_breaking': False,
                    'is_trending': False,
                    'is_hot': True,
                    'likes': 78,
                    'views': 567,
                    'comments': 29
                }
            ]
            
            for article in sample_articles:
                cursor.execute('''
                    INSERT INTO articles (id, title, headline, content, summary, category, author, 
                                        published_date, read_time, likes, views, comments,
                                        is_breaking, is_trending, is_hot)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    article['id'], article['title'], article['headline'], article['content'],
                    article['summary'], article['category'], article['author'],
                    article['published_date'], article['read_time'], article['likes'], 
                    article['views'], article['comments'], article['is_breaking'], 
                    article['is_trending'], article['is_hot']
                ))
            
            # Add sample videos
            sample_videos = [
                {
                    'id': 'solar-robot-video-netlify',
                    'title': 'Amazing Solar Robot in Action',
                    'description': 'Watch the incredible solar-powered robot clean parks!',
                    'file_path': 'https://example.com/videos/solar-robot.mp4',
                    'thumbnail_path': 'https://example.com/thumbnails/solar-robot.jpg',
                    'duration': '3:45',
                    'status': 'ready'
                },
                {
                    'id': 'ocean-cleanup-video-netlify',
                    'title': 'Ocean Helper Robot Saves Sea Life',
                    'description': 'See how the Ocean Helper robot cleans our oceans!',
                    'file_path': 'https://example.com/videos/ocean-helper.mp4',
                    'thumbnail_path': 'https://example.com/thumbnails/ocean-helper.jpg',
                    'duration': '4:20',
                    'status': 'ready'
                }
            ]
            
            for video in sample_videos:
                cursor.execute('''
                    INSERT INTO videos (id, title, description, file_path, thumbnail_path, duration, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    video['id'], video['title'], video['description'], 
                    video['file_path'], video['thumbnail_path'], 
                    video['duration'], video['status']
                ))
            
            logger.info("Sample data initialized")
        
        conn.commit()
        conn.close()

# Global database instance
db_manager = SimpleDatabaseManager()

# Netlify Function Handler
def handler(event, context):
    """Main Netlify function handler"""
    
    # Parse the request
    http_method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    query_params = event.get('queryStringParameters') or {}
    headers = event.get('headers', {})
    body = event.get('body', '')
    
    # CORS headers
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }
    
    # Handle OPTIONS (preflight) requests
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': ''
        }
    
    try:
        # Route the request
        if path == '/' or path == '/api/health':
            response_data = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'database': 'connected',
                'automation': 'running'
            }
        
        elif path == '/api/articles':
            response_data = get_articles()
        
        elif path == '/api/videos':
            response_data = get_videos()
        
        elif path.startswith('/api/articles/'):
            article_id = path.split('/')[-1]
            response_data = get_article(article_id)
        
        else:
            return {
                'statusCode': 404,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {
                **cors_headers,
                'Content-Type': 'application/json'
            },
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        logger.error(f"Function error: {e}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

def get_articles():
    """Get all articles"""
    try:
        conn = sqlite3.connect(db_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, headline, content, summary, category, author, 
                   published_date, read_time, likes, views, comments,
                   is_breaking, is_trending, is_hot
            FROM articles 
            ORDER BY published_date DESC
        ''')
        
        articles = []
        for row in cursor.fetchall():
            articles.append({
                'id': row[0], 'title': row[1], 'headline': row[2], 'content': row[3],
                'summary': row[4], 'category': row[5], 'author': row[6],
                'published_date': row[7], 'read_time': row[8], 'likes': row[9],
                'views': row[10], 'comments': row[11], 'is_breaking': bool(row[12]),
                'is_trending': bool(row[13]), 'is_hot': bool(row[14])
            })
        
        conn.close()
        
        return {
            'success': True,
            'articles': articles,
            'total': len(articles)
        }
        
    except Exception as e:
        logger.error(f"Error fetching articles: {e}")
        return {
            'success': False,
            'articles': [],
            'total': 0
        }

def get_videos():
    """Get all videos"""
    try:
        conn = sqlite3.connect(db_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, description, file_path, thumbnail_path, 
                   duration, status, upload_date
            FROM videos 
            WHERE status = 'ready'
            ORDER BY upload_date DESC
        ''')
        
        videos = []
        for row in cursor.fetchall():
            videos.append({
                'id': row[0], 'title': row[1], 'description': row[2],
                'video_url': row[3], 'thumbnail_url': row[4],
                'duration': row[5], 'status': row[6], 'upload_date': row[7]
            })
        
        conn.close()
        
        return {
            'success': True,
            'videos': videos,
            'total': len(videos)
        }
        
    except Exception as e:
        logger.error(f"Error fetching videos: {e}")
        return {
            'success': False,
            'videos': [],
            'total': 0
        }

def get_article(article_id):
    """Get single article"""
    try:
        conn = sqlite3.connect(db_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, headline, content, summary, category, author, 
                   published_date, read_time, likes, views, comments,
                   is_breaking, is_trending, is_hot
            FROM articles 
            WHERE id = ?
        ''', (article_id,))
        
        row = cursor.fetchone()
        if not row:
            return {'error': 'Article not found'}
        
        article = {
            'id': row[0], 'title': row[1], 'headline': row[2], 'content': row[3],
            'summary': row[4], 'category': row[5], 'author': row[6],
            'published_date': row[7], 'read_time': row[8], 'likes': row[9],
            'views': row[10], 'comments': row[11], 'is_breaking': bool(row[12]),
            'is_trending': bool(row[13]), 'is_hot': bool(row[14])
        }
        
        conn.close()
        return article
        
    except Exception as e:
        logger.error(f"Error fetching article {article_id}: {e}")
        return {'error': 'Article not found'}

# For local testing
if __name__ == '__main__':
    # Test the function locally
    test_event = {
        'httpMethod': 'GET',
        'path': '/api/articles',
        'queryStringParameters': {},
        'headers': {},
        'body': ''
    }
    
    result = handler(test_event, {})
    print(json.dumps(result, indent=2))
