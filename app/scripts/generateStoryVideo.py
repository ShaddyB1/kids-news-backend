#!/usr/bin/env python3
"""
Story Video Generator for Kids News App
Integrates with the new ElevenLabs voice (paRTfYnetOrTukxfEm1J)
"""

import os
import sys
import json
from pathlib import Path

# Add the production directory to the path
sys.path.append(str(Path(__file__).parent.parent.parent / "production"))

from final_video_generator import FinalVideoGenerator

class AppStoryVideoGenerator(FinalVideoGenerator):
    def __init__(self):
        super().__init__()
        # Override voice ID to use the new voice
        self.default_voice_id = "paRTfYnetOrTukxfEm1J"
        
    def generate_test_story_video(self):
        """Generate a test story video with the new voice"""
        
        # Test story content
        story_data = {
            "title": "The Magical Ocean Cleanup Robot",
            "content": """
            Deep beneath the sparkling blue waves, a special robot named Aqua was getting ready for her most important mission yet. 
            
            Aqua wasn't like other robots - she could swim faster than dolphins and dive deeper than whales. Her shiny blue body gleamed as she powered up her cleaning systems.
            
            "Today, I'm going to help save the ocean!" Aqua said with determination. She had received reports that a beautiful coral reef was in trouble. Plastic bottles and bags were floating everywhere, making it hard for the colorful fish to swim and the coral to grow.
            
            As Aqua zoomed through the water, her sensors detected the problem area. Schools of worried fish swam in circles, and the once-bright coral looked sad and gray. "Don't worry, friends," Aqua called out. "I'm here to help!"
            
            With her special robotic arms, Aqua carefully collected every piece of trash. She made sure not to disturb any sea creatures or damage the delicate coral. The fish watched in amazement as their home became cleaner and cleaner.
            
            When Aqua finished, something magical happened. The coral began to glow with beautiful colors again - pink, orange, purple, and yellow! The fish danced with joy, and even a family of sea turtles came to thank their robot hero.
            
            "Remember," Aqua said to all her ocean friends, "we all need to work together to keep our home clean and safe. Every small action makes a big difference!"
            
            From that day on, Aqua became the guardian of the ocean, and children everywhere learned that they too could be heroes for the environment.
            """,
            "category": "Science & Environment",
            "age_group": "6-9",
            "duration": "3-4 minutes"
        }
        
        print("🎬 Generating story video with new ElevenLabs voice...")
        print(f"🎵 Using voice ID: {self.default_voice_id}")
        print(f"📖 Story: {story_data['title']}")
        
        try:
            # Generate the video using the parent class method
            output_path = self.generate_video_from_story(
                title=story_data['title'],
                content=story_data['content'],
                voice_id=self.default_voice_id
            )
            
            print(f"✅ Video generated successfully!")
            print(f"📁 Output path: {output_path}")
            
            return output_path
            
        except Exception as e:
            print(f"❌ Error generating video: {e}")
            return None
    
    def generate_video_from_story(self, title: str, content: str, voice_id: str = None):
        """Generate a video from story content"""
        
        if voice_id is None:
            voice_id = self.default_voice_id
            
        # Create a natural script from the story content
        script = self.create_story_script(title, content)
        
        # Generate audio with the new voice
        print("🎙️  Generating audio with ElevenLabs...")
        audio_path = self.generate_audio(script, voice_id)
        
        if not audio_path:
            raise Exception("Failed to generate audio")
        
        # Generate images based on story content
        print("🖼️  Generating story images...")
        images = self.generate_story_images(title, content)
        
        # Create video
        print("🎬 Creating final video...")
        video_path = self.create_final_video(
            audio_path=audio_path,
            images=images,
            title=title,
            output_name=f"story_{title.lower().replace(' ', '_')}"
        )
        
        return video_path
    
    def create_story_script(self, title: str, content: str) -> str:
        """Create a natural script from story content"""
        
        # Create an engaging introduction
        intro = f"""
        Welcome to Junior News Digest! Get ready for an amazing adventure story.
        
        Today's story is called "{title}" and it's going to take us on an incredible journey.
        Are you ready? Let's dive in!
        """
        
        # Process the content to make it more conversational
        processed_content = content.replace('\n\n', '\n\n*pause*\n\n')
        processed_content = processed_content.replace('"', '')  # Remove quotes that might interfere
        
        # Add conclusion
        conclusion = """
        
        *pause*
        
        What an amazing adventure! Remember, just like our hero in the story, 
        you can make a difference too. Every small action counts when we work together 
        to make our world a better place.
        
        Thanks for joining us at Junior News Digest. Until next time, keep exploring, 
        keep learning, and keep being amazing!
        """
        
        full_script = intro + processed_content + conclusion
        
        return full_script
    
    def generate_story_images(self, title: str, content: str) -> list:
        """Generate images based on story content"""
        
        # For now, use the existing image generation logic
        # In a real implementation, this would analyze the story content
        # and generate appropriate images
        
        story_prompts = [
            f"A colorful illustration of {title} in a child-friendly cartoon style",
            "An underwater scene with a friendly robot and colorful fish",
            "A beautiful coral reef with marine life swimming around",
            "A robot cleaning up ocean plastic with happy sea creatures watching",
            "Colorful fish and sea turtles celebrating in clean ocean water"
        ]
        
        images = []
        for i, prompt in enumerate(story_prompts):
            try:
                image_path = self.generate_single_image(
                    prompt=prompt,
                    filename=f"story_scene_{i+1}.jpg"
                )
                if image_path:
                    images.append(image_path)
            except Exception as e:
                print(f"⚠️  Warning: Could not generate image {i+1}: {e}")
        
        return images

def main():
    """Main execution function"""
    print("🚀 Kids News App - Story Video Generator")
    print("=" * 50)
    
    # Check if ElevenLabs API key is available
    if not os.getenv('ELEVENLABS_API_KEY'):
        print("⚠️  Warning: ELEVENLABS_API_KEY not found in environment")
        print("💡 The video will be generated without audio")
    
    try:
        generator = AppStoryVideoGenerator()
        video_path = generator.generate_test_story_video()
        
        if video_path:
            print("\n🎉 SUCCESS!")
            print(f"📹 Video saved to: {video_path}")
            print("\n📋 Next steps:")
            print("   1. Review the generated video")
            print("   2. Test in the mobile app")
            print("   3. Verify audio quality with new voice")
            print("   4. Check video synchronization")
        else:
            print("\n❌ Video generation failed")
            
    except Exception as e:
        print(f"\n💥 Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
