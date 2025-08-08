#!/usr/bin/env python3
"""
Leonardo.ai Integration for Automated Video Generation
Free tier: 150 tokens daily (plenty for your 3 videos/week)
"""

import os
import json
import requests
import time
from pathlib import Path
import logging
from dotenv import load_dotenv
from typing import List, Dict

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LeonardoImageGenerator:
    """
    Generate beautiful kids' illustrations using Leonardo.ai
    """
    
    def __init__(self):
        # Leonardo API (when you get it from their dashboard)
        self.api_key = os.getenv('LEONARDO_API_KEY')
        
        # Best models for kids' content
        self.models = {
            'kids_illustration': '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',  # Leonardo Diffusion XL
            'cartoon': 'cd2b2a15-9760-4174-a5ff-4d2925057376',  # Cartoon/Anime style
            'dreamshaper': 'ac614f96-1082-45bf-be9d-757f2d31c174',  # DreamShaper v7
        }
        
        # Output directory
        self.output_dir = Path("leonardo_images")
        self.output_dir.mkdir(exist_ok=True)
        
    def generate_with_leonardo_web(self, prompts: List[Dict], story_id: str) -> List[Dict]:
        """
        Generate images using Leonardo.ai web interface
        (Until API access is available)
        """
        logger.info("🎨 Generating images with Leonardo.ai...")
        
        print("\n" + "="*80)
        print("🎨 LEONARDO.AI IMAGE GENERATION INSTRUCTIONS")
        print("="*80)
        print("1. Go to: https://leonardo.ai")
        print("2. Sign in with your Google account (FREE)")
        print("3. Click 'AI Image Generation'")
        print("4. Select Model: 'Leonardo Diffusion XL' or 'DreamShaper v7'")
        print("5. Settings:")
        print("   - Quality: High")
        print("   - Style: 'Illustration' or 'Cartoon'")
        print("   - Aspect Ratio: 16:9")
        print("="*80)
        
        generated_images = []
        
        for i, prompt_data in enumerate(prompts):
            enhanced_prompt = self.enhance_prompt_for_kids(prompt_data['prompt'])
            
            print(f"\n📌 IMAGE {i+1}: {prompt_data['scene']}")
            print("-" * 40)
            print(f"COPY THIS PROMPT:")
            print(f"\n{enhanced_prompt}\n")
            print(f"SAVE AS: {story_id}_scene_{i:02d}_{prompt_data['scene']}.png")
            print("-" * 40)
            
            # Save prompt for reference
            prompt_file = self.output_dir / f"{story_id}_prompts.txt"
            with open(prompt_file, 'a') as f:
                f.write(f"Scene {i+1} - {prompt_data['scene']}:\n")
                f.write(f"{enhanced_prompt}\n\n")
            
            generated_images.append({
                'scene': prompt_data['scene'],
                'prompt': enhanced_prompt,
                'duration': prompt_data['duration'],
                'filename': f"{story_id}_scene_{i:02d}_{prompt_data['scene']}.png"
            })
        
        print("\n" + "="*80)
        print("💡 LEONARDO.AI TIPS:")
        print("="*80)
        print("• Use 'Alchemy' mode for best quality (uses more tokens)")
        print("• Try 'Prompt Magic v3' for better prompt understanding")
        print("• Generate 4 variations and pick the best one")
        print("• Download in highest resolution available")
        print("• You get 150 tokens daily (resets at midnight)")
        print("="*80)
        
        return generated_images
    
    def enhance_prompt_for_kids(self, base_prompt: str) -> str:
        """
        Enhance prompts specifically for Leonardo.ai kids' content
        """
        # Leonardo-specific enhancements
        enhancements = [
            "children's book illustration",
            "pixar style",
            "bright vibrant colors",
            "friendly characters",
            "soft lighting",
            "whimsical",
            "educational",
            "age 6-12",
            "high quality",
            "4k",
            "detailed",
            "professional illustration"
        ]
        
        # Add negative prompts (what to avoid)
        negative = "scary, dark, violent, realistic, photo, gloomy, sad"
        
        enhanced = f"{base_prompt}, {', '.join(enhancements)}"
        enhanced += f" | Negative prompt: {negative}"
        
        return enhanced
    
    def generate_with_leonardo_api(self, prompt: str, scene_name: str) -> str:
        """
        Generate image using Leonardo.ai API
        (Ready when you get API access)
        """
        if not self.api_key:
            logger.info("Leonardo API key not found. Use web interface for now.")
            return None
        
        logger.info(f"🎨 Generating via API: {scene_name}")
        
        url = "https://cloud.leonardo.ai/api/rest/v1/generations"
        
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.api_key}",
            "content-type": "application/json"
        }
        
        payload = {
            "prompt": prompt,
            "modelId": self.models['kids_illustration'],
            "width": 1024,
            "height": 576,  # 16:9 aspect ratio
            "num_images": 1,
            "promptMagic": True,
            "alchemy": True,  # Better quality
            "photoReal": False,  # We want illustrations, not photos
            "presetStyle": "ILLUSTRATION"
        }
        
        try:
            # Start generation
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                generation_id = response.json()['sdGenerationJob']['generationId']
                
                # Poll for completion
                return self.wait_for_generation(generation_id, scene_name)
            else:
                logger.error(f"API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Failed to generate: {e}")
            return None
    
    def wait_for_generation(self, generation_id: str, scene_name: str) -> str:
        """
        Wait for Leonardo.ai to complete generation
        """
        url = f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}"
        
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.api_key}"
        }
        
        # Poll every 5 seconds
        for _ in range(60):  # Max 5 minutes
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                if data['generations_by_pk']['status'] == 'COMPLETE':
                    # Get the image URL
                    image_url = data['generations_by_pk']['generated_images'][0]['url']
                    
                    # Download and save
                    return self.download_image(image_url, scene_name)
            
            time.sleep(5)
        
        logger.error("Generation timed out")
        return None
    
    def download_image(self, url: str, scene_name: str) -> str:
        """
        Download generated image from Leonardo
        """
        response = requests.get(url)
        
        if response.status_code == 200:
            image_path = self.output_dir / f"{scene_name}.png"
            
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"✅ Downloaded: {image_path}")
            return str(image_path)
        
        return None
    
    def create_complete_video_with_leonardo(self, story_content: str, story_id: str):
        """
        Complete pipeline with Leonardo.ai images
        """
        from enhanced_automation_system import EnhancedAutomationSystem
        
        logger.info("🚀 Starting Leonardo-powered video creation...")
        
        # Step 1: Analyze story and create prompts
        system = EnhancedAutomationSystem()
        analysis = system.process_full_article(story_content)
        prompts = system.create_story_specific_prompts(analysis)
        
        # Step 2: Generate with Leonardo
        if self.api_key:
            # Use API
            images = []
            for prompt_data in prompts:
                enhanced_prompt = self.enhance_prompt_for_kids(prompt_data['prompt'])
                image_path = self.generate_with_leonardo_api(enhanced_prompt, prompt_data['scene'])
                if image_path:
                    images.append({
                        'path': image_path,
                        'duration': prompt_data['duration']
                    })
        else:
            # Use web interface
            images = self.generate_with_leonardo_web(prompts, story_id)
            
            print("\n⏸️ PAUSE HERE:")
            print("1. Generate all images on Leonardo.ai")
            print("2. Download them to the 'leonardo_images' folder")
            print("3. Press ENTER when ready to continue...")
            input()
            
            # Check for downloaded images
            images = self.check_for_downloaded_images(story_id, prompts)
        
        # Step 3: Generate voice and assemble video
        if images:
            logger.info("✅ Images ready! Creating video...")
            # This would call your video assembly function
            return True
        
        return False
    
    def check_for_downloaded_images(self, story_id: str, prompts: List[Dict]) -> List[Dict]:
        """
        Check if user has downloaded images from Leonardo web
        """
        found_images = []
        
        for i, prompt_data in enumerate(prompts):
            expected_file = self.output_dir / f"{story_id}_scene_{i:02d}_{prompt_data['scene']}.png"
            
            if expected_file.exists():
                found_images.append({
                    'path': str(expected_file),
                    'duration': prompt_data['duration']
                })
                logger.info(f"✅ Found: {expected_file.name}")
            else:
                logger.warning(f"❌ Missing: {expected_file.name}")
        
        return found_images

def main():
    """
    Demonstrate Leonardo.ai integration
    """
    generator = LeonardoImageGenerator()
    
    print("\n" + "="*80)
    print("🎨 LEONARDO.AI INTEGRATION FOR KIDS' VIDEOS")
    print("="*80)
    
    # Sample story
    sample_story = """
    Robot Fish Saves the Ocean: Eleanor Chen, a brilliant student, invented Gillbert,
    a solar-powered robot fish that eats microplastics to save marine life.
    """
    
    # Test prompts
    test_prompts = [
        {
            'scene': 'title',
            'prompt': 'Title card saying "Robot Fish Saves Ocean" with underwater background',
            'duration': 3
        },
        {
            'scene': 'eleanor',
            'prompt': 'Young girl Eleanor Chen with her robot fish invention, excited expression',
            'duration': 4
        },
        {
            'scene': 'ocean_problem',
            'prompt': 'Ocean with plastic pollution, sad fish, environmental concern',
            'duration': 4
        },
        {
            'scene': 'robot_action',
            'prompt': 'Robot fish Gillbert swimming and collecting plastic pieces',
            'duration': 4
        },
        {
            'scene': 'celebration',
            'prompt': 'Clean ocean with happy sea creatures celebrating',
            'duration': 3
        }
    ]
    
    # Generate with Leonardo
    generated = generator.generate_with_leonardo_web(test_prompts, "robot_fish_demo")
    
    print("\n" + "="*80)
    print("✅ LEONARDO SETUP COMPLETE!")
    print("="*80)
    print("Benefits of using Leonardo.ai:")
    print("• 150 free tokens daily (enough for 15-30 images)")
    print("• Perfect for kids' illustration styles")
    print("• High quality output")
    print("• Multiple style options")
    print("• No credit card required")
    print("="*80)
    
    # Save configuration
    config = {
        "image_generator": "leonardo",
        "daily_limit": 150,
        "recommended_settings": {
            "model": "Leonardo Diffusion XL or DreamShaper v7",
            "quality": "High",
            "alchemy": True,
            "prompt_magic": True,
            "aspect_ratio": "16:9",
            "style": "Illustration/Cartoon"
        }
    }
    
    config_file = Path("leonardo_config.json")
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"\n📁 Configuration saved to: {config_file}")
    print("📁 Prompts saved to: leonardo_images/robot_fish_demo_prompts.txt")

if __name__ == "__main__":
    main()
