#!/usr/bin/env python3
"""
Junior News Digest - Integrated Backend with Editorial Workflow
==============================================================

This backend includes:
1. Original API endpoints for the app
2. Editorial workflow system 
3. Automated content scheduling
4. Web-based editorial portal
5. Background automation tasks
"""

import os
import sys
import json
import uuid
import hashlib
import threading
import time
import random
from datetime import datetime, timedelta, date
from pathlib import Path
from typing import List, Dict, Optional, Any
import sqlite3
import logging
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify, send_file, send_from_directory, render_template_string, redirect, url_for, flash, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from thumbnail_api import thumbnail_bp
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
app.secret_key = os.getenv('JWT_SECRET_KEY', 'junior-news-integrated-backend-2024')
CORS(app, resources={
    r"/api/*": {"origins": "*"},
    r"/editorial/*": {"origins": "*"}
})

# Register thumbnail blueprint
app.register_blueprint(thumbnail_bp)

# Configuration
JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'jpg', 'jpeg', 'png', 'gif'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class DatabaseManager:
    """Manages all database operations"""
    
    def __init__(self, db_path: str = "junior_news_integrated.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize all database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Articles table (main content)
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
                status TEXT DEFAULT 'processing',
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles (id)
            )
        ''')
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                avatar_emoji TEXT DEFAULT '🦸',
                level TEXT DEFAULT 'Level 1 News Reader',
                stories_read INTEGER DEFAULT 0,
                videos_watched INTEGER DEFAULT 0,
                days_streak INTEGER DEFAULT 0,
                dark_mode BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Editorial workflow tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS candidate_stories (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT,
                category TEXT NOT NULL,
                author TEXT NOT NULL,
                generated_date TEXT NOT NULL,
                status TEXT DEFAULT 'pending_review',
                editor_notes TEXT DEFAULT '',
                priority_score INTEGER DEFAULT 5,
                is_breaking BOOLEAN DEFAULT FALSE,
                is_trending BOOLEAN DEFAULT FALSE,
                is_hot BOOLEAN DEFAULT FALSE,
                approved_date TEXT,
                final_title TEXT,
                final_content TEXT,
                final_summary TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weekly_schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                week_start_date TEXT NOT NULL,
                candidate_id TEXT NOT NULL,
                scheduled_date TEXT NOT NULL,
                day_of_week TEXT NOT NULL,
                article_id TEXT,
                video_id TEXT,
                quiz_id TEXT,
                status TEXT DEFAULT 'scheduled',
                created_date TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES candidate_stories (id)
            )
        ''')
        
        # System settings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")

class NewsStoryGenerator:
    """Generates candidate news stories for editorial review"""
    
    def __init__(self):
        self.categories = [
            'technology', 'science', 'environment', 'health', 
            'education', 'sports', 'culture', 'general'
        ]
        
        self.story_templates = {
            'technology': [
                {
                    'title': 'Young Inventors Create {innovation} to Help {cause}',
                    'content_template': 'A group of brilliant students from {school} has invented an amazing {innovation}! The {innovation} uses {technology} to {benefit}. The students worked with their teacher for {duration} to build this incredible invention. {impact_stat}! This shows how young people can create solutions to help {cause}.',
                    'innovations': ['solar-powered robot', 'smart recycling system', 'water purification device', 'air quality monitor'],
                    'causes': ['the environment', 'their community', 'elderly people', 'animals'],
                    'technologies': ['solar panels', 'artificial intelligence', 'sensors', 'renewable energy'],
                    'benefits': ['clean parks', 'reduce waste', 'provide clean water', 'monitor pollution'],
                    'schools': ['Green Valley School', 'Tech Academy', 'Innovation Middle School', 'STEM High School']
                }
            ],
            'science': [
                {
                    'title': 'Scientists Discover {discovery} That Could {impact}',
                    'content_template': 'Amazing scientists have made an incredible discovery about {subject}! They found that {discovery} could {impact}. The research team worked for {duration} to understand {phenomenon}. This discovery means that {benefit}. Young scientists around the world are excited about this breakthrough!',
                    'discoveries': ['new medicine', 'clean energy source', 'way to grow food faster', 'method to clean oceans'],
                    'impacts': ['help sick children', 'power entire cities', 'feed more people', 'save marine life'],
                    'subjects': ['space', 'the human body', 'plants', 'the ocean'],
                    'phenomena': ['how cells work', 'how stars form', 'how plants grow', 'how ecosystems function']
                }
            ],
            'environment': [
                {
                    'title': 'Kids Plant {number} Trees to Fight Climate Change',
                    'content_template': 'Thousands of children from around the world have planted {number} trees in just one weekend! The amazing project, called "{project_name}," happened in {locations}. Kids aged 6 to 16 worked with their families and teachers to plant {tree_types} in parks, schools, and neighborhoods. Scientists say these trees will {environmental_benefit}. The children also learned about {educational_aspect}.',
                    'numbers': ['10,000', '25,000', '50,000', '100,000'],
                    'project_names': ['Trees for Tomorrow', 'Green Future Initiative', 'Plant Hope Project', 'Climate Heroes'],
                    'tree_types': ['oak, maple, and fruit trees', 'native species', 'fast-growing varieties', 'flowering trees'],
                    'environmental_benefits': ['clean the air and fight climate change', 'provide homes for animals', 'prevent soil erosion', 'create cooler neighborhoods']
                }
            ]
        }
    
    def generate_candidate_stories(self, count=20) -> List[Dict[str, Any]]:
        """Generate candidate stories for editorial review"""
        candidates = []
        
        for i in range(count):
            category = random.choice(self.categories)
            
            if category in self.story_templates:
                template = random.choice(self.story_templates[category])
                story = self._generate_from_template(template, category)
            else:
                story = self._generate_generic_story(category, i)
            
            story['candidate_id'] = f"candidate_{datetime.now().strftime('%Y%m%d')}_{i+1:03d}"
            story['generated_date'] = datetime.now().isoformat()
            story['status'] = 'pending_review'
            story['editor_notes'] = ''
            story['priority_score'] = random.randint(1, 10)
            
            candidates.append(story)
        
        candidates.sort(key=lambda x: x['priority_score'], reverse=True)
        return candidates
    
    def _generate_from_template(self, template: Dict, category: str) -> Dict[str, Any]:
        """Generate a story from a template"""
        title = template['title']
        content = template['content_template']
        
        # Replace placeholders with random choices
        for key, values in template.items():
            if key.endswith('s') and key not in ['title', 'content_template']:
                placeholder = f"{{{key[:-1]}}}"
                if placeholder in title:
                    title = title.replace(placeholder, random.choice(values))
                if placeholder in content:
                    content = content.replace(placeholder, random.choice(values))
        
        # Add random details
        durations = ['3 months', '6 months', '8 months', '1 year']
        impact_stats = [
            'The invention can help 1000 people every day',
            'It works 10 times faster than old methods',
            'It uses 50% less energy than traditional systems',
            'It can process 100 items per hour'
        ]
        
        content = content.replace('{duration}', random.choice(durations))
        content = content.replace('{impact_stat}', random.choice(impact_stats))
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content,
            'is_breaking': random.choice([True, False]) if random.random() < 0.2 else False,
            'is_trending': random.choice([True, False]) if random.random() < 0.3 else False,
            'is_hot': random.choice([True, False]) if random.random() < 0.25 else False
        }
    
    def _generate_generic_story(self, category: str, index: int) -> Dict[str, Any]:
        """Generate a generic story for categories without templates"""
        title = f"Amazing {category.title()} Discovery #{index+1}"
        content = f"This is an exciting story about {category} that will inspire young minds. Children and young people are making incredible discoveries and contributions in {category}. This story shows how kids can make a real difference in the world through creativity, hard work, and determination."
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content,
            'is_breaking': False,
            'is_trending': random.choice([True, False]) if random.random() < 0.3 else False,
            'is_hot': False
        }

class EditorialWorkflow:
    """Manages the editorial workflow system"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.story_generator = NewsStoryGenerator()
    
    def generate_weekly_candidates(self, count=20):
        """Generate candidate stories for the week"""
        logger.info(f"Generating {count} candidate stories for editorial review...")
        
        candidates = self.story_generator.generate_candidate_stories(count)
        
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        # Clear previous week's pending candidates
        cursor.execute("DELETE FROM candidate_stories WHERE status = 'pending_review'")
        
        saved_count = 0
        for candidate in candidates:
            try:
                cursor.execute('''
                    INSERT INTO candidate_stories 
                    (id, title, content, summary, category, author, generated_date, 
                     status, priority_score, is_breaking, is_trending, is_hot)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    candidate['candidate_id'], candidate['title'], candidate['content'],
                    candidate['summary'], candidate['category'], candidate['author'],
                    candidate['generated_date'], candidate['status'], candidate['priority_score'],
                    candidate['is_breaking'], candidate['is_trending'], candidate['is_hot']
                ))
                saved_count += 1
            except Exception as e:
                logger.error(f"Error saving candidate {candidate['candidate_id']}: {e}")
        
        conn.commit()
        conn.close()
        
        logger.info(f"Generated and saved {saved_count} candidate stories!")
        return candidates
    
    def get_pending_candidates(self):
        """Get all pending candidate stories"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, content, summary, category, author, priority_score,
                   is_breaking, is_trending, is_hot, editor_notes
            FROM candidate_stories 
            WHERE status = 'pending_review'
            ORDER BY priority_score DESC, generated_date DESC
        ''')
        
        candidates = []
        for row in cursor.fetchall():
            candidates.append({
                'id': row[0], 'title': row[1], 'content': row[2], 'summary': row[3],
                'category': row[4], 'author': row[5], 'priority_score': row[6],
                'is_breaking': row[7], 'is_trending': row[8], 'is_hot': row[9],
                'editor_notes': row[10] or ''
            })
        
        conn.close()
        return candidates
    
    def approve_story(self, candidate_id: str, final_title: str = None, 
                     final_content: str = None, final_summary: str = None, 
                     editor_notes: str = ''):
        """Approve a candidate story"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'approved', 
                approved_date = ?, 
                final_title = COALESCE(?, title),
                final_content = COALESCE(?, content),
                final_summary = COALESCE(?, summary),
                editor_notes = ?
            WHERE id = ?
        ''', (
            datetime.now().isoformat(), final_title, final_content, 
            final_summary, editor_notes, candidate_id
        ))
        
        conn.commit()
        conn.close()
        logger.info(f"Approved story: {candidate_id}")
    
    def reject_story(self, candidate_id: str, editor_notes: str = ''):
        """Reject a candidate story"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'rejected', editor_notes = ?
            WHERE id = ?
        ''', (editor_notes, candidate_id))
        
        conn.commit()
        conn.close()
        logger.info(f"Rejected story: {candidate_id}")
    
    def get_approved_stories(self):
        """Get all approved stories ready for processing"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, COALESCE(final_title, title) as title,
                   COALESCE(final_content, content) as content,
                   COALESCE(final_summary, summary) as summary,
                   category, author, is_breaking, is_trending, is_hot
            FROM candidate_stories 
            WHERE status = 'approved'
            ORDER BY approved_date
        ''')
        
        stories = []
        for row in cursor.fetchall():
            stories.append({
                'candidate_id': row[0], 'title': row[1], 'content': row[2],
                'summary': row[3], 'category': row[4], 'author': row[5],
                'is_breaking': row[6], 'is_trending': row[7], 'is_hot': row[8]
            })
        
        conn.close()
        return stories
    
    def process_approved_stories(self):
        """Process approved stories - create articles"""
        approved_stories = self.get_approved_stories()
        
        if not approved_stories:
            logger.info("No approved stories to process")
            return
        
        logger.info(f"Processing {len(approved_stories)} approved stories...")
        
        processed_count = 0
        for story in approved_stories:
            try:
                # Generate article ID
                article_id = story['title'].lower().replace(' ', '-').replace(',', '').replace('.', '') + f"-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                
                # Add article to main database
                conn = sqlite3.connect(self.db.db_path)
                cursor = conn.cursor()
                
                cursor.execute('''
                    INSERT INTO articles (id, title, headline, content, summary, category, author, 
                                        published_date, is_breaking, is_trending, is_hot, 
                                        views, likes, read_time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    article_id, story['title'], story['title'], story['content'], 
                    story['summary'], story['category'], story['author'],
                    datetime.now().isoformat(), story['is_breaking'], 
                    story['is_trending'], story['is_hot'], 0, 0,
                    f"{max(1, len(story['content'].split()) // 200)} min read"
                ))
                
                conn.commit()
                conn.close()
                
                # Mark as processed
                self._mark_story_processed(story['candidate_id'], article_id)
                processed_count += 1
                
                logger.info(f"Processed: {story['title']}")
                
            except Exception as e:
                logger.error(f"Error processing {story['title']}: {e}")
        
        logger.info(f"Successfully processed {processed_count} stories!")
    
    def _mark_story_processed(self, candidate_id: str, article_id: str):
        """Mark a story as processed"""
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'processed'
            WHERE id = ?
        ''', (candidate_id,))
        
        conn.commit()
        conn.close()

class AutomationScheduler:
    """Handles automated background tasks"""
    
    def __init__(self, editorial_workflow: EditorialWorkflow):
        self.workflow = editorial_workflow
        self.running = False
        self.thread = None
    
    def start(self):
        """Start the automation scheduler"""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
            self.thread.start()
            logger.info("Automation scheduler started")
    
    def stop(self):
        """Stop the automation scheduler"""
        self.running = False
        if self.thread:
            self.thread.join()
        logger.info("Automation scheduler stopped")
    
    def _run_scheduler(self):
        """Main scheduler loop"""
        while self.running:
            try:
                current_time = datetime.now()
                
                # Sunday at 9:00 AM: Generate candidate stories
                if (current_time.weekday() == 6 and  # Sunday
                    current_time.hour == 9 and 
                    current_time.minute == 0):
                    logger.info("Sunday 9:00 AM - Generating candidate stories")
                    self.workflow.generate_weekly_candidates(20)
                
                # Monday, Wednesday, Friday at 8:00 AM: Process approved stories
                if (current_time.weekday() in [0, 2, 4] and  # Mon, Wed, Fri
                    current_time.hour == 8 and 
                    current_time.minute == 0):
                    logger.info(f"{current_time.strftime('%A')} 8:00 AM - Processing approved stories")
                    self.workflow.process_approved_stories()
                
                # Sleep for 60 seconds before checking again
                time.sleep(60)
                
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                time.sleep(60)

# Initialize components
db_manager = DatabaseManager()
editorial_workflow = EditorialWorkflow(db_manager)
automation_scheduler = AutomationScheduler(editorial_workflow)

# Editorial Portal Templates
EDITORIAL_PORTAL_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Junior News Digest - Editorial Portal</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { text-align: center; color: #4A90E2; margin-bottom: 30px; }
        .nav { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; }
        .nav a { background: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #357ABD; }
        .nav a.active { background: #2E5C8A; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .candidates { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .candidate { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .candidate-title { font-size: 18px; font-weight: bold; color: #2E5C8A; margin-bottom: 10px; }
        .candidate-meta { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge.category { background: #E3F2FD; color: #1976D2; }
        .badge.priority { background: #FFF3E0; color: #F57C00; }
        .badge.breaking { background: #FFEBEE; color: #D32F2F; }
        .badge.trending { background: #F3E5F5; color: #7B1FA2; }
        .badge.hot { background: #FFF8E1; color: #F9A825; }
        .candidate-content { margin-bottom: 15px; max-height: 150px; overflow-y: auto; color: #666; }
        .editor-notes { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px; }
        .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .btn-approve { background: #4CAF50; color: white; }
        .btn-reject { background: #f44336; color: white; }
        .btn:hover { opacity: 0.8; }
        .flash-messages { margin-bottom: 20px; }
        .flash-success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .flash-error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .process-section { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📰 Junior News Digest</h1>
        <h2>Editorial Portal</h2>
        <p>{{ today_date }}</p>
    </div>
    
    <div class="nav">
        <a href="/editorial/" class="active">📝 Review Stories</a>
        <a href="/editorial/approved">✅ Approved Stories</a>
        <a href="/editorial/schedule">📅 Weekly Schedule</a>
        <a href="/editorial/settings">⚙️ Settings</a>
    </div>
    
    <div class="flash-messages">
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="flash-{{ category }}">{{ message }}</div>
                {% endfor %}
            {% endif %}
        {% endwith %}
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h3>{{ total_candidates }}</h3>
            <p>Total Candidates</p>
        </div>
        <div class="stat-card">
            <h3>{{ approved_count }}</h3>
            <p>Approved</p>
        </div>
        <div class="stat-card">
            <h3>{{ pending_count }}</h3>
            <p>Pending Review</p>
        </div>
    </div>
    
    {% if approved_count > 0 %}
    <div class="process-section">
        <h3>🎉 {{ approved_count }} Stories Approved!</h3>
        <p>Ready to process approved stories and create articles.</p>
        <form action="/editorial/process-approved" method="post" style="display: inline;">
            <button type="submit" class="btn btn-approve" style="font-size: 16px; padding: 15px 30px;">
                🔄 Process Approved Stories
            </button>
        </form>
    </div>
    {% endif %}
    
    <div class="candidates">
        {% for candidate in candidates %}
        <div class="candidate">
            <div class="candidate-title">{{ candidate.title }}</div>
            
            <div class="candidate-meta">
                <span class="badge category">{{ candidate.category }}</span>
                <span class="badge priority">Priority: {{ candidate.priority_score }}/10</span>
                {% if candidate.is_breaking %}<span class="badge breaking">🔴 Breaking</span>{% endif %}
                {% if candidate.is_trending %}<span class="badge trending">🔥 Trending</span>{% endif %}
                {% if candidate.is_hot %}<span class="badge hot">⚡ Hot</span>{% endif %}
            </div>
            
            <div class="candidate-content">{{ candidate.content }}</div>
            
            <form action="/editorial/review-story" method="post">
                <input type="hidden" name="candidate_id" value="{{ candidate.id }}">
                <textarea name="editor_notes" class="editor-notes" placeholder="Editor notes (optional)...">{{ candidate.editor_notes }}</textarea>
                <div class="actions">
                    <button type="submit" name="action" value="approve" class="btn btn-approve">✅ Approve</button>
                    <button type="submit" name="action" value="reject" class="btn btn-reject">❌ Reject</button>
                </div>
            </form>
        </div>
        {% endfor %}
    </div>
</body>
</html>
'''

# API Routes (Original functionality)
@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Junior News Digest Integrated Backend',
        'version': '2.0.0',
        'features': ['API', 'Editorial Portal', 'Automation'],
        'endpoints': {
            'api': ['/api/health', '/api/articles', '/api/videos'],
            'editorial': ['/editorial/', '/editorial/generate', '/editorial/process-approved']
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'database': 'connected',
        'automation': 'running' if automation_scheduler.running else 'stopped'
    })

@app.route('/api/articles', methods=['GET', 'POST'])
def handle_articles():
    """Get all articles or create new article"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'content', 'summary', 'category']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Insert article into database
            conn = sqlite3.connect(db_manager.db_path)
            cursor = conn.cursor()
            
            article_id = data.get('id', f"story_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            cursor.execute('''
                INSERT INTO articles (id, title, content, summary, category, 
                                    image_url, video_url, thumbnail_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (
                article_id,
                data['title'],
                data['content'],
                data['summary'],
                data['category'],
                data.get('image_url'),
                data.get('video_url'),
                data.get('thumbnail_url')
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Article created successfully: {data['title']}")
            return jsonify({'success': True, 'id': article_id, 'message': 'Article created successfully'}), 201
            
        except Exception as e:
            logger.error(f"Error creating article: {e}")
            return jsonify({'error': 'Failed to create article'}), 500
    
    # GET method
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
                'views': row[10], 'comments': row[11], 'is_breaking': row[12],
                'is_trending': row[13], 'is_hot': row[14]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'articles': articles,
            'total': len(articles)
        })
        
    except Exception as e:
        logger.error(f"Error fetching articles: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/videos', methods=['GET', 'POST'])
def handle_videos():
    """Get all videos or create new video"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'file_path']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Insert video into database
            conn = sqlite3.connect(db_manager.db_path)
            cursor = conn.cursor()
            
            video_id = data.get('id', f"video_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            cursor.execute('''
                INSERT INTO videos (id, title, description, file_path, thumbnail_path, 
                                  duration, status, upload_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (
                video_id,
                data['title'],
                data.get('description', ''),
                data['file_path'],
                data.get('thumbnail_path'),
                data.get('duration', '00:00'),
                data.get('status', 'active')
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Video created successfully: {data['title']}")
            return jsonify({'success': True, 'id': video_id, 'message': 'Video created successfully'}), 201
            
        except Exception as e:
            logger.error(f"Error creating video: {e}")
            return jsonify({'error': 'Failed to create video'}), 500
    
    # GET method
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
        
        return jsonify({
            'success': True,
            'videos': videos,
            'total': len(videos)
        })
        
    except Exception as e:
        logger.error(f"Error fetching videos: {e}")
        return jsonify({'success': False, 'videos': [], 'total': 0})

@app.route('/api/articles/<article_id>/quiz', methods=['GET', 'POST'])
def handle_article_quiz(article_id):
    """Get or create quiz for a specific article"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['questions']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Insert quiz into database
            conn = sqlite3.connect(db_manager.db_path)
            cursor = conn.cursor()
            
            # Create quizzes table if it doesn't exist
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS quizzes (
                    id TEXT PRIMARY KEY,
                    article_id TEXT,
                    questions TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (article_id) REFERENCES articles (id)
                )
            ''')
            
            quiz_id = f"quiz_{article_id}"
            cursor.execute('''
                INSERT OR REPLACE INTO quizzes (id, article_id, questions)
                VALUES (?, ?, ?)
            ''', (quiz_id, article_id, json.dumps(data['questions'])))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Quiz created for article: {article_id}")
            return jsonify({'success': True, 'id': quiz_id, 'message': 'Quiz created successfully'}), 201
            
        except Exception as e:
            logger.error(f"Error creating quiz: {e}")
            return jsonify({'error': 'Failed to create quiz'}), 500
    
    # GET method
    try:
        conn = sqlite3.connect(db_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, questions, total_questions, created_date
            FROM quizzes 
            WHERE article_id = ?
        ''', (article_id,))
        
        quiz_row = cursor.fetchone()
        
        if not quiz_row:
            conn.close()
            return jsonify({'success': False, 'error': 'Quiz not found'}), 404
        
        quiz_id, title, questions_json, total_questions, created_date = quiz_row
        questions = json.loads(questions_json)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'quiz': {
                'id': quiz_id,
                'article_id': article_id,
                'title': title,
                'questions': questions,
                'total_questions': total_questions,
                'created_date': created_date
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching quiz: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate/quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz for an article"""
    try:
        data = request.get_json()
        article_id = data.get('article_id')
        
        if not article_id:
            return jsonify({'success': False, 'error': 'article_id required'}), 400
        
        # Import and run quiz generation
        import sys
        import os
        sys.path.append(os.path.dirname(__file__))
        from generate_quiz import generate_quiz_for_article
        
        quiz_id = generate_quiz_for_article(article_id)
        
        if quiz_id:
            return jsonify({
                'success': True,
                'quiz_id': quiz_id,
                'message': 'Quiz generated successfully'
            })
        else:
            return jsonify({'success': False, 'error': 'Failed to generate quiz'}), 500
            
    except Exception as e:
        logger.error(f"Error generating quiz: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/videos/<filename>')
def serve_video(filename):
    """Serve video files"""
    try:
        return send_from_directory('videos', filename)
    except FileNotFoundError:
        return jsonify({'error': 'Video not found'}), 404

@app.route('/thumbnails/<filename>')
def serve_thumbnail(filename):
    """Serve thumbnail files"""
    try:
        return send_from_directory('thumbnails', filename)
    except FileNotFoundError:
        return jsonify({'error': 'Thumbnail not found'}), 404

# Editorial Portal Routes
@app.route('/editorial/')
def editorial_portal():
    """Main editorial portal"""
    candidates = editorial_workflow.get_pending_candidates()
    approved_stories = editorial_workflow.get_approved_stories()
    
    return render_template_string(EDITORIAL_PORTAL_TEMPLATE, 
                                candidates=candidates,
                                total_candidates=len(candidates),
                                approved_count=len(approved_stories),
                                pending_count=len(candidates),
                                today_date=datetime.now().strftime('%A, %B %d, %Y'))

@app.route('/editorial/generate', methods=['POST'])
def generate_candidates():
    """Generate new candidate stories"""
    try:
        count = int(request.form.get('count', 20))
        editorial_workflow.generate_weekly_candidates(count)
        flash(f'✅ Generated {count} new candidate stories!', 'success')
    except Exception as e:
        flash(f'❌ Error generating stories: {e}', 'error')
    
    return redirect(url_for('editorial_portal'))

@app.route('/editorial/review-story', methods=['POST'])
def review_story():
    """Handle story review actions"""
    candidate_id = request.form['candidate_id']
    action = request.form['action']
    editor_notes = request.form.get('editor_notes', '')
    
    try:
        if action == 'approve':
            editorial_workflow.approve_story(candidate_id, editor_notes=editor_notes)
            flash(f'✅ Story approved successfully!', 'success')
        elif action == 'reject':
            editorial_workflow.reject_story(candidate_id, editor_notes=editor_notes)
            flash(f'❌ Story rejected', 'error')
    except Exception as e:
        flash(f'❌ Error: {e}', 'error')
    
    return redirect(url_for('editorial_portal'))

@app.route('/editorial/process-approved', methods=['POST'])
def process_approved():
    """Process all approved stories"""
    try:
        editorial_workflow.process_approved_stories()
        flash('🎉 All approved stories have been processed and published!', 'success')
    except Exception as e:
        flash(f'❌ Error processing stories: {e}', 'error')
    
    return redirect(url_for('editorial_portal'))

# Initialize sample data for testing
def initialize_sample_data():
    """Initialize sample data for testing"""
    try:
        conn = sqlite3.connect(db_manager.db_path)
        cursor = conn.cursor()
        
        # Check if we already have articles
        cursor.execute("SELECT COUNT(*) FROM articles")
        if cursor.fetchone()[0] == 0:
            # Add sample articles
            sample_articles = [
                {
                    'id': 'solar-robot-saves-environment-20250906',
                    'title': 'Kids Create Amazing Solar Robot to Save Environment',
                    'headline': 'Kids Create Amazing Solar Robot to Save Environment',
                    'content': 'A group of brilliant students from Green Valley School invented an incredible solar-powered robot that helps clean parks and protect our environment! The robot uses special solar panels to collect energy from the sun, so it doesn\'t need any harmful fuel. The students worked with their teacher for six months to build this amazing invention. The solar robot can work for 8 hours on a sunny day without stopping! This shows how young people can create solutions to help our planet.',
                    'summary': 'Students create solar-powered robot that cleans parks using renewable energy.',
                    'category': 'technology',
                    'author': 'Junior Science Team',
                    'published_date': datetime.now().isoformat(),
                    'read_time': '3 min read',
                    'is_trending': True
                },
                {
                    'id': 'ocean-cleanup-saves-animals-20250906',
                    'title': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
                    'headline': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
                    'content': 'An incredible robot named "Ocean Helper" has saved over 1,000 sea animals from plastic pollution! The robot was created by marine scientists in California. It swims through the ocean like a friendly whale, collecting plastic bottles, bags, and other trash that hurt sea creatures. Since it started working, Ocean Helper has cleaned 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes.',
                    'summary': 'Ocean-cleaning robot saves marine life by removing plastic pollution.',
                    'category': 'environment',
                    'author': 'Ocean News Team',
                    'published_date': (datetime.now() - timedelta(hours=2)).isoformat(),
                    'read_time': '4 min read',
                    'is_hot': True
                },
                {
                    'id': 'young-scientists-medicine-breakthrough-20250906',
                    'title': 'Young Scientists Help Create New Medicine for Kids',
                    'headline': 'Young Scientists Help Create New Medicine for Kids',
                    'content': 'Amazing young scientists have helped create a new medicine that helps children with allergies stay safe and healthy! The medicine works like a superhero shield, protecting kids from dangerous allergic reactions. The research team worked with students from Science Academy to test and improve the medicine. This breakthrough will help millions of children around the world feel safer when eating and playing.',
                    'summary': 'Young scientists contribute to breakthrough medicine for childhood allergies.',
                    'category': 'health',
                    'author': 'Dr. Health News',
                    'published_date': (datetime.now() - timedelta(hours=4)).isoformat(),
                    'read_time': '3 min read',
                    'is_breaking': True
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
                    article['published_date'], article['read_time'], 0, 0, 0,
                    article.get('is_breaking', False), article.get('is_trending', False),
                    article.get('is_hot', False)
                ))
            
            logger.info("Sample articles added to database")
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        logger.error(f"Error initializing sample data: {e}")

# Video interaction endpoints
@app.route('/api/videos/<video_id>/like', methods=['POST'])
def handle_video_like(video_id):
    """Handle video like/unlike"""
    try:
        data = request.get_json()
        liked = data.get('liked', False)
        
        # In a real app, you would update user preferences or interaction table
        # For now, we'll just return success
        logger.info(f"Video {video_id} {'liked' if liked else 'unliked'}")
        return jsonify({'success': True, 'liked': liked})
        
    except Exception as e:
        logger.error(f"Error handling video like: {e}")
        return jsonify({'error': 'Failed to update like status'}), 500


@app.route('/api/videos/<video_id>/bookmark', methods=['POST'])
def handle_video_bookmark(video_id):
    """Handle video bookmark/unbookmark"""
    try:
        data = request.get_json()
        bookmarked = data.get('bookmarked', False)
        
        # In a real app, you would update user bookmarks table
        # For now, we'll just return success
        logger.info(f"Video {video_id} {'bookmarked' if bookmarked else 'unbookmarked'}")
        return jsonify({'success': True, 'bookmarked': bookmarked})
        
    except Exception as e:
        logger.error(f"Error handling video bookmark: {e}")
        return jsonify({'error': 'Failed to update bookmark status'}), 500


if __name__ == '__main__':
    # Initialize sample data
    initialize_sample_data()
    
    # Start automation scheduler
    automation_scheduler.start()
    
    # Run the Flask app
    port = int(os.getenv('PORT', 5002))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info("🚀 Starting Junior News Digest Integrated Backend")
    logger.info(f"📱 API available at: http://localhost:{port}/api/")
    logger.info(f"📝 Editorial Portal at: http://localhost:{port}/editorial/")
    logger.info(f"⚙️ Automation scheduler: {'Running' if automation_scheduler.running else 'Stopped'}")
    
    try:
        app.run(host='0.0.0.0', port=port, debug=debug)
    finally:
        # Clean shutdown
        automation_scheduler.stop()
        logger.info("Backend shutdown complete")
