#!/usr/bin/env python3
"""
FINAL Junior News Digest Video Generator
Uses consistent branding logo and watermark-free illustrations
"""

import os
import json
import requests
import subprocess
from pathlib import Path
import logging
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import time
import io
import numpy as np
import shutil
import re
import random

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FinalVideoGenerator:
    def __init__(self):
        self.elevenlabs_api = os.getenv('ELEVENLABS_API_KEY')
        self.output_dir = Path("production/generated_videos")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories
        (self.output_dir / "images").mkdir(exist_ok=True)
        (self.output_dir / "audio").mkdir(exist_ok=True)
        (self.output_dir / "final").mkdir(exist_ok=True)
        
        # Official logo path - look in backend directory first, then root
        self.official_logo = Path("junior_news_digest_official_logo.png")
        if not self.official_logo.exists():
            # Try looking in the parent directory (root)
            self.official_logo = Path("../OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png")
        
        # If still not found, try absolute paths
        if not self.official_logo.exists():
            backend_logo = Path(__file__).parent / "junior_news_digest_official_logo.png"
            logger.info(f"🔍 Trying backend logo: {backend_logo} (exists: {backend_logo.exists()})")
            if backend_logo.exists():
                self.official_logo = backend_logo
                logger.info("✅ Found backend logo")
            else:
                root_logo = Path(__file__).parent.parent / "OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png"
                logger.info(f"🔍 Trying root logo: {root_logo} (exists: {root_logo.exists()})")
                if root_logo.exists():
                    self.official_logo = root_logo
                    logger.info("✅ Found root logo")

    def check_grammar_and_improve(self, text: str) -> str:
        """Basic grammar checking and improvement for scripts"""
        # Fix common issues
        text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
        text = re.sub(r'([.!?])\s*([a-z])', r'\1 \2', text)  # Fix spacing after punctuation
        text = re.sub(r'([a-z])([A-Z])', r'\1. \2', text)  # Add periods before capital letters
        text = re.sub(r'\s+([.!?])', r'\1', text)  # Remove spaces before punctuation
        text = text.strip()
        
        # Ensure proper sentence structure
        sentences = text.split('. ')
        improved_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Capitalize first letter
            if sentence and sentence[0].islower():
                sentence = sentence[0].upper() + sentence[1:]
            
            # Ensure sentence ends with punctuation
            if sentence and not sentence[-1] in '.!?':
                sentence += '.'
                
            improved_sentences.append(sentence)
        
        return '. '.join(improved_sentences)

    def create_detailed_impact_description(self, title: str, content: str) -> str:
        """Create detailed description of what kids did and their impact"""
        # Extract key details from content
        details = []
        
        # Look for specific numbers and achievements
        numbers = re.findall(r'\d+[,\d]*(?:\s*(?:trees|pounds|miles|hours|days|weeks|months|years|students|kids|children|people|families|schools|communities|animals|species|projects|inventions|devices|programs|initiatives|events|activities|workshops|classes|awards|recognition|companies|organizations|governments|scientists|engineers|doctors|teachers|parents|adults))?', content, re.IGNORECASE)
        
        # Look for specific actions
        actions = re.findall(r'(?:created|built|designed|invented|organized|started|planted|cleaned|helped|taught|learned|worked|collaborated|developed|implemented|established|launched|founded|initiated|coordinated|managed|led|inspired|motivated|encouraged|supported|assisted|contributed|participated|volunteered|donated|fundraised|raised|collected|gathered|assembled|constructed|manufactured|produced|generated|created|made|achieved|accomplished|completed|finished|succeeded|won|earned|gained|obtained|received|secured|established|founded|launched|started|began|initiated|commenced)', content, re.IGNORECASE)
        
        # Look for impact words
        impacts = re.findall(r'(?:helped|saved|protected|improved|enhanced|benefited|assisted|supported|inspired|motivated|encouraged|taught|educated|informed|raised awareness|spread|promoted|advanced|developed|strengthened|built|created|established|founded|launched|started|initiated|commenced|began|achieved|accomplished|completed|succeeded|won|earned|gained|obtained|received|secured|established|founded|launched|started|began|initiated|commenced)', content, re.IGNORECASE)
        
        return {
            'numbers': numbers[:5],  # Top 5 numbers
            'actions': list(set(actions))[:8],  # Top 8 unique actions
            'impacts': list(set(impacts))[:6]  # Top 6 unique impacts
        }

    def extract_story_elements(self, title: str, content: str) -> dict:
        """Extract key elements from the story for adaptive script generation"""
        # Extract location
        location_patterns = [
            r'in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+students',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+kids'
        ]
        
        location = "their community"
        for pattern in location_patterns:
            match = re.search(pattern, title + " " + content, re.IGNORECASE)
            if match:
                location = match.group(1)
                break
        
        # Extract main action/achievement
        action_words = re.findall(r'(?:created|built|designed|invented|organized|started|planted|cleaned|helped|taught|learned|worked|collaborated|developed|implemented|established|launched|founded|initiated|coordinated|managed|led|inspired|motivated|encouraged|supported|assisted|contributed|participated|volunteered|donated|fundraised|raised|collected|gathered|assembled|constructed|manufactured|produced|generated|made|achieved|accomplished|completed|finished|succeeded|won|earned|gained|obtained|received|secured)', content, re.IGNORECASE)
        
        # Extract numbers and quantities
        numbers = re.findall(r'\d+[,\d]*(?:\s*(?:trees|pounds|miles|hours|days|weeks|months|years|students|kids|children|people|families|schools|communities|animals|species|projects|inventions|devices|programs|initiatives|events|activities|workshops|classes|awards|recognition|companies|organizations|governments|scientists|engineers|doctors|teachers|parents|adults))?', content, re.IGNORECASE)
        
        # Extract impact words
        impact_words = re.findall(r'(?:helped|saved|protected|improved|enhanced|benefited|assisted|supported|inspired|motivated|encouraged|taught|educated|informed|raised awareness|spread|promoted|advanced|developed|strengthened|built|created|established|founded|launched|started|initiated|commenced|began|achieved|accomplished|completed|succeeded|won|earned|gained|obtained|received|secured)', content, re.IGNORECASE)
        
        # Determine story category based on content
        category = "general"
        if any(word in content.lower() for word in ['environment', 'climate', 'trees', 'ocean', 'planet', 'green', 'solar', 'recycling', 'pollution']):
            category = "environment"
        elif any(word in content.lower() for word in ['technology', 'robot', 'invented', 'device', 'computer', 'digital', 'app', 'software']):
            category = "technology"
        elif any(word in content.lower() for word in ['health', 'food', 'nutrition', 'garden', 'exercise', 'medicine', 'doctor', 'hospital']):
            category = "health"
        elif any(word in content.lower() for word in ['sports', 'team', 'competition', 'athlete', 'game', 'tournament']):
            category = "sports"
        
        return {
            'location': location,
            'main_actions': list(set(action_words))[:5],
            'numbers': numbers[:5],
            'impacts': list(set(impact_words))[:5],
            'category': category
        }

    def create_adaptive_script(self, title: str, content: str) -> str:
        """Create an adaptive script that responds to the actual story content"""
        elements = self.extract_story_elements(title, content)
        
        # Create dynamic introduction based on story elements
        intro_templates = [
            f"Welcome to Junior News Digest! I'm so excited to share today's incredible story with you.",
            f"Welcome to Junior News Digest! I have the most inspiring story to share with you today.",
            f"Welcome to Junior News Digest! Today's story is going to amaze you.",
            f"Welcome to Junior News Digest! I'm thrilled to tell you about today's amazing story.",
            f"Welcome to Junior News Digest! Do I have an incredible story for you today!"
        ]
        
        intro = random.choice(intro_templates)
        
        # Create story-specific content
        story_intro = f"Today we're learning about young people in {elements['location']} who are making a real difference in their community and the world."
        
        # Extract the core story content (first 400 characters)
        core_content = content[:400] + "..." if len(content) > 400 else content
        
        # Create impact description based on actual story elements
        if elements['main_actions']:
            action_desc = f"What makes this story so remarkable is how these students {', '.join(elements['main_actions'][:3])} to create real change."
        else:
            action_desc = "What makes this story so remarkable is how these students took action to create real change."
        
        # Add specific details if numbers are available
        if elements['numbers']:
            numbers_desc = f"The results are impressive - {', '.join(elements['numbers'][:2])} and counting!"
        else:
            numbers_desc = "The results speak for themselves - these kids are proving that age is just a number when it comes to making a difference."
        
        # Create category-specific impact description
        impact_descriptions = {
            "environment": "This project is helping protect our planet and inspiring other communities to take environmental action.",
            "technology": "This innovation is solving real problems and showing how technology can make the world better.",
            "health": "This initiative is helping people live healthier lives and teaching important lessons about wellness.",
            "sports": "This achievement is bringing people together and showing the power of teamwork and determination.",
            "general": "This project is making a positive impact and inspiring others to take action in their own communities."
        }
        
        impact_desc = impact_descriptions.get(elements['category'], impact_descriptions['general'])
        
        # Create adaptive closing
        closing_templates = [
            "These young people show us that anyone can make a difference, no matter how old they are. Their creativity and hard work inspire everyone around them to take action and help others.",
            "These kids demonstrate that you don't have to be an adult to change the world. You just need a great idea and the courage to make it happen!",
            "These students prove that when young people put their minds to something, they can literally change the world. What problem do you see that you could help solve?",
            "These young leaders show us that age is just a number when it comes to making a difference. Their dedication and creativity inspire everyone around them.",
            "These amazing kids are proving that the future is in good hands. Their innovative thinking and collaborative spirit inspire us all."
        ]
        
        closing = random.choice(closing_templates)
        
        # Create final inspiration
        inspiration_templates = [
            "Isn't it incredible how young minds can solve such important problems? You could be the next young person to help make the world better!",
            "Isn't it amazing how young people can create such powerful solutions? You could be the next young innovator to solve an important problem!",
            "Isn't it wonderful how young people can unite entire communities? You could be the next young leader to bring your community together!",
            "Isn't it incredible how young minds can create such advanced solutions? You could be the next young inventor to create something amazing!",
            "Isn't it amazing how young people can make such a big difference for our planet? You could be the next young environmental hero to help save our world!"
        ]
        
        inspiration = random.choice(inspiration_templates)
        
        # Create final message
        final_messages = [
            "Keep dreaming big, keep learning, and remember - you're never too young to make a difference.",
            "Keep thinking creatively, keep collaborating, and remember - you're never too young to change the world.",
            "Keep caring, keep leading, and remember - you're never too young to make your community better.",
            "Keep inventing, keep exploring, and remember - you're never too young to change the world with technology.",
            "Keep protecting, keep caring, and remember - you're never too young to help save our planet."
        ]
        
        final_message = random.choice(final_messages)
        
        # Assemble the script
        script = f"""
        {intro}
        
        {story_intro}
        Are you ready to hear about these amazing kids and what they accomplished?
        
        {core_content}
        
        {action_desc}
        They didn't just have an idea - they took action and made it happen through hard work and determination.
        Their teachers, families, and entire community are amazed by what they've achieved together.
        {numbers_desc}
        {impact_desc}
        
        {closing}
        
        {inspiration}
        
        {final_message}
        
        Thanks for joining us on Junior News Digest. Until next time, stay curious!
        """
        
        # Apply grammar checking
        script = self.check_grammar_and_improve(script)
        
        return script

    def create_natural_conversational_script(self, title: str, content: str) -> str:
        """Create more natural, conversational script with variety and detailed impact"""
        return self.create_adaptive_script(title, content)

    def use_consistent_logo(self) -> str:
        """Use the official Junior News Digest logo as first scene"""
        logger.info(f"🔍 Checking logo: {self.official_logo}")
        logger.info(f"🔍 Logo exists: {self.official_logo.exists()}")
        logger.info(f"🔍 Logo absolute: {self.official_logo.absolute()}")
        
        if self.official_logo.exists():
            # Copy official logo to images directory
            logo_path = self.output_dir / "images" / "official_logo_scene_00.png"
            shutil.copy2(self.official_logo, logo_path)
            logger.info("✅ Using official Junior News Digest logo")
            return str(logo_path)
        else:
            # Create fallback logo if original not found
            logger.info("⚠️ Official logo not found, creating fallback")
            return self.create_fallback_logo()

    def create_fallback_logo(self) -> str:
        """Create fallback logo matching the original style"""
        width, height = 1920, 1080
        
        # Create bright sky background with ocean waves
        img = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(img)
        
        # Sky gradient (light blue to white)
        for y in range(int(height * 0.6)):
            ratio = y / (height * 0.6)
            r = int(135 + (255 - 135) * ratio)
            g = int(206 + (255 - 206) * ratio)
            b = int(235 + (255 - 235) * ratio)
            for x in range(width):
                draw.point((x, y), fill=(r, g, b))
        
        # Ocean gradient (bright blue)
        for y in range(int(height * 0.6), height):
            ratio = (y - height * 0.6) / (height * 0.4)
            r = int(30 + (100 - 30) * ratio)
            g = int(144 + (200 - 144) * ratio)
            b = int(255)
            for x in range(width):
                draw.point((x, y), fill=(r, g, b))
        
        # Add white fluffy clouds
        for cloud_x in [300, 800, 1400]:
            for cloud_y in [150, 200]:
                draw.ellipse([cloud_x, cloud_y, cloud_x + 200, cloud_y + 80], fill='white')
                draw.ellipse([cloud_x + 50, cloud_y - 30, cloud_x + 150, cloud_y + 50], fill='white')
        
        # Main "Junior News Digest" text
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
            subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = title_font
        
        # "Junior" text in bright orange/yellow gradient effect
        junior_text = "Junior"
        bbox = draw.textbbox((0, 0), junior_text, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2 - 100
        y = height // 2 - 120
        
        # Create 3D effect with multiple layers
        for offset in range(8, 0, -1):
            shadow_color = (255 - offset * 20, 140 + offset * 10, 0)
            draw.text((x + offset, y + offset), junior_text, font=title_font, fill=shadow_color)
        
        draw.text((x, y), junior_text, font=title_font, fill=(255, 200, 0))
        
        # "News Digest" text
        news_text = "News Digest"
        bbox = draw.textbbox((0, 0), news_text, font=subtitle_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height // 2 + 20
        
        # 3D effect for subtitle
        for offset in range(5, 0, -1):
            draw.text((x + offset, y + offset), news_text, font=subtitle_font, fill=(0, 50, 100))
        
        draw.text((x, y), news_text, font=subtitle_font, fill=(0, 100, 200))
        
        # Save fallback logo
        logo_path = self.output_dir / "images" / "fallback_logo_scene_00.png"
        img.save(logo_path, quality=98)
        
        logger.info("✅ Created fallback Junior News Digest logo")
        return str(logo_path)

    def create_story_specific_prompts(self, title: str) -> list:
        """Create prompts for story-specific illustrations (scenes 2-7)"""
        
        if "robot" in title.lower() and "ocean" in title.lower():
            return [
                "Cute cartoon whale robot swimming in crystal clear bright blue ocean, underwater scene with colorful coral reef, children's book illustration style",
                "Diverse group of young students in bright modern classroom designing robots, excited faces, colorful educational environment",
                "Whale robot collecting plastic waste, bright ocean scene, happy sea turtles and dolphins, positive environmental message",
                "Clean ocean vs polluted ocean comparison, bright before/after, hopeful environmental restoration theme",
                "Young inventors celebrating success, diverse group of kids, bright classroom, inspiring educational moment",
                "Beautiful clean ocean with marine life thriving, bright blue water, happy dolphins, inspiring environmental success"
            ]
        
        elif "solar" in title.lower() and "bus" in title.lower():
            return [
                "Bright yellow school bus with solar panels, sunny day, excited children, modern school setting",
                "Students in bright STEM classroom working on bus designs, diverse kids with tablets, collaborative learning",
                "Solar panels converting sunshine into electricity, energy flow visualization, educational cartoon style",
                "Interior of eco-friendly bus with happy children, comfortable modern seating, sunny landscape outside",
                "School building powered by solar bus energy, bright educational campus, green technology theme",
                "Young environmental heroes with solar bus, bright outdoor setting, empowering message"
            ]
        
        elif "inventor" in title.lower():
            return [
                "Four diverse young inventors from different countries, bright portrait montage, inspiring global representation",
                "Smart glasses helping elderly person, bright indoor setting, warm technology interaction",
                "Water filter in bright African village, clean water flowing, community celebration, positive impact",
                "Friendly robot companion with elderly person, warm bright setting, caring technology illustration",
                "Solar street lights in vibrant Mexican community, people using WiFi, warm community gathering",
                "All inventions working together in bright future world, young inventors as change-makers"
            ]
        
        return [
            f"Young diverse protagonists in bright setting with {title} theme, excited discovery moment, colorful educational adventure",
            "Innovation in bright action scene, vibrant illustration showing technology working, optimistic",
            "Problem being solved in bright positive scene, uplifting transformation moment",
            "Community celebrating success in bright outdoor setting, diverse group, positive impact",
            "Educational moment in bright classroom, children learning, inspiring knowledge transfer",
            "Bright optimistic future with young change-makers, empowering message, vibrant illustration"
        ]

    def extract_illustration_keywords(self, script: str, scene_num: int) -> str:
        """Extract key words from script to create relevant illustration prompts"""
        # Split script into sentences for scene-based prompts
        sentences = script.split('. ')
        total_sentences = len(sentences)
        
        # Calculate which part of the script this scene represents
        if scene_num == 0:
            # First scene - focus on introduction and setting
            relevant_text = ' '.join(sentences[:2]) if len(sentences) >= 2 else sentences[0]
        elif scene_num == 1:
            # Second scene - focus on the main story
            start_idx = max(0, total_sentences // 4)
            end_idx = min(total_sentences, start_idx + 3)
            relevant_text = ' '.join(sentences[start_idx:end_idx])
        elif scene_num == 2:
            # Third scene - focus on actions and achievements
            start_idx = max(0, total_sentences // 2)
            end_idx = min(total_sentences, start_idx + 3)
            relevant_text = ' '.join(sentences[start_idx:end_idx])
        elif scene_num == 3:
            # Fourth scene - focus on impact and results
            start_idx = max(0, int(total_sentences * 0.7))
            end_idx = min(total_sentences, start_idx + 3)
            relevant_text = ' '.join(sentences[start_idx:end_idx])
        else:
            # Later scenes - focus on inspiration and future
            start_idx = max(0, int(total_sentences * 0.8))
            relevant_text = ' '.join(sentences[start_idx:])
        
        # Extract key visual elements
        visual_keywords = []
        
        # Extract locations and settings
        location_words = re.findall(r'\b(?:school|community|garden|beach|ocean|forest|city|town|village|park|playground|laboratory|workshop|classroom|library|hospital|farm|field|mountain|river|lake|desert|island|coast|shoreline|urban|rural|indoor|outdoor)\b', relevant_text, re.IGNORECASE)
        visual_keywords.extend(location_words[:2])
        
        # Extract activities and actions
        action_words = re.findall(r'\b(?:planting|cleaning|building|creating|inventing|learning|teaching|helping|working|playing|studying|experimenting|collaborating|organizing|leading|inspiring|protecting|saving|healing|growing|developing|designing|constructing|assembling|collecting|gathering|sharing|celebrating|achieving|accomplishing)\b', relevant_text, re.IGNORECASE)
        visual_keywords.extend(action_words[:2])
        
        # Extract objects and tools
        object_words = re.findall(r'\b(?:trees|plants|flowers|vegetables|fruits|tools|equipment|machines|devices|computers|tablets|books|materials|supplies|instruments|vehicles|robots|solar panels|recycling bins|garden tools|scientific equipment|art supplies|sports equipment|musical instruments|cameras|microscopes|telescopes|magnifying glasses|lab coats|safety gear|uniforms|badges|awards|trophies|certificates)\b', relevant_text, re.IGNORECASE)
        visual_keywords.extend(object_words[:2])
        
        # Extract people and groups
        people_words = re.findall(r'\b(?:students|kids|children|young people|teens|teenagers|youth|volunteers|teachers|mentors|scientists|engineers|doctors|artists|inventors|leaders|team|group|community|family|friends|classmates|peers|adults|professionals|experts|guests|visitors|audience|crowd|participants)\b', relevant_text, re.IGNORECASE)
        visual_keywords.extend(people_words[:2])
        
        # Extract emotions and expressions
        emotion_words = re.findall(r'\b(?:happy|excited|proud|determined|focused|concentrated|joyful|enthusiastic|motivated|inspired|confident|successful|accomplished|satisfied|grateful|thankful|hopeful|optimistic|positive|cheerful|smiling|laughing|celebrating|high-fiving|clapping|applauding)\b', relevant_text, re.IGNORECASE)
        visual_keywords.extend(emotion_words[:1])
        
        # Remove duplicates and limit to most relevant
        unique_keywords = list(dict.fromkeys(visual_keywords))[:6]
        
        # Create a descriptive prompt
        if unique_keywords:
            base_prompt = f"Children and young people {', '.join(unique_keywords[:3])}"
            if len(unique_keywords) > 3:
                base_prompt += f" with {', '.join(unique_keywords[3:])}"
        else:
            base_prompt = "Children and young people working together on a positive project"
        
        return base_prompt

    def generate_watermark_free_illustration(self, prompt: str, scene_num: int) -> str:
        """Generate illustration and automatically remove watermarks"""
        
        # Extract key words from the script for more relevant illustrations
        script_keywords = self.extract_illustration_keywords(prompt, scene_num)
        
        # Enhanced prompt for maximum quality and clean design
        enhanced_prompt = f"{script_keywords}, extremely bright and vibrant, high contrast, colorful children's book illustration, pixar animation style, professional quality, 4k, clean design, no watermarks, no text overlays"
        
        # Try multiple seeds to get watermark-free images
        for seed in range(scene_num + 300, scene_num + 310):
            api_url = "https://image.pollinations.ai/prompt/"
            full_url = f"{api_url}{requests.utils.quote(enhanced_prompt)}?width=1920&height=1080&seed={seed}&enhance=true&nologo=true"
            
            try:
                response = requests.get(full_url, timeout=30)
                
                if response.status_code == 200:
                    # Save the image
                    image_path = self.output_dir / "images" / f"clean_scene_{scene_num:02d}_seed_{seed}.png"
                    
                    with open(image_path, 'wb') as f:
                        f.write(response.content)
                    
                    # Process to remove any watermarks
                    cleaned_path = self.remove_watermarks(image_path)
                    
                    if cleaned_path:
                        logger.info(f"✅ Generated clean illustration {scene_num}: {cleaned_path}")
                        return str(cleaned_path)
                    
            except Exception as e:
                logger.error(f"Error generating image {scene_num} with seed {seed}: {e}")
                continue
        
        # If all attempts fail, create a clean fallback
        return self.create_clean_fallback_image(scene_num, prompt)

    def remove_watermarks(self, image_path: Path) -> str:
        """Automatically detect and remove watermarks"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize to exact dimensions
                if img.size != (1920, 1080):
                    img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
                
                # Convert to numpy array for processing
                img_array = np.array(img)
                
                # Remove watermarks from common locations
                cleaned_array = self.clean_watermark_regions(img_array)
                
                # Convert back to PIL Image
                cleaned_img = Image.fromarray(cleaned_array.astype('uint8'))
                
                # Enhance the cleaned image
                cleaned_img = self.enhance_cleaned_image(cleaned_img)
                
                # Save cleaned version
                cleaned_path = image_path.with_suffix('.clean.png')
                cleaned_img.save(cleaned_path, 'PNG', quality=98, optimize=True)
                
                # Remove original
                image_path.unlink()
                
                return str(cleaned_path)
                
        except Exception as e:
            logger.error(f"Watermark removal failed: {e}")
            return str(image_path)

    def clean_watermark_regions(self, img_array: np.ndarray) -> np.ndarray:
        """Remove watermarks from common locations"""
        height, width = img_array.shape[:2]
        
        # Common watermark locations
        regions_to_clean = [
            # Bottom right corner (most common)
            (int(width * 0.7), int(height * 0.85), width, height),
            # Bottom left corner
            (0, int(height * 0.85), int(width * 0.3), height),
            # Top right corner
            (int(width * 0.7), 0, width, int(height * 0.15)),
            # Bottom center
            (int(width * 0.3), int(height * 0.9), int(width * 0.7), height),
        ]
        
        for x1, y1, x2, y2 in regions_to_clean:
            # Extract the region
            region = img_array[y1:y2, x1:x2]
            
            # Check if this region might contain a watermark (white/light areas)
            if self.detect_potential_watermark(region):
                # Inpaint the region using surrounding pixels
                img_array = self.inpaint_region(img_array, x1, y1, x2, y2)
        
        return img_array

    def detect_potential_watermark(self, region: np.ndarray) -> bool:
        """Detect if a region might contain a watermark"""
        if region.size == 0:
            return False
        
        # Convert to grayscale for analysis
        gray = np.mean(region, axis=2) if len(region.shape) == 3 else region
        
        # Check for high brightness (watermarks are often white/light)
        brightness = np.mean(gray)
        high_contrast = np.std(gray)
        
        # Watermarks tend to be bright with high contrast
        return brightness > 200 and high_contrast > 30

    def inpaint_region(self, img_array: np.ndarray, x1: int, y1: int, x2: int, y2: int) -> np.ndarray:
        """Inpaint a region by blending with surrounding pixels"""
        height, width = img_array.shape[:2]
        
        # Create a copy to work with
        result = img_array.copy()
        
        # Get surrounding regions for blending
        border_size = 10
        
        # Top border
        if y1 > border_size:
            top_region = img_array[y1-border_size:y1, x1:x2]
            if top_region.size > 0:
                top_avg = np.mean(top_region, axis=(0, 1))
                result[y1:y1+border_size, x1:x2] = top_avg
        
        # Bottom border  
        if y2 < height - border_size:
            bottom_region = img_array[y2:y2+border_size, x1:x2]
            if bottom_region.size > 0:
                bottom_avg = np.mean(bottom_region, axis=(0, 1))
                result[y2-border_size:y2, x1:x2] = bottom_avg
        
        # Left border
        if x1 > border_size:
            left_region = img_array[y1:y2, x1-border_size:x1]
            if left_region.size > 0:
                left_avg = np.mean(left_region, axis=(0, 1))
                result[y1:y2, x1:x1+border_size] = left_avg
        
        # Right border
        if x2 < width - border_size:
            right_region = img_array[y1:y2, x2:x2+border_size]
            if right_region.size > 0:
                right_avg = np.mean(right_region, axis=(0, 1))
                result[y1:y2, x2-border_size:x2] = right_avg
        
        # Fill the center with gradient blending
        center_height = y2 - y1
        center_width = x2 - x1
        
        if center_height > 0 and center_width > 0:
            # Create gradient blend from borders
            for y in range(y1, y2):
                for x in range(x1, x2):
                    # Calculate blend weights based on distance to edges
                    weight_top = (y - y1) / center_height if center_height > 0 else 0
                    weight_left = (x - x1) / center_width if center_width > 0 else 0
                    
                    # Blend colors from surrounding areas
                    if y1 > 0 and x1 > 0:
                        result[y, x] = (
                            result[y1-1, x] * (1 - weight_top) +
                            result[y, x1-1] * (1 - weight_left) +
                            result[min(y2, height-1), x] * weight_top +
                            result[y, min(x2, width-1)] * weight_left
                        ) / 4
        
        return result

    def enhance_cleaned_image(self, img: Image.Image) -> Image.Image:
        """Enhance the cleaned image"""
        # Enhance brightness and appeal
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.1)
        
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.15)
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.05)
        
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.05)
        
        return img

    def create_clean_fallback_image(self, scene_num: int, prompt: str) -> str:
        """Create clean fallback image without any watermarks"""
        width, height = 1920, 1080
        
        # Create bright gradient background
        img = Image.new('RGB', (width, height), color='#4FC3F7')
        draw = ImageDraw.Draw(img)
        
        # Create bright gradient
        for y in range(height):
            r = int(79 + (255 - 79) * y / height)
            g = int(195 + (255 - 195) * y / height)
            b = int(247 + (255 - 247) * y / height)
            
            for x in range(width):
                draw.point((x, y), fill=(r, g, b))
        
        # Add clean text
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            font = ImageFont.load_default()
            small_font = font
        
        main_text = "Junior News Digest"
        scene_text = f"Scene {scene_num + 1}"
        
        # Main title
        bbox = draw.textbbox((0, 0), main_text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height // 2 - 60
        
        # Clean white text with shadow
        draw.text((x + 3, y + 3), main_text, font=font, fill=(0, 0, 0, 80))
        draw.text((x, y), main_text, font=font, fill='white')
        
        # Scene number
        bbox = draw.textbbox((0, 0), scene_text, font=small_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height // 2 + 40
        
        draw.text((x + 2, y + 2), scene_text, font=small_font, fill=(0, 0, 0, 60))
        draw.text((x, y), scene_text, font=small_font, fill='white')
        
        # Save clean fallback
        fallback_path = self.output_dir / "images" / f"clean_fallback_{scene_num:02d}.png"
        img.save(fallback_path, quality=98)
        
        return str(fallback_path)

    def generate_elevenlabs_voice_natural(self, script: str) -> str:
        """Generate voice with natural settings"""
        
        if self.elevenlabs_api and self.elevenlabs_api != 'your_api_key_here':
            return self.generate_elevenlabs_audio_natural(script)
        else:
            return self.generate_system_voice_natural(script)

    def generate_elevenlabs_audio_natural(self, script: str) -> str:
        """Generate audio using ElevenLabs with natural settings"""
        voice_id = "EXAVITQu4vr4xnSDxMaL"  # Bella - natural female voice
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_api
        }
        
        data = {
            "text": script,
            "model_id": "eleven_turbo_v2_5",
            "voice_settings": {
                "stability": 0.3,
                "similarity_boost": 0.8,
                "style": 0.4,
                "use_speaker_boost": True
            }
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                audio_path = self.output_dir / "audio" / "natural_clean_voice.mp3"
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                
                logger.info("✅ Natural ElevenLabs voice generated")
                return str(audio_path)
            else:
                logger.error(f"ElevenLabs API error: {response.status_code}")
                return self.generate_system_voice_natural(script)
                
        except Exception as e:
            logger.error(f"ElevenLabs error: {e}")
            return self.generate_system_voice_natural(script)

    def generate_system_voice_natural(self, script: str) -> str:
        """Generate voice using system TTS"""
        audio_path = self.output_dir / "audio" / "natural_clean_system.aiff"
        
        cmd = [
            'say', '-v', 'Samantha', '-r', '155',
            '-o', str(audio_path), script
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Convert to MP3
            mp3_path = self.output_dir / "audio" / "natural_clean_system.mp3"
            subprocess.run([
                'ffmpeg', '-i', str(audio_path),
                '-acodec', 'libmp3lame', '-b:a', '192k',
                '-ar', '44100', '-y', str(mp3_path)
            ], check=True)
            
            # Remove AIFF
            audio_path.unlink()
            
            logger.info("✅ Natural system voice generated")
            return str(mp3_path)
            
        except Exception as e:
            logger.error(f"Voice generation failed: {e}")
            raise

    def create_branded_video(self, title: str, content: str) -> str:
        """Create perfect video with consistent branding and watermark-free illustrations"""
        logger.info(f"🎬 Creating branded Junior News Digest video: {title}")
        
        # Create natural script
        script = self.create_natural_conversational_script(title, content)
        
        # Generate natural voice
        audio_path = self.generate_elevenlabs_voice_natural(script)
        
        # Get audio duration
        duration_info = subprocess.run([
            'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
            '-of', 'csv=p=0', audio_path
        ], capture_output=True, text=True)
        
        try:
            total_duration = float(duration_info.stdout.strip())
        except:
            total_duration = 65
        
        # Start with official logo
        image_paths = []
        logo_path = self.use_consistent_logo()
        image_paths.append(logo_path)
        
        # Generate story-specific illustrations
        visual_prompts = self.create_story_specific_prompts(title)
        
        for i, prompt in enumerate(visual_prompts):
            image_path = self.generate_watermark_free_illustration(prompt, i + 1)
            image_paths.append(image_path)
        
        # Create perfect branded video
        timestamp = int(time.time())
        output_path = self.output_dir / "final" / f"{title.replace(' ', '_').lower()}_branded_{timestamp}.mp4"
        
        # Calculate duration per image
        duration_per_image = total_duration / len(image_paths)
        
        # Create input file for ffmpeg
        input_file = self.output_dir / "branded_concat_input.txt"
        with open(input_file, 'w') as f:
            for img_path in image_paths:
                f.write(f"file '{Path(img_path).absolute()}'\n")
                f.write(f"duration {duration_per_image:.3f}\n")
            f.write(f"file '{Path(image_paths[-1]).absolute()}'\n")
        
        # Create branded video
        cmd = [
            'ffmpeg',
            '-f', 'concat', '-safe', '0', '-i', str(input_file),
            '-i', audio_path,
            '-filter_complex', 
            '[0:v]scale=1920:1080,setpts=PTS-STARTPTS[v]',
            '-map', '[v]', '-map', '1:a',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
            '-c:a', 'aac', '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-avoid_negative_ts', 'make_zero',
            '-fflags', '+genpts',
            '-shortest', '-y', str(output_path)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            logger.info(f"✅ Branded Junior News Digest video created: {output_path}")
            return str(output_path)
        except subprocess.CalledProcessError as e:
            logger.error(f"Video creation failed: {e}")
            raise

def generate_final_branded_videos():
    """Generate final branded videos for the app"""
    generator = FinalVideoGenerator()
    
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
            video_path = generator.create_branded_video(story['title'], story['content'])
            
            # Copy to app
            app_name = story['title'].replace(' ', '_').replace(',', '').lower() + '_story.mp4'
            app_path = Path("app_development/kids_news_app_fixed/assets/videos") / app_name
            
            subprocess.run(['cp', video_path, str(app_path)])
            print(f"✅ Branded video with consistent logo copied to app: {app_path}")
            
        except Exception as e:
            print(f"❌ Failed to generate branded video for {story['title']}: {e}")

if __name__ == "__main__":
    generate_final_branded_videos()
