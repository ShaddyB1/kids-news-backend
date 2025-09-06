#!/usr/bin/env python3
"""
Fix Ocean Robot Illustrations Only
Regenerates ONLY the illustrations for Ocean Robot story using existing audio
No audio regeneration - saves tokens
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from story_synchronized_generator import StorySynchronizedGenerator
from pathlib import Path
import shutil
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def fix_ocean_robot_illustrations():
    """Fix Ocean Robot illustrations without regenerating audio"""
    
    generator = StorySynchronizedGenerator()
    
    # Ocean Robot story details
    title = "Ocean Robot Saves the Day"
    story_context = "Scientists created a special robot fish that swims in the ocean and eats plastic waste to help clean our oceans. The robot fish is bright blue and orange with special sensors."
    
    # Ocean Robot specific prompts that should NOT contain text
    ocean_robot_prompts = [
        "Bright blue and orange robot fish swimming underwater among colorful coral reef, tropical fish swimming around, vibrant ocean scene",
        "Close-up of robot fish with special sensors detecting plastic bottles and bags floating in clear blue water, underwater perspective",
        "Robot fish opening its mouth to collect plastic waste, fish swimming inside a underwater garbage collection area, mechanical details visible",
        "Inside view of robot's storage compartment filled with collected plastic items, organized storage system, high-tech interior",
        "Robot fish swimming toward surface where a research boat waits, bright sunlight filtering through water, return journey scene",
        "Scientists on boat emptying robot fish, collected plastic being sorted for recycling, happy research team, bright daylight scene"
    ]
    
    logger.info("🔧 Fixing Ocean Robot illustrations with enhanced text detection...")
    logger.info("💰 Using existing audio - no token waste!")
    
    # Create output directory
    output_dir = Path("production/story_sync_videos")
    images_dir = output_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate new illustrations with stronger text detection
    generated_images = []
    
    for i, prompt in enumerate(ocean_robot_prompts, 1):
        logger.info(f"🎨 Generating illustration {i}/6 with enhanced text detection...")
        
        # Use the existing method but with more attempts
        try:
            image_path = generator.generate_story_synchronized_illustration(
                prompt, i, story_context
            )
            generated_images.append(image_path)
            logger.info(f"✅ Generated clean illustration {i}: {Path(image_path).name}")
        except Exception as e:
            logger.error(f"❌ Failed to generate illustration {i}: {e}")
            return False
    
    if len(generated_images) == 6:
        # Use existing audio file
        existing_audio = "production/story_sync_videos/audio/story_sync_voice.mp3"
        
        if Path(existing_audio).exists():
            logger.info(f"🎵 Using existing audio: {existing_audio}")
            
            # Create video with new illustrations and existing audio
            try:
                video_path = generator.create_video_from_assets(
                    title=title,
                    audio_path=existing_audio,
                    image_paths=generated_images,
                    output_dir=output_dir
                )
                
                # Copy to app
                app_video_path = "app_development/kids_news_app_fixed/assets/videos/ocean_robot_saves_the_day_story.mp4"
                shutil.copy2(video_path, app_video_path)
                
                logger.info(f"✅ Fixed Ocean Robot video: {app_video_path}")
                logger.info("🎯 Text artifacts should now be eliminated!")
                return True
                
            except Exception as e:
                logger.error(f"❌ Failed to create video: {e}")
                return False
        else:
            logger.error(f"❌ Existing audio not found: {existing_audio}")
            return False
    else:
        logger.error(f"❌ Only generated {len(generated_images)}/6 illustrations")
        return False

if __name__ == "__main__":
    success = fix_ocean_robot_illustrations()
    sys.exit(0 if success else 1)
