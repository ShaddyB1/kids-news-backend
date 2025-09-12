#!/usr/bin/env python3
"""
Simple Story Video Creator
Creates a video with the Rachel McGrath voice for testing
"""

import os
import sys
import json
import requests
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
import time

# Load environment variables
env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(env_path)

class SimpleVideoCreator:
    def __init__(self):
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        self.voice_id = "paRTfYnetOrTukxfEm1J"  # Rachel McGrath
        self.output_dir = Path("app_development/kids_news_app_fixed/assets/videos")
        self.audio_dir = Path("app_development/kids_news_app_fixed/assets/audio")
        
        # Create directories
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.audio_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_audio(self, text, filename):
        """Generate audio using ElevenLabs API"""
        print(f"🎙️  Generating audio: {filename}")
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }
        
        data = {
            "text": text,
            "voice_settings": {
                "stability": 0.6,
                "similarity_boost": 0.8
            },
            "model_id": "eleven_monolingual_v1"
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                audio_path = self.audio_dir / filename
                with open(audio_path, "wb") as f:
                    f.write(response.content)
                
                print(f"✅ Audio generated: {audio_path}")
                return audio_path
            else:
                print(f"❌ Audio generation failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error generating audio: {e}")
            return None
    
    def create_simple_image(self, text, filename, width=1920, height=1080):
        """Create a simple image with text"""
        print(f"🖼️  Creating image: {filename}")
        
        # Create image
        img = Image.new('RGB', (width, height), color='#4A90E2')  # Nice blue background
        draw = ImageDraw.Draw(img)
        
        # Try to use a system font, fall back to default
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 60)
            title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 80)
        except:
            font = ImageFont.load_default()
            title_font = ImageFont.load_default()
        
        # Draw title
        title = "Kids News Digest"
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (width - title_width) // 2
        draw.text((title_x, 100), title, font=title_font, fill='white')
        
        # Draw main text (wrap it)
        words = text.split()
        lines = []
        current_line = []
        max_width = width - 200  # Leave margin
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Draw lines
        y = 300
        for line in lines[:8]:  # Limit to 8 lines
            bbox = draw.textbbox((0, 0), line, font=font)
            line_width = bbox[2] - bbox[0]
            x = (width - line_width) // 2
            draw.text((x, y), line, font=font, fill='white')
            y += 80
        
        # Save image
        image_path = Path("temp_images") / filename
        image_path.parent.mkdir(exist_ok=True)
        img.save(image_path)
        
        print(f"✅ Image created: {image_path}")
        return image_path
    
    def create_video_with_ffmpeg(self, audio_path, image_path, output_path):
        """Create video using ffmpeg"""
        print(f"🎬 Creating video: {output_path}")
        
        try:
            # Get audio duration
            duration_cmd = [
                'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                '-of', 'csv=p=0', str(audio_path)
            ]
            
            result = subprocess.run(duration_cmd, capture_output=True, text=True)
            if result.returncode == 0:
                duration = float(result.stdout.strip())
                print(f"📊 Audio duration: {duration:.2f} seconds")
            else:
                duration = 30  # Default fallback
                print("⚠️  Using default duration: 30 seconds")
            
            # Create video
            ffmpeg_cmd = [
                'ffmpeg', '-y',  # Overwrite output file
                '-loop', '1',
                '-i', str(image_path),
                '-i', str(audio_path),
                '-c:v', 'libx264',
                '-tune', 'stillimage',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-pix_fmt', 'yuv420p',
                '-shortest',
                str(output_path)
            ]
            
            print(f"🔧 Running ffmpeg command...")
            result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Video created successfully: {output_path}")
                return output_path
            else:
                print(f"❌ FFmpeg error: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating video: {e}")
            return None
    
    def create_story_video(self):
        """Create a complete story video"""
        print("🚀 Creating Kids News Story Video with Rachel McGrath voice")
        print("=" * 60)
        
        # Story content
        story_title = "The Amazing Ocean Robot Adventure"
        story_text = """
        Welcome to Kids News Digest! I'm Rachel, and today we have an incredible story about Aqua, the amazing ocean cleanup robot.
        
        Deep beneath the sparkling blue waves, Aqua was getting ready for her most important mission. This special robot could swim faster than dolphins and dive deeper than whales!
        
        When Aqua arrived at the coral reef, she found it covered in plastic trash. The colorful fish looked sad, and the coral was turning gray. But Aqua knew exactly what to do!
        
        With her special robotic arms, she carefully collected every piece of garbage. She made sure not to hurt any sea creatures while cleaning their home.
        
        Something magical happened when Aqua finished! The coral began to glow with beautiful colors again - pink, orange, purple, and yellow! All the fish danced with joy!
        
        Thanks for joining us at Kids News Digest. Remember, just like Aqua, we can all help keep our planet clean and beautiful!
        """
        
        # Generate audio
        audio_filename = "ocean_robot_story_rachel.mp3"
        audio_path = self.generate_audio(story_text.strip(), audio_filename)
        
        if not audio_path:
            print("❌ Failed to generate audio")
            return None
        
        # Create image
        image_filename = "ocean_robot_story.png"
        image_path = self.create_simple_image(story_title, image_filename)
        
        # Create video
        video_filename = "ocean_robot_story_with_rachel_voice.mp4"
        video_path = self.output_dir / video_filename
        
        final_video = self.create_video_with_ffmpeg(audio_path, image_path, video_path)
        
        if final_video:
            print("\n🎉 SUCCESS! Video created with Rachel McGrath voice!")
            print(f"📹 Video location: {final_video}")
            print(f"📊 File size: {final_video.stat().st_size / 1024 / 1024:.2f} MB")
            return final_video
        else:
            print("\n❌ Video creation failed")
            return None

def main():
    """Main execution"""
    creator = SimpleVideoCreator()
    
    if not creator.api_key:
        print("❌ ELEVENLABS_API_KEY not found in environment")
        return 1
    
    # Check for ffmpeg
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg found")
    except:
        print("❌ FFmpeg not found. Please install ffmpeg first:")
        print("   brew install ffmpeg")
        return 1
    
    video_path = creator.create_story_video()
    
    if video_path:
        print(f"\n🎬 Your video is ready!")
        print(f"📁 Location: {video_path}")
        print("\n🎧 This video features:")
        print("   - Rachel McGrath voice narration")
        print("   - Ocean robot adventure story")
        print("   - Professional Kids News Digest branding")
        return 0
    else:
        return 1

if __name__ == "__main__":
    exit(main())
