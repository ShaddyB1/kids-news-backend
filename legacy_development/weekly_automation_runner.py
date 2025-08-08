#!/usr/bin/env python3
"""
Weekly Automation Runner
Handles the complete weekly content pipeline
"""

import asyncio
import logging
from datetime import datetime, timedelta
from automated_content_system import AutomatedContentSystem
import schedule
import time
import json
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeeklyAutomationRunner:
    """
    Manages the complete weekly automation cycle
    """
    
    def __init__(self):
        self.system = AutomatedContentSystem()
        self.running = False
        
    def friday_story_selection_task(self):
        """
        Friday Night: Send 10-12 story options to admin emails
        """
        logger.info("🗓️ FRIDAY: Starting story selection process...")
        
        # Collect potential stories from news sources
        stories = self.collect_weekly_stories()
        
        # Filter and rank stories
        selected_stories = self.filter_and_rank_stories(stories, limit=12)
        
        # Send selection email
        self.system.send_weekly_selection_email(selected_stories)
        
        # Save to database for tracking
        self.save_story_candidates(selected_stories)
        
        logger.info(f"✅ Sent {len(selected_stories)} story options to admin emails")
    
    def collect_weekly_stories(self):
        """
        Collect potential stories from various news sources
        """
        logger.info("📰 Collecting stories from news sources...")
        
        # This would integrate with news APIs
        # For now, return sample stories
        sample_stories = [
            {
                "id": f"story_{int(time.time())}_{i}",
                "title": f"Amazing Discovery {i}: Scientists Find New Way to Help Ocean",
                "summary": "Scientists have made an incredible discovery that could help save ocean animals...",
                "source": "Science Daily",
                "url": f"https://example.com/story_{i}",
                "category": "science",
                "kid_friendly_score": 0.9,
                "educational_value": 0.8
            }
            for i in range(1, 15)
        ]
        
        return sample_stories
    
    def filter_and_rank_stories(self, stories, limit=12):
        """
        Filter and rank stories based on kid-friendly criteria
        """
        logger.info("🔍 Filtering and ranking stories...")
        
        # Sort by kid-friendly score and educational value
        ranked_stories = sorted(
            stories, 
            key=lambda x: (x['kid_friendly_score'] + x['educational_value']) / 2,
            reverse=True
        )
        
        return ranked_stories[:limit]
    
    def save_story_candidates(self, stories):
        """
        Save story candidates to database for tracking
        """
        candidates_file = self.system.week_dir / "selections" / "candidates.json"
        
        with open(candidates_file, 'w') as f:
            json.dump({
                "date": datetime.now().isoformat(),
                "stories": stories,
                "status": "pending_selection"
            }, f, indent=2)
    
    def tuesday_content_generation(self):
        """
        Tuesday Morning: Generate content for selected stories
        """
        logger.info("🗓️ TUESDAY: Generating content...")
        
        selected_stories = self.get_selected_stories()
        tuesday_story = selected_stories.get('tuesday')
        
        if tuesday_story:
            self.generate_complete_content(tuesday_story, "Tuesday")
            self.send_push_notification(tuesday_story, "Tuesday")
        
    def wednesday_content_generation(self):
        """
        Wednesday Morning: Generate content for selected stories
        """
        logger.info("🗓️ WEDNESDAY: Generating content...")
        
        selected_stories = self.get_selected_stories()
        wednesday_story = selected_stories.get('wednesday')
        
        if wednesday_story:
            self.generate_complete_content(wednesday_story, "Wednesday")
            self.send_push_notification(wednesday_story, "Wednesday")
    
    def friday_content_generation(self):
        """
        Friday Morning: Generate content for selected stories
        """
        logger.info("🗓️ FRIDAY: Generating content...")
        
        selected_stories = self.get_selected_stories()
        friday_story = selected_stories.get('friday')
        
        if friday_story:
            self.generate_complete_content(friday_story, "Friday")
            self.send_push_notification(friday_story, "Friday")
    
    def get_selected_stories(self):
        """
        Get the stories selected by admins for the week
        """
        selections_file = self.system.week_dir / "selections" / "approved.json"
        
        if selections_file.exists():
            with open(selections_file, 'r') as f:
                return json.load(f)
        
        return {}
    
    def generate_complete_content(self, story, day):
        """
        Generate all content for a story: video, audio, notifications
        """
        logger.info(f"🎬 Generating complete content for {day}: {story['title']}")
        
        story_id = f"{day.lower()}_{story['id']}"
        
        # Generate video with automatic images and voice
        video_path = self.system.create_automated_video(story['content'], story_id)
        
        if video_path:
            logger.info(f"✅ Video created: {video_path}")
            
            # Upload audio to Spotify as podcast episode
            self.upload_to_spotify(story_id, story['title'])
            
            # Save content metadata
            self.save_content_metadata(story, day, video_path)
    
    def upload_to_spotify(self, story_id, title):
        """
        Upload audio to Spotify as podcast episode
        """
        logger.info(f"🎵 Uploading to Spotify: {title}")
        
        # This would use Spotify API to upload podcast episodes
        # For now, just log the action
        audio_path = self.system.week_dir / "audio" / "podcast" / f"{story_id}_podcast.mp3"
        
        if audio_path.exists():
            logger.info(f"✅ Would upload {audio_path} to Spotify")
            # TODO: Implement actual Spotify upload
        
    def send_push_notification(self, story, day):
        """
        Send push notification to app users
        """
        logger.info(f"📱 Sending push notification for {day}")
        
        notification = {
            "title": f"New Story for {day}! 📚",
            "body": f"Check out: {story['title'][:50]}...",
            "data": {
                "story_id": story['id'],
                "day": day,
                "has_video": True
            }
        }
        
        # This would use Firebase or another push service
        logger.info(f"✅ Would send notification: {notification['title']}")
        # TODO: Implement actual push notifications
    
    def save_content_metadata(self, story, day, video_path):
        """
        Save metadata about generated content
        """
        metadata = {
            "story": story,
            "day": day,
            "video_path": video_path,
            "generated_at": datetime.now().isoformat(),
            "status": "published"
        }
        
        metadata_file = self.system.week_dir / "selections" / f"{day.lower()}_metadata.json"
        
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def setup_schedule(self):
        """
        Set up the weekly automation schedule
        """
        logger.info("📅 Setting up weekly automation schedule...")
        
        # Friday 8:00 PM - Story selection
        schedule.every().friday.at("20:00").do(self.friday_story_selection_task)
        
        # Tuesday 8:00 AM - Content generation  
        schedule.every().tuesday.at("08:00").do(self.tuesday_content_generation)
        
        # Wednesday 8:00 AM - Content generation
        schedule.every().wednesday.at("08:00").do(self.wednesday_content_generation)
        
        # Friday 8:00 AM - Content generation
        schedule.every().friday.at("08:00").do(self.friday_content_generation)
        
        logger.info("✅ Schedule configured:")
        logger.info("   📧 Friday 8:00 PM - Story selection emails")
        logger.info("   🎬 Tuesday 8:00 AM - Content generation")
        logger.info("   🎬 Wednesday 8:00 AM - Content generation") 
        logger.info("   🎬 Friday 8:00 AM - Content generation")
    
    def run_automation(self):
        """
        Start the automation runner
        """
        logger.info("🚀 Starting Weekly Automation Runner...")
        
        self.setup_schedule()
        self.running = True
        
        print("\n" + "="*60)
        print("🤖 WEEKLY AUTOMATION SYSTEM RUNNING")
        print("="*60)
        print("📧 Friday 8:00 PM: Send story selection emails")
        print("🎬 Tuesday/Wednesday/Friday 8:00 AM: Generate content")
        print("📱 Automatic push notifications")
        print("🎵 Automatic Spotify uploads")
        print("📁 Organized date-based folders")
        print("="*60)
        
        try:
            while self.running:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            logger.info("⏹️ Automation stopped by user")
            self.running = False

def main():
    """
    Run the weekly automation system
    """
    runner = WeeklyAutomationRunner()
    
    # Option to test individual functions
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == "test-friday":
            runner.friday_story_selection_task()
        elif sys.argv[1] == "test-tuesday":
            runner.tuesday_content_generation()
        elif sys.argv[1] == "test-video":
            # Test video generation
            test_story = {
                "id": "test_123",
                "title": "Amazing Robot Fish Saves Ocean",
                "content": "Scientists created robot fish that eat plastic to save the ocean! A student named Eleanor had this idea and now it's helping sea animals everywhere!",
                "source": "Test"
            }
            runner.generate_complete_content(test_story, "Test")
        else:
            print("Usage: python weekly_automation_runner.py [test-friday|test-tuesday|test-video]")
    else:
        # Run full automation
        runner.run_automation()

if __name__ == "__main__":
    main()
