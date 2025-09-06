#!/usr/bin/env python3
"""
Junior News Digest - Production Backend API
Handles all app functionality: story management, video uploads, user data, etc.
"""

import os
import sys
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Any
import sqlite3
import logging
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size

CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('generated_videos/final', exist_ok=True)

@dataclass
class NewsArticle:
    id: str
    title: str
    headline: str
    content: str
    summary: str
    category: str
    author: str
    published_date: str
    read_time: str
    likes: int = 0
    views: int = 0
    comments: int = 0
    is_breaking: bool = False
    is_trending: bool = False
    is_hot: bool = False
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    quiz_id: Optional[str] = None

@dataclass
class Quiz:
    id: str
    article_id: str
    title: str
    questions: List[Dict[str, Any]]
    total_score: int
    created_date: str

@dataclass
class User:
    id: str
    username: str
    email: str
    avatar_emoji: str
    level: str
    stories_read: int = 0
    videos_watched: int = 0
    days_streak: int = 0
    dark_mode: bool = True
    notifications: bool = True
    auto_play: bool = False
    created_date: str = ""

class DatabaseManager:
    def __init__(self, db_path: str = "production.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
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
        
        # Quizzes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quizzes (
                id TEXT PRIMARY KEY,
                article_id TEXT NOT NULL,
                title TEXT NOT NULL,
                questions TEXT NOT NULL,
                total_score INTEGER NOT NULL,
                created_date TEXT NOT NULL,
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
                notifications BOOLEAN DEFAULT TRUE,
                auto_play BOOLEAN DEFAULT FALSE,
                created_date TEXT NOT NULL,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        
        # User bookmarks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookmarks (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                article_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (article_id) REFERENCES articles (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    
    def execute_query(self, query: str, params: tuple = ()) -> List[Dict]:
        """Execute a query and return results as list of dictionaries"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        results = [dict(row) for row in cursor.fetchall()]
        conn.commit()
        conn.close()
        return results
    
    def insert_article(self, article: NewsArticle) -> bool:
        """Insert a new article into the database"""
        try:
            query = '''
                INSERT INTO articles (
                    id, title, headline, content, summary, category, author,
                    published_date, read_time, likes, views, comments,
                    is_breaking, is_trending, is_hot, video_url, thumbnail_url, quiz_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            '''
            params = (
                article.id, article.title, article.headline, article.content,
                article.summary, article.category, article.author,
                article.published_date, article.read_time, article.likes,
                article.views, article.comments, article.is_breaking,
                article.is_trending, article.is_hot, article.video_url,
                article.thumbnail_url, article.quiz_id
            )
            self.execute_query(query, params)
            return True
        except Exception as e:
            logger.error(f"Error inserting article: {e}")
            return False

# Initialize database
db = DatabaseManager()

# Helper functions
def generate_jwt_token(user_id: str) -> str:
    """Generate JWT token for user authentication"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_jwt_token(token: str) -> Optional[str]:
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def allowed_file(filename: str) -> bool:
    """Check if uploaded file has allowed extension"""
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# API Routes

@app.route('/', methods=['GET'])
def root():
    """Root endpoint for testing"""
    return jsonify({
        'message': 'Junior News Digest API is running',
        'version': '1.0.0',
        'endpoints': ['/health', '/api/articles', '/api/videos']
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Get all articles with optional filtering"""
    try:
        category = request.args.get('category')
        breaking_only = request.args.get('breaking') == 'true'
        limit = int(request.args.get('limit', 50))
        
        query = "SELECT * FROM articles WHERE 1=1"
        params = []
        
        if category:
            query += " AND category = ?"
            params.append(category)
        
        if breaking_only:
            query += " AND is_breaking = 1"
        
        query += " ORDER BY published_date DESC LIMIT ?"
        params.append(limit)
        
        articles = db.execute_query(query, tuple(params))
        return jsonify({'success': True, 'articles': articles})
    
    except Exception as e:
        logger.error(f"Error fetching articles: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/articles/<article_id>', methods=['GET'])
def get_article(article_id: str):
    """Get a specific article by ID"""
    try:
        query = "SELECT * FROM articles WHERE id = ?"
        articles = db.execute_query(query, (article_id,))
        
        if not articles:
            return jsonify({'success': False, 'error': 'Article not found'}), 404
        
        article = articles[0]
        
        # Update view count
        update_query = "UPDATE articles SET views = views + 1 WHERE id = ?"
        db.execute_query(update_query, (article_id,))
        
        return jsonify({'success': True, 'article': article})
    
    except Exception as e:
        logger.error(f"Error fetching article {article_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/articles/<article_id>/quiz', methods=['GET'])
def get_article_quiz(article_id: str):
    """Get quiz for a specific article"""
    try:
        query = "SELECT * FROM quizzes WHERE article_id = ?"
        quizzes = db.execute_query(query, (article_id,))
        
        if not quizzes:
            return jsonify({'success': False, 'error': 'Quiz not found'}), 404
        
        quiz = quizzes[0]
        quiz['questions'] = json.loads(quiz['questions'])
        
        return jsonify({'success': True, 'quiz': quiz})
    
    except Exception as e:
        logger.error(f"Error fetching quiz for article {article_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Get all videos"""
    try:
        status = request.args.get('status')
        limit = int(request.args.get('limit', 20))
        
        query = "SELECT * FROM videos WHERE 1=1"
        params = []
        
        if status:
            query += " AND status = ?"
            params.append(status)
        
        query += " ORDER BY upload_date DESC LIMIT ?"
        params.append(limit)
        
        videos = db.execute_query(query, tuple(params))
        return jsonify({'success': True, 'videos': videos})
    
    except Exception as e:
        logger.error(f"Error fetching videos: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/videos/upload', methods=['POST'])
def upload_video():
    """Upload a new video"""
    try:
        if 'video' not in request.files:
            return jsonify({'success': False, 'error': 'No video file provided'}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file type'}), 400
        
        # Generate unique filename
        video_id = str(uuid.uuid4())
        filename = secure_filename(f"{video_id}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save file
        file.save(filepath)
        
        # Get additional data
        title = request.form.get('title', 'Untitled Video')
        description = request.form.get('description', '')
        article_id = request.form.get('article_id')
        
        # Insert into database
        query = '''
            INSERT INTO videos (id, article_id, title, description, file_path, status)
            VALUES (?, ?, ?, ?, ?, 'ready')
        '''
        db.execute_query(query, (video_id, article_id, title, description, filepath))
        
        logger.info(f"Video uploaded successfully: {filename}")
        return jsonify({
            'success': True,
            'video_id': video_id,
            'message': 'Video uploaded successfully'
        })
    
    except Exception as e:
        logger.error(f"Error uploading video: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/videos/<video_id>/stream', methods=['GET'])
def stream_video(video_id: str):
    """Stream a video file"""
    try:
        query = "SELECT file_path FROM videos WHERE id = ?"
        videos = db.execute_query(query, (video_id,))
        
        if not videos:
            return jsonify({'success': False, 'error': 'Video not found'}), 404
        
        file_path = videos[0]['file_path']
        
        if not os.path.exists(file_path):
            return jsonify({'success': False, 'error': 'Video file not found'}), 404
        
        return send_file(file_path, as_attachment=False)
    
    except Exception as e:
        logger.error(f"Error streaming video {video_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate/story', methods=['POST'])
def generate_story():
    """Generate a new story from current news"""
    try:
        data = request.get_json()
        topic = data.get('topic', 'general')
        
        # This would integrate with your existing story generation system
        from weekly_content_system import WeeklyContentSystem
        
        content_system = WeeklyContentSystem()
        stories = content_system.curate_stories(limit=1, category=topic)
        
        if not stories:
            return jsonify({'success': False, 'error': 'No stories found'}), 404
        
        story = stories[0]
        
        # Convert to NewsArticle format
        article = NewsArticle(
            id=str(uuid.uuid4()),
            title=story.title,
            headline=story.title,
            content=story.content,
            summary=story.content[:200] + "...",
            category=story.category,
            author="Junior News Team",
            published_date=datetime.utcnow().isoformat(),
            read_time="3 min read"
        )
        
        # Save to database
        db.insert_article(article)
        
        return jsonify({'success': True, 'article': asdict(article)})
    
    except Exception as e:
        logger.error(f"Error generating story: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate/video', methods=['POST'])
def generate_video():
    """Generate video for an article"""
    try:
        data = request.get_json()
        article_id = data.get('article_id')
        
        if not article_id:
            return jsonify({'success': False, 'error': 'Article ID required'}), 400
        
        # Get article
        query = "SELECT * FROM articles WHERE id = ?"
        articles = db.execute_query(query, (article_id,))
        
        if not articles:
            return jsonify({'success': False, 'error': 'Article not found'}), 404
        
        article = articles[0]
        
        # This would integrate with your existing video generation system
        video_id = str(uuid.uuid4())
        
        # Mark video as processing
        query = '''
            INSERT INTO videos (id, article_id, title, description, file_path, status)
            VALUES (?, ?, ?, ?, ?, 'processing')
        '''
        db.execute_query(query, (
            video_id, article_id, f"Video: {article['title']}", 
            article['summary'], f"generated_videos/final/{video_id}.mp4", 'processing'
        ))
        
        # TODO: Trigger actual video generation in background
        # For now, we'll simulate it
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'status': 'processing',
            'message': 'Video generation started'
        })
    
    except Exception as e:
        logger.error(f"Error generating video: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate/quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz for an article"""
    try:
        data = request.get_json()
        article_id = data.get('article_id')
        
        if not article_id:
            return jsonify({'success': False, 'error': 'Article ID required'}), 400
        
        # Get article
        query = "SELECT * FROM articles WHERE id = ?"
        articles = db.execute_query(query, (article_id,))
        
        if not articles:
            return jsonify({'success': False, 'error': 'Article not found'}), 404
        
        article = articles[0]
        
        # Generate quiz questions based on article content
        quiz_questions = [
            {
                "id": "q1",
                "question": f"What is the main topic of '{article['title']}'?",
                "options": {
                    "A": article['category'],
                    "B": "Sports",
                    "C": "Weather",
                    "D": "Entertainment"
                },
                "correct_answer": "A",
                "explanation": f"The article is categorized under {article['category']}."
            },
            {
                "id": "q2",
                "question": "Who wrote this article?",
                "options": {
                    "A": "Unknown Author",
                    "B": article['author'],
                    "C": "AI Assistant",
                    "D": "News Robot"
                },
                "correct_answer": "B",
                "explanation": f"This article was written by {article['author']}."
            },
            {
                "id": "q3",
                "question": "How long does it take to read this article?",
                "options": {
                    "A": "1 minute",
                    "B": "5 minutes",
                    "C": article['read_time'],
                    "D": "10 minutes"
                },
                "correct_answer": "C",
                "explanation": f"The estimated reading time is {article['read_time']}."
            }
        ]
        
        quiz_id = str(uuid.uuid4())
        quiz = Quiz(
            id=quiz_id,
            article_id=article_id,
            title=f"Quiz: {article['title']}",
            questions=quiz_questions,
            total_score=len(quiz_questions),
            created_date=datetime.utcnow().isoformat()
        )
        
        # Save quiz to database
        query = '''
            INSERT INTO quizzes (id, article_id, title, questions, total_score, created_date)
            VALUES (?, ?, ?, ?, ?, ?)
        '''
        db.execute_query(query, (
            quiz.id, quiz.article_id, quiz.title, 
            json.dumps(quiz.questions), quiz.total_score, quiz.created_date
        ))
        
        # Update article with quiz_id
        update_query = "UPDATE articles SET quiz_id = ? WHERE id = ?"
        db.execute_query(update_query, (quiz_id, article_id))
        
        return jsonify({'success': True, 'quiz': asdict(quiz)})
    
    except Exception as e:
        logger.error(f"Error generating quiz: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

def initialize_sample_data():
    """Initialize database with sample articles and videos for testing"""
    try:
        # Sample articles
        sample_articles = [
            {
                'id': '1',
                'title': 'Amazing Ocean Robot Saves Sea Animals',
                'headline': 'Young Inventors Create Ocean-Cleaning Robot',
                'content': 'Students from Marine Tech Academy created an incredible robot that cleans plastic from our oceans! The robot, nicknamed "Wally the Whale," swims through the water collecting harmful plastic that could hurt sea animals. It uses special sensors to find pollution and runs on solar power, making it completely eco-friendly. Since starting work, Wally has cleaned over 10,000 pounds of plastic from the Pacific Ocean! This amazing invention shows how young people can make a real difference in protecting our planet.',
                'summary': 'Brilliant students develop advanced robot that removes plastic waste from oceans with unprecedented efficiency.',
                'category': 'science',
                'author': 'BBC Newsround',
                'published_date': datetime.utcnow().isoformat(),
                'read_time': '3 min read',
                'likes': 245,
                'views': 1200,
                'comments': 18,
                'is_breaking': False,
                'is_trending': True,
                'is_hot': False,
                'video_url': None,
                'thumbnail_url': None,
                'quiz_id': 'q1'
            },
            {
                'id': '2',
                'title': 'Kids Plant 1000 Trees in Local Park',
                'headline': 'Young Environmental Heroes Take Action',
                'content': 'Children from three local schools joined together for an amazing tree-planting event! Over 200 kids worked together to plant 1000 new trees in Greenfield Park. The trees will help clean the air and provide homes for birds and squirrels. The mayor said it was the biggest community environmental project the town has ever seen! Each child got to plant their own tree and will visit to watch it grow.',
                'summary': 'Local students organize massive tree-planting initiative to help the environment.',
                'category': 'environment',
                'author': 'Local News Team',
                'published_date': (datetime.utcnow() - timedelta(days=1)).isoformat(),
                'read_time': '2 min read',
                'likes': 189,
                'views': 890,
                'comments': 12,
                'is_breaking': False,
                'is_trending': False,
                'is_hot': True,
                'video_url': None,
                'thumbnail_url': None,
                'quiz_id': 'q2'
            },
            {
                'id': '3',
                'title': 'New Space Discovery Amazes Scientists',
                'headline': 'Telescope Finds Colorful New Planet',
                'content': 'Scientists using a powerful space telescope discovered a beautiful new planet that has amazing rainbow-colored clouds! The planet is far away in another solar system and is covered in clouds that change colors like a rainbow. Scientists think the different colors come from special crystals in the atmosphere. This discovery helps us learn more about planets beyond our solar system and shows how amazing space can be!',
                'summary': 'Astronomers discover a fascinating rainbow planet with colorful crystal clouds.',
                'category': 'science',
                'author': 'Space News Kids',
                'published_date': (datetime.utcnow() - timedelta(days=2)).isoformat(),
                'read_time': '3 min read',
                'likes': 312,
                'views': 1450,
                'comments': 25,
                'is_breaking': True,
                'is_trending': True,
                'is_hot': True,
                'video_url': None,
                'thumbnail_url': None,
                'quiz_id': 'q3'
            }
        ]

        # Insert sample articles
        for article in sample_articles:
            query = """
                INSERT OR REPLACE INTO articles 
                (id, title, headline, content, summary, category, author, published_date, read_time, 
                 likes, views, comments, is_breaking, is_trending, is_hot, video_url, thumbnail_url, quiz_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            db.execute_query(query, (
                article['id'], article['title'], article['headline'], article['content'],
                article['summary'], article['category'], article['author'], article['published_date'],
                article['read_time'], article['likes'], article['views'], article['comments'],
                article['is_breaking'], article['is_trending'], article['is_hot'],
                article['video_url'], article['thumbnail_url'], article['quiz_id']
            ))

        # Sample videos
        sample_videos = [
            {
                'id': 'v1',
                'title': 'Amazing Ocean Robot Saves Sea Animals',
                'url': 'https://example.com/video1.mp4',
                'thumbnail_url': 'https://example.com/thumb1.jpg',
                'duration': '4:32',
                'category': 'science',
                'views': 2400,
                'upload_date': datetime.utcnow().isoformat(),
                'status': 'ready'
            },
            {
                'id': 'v2',
                'title': 'Kids Plant 1000 Trees Adventure',
                'url': 'https://example.com/video2.mp4',
                'thumbnail_url': 'https://example.com/thumb2.jpg',
                'duration': '3:15',
                'category': 'environment',
                'views': 1800,
                'upload_date': (datetime.utcnow() - timedelta(days=1)).isoformat(),
                'status': 'ready'
            }
        ]

        # Insert sample videos
        for video in sample_videos:
            query = """
                INSERT OR REPLACE INTO videos 
                (id, title, url, thumbnail_url, duration, category, views, upload_date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            db.execute_query(query, (
                video['id'], video['title'], video['url'], video['thumbnail_url'],
                video['duration'], video['category'], video['views'], video['upload_date'], video['status']
            ))

        logger.info("✅ Sample data initialized successfully")
        
    except Exception as e:
        logger.error(f"Error initializing sample data: {e}")

if __name__ == '__main__':
    # Initialize database and sample data
    db.initialize_database()
    initialize_sample_data()
    
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Junior News Digest Backend API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
