#!/usr/bin/env python3
"""
Kids Daily News - Complete Weekly Content Automation System
Handles: Story curation → Email selection → Video generation → App delivery → Spotify upload
"""

import os
import sys
import json
import smtplib
import requests
import schedule
import time
from datetime import datetime, timedelta
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase  # noqa: F401
import sqlite3
import logging
from dataclasses import dataclass
from typing import List, Dict, Optional
import subprocess
import feedparser
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('weekly_content_system.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class Story:
    id: str
    title: str
    content: str
    category: str
    source_url: str
    kid_friendly_score: float
    selected: bool = False
    video_generated: bool = False
    audio_generated: bool = False

class WeeklyContentSystem:
    def __init__(self):
        # Setup directories with date-based organization
        self.base_dir = Path("kids_news_content")
        self.current_week = self.get_current_week_folder()
        self.setup_directories()
        
        # Database for tracking selections and content
        self.db_path = self.base_dir / "content_tracking.db"
        self.setup_database()
        
        # Email configuration
        self.admin_emails = ["aaddoshadrack@gmail.com", "marfo.oduro@gmail.com"]
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        self.admin_secret = os.getenv('ADMIN_SHARED_SECRET', '')
        
        # Spotify API configuration
        self.spotify_client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.spotify_client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        self.spotify_refresh_token = os.getenv('SPOTIFY_REFRESH_TOKEN')
        # Podcast feed (for Spotify via RSS submission)
        self.podcast_feed_dir = self.base_dir / "podcast"
        self.podcast_feed_dir.mkdir(parents=True, exist_ok=True)
        self.podcast_feed_path = self.podcast_feed_dir / "feed.xml"
        
        # Story sources (RSS feeds for kid-friendly news)
        self.news_sources = [
            "https://feeds.feedburner.com/time/topstories",
            "https://rss.cnn.com/rss/edition.rss",
            "https://feeds.nbcnews.com/nbcnews/public/news",
            "https://www.sciencedaily.com/rss/top/technology.xml",
            "https://www.sciencedaily.com/rss/top/environment.xml"
        ]

    def get_current_week_folder(self):
        """Generate folder name for current week"""
        today = datetime.now()
        week_start = today - timedelta(days=today.weekday())
        return week_start.strftime("%Y-%m-%d_week")
    
    def setup_directories(self):
        """Create organized directory structure"""
        directories = [
            self.base_dir / self.current_week / "curated_stories",
            self.base_dir / self.current_week / "selected_stories", 
            self.base_dir / self.current_week / "generated_videos",
            self.base_dir / self.current_week / "generated_audio",
            self.base_dir / self.current_week / "app_delivery",
            self.base_dir / "archive",
            self.base_dir / "templates"
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            
        logger.info(f"Directories created for week: {self.current_week}")

    def setup_database(self):
        """Initialize SQLite database for tracking"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weekly_content (
                id TEXT PRIMARY KEY,
                week_folder TEXT,
                title TEXT,
                category TEXT,
                content TEXT,
                source_url TEXT,
                kid_friendly_score REAL,
                selected BOOLEAN DEFAULT 0,
                video_generated BOOLEAN DEFAULT 0,
                audio_generated BOOLEAN DEFAULT 0,
                delivered_to_app BOOLEAN DEFAULT 0,
                uploaded_to_spotify BOOLEAN DEFAULT 0,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

        # Store Expo push tokens collected from the app
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS push_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT UNIQUE,
                platform TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized")

    def curate_weekly_stories(self) -> List[Story]:
        """Friday: Curate 10-12 potential stories from news sources"""
        logger.info("🔍 Starting weekly story curation...")
        
        stories = []
        story_count = 0
        
        for source_url in self.news_sources:
            if story_count >= 12:
                break
                
            try:
                feed = feedparser.parse(source_url)
                
                for entry in feed.entries[:3]:  # Max 3 per source
                    if story_count >= 12:
                        break
                    
                    # Analyze if suitable for kids
                    kid_score = self.analyze_kid_friendliness(entry.title, entry.summary)
                    
                    if kid_score > 0.6:  # Only kid-friendly content
                        story = Story(
                            id=f"story_{int(time.time())}_{story_count}",
                            title=entry.title,
                            content=entry.summary,
                            category=self.categorize_story(entry.title + " " + entry.summary),
                            source_url=entry.link,
                            kid_friendly_score=kid_score
                        )
                        
                        stories.append(story)
                        story_count += 1
                        
            except Exception as e:
                logger.error(f"Error processing source {source_url}: {e}")
        
        # Save curated stories
        self.save_curated_stories(stories)
        logger.info(f"✅ Curated {len(stories)} kid-friendly stories")
        
        return stories

    def analyze_kid_friendliness(self, title: str, content: str) -> float:
        """Analyze if content is suitable for kids aged 6-10"""
        text = (title + " " + content).lower()
        
        # Positive indicators
        positive_keywords = [
            'science', 'discovery', 'invention', 'kids', 'children', 'school', 
            'education', 'learning', 'technology', 'environment', 'animals',
            'space', 'ocean', 'nature', 'help', 'solve', 'create', 'build'
        ]
        
        # Negative indicators (avoid these topics)
        negative_keywords = [
            'violence', 'war', 'death', 'crime', 'accident', 'disaster',
            'political', 'election', 'controversy', 'scandal', 'protest'
        ]
        
        positive_score = sum(1 for keyword in positive_keywords if keyword in text)
        negative_score = sum(1 for keyword in negative_keywords if keyword in text)
        
        # Calculate score (0-1 scale)
        if negative_score > 0:
            return 0.2  # Low score if any negative content
        
        base_score = min(positive_score / 5, 1.0)  # Normalize to 0-1
        return base_score

    def categorize_story(self, text: str) -> str:
        """Categorize story based on content"""
        text = text.lower()
        
        if any(word in text for word in ['science', 'discovery', 'research', 'experiment']):
            return 'Science'
        elif any(word in text for word in ['technology', 'robot', 'computer', 'digital', 'app']):
            return 'Technology'
        elif any(word in text for word in ['environment', 'nature', 'ocean', 'climate', 'green']):
            return 'Environment'
        elif any(word in text for word in ['space', 'nasa', 'astronaut', 'planet', 'star']):
            return 'Space'
        elif any(word in text for word in ['animal', 'zoo', 'wildlife', 'pet']):
            return 'Animals'
        else:
            return 'General'

    def save_curated_stories(self, stories: List[Story]):
        """Save curated stories to database and files"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for story in stories:
            cursor.execute('''
                INSERT OR REPLACE INTO weekly_content 
                (id, week_folder, title, category, content, source_url, kid_friendly_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (story.id, self.current_week, story.title, story.category, 
                  story.content, story.source_url, story.kid_friendly_score))
            
            # Save individual story file
            story_file = self.base_dir / self.current_week / "curated_stories" / f"{story.id}.json"
            with open(story_file, 'w') as f:
                json.dump({
                    'id': story.id,
                    'title': story.title,
                    'category': story.category,
                    'content': story.content,
                    'source_url': story.source_url,
                    'kid_friendly_score': story.kid_friendly_score
                }, f, indent=2)
        
        conn.commit()
        conn.close()

    def send_selection_email(self, stories: List[Story]):
        """Friday: Send story selection email to admins"""
        logger.info("📧 Sending story selection email to admins...")
        
        # Create HTML email with story previews
        html_content = self.create_selection_email_html(stories)
        
        for admin_email in self.admin_emails:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = f"📰 Kids News - Week {self.current_week} Story Selection"
                msg['From'] = self.email_user
                msg['To'] = admin_email
                
                html_part = MIMEText(html_content, 'html')
                msg.attach(html_part)
                
                # Send email
                server = smtplib.SMTP(self.smtp_server, self.smtp_port)
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
                server.quit()
                
                logger.info(f"✅ Selection email sent to {admin_email}")
                
            except Exception as e:
                logger.error(f"Failed to send email to {admin_email}: {e}")

    def create_selection_email_html(self, stories: List[Story]) -> str:
        """Create HTML email for story selection"""
        base_url = os.getenv('SELECTION_PORTAL_URL', 'http://localhost:5001/admin/weekly')
        
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }}
                .story {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }}
                .category {{ background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }}
                .select-btn {{ background: #2196F3; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }}
                .score {{ color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <h2>📰 Kids Daily News - Weekly Story Selection</h2>
            <p>Please select 3 stories for next week (Tuesday, Wednesday, Friday):</p>
            
            <p><strong>Week:</strong> {self.current_week}</p>
            <p><strong>Deadline:</strong> Sunday 11:59 PM</p>
            <p><a href="{base_url}?secret={self.admin_secret}" target="_blank">Open the selection portal</a></p>
            
        """
        
        for i, story in enumerate(stories, 1):
            html += f"""
            <div class="story">
                <h3>{i}. {story.title}</h3>
                <span class="category">{story.category}</span>
                <span class="score">Kid-Friendly Score: {story.kid_friendly_score:.1f}/1.0</span>
                <p>{story.content[:200]}...</p>
                <p><a href="{story.source_url}" target="_blank">Read Full Article</a></p>
                <p>To select this story, open the portal link above.</p>
            </div>
            """
        
        html += """
        </body>
        </html>
        """
        
        return html

    def process_admin_selections(self):
        """Monday: Process admin selections and prepare for content generation"""
        logger.info("🎯 Processing admin selections...")
        
        # In a real implementation, you'd have a web interface where admins click buttons
        # For now, let's simulate the selection process
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get this week's curated stories
        cursor.execute('''
            SELECT id, title, category FROM weekly_content 
            WHERE week_folder = ? AND kid_friendly_score > 0.6
            ORDER BY kid_friendly_score DESC LIMIT 3
        ''', (self.current_week,))
        
        selected_stories = cursor.fetchall()
        
        # Mark as selected
        for i, (story_id, title, category) in enumerate(selected_stories):
            _ = category  # not used directly here
            day = ['tuesday', 'wednesday', 'friday'][i]
            
            cursor.execute('''
                UPDATE weekly_content SET selected = 1 
                WHERE id = ?
            ''', (story_id,))
            
            cursor.execute('''
                INSERT INTO admin_selections (week_folder, story_id, admin_email, day_assignment)
                VALUES (?, ?, ?, ?)
            ''', (self.current_week, story_id, 'auto-selected', day))
            
            logger.info(f"📋 Selected '{title}' for {day}")
        
        conn.commit()
        conn.close()
        
        return selected_stories

    def generate_weekly_content(self):
        """Monday: Generate videos and audio for selected stories"""
        logger.info("🎬 Starting weekly content generation...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get selected stories
        cursor.execute('''
            SELECT id, title, content, category FROM weekly_content 
            WHERE week_folder = ? AND selected = 1
        ''', (self.current_week,))
        
        selected_stories = cursor.fetchall()
        
        for story_id, title, content, category in selected_stories:
            try:
                # Generate video
                _ = self.generate_story_video(story_id, title, content, category)
                
                # Generate audio for Spotify
                _ = self.generate_story_audio(story_id, title, content)
                
                # Mark as generated
                cursor.execute('''
                    UPDATE weekly_content 
                    SET video_generated = 1, audio_generated = 1 
                    WHERE id = ?
                ''', (story_id,))
                
                logger.info(f"✅ Generated content for: {title}")
                
            except Exception as e:
                logger.error(f"Failed to generate content for {title}: {e}")
        
        conn.commit()
        conn.close()

    def generate_story_video(self, story_id: str, title: str, content: str, category: str) -> str:
        """Generate video using final branded generator"""
        try:
            from production.final_video_generator import FinalVideoGenerator
        except Exception as e:
            logger.error(f"Failed to import video generator: {e}")
            raise

        output_path = self.base_dir / self.current_week / "generated_videos" / f"{story_id}.mp4"

        try:
            generator = FinalVideoGenerator()
            video_path = generator.create_branded_video(title, content)
            # Copy to weekly folder path
            subprocess.run(['cp', video_path, str(output_path)], check=True)
            logger.info(f"🎥 Video generated: {output_path}")
            return str(output_path)
        except subprocess.CalledProcessError as e:
            logger.error(f"Video generation copy failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            raise

    def generate_story_audio(self, story_id: str, title: str, content: str) -> str:
        """Generate standalone audio for Spotify"""
        output_path = self.base_dir / self.current_week / "generated_audio" / f"{story_id}.mp3"
        
        # Create enhanced script
        script = f"Welcome to Kids Daily News! Today's story: {title}. {content}"
        
        # Generate audio using system TTS
        cmd = [
            'say', '-v', 'Samantha', '-r', '160',
            '-o', str(output_path.with_suffix('.aiff')), script
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Convert to MP3
            subprocess.run([
                'ffmpeg', '-i', str(output_path.with_suffix('.aiff')),
                '-acodec', 'libmp3lame', '-y', str(output_path)
            ], check=True)
            
            # Remove AIFF
            output_path.with_suffix('.aiff').unlink()
            
            logger.info(f"🎵 Audio generated: {output_path}")
            return str(output_path)
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Audio generation failed: {e}")
            raise

    def deliver_to_app(self):
        """Tuesday/Wednesday/Friday: Deliver content to app"""
        logger.info("📱 Delivering content to app...")
        
        # Copy generated videos to app assets
        video_dir = self.base_dir / self.current_week / "generated_videos"
        app_video_dir = Path("app_development/kids_news_app_fixed/assets/videos")
        
        for video_file in video_dir.glob("*.mp4"):
            target_path = app_video_dir / f"weekly_{video_file.name}"
            subprocess.run(['cp', str(video_file), str(target_path)])
            logger.info(f"📱 Delivered to app: {target_path}")
        
        # Update app content dynamically (you'd implement push notification here)
        self.send_push_notifications()

    def send_push_notifications(self):
        """Send push notifications for new content"""
        # Using Expo Push Notifications
        push_tokens = self.get_user_push_tokens()  # From your user database
        
        message = {
            "to": push_tokens,
            "sound": "default",
            "title": "📰 New Story Available!",
            "body": "Check out today's amazing kid-friendly news story!",
            "data": {"type": "new_content"}
        }
        
        try:
            response = requests.post(
                'https://exp.host/--/api/v2/push/send',
                json=message,
                headers={'Content-Type': 'application/json'}
            )
            logger.info(f"📲 Push notifications sent: {response.status_code}")
        except Exception as e:
            logger.error(f"Push notification failed: {e}")

    def get_user_push_tokens(self) -> List[str]:
        """Get push tokens from user database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT token FROM push_tokens')
            rows = cursor.fetchall()
            conn.close()
            tokens = [row[0] for row in rows]
            if not tokens:
                logger.warning("No push tokens found; notifications will be skipped")
            return tokens
        except Exception as e:
            logger.error(f"Error fetching push tokens: {e}")
            return []

    def upload_to_spotify(self):
        """Upload weekly audio content to Spotify"""
        logger.info("🎵 Uploading to Spotify...")
        
        # Spotify Podcast API integration
        audio_dir = self.base_dir / self.current_week / "generated_audio"
        
        for audio_file in audio_dir.glob("*.mp3"):
            try:
                # Upload to Spotify Podcast API
                # This requires Spotify for Podcasters API access
                self.upload_podcast_episode(audio_file)
                logger.info(f"🎵 Uploaded to Spotify: {audio_file.name}")
                
            except Exception as e:
                logger.error(f"Spotify upload failed for {audio_file}: {e}")

        # Always refresh RSS feed so Spotify/Podcast platforms can ingest
        try:
            self.update_podcast_rss_feed()
        except Exception as e:
            logger.error(f"Failed to update podcast RSS feed: {e}")

    def upload_podcast_episode(self, audio_file: Path):
        """Upload individual episode to Spotify"""
        # Most podcast platforms (incl. Spotify) ingest via RSS rather than direct API.
        # This function remains a placeholder; episodes are published via RSS in update_podcast_rss_feed().
        logger.info(f"📼 Prepared for RSS publication: {audio_file.name}")

    def update_podcast_rss_feed(self):
        """Generate or update an RSS feed for weekly audio, to submit to Spotify for Podcasters once."""
        logger.info("🪙 Updating podcast RSS feed")
        site_url = os.getenv('PODCAST_SITE_URL', 'https://example.com/kids_news_podcast')
        feed_title = os.getenv('PODCAST_TITLE', 'Kids Daily News Podcast')
        feed_description = os.getenv('PODCAST_DESCRIPTION', 'Kid‑friendly news stories with natural narration.')
        feed_author = os.getenv('PODCAST_AUTHOR', 'Kids Daily News')

        # Collect all MP3s from all week folders (limit to recent 50)
        episodes: List[Dict[str, str]] = []
        for week_folder in sorted((self.base_dir).glob('*_week'), reverse=True):
            for audio_file in sorted((week_folder / 'generated_audio').glob('*.mp3'), reverse=True):
                # Derive metadata from DB if available
                story_id = audio_file.stem
                title, summary = self._lookup_story_metadata(story_id)
                pub_date = datetime.fromtimestamp(audio_file.stat().st_mtime).strftime('%a, %d %b %Y %H:%M:%S +0000')
                episodes.append({
                    'title': title or story_id,
                    'summary': summary or 'Kid‑friendly news story.',
                    'pub_date': pub_date,
                    'url': f"{site_url}/audio/{week_folder.name}/{audio_file.name}",
                    'guid': f"{week_folder.name}-{audio_file.name}",
                    'length': str(audio_file.stat().st_size)
                })
                if len(episodes) >= 50:
                    break
            if len(episodes) >= 50:
                break

        # Build simple RSS (Atom not required)
        rss_items = []
        for ep in episodes:
            rss_items.append(f"""
            <item>
              <title>{ep['title']}</title>
              <description><![CDATA[{ep['summary']}]]></description>
              <pubDate>{ep['pub_date']}</pubDate>
              <guid isPermaLink="false">{ep['guid']}</guid>
              <enclosure url="{ep['url']}" length="{ep['length']}" type="audio/mpeg" />
            </item>
            """.strip())

        rss_xml = f"""
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>{feed_title}</title>
            <link>{site_url}</link>
            <description>{feed_description}</description>
            <language>en-us</language>
            <itunes:author>{feed_author}</itunes:author>
            {''.join(rss_items)}
          </channel>
        </rss>
        """.strip()

        with open(self.podcast_feed_path, 'w', encoding='utf-8') as f:
            f.write(rss_xml)
        logger.info(f"🧾 Podcast RSS updated at {self.podcast_feed_path}")

    def _lookup_story_metadata(self, story_id: str) -> Optional[tuple[str, str]]:
        """Helper to load story title/summary from DB."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT title, content FROM weekly_content WHERE id = ?', (story_id,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return row[0], row[1]
        except Exception:
            pass
        return None, None

    def cleanup_old_content(self):
        """Archive content older than 4 weeks"""
        logger.info("🧹 Cleaning up old content...")
        
        cutoff_date = datetime.now() - timedelta(weeks=4)
        archive_dir = self.base_dir / "archive"
        
        # Move old week folders to archive
        for week_folder in self.base_dir.glob("*_week"):
            if week_folder.is_dir() and week_folder.name != self.current_week:
                try:
                    folder_date = datetime.strptime(week_folder.name.split('_')[0], "%Y-%m-%d")
                    if folder_date < cutoff_date:
                        target = archive_dir / week_folder.name
                        subprocess.run(['mv', str(week_folder), str(target)])
                        logger.info(f"📦 Archived: {week_folder.name}")
                except ValueError:
                    continue

    def schedule_weekly_tasks(self):
        """Schedule all weekly tasks"""
        logger.info("⏰ Scheduling weekly automation tasks...")
        
        # Friday 6 PM: Curate stories and send selection email
        schedule.every().friday.at("21:00").do(self.friday_curation_task)  # 9 PM local
        
        # Monday 9 AM: Process selections and generate content
        schedule.every().monday.at("09:00").do(self.monday_generation_task)
        
        # Tuesday 8 AM: Deliver Tuesday content
        schedule.every().tuesday.at("08:00").do(self.deliver_daily_content, "tuesday")
        
        # Wednesday 8 AM: Deliver Wednesday content
        schedule.every().wednesday.at("08:00").do(self.deliver_daily_content, "wednesday")
        
        # Friday 8 AM: Deliver Friday content
        schedule.every().friday.at("08:00").do(self.deliver_daily_content, "friday")
        
        # Sunday 11 PM: Upload to Spotify and cleanup
        schedule.every().sunday.at("23:00").do(self.sunday_finalization_task)

    def friday_curation_task(self):
        """Friday: Curate and send selection email"""
        stories = self.curate_weekly_stories()
        self.send_selection_email(stories)

    def monday_generation_task(self):
        """Monday: Generate all content"""
        self.process_admin_selections()
        self.generate_weekly_content()

    def deliver_daily_content(self, day: str):
        """Deliver content for specific day"""
        self.deliver_to_app()

    def sunday_finalization_task(self):
        """Sunday: Upload to Spotify and cleanup"""
        self.upload_to_spotify()
        self.cleanup_old_content()

    def run_automation(self):
        """Run the continuous automation system"""
        logger.info("🚀 Starting Kids Daily News Weekly Automation System")
        
        # Setup initial directories and database
        self.setup_directories()
        self.setup_database()
        
        # Schedule all tasks
        self.schedule_weekly_tasks()
        
        # Run scheduler
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    """Main entry point"""
    system = WeeklyContentSystem()
    
    # For testing, you can run individual tasks:
    if len(sys.argv) > 1:
        task = sys.argv[1]
        if task == "curate":
            stories = system.curate_weekly_stories()
            system.send_selection_email(stories)
        elif task == "generate":
            system.process_admin_selections()
            system.generate_weekly_content()
        elif task == "deliver":
            system.deliver_to_app()
        elif task == "spotify":
            system.upload_to_spotify()
        elif task == "cleanup":
            system.cleanup_old_content()
    else:
        # Run full automation
        system.run_automation()

if __name__ == "__main__":
    main()
