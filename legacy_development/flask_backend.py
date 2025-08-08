#!/usr/bin/env python3
"""
Flask Backend for Kids Newsletter
Handles email subscriptions and automatic newsletter sending
"""

from flask import Flask, request, jsonify, render_template_string, send_from_directory, make_response
from flask_cors import CORS
import sqlite3
import smtplib
import schedule
import time
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from pathlib import Path
import os
import logging
from typing import List

from .config import Config
from .news_scraper import NewsScraper, NewsArticle
from .content_processor import ContentProcessor
from .web_newsletter_generator import WebNewsletterGenerator

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Basic shared-secret auth for admin endpoints
ADMIN_SHARED_SECRET = os.getenv('ADMIN_SHARED_SECRET', '')

def is_authorized(req) -> bool:
    token = req.headers.get('X-Admin-Secret') or req.args.get('secret')
    return bool(ADMIN_SHARED_SECRET) and token == ADMIN_SHARED_SECRET

class NewsletterBackend:
    def __init__(self):
        self.config = Config()
        self.scraper = NewsScraper()
        self.processor = ContentProcessor()
        self.generator = WebNewsletterGenerator()
        # Shared content DB path used by automation system
        self.content_db_path = Path('kids_news_content') / 'content_tracking.db'
        self.init_database()

    def init_database(self):
        """Initialize SQLite database for email subscriptions"""
        try:
            conn = sqlite3.connect('newsletter_subscribers.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    subscribed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    active BOOLEAN DEFAULT TRUE
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Database initialization error: {e}")

        # Content selection DB and push tokens table
        try:
            self.content_db_path.parent.mkdir(parents=True, exist_ok=True)
            conn = sqlite3.connect(self.content_db_path)
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS push_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    token TEXT UNIQUE,
                    platform TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS admin_selections (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    week_folder TEXT,
                    story_id TEXT,
                    admin_email TEXT,
                    selection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    day_assignment TEXT
                )
            ''')
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Content DB init error: {e}")

    def add_subscriber(self, email: str) -> bool:
        """Add new email subscriber"""
        try:
            conn = sqlite3.connect('newsletter_subscribers.db')
            cursor = conn.cursor()
            
            cursor.execute(
                'INSERT INTO subscribers (email) VALUES (?)',
                (email,)
            )
            
            conn.commit()
            conn.close()
            logger.info(f"New subscriber added: {email}")
            return True
        except sqlite3.IntegrityError:
            logger.warning(f"Email already subscribed: {email}")
            return False
        except Exception as e:
            logger.error(f"Error adding subscriber: {e}")
            return False

    def get_all_subscribers(self) -> List[str]:
        """Get all active subscribers"""
        try:
            conn = sqlite3.connect('newsletter_subscribers.db')
            cursor = conn.cursor()
            
            cursor.execute(
                'SELECT email FROM subscribers WHERE active = TRUE'
            )
            
            subscribers = [row[0] for row in cursor.fetchall()]
            conn.close()
            return subscribers
        except Exception as e:
            logger.error(f"Error getting subscribers: {e}")
            return []

    def generate_daily_newsletter(self) -> str:
        """Generate today's newsletter"""
        try:
            # Scrape news
            logger.info("Generating daily newsletter...")
            raw_articles = self.scraper.fetch_all_news()
            
            if not raw_articles:
                logger.warning("No articles found. Creating newsletter with activities only.")
                processed_articles = []
            else:
                # Process content for kids
                processed_articles = []
                for article in raw_articles:
                    try:
                        processed_article = self.processor.simplify_for_kids(article)
                        processed_articles.append(processed_article)
                    except Exception as e:
                        logger.error(f"Error processing article: {e}")
                        continue
            
            # Generate newsletter HTML
            html_content = self.generator.create_web_newsletter(processed_articles)
            
            # Save newsletter
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"daily_newsletter_{date_str}.html"
            filepath = self.generator.save_newsletter(html_content, filename)
            
            logger.info(f"Daily newsletter generated: {filepath}")
            return html_content
            
        except Exception as e:
            logger.error(f"Error generating newsletter: {e}")
            return None

    def send_newsletter_emails(self):
        """Send newsletter to all subscribers"""
        try:
            if not self.config.EMAIL_USER or not self.config.EMAIL_PASSWORD:
                logger.warning("Email credentials not configured. Skipping email sending.")
                return False

            # Generate newsletter
            html_content = self.generate_daily_newsletter()
            if not html_content:
                logger.error("Failed to generate newsletter")
                return False

            # Get subscribers
            subscribers = self.get_all_subscribers()
            if not subscribers:
                logger.info("No subscribers found")
                return True

            # Set up email server
            server = smtplib.SMTP(self.config.SMTP_SERVER, self.config.SMTP_PORT)
            server.starttls()
            server.login(self.config.EMAIL_USER, self.config.EMAIL_PASSWORD)

            # Send to each subscriber
            sent_count = 0
            for email in subscribers:
                try:
                    msg = MIMEMultipart('alternative')
                    msg['From'] = self.config.EMAIL_USER
                    msg['To'] = email
                    msg['Subject'] = f"{self.config.NEWSLETTER_TITLE} - {datetime.now().strftime('%B %d, %Y')}"

                    # Create HTML part
                    html_part = MIMEText(html_content, 'html')
                    msg.attach(html_part)

                    # Send email
                    server.send_message(msg)
                    sent_count += 1
                    logger.info(f"Newsletter sent to: {email}")

                except Exception as e:
                    logger.error(f"Failed to send to {email}: {e}")

            server.quit()
            logger.info(f"Newsletter sent to {sent_count} subscribers")
            return True

        except Exception as e:
            logger.error(f"Error sending newsletters: {e}")
            return False

# Initialize backend
backend = NewsletterBackend()

@app.route('/')
def index():
    """Serve the latest newsletter"""
    try:
        # Generate fresh newsletter
        html_content = backend.generate_daily_newsletter()
        if html_content:
            return html_content
        else:
            return "Newsletter temporarily unavailable", 500
    except Exception as e:
        logger.error(f"Error serving index: {e}")
        return "Error loading newsletter", 500

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    """Handle email subscription"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Add subscriber
        success = backend.add_subscriber(email)
        
        if success:
            logger.info(f"New subscription: {email}")
            return jsonify({'message': 'Successfully subscribed!'}), 200
        else:
            return jsonify({'message': 'Already subscribed!'}), 200
            
    except Exception as e:
        logger.error(f"Subscription error: {e}")
        return jsonify({'error': 'Subscription failed'}), 500

@app.route('/api/register-push-token', methods=['POST'])
def register_push_token():
    """Register Expo push tokens from mobile app"""
    try:
        data = request.get_json()
        token = data.get('token')
        platform = data.get('platform', 'unknown')
        if not token:
            return jsonify({'error': 'Token is required'}), 400

        conn = sqlite3.connect(backend.content_db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT OR IGNORE INTO push_tokens (token, platform) VALUES (?, ?)', (token, platform))
        conn.commit()
        conn.close()
        return jsonify({'ok': True}), 200
    except Exception as e:
        logger.error(f"Push token register error: {e}")
        return jsonify({'error': 'Failed to register token'}), 500

@app.route('/api/weekly/curated', methods=['GET'])
def get_curated_stories():
    """Return curated stories for a given week (or current)."""
    try:
        if not is_authorized(request):
            return jsonify({'error': 'unauthorized'}), 401
        week = request.args.get('week')
        conn = sqlite3.connect(backend.content_db_path)
        cursor = conn.cursor()
        if week:
            cursor.execute('SELECT id, title, category, content FROM weekly_content WHERE week_folder = ?', (week,))
        else:
            cursor.execute('SELECT week_folder FROM weekly_content ORDER BY created_date DESC LIMIT 1')
            row = cursor.fetchone()
            if not row:
                conn.close()
                return jsonify({'stories': []})
            week = row[0]
            cursor.execute('SELECT id, title, category, content FROM weekly_content WHERE week_folder = ?', (week,))
        stories = [
            { 'id': r[0], 'title': r[1], 'category': r[2], 'content': r[3] }
            for r in cursor.fetchall()
        ]
        conn.close()
        return jsonify({'week': week, 'stories': stories})
    except Exception as e:
        logger.error(f"Get curated stories error: {e}")
        return jsonify({'error': 'Failed to get stories'}), 500

@app.route('/api/select-story', methods=['POST'])
def select_story():
    """Mark a story as selected for a specific day."""
    try:
        if not is_authorized(request):
            return jsonify({'error': 'unauthorized'}), 401
        data = request.get_json()
        story_id = data.get('storyId')
        day = data.get('day')
        week = data.get('week')
        admin_email = data.get('admin', 'manual@admin')
        if not story_id or not day or not week:
            return jsonify({'error': 'storyId, day, and week are required'}), 400

        conn = sqlite3.connect(backend.content_db_path)
        cursor = conn.cursor()
        cursor.execute('UPDATE weekly_content SET selected = 1 WHERE id = ?', (story_id,))
        cursor.execute('''
            INSERT INTO admin_selections (week_folder, story_id, admin_email, day_assignment)
            VALUES (?, ?, ?, ?)
        ''', (week, story_id, admin_email, day))
        conn.commit()
        conn.close()
        return jsonify({'ok': True})
    except Exception as e:
        logger.error(f"Select story error: {e}")
        return jsonify({'error': 'Failed to select story'}), 500

@app.route('/admin/weekly')
def weekly_admin():
    """Simple admin UI to select stories."""
    try:
        if not is_authorized(request):
            return "Unauthorized", 401
        # Load latest curated stories
        conn = sqlite3.connect(backend.content_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT week_folder FROM weekly_content ORDER BY created_date DESC LIMIT 1')
        row = cursor.fetchone()
        week = row[0] if row else ''
        stories = []
        if week:
            cursor.execute('SELECT id, title, category, content FROM weekly_content WHERE week_folder = ?', (week,))
            stories = cursor.fetchall()
        conn.close()

        story_cards = ''.join([
            f'''<div class="story"><h3>{i+1}. {s[1]}</h3>
            <p><strong>{s[2]}</strong></p>
            <p>{(s[3] or '')[:160]}...</p>
            <button onclick="pick('{s[0]}','tuesday')">Tuesday</button>
            <button onclick="pick('{s[0]}','wednesday')">Wednesday</button>
            <button onclick="pick('{s[0]}','friday')">Friday</button>
            </div>'''
            for i, s in enumerate(stories)
        ])

        html = f'''
        <html><head><title>Weekly Selection</title>
        <style>
        body {{ font-family: sans-serif; max-width: 840px; margin: 24px auto; }}
        .story {{ border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin: 12px 0; }}
        button {{ margin-right: 8px; }}
        </style></head>
        <body>
        <h2>Kids Daily News – Select Stories for {week}</h2>
        {story_cards or '<p>No stories curated yet.</p>'}
        <script>
        function pick(storyId, day) {{
          fetch('/api/select-story', {{method:'POST', headers:{{'Content-Type':'application/json'}}, body:JSON.stringify({{storyId, day, week:'{week}'}})}})
            .then(r=>r.json()).then(_=>alert('Selected '+storyId+' for '+day));
        }}
        </script>
        </body></html>
        '''
        return html
    except Exception as e:
        logger.error(f"Weekly admin error: {e}")
        return "Admin error", 500

@app.route('/audio/<week>/<path:filename>')
def serve_audio(week: str, filename: str):
    """Serve generated audio files for podcast feed."""
    base = Path('kids_news_content') / week / 'generated_audio'
    return send_from_directory(base, filename)

@app.route('/sample-audio/<label>/<path:filename>')
def serve_sample_audio(label: str, filename: str):
    """Serve fallback sample audio files used when weekly audio isn't present."""
    base_map = {
        'current_batch': Path('legacy_development/fully_automatic_videos/current_batch/audio'),
        'current_week': Path('legacy_development/story_based_videos/current_week/audio'),
    }
    base = base_map.get(label)
    if not base:
        return jsonify({'error': 'unknown label'}), 404
    return send_from_directory(base, filename)

@app.route('/podcast/feed.xml')
def serve_podcast_feed():
    """Serve the podcast RSS feed. If missing, generate a minimal feed on the fly."""
    base = Path('kids_news_content') / 'podcast'
    feed_path = base / 'feed.xml'
    try:
        if not feed_path.exists():
            base.mkdir(parents=True, exist_ok=True)

            site_url = os.getenv('PODCAST_SITE_URL', request.host_url.rstrip('/'))
            title = getattr(backend.config, 'NEWSLETTER_TITLE', 'Kids Daily News')
            description = (
                'Junior News Digest is a kid‑safe news show with short, positive stories '
                'about science, animals, space, technology, sports, and kindness.'
            )
            author = os.getenv('PODCAST_AUTHOR', 'Junior News Digest')
            contact_email = os.getenv('PODCAST_CONTACT_EMAIL', os.getenv('EMAIL_USER', 'podcast@example.com'))

            # Discover recent audio files under kids_news_content/*_week/generated_audio/*.mp3
            items_xml = []
            root = Path('kids_news_content')
            audio_files = []
            for week_dir in sorted(root.glob('*_week'), reverse=True):
                audio_dir = week_dir / 'generated_audio'
                if audio_dir.exists():
                    for mp3 in sorted(audio_dir.glob('*.mp3'), key=lambda p: p.stat().st_mtime, reverse=True):
                        audio_files.append((week_dir.name, mp3))
                if len(audio_files) >= 12:
                    break

            for week_name, mp3 in audio_files[:12]:
                pub_ts = mp3.stat().st_mtime
                pub_date = datetime.utcfromtimestamp(pub_ts).strftime('%a, %d %b %Y %H:%M:%S GMT')
                audio_url = f"{site_url}/audio/{week_name}/{mp3.name}"
                item = f"""
                <item>
                  <title>{mp3.stem}</title>
                  <description>Kids Daily News episode</description>
                  <enclosure url="{audio_url}" type="audio/mpeg"/>
                  <guid isPermaLink="false">{week_name}-{mp3.name}</guid>
                  <pubDate>{pub_date}</pubDate>
                </item>
                """
                items_xml.append(item)

            # Fallback to sample audio paths in repo if no weekly audio exists
            if not items_xml:
                sample_map = {
                    'current_batch': Path('legacy_development/fully_automatic_videos/current_batch/audio'),
                    'current_week': Path('legacy_development/story_based_videos/current_week/audio'),
                }
                for label, dir_path in sample_map.items():
                    if dir_path.exists():
                        for mp3 in sorted(dir_path.glob('*.mp3'), key=lambda p: p.stat().st_mtime, reverse=True)[:3]:
                            pub_ts = mp3.stat().st_mtime
                            pub_date = datetime.utcfromtimestamp(pub_ts).strftime('%a, %d %b %Y %H:%M:%S GMT')
                            # Expose via static file server using send_from_directory route below
                            audio_url = f"{site_url}/sample-audio/{label}/{mp3.name}"
                            item = f"""
                            <item>
                              <title>{mp3.stem}</title>
                              <description>Sample episode</description>
                              <enclosure url=\"{audio_url}\" type=\"audio/mpeg\"/>
                              <guid isPermaLink=\"false\">sample-{label}-{mp3.name}</guid>
                              <pubDate>{pub_date}</pubDate>
                              <itunes:explicit>false</itunes:explicit>
                            </item>
                            """
                            items_xml.append(item)

            # iTunes/Apple tags for Spotify validation
            rss_xml = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
            <rss version=\"2.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:atom=\"http://www.w3.org/2005/Atom\">
              <channel>
                <title>{title}</title>
                <link>{site_url}</link>
                <description>{description}</description>
                <language>en</language>
                <atom:link href=\"{site_url}/podcast/feed.xml\" rel=\"self\" type=\"application/rss+xml\" />
                <itunes:author>{author}</itunes:author>
                <itunes:owner>
                  <itunes:name>{author}</itunes:name>
                  <itunes:email>{contact_email}</itunes:email>
                </itunes:owner>
                <itunes:explicit>false</itunes:explicit>
                <itunes:image href=\"{site_url}/podcast/cover.png\" />
                <itunes:category text=\"Kids &amp; Family\" />
                {''.join(items_xml)}
              </channel>
            </rss>"""

            feed_path.write_text(rss_xml, encoding='utf-8')

        # Serve the (now existing) file
        with open(feed_path, 'rb') as f:
            resp = make_response(f.read())
            resp.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
            return resp
    except Exception as e:
        logger.error(f"Podcast feed error: {e}")
        return jsonify({'error': 'Podcast feed unavailable'}), 500

@app.route('/podcast/cover.png')
def serve_podcast_cover():
    """Serve podcast cover art. Looks in content folder first, then falls back to app icon."""
    # Preferred location users can replace in deployment
    preferred = Path('kids_news_content') / 'podcast' / 'cover.png'
    if preferred.exists():
        return send_from_directory(preferred.parent, preferred.name)
    # Fallback to app icon if present
    fallback = Path('app_development') / 'kids_news_app_fixed' / 'assets' / 'icon.png'
    if fallback.exists():
        return send_from_directory(fallback.parent, fallback.name)
    # Not found
    return jsonify({'error': 'cover art not found'}), 404

@app.route('/api/subscribers', methods=['GET'])
def get_subscribers():
    """Get subscriber count (admin endpoint)"""
    try:
        subscribers = backend.get_all_subscribers()
        return jsonify({
            'count': len(subscribers),
            'message': f'{len(subscribers)} active subscribers'
        }), 200
    except Exception as e:
        logger.error(f"Error getting subscribers: {e}")
        return jsonify({'error': 'Failed to get subscribers'}), 500

@app.route('/api/send-newsletter', methods=['POST'])
def send_newsletter():
    """Manually trigger newsletter sending (admin endpoint)"""
    try:
        success = backend.send_newsletter_emails()
        if success:
            return jsonify({'message': 'Newsletter sent successfully!'}), 200
        else:
            return jsonify({'error': 'Failed to send newsletter'}), 500
    except Exception as e:
        logger.error(f"Error sending newsletter: {e}")
        return jsonify({'error': 'Newsletter sending failed'}), 500

@app.route('/admin')
def admin():
    """Simple admin dashboard"""
    try:
        subscribers = backend.get_all_subscribers()
        admin_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Newsletter Admin</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .card {{ background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px; }}
                button {{ background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }}
                button:hover {{ background: #45a049; }}
            </style>
        </head>
        <body>
            <h1>📰 Kids Newsletter Admin</h1>
            
            <div class="card">
                <h3>📊 Statistics</h3>
                <p><strong>Active Subscribers:</strong> {len(subscribers)}</p>
                <p><strong>Last Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
            
            <div class="card">
                <h3>📧 Actions</h3>
                <button onclick="sendNewsletter()">Send Newsletter Now</button>
                <button onclick="viewNewsletter()">View Latest Newsletter</button>
            </div>
            
            <div class="card">
                <h3>👥 Subscribers</h3>
                <p>Total: {len(subscribers)} emails</p>
                <details>
                    <summary>View all subscribers</summary>
                    <ul>
                        {''.join([f'<li>{email}</li>' for email in subscribers])}
                    </ul>
                </details>
            </div>
            
            <script>
                function sendNewsletter() {{
                    if (confirm('Send newsletter to all subscribers?')) {{
                        fetch('/api/send-newsletter', {{method: 'POST'}})
                            .then(response => response.json())
                            .then(data => alert(data.message || data.error))
                            .catch(error => alert('Error: ' + error));
                    }}
                }}
                
                function viewNewsletter() {{
                    window.open('/', '_blank');
                }}
            </script>
        </body>
        </html>
        """
        return admin_html
    except Exception as e:
        logger.error(f"Admin page error: {e}")
        return "Admin page error", 500

def run_scheduler():
    """Run the newsletter scheduler in a separate thread"""
    schedule.every().day.at("08:00").do(backend.send_newsletter_emails)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    # Start scheduler in background thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    logger.info("🚀 Kids Newsletter Backend Started!")
    logger.info("📧 Email signup available at /api/subscribe")
    logger.info("👨‍💼 Admin dashboard at /admin")
    logger.info("📰 Newsletter scheduled daily at 8:00 AM")
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5001, debug=False)