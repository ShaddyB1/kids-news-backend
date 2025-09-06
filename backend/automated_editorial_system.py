#!/usr/bin/env python3
"""
Junior News Digest - Fully Automated Editorial System
====================================================

Complete automation system that:
1. Generates stories every Sunday at 9:00 AM
2. Waits for editor approval (you at 8:00 PM Sunday)
3. Publishes approved stories Mon/Wed/Fri at 8:00 AM
4. Runs 24/7 in the background
"""

import os
import sys
import json
import uuid
import random
import threading
import time
import schedule
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import sqlite3
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automated_editorial.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AutomatedEditorialSystem:
    """Complete automated editorial system"""
    
    def __init__(self, db_path: str = "editorial_automation.db"):
        self.db_path = db_path
        self.init_database()
        self.story_generator = StoryGenerator()
        
    def init_database(self):
        """Initialize the automated editorial database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Stories table for automation
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS automated_stories (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT NOT NULL,
                category TEXT NOT NULL,
                author TEXT NOT NULL,
                priority_score INTEGER DEFAULT 5,
                is_breaking BOOLEAN DEFAULT FALSE,
                is_trending BOOLEAN DEFAULT FALSE,
                is_hot BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'pending_review',
                generated_date TEXT NOT NULL,
                approved_date TEXT,
                published_date TEXT,
                scheduled_publish_date TEXT,
                editor_notes TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Publishing schedule table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS publishing_schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                week_start_date TEXT NOT NULL,
                monday_story_id TEXT,
                wednesday_story_id TEXT,
                friday_story_id TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # System automation log
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS automation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                details TEXT,
                timestamp TEXT NOT NULL,
                success BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Automated editorial database initialized")
    
    def generate_weekly_stories(self):
        """Generate 15-20 candidate stories every Sunday at 9:00 AM"""
        try:
            logger.info("🤖 SUNDAY 9:00 AM - Generating weekly candidate stories...")
            
            # Generate 15-20 stories
            story_count = random.randint(15, 20)
            stories = self.story_generator.generate_stories(story_count)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Clear previous week's pending stories
            cursor.execute("DELETE FROM automated_stories WHERE status = 'pending_review'")
            
            # Insert new stories
            saved_count = 0
            for story in stories:
                try:
                    cursor.execute('''
                        INSERT INTO automated_stories 
                        (id, title, content, summary, category, author, priority_score,
                         is_breaking, is_trending, is_hot, status, generated_date)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        story['id'], story['title'], story['content'], story['summary'],
                        story['category'], story['author'], story['priority_score'],
                        story['is_breaking'], story['is_trending'], story['is_hot'],
                        'pending_review', datetime.now().isoformat()
                    ))
                    saved_count += 1
                except Exception as e:
                    logger.error(f"Error saving story {story['id']}: {e}")
            
            conn.commit()
            conn.close()
            
            # Log the action
            self.log_automation_action(
                "story_generation", 
                f"Generated {saved_count} candidate stories for editorial review"
            )
            
            logger.info(f"✅ Generated {saved_count} candidate stories! Ready for editorial review at 8:00 PM.")
            
        except Exception as e:
            logger.error(f"Error generating weekly stories: {e}")
            self.log_automation_action("story_generation_error", str(e), success=False)
    
    def process_approved_stories(self):
        """Process approved stories and schedule for Mon/Wed/Fri publishing"""
        try:
            logger.info("📋 Processing approved stories for weekly schedule...")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get approved stories ordered by priority
            cursor.execute('''
                SELECT id, title, content, summary, category, author, priority_score,
                       is_breaking, is_trending, is_hot
                FROM automated_stories 
                WHERE status = 'approved'
                ORDER BY priority_score DESC, is_breaking DESC, is_trending DESC
            ''')
            
            approved_stories = cursor.fetchall()
            
            if not approved_stories:
                logger.info("No approved stories to process")
                return
            
            # Calculate next week's dates
            today = datetime.now()
            days_until_monday = (7 - today.weekday()) % 7
            if days_until_monday == 0:  # If today is Monday
                days_until_monday = 7
            
            next_monday = today + timedelta(days=days_until_monday)
            next_wednesday = next_monday + timedelta(days=2)
            next_friday = next_monday + timedelta(days=4)
            
            # Select top 3 stories for Mon/Wed/Fri
            stories_to_schedule = approved_stories[:3]
            
            if len(stories_to_schedule) >= 3:
                # Create publishing schedule
                cursor.execute('''
                    INSERT INTO publishing_schedule 
                    (week_start_date, monday_story_id, wednesday_story_id, friday_story_id, status)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    next_monday.strftime('%Y-%m-%d'),
                    stories_to_schedule[0][0],  # Monday - highest priority
                    stories_to_schedule[1][0],  # Wednesday - second priority
                    stories_to_schedule[2][0],  # Friday - third priority
                    'scheduled'
                ))
                
                # Update stories with scheduled publish dates
                schedule_data = [
                    (stories_to_schedule[0][0], next_monday.strftime('%Y-%m-%d')),
                    (stories_to_schedule[1][0], next_wednesday.strftime('%Y-%m-%d')),
                    (stories_to_schedule[2][0], next_friday.strftime('%Y-%m-%d'))
                ]
                
                for story_id, publish_date in schedule_data:
                    cursor.execute('''
                        UPDATE automated_stories 
                        SET status = 'scheduled', scheduled_publish_date = ?
                        WHERE id = ?
                    ''', (publish_date, story_id))
                
                conn.commit()
                
                self.log_automation_action(
                    "story_scheduling",
                    f"Scheduled {len(stories_to_schedule)} stories for Mon/Wed/Fri publishing"
                )
                
                logger.info(f"✅ Scheduled {len(stories_to_schedule)} stories for next week!")
                
            else:
                logger.warning(f"Only {len(stories_to_schedule)} approved stories available. Need at least 3.")
            
            conn.close()
            
        except Exception as e:
            logger.error(f"Error processing approved stories: {e}")
            self.log_automation_action("story_processing_error", str(e), success=False)
    
    def publish_scheduled_story(self, day_name):
        """Publish scheduled story for Mon/Wed/Fri at 8:00 AM"""
        try:
            logger.info(f"📰 {day_name.upper()} 8:00 AM - Publishing scheduled story...")
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get today's scheduled story
            today = datetime.now().strftime('%Y-%m-%d')
            
            cursor.execute('''
                SELECT s.id, s.title, s.content, s.summary, s.category, s.author,
                       s.is_breaking, s.is_trending, s.is_hot
                FROM automated_stories s
                WHERE s.scheduled_publish_date = ? AND s.status = 'scheduled'
            ''', (today,))
            
            story = cursor.fetchone()
            
            if not story:
                logger.info(f"No story scheduled for {day_name}")
                return
            
            # Create article in main app database
            article_id = f"{story[1].lower().replace(' ', '-').replace(',', '').replace('.', '')}-{datetime.now().strftime('%Y%m%d')}"
            
            # Connect to main app database (you'll need to adjust path)
            app_db_path = "junior_news_integrated.db"  # Adjust this path
            app_conn = sqlite3.connect(app_db_path)
            app_cursor = app_conn.cursor()
            
            # Insert into main app articles table
            app_cursor.execute('''
                INSERT INTO articles (id, title, headline, content, summary, category, author, 
                                    published_date, read_time, likes, views, comments,
                                    is_breaking, is_trending, is_hot)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                article_id, story[1], story[1], story[2], story[3], story[4], story[5],
                datetime.now().isoformat(), f"{max(1, len(story[2].split()) // 200)} min read",
                0, 0, 0, story[6], story[7], story[8]
            ))
            
            app_conn.commit()
            app_conn.close()
            
            # Update story status to published
            cursor.execute('''
                UPDATE automated_stories 
                SET status = 'published', published_date = ?
                WHERE id = ?
            ''', (datetime.now().isoformat(), story[0]))
            
            conn.commit()
            conn.close()
            
            self.log_automation_action(
                f"{day_name.lower()}_publishing",
                f"Published story: {story[1]}"
            )
            
            logger.info(f"✅ Published story: {story[1]}")
            
        except Exception as e:
            logger.error(f"Error publishing {day_name} story: {e}")
            self.log_automation_action(f"{day_name.lower()}_publishing_error", str(e), success=False)
    
    def log_automation_action(self, action: str, details: str, success: bool = True):
        """Log automation actions"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO automation_log (action, details, timestamp, success)
                VALUES (?, ?, ?, ?)
            ''', (action, details, datetime.now().isoformat(), success))
            
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error logging automation action: {e}")
    
    def get_system_status(self):
        """Get current system status"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Count stories by status
            cursor.execute("SELECT status, COUNT(*) FROM automated_stories GROUP BY status")
            status_counts = dict(cursor.fetchall())
            
            # Get recent actions
            cursor.execute('''
                SELECT action, details, timestamp, success 
                FROM automation_log 
                ORDER BY timestamp DESC 
                LIMIT 10
            ''')
            recent_actions = cursor.fetchall()
            
            conn.close()
            
            return {
                'story_counts': status_counts,
                'recent_actions': recent_actions,
                'system_time': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting system status: {e}")
            return {'error': str(e)}

class StoryGenerator:
    """Generates candidate stories for editorial review"""
    
    def __init__(self):
        self.categories = [
            'technology', 'science', 'environment', 'health', 
            'education', 'sports', 'culture', 'general'
        ]
        
        self.story_templates = {
            'technology': [
                {
                    'title': 'Kids Create Amazing {innovation} to Help {cause}',
                    'content': 'A group of brilliant students from {school} has invented an incredible {innovation}! The {innovation} uses {technology} to {benefit}. The students worked with their teacher for {duration} to build this amazing invention. {impact_stat}! This shows how young people can create solutions to help {cause}. The invention has already helped {number} people in their community.',
                    'innovations': ['solar-powered robot', 'smart recycling system', 'water purification device', 'air quality monitor', 'learning app', 'safety device'],
                    'causes': ['the environment', 'their community', 'elderly people', 'animals', 'other students', 'their neighborhood'],
                    'technologies': ['solar panels', 'artificial intelligence', 'sensors', 'renewable energy', 'mobile technology', 'robotics'],
                    'benefits': ['clean parks', 'reduce waste', 'provide clean water', 'monitor pollution', 'help learning', 'keep people safe'],
                    'schools': ['Green Valley School', 'Tech Academy', 'Innovation Middle School', 'STEM High School', 'Future Leaders School']
                }
            ],
            'science': [
                {
                    'title': 'Scientists Discover {discovery} That Could {impact}',
                    'content': 'Amazing scientists have made an incredible discovery about {subject}! They found that {discovery} could {impact}. The research team worked for {duration} to understand {phenomenon}. This discovery means that {benefit}. Young scientists around the world are excited about this breakthrough! The discovery could help millions of people in the future.',
                    'discoveries': ['new medicine', 'clean energy source', 'way to grow food faster', 'method to clean oceans', 'cure for diseases', 'space technology'],
                    'impacts': ['help sick children', 'power entire cities', 'feed more people', 'save marine life', 'explore space', 'fight climate change'],
                    'subjects': ['space', 'the human body', 'plants', 'the ocean', 'weather', 'animals'],
                    'phenomena': ['how cells work', 'how stars form', 'how plants grow', 'how ecosystems function', 'how weather changes', 'how animals communicate']
                }
            ],
            'environment': [
                {
                    'title': 'Kids Plant {number} Trees to Fight Climate Change',
                    'content': 'Thousands of children from around the world have planted {number} trees in just one weekend! The amazing project, called "{project_name}," happened in {locations}. Kids aged 6 to 16 worked with their families and teachers to plant {tree_types} in parks, schools, and neighborhoods. Scientists say these trees will {environmental_benefit}. The children also learned about {educational_aspect}. This project shows how young people can make a real difference!',
                    'numbers': ['10,000', '25,000', '50,000', '100,000', '75,000'],
                    'project_names': ['Trees for Tomorrow', 'Green Future Initiative', 'Plant Hope Project', 'Climate Heroes', 'Earth Savers'],
                    'locations': ['50 countries', '100 cities', 'every continent', 'schools worldwide', 'communities everywhere'],
                    'tree_types': ['oak, maple, and fruit trees', 'native species', 'fast-growing varieties', 'flowering trees', 'fruit and nut trees'],
                    'environmental_benefits': ['clean the air and fight climate change', 'provide homes for animals', 'prevent soil erosion', 'create cooler neighborhoods', 'produce oxygen for everyone']
                }
            ]
        }
    
    def generate_stories(self, count: int) -> List[Dict[str, Any]]:
        """Generate candidate stories"""
        stories = []
        
        for i in range(count):
            category = random.choice(self.categories)
            
            if category in self.story_templates:
                template = random.choice(self.story_templates[category])
                story = self._generate_from_template(template, category)
            else:
                story = self._generate_generic_story(category, i)
            
            story['id'] = f"auto_story_{datetime.now().strftime('%Y%m%d')}_{i+1:03d}"
            story['priority_score'] = random.randint(1, 10)
            story['is_breaking'] = random.choice([True, False]) if random.random() < 0.2 else False
            story['is_trending'] = random.choice([True, False]) if random.random() < 0.3 else False
            story['is_hot'] = random.choice([True, False]) if random.random() < 0.25 else False
            
            stories.append(story)
        
        # Sort by priority
        stories.sort(key=lambda x: x['priority_score'], reverse=True)
        return stories
    
    def _generate_from_template(self, template: Dict, category: str) -> Dict[str, Any]:
        """Generate story from template"""
        title = template['title']
        content = template['content']
        
        # Replace placeholders
        for key, values in template.items():
            if key.endswith('s') and key not in ['title', 'content']:
                placeholder = f"{{{key[:-1]}}}"
                if placeholder in title:
                    title = title.replace(placeholder, random.choice(values))
                if placeholder in content:
                    content = content.replace(placeholder, random.choice(values))
        
        # Add random details
        durations = ['3 months', '6 months', '8 months', '1 year', '2 years']
        impact_stats = [
            'The invention can help 1000 people every day',
            'It works 10 times faster than old methods',
            'It uses 50% less energy than traditional systems',
            'It can process 100 items per hour',
            'It saves 80% more time than before'
        ]
        numbers = ['500', '1000', '2000', '5000', '10000']
        
        content = content.replace('{duration}', random.choice(durations))
        content = content.replace('{impact_stat}', random.choice(impact_stats))
        content = content.replace('{number}', random.choice(numbers))
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content
        }
    
    def _generate_generic_story(self, category: str, index: int) -> Dict[str, Any]:
        """Generate generic story"""
        title = f"Amazing {category.title()} Discovery for Kids #{index+1}"
        content = f"This is an exciting story about {category} that will inspire young minds everywhere! Children and young people are making incredible discoveries and contributions in {category}. This story shows how kids can make a real difference in the world through creativity, hard work, and determination. Scientists and experts are amazed by what young people can achieve when they put their minds to it!"
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content
        }

def run_automation_system():
    """Main automation system runner"""
    logger.info("🚀 Starting Junior News Digest Automated Editorial System...")
    
    # Initialize the system
    system = AutomatedEditorialSystem()
    
    # Schedule the automation tasks
    
    # Sunday 9:00 AM - Generate stories
    schedule.every().sunday.at("09:00").do(system.generate_weekly_stories)
    
    # Sunday 10:00 PM - Process approved stories (after editor review at 8:00 PM)
    schedule.every().sunday.at("22:00").do(system.process_approved_stories)
    
    # Monday 8:00 AM - Publish Monday story
    schedule.every().monday.at("08:00").do(system.publish_scheduled_story, "Monday")
    
    # Wednesday 8:00 AM - Publish Wednesday story
    schedule.every().wednesday.at("08:00").do(system.publish_scheduled_story, "Wednesday")
    
    # Friday 8:00 AM - Publish Friday story
    schedule.every().friday.at("08:00").do(system.publish_scheduled_story, "Friday")
    
    logger.info("📅 Scheduled tasks:")
    logger.info("   • Sunday 9:00 AM - Generate candidate stories")
    logger.info("   • Sunday 10:00 PM - Process approved stories")
    logger.info("   • Monday 8:00 AM - Publish Monday story")
    logger.info("   • Wednesday 8:00 AM - Publish Wednesday story")
    logger.info("   • Friday 8:00 AM - Publish Friday story")
    logger.info("🔄 System running 24/7...")
    
    # Run the scheduler
    while True:
        try:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Automation system stopped by user")
            break
        except Exception as e:
            logger.error(f"Automation system error: {e}")
            time.sleep(60)  # Continue running even if there's an error

if __name__ == '__main__':
    # Install required packages
    try:
        import schedule
    except ImportError:
        logger.info("Installing required packages...")
        os.system("pip install schedule")
        import schedule
    
    # Run the automation system
    run_automation_system()
