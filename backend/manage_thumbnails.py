#!/usr/bin/env python3
"""
Thumbnail Management Script for Junior News Digest
=================================================

Command-line tool for managing story thumbnails:
- Generate thumbnails for all stories
- Regenerate specific thumbnails
- Check thumbnail status
- Clean up old thumbnails
"""

import argparse
import json
import sys
import os
from pathlib import Path
from thumbnail_generator import ThumbnailGenerator
import requests
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ThumbnailManager:
    def __init__(self, api_base_url="http://localhost:5002"):
        self.api_base_url = api_base_url
        self.generator = ThumbnailGenerator()
    
    def get_stories_from_api(self):
        """Fetch stories from the API"""
        try:
            response = requests.get(f"{self.api_base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('articles', [])
            else:
                logger.error(f"Failed to fetch stories: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error fetching stories: {e}")
            return []
    
    def generate_all_thumbnails(self, force_regenerate=False):
        """Generate thumbnails for all stories"""
        logger.info("Fetching stories from API...")
        stories = self.get_stories_from_api()
        
        if not stories:
            logger.error("No stories found")
            return
        
        logger.info(f"Found {len(stories)} stories")
        
        if force_regenerate:
            logger.info("Force regenerating all thumbnails...")
            # Delete existing thumbnails
            thumbnails_dir = Path("thumbnails")
            for thumb_file in thumbnails_dir.glob("*.jpg"):
                thumb_file.unlink()
                logger.info(f"Deleted existing thumbnail: {thumb_file.name}")
        
        # Generate thumbnails
        results = self.generator.batch_generate_thumbnails(stories)
        
        logger.info(f"Generated {len(results)} thumbnails")
        for story_id, path in results.items():
            logger.info(f"  {story_id}: {path}")
    
    def generate_specific_thumbnails(self, story_ids, force_regenerate=False):
        """Generate thumbnails for specific stories"""
        stories = self.get_stories_from_api()
        story_map = {story['id']: story for story in stories}
        
        target_stories = []
        for story_id in story_ids:
            if story_id in story_map:
                target_stories.append(story_map[story_id])
            else:
                logger.warning(f"Story {story_id} not found")
        
        if not target_stories:
            logger.error("No valid stories found")
            return
        
        if force_regenerate:
            logger.info("Force regenerating specified thumbnails...")
            thumbnails_dir = Path("thumbnails")
            for story_id in story_ids:
                thumb_file = thumbnails_dir / f"{story_id}.jpg"
                if thumb_file.exists():
                    thumb_file.unlink()
                    logger.info(f"Deleted existing thumbnail: {thumb_file.name}")
        
        # Generate thumbnails
        results = self.generator.batch_generate_thumbnails(target_stories)
        
        logger.info(f"Generated {len(results)} thumbnails")
        for story_id, path in results.items():
            logger.info(f"  {story_id}: {path}")
    
    def check_status(self):
        """Check thumbnail status"""
        thumbnails_dir = Path("thumbnails")
        thumbnails_dir.mkdir(exist_ok=True)
        
        # Get all stories
        stories = self.get_stories_from_api()
        story_ids = {story['id'] for story in stories}
        
        # Get existing thumbnails
        thumbnail_files = list(thumbnails_dir.glob("*.jpg"))
        thumbnail_story_ids = {f.stem for f in thumbnail_files}
        
        # Find missing thumbnails
        missing_thumbnails = story_ids - thumbnail_story_ids
        extra_thumbnails = thumbnail_story_ids - story_ids
        
        print(f"\n📊 Thumbnail Status Report")
        print(f"{'='*50}")
        print(f"Total stories: {len(story_ids)}")
        print(f"Existing thumbnails: {len(thumbnail_files)}")
        print(f"Missing thumbnails: {len(missing_thumbnails)}")
        print(f"Extra thumbnails: {len(extra_thumbnails)}")
        
        if missing_thumbnails:
            print(f"\n❌ Missing thumbnails:")
            for story_id in sorted(missing_thumbnails):
                story = next((s for s in stories if s['id'] == story_id), None)
                title = story['title'] if story else 'Unknown'
                print(f"  - {story_id}: {title}")
        
        if extra_thumbnails:
            print(f"\n⚠️  Extra thumbnails (no matching story):")
            for story_id in sorted(extra_thumbnails):
                print(f"  - {story_id}")
        
        # Show thumbnail details
        if thumbnail_files:
            print(f"\n📁 Existing thumbnails:")
            for thumb_file in sorted(thumbnail_files):
                size = thumb_file.stat().st_size
                size_kb = size / 1024
                print(f"  - {thumb_file.name}: {size_kb:.1f} KB")
    
    def clean_orphaned_thumbnails(self):
        """Remove thumbnails that don't have corresponding stories"""
        stories = self.get_stories_from_api()
        story_ids = {story['id'] for story in stories}
        
        thumbnails_dir = Path("thumbnails")
        removed_count = 0
        
        for thumb_file in thumbnails_dir.glob("*.jpg"):
            story_id = thumb_file.stem
            if story_id not in story_ids:
                thumb_file.unlink()
                logger.info(f"Removed orphaned thumbnail: {thumb_file.name}")
                removed_count += 1
        
        logger.info(f"Removed {removed_count} orphaned thumbnails")
    
    def analyze_story(self, story_id):
        """Analyze a specific story for thumbnail generation"""
        stories = self.get_stories_from_api()
        story = next((s for s in stories if s['id'] == story_id), None)
        
        if not story:
            logger.error(f"Story {story_id} not found")
            return
        
        analysis = self.generator.analyze_story_for_thumbnail(story)
        
        print(f"\n🔍 Analysis for story: {story['title']}")
        print(f"{'='*50}")
        print(f"Category: {analysis['category']}")
        print(f"Themes: {', '.join(analysis['themes'])}")
        print(f"Visual elements: {', '.join(analysis['visual_elements'])}")
        print(f"\nGenerated prompts:")
        for provider, prompt in analysis['prompts'].items():
            print(f"\n{provider.upper()}:")
            print(f"  {prompt}")

def main():
    parser = argparse.ArgumentParser(description='Manage story thumbnails')
    parser.add_argument('command', choices=[
        'generate-all', 'generate-specific', 'status', 'clean', 'analyze'
    ], help='Command to execute')
    parser.add_argument('--story-ids', nargs='+', help='Specific story IDs for targeted operations')
    parser.add_argument('--force', action='store_true', help='Force regenerate existing thumbnails')
    parser.add_argument('--api-url', default='http://localhost:5002', help='API base URL')
    
    args = parser.parse_args()
    
    manager = ThumbnailManager(args.api_url)
    
    try:
        if args.command == 'generate-all':
            manager.generate_all_thumbnails(force_regenerate=args.force)
        
        elif args.command == 'generate-specific':
            if not args.story_ids:
                logger.error("Story IDs required for generate-specific command")
                sys.exit(1)
            manager.generate_specific_thumbnails(args.story_ids, force_regenerate=args.force)
        
        elif args.command == 'status':
            manager.check_status()
        
        elif args.command == 'clean':
            manager.clean_orphaned_thumbnails()
        
        elif args.command == 'analyze':
            if not args.story_ids or len(args.story_ids) != 1:
                logger.error("Single story ID required for analyze command")
                sys.exit(1)
            manager.analyze_story(args.story_ids[0])
    
    except KeyboardInterrupt:
        logger.info("Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
