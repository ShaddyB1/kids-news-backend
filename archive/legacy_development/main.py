#!/usr/bin/env python3
"""
Kids Daily News Newsletter Generator
Main application that scrapes news, processes content for kids, and generates newsletters
"""

import schedule
import time
import logging
import sys
from datetime import datetime
from typing import List
import argparse

from .config import Config
from .news_scraper import NewsScraper, NewsArticle
from .content_processor import ContentProcessor
from .newsletter_generator import NewsletterGenerator

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('kids_newsletter.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class KidsNewsletterApp:
    def __init__(self):
        self.config = Config()
        self.scraper = NewsScraper()
        self.processor = ContentProcessor()
        self.generator = NewsletterGenerator()
        logger.info("Kids Newsletter App initialized")

    def generate_daily_newsletter(self) -> bool:
        """Generate and save today's newsletter"""
        
        try:
            logger.info("Starting daily newsletter generation...")
            
            # Step 1: Scrape news
            logger.info("Scraping news from sources...")
            raw_articles = self.scraper.fetch_all_news()
            logger.info(f"Found {len(raw_articles)} raw articles")
            
            if not raw_articles:
                logger.warning("No articles found. Creating newsletter with activities only.")
                processed_articles = []
            else:
                # Step 2: Process content for kids
                logger.info("Processing content for kids...")
                processed_articles = []
                
                for article in raw_articles:
                    try:
                        processed_article = self.processor.simplify_for_kids(article)
                        processed_articles.append(processed_article)
                        logger.info(f"Processed: {processed_article.title}")
                    except Exception as e:
                        logger.error(f"Error processing article '{article.title}': {e}")
                        continue
                
                logger.info(f"Successfully processed {len(processed_articles)} articles")
            
            # Step 3: Add kids activities section
            activity_content = self._get_kids_activities()
            
            # Step 4: Generate newsletters
            logger.info("Generating newsletter...")
            
            # HTML Newsletter
            html_content = self.generator.create_html_newsletter(processed_articles)
            
            # Add activities section to HTML
            if activity_content:
                html_content = html_content.replace(
                    '<div class="fun-fact">',
                    activity_content + '<div class="fun-fact">',
                    1
                )
            
            # Text Newsletter
            text_content = self.generator.create_text_newsletter(processed_articles)
            
            # Step 5: Save newsletters
            today = datetime.now()
            date_str = today.strftime("%Y%m%d")
            
            html_file = self.generator.save_newsletter(
                html_content, 
                f"kids_newsletter_{date_str}.html"
            )
            
            text_file = self.generator.save_newsletter(
                text_content, 
                f"kids_newsletter_{date_str}.txt", 
                "txt"
            )
            
            logger.info(f"Newsletter generation complete!")
            logger.info(f"HTML: {html_file}")
            logger.info(f"Text: {text_file}")
            
            # Log newsletter stats
            self._log_newsletter_stats(processed_articles)
            
            return True
            
        except Exception as e:
            logger.error(f"Error generating newsletter: {e}")
            return False

    def _get_kids_activities(self) -> str:
        """Get today's kids activities"""
        try:
            return self.generator.create_kids_activity_section()
        except Exception as e:
            logger.error(f"Error creating activities section: {e}")
            return ""

    def _log_newsletter_stats(self, articles: List[NewsArticle]):
        """Log statistics about the newsletter"""
        if not articles:
            logger.info("Newsletter stats: No articles today")
            return
        
        total_articles = len(articles)
        avg_reading_level = sum(a.reading_level for a in articles if a.reading_level) / total_articles
        
        sources = set(article.source for article in articles)
        
        logger.info(f"Newsletter stats:")
        logger.info(f"  - Total articles: {total_articles}")
        logger.info(f"  - Average reading level: {avg_reading_level:.1f}")
        logger.info(f"  - Sources: {', '.join(sources)}")
        
        # Log titles for review
        for i, article in enumerate(articles, 1):
            logger.info(f"  {i}. {article.title} (Level: {article.reading_level:.1f})")

    def test_run(self):
        """Test run without scheduling"""
        logger.info("Running test newsletter generation...")
        success = self.generate_daily_newsletter()
        if success:
            print("✅ Test newsletter generated successfully!")
            print("Check the 'newsletters' folder for output files.")
        else:
            print("❌ Test newsletter generation failed. Check logs for details.")
        return success

    def start_scheduler(self):
        """Start the daily scheduler"""
        logger.info("Starting daily newsletter scheduler...")
        
        # Schedule newsletter generation every morning at 8 AM
        schedule.every().day.at("08:00").do(self.generate_daily_newsletter)
        
        # Also allow manual trigger with a specific time for testing
        # schedule.every().minute.do(self.generate_daily_newsletter)  # Uncomment for testing
        
        logger.info("Newsletter scheduled for 8:00 AM daily")
        print("📰 Kids Newsletter Scheduler Started!")
        print("🕐 Newsletter will be generated daily at 8:00 AM")
        print("📁 Check the 'newsletters' folder for output files")
        print("🛑 Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Scheduler stopped by user")
            print("\n🛑 Newsletter scheduler stopped")

    def generate_newsletter_now(self):
        """Generate newsletter immediately"""
        print("📰 Generating newsletter now...")
        success = self.generate_daily_newsletter()
        if success:
            print("✅ Newsletter generated successfully!")
        else:
            print("❌ Newsletter generation failed. Check logs for details.")
        return success

def main():
    parser = argparse.ArgumentParser(description='Kids Daily News Newsletter Generator')
    parser.add_argument(
        '--mode', 
        choices=['test', 'schedule', 'now'], 
        default='test',
        help='Run mode: test (single run), schedule (daily automation), now (generate immediately)'
    )
    parser.add_argument(
        '--time', 
        default='08:00',
        help='Schedule time for daily newsletter (HH:MM format, default: 08:00)'
    )
    
    args = parser.parse_args()
    
    app = KidsNewsletterApp()
    
    if args.mode == 'test':
        app.test_run()
    elif args.mode == 'schedule':
        # Update schedule time if provided
        if args.time != '08:00':
            schedule.clear()
            schedule.every().day.at(args.time).do(app.generate_daily_newsletter)
            logger.info(f"Newsletter scheduled for {args.time} daily")
        app.start_scheduler()
    elif args.mode == 'now':
        app.generate_newsletter_now()

if __name__ == "__main__":
    main() 