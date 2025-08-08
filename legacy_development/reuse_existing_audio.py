#!/usr/bin/env python3
"""
Reuse Existing Audio for New Video with Leonardo Images
Demonstrates the complete workflow without wasting API requests
"""

import os
import json
import subprocess
from pathlib import Path
import logging
from PIL import Image, ImageDraw, ImageFont
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ReuseAudioDemo:
    """
    Create new video using existing audio and Leonardo-style placeholder images
    """
    
    def __init__(self):
        self.audio_dir = Path("leonardo_production/2025-08-07_week/audio")
        self.images_dir = Path("leonardo_production/2025-08-07_week/images/leonardo")
        self.output_dir = Path("leonardo_production/2025-08-07_week/videos/final")
        
        # Ensure directories exist
        self.images_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def create_leonardo_style_placeholders(self, story_id: str):
        """
        Create Leonardo.ai style placeholder images to demonstrate the workflow
        """
        logger.info("🎨 Creating Leonardo-style placeholder images...")
        
        # Load the prompts
        prompts_file = self.images_dir / f"{story_id}_prompts.json"
        if not prompts_file.exists():
            logger.error(f"Prompts file not found: {prompts_file}")
            return []
        
        with open(prompts_file, 'r') as f:
            data = json.load(f)
        
        created_images = []
        
        for i, prompt_info in enumerate(data['prompts']):
            # Create high-quality placeholder in Leonardo style
            img = Image.new('RGB', (1792, 1008), color=(255, 255, 255))  # 16:9 Leonardo ratio
            draw = ImageDraw.Draw(img)
            
            # Leonardo-style gradients
            leonardo_colors = [
                ((135, 206, 250), (255, 182, 193)),  # Sky blue to light pink
                ((144, 238, 144), (255, 218, 185)),  # Light green to peach
                ((221, 160, 221), (255, 228, 181)),  # Plum to moccasin
                ((173, 216, 230), (255, 192, 203)),  # Light blue to pink
                ((255, 182, 193), (255, 255, 224)),  # Light pink to light yellow
                ((176, 224, 230), (255, 228, 225)),  # Powder blue to misty rose
                ((255, 218, 185), (255, 240, 245))   # Peach to lavender blush
            ]
            
            color1, color2 = leonardo_colors[i % len(leonardo_colors)]
            
            # Create smooth gradient
            for y in range(1008):
                progress = y / 1008
                r = int(color1[0] * (1 - progress) + color2[0] * progress)
                g = int(color1[1] * (1 - progress) + color2[1] * progress)
                b = int(color1[2] * (1 - progress) + color2[2] * progress)
                draw.rectangle([(0, y), (1792, y+1)], fill=(r, g, b))
            
            # Add scene-specific elements
            scene_titles = {
                'title': '🚌 Solar School Bus Adventure!',
                'character_intro': '☀️ Meet Sunny the Bus',
                'problem': '🤔 How to Make School Greener?',
                'thinking': '💡 Solar Power Idea!',
                'solution': '⚡ Solar Panels Working!',
                'celebration': '🎉 Clean Energy Success!',
                'inspiration': '🌟 You Can Change the World!'
            }
            
            title = scene_titles.get(prompt_info['scene'], f"Scene {i+1}")
            
            # Add Leonardo.ai style border
            border_color = (255, 255, 255, 200)
            draw.rectangle([(50, 50), (1742, 958)], outline=border_color, width=8)
            
            # Main title
            try:
                title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
                subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
                label_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
            except:
                title_font = ImageFont.load_default()
                subtitle_font = title_font
                label_font = title_font
            
            # Draw title with shadow (Leonardo style)
            shadow_offset = 6
            draw.text((896 + shadow_offset, 404 + shadow_offset), title, 
                     fill=(0, 0, 0, 100), font=title_font, anchor="mm")
            draw.text((896, 400), title, fill='white', font=title_font, anchor="mm")
            
            # Add "Generated with Leonardo.ai" watermark
            draw.text((896, 520), "🎨 Generated with Leonardo.ai", 
                     fill='white', font=subtitle_font, anchor="mm")
            
            # Add scene description
            scene_desc = prompt_info['prompt'].split(',')[0]  # First part of prompt
            if len(scene_desc) > 60:
                scene_desc = scene_desc[:60] + "..."
            
            draw.text((896, 600), scene_desc, fill='white', font=label_font, anchor="mm")
            
            # Add technical info (like Leonardo displays)
            tech_info = f"Scene {i+1} • Duration: {prompt_info['duration']}s • Style: Pixar/Kids"
            draw.text((896, 850), tech_info, fill=(255, 255, 255, 180), font=label_font, anchor="mm")
            
            # Save image
            image_path = self.images_dir / f"{story_id}_{i:02d}_{prompt_info['scene']}.png"
            img.save(image_path, quality=95, optimize=True)
            
            created_images.append({
                'path': str(image_path.absolute()),
                'duration': prompt_info['duration'],
                'scene': prompt_info['scene']
            })
            
            logger.info(f"✅ Created: {image_path.name}")
        
        logger.info(f"🎨 Created {len(created_images)} Leonardo-style images")
        return created_images
    
    def assemble_video_with_existing_audio(self, story_id: str):
        """
        Assemble video using existing audio and new images
        """
        logger.info(f"🎬 Assembling video with existing audio...")
        
        # Check for existing audio
        audio_path = self.audio_dir / f"{story_id}_narration.mp3"
        if not audio_path.exists():
            logger.error(f"Audio not found: {audio_path}")
            return None
        
        logger.info(f"🎤 Using existing audio: {audio_path}")
        
        # Create placeholder images
        images = self.create_leonardo_style_placeholders(story_id)
        
        if not images:
            logger.error("Failed to create images")
            return None
        
        # Create ffmpeg input file
        input_file = self.images_dir / f"{story_id}_input.txt"
        with open(input_file, 'w') as f:
            for image in images:
                f.write(f"file '{image['path']}'\n")
                f.write(f"duration {image['duration']}\n")
            if images:
                f.write(f"file '{images[-1]['path']}'\n")
        
        # Output path
        output_path = self.output_dir / f"{story_id}_leonardo_demo.mp4"
        
        # FFmpeg command
        cmd = [
            'ffmpeg',
            '-f', 'concat',
            '-safe', '0',
            '-i', str(input_file),
            '-i', str(audio_path),
            '-vf', 'scale=1920:1080,fade=t=in:st=0:d=0.5,fade=t=out:st=25:d=0.5',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '18',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            '-movflags', '+faststart',
            '-y', str(output_path)
        ]
        
        logger.info("🔧 Running video assembly...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info(f"✅ Video assembled: {output_path}")
            
            # Get file size and duration info
            file_size = output_path.stat().st_size / (1024 * 1024)  # MB
            
            print("\n" + "="*80)
            print("🎉 VIDEO ASSEMBLY COMPLETE!")
            print("="*80)
            print(f"📹 Video: {output_path}")
            print(f"📊 Size: {file_size:.1f} MB")
            print(f"🎤 Audio: Natural ElevenLabs voice (reused)")
            print(f"🎨 Images: Leonardo.ai style placeholders")
            print(f"⚡ Resolution: 1920x1080 (Full HD)")
            print("="*80)
            
            return str(output_path)
        else:
            logger.error(f"Video assembly failed: {result.stderr}")
            return None
    
    def demonstrate_complete_workflow(self):
        """
        Demonstrate the complete workflow with existing assets
        """
        print("\n" + "="*80)
        print("🎬 LEONARDO.AI VIDEO WORKFLOW DEMONSTRATION")
        print("="*80)
        print("Using existing ElevenLabs audio + Leonardo-style images")
        print("="*80)
        
        # Find existing audio files
        audio_files = list(self.audio_dir.glob("*_narration.mp3"))
        
        if not audio_files:
            logger.error("No existing audio files found")
            return None
        
        # Use the most recent audio file
        latest_audio = max(audio_files, key=lambda x: x.stat().st_mtime)
        story_id = latest_audio.stem.replace("_narration", "")
        
        logger.info(f"📻 Found existing audio for story: {story_id}")
        
        # Assemble video
        video_path = self.assemble_video_with_existing_audio(story_id)
        
        if video_path:
            print("\n🎯 WORKFLOW COMPLETE!")
            print("This demonstrates exactly what happens when you:")
            print("1. Generate images on Leonardo.ai")
            print("2. Download them to the correct folder")
            print("3. Run the assembly command")
            print("\nThe only difference is real Leonardo images vs placeholders!")
            print("="*80)
            
            return video_path
        
        return None

def main():
    """
    Run the reuse audio demonstration
    """
    demo = ReuseAudioDemo()
    
    video_path = demo.demonstrate_complete_workflow()
    
    if video_path:
        print(f"\n✅ Demo video created: {video_path}")
        
        # Try to open the video
        try:
            subprocess.run(['open', video_path], check=True)
            print("🎬 Opening video...")
        except:
            print("📁 Video saved and ready to view")
        
        print("\n💡 NEXT STEPS FOR PRODUCTION:")
        print("1. Go to Leonardo.ai")
        print("2. Use the exact prompts from the JSON file")
        print("3. Download high-quality images")
        print("4. Replace the placeholder images")
        print("5. Re-run the assembly command")
        print("\nResult: Professional video with natural voice + beautiful images!")

if __name__ == "__main__":
    main()
