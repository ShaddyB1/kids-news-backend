#!/usr/bin/env python3
"""
Professional Image Generation Service
Integrates with DALL-E 3, Stable Diffusion, and Leonardo.ai for high-quality illustrations
"""

import requests
import base64
import time
import json
from pathlib import Path
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProfessionalImageService:
    def __init__(self):
        load_dotenv()
        
        # API keys
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.stability_api_key = os.getenv('STABILITY_API_KEY')
        self.leonardo_api_key = os.getenv('LEONARDO_API_KEY')
        
        # Service priorities (best quality first)
        self.service_priority = ['dalle3', 'leonardo', 'stability', 'fallback']
        
        # Output directory
        self.output_dir = Path("../../generated_images")
        self.output_dir.mkdir(exist_ok=True)
        
        logger.info("🎨 Professional Image Service initialized")

    def generate_image(self, prompt, style="children's book illustration", width=1920, height=1080, service=None):
        """Generate high-quality image using best available service"""
        
        # Enhanced prompt for kids content
        enhanced_prompt = f"{prompt}, {style}, bright vibrant colors, safe for children ages 6-12, educational, high quality, detailed illustration"
        
        services_to_try = [service] if service else self.service_priority
        
        for service_name in services_to_try:
            if service_name == 'dalle3' and self.openai_api_key:
                result = self.generate_with_dalle3(enhanced_prompt, width, height)
                if result:
                    return result
                    
            elif service_name == 'leonardo' and self.leonardo_api_key:
                result = self.generate_with_leonardo(enhanced_prompt, width, height)
                if result:
                    return result
                    
            elif service_name == 'stability' and self.stability_api_key:
                result = self.generate_with_stability(enhanced_prompt, width, height)
                if result:
                    return result
            
            elif service_name == 'fallback':
                logger.warning("⚠️ Using fallback image generation")
                return self.generate_fallback_image(prompt, width, height)
        
        logger.error("❌ All image generation services failed")
        return None

    def generate_with_dalle3(self, prompt, width=1920, height=1080):
        """Generate image using DALL-E 3 (highest quality)"""
        try:
            logger.info("🎨 Generating with DALL-E 3...")
            
            # DALL-E 3 has specific size requirements
            if width == 1920 and height == 1080:
                size = "1792x1024"  # Closest to 16:9
            elif width > height:
                size = "1792x1024"  # Landscape
            elif height > width:
                size = "1024x1792"  # Portrait
            else:
                size = "1024x1024"  # Square
            
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'dall-e-3',
                'prompt': prompt,
                'size': size,
                'quality': 'hd',
                'style': 'vivid',
                'n': 1
            }
            
            response = requests.post(
                'https://api.openai.com/v1/images/generations',
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                image_url = result['data'][0]['url']
                
                # Download the image
                image_path = self.download_image(image_url, "dalle3")
                if image_path:
                    logger.info("✅ DALL-E 3 image generated successfully")
                    return {
                        'path': image_path,
                        'service': 'dalle3',
                        'prompt': prompt,
                        'url': image_url
                    }
            else:
                logger.error(f"❌ DALL-E 3 error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ DALL-E 3 generation failed: {e}")
        
        return None

    def generate_with_leonardo(self, prompt, width=1920, height=1080):
        """Generate image using Leonardo.ai"""
        try:
            logger.info("🎨 Generating with Leonardo.ai...")
            
            headers = {
                'Authorization': f'Bearer {self.leonardo_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Use Leonardo's best model for kids content
            data = {
                'prompt': prompt,
                'negative_prompt': 'scary, dark, violent, inappropriate, adult content, weapons, blood, nsfw',
                'modelId': 'ac614f96-1082-45bf-be9d-757f2d31c174',  # DreamShaper v7
                'width': width,
                'height': height,
                'num_images': 1,
                'guidance_scale': 7,
                'num_inference_steps': 30,
                'presetStyle': 'CINEMATIC',
                'scheduler': 'DPM_SOLVER',
                'public': False,
                'promptMagic': True,
                'alchemy': True,
            }
            
            response = requests.post(
                'https://cloud.leonardo.ai/api/rest/v1/generations',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                generation_id = response.json()['sdGenerationJob']['generationId']
                
                # Wait for completion
                image_url = self.wait_for_leonardo_completion(generation_id)
                if image_url:
                    image_path = self.download_image(image_url, "leonardo")
                    if image_path:
                        logger.info("✅ Leonardo.ai image generated successfully")
                        return {
                            'path': image_path,
                            'service': 'leonardo',
                            'prompt': prompt,
                            'url': image_url
                        }
            else:
                logger.error(f"❌ Leonardo.ai error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Leonardo.ai generation failed: {e}")
        
        return None

    def wait_for_leonardo_completion(self, generation_id, max_wait=120):
        """Wait for Leonardo.ai generation to complete"""
        start_time = time.time()
        
        while time.time() - start_time < max_wait:
            try:
                headers = {'Authorization': f'Bearer {self.leonardo_api_key}'}
                response = requests.get(
                    f'https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}',
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    generation = data['generations_by_pk']
                    
                    if generation['status'] == 'COMPLETE':
                        images = generation.get('generated_images', [])
                        if images:
                            return images[0]['url']
                    elif generation['status'] == 'FAILED':
                        logger.error("❌ Leonardo.ai generation failed")
                        return None
                
                time.sleep(5)
                
            except Exception as e:
                logger.error(f"❌ Error checking Leonardo status: {e}")
                time.sleep(5)
        
        logger.error("❌ Leonardo.ai generation timeout")
        return None

    def generate_with_stability(self, prompt, width=1920, height=1080):
        """Generate image using Stability AI"""
        try:
            logger.info("🎨 Generating with Stability AI...")
            
            headers = {
                'Authorization': f'Bearer {self.stability_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'text_prompts': [
                    {'text': prompt, 'weight': 1.0},
                    {'text': 'scary, dark, violent, inappropriate, adult content, weapons, blood', 'weight': -1.0}
                ],
                'cfg_scale': 7,
                'height': height,
                'width': width,
                'samples': 1,
                'steps': 30,
                'style_preset': 'anime'
            }
            
            response = requests.post(
                'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                
                for i, image in enumerate(data['artifacts']):
                    image_data = base64.b64decode(image['base64'])
                    image_path = self.output_dir / f"stability_{int(time.time())}_{i}.png"
                    
                    with open(image_path, 'wb') as f:
                        f.write(image_data)
                    
                    logger.info("✅ Stability AI image generated successfully")
                    return {
                        'path': str(image_path),
                        'service': 'stability',
                        'prompt': prompt,
                        'url': None
                    }
            else:
                logger.error(f"❌ Stability AI error: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Stability AI generation failed: {e}")
        
        return None

    def download_image(self, url, service_name):
        """Download image from URL"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Create filename
            timestamp = int(time.time())
            filename = f"{service_name}_{timestamp}.png"
            filepath = self.output_dir / filename
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"✅ Image downloaded: {filepath}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"❌ Failed to download image: {e}")
            return None

    def generate_fallback_image(self, prompt, width=1920, height=1080):
        """Generate simple fallback image when all services fail"""
        from PIL import Image, ImageDraw, ImageFont
        
        logger.info("🎨 Creating fallback image...")
        
        # Create colorful gradient background
        img = Image.new('RGB', (width, height))
        
        # Rainbow gradient
        for y in range(height):
            for x in range(width):
                r = int(255 * (x / width))
                g = int(255 * (y / height))
                b = int(255 * ((x + y) / (width + height)))
                img.putpixel((x, y), (r, g, b))
        
        draw = ImageDraw.Draw(img)
        
        # Add text
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 80)
        except:
            font = ImageFont.load_default()
        
        text = "Professional Image\nComing Soon!"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        # Add shadow
        draw.text((x + 4, y + 4), text, font=font, fill='black')
        draw.text((x, y), text, font=font, fill='white')
        
        # Save fallback image
        timestamp = int(time.time())
        filepath = self.output_dir / f"fallback_{timestamp}.png"
        img.save(filepath, quality=95)
        
        logger.info(f"✅ Fallback image created: {filepath}")
        return {
            'path': str(filepath),
            'service': 'fallback',
            'prompt': prompt,
            'url': None
        }

    def batch_generate_story_images(self, stories):
        """Generate images for multiple stories"""
        logger.info(f"🎨 Generating images for {len(stories)} stories...")
        
        results = []
        
        for i, story in enumerate(stories, 1):
            logger.info(f"🖼️  Generating image {i}/{len(stories)}: {story.get('headline', '')[:50]}...")
            
            # Create image prompt from story
            prompt = story.get('image_prompt', '') or self.create_story_image_prompt(story)
            
            # Generate image
            result = self.generate_image(prompt, style="children's educational illustration")
            
            if result:
                result['story_id'] = story.get('id', f'story_{i}')
                result['story_headline'] = story.get('headline', '')
                results.append(result)
                logger.info(f"✅ Image {i} generated successfully")
            else:
                logger.error(f"❌ Failed to generate image {i}")
            
            # Small delay to respect API limits
            time.sleep(2)
        
        logger.info(f"🎉 Generated {len(results)} images out of {len(stories)} stories")
        return results

    def create_story_image_prompt(self, story):
        """Create image prompt from story content"""
        headline = story.get('headline', '').lower()
        content = ' '.join(story.get('sentences', [])).lower()
        
        # Determine theme and create appropriate prompt
        if any(word in content for word in ['space', 'planet', 'astronaut', 'mars', 'moon']):
            return "beautiful space scene with colorful planets and friendly astronauts, children's educational illustration, bright stars and galaxies"
        elif any(word in content for word in ['ocean', 'sea', 'marine', 'fish', 'whale']):
            return "vibrant underwater scene with happy marine life, colorful coral reef, friendly sea creatures, educational ocean illustration"
        elif any(word in content for word in ['school', 'student', 'learn', 'education']):
            return "diverse happy children learning in bright classroom, books and educational materials, inspiring school environment"
        elif any(word in content for word in ['animal', 'wildlife', 'zoo', 'pet']):
            return "cute friendly animals in beautiful natural habitat, colorful wildlife scene, animals and nature harmony"
        elif any(word in content for word in ['technology', 'robot', 'invention', 'innovation']):
            return "friendly robots and technology helping people, colorful innovation scene, positive technology illustration"
        elif any(word in content for word in ['environment', 'green', 'clean', 'renewable']):
            return "beautiful clean environment with renewable energy, green nature, wind turbines and solar panels, hopeful environmental scene"
        elif any(word in content for word in ['health', 'medicine', 'doctor', 'hospital']):
            return "positive healthcare scene with friendly doctors and happy families, medical care illustration, reassuring and hopeful"
        else:
            return "positive community scene with diverse happy children and families, bright colorful illustration, hopeful and inspiring"

def test_image_services():
    """Test available image generation services"""
    print("🎨 Testing Professional Image Services")
    print("=" * 45)
    
    service = ProfessionalImageService()
    
    # Test prompt
    test_prompt = "friendly cartoon robot helping colorful fish in underwater coral reef"
    
    # Test each service
    services = ['dalle3', 'leonardo', 'stability']
    
    for service_name in services:
        print(f"\n🔍 Testing {service_name.upper()}...")
        
        result = service.generate_image(test_prompt, service=service_name)
        
        if result:
            print(f"✅ {service_name.upper()} working - Image saved to: {result['path']}")
        else:
            print(f"❌ {service_name.upper()} not available")
    
    print(f"\n🎉 Testing complete!")

if __name__ == "__main__":
    test_image_services()
