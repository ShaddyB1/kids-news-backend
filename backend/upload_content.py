#!/usr/bin/env python3
"""
Content Upload Script for Junior News Digest
===========================================

This script uploads all stories, videos, and thumbnails to the app:
- Uploads stories to the database
- Generates and uploads thumbnails
- Links videos with their thumbnails
- Ensures all content is properly connected
"""

import os
import sys
import json
import requests
import time
from pathlib import Path
from thumbnail_generator import ThumbnailGenerator
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ContentUploader:
    def __init__(self, api_base_url="http://localhost:5002"):
        self.api_base_url = api_base_url
        self.thumbnail_generator = ThumbnailGenerator()
        
        # Sample stories data
        self.stories = [
            {
                "id": "story_001",
                "title": "Amazing Ocean Robot Saves Marine Life",
                "headline": "Kids create robot to clean the ocean!",
                "summary": "A group of young scientists built an incredible robot that helps clean plastic from the ocean and saves sea animals.",
                "content": "An incredible robot named \"Ocean Helper\" has saved over 1,000 sea animals from plastic pollution! The robot was created by marine scientists in California. It swims through the ocean like a friendly whale, collecting plastic bottles, bags, and other trash that hurt sea creatures. Since it started working, Ocean Helper has cleaned 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes. The robot uses special sensors to identify plastic and separate it from sea life. It can work for 12 hours on a single charge and has already collected over 50 tons of plastic waste. Marine biologists say this innovation could help save endangered species and restore ocean ecosystems. The young inventors are now working on creating more robots to clean oceans around the world.",
                "author": "Ocean News Team",
                "category": "environment",
                "published_date": "2025-09-10T13:38:19.078600",
                "read_time": "3-5 min",
                "views": 3450,
                "likes": 289,
                "comments": 23,
                "is_breaking": True,
                "is_hot": False,
                "is_trending": True
            },
            {
                "id": "story_002",
                "title": "Young Scientists Discover New Species of Butterfly",
                "headline": "Kids find new butterfly in Amazon rainforest!",
                "summary": "Elementary school students discovered a beautiful new species of butterfly during their nature walk in the Amazon.",
                "content": "A team of young scientists, all under 12 years old, have discovered a brand new species of butterfly in the Amazon rainforest! The colorful butterfly, named \"Sparklewing\", was found during a school field trip to Brazil. The butterfly has iridescent wings that change color from purple to gold depending on the angle of light. Their teacher, Ms. Lily, said the students showed incredible observation skills when they noticed this butterfly had unique patterns never documented before. Scientists from the Natural History Museum confirmed this is a completely new species. The discovery helps us understand more about our planet's amazing biodiversity and proves that young people can make important scientific contributions. The students will have their names recorded as the official discoverers in scientific journals.",
                "author": "Junior Science Team",
                "category": "science",
                "published_date": "2025-09-10T13:38:19.078682",
                "read_time": "3-5 min",
                "views": 2890,
                "likes": 198,
                "comments": 23,
                "is_breaking": False,
                "is_hot": False,
                "is_trending": True
            },
            {
                "id": "story_003",
                "title": "Kids Build Solar-Powered School Bus",
                "headline": "Students create eco-friendly transportation!",
                "summary": "Elementary students designed and built a mini solar-powered school bus that runs entirely on sunlight.",
                "content": "Students from Green Valley School have built a mini solar-powered school bus that runs entirely on sunlight! The bus, which can carry up to 5 children, was designed to show how renewable energy can be used for transportation. The project took six months and involved learning about engineering, solar technology, and environmental science. The bus has solar panels on its roof that charge special batteries, allowing it to travel up to 30 miles on a sunny day. The students used recycled materials for many parts and painted it with eco-friendly paint. Local engineers helped the kids understand electrical systems and safety features. This bright idea for a greener future has inspired other schools to start similar projects. The mayor has invited the students to demonstrate their bus at the city's Earth Day celebration.",
                "author": "Green Tech Kids",
                "category": "technology",
                "published_date": "2025-09-10T13:38:19.078706",
                "read_time": "3-5 min",
                "views": 4100,
                "likes": 356,
                "comments": 23,
                "is_breaking": False,
                "is_hot": True,
                "is_trending": False
            },
            {
                "id": "story_004",
                "title": "Students Plant 50,000 Trees to Fight Climate Change",
                "headline": "Kids lead massive tree-planting campaign!",
                "summary": "Elementary school students organized a community tree-planting event that resulted in 50,000 new trees being planted.",
                "content": "Students from Forest Elementary School organized the biggest tree-planting event in their city's history! Over 500 kids, parents, and community members came together to plant 50,000 trees in local parks and neighborhoods. The students learned about how trees help fight climate change by absorbing carbon dioxide and producing oxygen. Each tree can absorb up to 48 pounds of CO2 per year! The project started when students learned about deforestation in their science class and decided to take action. They raised money through bake sales, car washes, and crowdfunding. Local businesses donated trees and supplies. The new trees will provide homes for birds, shade for communities, and cleaner air for everyone. This amazing project shows how kids can make a real difference in protecting our planet for future generations.",
                "author": "Green Earth Kids",
                "category": "environment",
                "published_date": "2025-09-10T13:38:19.078723",
                "read_time": "3-5 min",
                "views": 5200,
                "likes": 434,
                "comments": 23,
                "is_breaking": True,
                "is_hot": False,
                "is_trending": False
            },
            {
                "id": "story_005",
                "title": "Young Athletes Start Inclusive Sports Program",
                "headline": "Kids create sports program for everyone!",
                "summary": "A group of young athletes launched a new sports program to ensure all children can play together, including those with disabilities.",
                "content": "A group of young athletes in London has launched a new sports program called \"Unity Games\" to ensure all children, including those with disabilities, can play together. The program offers adapted sports like wheelchair basketball, sensory-friendly soccer, and unified swimming. The founders, aged 9 to 11, believe everyone deserves a chance to play and have fun. They worked with Paralympic athletes to design activities that are fun and accessible for all abilities. The program now has over 200 participants and meets three times a week. Parents report their children have made new friends and gained confidence. The Unity Games has received recognition from the International Paralympic Committee and will expand to 10 more cities next year. It's a heartwarming example of how sports can bring people together and create understanding.",
                "author": "Unity Sports Crew",
                "category": "sports",
                "published_date": "2025-09-10T13:38:19.078897",
                "read_time": "3-5 min",
                "views": 1890,
                "likes": 167,
                "comments": 23,
                "is_breaking": False,
                "is_hot": False,
                "is_trending": False
            },
            {
                "id": "story_006",
                "title": "Students Launch Healthy Food Garden Project",
                "headline": "New York students create school garden for healthy food!",
                "summary": "Elementary school students transformed their schoolyard into a vibrant healthy food garden providing fresh meals for everyone.",
                "content": "Elementary school students in New York have transformed their empty schoolyard into a vibrant healthy food garden! They planted vegetables, fruits, and herbs, learning about nutrition and sustainable farming along the way. The garden now produces tomatoes, lettuce, carrots, strawberries, and dozens of other healthy foods. Students take turns watering, weeding, and harvesting the crops. They even built a composting system to recycle food waste into fertilizer. The fresh produce is used in the school cafeteria, providing healthy meals for all 600 students. Extra vegetables are donated to local food banks. Science teachers use the garden for hands-on lessons about plant biology, ecosystems, and climate. This project teaches kids about healthy eating, environmental responsibility, and where their food comes from. The success has inspired 20 other schools in the district to start their own gardens.",
                "author": "Garden Gurus",
                "category": "health",
                "published_date": "2025-09-10T13:38:19.078913",
                "read_time": "3-5 min",
                "views": 2340,
                "likes": 201,
                "comments": 23,
                "is_breaking": False,
                "is_hot": False,
                "is_trending": False
            }
        ]
        
        # Video data
        self.videos = [
            {
                "id": "video_001",
                "title": "Amazing Ocean Robot Saves Marine Life - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_001.mp4",
                "thumbnail_url": "/thumbnails/story_001.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078636"
            },
            {
                "id": "video_002",
                "title": "Young Scientists Discover New Species of Butterfly - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_002.mp4",
                "thumbnail_url": "/thumbnails/story_002.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078688"
            },
            {
                "id": "video_003",
                "title": "Kids Build Solar-Powered School Bus - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_003.mp4",
                "thumbnail_url": "/thumbnails/story_003.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078710"
            },
            {
                "id": "video_004",
                "title": "Students Plant 50,000 Trees to Fight Climate Change - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_004.mp4",
                "thumbnail_url": "/thumbnails/story_004.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078884"
            },
            {
                "id": "video_005",
                "title": "Young Athletes Start Inclusive Sports Program - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_005.mp4",
                "thumbnail_url": "/thumbnails/story_005.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078901"
            },
            {
                "id": "video_006",
                "title": "Students Launch Healthy Food Garden Project - Full Story",
                "description": "Watch this amazing story come to life with animations and narration!",
                "duration": "5:30",
                "video_url": "/videos/story_006.mp4",
                "thumbnail_url": "/thumbnails/story_006.jpg",
                "status": "ready",
                "upload_date": "2025-09-10T13:38:19.078917"
            }
        ]
    
    def check_backend_status(self):
        """Check if backend is running"""
        try:
            response = requests.get(f"{self.api_base_url}/api/articles", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def generate_thumbnails(self):
        """Generate thumbnails for all stories"""
        logger.info("Generating thumbnails for all stories...")
        
        # Generate thumbnails using the thumbnail generator
        results = self.thumbnail_generator.batch_generate_thumbnails(self.stories)
        
        logger.info(f"Generated {len(results)} thumbnails")
        for story_id, path in results.items():
            logger.info(f"  {story_id}: {path}")
        
        return results
    
    def upload_stories(self):
        """Upload stories to the backend"""
        logger.info("Uploading stories to backend...")
        
        for story in self.stories:
            try:
                # Check if story already exists
                response = requests.get(f"{self.api_base_url}/api/articles/{story['id']}", timeout=5)
                if response.status_code == 200:
                    logger.info(f"Story {story['id']} already exists, skipping...")
                    continue
                
                # Upload story
                response = requests.post(
                    f"{self.api_base_url}/api/articles",
                    json=story,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Uploaded story: {story['title']}")
                else:
                    logger.error(f"❌ Failed to upload story {story['id']}: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"❌ Error uploading story {story['id']}: {e}")
    
    def upload_videos(self):
        """Upload video metadata to the backend"""
        logger.info("Uploading video metadata to backend...")
        
        for video in self.videos:
            try:
                # Check if video already exists
                response = requests.get(f"{self.api_base_url}/api/videos/{video['id']}", timeout=5)
                if response.status_code == 200:
                    logger.info(f"Video {video['id']} already exists, skipping...")
                    continue
                
                # Upload video metadata
                response = requests.post(
                    f"{self.api_base_url}/api/videos",
                    json=video,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Uploaded video: {video['title']}")
                else:
                    logger.error(f"❌ Failed to upload video {video['id']}: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"❌ Error uploading video {video['id']}: {e}")
    
    def generate_quizzes(self):
        """Generate quizzes for all stories"""
        logger.info("Generating quizzes for all stories...")
        
        for story in self.stories:
            try:
                # Check if quiz already exists
                response = requests.get(f"{self.api_base_url}/api/articles/{story['id']}/quiz", timeout=5)
                if response.status_code == 200:
                    logger.info(f"Quiz for {story['id']} already exists, skipping...")
                    continue
                
                # Generate quiz based on story content
                quiz = self.create_quiz_for_story(story)
                
                # Upload quiz
                response = requests.post(
                    f"{self.api_base_url}/api/articles/{story['id']}/quiz",
                    json=quiz,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    logger.info(f"✅ Generated quiz for: {story['title']}")
                else:
                    logger.error(f"❌ Failed to generate quiz for {story['id']}: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"❌ Error generating quiz for {story['id']}: {e}")
    
    def create_quiz_for_story(self, story):
        """Create a quiz for a story"""
        # Simple quiz generation based on story content
        questions = []
        
        if "robot" in story['content'].lower():
            questions.append({
                "question": "What does the Ocean Helper robot do?",
                "options": [
                    "It cleans plastic from the ocean",
                    "It feeds sea animals",
                    "It builds coral reefs",
                    "It studies fish behavior"
                ],
                "answer": "It cleans plastic from the ocean",
                "explanation": "The Ocean Helper robot swims through the ocean collecting plastic bottles, bags, and other trash that hurt sea creatures."
            })
        
        if "butterfly" in story['content'].lower():
            questions.append({
                "question": "What is special about the Sparklewing butterfly?",
                "options": [
                    "It can fly very fast",
                    "Its wings change color from purple to gold",
                    "It is very large",
                    "It lives in the desert"
                ],
                "answer": "Its wings change color from purple to gold",
                "explanation": "The Sparklewing butterfly has iridescent wings that change color from purple to gold depending on the angle of light."
            })
        
        if "solar" in story['content'].lower():
            questions.append({
                "question": "What powers the solar school bus?",
                "options": [
                    "Gasoline",
                    "Electricity from the grid",
                    "Sunlight",
                    "Wind energy"
                ],
                "answer": "Sunlight",
                "explanation": "The bus has solar panels on its roof that charge special batteries, allowing it to run entirely on sunlight."
            })
        
        if "trees" in story['content'].lower():
            questions.append({
                "question": "How many trees did the students plant?",
                "options": [
                    "5,000",
                    "50,000",
                    "500,000",
                    "5,000,000"
                ],
                "answer": "50,000",
                "explanation": "The students organized the biggest tree-planting event in their city's history, planting 50,000 trees."
            })
        
        if "sports" in story['content'].lower():
            questions.append({
                "question": "What is the name of the inclusive sports program?",
                "options": [
                    "Team Spirit",
                    "Unity Games",
                    "All Together",
                    "Sports for All"
                ],
                "answer": "Unity Games",
                "explanation": "The program is called 'Unity Games' and ensures all children, including those with disabilities, can play together."
            })
        
        if "garden" in story['content'].lower():
            questions.append({
                "question": "What do students learn from the school garden?",
                "options": [
                    "Only about plants",
                    "About nutrition, farming, and environmental responsibility",
                    "Only about cooking",
                    "Only about science"
                ],
                "answer": "About nutrition, farming, and environmental responsibility",
                "explanation": "The garden teaches kids about healthy eating, environmental responsibility, and where their food comes from."
            })
        
        # Add a general question if we don't have enough
        if len(questions) < 3:
            questions.append({
                "question": f"What is the main topic of this story?",
                "options": [
                    story['category'].title(),
                    "Technology",
                    "Sports",
                    "Education"
                ],
                "answer": story['category'].title(),
                "explanation": f"This story is about {story['category']} and shows how kids can make a difference."
            })
        
        return {
            "id": f"quiz_{story['id']}",
            "title": f"{story['title']} Quiz",
            "article_id": story['id'],
            "questions": questions[:3],  # Limit to 3 questions
            "total_questions": min(3, len(questions)),
            "created_date": story['published_date']
        }
    
    def verify_upload(self):
        """Verify that all content was uploaded successfully"""
        logger.info("Verifying upload...")
        
        try:
            # Check stories
            response = requests.get(f"{self.api_base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                data = response.json()
                stories_count = len(data.get('articles', []))
                logger.info(f"✅ Stories in database: {stories_count}")
            else:
                logger.error("❌ Failed to verify stories")
            
            # Check videos
            response = requests.get(f"{self.api_base_url}/api/videos", timeout=10)
            if response.status_code == 200:
                data = response.json()
                videos_count = len(data.get('videos', []))
                logger.info(f"✅ Videos in database: {videos_count}")
            else:
                logger.error("❌ Failed to verify videos")
            
            # Check thumbnails
            response = requests.get(f"{self.api_base_url}/api/thumbnails/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                thumbnails_count = data.get('status', {}).get('total_thumbnails', 0)
                logger.info(f"✅ Thumbnails available: {thumbnails_count}")
            else:
                logger.warning("⚠️ Could not verify thumbnails (API may not be available)")
                
        except Exception as e:
            logger.error(f"❌ Error during verification: {e}")
    
    def run_full_upload(self):
        """Run the complete upload process"""
        logger.info("🚀 Starting complete content upload process...")
        
        # Check backend status
        if not self.check_backend_status():
            logger.error("❌ Backend is not running. Please start the backend first.")
            return False
        
        logger.info("✅ Backend is running")
        
        # Generate thumbnails
        self.generate_thumbnails()
        
        # Upload stories
        self.upload_stories()
        
        # Upload videos
        self.upload_videos()
        
        # Generate quizzes
        self.generate_quizzes()
        
        # Verify upload
        self.verify_upload()
        
        logger.info("🎉 Upload process completed!")
        return True

def main():
    """Main function"""
    uploader = ContentUploader()
    uploader.run_full_upload()

if __name__ == "__main__":
    main()
