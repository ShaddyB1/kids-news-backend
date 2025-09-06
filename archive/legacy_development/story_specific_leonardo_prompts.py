#!/usr/bin/env python3
"""
Create Story-Specific Leonardo.ai Prompts for Real Illustrations
Generates detailed prompts for actual story scenes, not just text cards
"""

import json
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StorySpecificPromptsGenerator:
    """
    Generate detailed Leonardo.ai prompts for actual story illustrations
    """
    
    def __init__(self):
        self.base_style = "children's book illustration, pixar animation style, bright vibrant colors, soft lighting, detailed, high quality, 4k"
        self.negative_prompt = "text, words, letters, scary, dark, violent, realistic photo, gloomy, sad, adult themes"
    
    def analyze_solar_bus_story(self):
        """
        Analyze the solar bus story and create detailed scene prompts
        """
        story_analysis = {
            "title": "Solar-Powered School Bus Adventure",
            "main_characters": ["Kids", "Sunny the bus", "Driver"],
            "setting": "California school, sunny day",
            "key_elements": ["solar panels", "school bus", "happy children", "sunshine", "clean energy"],
            "story_beats": [
                "Introduction to the new solar bus",
                "Kids excited about their eco-friendly ride", 
                "Solar panels on the bus roof working",
                "Clean, quiet ride to school",
                "Comparison with old gas buses",
                "Kids learning about renewable energy",
                "Inspiring message about environmental action"
            ]
        }
        
        return story_analysis
    
    def create_detailed_leonardo_prompts(self):
        """
        Create detailed, story-specific prompts for Leonardo.ai
        """
        prompts = [
            {
                "scene": "title_scene",
                "duration": 3,
                "description": "Title introduction with solar bus",
                "prompt": f"""
                A bright yellow school bus with solar panels on the roof, parked in front of a modern California elementary school on a sunny morning. The bus has a friendly face painted on the front and is called 'Sunny'. Children with backpacks are walking toward the bus excitedly. Beautiful blue sky with fluffy white clouds, palm trees, and sunshine rays. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "kids_discovering_bus",
                "duration": 4,
                "description": "Children seeing the solar bus for the first time",
                "prompt": f"""
                Diverse group of elementary school children (ages 6-10) looking amazed and excited as they discover the new solar-powered school bus. One child is pointing at the solar panels on the roof, another is touching the side of the bus. The children have expressions of wonder and curiosity. The bus driver, a friendly woman, is smiling and explaining about the bus. Bright morning sunlight, school playground in background. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "solar_panels_working",
                "duration": 4,
                "description": "Close-up of solar panels converting sunlight",
                "prompt": f"""
                Close-up view of shiny blue solar panels on the school bus roof, with animated sparkles and energy lines showing the panels absorbing bright sunshine and converting it to electricity. Small animated energy bolts or glowing particles flowing from the panels toward the bus engine. The sun is bright and cheerful with a smiling face. Clear blue sky background. Scientific but kid-friendly visualization of clean energy. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "peaceful_ride",
                "duration": 4,
                "description": "Kids enjoying the quiet, clean ride",
                "prompt": f"""
                Interior view of the school bus with happy children sitting in their seats, looking out windows at beautiful scenery passing by. The atmosphere is peaceful and quiet (show this with calm expressions and maybe some sleeping children). One child is reading a book about renewable energy, another is looking at the digital display showing 'Solar Power: 100%'. Soft, natural lighting from windows. Clean, modern bus interior. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "environmental_impact",
                "duration": 4,
                "description": "Showing the environmental benefits",
                "prompt": f"""
                Split-screen comparison showing the solar bus on one side with clean air, flowers, and happy animals around it, versus an old diesel bus on the other side with gray smoke clouds. The solar bus side has green plants, blue skies, and smiling earth character, while the diesel side shows concerned-looking plants and animals. Educational but hopeful tone. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "kids_learning",
                "duration": 4,
                "description": "Children learning about renewable energy",
                "prompt": f"""
                Children sitting in a circle at school with their teacher, looking at a large, colorful poster about renewable energy. The poster shows the sun, solar panels, wind turbines, and the earth with a big smile. Kids are raising their hands excitedly, with thought bubbles showing lightbulbs and ideas. Books about science and environment are scattered around. Bright classroom with educational posters on walls. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            },
            {
                "scene": "inspiring_future",
                "duration": 3,
                "description": "Kids inspired to help the environment",
                "prompt": f"""
                Group of diverse children standing together outdoors with their arms raised in celebration, with the solar school bus in the background. Above them, thought bubbles show various environmental inventions: solar houses, wind farms, electric cars, recycling centers. The children look determined and inspired. Beautiful sunset/sunrise in the background with the text 'You Can Change the World!' floating in the sky in friendly, colorful letters. {self.base_style}
                
                Negative prompt: {self.negative_prompt}
                """.strip()
            }
        ]
        
        return prompts
    
    def save_leonardo_prompts(self, story_id="solar_bus_story"):
        """
        Save the detailed prompts to files for easy use
        """
        prompts = self.create_detailed_leonardo_prompts()
        
        # Create output directory
        output_dir = Path("leonardo_story_prompts")
        output_dir.mkdir(exist_ok=True)
        
        # Save as JSON for the automation system
        json_file = output_dir / f"{story_id}_leonardo_prompts.json"
        with open(json_file, 'w') as f:
            json.dump({
                "story_id": story_id,
                "story_title": "Solar-Powered School Bus Adventure",
                "total_scenes": len(prompts),
                "prompts": prompts
            }, f, indent=2)
        
        # Save as text file for easy copy-paste to Leonardo
        text_file = output_dir / f"{story_id}_leonardo_prompts.txt"
        with open(text_file, 'w') as f:
            f.write("LEONARDO.AI PROMPTS FOR SOLAR BUS STORY\n")
            f.write("="*60 + "\n\n")
            f.write("Go to: https://leonardo.ai\n")
            f.write("Settings: Leonardo Diffusion XL, Alchemy ON, Prompt Magic ON, 16:9 ratio\n\n")
            
            for i, prompt in enumerate(prompts, 1):
                f.write(f"SCENE {i}: {prompt['scene']}\n")
                f.write("-" * 40 + "\n")
                f.write(f"Description: {prompt['description']}\n")
                f.write(f"Duration: {prompt['duration']} seconds\n\n")
                f.write("PROMPT TO COPY:\n")
                f.write(prompt['prompt'])
                f.write(f"\n\nSAVE AS: {story_id}_scene_{i:02d}_{prompt['scene']}.png\n")
                f.write("\n" + "="*60 + "\n\n")
        
        logger.info(f"✅ Prompts saved to {json_file}")
        logger.info(f"✅ Copy-paste file: {text_file}")
        
        return prompts
    
    def display_prompts(self):
        """
        Display the prompts in a user-friendly format
        """
        prompts = self.create_detailed_leonardo_prompts()
        
        print("\n" + "="*80)
        print("🎨 STORY-SPECIFIC LEONARDO.AI PROMPTS")
        print("Solar-Powered School Bus Adventure")
        print("="*80)
        
        for i, prompt in enumerate(prompts, 1):
            print(f"\n📌 SCENE {i}: {prompt['scene'].upper()}")
            print("-" * 50)
            print(f"📝 {prompt['description']}")
            print(f"⏱️ Duration: {prompt['duration']} seconds")
            print("\n🎨 LEONARDO PROMPT:")
            print(prompt['prompt'][:200] + "..." if len(prompt['prompt']) > 200 else prompt['prompt'])
            print(f"\n💾 Save as: solar_bus_scene_{i:02d}_{prompt['scene']}.png")
        
        print("\n" + "="*80)
        print("💡 LEONARDO.AI SETTINGS:")
        print("• Model: Leonardo Diffusion XL or DreamShaper v7")
        print("• Alchemy: ON (better quality)")
        print("• Prompt Magic: ON (better understanding)")
        print("• Aspect Ratio: 16:9")
        print("• Style: Illustration")
        print("="*80)

def main():
    """
    Generate story-specific Leonardo prompts
    """
    generator = StorySpecificPromptsGenerator()
    
    print("🚀 Generating story-specific Leonardo.ai prompts...")
    
    # Save prompts to files
    prompts = generator.save_leonardo_prompts()
    
    # Display for immediate use
    generator.display_prompts()
    
    print(f"\n✅ Generated {len(prompts)} detailed story-specific prompts!")
    print("\nThese prompts will create actual illustrations of:")
    print("• Kids discovering the solar bus")
    print("• Solar panels working in the sunshine")
    print("• Peaceful ride with happy children")
    print("• Environmental benefits comparison")
    print("• Kids learning about renewable energy")
    print("• Inspiring future vision")
    
    print("\n🎯 Next steps:")
    print("1. Go to Leonardo.ai")
    print("2. Use the prompts from leonardo_story_prompts/ folder")
    print("3. Generate beautiful story illustrations")
    print("4. Download and use in your video!")

if __name__ == "__main__":
    main()
