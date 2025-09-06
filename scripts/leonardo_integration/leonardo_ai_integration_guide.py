#!/usr/bin/env python3
"""
Leonardo.ai Integration Guide for Automatic Illustration Generation
This script shows how to integrate with Leonardo.ai API for automatic generation
"""

import requests
import time
import json
import os
from pathlib import Path
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LeonardoAIIntegration:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Leonardo.ai API configuration
        self.api_key = os.getenv('LEONARDO_API_KEY')
        self.base_url = 'https://cloud.leonardo.ai/api/rest/v1'
        
        # Headers for API requests
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }
        
        # Recommended models for kids content
        self.kids_models = {
            'dreamshaper': 'ac614f96-1082-45bf-be9d-757f2d31c174',  # DreamShaper v7
            'kids_illustration': '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',  # Leonardo Creative
            'cartoon_style': '291be633-cb24-434f-898f-e662799936ad',  # Leonardo Signature
        }
        
        logger.info("🎨 Leonardo.ai Integration initialized")

    def check_api_connection(self):
        """Test Leonardo.ai API connection"""
        try:
            response = requests.get(
                f'{self.base_url}/me',
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                user_info = response.json()
                logger.info(f"✅ Connected to Leonardo.ai as: {user_info.get('username', 'Unknown')}")
                logger.info(f"💰 API Credits remaining: {user_info.get('apiCreditBalance', 'Unknown')}")
                return True
            else:
                logger.error(f"❌ API connection failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Connection error: {e}")
            return False

    def generate_illustration(self, prompt, model='dreamshaper', width=1024, height=1024, num_images=1):
        """Generate illustration using Leonardo.ai API"""
        if not self.api_key:
            logger.error("❌ Leonardo API key not found in .env file")
            return None
        
        try:
            # Enhanced prompt for kids content
            enhanced_prompt = f"{prompt}, children's book illustration style, bright vibrant colors, safe for kids, educational, cartoon style, high quality, detailed"
            
            # Negative prompt to avoid unwanted content
            negative_prompt = "scary, dark, violent, inappropriate, adult content, weapons, blood"
            
            # Generation request
            generation_data = {
                'prompt': enhanced_prompt,
                'negative_prompt': negative_prompt,
                'modelId': self.kids_models.get(model, self.kids_models['dreamshaper']),
                'width': width,
                'height': height,
                'num_images': num_images,
                'guidance_scale': 7,
                'num_inference_steps': 30,
                'seed': None,  # Random seed for variety
                'presetStyle': 'CINEMATIC',
                'scheduler': 'DPM_SOLVER',
                'public': False,
                'promptMagic': True,  # Enhanced prompt processing
                'alchemy': True,  # High-quality mode
            }
            
            logger.info(f"🎨 Generating illustration: {prompt[:50]}...")
            
            # Start generation
            response = requests.post(
                f'{self.base_url}/generations',
                headers=self.headers,
                json=generation_data,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"❌ Generation failed: {response.status_code} - {response.text}")
                return None
            
            generation_id = response.json()['sdGenerationJob']['generationId']
            logger.info(f"📝 Generation started with ID: {generation_id}")
            
            # Poll for completion
            return self.wait_for_generation(generation_id)
            
        except Exception as e:
            logger.error(f"❌ Generation error: {e}")
            return None

    def wait_for_generation(self, generation_id, max_wait=300):
        """Wait for generation to complete and return image URLs"""
        start_time = time.time()
        
        while time.time() - start_time < max_wait:
            try:
                response = requests.get(
                    f'{self.base_url}/generations/{generation_id}',
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code != 200:
                    logger.error(f"❌ Status check failed: {response.status_code}")
                    return None
                
                data = response.json()
                generation = data['generations_by_pk']
                
                status = generation['status']
                logger.info(f"📊 Generation status: {status}")
                
                if status == 'COMPLETE':
                    images = generation.get('generated_images', [])
                    if images:
                        image_urls = [img['url'] for img in images]
                        logger.info(f"✅ Generation complete! {len(image_urls)} images ready")
                        return image_urls
                    else:
                        logger.error("❌ No images in completed generation")
                        return None
                
                elif status == 'FAILED':
                    logger.error("❌ Generation failed")
                    return None
                
                # Wait before next check
                time.sleep(10)
                
            except Exception as e:
                logger.error(f"❌ Status check error: {e}")
                time.sleep(10)
        
        logger.error("❌ Generation timeout")
        return None

    def download_image(self, url, save_path):
        """Download generated image"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"✅ Image downloaded: {save_path}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Download failed: {e}")
            return False

    def generate_story_illustrations(self, prompts, output_dir='leonardo_illustrations'):
        """Generate multiple illustrations for a story"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        generated_images = []
        
        for i, prompt in enumerate(prompts):
            logger.info(f"🎨 Generating illustration {i+1}/{len(prompts)}")
            
            # Generate image
            image_urls = self.generate_illustration(
                prompt, 
                model='dreamshaper',
                width=1920,  # Video resolution
                height=1080,
                num_images=1
            )
            
            if image_urls:
                # Download first image
                image_path = output_path / f"scene_{i+1:02d}.png"
                if self.download_image(image_urls[0], image_path):
                    generated_images.append(str(image_path))
            
            # Respect API rate limits
            time.sleep(5)
        
        logger.info(f"✅ Generated {len(generated_images)} illustrations")
        return generated_images

def demo_leonardo_integration():
    """Demo of Leonardo.ai integration"""
    print("🎨 Leonardo.ai Integration Demo")
    print("=" * 40)
    
    # Initialize integration
    leonardo = LeonardoAIIntegration()
    
    # Check API connection
    if not leonardo.check_api_connection():
        print("❌ Please add your Leonardo.ai API key to the .env file:")
        print("LEONARDO_API_KEY=your_api_key_here")
        return
    
    # Sample prompts for ocean robot story
    story_prompts = [
        "cute cartoon ocean robot underwater with colorful fish and coral reef",
        "friendly robot character helping marine animals underwater scene with dolphins",
        "ocean cleanup scene with robot collecting plastic waste happy sea creatures watching",
        "celebration scene with robot and marine life in clean ocean coral reef background",
    ]
    
    print(f"\n🎬 Generating {len(story_prompts)} illustrations...")
    
    # Generate illustrations
    images = leonardo.generate_story_illustrations(story_prompts)
    
    if images:
        print(f"\n✅ Success! Generated {len(images)} illustrations:")
        for img in images:
            print(f"   📸 {img}")
        print("\n🎬 Ready to create video with Leonardo.ai illustrations!")
    else:
        print("\n❌ No illustrations generated")

def setup_leonardo_env():
    """Help user set up Leonardo.ai environment"""
    print("🔧 Leonardo.ai Setup Guide")
    print("=" * 30)
    print()
    print("1. Sign up at https://leonardo.ai")
    print("2. Go to API section in your account")
    print("3. Generate an API key")
    print("4. Add to your .env file:")
    print("   LEONARDO_API_KEY=your_api_key_here")
    print()
    print("💰 Free tier includes 150 tokens daily")
    print("🎨 Each image generation costs ~2-4 tokens")
    print("📊 Monitor usage in your Leonardo.ai dashboard")
    print()
    print("✅ Once set up, run this script to test the connection!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == 'setup':
        setup_leonardo_env()
    else:
        demo_leonardo_integration()
