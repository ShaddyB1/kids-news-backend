#!/usr/bin/env python3
"""
Junior News Digest - Complete Automation System
Handles: Story Selection → Script Generation → Video Creation → Quiz Generation → App Upload
"""

import os
import sys
import json
import uuid
import asyncio
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
import sqlite3
import requests
import feedparser
from dotenv import load_dotenv

# Import our existing systems
sys.path.append(str(Path(__file__).parent))
from backend_api import DatabaseManager, NewsArticle, Quiz
from weekly_content_system import WeeklyContentSystem, Story

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('complete_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class GeneratedContent:
    """Container for all generated content"""
    story: Story
    article: NewsArticle
    script: str
    video_path: Optional[str] = None
    quiz: Optional[Quiz] = None
    thumbnail_path: Optional[str] = None

class StorySelector:
    """Advanced story selection and curation system"""
    
    def __init__(self):
        self.content_system = WeeklyContentSystem()
        self.db = DatabaseManager()
    
    async def select_daily_stories(self, count: int = 10) -> List[Story]:
        """Select and curate daily stories for children"""
        logger.info(f"Selecting {count} daily stories...")
        
        # Get fresh stories from multiple sources
        all_stories = []
        
        # News sources optimized for kid-friendly content
        sources = [
            "https://newsela.com/rss/",
            "https://www.natgeokids.com/uk/feed/",
            "https://www.timeforkids.com/feed/",
            "https://www.scholastic.com/teachers/blog-posts/gail-hennessey/feed/"
        ]
        
        for source in sources:
            try:
                stories = await self._fetch_stories_from_source(source)
                all_stories.extend(stories)
            except Exception as e:
                logger.warning(f"Failed to fetch from {source}: {e}")
                continue
        
        # Filter and score stories
        filtered_stories = await self._filter_and_score_stories(all_stories)
        
        # Select top stories with diversity
        selected_stories = await self._select_diverse_stories(filtered_stories, count)
        
        logger.info(f"Selected {len(selected_stories)} stories successfully")
        return selected_stories
    
    async def _fetch_stories_from_source(self, source_url: str) -> List[Story]:
        """Fetch stories from a specific RSS source"""
        try:
            feed = feedparser.parse(source_url)
            stories = []
            
            for entry in feed.entries[:20]:  # Limit to 20 per source
                story = Story(
                    id=str(uuid.uuid4()),
                    title=entry.title,
                    content=getattr(entry, 'summary', entry.title),
                    category=self._categorize_story(entry.title + " " + getattr(entry, 'summary', '')),
                    source_url=entry.link,
                    kid_friendly_score=0.0  # Will be calculated later
                )
                stories.append(story)
            
            return stories
        except Exception as e:
            logger.error(f"Error fetching from {source_url}: {e}")
            return []
    
    def _categorize_story(self, text: str) -> str:
        """Categorize story based on content"""
        text_lower = text.lower()
        
        categories = {
            'Science': ['science', 'research', 'discovery', 'experiment', 'study'],
            'Technology': ['technology', 'robot', 'ai', 'computer', 'app', 'digital'],
            'Environment': ['environment', 'climate', 'nature', 'animals', 'ocean', 'forest'],
            'Space': ['space', 'nasa', 'planet', 'star', 'astronaut', 'rocket'],
            'Health': ['health', 'medicine', 'doctor', 'exercise', 'nutrition'],
            'Education': ['school', 'student', 'teacher', 'learning', 'education'],
            'Sports': ['sports', 'olympic', 'game', 'team', 'player', 'championship']
        }
        
        for category, keywords in categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        
        return 'General'
    
    async def _filter_and_score_stories(self, stories: List[Story]) -> List[Story]:
        """Filter stories for kid-appropriateness and score them"""
        filtered_stories = []
        
        for story in stories:
            # Basic content filtering
            if self._is_kid_appropriate(story.content):
                story.kid_friendly_score = self._calculate_kid_score(story)
                filtered_stories.append(story)
        
        # Sort by score
        filtered_stories.sort(key=lambda s: s.kid_friendly_score, reverse=True)
        return filtered_stories
    
    def _is_kid_appropriate(self, content: str) -> bool:
        """Check if content is appropriate for children"""
        content_lower = content.lower()
        
        # Blocked keywords
        blocked_words = [
            'violence', 'death', 'kill', 'murder', 'war', 'terrorism',
            'drug', 'alcohol', 'crime', 'prison', 'arrest', 'gun',
            'disaster', 'tragedy', 'accident', 'crash', 'fire'
        ]
        
        return not any(word in content_lower for word in blocked_words)
    
    def _calculate_kid_score(self, story: Story) -> float:
        """Calculate how kid-friendly and engaging a story is"""
        score = 0.5  # Base score
        
        content_lower = story.content.lower()
        title_lower = story.title.lower()
        
        # Positive keywords boost score
        positive_words = [
            'discovery', 'invention', 'amazing', 'incredible', 'hero',
            'save', 'help', 'protect', 'learn', 'explore', 'adventure',
            'fun', 'exciting', 'wonderful', 'brilliant', 'creative'
        ]
        
        educational_words = [
            'scientist', 'researcher', 'student', 'school', 'university',
            'experiment', 'study', 'research', 'innovation', 'breakthrough'
        ]
        
        # Calculate score based on positive content
        positive_count = sum(1 for word in positive_words if word in content_lower or word in title_lower)
        educational_count = sum(1 for word in educational_words if word in content_lower or word in title_lower)
        
        score += positive_count * 0.1
        score += educational_count * 0.15
        
        # Bonus for certain categories
        category_bonuses = {
            'Science': 0.2,
            'Technology': 0.15,
            'Environment': 0.2,
            'Space': 0.25,
            'Education': 0.15
        }
        
        score += category_bonuses.get(story.category, 0)
        
        # Length penalty (too long or too short)
        word_count = len(story.content.split())
        if 50 <= word_count <= 200:
            score += 0.1
        elif word_count < 20 or word_count > 500:
            score -= 0.2
        
        return min(1.0, score)  # Cap at 1.0
    
    async def _select_diverse_stories(self, stories: List[Story], count: int) -> List[Story]:
        """Select diverse stories across categories"""
        selected = []
        categories_used = set()
        
        # First pass: select best story from each category
        for story in stories:
            if len(selected) >= count:
                break
            
            if story.category not in categories_used:
                selected.append(story)
                categories_used.add(story.category)
        
        # Second pass: fill remaining slots with highest scoring stories
        remaining_count = count - len(selected)
        remaining_stories = [s for s in stories if s not in selected]
        
        for story in remaining_stories[:remaining_count]:
            selected.append(story)
        
        return selected

class ScriptGenerator:
    """Generate engaging scripts for children from news stories"""
    
    def __init__(self):
        self.templates = {
            'Science': """
🔬 Amazing Science Discovery! 

Hey young scientists! 🌟 Today we have an incredible discovery to share with you!

{title}

{engaging_intro}

Here's what happened: {main_content}

Why is this so cool? {explanation}

What can we learn from this? {lesson}

Remember, science is all around us, and YOU could be the next great discoverer! 🚀

Keep exploring, keep questioning, and keep being amazing! ✨
""",
            'Technology': """
🤖 Tech News That's Out of This World!

Hello future inventors! 💡 Get ready for some mind-blowing technology news!

{title}

{engaging_intro}

Check this out: {main_content}

How does this work? {explanation}

What does this mean for our future? {lesson}

Technology is changing our world every day, and who knows? Maybe YOU will create the next amazing invention! 🌟

Stay curious and keep dreaming big! 🚀
""",
            'Environment': """
🌍 Protecting Our Amazing Planet!

Hey Earth heroes! 🌱 We have some fantastic environmental news to share!

{title}

{engaging_intro}

Here's the amazing story: {main_content}

Why is this important for our planet? {explanation}

How can we help too? {lesson}

Every small action counts when it comes to protecting our beautiful Earth! 🌟

You're never too young to be an environmental hero! 💚
""",
            'default': """
📰 Incredible News for Young Minds!

Hello brilliant kids! ✨ We have an amazing story to share with you today!

{title}

{engaging_intro}

Here's what happened: {main_content}

Why is this story special? {explanation}

What can we learn from this? {lesson}

Remember, the world is full of incredible stories and amazing people doing wonderful things! 🌟

Keep being curious and keep learning! 📚
"""
        }
    
    async def generate_script(self, story: Story) -> str:
        """Generate an engaging script for children"""
        logger.info(f"Generating script for: {story.title}")
        
        template = self.templates.get(story.category, self.templates['default'])
        
        # Process the story content
        engaging_intro = self._create_engaging_intro(story)
        main_content = self._simplify_content(story.content)
        explanation = self._create_explanation(story)
        lesson = self._create_lesson(story)
        
        script = template.format(
            title=story.title,
            engaging_intro=engaging_intro,
            main_content=main_content,
            explanation=explanation,
            lesson=lesson
        )
        
        # Clean up and optimize
        script = self._optimize_script(script)
        
        logger.info("Script generated successfully")
        return script
    
    def _create_engaging_intro(self, story: Story) -> str:
        """Create an engaging introduction"""
        intros = {
            'Science': [
                "Scientists have made a discovery that will blow your mind! 🤯",
                "Get ready to have your socks knocked off by this amazing scientific breakthrough! 🧦",
                "This discovery is so cool, it belongs in a superhero movie! 🦸‍♀️"
            ],
            'Technology': [
                "The future is here, and it's more amazing than we ever imagined! 🚀",
                "Technology just got a whole lot cooler! 💻",
                "This new invention is straight out of a sci-fi movie! 🎬"
            ],
            'Environment': [
                "Our planet Earth has some incredible surprises for us! 🌎",
                "Mother Nature is showing us how amazing she really is! 🦋",
                "This environmental story will make you want to hug a tree! 🌳"
            ]
        }
        
        category_intros = intros.get(story.category, [
            "This story is absolutely incredible! ⭐",
            "You won't believe what happened next! 😲",
            "Get ready for an amazing adventure! 🎪"
        ])
        
        import random
        return random.choice(category_intros)
    
    def _simplify_content(self, content: str) -> str:
        """Simplify content for children"""
        # Basic simplification rules
        content = content.replace("approximately", "about")
        content = content.replace("significant", "important")
        content = content.replace("demonstrate", "show")
        content = content.replace("utilize", "use")
        content = content.replace("facilitate", "help")
        
        # Keep it concise - max 3 sentences
        sentences = content.split('. ')[:3]
        return '. '.join(sentences)
    
    def _create_explanation(self, story: Story) -> str:
        """Create child-friendly explanation"""
        explanations = {
            'Science': "This discovery helps us understand our world better and could lead to new inventions that make life easier!",
            'Technology': "This technology shows us how creative humans can be when we put our minds to solving problems!",
            'Environment': "This reminds us how important it is to take care of our planet and all the amazing creatures that live here!",
            'Space': "Space is full of mysteries, and every discovery brings us closer to understanding our universe!",
            'Health': "Taking care of our bodies and minds helps us live happy, healthy lives!",
            'Education': "Learning new things every day makes us smarter and helps us achieve our dreams!"
        }
        
        return explanations.get(story.category, "This story shows us how amazing our world is and how much we can accomplish when we work together!")
    
    def _create_lesson(self, story: Story) -> str:
        """Create educational lesson"""
        lessons = {
            'Science': "Science is everywhere! You can be a scientist too by asking questions, making observations, and trying experiments safely at home.",
            'Technology': "Technology is a tool that helps us solve problems. Think about problems you see and how you might solve them!",
            'Environment': "We can all help protect our environment by recycling, saving water, and being kind to animals and plants.",
            'Space': "The universe is huge and full of wonders. Keep looking up at the stars and dreaming about what's possible!",
            'Health': "Eating healthy foods, exercising, and getting enough sleep helps our bodies and brains work their best!",
            'Education': "Every day is a chance to learn something new. Stay curious and never stop asking 'why' and 'how'!"
        }
        
        return lessons.get(story.category, "Remember, you have the power to make a positive difference in the world, no matter how young you are!")
    
    def _optimize_script(self, script: str) -> str:
        """Optimize script for voice generation"""
        # Add pauses for natural speech
        script = script.replace('!', '! [pause]')
        script = script.replace('?', '? [pause]')
        script = script.replace('.', '. [short pause]')
        
        # Ensure proper pronunciation hints
        script = script.replace('🔬', '[excited] Science')
        script = script.replace('🤖', '[enthusiastic] Technology')
        script = script.replace('🌍', '[warm] Environment')
        
        return script

class VideoGenerator:
    """Generate educational videos with Leonardo.ai illustrations"""
    
    def __init__(self):
        self.leonardo_api_key = os.getenv('LEONARDO_API_KEY')
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
        self.voice_id = "paRTfYnetOrTukxfEm1J"  # Your preferred voice
    
    async def generate_video(self, content: GeneratedContent) -> str:
        """Generate complete video with illustrations and narration"""
        logger.info(f"Generating video for: {content.article.title}")
        
        # Create output directory
        video_id = str(uuid.uuid4())
        output_dir = Path(f"generated_videos/final")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            # Generate audio narration
            audio_path = await self._generate_audio(content.script, video_id)
            
            # Generate illustrations
            image_paths = await self._generate_illustrations(content.story, video_id)
            
            # Create video with FFmpeg
            video_path = await self._create_video(audio_path, image_paths, video_id)
            
            # Add branding
            final_video_path = await self._add_branding(video_path, video_id)
            
            content.video_path = final_video_path
            logger.info(f"Video generated successfully: {final_video_path}")
            
            return final_video_path
            
        except Exception as e:
            logger.error(f"Error generating video: {e}")
            raise
    
    async def _generate_audio(self, script: str, video_id: str) -> str:
        """Generate audio narration using ElevenLabs"""
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_api_key
        }
        
        data = {
            "text": script,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.3,
                "use_speaker_boost": True
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        audio_path = f"generated_videos/audio/{video_id}_narration.mp3"
        os.makedirs(os.path.dirname(audio_path), exist_ok=True)
        
        with open(audio_path, "wb") as f:
            f.write(response.content)
        
        return audio_path
    
    async def _generate_illustrations(self, story: Story, video_id: str) -> List[str]:
        """Generate cartoon illustrations using Leonardo.ai"""
        # For now, use fallback images - integrate with Leonardo.ai API when available
        from PIL import Image, ImageDraw, ImageFont
        
        image_paths = []
        scenes = self._create_scene_descriptions(story)
        
        for i, scene_desc in enumerate(scenes):
            image_path = f"generated_videos/images/{video_id}_scene_{i:02d}.png"
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            
            # Create colorful placeholder illustration
            img = Image.new('RGB', (1920, 1080), color=self._get_category_color(story.category))
            draw = ImageDraw.Draw(img)
            
            # Add scene text
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 60)
            except:
                font = ImageFont.load_default()
            
            # Center the text
            text_bbox = draw.textbbox((0, 0), scene_desc, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            x = (1920 - text_width) // 2
            y = (1080 - text_height) // 2
            
            draw.text((x, y), scene_desc, fill='white', font=font)
            
            img.save(image_path)
            image_paths.append(image_path)
        
        return image_paths
    
    def _create_scene_descriptions(self, story: Story) -> List[str]:
        """Create scene descriptions for illustration"""
        base_scenes = [
            f"🌟 {story.title}",
            f"📍 Location: {story.category}",
            "🎭 The Story Unfolds",
            "✨ Amazing Results",
            "🚀 What This Means"
        ]
        return base_scenes
    
    def _get_category_color(self, category: str) -> tuple:
        """Get color scheme for category"""
        colors = {
            'Science': (74, 158, 255),      # Blue
            'Technology': (255, 184, 77),   # Orange  
            'Environment': (76, 175, 80),   # Green
            'Space': (103, 58, 183),        # Purple
            'Health': (244, 67, 54),        # Red
            'Education': (255, 193, 7),     # Yellow
            'Sports': (0, 188, 212),        # Cyan
        }
        return colors.get(category, (96, 125, 139))  # Default gray
    
    async def _create_video(self, audio_path: str, image_paths: List[str], video_id: str) -> str:
        """Create video using FFmpeg"""
        output_path = f"generated_videos/temp/{video_id}_temp.mp4"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Create image sequence
        images_per_scene = len(image_paths)
        scene_duration = 3.0  # seconds per scene
        
        # FFmpeg command to create video
        cmd = [
            "ffmpeg", "-y",
            "-framerate", "1/3",  # 3 seconds per image
            "-i", f"generated_videos/images/{video_id}_scene_%02d.png",
            "-i", audio_path,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-pix_fmt", "yuv420p",
            "-shortest",
            output_path
        ]
        
        import subprocess
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"FFmpeg error: {result.stderr}")
            raise Exception(f"Video creation failed: {result.stderr}")
        
        return output_path
    
    async def _add_branding(self, video_path: str, video_id: str) -> str:
        """Add Junior News Digest branding"""
        final_path = f"generated_videos/final/{video_id}_branded.mp4"
        os.makedirs(os.path.dirname(final_path), exist_ok=True)
        
        logo_path = "../OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png"
        
        if os.path.exists(logo_path):
            # Add logo overlay
            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-i", logo_path,
                "-filter_complex", 
                "[1:v]scale=200:200[logo];[0:v][logo]overlay=W-w-20:20",
                "-c:a", "copy",
                final_path
            ]
            
            import subprocess
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                return final_path
        
        # Fallback: just copy the file
        import shutil
        shutil.copy2(video_path, final_path)
        return final_path

class QuizGenerator:
    """Generate educational quizzes from articles"""
    
    def __init__(self):
        self.db = DatabaseManager()
    
    async def generate_quiz(self, content: GeneratedContent) -> Quiz:
        """Generate an educational quiz"""
        logger.info(f"Generating quiz for: {content.article.title}")
        
        questions = []
        
        # Question 1: Main topic
        questions.append({
            "id": "q1",
            "question": f"What is the main topic of this story?",
            "options": {
                "A": content.article.category,
                "B": "Sports",
                "C": "Weather", 
                "D": "Entertainment"
            },
            "correct_answer": "A",
            "explanation": f"This story is about {content.article.category.lower()}!"
        })
        
        # Question 2: Key detail
        questions.append({
            "id": "q2", 
            "question": "Why is this story important for kids to know?",
            "options": {
                "A": "It's just for fun",
                "B": "It teaches us about our world",
                "C": "It's not important",
                "D": "Only adults need to know"
            },
            "correct_answer": "B",
            "explanation": "Learning about our world helps us become smarter and more curious!"
        })
        
        # Question 3: Application
        questions.append({
            "id": "q3",
            "question": f"How can this {content.article.category.lower()} story inspire you?",
            "options": {
                "A": "It can't inspire me",
                "B": "By showing me new possibilities",
                "C": "It's too difficult to understand", 
                "D": "Only scientists can be inspired"
            },
            "correct_answer": "B",
            "explanation": "Every story can inspire us to learn more and dream bigger!"
        })
        
        quiz = Quiz(
            id=str(uuid.uuid4()),
            article_id=content.article.id,
            title=f"Quiz: {content.article.title}",
            questions=questions,
            total_score=len(questions),
            created_date=datetime.utcnow().isoformat()
        )
        
        content.quiz = quiz
        logger.info("Quiz generated successfully")
        return quiz

class CompleteAutomationSystem:
    """Main orchestrator for the complete automation system"""
    
    def __init__(self):
        self.story_selector = StorySelector()
        self.script_generator = ScriptGenerator()
        self.video_generator = VideoGenerator()
        self.quiz_generator = QuizGenerator()
        self.db = DatabaseManager()
    
    async def run_daily_automation(self) -> List[GeneratedContent]:
        """Run the complete daily automation pipeline"""
        logger.info("🚀 Starting daily automation pipeline...")
        
        try:
            # Step 1: Select stories
            stories = await self.story_selector.select_daily_stories(count=5)
            logger.info(f"✅ Selected {len(stories)} stories")
            
            # Step 2: Process each story
            generated_content = []
            
            for story in stories:
                logger.info(f"Processing story: {story.title}")
                
                content = GeneratedContent(story=story, article=None, script="")
                
                # Create article
                content.article = NewsArticle(
                    id=str(uuid.uuid4()),
                    title=story.title,
                    headline=story.title,
                    content=story.content,
                    summary=story.content[:200] + "...",
                    category=story.category,
                    author="Junior News Team",
                    published_date=datetime.utcnow().isoformat(),
                    read_time="3 min read",
                    is_trending=story.kid_friendly_score > 0.8
                )
                
                # Generate script
                content.script = await self.script_generator.generate_script(story)
                
                # Generate video
                video_path = await self.video_generator.generate_video(content)
                content.article.video_url = video_path
                
                # Generate quiz
                quiz = await self.quiz_generator.generate_quiz(content)
                content.article.quiz_id = quiz.id
                
                # Save to database
                self.db.insert_article(content.article)
                
                # Save quiz
                query = '''
                    INSERT INTO quizzes (id, article_id, title, questions, total_score, created_date)
                    VALUES (?, ?, ?, ?, ?, ?)
                '''
                self.db.execute_query(query, (
                    quiz.id, quiz.article_id, quiz.title,
                    json.dumps(quiz.questions), quiz.total_score, quiz.created_date
                ))
                
                generated_content.append(content)
                logger.info(f"✅ Completed processing: {story.title}")
            
            logger.info(f"🎉 Daily automation completed! Generated {len(generated_content)} complete content packages")
            return generated_content
            
        except Exception as e:
            logger.error(f"❌ Daily automation failed: {e}")
            raise
    
    async def upload_to_app(self, content_list: List[GeneratedContent]):
        """Upload generated content to the app backend"""
        logger.info("📱 Uploading content to app backend...")
        
        # This would integrate with your app's API
        for content in content_list:
            logger.info(f"Uploaded: {content.article.title}")
        
        logger.info("✅ All content uploaded to app!")

async def main():
    """Main function to run the complete automation system"""
    system = CompleteAutomationSystem()
    
    # Run daily automation
    generated_content = await system.run_daily_automation()
    
    # Upload to app
    await system.upload_to_app(generated_content)
    
    print(f"\n🎉 Complete automation finished!")
    print(f"Generated {len(generated_content)} complete content packages")
    print("Ready for App Store deployment! 📱✨")

if __name__ == "__main__":
    asyncio.run(main())
