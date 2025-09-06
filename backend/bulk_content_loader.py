#!/usr/bin/env python3
"""
Bulk Content Loader for Junior News Digest
==========================================

This script loads content from JSON files or generates sample content
for testing and development purposes.

Usage:
    python bulk_content_loader.py --sample-articles 10
    python bulk_content_loader.py --sample-videos 5
    python bulk_content_loader.py --from-json articles.json
"""

import argparse
import json
import sys
import os
from datetime import datetime, timedelta
import random

# Add the production directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from add_content import ContentManager

class BulkContentLoader:
    def __init__(self):
        self.cm = ContentManager()
        
    def generate_sample_articles(self, count=10):
        """Generate sample articles for testing"""
        
        sample_articles = [
            {
                "title": "Young Inventors Create Solar-Powered School Bus",
                "content": "A group of brilliant students from Green Valley Middle School has invented an amazing solar-powered school bus! The bus uses special solar panels on its roof to collect energy from the sun. This means the bus doesn't need to use gas that can hurt our planet. The students worked with their science teacher, Ms. Rodriguez, for six months to build this incredible invention. The solar bus can travel 50 miles on a sunny day without using any fuel! The school district is so impressed that they want to build more solar buses. This invention shows how young people can create solutions to help protect our environment. The students hope their idea will inspire other schools around the world to use clean energy for transportation.",
                "category": "technology",
                "author": "Emma Science Reporter",
                "is_trending": True
            },
            {
                "title": "Ocean Cleanup Robot Saves 1000 Sea Animals",
                "content": "An incredible robot named 'Ocean Helper' has saved over 1,000 sea animals from plastic pollution! The robot was created by marine scientists in California. It swims through the ocean like a friendly whale, collecting plastic bottles, bags, and other trash that hurt sea creatures. The robot uses special sensors to find pollution and sucks it up with powerful vacuums. Since it started working three months ago, Ocean Helper has cleaned 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes. The scientists are building five more robots to help clean other parts of the ocean. This amazing invention shows how technology can help protect our ocean friends and keep our planet healthy.",
                "category": "environment",
                "author": "Ocean News Team",
                "is_hot": True
            },
            {
                "title": "New Medicine Helps Kids with Allergies Feel Better",
                "content": "Scientists have discovered a new medicine that helps children with food allergies stay safe and healthy! The medicine works like a superhero shield, protecting kids from dangerous allergic reactions. Dr. Sarah Chen and her team tested the medicine with 200 children who have peanut allergies. The results were amazing - 95% of the kids could eat small amounts of peanuts without getting sick! This is huge news for families because food allergies affect 1 in 13 children. The medicine helps train the body's immune system to be less scared of certain foods. Parents are excited because this means their kids can eat more safely at school and with friends. The new treatment will be available in hospitals next year, giving hope to millions of families worldwide.",
                "category": "health",
                "author": "Dr. Health News",
                "is_breaking": True
            },
            {
                "title": "Students Build Robot That Helps Elderly People",
                "content": "Amazing students from Tech Academy have built a helpful robot for elderly people in nursing homes! The robot, named 'Grandpa Bot,' can bring medicine, play games, and even tell jokes to make seniors smile. It has wheels to move around, cameras to see, and speakers to talk with a friendly voice. The students spent eight months programming the robot to understand what elderly people need most. Grandpa Bot can remind people to take their medicine, call for help if someone falls, and play music from the 1950s and 1960s that seniors love. The robot has already visited three nursing homes, and the residents absolutely love it! One 85-year-old woman said Grandpa Bot is her new best friend. The students plan to build 10 more robots to help seniors in their community feel less lonely and more cared for.",
                "category": "technology",
                "author": "Robot News Reporter"
            },
            {
                "title": "Kids Plant 10,000 Trees to Fight Climate Change",
                "content": "Thousands of children from around the world have planted 10,000 trees in just one weekend! The amazing project, called 'Trees for Tomorrow,' happened in 15 different countries. Kids aged 6 to 16 worked with their families and teachers to plant oak, maple, and fruit trees in parks, schools, and neighborhoods. The idea started when 10-year-old Maya from Kenya wrote a letter to kids everywhere asking them to help save the planet. Scientists say these 10,000 new trees will clean the air, provide homes for animals, and help stop climate change. Each tree can absorb 48 pounds of carbon dioxide every year! The children also learned about how trees help our environment and why forests are so important. Maya's letter has inspired even more kids to start planting trees in their communities, creating a global movement of young environmental heroes.",
                "category": "environment",
                "author": "Green Planet News",
                "is_trending": True
            }
        ]
        
        # Add more sample articles to reach the requested count
        categories = ["technology", "science", "environment", "health", "education", "sports", "culture"]
        authors = ["Junior Science Team", "Young Reporter", "Kid News Network", "Future Leaders News", "Discovery Kids"]
        
        for i in range(len(sample_articles), count):
            category = random.choice(categories)
            author = random.choice(authors)
            
            article = {
                "title": f"Amazing Discovery #{i+1} in {category.title()}",
                "content": f"This is a sample article about an exciting discovery in {category}. Young scientists and inventors are making incredible breakthroughs that help make our world better. This story shows how kids can make a real difference through science, technology, and creativity. The research team worked for months to develop this amazing solution that will help people and protect our environment. This discovery proves that young people have the power to solve big problems and create positive change in the world.",
                "category": category,
                "author": author,
                "is_trending": random.choice([True, False]),
                "is_hot": random.choice([True, False]),
                "is_breaking": random.choice([True, False]) if i < 3 else False
            }
            sample_articles.append(article)
        
        # Add articles to database
        added_count = 0
        for article in sample_articles[:count]:
            article_id = self.cm.add_article(**article)
            if article_id:
                added_count += 1
        
        print(f"✅ Added {added_count} sample articles to the database!")
        return added_count
    
    def generate_sample_videos(self, count=5):
        """Generate sample videos for testing"""
        
        sample_videos = [
            {
                "title": "Amazing Ocean Robot Saves Sea Animals",
                "video_url": "https://example.com/videos/ocean-robot.mp4",
                "description": "Watch the incredible Ocean Helper robot clean plastic from the ocean and save sea creatures! This amazing invention shows how technology can protect marine life.",
                "duration": "4:32",
                "category": "environment"
            },
            {
                "title": "Kids Build Solar-Powered School Bus",
                "video_url": "https://example.com/videos/solar-bus.mp4", 
                "description": "See how creative students invented a school bus that runs on sunshine! Learn about solar energy and how it helps our planet.",
                "duration": "3:45",
                "category": "technology"
            },
            {
                "title": "Young Scientists Discover New Medicine",
                "video_url": "https://example.com/videos/new-medicine.mp4",
                "description": "Follow the story of scientists who created medicine to help kids with allergies stay safe and healthy.",
                "duration": "5:18",
                "category": "health"
            },
            {
                "title": "Robot Helper for Grandparents",
                "video_url": "https://example.com/videos/grandpa-bot.mp4",
                "description": "Meet Grandpa Bot, the friendly robot that helps elderly people and makes them smile every day!",
                "duration": "4:01",
                "category": "technology"
            },
            {
                "title": "10,000 Trees Planted by Kids Worldwide",
                "video_url": "https://example.com/videos/tree-planting.mp4",
                "description": "Join the global movement of young environmental heroes planting trees to fight climate change!",
                "duration": "6:15",
                "category": "environment"
            }
        ]
        
        # Generate more videos if needed
        categories = ["technology", "science", "environment", "health", "education", "sports"]
        
        for i in range(len(sample_videos), count):
            category = random.choice(categories)
            video = {
                "title": f"Amazing Video #{i+1}: {category.title()} Discovery",
                "video_url": f"https://example.com/videos/sample-{i+1}.mp4",
                "description": f"An exciting video about discoveries in {category} that will inspire and educate young minds.",
                "duration": f"{random.randint(3,7)}:{random.randint(10,59):02d}",
                "category": category
            }
            sample_videos.append(video)
        
        # Add videos to database
        added_count = 0
        for video in sample_videos[:count]:
            video_id = self.cm.add_video(**video)
            if video_id:
                added_count += 1
        
        print(f"✅ Added {added_count} sample videos to the database!")
        return added_count
    
    def load_from_json(self, json_file):
        """Load content from a JSON file"""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            added_articles = 0
            added_videos = 0
            
            # Load articles
            if 'articles' in data:
                for article in data['articles']:
                    article_id = self.cm.add_article(**article)
                    if article_id:
                        added_articles += 1
            
            # Load videos  
            if 'videos' in data:
                for video in data['videos']:
                    video_id = self.cm.add_video(**video)
                    if video_id:
                        added_videos += 1
            
            print(f"✅ Loaded from {json_file}:")
            print(f"   Articles: {added_articles}")
            print(f"   Videos: {added_videos}")
            
            return added_articles, added_videos
            
        except Exception as e:
            print(f"❌ Error loading from JSON: {e}")
            return 0, 0

def main():
    parser = argparse.ArgumentParser(description='Bulk Content Loader for Junior News Digest')
    
    parser.add_argument('--sample-articles', type=int, help='Generate N sample articles')
    parser.add_argument('--sample-videos', type=int, help='Generate N sample videos')
    parser.add_argument('--from-json', help='Load content from JSON file')
    parser.add_argument('--create-sample-json', help='Create sample JSON file with given name')
    
    args = parser.parse_args()
    
    if not any([args.sample_articles, args.sample_videos, args.from_json, args.create_sample_json]):
        parser.print_help()
        return
    
    loader = BulkContentLoader()
    
    if args.sample_articles:
        loader.generate_sample_articles(args.sample_articles)
    
    if args.sample_videos:
        loader.generate_sample_videos(args.sample_videos)
    
    if args.from_json:
        loader.load_from_json(args.from_json)
    
    if args.create_sample_json:
        # Create a sample JSON file
        sample_data = {
            "articles": [
                {
                    "title": "Sample Article from JSON",
                    "content": "This is a sample article loaded from a JSON file. You can create files like this to bulk-load content into your backend.",
                    "category": "technology",
                    "author": "JSON Loader",
                    "is_trending": True
                }
            ],
            "videos": [
                {
                    "title": "Sample Video from JSON",
                    "video_url": "https://example.com/sample.mp4",
                    "description": "This is a sample video loaded from JSON.",
                    "duration": "3:30",
                    "category": "education"
                }
            ]
        }
        
        with open(args.create_sample_json, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, indent=2)
        
        print(f"✅ Created sample JSON file: {args.create_sample_json}")

if __name__ == '__main__':
    main()
