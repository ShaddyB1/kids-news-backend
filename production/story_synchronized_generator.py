#!/usr/bin/env python3
"""
Story-Synchronized Junior News Digest Generator
Uses exact user-specified logo and creates illustrations that follow story closely
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

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StorySynchronizedGenerator:
    def __init__(self):
        self.elevenlabs_api = os.getenv('ELEVENLABS_API_KEY')
        self.output_dir = Path("production/story_sync_videos")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories
        (self.output_dir / "images").mkdir(exist_ok=True)
        (self.output_dir / "audio").mkdir(exist_ok=True)
        (self.output_dir / "final").mkdir(exist_ok=True)
        
        # Official logo path - USE EXACT USER-SPECIFIED LOGO
        self.official_logo = Path("OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png")

    def create_natural_conversational_script(self, title: str, content: str) -> str:
        """Create more natural, conversational script"""
        
        if "robot" in title.lower() and "ocean" in title.lower():
            script = """
            Welcome to Junior News Digest! I'm so excited to share today's amazing story with you.
            
            Today we're diving deep into the ocean to meet some incredible young inventors. 
            Are you ready for an underwater adventure?
            
            These amazing students created something that's helping save our oceans right now. 
            They built a robot that looks just like a whale, and it's cleaning up plastic waste!
            
            This robot swims around collecting tiny pieces of plastic that could hurt sea animals like dolphins and turtles.
            And guess what? It runs on solar power, so it's completely clean and green.
            
            Since this whale robot started working, it's already cleaned up thousands of pounds of plastic.
            That means safer, cleaner homes for all our ocean friends.
            
            Isn't it incredible how young minds can solve such big problems?
            You could be the next young inventor to help save our planet!
            
            Keep dreaming big, keep learning, and remember - you're never too young to make a difference.
            
            Thanks for joining us on Junior News Digest. Until next time, stay curious!
            """
        
        elif "solar" in title.lower() and "bus" in title.lower():
            script = """
            Welcome to Junior News Digest! Do I have the coolest story for you today!
            
            Imagine riding to school in a bus that's powered by sunshine. 
            Sounds like science fiction, right? Well, it's totally real!
            
            Students at a school in California worked with engineers to design the most amazing school bus ever.
            It has solar panels right on the roof that turn sunlight into electricity.
            
            This bus is whisper quiet, creates zero pollution, and even charges tablets while you ride.
            Plus, it makes so much extra energy that it can power the whole school's computers!
            
            The kids who helped design it say riding it feels like being in a spaceship from the future.
            And the best part? Other schools are now building their own solar buses too.
            
            These students proved that when kids put their minds to something, they can literally change the world.
            Maybe your school could be next!
            
            Keep thinking of ways to help our planet. Your ideas matter more than you know.
            
            That's all for today's Junior News Digest. Keep being awesome!
            """
        
        elif "inventor" in title.lower():
            script = """
            Welcome to Junior News Digest! Today's story is going to blow your mind.
            
            I want you to meet four of the most amazing young inventors on our planet.
            Each one saw a problem in their community and decided to do something about it.
            
            First, there's Emma from Canada. She noticed her grandma had trouble hearing conversations.
            So she invented smart glasses that show spoken words as text. Now grandma never misses a word!
            
            Then there's Marcus from Kenya. He saw families walking miles just to get clean water.
            So he built a portable water filter that's now helping over 500 families every day.
            
            Priya from India created a friendly robot companion that helps elderly people remember to take their medicine and even tells jokes to make them smile.
            
            And Diego from Mexico invented solar street lights that also provide WiFi and phone charging for his whole community.
            
            These kids didn't wait for adults to solve these problems. They became the solution.
            And you know what? You could be next.
            
            What problem do you see that you could help solve? Start dreaming, start building!
            
            Thanks for watching Junior News Digest. Remember, great ideas come from curious minds like yours!
            """
        
        return script.strip()

    def use_exact_user_logo(self) -> str:
        """Use the exact logo image specified by the user"""
        if self.official_logo.exists():
            # Copy user's exact logo to images directory
            logo_path = self.output_dir / "images" / "exact_user_logo_scene_00.png"
            shutil.copy2(self.official_logo, logo_path)
            logger.info("✅ Using EXACT user-specified Junior News Digest logo")
            return str(logo_path)
        else:
            logger.error("❌ User's exact logo not found! Please ensure OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png exists")
            raise FileNotFoundError("User's exact logo file not found")

    def create_story_synchronized_prompts(self, title: str, script: str) -> list:
        """Create prompts that follow the story timeline exactly"""
        
        if "robot" in title.lower() and "ocean" in title.lower():
            return [
                # Frame 2: "diving deep into the ocean to meet some incredible young inventors"
                "Young diverse students in bright underwater exploration suits diving into crystal clear ocean, excited expressions, colorful marine life around them, educational underwater adventure scene",
                
                # Frame 3: "These amazing students created something that's helping save our oceans"  
                "Diverse group of young students in bright modern lab working together on whale robot blueprints, excited faces, computer screens showing robot designs, collaborative STEM environment",
                
                # Frame 4: "They built a robot that looks just like a whale, and it's cleaning up plastic waste"
                "Large whale-shaped robot swimming underwater collecting plastic debris, mechanical whale with solar panels, bright ocean scene, plastic waste being collected into storage compartment",
                
                # Frame 5: "This robot swims around collecting tiny pieces of plastic that could hurt sea animals"
                "Whale robot in action underwater, sea turtles and dolphins swimming safely nearby, plastic particles being filtered out of water, clean safe marine environment being restored",
                
                # Frame 6: "Since this whale robot started working, it's already cleaned up thousands of pounds of plastic"
                "Before and after ocean comparison - left side shows polluted water with plastic, right side shows crystal clear water with happy marine life, whale robot in center showing impact",
                
                # Frame 7: "You could be the next young inventor to help save our planet"
                "Diverse group of young inventors celebrating their success on beach with clean ocean behind them, whale robot visible in distance, inspiring environmental heroes, bright sunny day"
            ]
        
        elif "solar" in title.lower() and "bus" in title.lower():
            return [
                # Frame 2: "Imagine riding to school in a bus that's powered by sunshine"
                "Children looking amazed at bright yellow school bus with solar panels on roof, sunshine beaming down, kids pointing excitedly at the futuristic bus, modern school setting",
                
                # Frame 3: "Students at a school in California worked with engineers to design"
                "Diverse students and adult engineers in bright classroom collaborating on bus designs, tablets and blueprints on tables, excited teamwork, STEM education in action",
                
                # Frame 4: "It has solar panels right on the roof that turn sunlight into electricity"
                "Close-up view of solar panels on bus roof with energy flow visualization, sunshine converting to electricity, bright educational diagram showing energy conversion process",
                
                # Frame 5: "This bus is whisper quiet, creates zero pollution, and even charges tablets"
                "Interior of eco-friendly bus with happy children using tablets, comfortable modern seating, peaceful quiet environment, no exhaust fumes outside, clean technology",
                
                # Frame 6: "Plus, it makes so much extra energy that it can power the whole school's computers"
                "School building with solar bus parked outside, energy flow lines showing power going from bus to school, lit-up computer lab visible through windows, green energy success",
                
                # Frame 7: "These students proved that when kids put their minds to something, they can literally change the world"
                "Group of student inventors standing proudly next to their solar bus, diverse kids wearing engineer hats, bright outdoor setting, inspiring next generation of innovators"
            ]
        
        elif "inventor" in title.lower():
            return [
                # Frame 2: "I want you to meet four of the most amazing young inventors on our planet"
                "Four diverse young inventors from different countries in split-screen portrait style, each in their home environment, bright inspiring global representation",
                
                # Frame 3: "Emma from Canada noticed her grandma had trouble hearing conversations"
                "Emma, a young Canadian girl, observing her grandmother struggling to hear in bright living room, concerned expression, warm family setting, communication challenge",
                
                # Frame 4: "She invented smart glasses that show spoken words as text"
                "Emma's grandmother wearing futuristic smart glasses with text overlay showing spoken words, bright indoor setting, amazed happy expression, technology helping communication",
                
                # Frame 5: "Marcus from Kenya saw families walking miles just to get clean water"
                "Marcus, young Kenyan boy, watching families carry water containers across long distance in bright African landscape, showing the water scarcity problem",
                
                # Frame 6: "He built a portable water filter that's now helping over 500 families"
                "Marcus demonstrating his water filter device in bright African village, clean water flowing out, families celebrating around him, community impact and success",
                
                # Frame 7: "These kids didn't wait for adults to solve these problems. They became the solution"
                "All four young inventors together in bright future world with their inventions working around them, inspiring message, diverse global problem-solvers"
            ]
        
        return [
            f"Young diverse protagonists in bright setting with {title} theme, story introduction scene matching opening narration",
            "Problem identification scene showing challenge being described in current narration, bright educational setting",
            "Innovation in bright action scene showing solution being developed, matching current story beat",
            "Technology demonstration scene showing invention working, aligned with current narration moment",
            "Community impact scene showing positive results, matching success story in narration",
            "Inspiring conclusion with young inventors, bright future setting, matching final call to action"
        ]

    def detect_text_artifacts(self, img: Image.Image, scene_num: int = 0) -> bool:
        """Detect if image contains unwanted text artifacts (skips logo frame)"""
        
        # Skip text detection for logo frame (scene 0)
        if scene_num == 0:
            logger.info("ℹ️ Skipping text detection for logo frame (scene 0)")
            return False
        
        # Convert to grayscale for analysis
        gray = img.convert('L')
        width, height = gray.size
        
        # Focus on top 15% where unwanted text artifacts typically appear
        top_region = gray.crop((0, 0, width, int(height * 0.15)))
        
        # Convert to numpy array for analysis
        pixels = np.array(top_region)
        
        # Look specifically for text-like patterns that shouldn't be in ocean/nature scenes
        # Method 1: Check for solid dark text bands (like "Ocean's a save-/s fre")
        # These appear as horizontal dark strips
        row_means = np.mean(pixels, axis=1)
        dark_rows = np.sum(row_means < 50)  # Very dark rows (text on light background)
        
        # Method 2: Look for rectangular text blocks
        # Text creates consistent patterns across width
        row_std = np.std(pixels, axis=1)
        consistent_rows = np.sum(row_std < 20)  # Rows with little variation (solid text)
        
        # Method 3: Check for repetitive character-like patterns
        # Analyze horizontal transitions for letter spacing
        horizontal_diffs = np.abs(np.diff(pixels, axis=1))
        sharp_transitions = np.sum(horizontal_diffs > 120)  # Very sharp black-to-white transitions
        
        total_pixels = pixels.size
        
        # Very specific detection for actual text artifacts like "Ocean's a save-/s fre"
        # Look for the specific pattern: dark horizontal band with text
        has_text = (
            dark_rows > 8 and consistent_rows > 12  # Must have substantial dark text band
        )
        
        # Additional check: look for typical AI text artifacts pattern
        # Text artifacts usually appear as a solid rectangular block at the top
        if pixels.shape[0] > 20:  # If we have enough rows to analyze
            top_10_rows = pixels[:10, :]  # Check just the very top
            if np.mean(top_10_rows) < 40:  # Very dark region at top
                row_consistency = np.std([np.std(row) for row in top_10_rows])
                if row_consistency < 15:  # Consistent darkness (text-like)
                    has_text = True
                    logger.warning(f"⚠️ Dark text block detected at top: avg={np.mean(top_10_rows):.1f}, consistency={row_consistency:.1f}")
        
        if has_text:
            logger.warning(f"⚠️ Text artifacts detected - Dark rows: {dark_rows}, Consistent: {consistent_rows}, Sharp: {sharp_transitions}")
            return True
        
        return False
    
    def generate_story_synchronized_illustration(self, prompt: str, scene_num: int, story_context: str) -> str:
        """Generate illustration that closely follows the story at this exact moment"""
        
        # Enhanced prompt with specific visual focus and anti-text instructions
        enhanced_prompt = f"Pure illustration: {prompt}, {story_context}, bright vibrant underwater scene, colorful fish and coral, children's book art style, no text anywhere, no words, no letters, no captions, no titles, no labels, visual storytelling only, ocean adventure illustration, cartoon style"
        
        # Try multiple seeds to get watermark-free and text-free images
        attempts = 0
        max_attempts = 15  # More attempts to ensure quality
        
        for seed in range(scene_num + 400, scene_num + 400 + max_attempts):
            attempts += 1
            api_url = "https://image.pollinations.ai/prompt/"
            full_url = f"{api_url}{requests.utils.quote(enhanced_prompt)}?width=1920&height=1080&seed={seed}&enhance=true&nologo=true"
            
            try:
                response = requests.get(full_url, timeout=30)
                
                if response.status_code == 200:
                    # Save the image
                    image_path = self.output_dir / "images" / f"story_sync_scene_{scene_num:02d}_seed_{seed}.png"
                    
                    with open(image_path, 'wb') as f:
                        f.write(response.content)
                    
                    # Check for text artifacts before processing (skip for logo)
                    with Image.open(image_path) as img:
                        if self.detect_text_artifacts(img, scene_num):
                            logger.warning(f"⚠️ Text detected in scene {scene_num} (attempt {attempts}), trying again...")
                            # Delete the bad image
                            image_path.unlink(missing_ok=True)
                            continue
                    
                    # Process to remove any watermarks
                    cleaned_path = self.remove_watermarks(image_path)
                    
                    if cleaned_path:
                        # Final check on cleaned image
                        with Image.open(cleaned_path) as cleaned_img:
                            if self.detect_text_artifacts(cleaned_img, scene_num):
                                logger.warning(f"⚠️ Text still present after cleaning, cropping top region...")
                                # Crop out top 15% and resize
                                width, height = cleaned_img.size
                                cropped = cleaned_img.crop((0, int(height * 0.15), width, height))
                                cropped = cropped.resize((1920, 1080), Image.Resampling.LANCZOS)
                                # Enhance after cropping
                                cropped = self.enhance_cleaned_image(cropped)
                                cropped.save(cleaned_path)
                        
                        logger.info(f"✅ Generated story-synchronized illustration {scene_num}: {cleaned_path}")
                        return str(cleaned_path)
                    
            except Exception as e:
                logger.error(f"Error generating story-synced image {scene_num} with seed {seed}: {e}")
                continue
        
        # If all attempts fail, create a story-specific fallback
        logger.warning(f"⚠️ Using fallback image for scene {scene_num} after {attempts} attempts")
        return self.create_story_fallback_image(scene_num, prompt, story_context)

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
        
        # Common watermark locations - more thorough cleaning
        regions_to_clean = [
            # Bottom right corner (most common)
            (int(width * 0.65), int(height * 0.8), width, height),
            # Bottom left corner
            (0, int(height * 0.8), int(width * 0.35), height),
            # Top right corner
            (int(width * 0.65), 0, width, int(height * 0.2)),
            # Top left corner
            (0, 0, int(width * 0.35), int(height * 0.2)),
            # Bottom center
            (int(width * 0.25), int(height * 0.85), int(width * 0.75), height),
        ]
        
        for x1, y1, x2, y2 in regions_to_clean:
            # Extract the region
            region = img_array[y1:y2, x1:x2]
            
            # Check if this region might contain a watermark
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
        return brightness > 190 and high_contrast > 25

    def inpaint_region(self, img_array: np.ndarray, x1: int, y1: int, x2: int, y2: int) -> np.ndarray:
        """Inpaint a region by blending with surrounding pixels"""
        height, width = img_array.shape[:2]
        
        # Create a copy to work with
        result = img_array.copy()
        
        # Get surrounding regions for blending
        border_size = 15
        
        # More sophisticated inpainting using multiple border regions
        surrounding_colors = []
        
        # Collect colors from all surrounding areas
        for direction in ['top', 'bottom', 'left', 'right']:
            if direction == 'top' and y1 > border_size:
                region = img_array[max(0, y1-border_size):y1, x1:x2]
            elif direction == 'bottom' and y2 < height - border_size:
                region = img_array[y2:min(height, y2+border_size), x1:x2]
            elif direction == 'left' and x1 > border_size:
                region = img_array[y1:y2, max(0, x1-border_size):x1]
            elif direction == 'right' and x2 < width - border_size:
                region = img_array[y1:y2, x2:min(width, x2+border_size)]
            else:
                continue
                
            if region.size > 0:
                surrounding_colors.append(np.mean(region, axis=(0, 1)))
        
        # Blend all surrounding colors
        if surrounding_colors:
            avg_color = np.mean(surrounding_colors, axis=0)
            
            # Fill the watermark region with blended color
            for y in range(y1, y2):
                for x in range(x1, x2):
                    # Add some noise for natural appearance
                    noise = np.random.normal(0, 5, 3)
                    result[y, x] = np.clip(avg_color + noise, 0, 255)
        
        return result

    def enhance_cleaned_image(self, img: Image.Image) -> Image.Image:
        """Enhance the cleaned image for better visual appeal"""
        # Enhance brightness and appeal
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.15)
        
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.2)
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.1)
        
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.1)
        
        return img

    def create_story_fallback_image(self, scene_num: int, prompt: str, story_context: str) -> str:
        """Create story-specific fallback image if generation fails"""
        width, height = 1920, 1080
        
        # Create bright gradient background based on story theme
        if "ocean" in story_context.lower():
            base_color = '#1E88E5'  # Ocean blue
        elif "solar" in story_context.lower():
            base_color = '#FFB300'  # Solar yellow
        elif "inventor" in story_context.lower():
            base_color = '#7B1FA2'  # Innovation purple
        else:
            base_color = '#4FC3F7'  # Default bright blue
        
        img = Image.new('RGB', (width, height), color=base_color)
        draw = ImageDraw.Draw(img)
        
        # Create gradient effect
        for y in range(height):
            ratio = y / height
            # Fade to white at bottom
            r = int(int(base_color[1:3], 16) + (255 - int(base_color[1:3], 16)) * ratio)
            g = int(int(base_color[3:5], 16) + (255 - int(base_color[3:5], 16)) * ratio)
            b = int(int(base_color[5:7], 16) + (255 - int(base_color[5:7], 16)) * ratio)
            
            for x in range(width):
                draw.point((x, y), fill=(r, g, b))
        
        # Add story-specific text
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            font = ImageFont.load_default()
            small_font = font
        
        # Extract key words from prompt for display
        key_words = prompt.split()[:3]
        main_text = " ".join(key_words).title()
        scene_text = f"Scene {scene_num + 1}"
        
        # Main title
        bbox = draw.textbbox((0, 0), main_text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height // 2 - 60
        
        # White text with shadow
        draw.text((x + 3, y + 3), main_text, font=font, fill=(0, 0, 0, 100))
        draw.text((x, y), main_text, font=font, fill='white')
        
        # Scene number
        bbox = draw.textbbox((0, 0), scene_text, font=small_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height // 2 + 40
        
        draw.text((x + 2, y + 2), scene_text, font=small_font, fill=(0, 0, 0, 80))
        draw.text((x, y), scene_text, font=small_font, fill='white')
        
        # Save fallback
        fallback_path = self.output_dir / "images" / f"story_fallback_{scene_num:02d}.png"
        img.save(fallback_path, quality=98)
        
        logger.info(f"✅ Created story-specific fallback for scene {scene_num}")
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
                audio_path = self.output_dir / "audio" / "story_sync_voice.mp3"
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                
                logger.info("✅ Natural ElevenLabs voice generated for story synchronization")
                return str(audio_path)
            else:
                logger.error(f"ElevenLabs API error: {response.status_code}")
                return self.generate_system_voice_natural(script)
                
        except Exception as e:
            logger.error(f"ElevenLabs error: {e}")
            return self.generate_system_voice_natural(script)

    def generate_system_voice_natural(self, script: str) -> str:
        """Generate voice using system TTS"""
        audio_path = self.output_dir / "audio" / "story_sync_system.aiff"
        
        cmd = [
            'say', '-v', 'Samantha', '-r', '155',
            '-o', str(audio_path), script
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Convert to MP3
            mp3_path = self.output_dir / "audio" / "story_sync_system.mp3"
            subprocess.run([
                'ffmpeg', '-i', str(audio_path),
                '-acodec', 'libmp3lame', '-b:a', '192k',
                '-ar', '44100', '-y', str(mp3_path)
            ], check=True)
            
            # Remove AIFF
            audio_path.unlink()
            
            logger.info("✅ Natural system voice generated for story synchronization")
            return str(mp3_path)
            
        except Exception as e:
            logger.error(f"Voice generation failed: {e}")
            raise

    def create_story_synchronized_video(self, title: str, content: str) -> str:
        """Create video with exact user logo and story-synchronized illustrations"""
        logger.info(f"🎬 Creating story-synchronized Junior News Digest video: {title}")
        
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
        
        # Start with user's exact logo
        image_paths = []
        logo_path = self.use_exact_user_logo()
        image_paths.append(logo_path)
        
        # Generate story-synchronized illustrations
        story_prompts = self.create_story_synchronized_prompts(title, script)
        
        for i, prompt in enumerate(story_prompts):
            # Create story context for this scene
            story_context = f"{title} - Scene {i+2}: Following narration timeline"
            image_path = self.generate_story_synchronized_illustration(prompt, i + 1, story_context)
            image_paths.append(image_path)
        
        # Create story-synchronized video
        timestamp = int(time.time())
        output_path = self.output_dir / "final" / f"{title.replace(' ', '_').lower()}_story_sync_{timestamp}.mp4"
        
        # Calculate duration per image
        duration_per_image = total_duration / len(image_paths)
        
        # Create input file for ffmpeg
        input_file = self.output_dir / "story_sync_concat_input.txt"
        with open(input_file, 'w') as f:
            for img_path in image_paths:
                f.write(f"file '{Path(img_path).absolute()}'\n")
                f.write(f"duration {duration_per_image:.3f}\n")
            f.write(f"file '{Path(image_paths[-1]).absolute()}'\n")
        
        # Create story-synchronized video
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
            logger.info(f"✅ Story-synchronized Junior News Digest video created: {output_path}")
            return str(output_path)
        except subprocess.CalledProcessError as e:
            logger.error(f"Video creation failed: {e}")
            raise

def generate_story_synchronized_videos():
    """Generate story-synchronized videos for the app"""
    generator = StorySynchronizedGenerator()
    
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
            video_path = generator.create_story_synchronized_video(story['title'], story['content'])
            
            # Copy to app
            app_name = story['title'].replace(' ', '_').replace(',', '').lower() + '_story.mp4'
            app_path = Path("app_development/kids_news_app_fixed/assets/videos") / app_name
            
            subprocess.run(['cp', video_path, str(app_path)])
            print(f"✅ Story-synchronized video with exact user logo copied to app: {app_path}")
            
        except Exception as e:
            print(f"❌ Failed to generate story-synchronized video for {story['title']}: {e}")

if __name__ == "__main__":
    generate_story_synchronized_videos()
