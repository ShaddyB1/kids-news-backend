#!/usr/bin/env python3
"""
Automatic Thumbnail Generator for Junior News Digest
===================================================

This script generates and manages thumbnails for news stories using:
1. AI image generation (DALL-E 3, Leonardo.ai, Stability AI)
2. Automatic story analysis and prompt generation
3. Thumbnail optimization and resizing
4. Fallback to stock images or generated placeholders
"""

import os
import sys
import json
import requests
import base64
from PIL import Image, ImageDraw, ImageFont
import io
import logging
from typing import Dict, List, Optional, Tuple
from pathlib import Path
import hashlib
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ThumbnailGenerator:
    def __init__(self, config_path: str = None):
        """Initialize the thumbnail generator with configuration"""
        self.config = self.load_config(config_path)
        self.thumbnails_dir = Path("thumbnails")
        self.thumbnails_dir.mkdir(exist_ok=True)
        
        # Thumbnail specifications
        self.thumbnail_size = (400, 300)  # 4:3 aspect ratio
        self.quality = 85
        
    def load_config(self, config_path: str = None) -> Dict:
        """Load configuration from file or environment"""
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "openai_api_key": os.getenv("OPENAI_API_KEY"),
            "leonardo_api_key": os.getenv("LEONARDO_API_KEY"),
            "stability_api_key": os.getenv("STABILITY_API_KEY"),
            "unsplash_api_key": os.getenv("UNSPLASH_API_KEY"),
            "preferred_provider": "dalle3",  # dalle3, leonardo, stability, unsplash
            "fallback_to_stock": True,
            "generate_placeholder": True
        }
    
    def analyze_story_for_thumbnail(self, story: Dict) -> Dict:
        """Analyze story content to generate thumbnail prompts"""
        title = story.get('title', '')
        summary = story.get('summary', '')
        content = story.get('content', '')
        category = story.get('category', 'general')
        
        # Extract key themes and visual elements
        themes = self.extract_themes(title, summary, content)
        visual_elements = self.get_visual_elements(category, themes)
        
        # Generate prompts for different AI providers
        prompts = {
            "dalle3": self.generate_dalle3_prompt(title, visual_elements, themes),
            "leonardo": self.generate_leonardo_prompt(title, visual_elements, themes),
            "stability": self.generate_stability_prompt(title, visual_elements, themes),
            "unsplash": self.generate_unsplash_query(title, visual_elements, themes)
        }
        
        return {
            "themes": themes,
            "visual_elements": visual_elements,
            "prompts": prompts,
            "category": category,
            "age_appropriate": True
        }
    
    def extract_themes(self, title: str, summary: str, content: str) -> List[str]:
        """Extract key themes from story content"""
        text = f"{title} {summary} {content}".lower()
        
        # Common themes for kids' news
        theme_keywords = {
            "environment": ["environment", "climate", "trees", "ocean", "recycling", "green", "earth", "planet"],
            "science": ["science", "discovery", "research", "experiment", "robot", "technology", "invention"],
            "health": ["health", "food", "garden", "nutrition", "exercise", "wellness", "healthy"],
            "sports": ["sports", "athletes", "games", "team", "competition", "fitness", "play"],
            "education": ["school", "students", "learning", "education", "classroom", "teacher"],
            "community": ["community", "helping", "volunteer", "charity", "friends", "together"],
            "animals": ["animals", "pets", "wildlife", "nature", "creatures", "butterfly", "ocean life"]
        }
        
        themes = []
        for theme, keywords in theme_keywords.items():
            if any(keyword in text for keyword in keywords):
                themes.append(theme)
        
        return themes if themes else ["general"]
    
    def get_visual_elements(self, category: str, themes: List[str]) -> List[str]:
        """Get visual elements based on category and themes"""
        visual_mapping = {
            "environment": ["trees", "ocean", "earth", "green nature", "recycling symbols", "clean water"],
            "science": ["laboratory", "microscope", "robots", "space", "experiments", "scientists"],
            "health": ["fresh vegetables", "garden", "healthy food", "exercise", "smiling kids"],
            "sports": ["sports equipment", "playing field", "team spirit", "athletes", "medals"],
            "education": ["school building", "books", "classroom", "students learning", "teacher"],
            "community": ["people helping", "diverse group", "hands together", "community center"],
            "animals": ["cute animals", "wildlife", "pets", "nature scenes", "animal friends"]
        }
        
        elements = []
        for theme in themes:
            if theme in visual_mapping:
                elements.extend(visual_mapping[theme])
        
        return elements[:5]  # Limit to 5 elements
    
    def generate_dalle3_prompt(self, title: str, visual_elements: List[str], themes: List[str]) -> str:
        """Generate DALL-E 3 prompt for thumbnail"""
        elements_str = ", ".join(visual_elements[:3])
        themes_str = ", ".join(themes)
        
        prompt = f"""Create a colorful, kid-friendly illustration for a news story titled "{title}". 
        Include: {elements_str}. 
        Style: bright, cheerful, cartoon-like, suitable for children ages 6-12. 
        Theme: {themes_str}. 
        Make it engaging and educational, with vibrant colors and friendly characters."""
        
        return prompt.strip()
    
    def generate_leonardo_prompt(self, title: str, visual_elements: List[str], themes: List[str]) -> str:
        """Generate Leonardo.ai prompt for thumbnail"""
        elements_str = ", ".join(visual_elements[:3])
        
        prompt = f"""Kids news illustration: {title}. 
        Elements: {elements_str}. 
        Style: colorful cartoon, child-friendly, educational, bright and cheerful. 
        Age-appropriate for 6-12 year olds."""
        
        return prompt.strip()
    
    def generate_stability_prompt(self, title: str, visual_elements: List[str], themes: List[str]) -> str:
        """Generate Stability AI prompt for thumbnail"""
        elements_str = ", ".join(visual_elements[:2])
        
        prompt = f"""Children's book illustration style, {title}, {elements_str}, 
        colorful, educational, kid-friendly, cartoon style, bright colors"""
        
        return prompt.strip()
    
    def generate_unsplash_query(self, title: str, visual_elements: List[str], themes: List[str]) -> str:
        """Generate Unsplash search query for stock photos"""
        elements_str = " ".join(visual_elements[:2])
        return f"kids {elements_str} {themes[0] if themes else 'education'}"
    
    def generate_thumbnail_dalle3(self, prompt: str, story_id: str) -> Optional[str]:
        """Generate thumbnail using DALL-E 3"""
        if not self.config.get("openai_api_key"):
            logger.warning("OpenAI API key not found")
            return None
        
        try:
            headers = {
                "Authorization": f"Bearer {self.config['openai_api_key']}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "standard",
                "style": "natural"
            }
            
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                image_url = result["data"][0]["url"]
                return self.download_and_save_image(image_url, story_id)
            else:
                logger.error(f"DALL-E 3 error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"DALL-E 3 generation failed: {e}")
            return None
    
    def generate_thumbnail_leonardo(self, prompt: str, story_id: str) -> Optional[str]:
        """Generate thumbnail using Leonardo.ai"""
        if not self.config.get("leonardo_api_key"):
            logger.warning("Leonardo API key not found")
            return None
        
        try:
            headers = {
                "Authorization": f"Bearer {self.config['leonardo_api_key']}",
                "Content-Type": "application/json"
            }
            
            data = {
                "prompt": prompt,
                "width": 1024,
                "height": 1024,
                "num_images": 1,
                "guidance_scale": 7,
                "scheduler": "LEONARDO"
            }
            
            response = requests.post(
                "https://cloud.leonardo.ai/api/rest/v1/generations",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                generation_id = result["sdGenerationJob"]["generationId"]
                return self.wait_for_leonardo_generation(generation_id, story_id)
            else:
                logger.error(f"Leonardo error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Leonardo generation failed: {e}")
            return None
    
    def wait_for_leonardo_generation(self, generation_id: str, story_id: str) -> Optional[str]:
        """Wait for Leonardo generation to complete and download result"""
        headers = {
            "Authorization": f"Bearer {self.config['leonardo_api_key']}",
            "Content-Type": "application/json"
        }
        
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                response = requests.get(
                    f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result["generations_by_pk"]["status"] == "COMPLETE":
                        image_url = result["generations_by_pk"]["generated_images"][0]["url"]
                        return self.download_and_save_image(image_url, story_id)
                    elif result["generations_by_pk"]["status"] == "FAILED":
                        logger.error("Leonardo generation failed")
                        return None
                
                time.sleep(2)  # Wait 2 seconds before next check
                
            except Exception as e:
                logger.error(f"Error checking Leonardo generation: {e}")
                return None
        
        logger.error("Leonardo generation timeout")
        return None
    
    def generate_thumbnail_stability(self, prompt: str, story_id: str) -> Optional[str]:
        """Generate thumbnail using Stability AI"""
        if not self.config.get("stability_api_key"):
            logger.warning("Stability API key not found")
            return None
        
        try:
            headers = {
                "Authorization": f"Bearer {self.config['stability_api_key']}",
                "Content-Type": "application/json"
            }
            
            data = {
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30
            }
            
            response = requests.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                image_data = result["artifacts"][0]["base64"]
                return self.save_base64_image(image_data, story_id)
            else:
                logger.error(f"Stability AI error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Stability AI generation failed: {e}")
            return None
    
    def get_stock_photo_unsplash(self, query: str, story_id: str) -> Optional[str]:
        """Get stock photo from Unsplash"""
        if not self.config.get("unsplash_api_key"):
            logger.warning("Unsplash API key not found")
            return None
        
        try:
            headers = {
                "Authorization": f"Client-ID {self.config['unsplash_api_key']}"
            }
            
            params = {
                "query": query,
                "per_page": 1,
                "orientation": "landscape"
            }
            
            response = requests.get(
                "https://api.unsplash.com/search/photos",
                headers=headers,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result["results"]:
                    image_url = result["results"][0]["urls"]["regular"]
                    return self.download_and_save_image(image_url, story_id)
            
            return None
            
        except Exception as e:
            logger.error(f"Unsplash search failed: {e}")
            return None
    
    def create_placeholder_thumbnail(self, story: Dict, story_id: str) -> str:
        """Create a placeholder thumbnail with story information"""
        try:
            # Create a colorful background
            img = Image.new('RGB', self.thumbnail_size, self.get_category_color(story.get('category', 'general')))
            draw = ImageDraw.Draw(img)
            
            # Try to load a font, fallback to default
            try:
                font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
                font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
            except:
                font_large = ImageFont.load_default()
                font_small = ImageFont.load_default()
            
            # Add title (wrapped)
            title = story.get('title', 'News Story')
            title_lines = self.wrap_text(title, font_large, self.thumbnail_size[0] - 40)
            
            y_offset = 20
            for line in title_lines:
                bbox = draw.textbbox((0, 0), line, font=font_large)
                text_width = bbox[2] - bbox[0]
                x = (self.thumbnail_size[0] - text_width) // 2
                draw.text((x, y_offset), line, fill='white', font=font_large)
                y_offset += 30
            
            # Add category
            category = story.get('category', 'news').upper()
            draw.text((20, self.thumbnail_size[1] - 40), category, fill='white', font=font_small)
            
            # Add emoji based on category
            emoji = self.get_category_emoji(story.get('category', 'general'))
            draw.text((self.thumbnail_size[0] - 40, self.thumbnail_size[1] - 40), emoji, fill='white', font=font_large)
            
            # Save thumbnail
            filename = f"{story_id}.jpg"
            filepath = self.thumbnails_dir / filename
            img.save(filepath, 'JPEG', quality=self.quality)
            
            logger.info(f"Created placeholder thumbnail: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"Failed to create placeholder thumbnail: {e}")
            return None
    
    def get_category_color(self, category: str) -> Tuple[int, int, int]:
        """Get color for category"""
        colors = {
            'environment': (34, 139, 34),    # Forest Green
            'science': (70, 130, 180),       # Steel Blue
            'health': (255, 165, 0),         # Orange
            'sports': (220, 20, 60),         # Crimson
            'education': (138, 43, 226),     # Blue Violet
            'community': (255, 20, 147),     # Deep Pink
            'animals': (255, 140, 0),        # Dark Orange
            'general': (72, 61, 139)         # Dark Slate Blue
        }
        return colors.get(category, colors['general'])
    
    def get_category_emoji(self, category: str) -> str:
        """Get emoji for category"""
        emojis = {
            'environment': '🌱',
            'science': '🔬',
            'health': '🍎',
            'sports': '⚽',
            'education': '📚',
            'community': '🤝',
            'animals': '🐾',
            'general': '📰'
        }
        return emojis.get(category, '📰')
    
    def wrap_text(self, text: str, font, max_width: int) -> List[str]:
        """Wrap text to fit within max_width"""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = font.getbbox(test_line)
            text_width = bbox[2] - bbox[0]
            
            if text_width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines[:3]  # Max 3 lines
    
    def download_and_save_image(self, url: str, story_id: str) -> Optional[str]:
        """Download image from URL and save as thumbnail"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Open and resize image
            img = Image.open(io.BytesIO(response.content))
            img = img.convert('RGB')
            img = img.resize(self.thumbnail_size, Image.Resampling.LANCZOS)
            
            # Save thumbnail
            filename = f"{story_id}.jpg"
            filepath = self.thumbnails_dir / filename
            img.save(filepath, 'JPEG', quality=self.quality)
            
            logger.info(f"Downloaded and saved thumbnail: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"Failed to download image: {e}")
            return None
    
    def save_base64_image(self, image_data: str, story_id: str) -> Optional[str]:
        """Save base64 image data as thumbnail"""
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            img = Image.open(io.BytesIO(image_bytes))
            img = img.convert('RGB')
            img = img.resize(self.thumbnail_size, Image.Resampling.LANCZOS)
            
            # Save thumbnail
            filename = f"{story_id}.jpg"
            filepath = self.thumbnails_dir / filename
            img.save(filepath, 'JPEG', quality=self.quality)
            
            logger.info(f"Saved base64 thumbnail: {filename}")
            return str(filepath)
            
        except Exception as e:
            logger.error(f"Failed to save base64 image: {e}")
            return None
    
    def generate_thumbnail_for_story(self, story: Dict) -> Optional[str]:
        """Generate thumbnail for a story using the best available method"""
        story_id = story.get('id', 'unknown')
        logger.info(f"Generating thumbnail for story: {story_id}")
        
        # Analyze story for thumbnail generation
        analysis = self.analyze_story_for_thumbnail(story)
        
        # Try different methods in order of preference
        providers = [
            self.config.get('preferred_provider', 'dalle3'),
            'dalle3', 'leonardo', 'stability', 'unsplash'
        ]
        
        # Remove duplicates while preserving order
        providers = list(dict.fromkeys(providers))
        
        for provider in providers:
            try:
                if provider == 'dalle3':
                    result = self.generate_thumbnail_dalle3(
                        analysis['prompts']['dalle3'], story_id
                    )
                elif provider == 'leonardo':
                    result = self.generate_thumbnail_leonardo(
                        analysis['prompts']['leonardo'], story_id
                    )
                elif provider == 'stability':
                    result = self.generate_thumbnail_stability(
                        analysis['prompts']['stability'], story_id
                    )
                elif provider == 'unsplash':
                    result = self.get_stock_photo_unsplash(
                        analysis['prompts']['unsplash'], story_id
                    )
                else:
                    continue
                
                if result:
                    logger.info(f"Successfully generated thumbnail using {provider}")
                    return result
                    
            except Exception as e:
                logger.warning(f"Provider {provider} failed: {e}")
                continue
        
        # Fallback to placeholder
        if self.config.get('generate_placeholder', True):
            logger.info("All providers failed, creating placeholder thumbnail")
            return self.create_placeholder_thumbnail(story, story_id)
        
        return None
    
    def batch_generate_thumbnails(self, stories: List[Dict]) -> Dict[str, str]:
        """Generate thumbnails for multiple stories"""
        results = {}
        
        for story in stories:
            story_id = story.get('id')
            if not story_id:
                continue
            
            # Check if thumbnail already exists
            existing_thumbnail = self.thumbnails_dir / f"{story_id}.jpg"
            if existing_thumbnail.exists():
                logger.info(f"Thumbnail already exists for {story_id}")
                results[story_id] = str(existing_thumbnail)
                continue
            
            # Generate new thumbnail
            thumbnail_path = self.generate_thumbnail_for_story(story)
            if thumbnail_path:
                results[story_id] = thumbnail_path
            else:
                logger.error(f"Failed to generate thumbnail for {story_id}")
        
        return results

def main():
    """Main function for testing thumbnail generation"""
    generator = ThumbnailGenerator()
    
    # Test with sample story
    sample_story = {
        "id": "test_story",
        "title": "Kids Plant 1000 Trees to Save the Planet",
        "summary": "Elementary students organized a massive tree-planting event",
        "content": "Students from Green Valley School planted 1000 trees...",
        "category": "environment"
    }
    
    result = generator.generate_thumbnail_for_story(sample_story)
    if result:
        print(f"Generated thumbnail: {result}")
    else:
        print("Failed to generate thumbnail")

if __name__ == "__main__":
    main()
