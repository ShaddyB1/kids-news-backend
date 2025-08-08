#!/usr/bin/env python3
"""
Video Generation Tool - Implementation Framework
Automatically creates kid-friendly videos from news articles
"""

import os
import openai
import json
import time
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import logging
from datetime import datetime
import requests
import subprocess
from PIL import Image, ImageDraw, ImageFont
import moviepy.editor as mp
from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.audio.io.AudioFileClip import AudioFileClip

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Article:
    """Article data structure"""
    title: str
    original_content: str
    simplified_content: str
    source: str
    date: datetime
    category: str
    reading_level: float

@dataclass
class VideoScript:
    """Video script structure"""
    hook: str
    main_story: str
    educational_moment: str
    wrap_up: str
    total_duration: int
    visual_cues: List[str]

@dataclass
class VideoAssets:
    """Video assets collection"""
    script: VideoScript
    narration_audio: str
    background_music: str
    images: List[str]
    animations: List[str]

class VideoGenerationTool:
    """
    Main class for generating educational videos from news articles
    """
    
    def __init__(self, config_path: str = "config.json"):
        """Initialize the video generation tool"""
        self.config = self._load_config(config_path)
        self.setup_apis()
        self.temp_dir = Path("temp_video_assets")
        self.temp_dir.mkdir(exist_ok=True)
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file"""
        default_config = {
            "openai_api_key": "",
            "elevenlabs_api_key": "",
            "stability_api_key": "",
            "video_settings": {
                "target_duration": 120,
                "max_duration": 150,
                "min_duration": 90,
                "resolution": "1080p",
                "framerate": 30
            },
            "voice_settings": {
                "voice_id": "21m00Tcm4TlvDq8ikWAM",  # ElevenLabs voice ID
                "stability": 0.8,
                "similarity_boost": 0.8,
                "speed": 0.9
            },
            "audio_settings": {
                "music_volume": 0.25,
                "narration_volume": 1.0,
                "effects_volume": 0.15
            }
        }
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                # Merge with defaults
                for key, value in default_config.items():
                    if key not in config:
                        config[key] = value
                return config
        except FileNotFoundError:
            logger.warning(f"Config file {config_path} not found, using defaults")
            return default_config
    
    def setup_apis(self):
        """Setup API connections"""
        openai.api_key = self.config.get("openai_api_key")
        self.elevenlabs_api_key = self.config.get("elevenlabs_api_key")
        self.stability_api_key = self.config.get("stability_api_key")
    
    def generate_video(self, article: Article, output_path: str) -> bool:
        """
        Main function to generate video from article
        
        Args:
            article: Article object with original and simplified content
            output_path: Path where final video should be saved
            
        Returns:
            bool: Success status
        """
        try:
            logger.info(f"Starting video generation for: {article.title}")
            
            # Step 1: Analyze content and generate script
            script = self.generate_script(article)
            logger.info("Script generated successfully")
            
            # Step 2: Generate voice narration
            narration_path = self.generate_narration(script)
            logger.info("Narration generated successfully")
            
            # Step 3: Source/generate visual content
            visual_assets = self.generate_visual_assets(script, article)
            logger.info("Visual assets prepared")
            
            # Step 4: Create background music
            music_path = self.prepare_background_music(script.total_duration)
            logger.info("Background music prepared")
            
            # Step 5: Assemble final video
            success = self.assemble_video(
                script, narration_path, visual_assets, music_path, output_path
            )
            
            if success:
                logger.info(f"Video generated successfully: {output_path}")
                # Cleanup temp files
                self.cleanup_temp_files()
                return True
            else:
                logger.error("Video assembly failed")
                return False
                
        except Exception as e:
            logger.error(f"Video generation failed: {str(e)}")
            return False
    
    def generate_script(self, article: Article) -> VideoScript:
        """
        Generate video script from article content using AI
        """
        prompt = f"""
        Create an engaging 90-120 second video script for children aged 6-10 from this news article.
        
        ORIGINAL ARTICLE (for context and facts):
        Title: {article.title}
        Content: {article.original_content}
        
        SIMPLIFIED VERSION (for language level):
        {article.simplified_content}
        
        Create a script with these sections:
        1. HOOK (10-15 seconds): Exciting opening question/statement
        2. MAIN_STORY (60-80 seconds): Core narrative using simple language
        3. EDUCATIONAL_MOMENT (15-20 seconds): Fun fact or learning opportunity
        4. WRAP_UP (5-10 seconds): Encouraging conclusion
        
        Requirements:
        - Use simple words (2nd-4th grade level)
        - Make it exciting but not scary
        - Include visual cues for each section
        - Keep total around 120 seconds when read at kid-friendly pace
        - Add [VISUAL: description] cues for imagery
        
        Format as JSON:
        {{
            "hook": "text",
            "main_story": "text", 
            "educational_moment": "text",
            "wrap_up": "text",
            "estimated_duration": 120,
            "visual_cues": ["cue1", "cue2", ...]
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.7
            )
            
            script_data = json.loads(response.choices[0].message.content)
            
            return VideoScript(
                hook=script_data["hook"],
                main_story=script_data["main_story"],
                educational_moment=script_data["educational_moment"],
                wrap_up=script_data["wrap_up"],
                total_duration=script_data.get("estimated_duration", 120),
                visual_cues=script_data.get("visual_cues", [])
            )
            
        except Exception as e:
            logger.error(f"Script generation failed: {e}")
            # Fallback to basic script
            return self._create_fallback_script(article)
    
    def _create_fallback_script(self, article: Article) -> VideoScript:
        """Create a basic script if AI generation fails"""
        return VideoScript(
            hook=f"Hey kids! Want to hear something amazing?",
            main_story=article.simplified_content,
            educational_moment="Isn't that incredible? Science helps us discover amazing things!",
            wrap_up="What do you think we'll discover next?",
            total_duration=90,
            visual_cues=["excitement", "main topic", "science", "question"]
        )
    
    def generate_narration(self, script: VideoScript) -> str:
        """
        Generate voice narration using ElevenLabs API
        """
        full_script = f"{script.hook} {script.main_story} {script.educational_moment} {script.wrap_up}"
        
        # Clean script for narration (remove visual cues)
        clean_script = full_script.replace("[VISUAL:", "").replace("]", "")
        
        url = "https://api.elevenlabs.io/v1/text-to-speech/" + self.config["voice_settings"]["voice_id"]
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_api_key
        }
        
        data = {
            "text": clean_script,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": self.config["voice_settings"]["stability"],
                "similarity_boost": self.config["voice_settings"]["similarity_boost"]
            }
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                narration_path = self.temp_dir / "narration.mp3"
                with open(narration_path, 'wb') as f:
                    f.write(response.content)
                return str(narration_path)
            else:
                logger.error(f"Voice generation failed: {response.status_code}")
                return self._create_fallback_audio(clean_script)
                
        except Exception as e:
            logger.error(f"Voice generation error: {e}")
            return self._create_fallback_audio(clean_script)
    
    def _create_fallback_audio(self, text: str) -> str:
        """Create fallback audio using system TTS"""
        output_path = self.temp_dir / "narration_fallback.mp3"
        
        # Use system TTS (macOS example)
        try:
            subprocess.run([
                "say", "-v", "Samantha", "-r", "160", "-o", 
                str(output_path.with_suffix('.aiff')), text
            ], check=True)
            
            # Convert to MP3 if needed
            subprocess.run([
                "ffmpeg", "-i", str(output_path.with_suffix('.aiff')), 
                "-y", str(output_path)
            ], check=True)
            
            return str(output_path)
        except:
            logger.error("Fallback audio generation failed")
            return ""
    
    def generate_visual_assets(self, script: VideoScript, article: Article) -> List[str]:
        """
        Generate or source visual assets for the video
        """
        visual_assets = []
        
        # Create title card
        title_image = self._create_title_card(article.title)
        visual_assets.append(title_image)
        
        # Generate images for each section
        for i, cue in enumerate(script.visual_cues[:4]):  # Limit to 4 images
            image_path = self._generate_image_for_cue(cue, i)
            if image_path:
                visual_assets.append(image_path)
        
        # Create end card
        end_card = self._create_end_card()
        visual_assets.append(end_card)
        
        return visual_assets
    
    def _create_title_card(self, title: str) -> str:
        """Create a title card image"""
        img = Image.new('RGB', (1920, 1080), color='#4ECDC4')
        draw = ImageDraw.Draw(img)
        
        try:
            # Try to load a nice font
            font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
            font_subtitle = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            font_title = ImageFont.load_default()
            font_subtitle = ImageFont.load_default()
        
        # Add title text
        bbox = draw.textbbox((0, 0), title, font=font_title)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (1920 - text_width) // 2
        y = (1080 - text_height) // 2 - 50
        
        draw.text((x, y), title, fill='white', font=font_title)
        draw.text((960, y + 150), "Kids Daily News", fill='white', font=font_subtitle, anchor="mm")
        
        title_path = self.temp_dir / "title_card.png"
        img.save(title_path)
        return str(title_path)
    
    def _generate_image_for_cue(self, cue: str, index: int) -> str:
        """Generate an image for a visual cue (placeholder implementation)"""
        # This would integrate with DALL-E or similar image generation
        # For now, create a simple colored background with text
        
        colors = ['#FF6B6B', '#4ECDC4', '#45B7AF', '#96CEB4', '#FFEAA7']
        color = colors[index % len(colors)]
        
        img = Image.new('RGB', (1920, 1080), color=color)
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            font = ImageFont.load_default()
        
        # Add cue text
        draw.text((960, 540), cue, fill='white', font=font, anchor="mm")
        
        image_path = self.temp_dir / f"visual_{index}.png"
        img.save(image_path)
        return str(image_path)
    
    def _create_end_card(self) -> str:
        """Create an end card"""
        img = Image.new('RGB', (1920, 1080), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            font = ImageFont.load_default()
        
        draw.text((960, 540), "Keep Learning! 🌟", fill='white', font=font, anchor="mm")
        
        end_path = self.temp_dir / "end_card.png"
        img.save(end_path)
        return str(end_path)
    
    def prepare_background_music(self, duration: int) -> str:
        """Prepare background music (placeholder)"""
        # This would download or generate appropriate background music
        # For now, return empty string to indicate no background music
        return ""
    
    def assemble_video(self, script: VideoScript, narration_path: str, 
                      visual_assets: List[str], music_path: str, output_path: str) -> bool:
        """
        Assemble the final video from all components
        """
        try:
            # Load narration audio
            if not os.path.exists(narration_path):
                logger.error("Narration file not found")
                return False
                
            narration = AudioFileClip(narration_path)
            video_duration = narration.duration
            
            # Create video clips from images
            clips = []
            images_per_clip = len(visual_assets)
            duration_per_image = video_duration / images_per_clip
            
            for i, image_path in enumerate(visual_assets):
                if os.path.exists(image_path):
                    clip = mp.ImageClip(image_path, duration=duration_per_image)
                    clip = clip.set_start(i * duration_per_image)
                    clips.append(clip)
            
            # Combine all video clips
            video = mp.CompositeVideoClip(clips, size=(1920, 1080))
            video = video.set_duration(video_duration)
            
            # Add narration audio
            final_video = video.set_audio(narration)
            
            # Add background music if available
            if music_path and os.path.exists(music_path):
                background_music = AudioFileClip(music_path)
                background_music = background_music.volumex(self.config["audio_settings"]["music_volume"])
                background_music = background_music.set_duration(video_duration)
                
                # Mix narration and music
                final_audio = mp.CompositeAudioClip([narration, background_music])
                final_video = final_video.set_audio(final_audio)
            
            # Export final video
            final_video.write_videofile(
                output_path,
                fps=self.config["video_settings"]["framerate"],
                audio_codec='aac',
                codec='libx264'
            )
            
            # Close clips to free memory
            narration.close()
            final_video.close()
            if 'background_music' in locals():
                background_music.close()
            
            return True
            
        except Exception as e:
            logger.error(f"Video assembly failed: {e}")
            return False
    
    def cleanup_temp_files(self):
        """Clean up temporary files"""
        import shutil
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
        self.temp_dir.mkdir(exist_ok=True)

# Example usage and testing
def main():
    """Example usage of the video generation tool"""
    
    # Create sample article
    sample_article = Article(
        title="Robot Discovers Singing Crystals on Mars",
        original_content="NASA's Perseverance rover has discovered unique crystalline formations on Mars that emit harmonic frequencies when exposed to Martian wind patterns. The discovery represents a significant advancement in our understanding of Martian geology and atmospheric interactions.",
        simplified_content="A super smart robot on Mars found incredible crystals that make beautiful music when the wind blows! Scientists think these magical crystals could help us understand how Mars makes sounds.",
        source="NASA Science News",
        date=datetime.now(),
        category="Science",
        reading_level=2.8
    )
    
    # Initialize video generator
    video_tool = VideoGenerationTool()
    
    # Generate video
    output_path = "sample_video_output.mp4"
    success = video_tool.generate_video(sample_article, output_path)
    
    if success:
        print(f"Video generated successfully: {output_path}")
    else:
        print("Video generation failed")

if __name__ == "__main__":
    main()
