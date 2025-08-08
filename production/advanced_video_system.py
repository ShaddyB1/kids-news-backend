#!/usr/bin/env python3
"""
Advanced Video Generation System
Uses ElevenLabs for natural voice + professional animations
"""

import os
import json
import requests
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import logging
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedVideoGenerator:
    def __init__(self):
        self.output_dir = Path("advanced_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        # ElevenLabs configuration
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY', 'your_api_key_here')
        self.voice_id = "EXAVITQu4vr4xnSDxMaL"  # Bella - natural female voice
        
    def create_professional_scene(self, scene_data: dict, scene_number: int) -> str:
        """Create a professional animated scene"""
        width, height = 1920, 1080
        
        # Create base image with gradient
        img = Image.new('RGB', (width, height), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        # Create animated gradient background
        for y in range(height):
            # Animated gradient that changes based on scene
            r = int(102 + (50 * scene_number) % 100)
            g = int(126 + (30 * scene_number) % 80) 
            b = int(234 - (20 * scene_number) % 50)
            
            for x in range(width):
                # Add subtle animation effect
                wave = int(10 * (x / width) * (y / height))
                draw.point((x, y), fill=(min(255, r + wave), min(255, g + wave), min(255, b + wave)))
        
        # Load professional fonts
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
            text_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            title_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
        # Add scene-specific visual elements
        if scene_number == 0:  # Title scene
            # Add animated title card
            title = scene_data.get('title', 'Kids Daily News')
            
            # Title with shadow
            bbox = draw.textbbox((0, 0), title, font=title_font)
            title_width = bbox[2] - bbox[0]
            x = (width - title_width) // 2
            y = height // 2 - 100
            
            # Shadow
            draw.text((x + 4, y + 4), title, font=title_font, fill=(0, 0, 0, 100))
            # Main title
            draw.text((x, y), title, font=title_font, fill='white')
            
            # Add decorative elements
            draw.ellipse([100, 100, 200, 200], fill='#FF6B9D', outline='white', width=5)
            draw.ellipse([width-200, height-200, width-100, height-100], fill='#4ECDC4', outline='white', width=5)
            
        else:  # Story scenes
            # Main content area
            content_y = 300
            content_text = scene_data.get('content', 'Amazing story content here!')
            
            # Split text into lines
            words = content_text.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = draw.textbbox((0, 0), test_line, font=text_font)
                if bbox[2] - bbox[0] <= width - 200:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            
            if current_line:
                lines.append(' '.join(current_line))
            
            # Draw text with animation effect
            for i, line in enumerate(lines[:4]):  # Max 4 lines
                bbox = draw.textbbox((0, 0), line, font=text_font)
                line_width = bbox[2] - bbox[0]
                x = (width - line_width) // 2
                y = content_y + i * 80
                
                # Shadow
                draw.text((x + 3, y + 3), line, font=text_font, fill=(0, 0, 0))
                # Main text
                draw.text((x, y), line, font=text_font, fill='white')
            
            # Add scene-specific icons/shapes
            if 'robot' in content_text.lower():
                # Robot scene - add tech elements
                for i in range(5):
                    x = 100 + i * 300
                    y = 150 + (i % 2) * 100
                    draw.rectangle([x, y, x+50, y+50], fill='#00D4AA', outline='white', width=3)
                    
            elif 'solar' in content_text.lower():
                # Solar scene - add energy elements
                for i in range(6):
                    x = width//2 + 300 * (i % 2 - 0.5)
                    y = 150 + i * 30
                    draw.ellipse([x, y, x+40, y+40], fill='#FFD700', outline='white', width=2)
        
        # Add professional finishing touches
        # Subtle border
        draw.rectangle([10, 10, width-10, height-10], outline='white', width=4)
        
        # Save scene
        scene_path = self.output_dir / f"scene_{scene_number:02d}.png"
        img.save(scene_path, quality=95, optimize=True)
        
        return str(scene_path)
    
    def generate_elevenlabs_voice(self, script: str) -> str:
        """Generate natural voice using ElevenLabs"""
        if self.elevenlabs_api_key == 'your_api_key_here':
            logger.warning("ElevenLabs API key not set, using system voice")
            return self.generate_system_voice(script)
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_api_key
        }
        
        data = {
            "text": script,
            "model_id": "eleven_turbo_v2_5",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.6,
                "use_speaker_boost": True
            }
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                audio_path = self.output_dir / "elevenlabs_voice.mp3"
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                
                logger.info("✅ ElevenLabs voice generated successfully")
                return str(audio_path)
            else:
                logger.error(f"ElevenLabs API error: {response.status_code}")
                return self.generate_system_voice(script)
                
        except Exception as e:
            logger.error(f"ElevenLabs error: {e}")
            return self.generate_system_voice(script)
    
    def generate_system_voice(self, script: str) -> str:
        """Fallback to enhanced system voice"""
        audio_path = self.output_dir / "system_voice.aiff"
        
        # Use enhanced system voice with better settings
        cmd = [
            'say', '-v', 'Samantha', '-r', '170',  # Slightly faster, more natural
            '-o', str(audio_path), script
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Convert to MP3 with high quality
            mp3_path = self.output_dir / "system_voice.mp3"
            subprocess.run([
                'ffmpeg', '-i', str(audio_path),
                '-acodec', 'libmp3lame', '-b:a', '192k',
                '-ar', '44100', '-y', str(mp3_path)
            ], check=True)
            
            # Clean up AIFF
            audio_path.unlink()
            
            logger.info("✅ Enhanced system voice generated")
            return str(mp3_path)
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Voice generation failed: {e}")
            raise
    
    def create_story_video(self, title: str, story_content: str) -> str:
        """Create complete video with ElevenLabs voice and animations"""
        logger.info(f"🎬 Creating advanced video: {title}")
        
        # Create engaging script
        script = self.create_engaging_script(title, story_content)
        
        # Generate natural voice
        audio_path = self.generate_elevenlabs_voice(script)
        
        # Get audio duration
        duration_info = subprocess.run([
            'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
            '-of', 'csv=p=0', audio_path
        ], capture_output=True, text=True)
        
        try:
            total_duration = float(duration_info.stdout.strip())
        except:
            total_duration = 60  # Fallback
        
        # Create scenes with animations
        scenes = [
            {"title": title, "content": script[:200]},  # Title
            {"content": script[200:400]},  # Intro
            {"content": script[400:600]},  # Main story
            {"content": script[600:800]},  # Conclusion
            {"content": "Thanks for watching! 🌟"}  # Outro
        ]
        
        scene_paths = []
        for i, scene in enumerate(scenes):
            scene_path = self.create_professional_scene(scene, i)
            scene_paths.append(scene_path)
        
        # Create video with smooth transitions
        output_path = self.output_dir / f"{title.replace(' ', '_').lower()}_advanced.mp4"
        
        # Calculate duration per scene
        scene_duration = total_duration / len(scene_paths)
        
        # Create input file for ffmpeg
        input_file = self.output_dir / "advanced_input.txt"
        with open(input_file, 'w') as f:
            for scene_path in scene_paths:
                f.write(f"file '{Path(scene_path).absolute()}'\n")
                f.write(f"duration {scene_duration:.2f}\n")
            # Repeat last frame
            f.write(f"file '{Path(scene_paths[-1]).absolute()}'\n")
        
        # Create high-quality video with transitions
        cmd = [
            'ffmpeg',
            '-f', 'concat', '-safe', '0', '-i', str(input_file),
            '-i', audio_path,
            '-filter_complex', 
            '[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st=' + str(total_duration-0.5) + ':d=0.5[v]',
            '-map', '[v]', '-map', '1:a',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',  # High quality
            '-c:a', 'aac', '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-shortest', '-y', str(output_path)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            logger.info(f"✅ Advanced video created: {output_path}")
            return str(output_path)
        except subprocess.CalledProcessError as e:
            logger.error(f"Video creation failed: {e}")
            raise
    
    def create_engaging_script(self, title: str, content: str) -> str:
        """Create an engaging, natural script"""
        script = f"""
        Hey there, amazing kids! Welcome back to Kids Daily News! 
        
        Today I have something absolutely incredible to share with you! 
        Are you ready for an amazing adventure? Let's dive in!
        
        {title}
        
        {content[:400]}
        
        Isn't that just amazing? Young people like you are changing the world every single day! 
        
        You know what this teaches us? That no matter how young you are, your ideas matter. 
        Your creativity can solve real problems and help make our world a better place.
        
        So keep dreaming, keep learning, and who knows? Maybe next week we'll be telling 
        YOUR amazing story! 
        
        Thanks for joining us today. Remember to stay curious, stay kind, and keep being awesome!
        
        See you next time on Kids Daily News! 🌟
        """
        
        return script.strip()

def generate_app_videos():
    """Generate all app videos with advanced system"""
    generator = AdvancedVideoGenerator()
    
    stories = [
        {
            "title": "Ocean Robot Saves the Day",
            "content": "Meet Wally the Whale Robot, an amazing invention created by young students! This incredible solar-powered robot swims through our oceans, cleaning up plastic pollution that hurts sea animals. Using special sensors, Wally can find and collect thousands of plastic pieces, making the ocean safer for dolphins, turtles, and fish. The best part? It's completely eco-friendly and has already cleaned over 10,000 pounds of plastic! These young inventors prove that kids can create solutions to save our planet."
        },
        {
            "title": "Solar School Bus Adventure", 
            "content": "Get ready for the coolest ride to school ever! Students at Sunny Hills Elementary helped design an amazing solar-powered school bus. With 20 solar panels on its roof, this bus runs entirely on sunshine! It's whisper-quiet, creates zero pollution, and even has USB charging ports. The bus makes extra energy that powers the school's computers. Driver Mr. Rodriguez says it's like driving a spaceship from the future!"
        },
        {
            "title": "Young Inventors Change the World",
            "content": "Meet four incredible kid inventors making a real difference! Emma from Toronto created smart glasses that help her grandmother hear by showing spoken words as text. Marcus from Kenya built a portable water filter that helps 500 families get clean water. Priya from Mumbai designed a friendly robot companion for elderly people. And Diego from Mexico invented solar-powered street lights that also provide WiFi! These amazing kids prove that great ideas can come from anywhere."
        }
    ]
    
    for story in stories:
        try:
            video_path = generator.create_story_video(story['title'], story['content'])
            
            # Copy to app
            app_name = story['title'].replace(' ', '_').replace(',', '').lower() + '_story.mp4'
            app_path = Path("app_development/kids_news_app_fixed/assets/videos") / app_name
            
            subprocess.run(['cp', video_path, str(app_path)])
            print(f"✅ Copied to app: {app_path}")
            
        except Exception as e:
            print(f"❌ Failed to generate {story['title']}: {e}")

if __name__ == "__main__":
    generate_app_videos()
