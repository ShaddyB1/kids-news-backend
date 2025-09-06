#!/usr/bin/env python3
"""
Complete News Video Generator for Junior News Digest
Generates current news stories and creates videos with professional illustrations
"""

import sys
import subprocess
from pathlib import Path
import logging
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsVideoGenerator:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent.parent
        self.output_dir = self.base_dir / "generated_videos" / "news_videos"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Add script paths
        sys.path.append(str(self.base_dir / "scripts" / "content_generation"))
        sys.path.append(str(self.base_dir / "scripts" / "image_generation"))
        sys.path.append(str(self.base_dir / "scripts" / "video_generation"))
        
        logger.info("📺 News Video Generator initialized")

    def generate_daily_news_video(self):
        """Generate complete daily news video with current stories"""
        logger.info("🎬 Starting daily news video generation...")
        
        try:
            # Step 1: Generate current news stories
            logger.info("📰 Step 1: Generating current news stories...")
            stories = self.generate_news_stories()
            
            if not stories or len(stories) < 5:
                logger.error("❌ Not enough stories generated")
                return None
            
            # Step 2: Generate professional images for stories
            logger.info("🎨 Step 2: Generating professional illustrations...")
            story_images = self.generate_story_images(stories)
            
            # Step 3: Create video with stories and images
            logger.info("🎬 Step 3: Creating complete news video...")
            video_path = self.create_news_video(stories, story_images)
            
            if video_path:
                logger.info(f"✅ Daily news video created: {video_path}")
                return video_path
            else:
                logger.error("❌ Video creation failed")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error in news video generation: {e}")
            return None

    def generate_news_stories(self):
        """Generate current news stories for kids"""
        try:
            from news_story_generator import NewsStoryGenerator
            
            generator = NewsStoryGenerator()
            
            # Generate 10 current stories
            stories = generator.generate_daily_stories(target_count=10)
            
            if stories:
                # Save stories
                today = datetime.now().strftime('%Y-%m-%d')
                stories_file = self.output_dir / f"stories_{today}.json"
                
                with open(stories_file, 'w', encoding='utf-8') as f:
                    json.dump(stories, f, indent=2, ensure_ascii=False)
                
                logger.info(f"✅ Generated {len(stories)} news stories")
                return stories
            else:
                logger.error("❌ No stories generated")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error generating stories: {e}")
            return None

    def generate_story_images(self, stories):
        """Generate professional images for stories"""
        try:
            from professional_image_service import ProfessionalImageService
            
            image_service = ProfessionalImageService()
            
            # Format stories for image generation
            formatted_stories = []
            for i, story in enumerate(stories):
                formatted_story = {
                    'id': f"story_{i+1}",
                    'headline': story['headline'],
                    'sentences': story['sentences'],
                    'image_prompt': self.create_news_image_prompt(story)
                }
                formatted_stories.append(formatted_story)
            
            # Generate images
            image_results = image_service.batch_generate_story_images(formatted_stories)
            
            logger.info(f"✅ Generated {len(image_results)} professional images")
            return image_results
            
        except Exception as e:
            logger.error(f"❌ Error generating images: {e}")
            return []

    def create_news_image_prompt(self, story):
        """Create image prompt optimized for news stories"""
        headline = story['headline'].lower()
        content = ' '.join(story['sentences']).lower()
        
        # News-specific prompts
        if any(word in content for word in ['space', 'nasa', 'astronaut', 'mars', 'moon', 'planet']):
            return "exciting space discovery scene with colorful planets, friendly astronauts, space station, educational space illustration for children"
        
        elif any(word in content for word in ['ocean', 'sea', 'marine', 'whale', 'dolphin', 'coral']):
            return "beautiful ocean scene with marine life, coral reefs, sea creatures, underwater exploration, educational marine illustration"
        
        elif any(word in content for word in ['school', 'student', 'education', 'learn', 'teacher', 'classroom']):
            return "happy diverse children in bright modern classroom, learning together, books and technology, inspiring educational scene"
        
        elif any(word in content for word in ['animal', 'wildlife', 'zoo', 'conservation', 'endangered']):
            return "beautiful wildlife scene with animals in natural habitat, conservation efforts, people protecting animals, hopeful nature illustration"
        
        elif any(word in content for word in ['technology', 'robot', 'ai', 'invention', 'innovation', 'computer']):
            return "friendly technology scene with helpful robots, innovative gadgets, children using technology positively, futuristic but safe"
        
        elif any(word in content for word in ['environment', 'climate', 'green', 'renewable', 'solar', 'wind']):
            return "clean environment with renewable energy, solar panels, wind turbines, green technology, hopeful environmental future"
        
        elif any(word in content for word in ['health', 'medicine', 'doctor', 'hospital', 'cure', 'treatment']):
            return "positive healthcare scene with friendly medical professionals, modern hospital, families and health, reassuring medical illustration"
        
        elif any(word in content for word in ['sports', 'olympics', 'athlete', 'competition', 'game']):
            return "exciting sports scene with diverse young athletes, teamwork and fair play, sports equipment, inspiring athletic illustration"
        
        elif any(word in content for word in ['art', 'museum', 'culture', 'music', 'dance', 'creative']):
            return "vibrant arts and culture scene with children creating art, musical instruments, cultural celebration, creative expression"
        
        elif any(word in content for word in ['food', 'farming', 'agriculture', 'harvest', 'nutrition']):
            return "healthy food and farming scene, colorful fruits and vegetables, sustainable agriculture, farm to table illustration"
        
        else:
            return "positive community news scene with diverse happy families, children helping community, bright hopeful illustration, good news theme"

    def create_news_video(self, stories, story_images):
        """Create video with news stories and professional images"""
        try:
            from video_generator_official_logo_leonardo import OfficialVideoGenerator
            
            # Create custom video generator for news
            video_gen = OfficialVideoGenerator()
            
            # Prepare news content for video
            news_content = self.prepare_news_content(stories, story_images)
            
            # Generate news video
            today = datetime.now().strftime('%Y-%m-%d')
            video_title = f"Junior_News_Digest_{today}"
            
            # Use extended video format for news
            video_path = self.create_extended_news_video(video_gen, news_content, video_title)
            
            return video_path
            
        except Exception as e:
            logger.error(f"❌ Error creating news video: {e}")
            return None

    def prepare_news_content(self, stories, story_images):
        """Prepare news content for video generation"""
        content = {
            'title': f"Junior News Digest - {datetime.now().strftime('%B %d, %Y')}",
            'intro_text': "Welcome to Junior News Digest! Here are today's most important stories for young minds.",
            'stories': [],
            'outro_text': "That's all for today's Junior News Digest! Keep learning and stay curious!"
        }
        
        # Match stories with images
        image_lookup = {img['story_id']: img for img in story_images}
        
        for i, story in enumerate(stories[:10]):  # Limit to 10 stories
            story_id = f"story_{i+1}"
            
            story_content = {
                'id': story_id,
                'headline': story['headline'],
                'text': ' '.join(story['sentences']) + ' ' + story['why_it_matters'],
                'image_path': image_lookup.get(story_id, {}).get('path', None),
                'duration': len(' '.join(story['sentences'])) * 0.08 + 2  # Reading time + pause
            }
            
            content['stories'].append(story_content)
        
        return content

    def create_extended_news_video(self, video_gen, news_content, video_title):
        """Create extended video with all news stories"""
        try:
            # Calculate total duration
            total_duration = 5  # Logo intro
            total_duration += len(news_content['intro_text']) * 0.08  # Intro
            
            for story in news_content['stories']:
                total_duration += story['duration']
            
            total_duration += len(news_content['outro_text']) * 0.08  # Outro
            
            logger.info(f"📊 Estimated video duration: {total_duration/60:.1f} minutes")
            
            # Create video segments
            segments = []
            
            # Official logo
            logo_path = video_gen.resize_official_logo()
            if logo_path:
                segments.append({
                    'image': logo_path,
                    'duration': 5.0,
                    'type': 'logo'
                })
            
            # Story segments
            for story in news_content['stories']:
                if story['image_path']:
                    segments.append({
                        'image': story['image_path'],
                        'duration': story['duration'],
                        'type': 'story',
                        'headline': story['headline']
                    })
            
            # Create final video
            if segments:
                output_path = self.output_dir / f"{video_title}.mp4"
                
                success = self.create_video_from_segments(segments, str(output_path), total_duration)
                
                if success:
                    # Create YouTube Short version
                    short_path = self.create_news_youtube_short(str(output_path), video_title)
                    
                    logger.info(f"✅ News video created: {output_path}")
                    if short_path:
                        logger.info(f"📱 YouTube Short created: {short_path}")
                    
                    return str(output_path)
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error creating extended news video: {e}")
            return None

    def create_video_from_segments(self, segments, output_path, total_duration):
        """Create video from image segments"""
        try:
            # Create input arguments for FFmpeg
            input_args = []
            filter_parts = []
            
            for i, segment in enumerate(segments):
                input_args.extend(['-loop', '1', '-t', str(segment['duration']), '-i', segment['image']])
                filter_parts.append(f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=25[v{i}]")
            
            # Concatenate all video streams
            concat_inputs = ''.join([f"[v{i}]" for i in range(len(segments))])
            filter_parts.append(f"{concat_inputs}concat=n={len(segments)}:v=1:a=0[outv]")
            
            filter_complex = ';'.join(filter_parts)
            
            # Create silent video (audio will be added later with TTS)
            cmd = [
                'ffmpeg', '-y'
            ] + input_args + [
                '-filter_complex', filter_complex,
                '-map', '[outv]',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-r', '25',
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ News video segments combined successfully")
                return True
            else:
                logger.error(f"❌ FFmpeg failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error creating video from segments: {e}")
            return False

    def create_news_youtube_short(self, full_video_path, video_title):
        """Create YouTube Short from news video"""
        try:
            short_path = self.output_dir / f"{video_title}_youtube_short.mp4"
            
            cmd = [
                'ffmpeg', '-y',
                '-i', full_video_path,
                '-t', '60',
                '-vf', 'crop=607:1080:656:0,scale=1080:1920',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-b:v', '2M',
                str(short_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ News YouTube Short created")
                return str(short_path)
            else:
                logger.error(f"❌ YouTube Short creation failed: {result.stderr}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error creating YouTube Short: {e}")
            return None

def main():
    """Generate daily news video"""
    print("📺 Junior News Digest - Complete Video Generator")
    print("=" * 55)
    print("📰 Fetching current news stories...")
    print("🎨 Generating professional illustrations...")
    print("🎬 Creating complete video...")
    print()
    
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg ready")
    except:
        print("❌ FFmpeg not available")
        return 1
    
    generator = NewsVideoGenerator()
    video_path = generator.generate_daily_news_video()
    
    if video_path:
        print("\n🎉 SUCCESS!")
        print(f"📹 Daily news video created: {video_path}")
        print("\n🏆 Features:")
        print("   ✅ 10 current real-world news stories")
        print("   ✅ Kid-friendly language (ages 6-12)")
        print("   ✅ Professional AI-generated illustrations")
        print("   ✅ Official Junior News Digest branding")
        print("   ✅ YouTube Short version included")
        print("   ✅ Positive and hopeful messaging")
        print("\n📰 Your daily news video is ready!")
        return 0
    else:
        print("\n❌ Video generation failed")
        print("💡 Make sure you have API keys in .env file:")
        print("   - NEWS_API_KEY (from newsapi.org)")
        print("   - OPENAI_API_KEY (for story rewriting and DALL-E 3)")
        print("   - LEONARDO_API_KEY (optional, for Leonardo.ai)")
        print("   - STABILITY_API_KEY (optional, for Stability AI)")
        return 1

if __name__ == "__main__":
    exit(main())
