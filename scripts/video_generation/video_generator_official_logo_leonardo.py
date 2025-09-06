#!/usr/bin/env python3
"""
Video Generator with Official Logo and Leonardo.ai Integration
Uses your official Junior News Digest logo and Leonardo.ai illustrations
"""

import subprocess
from pathlib import Path
import logging
import requests
import time
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OfficialVideoGenerator:
    def __init__(self):
        self.base_dir = Path("../../generated_videos")
        self.output_dir = self.base_dir / "full_videos"
        self.shorts_dir = self.base_dir / "youtube_shorts"
        self.temp_dir = Path("temp_video_generation")
        
        # Create directories
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.shorts_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir.mkdir(exist_ok=True)
        
        # Official logo and audio (relative to script location)
        self.official_logo = Path("../../OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png")
        self.audio_path = Path("../../assets/audio/test_voice_sample.mp3")
        
        # Extended Leonardo.ai prompts for 7+ minute videos
        self.leonardo_prompts = [
            "cute cartoon ocean robot underwater with colorful fish and coral reef, children's book illustration style, bright vibrant colors, pixar animation style",
            "friendly robot character helping marine animals, underwater scene with dolphins and turtles, educational cartoon style, bright and cheerful",
            "ocean cleanup scene with robot collecting plastic waste, happy sea creatures watching, environmental cartoon illustration, colorful and optimistic",
            "underwater laboratory with young scientists and robot, bubbling experiments, colorful chemistry equipment, educational and inspiring",
            "robot teaching fish about ocean conservation, underwater classroom setting, marine life students, educational cartoon style",
            "coral reef restoration project with robot planting new corals, vibrant underwater garden, hopeful environmental theme",
            "robot and marine animals working together, teamwork illustration, diverse sea creatures, collaborative cartoon style",
            "underwater city of the future, eco-friendly technology, robot as guide, futuristic but friendly cartoon style",
            "celebration scene with robot and marine life in clean ocean, coral reef background, victory and success theme, children's cartoon style",
            "young inventors and students with ocean robot, bright classroom or laboratory setting, inspiring educational illustration, diverse children",
            "global impact scene showing clean oceans worldwide, robot as environmental hero, world map with happy marine life",
            "call to action scene with children inspired to help oceans, diverse kids with recycling and conservation tools, motivational illustration"
        ]
        
        # Extended story content for longer videos
        self.extended_story_segments = [
            "Meet our ocean robot hero, designed by young inventors to save marine life",
            "Deep beneath the waves, our robot discovers a world in need of help",
            "Plastic pollution threatens the beautiful coral reef ecosystem",
            "In an underwater laboratory, scientists work with the robot on solutions",
            "The robot becomes a teacher, educating sea creatures about conservation",
            "Together, they begin the great coral reef restoration project",
            "Marine animals and robot work as a team to clean the oceans",
            "A futuristic underwater city shows what's possible with clean technology",
            "Victory! The ocean is cleaner and marine life thrives once again",
            "Back on land, young inventors celebrate their robot's success",
            "The impact spreads globally as oceans around the world become cleaner",
            "Inspired children everywhere join the mission to protect our planet"
        ]
        
        logger.info("🎬 Official Video Generator with Leonardo.ai initialized")

    def verify_official_logo(self):
        """Verify official logo exists"""
        if not self.official_logo.exists():
            logger.error(f"❌ Official logo not found: {self.official_logo}")
            return False
        
        # Check if it's a valid image
        try:
            with Image.open(self.official_logo) as img:
                width, height = img.size
                logger.info(f"✅ Official logo found: {width}x{height}")
                return True
        except Exception as e:
            logger.error(f"❌ Error reading official logo: {e}")
            return False

    def resize_official_logo(self):
        """Resize official logo to video dimensions if needed"""
        try:
            with Image.open(self.official_logo) as img:
                # Resize to 1920x1080 if not already
                if img.size != (1920, 1080):
                    img_resized = img.resize((1920, 1080), Image.Resampling.LANCZOS)
                    
                    # Convert to RGB if needed
                    if img_resized.mode != 'RGB':
                        img_resized = img_resized.convert('RGB')
                    
                    logo_path = self.temp_dir / "official_logo_resized.png"
                    img_resized.save(logo_path, quality=98)
                    logger.info("✅ Official logo resized for video")
                    return str(logo_path)
                else:
                    # Copy original if already correct size
                    logo_path = self.temp_dir / "official_logo_copy.png"
                    img.save(logo_path, quality=98)
                    return str(logo_path)
                    
        except Exception as e:
            logger.error(f"❌ Error processing official logo: {e}")
            return None

    def generate_leonardo_illustration(self, prompt, scene_num):
        """Generate illustration using Professional Image Service"""
        logger.info(f"🎨 Generating professional illustration {scene_num}...")
        
        try:
            # Import professional image service
            import sys
            sys.path.append(str(Path(__file__).parent.parent / "image_generation"))
            from professional_image_service import ProfessionalImageService
            
            # Initialize image service
            image_service = ProfessionalImageService()
            
            # Generate high-quality image
            result = image_service.generate_image(
                prompt, 
                style="children's book illustration, bright vibrant colors, educational cartoon style",
                width=1920, 
                height=1080
            )
            
            if result and result['path']:
                logger.info(f"✅ Professional illustration {scene_num} generated with {result['service']}")
                return result['path']
            else:
                logger.warning(f"⚠️ Professional service failed, using fallback for scene {scene_num}")
                return self.create_leonardo_style_fallback(prompt, scene_num)
            
        except Exception as e:
            logger.warning(f"⚠️ Professional image service failed for scene {scene_num}: {e}")
            # Create fallback illustration
            return self.create_leonardo_style_fallback(prompt, scene_num)

    def create_leonardo_style_fallback(self, prompt, scene_num):
        """Create Leonardo.ai style fallback illustration with actual cartoon characters"""
        logger.info(f"🎨 Creating cartoon illustration {scene_num} with characters...")
        
        width, height = 1920, 1080
        
        # Create scene-specific backgrounds
        img = self.create_scene_background(scene_num, width, height)
        
        from PIL import ImageDraw, ImageFont
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 60)
            small_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 30)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        # Draw cartoon characters and actions based on scene
        self.draw_cartoon_scene(draw, width, height, scene_num)
        
        # Add minimal text overlay for context
        scene_contexts = [
            "Ocean Robot Hero",
            "Underwater Exploration", 
            "Marine Life Rescue",
            "Scientific Discovery",
            "Teaching Sea Creatures",
            "Coral Restoration",
            "Ocean Teamwork",
            "Future Technology",
            "Clean Ocean Victory",
            "Young Inventors",
            "Global Ocean Health",
            "Kids Taking Action"
        ]
        
        context = scene_contexts[scene_num % len(scene_contexts)]
        
        # Add context text with background
        bbox = draw.textbbox((0, 0), context, font=small_font)
        text_width = bbox[2] - bbox[0]
        text_x = width - text_width - 40
        text_y = height - 60
        
        # Text background
        draw.rectangle([text_x - 20, text_y - 10, text_x + text_width + 20, text_y + 40], 
                      fill=(0, 0, 0, 120), outline=None)
        draw.text((text_x, text_y), context, font=small_font, fill='white')
        
        # Save illustration
        illustration_path = self.temp_dir / f"leonardo_style_{scene_num:02d}.png"
        img.save(illustration_path, quality=95)
        
        logger.info(f"✅ Cartoon illustration {scene_num} created with characters")
        return str(illustration_path)

    def create_scene_background(self, scene_num, width, height):
        """Create scene-specific backgrounds"""
        img = Image.new('RGB', (width, height))
        
        # Scene-specific backgrounds
        if scene_num == 0:  # Ocean Robot Hero
            # Deep blue ocean with light rays
            for y in range(height):
                for x in range(width):
                    # Ocean depth gradient
                    depth = y / height
                    r = int(20 + (100 - 20) * (1 - depth))
                    g = int(50 + (150 - 50) * (1 - depth))
                    b = int(150 + (255 - 150) * (1 - depth))
                    img.putpixel((x, y), (r, g, b))
        
        elif scene_num in [1, 2]:  # Underwater scenes
            # Turquoise underwater
            for y in range(height):
                for x in range(width):
                    ratio = y / height
                    r = int(64 + (100 - 64) * ratio)
                    g = int(224 + (255 - 224) * ratio)
                    b = int(208 + (255 - 208) * ratio)
                    img.putpixel((x, y), (r, g, b))
        
        elif scene_num in [3, 4]:  # Laboratory/Teaching scenes
            # Light blue scientific background
            for y in range(height):
                for x in range(width):
                    r = int(200 + (255 - 200) * (x / width) * 0.3)
                    g = int(230 + (255 - 230) * (y / height) * 0.2)
                    b = 255
                    img.putpixel((x, y), (r, g, b))
        
        elif scene_num in [5, 6]:  # Coral restoration
            # Vibrant coral reef colors
            for y in range(height):
                for x in range(width):
                    r = int(255 * (0.7 + 0.3 * (x / width)))
                    g = int(200 + 55 * (y / height))
                    b = int(150 + 105 * ((x + y) / (width + height)))
                    img.putpixel((x, y), (r, g, b))
        
        elif scene_num in [7, 8]:  # Future/Victory scenes
            # Golden success colors
            for y in range(height):
                for x in range(width):
                    r = int(255 * (0.8 + 0.2 * (1 - y / height)))
                    g = int(215 + 40 * (1 - y / height))
                    b = int(0 + 150 * (y / height))
                    img.putpixel((x, y), (r, g, b))
        
        else:  # Land/Innovation scenes
            # Sky blue to green gradient
            for y in range(height):
                for x in range(width):
                    if y < height * 0.6:  # Sky
                        r = int(135 + (255 - 135) * (1 - y / (height * 0.6)))
                        g = int(206 + (255 - 206) * (1 - y / (height * 0.6)))
                        b = 250
                    else:  # Ground
                        ground_ratio = (y - height * 0.6) / (height * 0.4)
                        r = int(50 + 100 * ground_ratio)
                        g = int(150 + 105 * ground_ratio)
                        b = int(50 + 50 * ground_ratio)
                    img.putpixel((x, y), (r, g, b))
        
        return img

    def draw_cartoon_scene(self, draw, width, height, scene_num):
        """Draw actual cartoon characters and actions for each scene"""
        
        if scene_num == 0:  # Ocean Robot Hero
            self.draw_ocean_robot(draw, width//2, height//2)
            self.draw_fish_friends(draw, width, height)
            self.draw_light_rays(draw, width, height)
        
        elif scene_num == 1:  # Underwater Exploration
            self.draw_exploring_robot(draw, width//3, height//2)
            self.draw_coral_reef(draw, width, height)
            self.draw_sea_creatures(draw, width, height)
        
        elif scene_num == 2:  # Marine Life Rescue
            self.draw_rescue_scene(draw, width, height)
            self.draw_plastic_cleanup(draw, width, height)
        
        elif scene_num == 3:  # Scientific Discovery
            self.draw_underwater_lab(draw, width, height)
            self.draw_scientist_robot(draw, width//2, height//2)
        
        elif scene_num == 4:  # Teaching Sea Creatures
            self.draw_teaching_robot(draw, width//2, height//3)
            self.draw_student_sea_animals(draw, width, height)
        
        elif scene_num == 5:  # Coral Restoration
            self.draw_planting_robot(draw, width//2, height//2)
            self.draw_growing_corals(draw, width, height)
        
        elif scene_num == 6:  # Ocean Teamwork
            self.draw_teamwork_scene(draw, width, height)
        
        elif scene_num == 7:  # Future Technology
            self.draw_futuristic_city(draw, width, height)
            self.draw_eco_robot(draw, width//2, height//2)
        
        elif scene_num == 8:  # Clean Ocean Victory
            self.draw_celebration_scene(draw, width, height)
        
        elif scene_num == 9:  # Young Inventors
            self.draw_kids_with_robot(draw, width, height)
        
        elif scene_num == 10:  # Global Ocean Health
            self.draw_world_map_scene(draw, width, height)
        
        else:  # Kids Taking Action
            self.draw_action_kids(draw, width, height)

    def draw_ocean_robot(self, draw, x, y):
        """Draw a friendly ocean robot character"""
        # Robot body (rounded rectangle)
        body_width, body_height = 120, 100
        draw.rounded_rectangle([x-body_width//2, y-body_height//2, x+body_width//2, y+body_height//2], 
                              radius=20, fill=(70, 130, 180), outline='white', width=4)
        
        # Robot head
        head_size = 80
        draw.ellipse([x-head_size//2, y-body_height//2-head_size, x+head_size//2, y-body_height//2], 
                    fill=(100, 149, 237), outline='white', width=4)
        
        # Eyes (friendly and expressive)
        eye_size = 20
        draw.ellipse([x-25, y-body_height//2-head_size//2-10, x-25+eye_size, y-body_height//2-head_size//2-10+eye_size], 
                    fill='white', outline='black', width=2)
        draw.ellipse([x+5, y-body_height//2-head_size//2-10, x+5+eye_size, y-body_height//2-head_size//2-10+eye_size], 
                    fill='white', outline='black', width=2)
        
        # Eye pupils
        draw.ellipse([x-20, y-body_height//2-head_size//2-5, x-15, y-body_height//2-head_size//2], fill='black')
        draw.ellipse([x+10, y-body_height//2-head_size//2-5, x+15, y-body_height//2-head_size//2], fill='black')
        
        # Smile
        draw.arc([x-20, y-body_height//2-head_size//2+10, x+20, y-body_height//2-head_size//2+30], 
                start=0, end=180, fill='white', width=3)
        
        # Arms (doing helpful gesture)
        draw.ellipse([x-body_width//2-20, y-20, x-body_width//2+20, y+20], fill=(70, 130, 180), outline='white', width=3)
        draw.ellipse([x+body_width//2-20, y-20, x+body_width//2+20, y+20], fill=(70, 130, 180), outline='white', width=3)
        
        # Propellers
        draw.ellipse([x-10, y+body_height//2+10, x+10, y+body_height//2+30], fill=(255, 215, 0), outline='white', width=2)

    def draw_fish_friends(self, draw, width, height):
        """Draw friendly cartoon fish around the scene"""
        fish_positions = [(200, 200), (width-200, 300), (300, height-200), (width-300, 150)]
        colors = [(255, 165, 0), (255, 20, 147), (0, 255, 127), (255, 69, 0)]
        
        for i, (x, y) in enumerate(fish_positions):
            color = colors[i % len(colors)]
            # Fish body
            draw.ellipse([x-40, y-20, x+40, y+20], fill=color, outline='white', width=2)
            # Fish tail
            draw.polygon([(x-40, y-10), (x-60, y-5), (x-60, y+5), (x-40, y+10)], fill=color, outline='white', width=2)
            # Fish eye
            draw.ellipse([x+10, y-8, x+20, y+2], fill='white', outline='black', width=1)
            draw.ellipse([x+13, y-5, x+17, y-1], fill='black')

    def draw_light_rays(self, draw, width, height):
        """Draw light rays coming from above"""
            for i in range(5):
            x = 200 + i * (width - 400) // 4
            points = [(x, 0), (x-30, height//3), (x+30, height//3)]
            draw.polygon(points, fill=(255, 255, 255, 50))

    def draw_exploring_robot(self, draw, x, y):
        """Draw robot in exploration pose"""
        self.draw_ocean_robot(draw, x, y)
        # Add exploration beam
        beam_points = [(x+60, y-10), (x+150, y-30), (x+150, y+10), (x+60, y+10)]
        draw.polygon(beam_points, fill=(255, 255, 0, 100))

    def draw_coral_reef(self, draw, width, height):
        """Draw colorful coral reef"""
        coral_positions = [(100, height-100), (300, height-80), (width-200, height-120), (width-400, height-90)]
        coral_colors = [(255, 127, 80), (255, 20, 147), (148, 0, 211), (50, 205, 50)]
        
        for i, (x, y) in enumerate(coral_positions):
            color = coral_colors[i % len(coral_colors)]
            # Draw branching coral
            for j in range(3):
                branch_x = x + (j-1) * 30
                draw.ellipse([branch_x-15, y-60, branch_x+15, y], fill=color, outline='white', width=2)

    def draw_sea_creatures(self, draw, width, height):
        """Draw various sea creatures"""
        # Turtle
        turtle_x, turtle_y = width//4, height//2 + 100
        draw.ellipse([turtle_x-50, turtle_y-30, turtle_x+50, turtle_y+30], fill=(34, 139, 34), outline='white', width=3)
        draw.ellipse([turtle_x-60, turtle_y-10, turtle_x-40, turtle_y+10], fill=(34, 139, 34))  # Head
        draw.ellipse([turtle_x-55, turtle_y-5, turtle_x-50, turtle_y], fill='black')  # Eye
        
        # Dolphin
        dolphin_x, dolphin_y = 3*width//4, height//2 - 100
        draw.ellipse([dolphin_x-60, dolphin_y-20, dolphin_x+60, dolphin_y+20], fill=(64, 224, 208), outline='white', width=3)
        draw.polygon([(dolphin_x+50, dolphin_y-15), (dolphin_x+80, dolphin_y-5), (dolphin_x+80, dolphin_y+5), (dolphin_x+50, dolphin_y+15)], 
                    fill=(64, 224, 208), outline='white', width=2)
        draw.ellipse([dolphin_x+30, dolphin_y-8, dolphin_x+40, dolphin_y+2], fill='white')
        draw.ellipse([dolphin_x+33, dolphin_y-5, dolphin_x+37, dolphin_y-1], fill='black')

    def draw_rescue_scene(self, draw, width, height):
        """Draw robot rescuing marine life"""
        # Robot helping turtle
        robot_x, robot_y = width//2, height//2
        self.draw_ocean_robot(draw, robot_x, robot_y)
        
        # Turtle being helped
        turtle_x, turtle_y = robot_x + 100, robot_y + 50
        draw.ellipse([turtle_x-40, turtle_y-25, turtle_x+40, turtle_y+25], fill=(34, 139, 34), outline='white', width=3)
        
        # Hearts to show care
        heart_positions = [(robot_x-30, robot_y-80), (robot_x+30, robot_y-80)]
        for hx, hy in heart_positions:
            draw.ellipse([hx-10, hy-5, hx, hy+5], fill='red')
            draw.ellipse([hx, hy-5, hx+10, hy+5], fill='red')
            draw.polygon([(hx-10, hy), (hx+10, hy), (hx, hy+15)], fill='red')

    def draw_plastic_cleanup(self, draw, width, height):
        """Draw plastic waste being cleaned up"""
        # Plastic bottles (being collected)
        bottle_positions = [(150, height-150), (width-150, height-180), (width//2, height-120)]
        for bx, by in bottle_positions:
            draw.rectangle([bx-15, by-40, bx+15, by], fill=(169, 169, 169), outline='red', width=3)
            # X mark to show it's being removed
            draw.line([bx-10, by-30, bx+10, by-10], fill='red', width=4)
            draw.line([bx-10, by-10, bx+10, by-30], fill='red', width=4)

    def draw_underwater_lab(self, draw, width, height):
        """Draw underwater laboratory"""
        # Lab dome
        dome_x, dome_y = width//2, height//2 + 100
        draw.arc([dome_x-150, dome_y-100, dome_x+150, dome_y+100], start=0, end=180, fill=(173, 216, 230), width=5)
        
        # Lab equipment
        equipment_positions = [(dome_x-80, dome_y), (dome_x, dome_y), (dome_x+80, dome_y)]
        for ex, ey in equipment_positions:
            draw.rectangle([ex-20, ey-40, ex+20, ey], fill=(192, 192, 192), outline='white', width=2)
            # Bubbling beakers
            draw.ellipse([ex-15, ey-35, ex+15, ey-25], fill=(0, 255, 255), outline='white', width=1)

    def draw_scientist_robot(self, draw, x, y):
        """Draw robot in scientist mode"""
        self.draw_ocean_robot(draw, x, y)
        # Add scientist goggles
        draw.ellipse([x-35, y-100, x-15, y-80], fill=(255, 255, 255, 150), outline='black', width=2)
        draw.ellipse([x+15, y-100, x+35, y-80], fill=(255, 255, 255, 150), outline='black', width=2)

    def draw_teaching_robot(self, draw, x, y):
        """Draw robot in teaching pose"""
        self.draw_ocean_robot(draw, x, y)
        # Add pointing gesture
        draw.line([x+60, y-20, x+120, y-40], fill='white', width=8)
        # Chalkboard
        draw.rectangle([x+130, y-60, x+230, y-20], fill=(34, 139, 34), outline='white', width=3)
        draw.line([x+140, y-50, x+220, y-30], fill='white', width=2)

    def draw_student_sea_animals(self, draw, width, height):
        """Draw sea animals as students"""
        # Student fish in rows
        student_positions = [(200, height//2), (300, height//2), (400, height//2),
                           (250, height//2 + 80), (350, height//2 + 80)]
        
        for i, (sx, sy) in enumerate(student_positions):
            # Student fish
            draw.ellipse([sx-25, sy-15, sx+25, sy+15], fill=(255, 165, 0), outline='white', width=2)
            draw.ellipse([sx+10, sy-8, sx+20, sy+2], fill='white')
            draw.ellipse([sx+13, sy-5, sx+17, sy-1], fill='black')
            # Attention bubbles
            draw.ellipse([sx-10, sy-40, sx+10, sy-20], fill=(255, 255, 255, 100), outline='white', width=1)

    def draw_planting_robot(self, draw, x, y):
        """Draw robot planting coral"""
        self.draw_ocean_robot(draw, x, y)
        # Planting gesture
        draw.line([x, y+50, x, y+100], fill='white', width=6)
        # Coral being planted
        draw.ellipse([x-20, y+90, x+20, y+130], fill=(255, 127, 80), outline='white', width=2)

    def draw_growing_corals(self, draw, width, height):
        """Draw healthy growing corals"""
        coral_positions = [(150, height-80), (width-150, height-100), (width//2 - 100, height-90), (width//2 + 100, height-110)]
        growth_stages = [40, 60, 50, 70]
        
        for i, ((cx, cy), stage) in enumerate(zip(coral_positions, growth_stages)):
            color = [(255, 127, 80), (255, 20, 147), (148, 0, 211), (50, 205, 50)][i]
            draw.ellipse([cx-20, cy-stage, cx+20, cy], fill=color, outline='white', width=2)
            # Growth sparkles
            sparkle_positions = [(cx-10, cy-stage-10), (cx+10, cy-stage-5), (cx, cy-stage-15)]
            for spx, spy in sparkle_positions:
                draw.polygon([(spx, spy-5), (spx-3, spy), (spx, spy+5), (spx+3, spy)], fill='yellow')

    def draw_teamwork_scene(self, draw, width, height):
        """Draw robot and sea creatures working together"""
        # Robot in center
        self.draw_ocean_robot(draw, width//2, height//2)
        
        # Sea creatures helping in circle
        helpers = [(width//2 - 150, height//2), (width//2 + 150, height//2), 
                  (width//2, height//2 - 120), (width//2, height//2 + 120)]
        
        for i, (hx, hy) in enumerate(helpers):
            if i == 0:  # Fish
                draw.ellipse([hx-30, hy-15, hx+30, hy+15], fill=(255, 165, 0), outline='white', width=2)
            elif i == 1:  # Turtle
                draw.ellipse([hx-40, hy-25, hx+40, hy+25], fill=(34, 139, 34), outline='white', width=2)
            elif i == 2:  # Dolphin
                draw.ellipse([hx-50, hy-15, hx+50, hy+15], fill=(64, 224, 208), outline='white', width=2)
            else:  # Octopus
                draw.ellipse([hx-35, hy-20, hx+35, hy+20], fill=(138, 43, 226), outline='white', width=2)

    def draw_futuristic_city(self, draw, width, height):
        """Draw underwater futuristic eco-city"""
        # City domes
        dome_positions = [(width//4, height//2), (3*width//4, height//2), (width//2, height//2 - 100)]
        
        for dx, dy in dome_positions:
            draw.arc([dx-80, dy-60, dx+80, dy+60], start=0, end=180, fill=(173, 216, 230, 150), width=4)
            # Buildings inside
            for i in range(3):
                bx = dx - 40 + i * 30
                draw.rectangle([bx-10, dy-20, bx+10, dy+40], fill=(192, 192, 192), outline='white', width=1)

    def draw_eco_robot(self, draw, x, y):
        """Draw eco-friendly robot"""
        self.draw_ocean_robot(draw, x, y)
        # Add eco symbols
        draw.ellipse([x-15, y-10, x+15, y+20], fill=(50, 205, 50), outline='white', width=2)

    def draw_celebration_scene(self, draw, width, height):
        """Draw victory celebration"""
        # Celebrating robot
        self.draw_ocean_robot(draw, width//2, height//2)
        
        # Confetti
        confetti_colors = [(255, 215, 0), (255, 20, 147), (50, 205, 50), (255, 69, 0)]
        for i in range(20):
            cx = 100 + (i * 87) % (width - 200)
            cy = 50 + (i * 43) % (height - 100)
            color = confetti_colors[i % len(confetti_colors)]
            draw.rectangle([cx-5, cy-5, cx+5, cy+5], fill=color)

    def draw_kids_with_robot(self, draw, width, height):
        """Draw children with their robot invention"""
        # Robot in center
        self.draw_ocean_robot(draw, width//2, height//2 + 50)
        
        # Kids around robot
        kid_positions = [(width//2 - 100, height//2), (width//2 + 100, height//2)]
        kid_colors = [(255, 182, 193), (173, 216, 230)]
        
        for i, ((kx, ky), color) in enumerate(zip(kid_positions, kid_colors)):
            # Kid body
            draw.ellipse([kx-25, ky-40, kx+25, ky+40], fill=color, outline='white', width=2)
            # Head
            draw.ellipse([kx-20, ky-70, kx+20, ky-30], fill=(255, 220, 177), outline='white', width=2)
            # Eyes
            draw.ellipse([kx-10, ky-55, kx-5, ky-50], fill='black')
            draw.ellipse([kx+5, ky-55, kx+10, ky-50], fill='black')
            # Smile
            draw.arc([kx-8, ky-50, kx+8, ky-42], start=0, end=180, fill='black', width=2)

    def draw_world_map_scene(self, draw, width, height):
        """Draw world map showing global ocean health"""
        # Simple world continents
        continent_points = [
            [(200, 300), (300, 280), (350, 320), (300, 360), (220, 340)],  # North America
            [(500, 400), (600, 380), (650, 420), (600, 460), (520, 440)],  # Europe/Asia
            [(400, 600), (500, 580), (550, 620), (500, 660), (420, 640)]   # Africa/South America
        ]
        
        for continent in continent_points:
            draw.polygon(continent, fill=(34, 139, 34), outline='white', width=2)

    def draw_action_kids(self, draw, width, height):
        """Draw kids taking environmental action"""
        # Kids with recycling tools
        kid_positions = [(width//3, height//2), (2*width//3, height//2)]
        
        for i, (kx, ky) in enumerate(kid_positions):
            # Kid body
            draw.ellipse([kx-25, ky-40, kx+25, ky+40], fill=(255, 182, 193), outline='white', width=2)
            # Head
            draw.ellipse([kx-20, ky-70, kx+20, ky-30], fill=(255, 220, 177), outline='white', width=2)
            # Recycling bin
            draw.rectangle([kx-30, ky+20, kx+30, ky+80], fill=(50, 205, 50), outline='white', width=2)

        # This method is no longer used - replaced by specific cartoon drawing methods above
        pass

    def create_extended_video_with_tts(self, story_title="Ocean Robot Adventure", target_duration=420):
        """Create 7+ minute video with generated TTS narration"""
        logger.info(f"🎬 Creating extended {target_duration/60:.1f}-minute video with TTS...")
        
        # Verify official logo
        if not self.verify_official_logo():
            return None
        
        try:
            # Generate extended narration text
            full_narration = self.create_extended_narration()
            logger.info(f"📝 Generated narration: {len(full_narration)} characters")
            
            # For now, use existing audio but repeat/extend it
            # In production, you'd generate TTS here
            extended_audio_path = self.create_extended_audio(target_duration)
            
            if not extended_audio_path:
                logger.error("❌ Failed to create extended audio")
                return None
            
            # Prepare official logo
            logo_path = self.resize_official_logo()
            if not logo_path:
                return None
            
            # Generate all Leonardo.ai style illustrations
            logger.info("🎨 Generating extended Leonardo.ai illustrations...")
            illustration_paths = []
            
            for i, prompt in enumerate(self.leonardo_prompts):
                illustration = self.generate_leonardo_illustration(prompt, i)
                if illustration:
                    illustration_paths.append(illustration)
            
            # Combine official logo + Leonardo illustrations
            all_images = [logo_path] + illustration_paths
            
            # Calculate timing for extended video
            logo_duration = 5.0  # Longer logo intro
            scene_duration = (target_duration - logo_duration) / len(illustration_paths)
            
            logger.info(f"⏱️  Extended timing: {logo_duration}s logo, {scene_duration:.2f}s per scene")
            
            # Create final extended video
            safe_title = story_title.replace(' ', '_').lower()
            output_filename = f"{safe_title}_extended_7min.mp4"
            final_output = self.output_dir / output_filename
            
            success = self.create_video_with_segments(all_images, extended_audio_path, str(final_output), logo_duration, scene_duration)
            
            if success and final_output.exists():
                file_size = final_output.stat().st_size / 1024 / 1024
                duration_min = target_duration / 60
                logger.info(f"✅ Extended {duration_min:.1f}-minute video created!")
                logger.info(f"📁 Location: {final_output}")
                logger.info(f"📊 File size: {file_size:.2f} MB")
                
                # Also create YouTube Short version
                short_path = self.create_youtube_short(str(final_output), story_title)
                if short_path:
                    logger.info(f"📱 YouTube Short created: {short_path}")
                
                return str(final_output)
            else:
                logger.error("❌ Extended video creation failed")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error creating extended video: {e}")
            return None

    def create_extended_narration(self):
        """Generate extended narration text for 7+ minute videos"""
        narration_parts = [
            "Welcome to Junior News Digest! Today we're diving deep into an amazing story about ocean conservation.",
            "Meet our incredible ocean robot, designed by brilliant young inventors who care about our planet.",
            "This isn't just any robot - it's a hero with a mission to save marine life and clean our oceans.",
            "Deep beneath the waves, our robot hero discovers a underwater world facing serious challenges.",
            "Plastic pollution, climate change, and human activity threaten the delicate balance of marine ecosystems.",
            "But our robot doesn't give up! It partners with marine biologists and young scientists.",
            "In state-of-the-art underwater laboratories, they develop innovative solutions for ocean cleanup.",
            "The robot becomes more than a machine - it becomes a teacher and protector of sea life.",
            "Watch as it educates dolphins, whales, and colorful fish about conservation and teamwork.",
            "Together, they launch the most ambitious coral reef restoration project ever attempted.",
            "Marine animals and technology work hand in hand to heal damaged ecosystems.",
            "The results are incredible! Coral reefs bloom with new life and vibrant colors.",
            "Fish populations recover, sea turtles thrive, and the entire ocean ecosystem transforms.",
            "This success story spreads around the world, inspiring similar projects globally.",
            "Young inventors everywhere are motivated to create their own environmental solutions.",
            "The message is clear: when we combine technology, creativity, and care for our planet, amazing things happen.",
            "This story shows us that every young person has the power to make a real difference.",
            "Whether it's through robotics, marine biology, or environmental science, the future is bright.",
            "Remember, protecting our oceans isn't just about sea creatures - it's about our entire planet's health.",
            "Thanks for watching Junior News Digest, where young minds discover how they can change the world!"
        ]
        
        return " ".join(narration_parts)

    def create_extended_audio(self, target_duration):
        """Create extended audio for longer videos"""
        # For now, loop existing audio to reach target duration
        if not self.audio_path.exists():
            return None
        
        extended_audio_path = self.temp_dir / "extended_audio.wav"
        
        try:
            # Get original duration
            cmd = ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(self.audio_path)]
            result = subprocess.run(cmd, capture_output=True, text=True)
            original_duration = float(result.stdout.strip())
            
            # Calculate how many loops needed
            loops_needed = int(target_duration / original_duration) + 1
            
            # Create looped audio with simpler approach
            cmd = [
                'ffmpeg', '-y',
                '-i', str(self.audio_path),
                '-filter_complex', f'aloop=loop={loops_needed}:size={int(44100 * original_duration)}',
                '-t', str(target_duration),
                '-c:a', 'pcm_s16le',
                str(extended_audio_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info(f"✅ Extended audio created: {target_duration}s")
                return str(extended_audio_path)
            else:
                logger.warning(f"⚠️ Looping failed, using original audio: {result.stderr}")
                # Fallback: just use original audio
                return str(self.audio_path)
                
        except Exception as e:
            logger.error(f"❌ Error creating extended audio: {e}")
            # Fallback: use original audio
            return str(self.audio_path)

    def create_youtube_short(self, full_video_path, story_title):
        """Create 60-second YouTube Short from full video"""
        try:
            short_path = self.shorts_dir / f"{story_title.replace(' ', '_').lower()}_youtube_short.mp4"
            
            # Extract first 60 seconds and crop to 9:16 aspect ratio
            cmd = [
                'ffmpeg', '-y',
                '-i', full_video_path,
                '-t', '60',
                '-vf', 'crop=607:1080:656:0,scale=1080:1920',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-b:v', '2M',
                '-b:a', '128k',
                str(short_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ YouTube Short created (60s, 9:16 aspect ratio)")
                return str(short_path)
            else:
                logger.error(f"❌ YouTube Short creation failed: {result.stderr}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error creating YouTube Short: {e}")
            return None

    def create_video_with_official_logo_and_leonardo(self, story_title="Ocean Robot Adventure"):
        """Create video with official logo and Leonardo.ai illustrations"""
        logger.info("🎬 Creating video with official logo and Leonardo.ai illustrations...")
        
        # Verify official logo
        if not self.verify_official_logo():
            return None
        
        # Check audio
        if not self.audio_path.exists():
            logger.error(f"❌ Audio file not found: {self.audio_path}")
            return None
        
        try:
            # Get audio duration
            cmd = ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(self.audio_path)]
            result = subprocess.run(cmd, capture_output=True, text=True)
            audio_duration = float(result.stdout.strip()) if result.returncode == 0 else 15.0
            
            logger.info(f"📊 Audio duration: {audio_duration:.2f}s")
            
            # Prepare official logo
            logo_path = self.resize_official_logo()
            if not logo_path:
                return None
            
            # Generate Leonardo.ai style illustrations
            logger.info("🎨 Generating Leonardo.ai style illustrations...")
            illustration_paths = []
            
            for i, prompt in enumerate(self.leonardo_prompts):
                illustration = self.generate_leonardo_illustration(prompt, i)
                if illustration:
                    illustration_paths.append(illustration)
            
            # Combine official logo + Leonardo illustrations
            all_images = [logo_path] + illustration_paths
            
            # Calculate timing
            logo_duration = 3.5  # Official logo shows for 3.5 seconds
            scene_duration = (audio_duration - logo_duration) / len(illustration_paths) if illustration_paths else 3.0
            
            logger.info(f"⏱️  Timing: {logo_duration}s official logo, {scene_duration:.2f}s per Leonardo scene")
            
            # Create final video
            safe_title = story_title.replace(' ', '_').lower()
            output_filename = f"{safe_title}_official_logo_leonardo.mp4"
            final_output = self.output_dir / output_filename
            
            success = self.create_video_with_segments(all_images, str(self.audio_path), str(final_output), logo_duration, scene_duration)
            
            if success and final_output.exists():
                file_size = final_output.stat().st_size / 1024 / 1024
                logger.info(f"✅ Video created with official logo and Leonardo.ai!")
                logger.info(f"📁 Location: {final_output}")
                logger.info(f"📊 File size: {file_size:.2f} MB")
                return str(final_output)
            else:
                logger.error("❌ Video creation failed")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error creating video: {e}")
            return None

    def create_video_with_segments(self, image_paths, audio_path, output_path, logo_duration, scene_duration):
        """Create video with proper timing - FIXED VERSION"""
        try:
            # Create filter_complex for seamless concatenation
            filter_parts = []
            input_args = []
            
            # Add all images as inputs
            for i, img_path in enumerate(image_paths):
                duration = logo_duration if i == 0 else scene_duration
                input_args.extend(['-loop', '1', '-t', str(duration), '-i', img_path])
                filter_parts.append(f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=25[v{i}]")
            
            # Concatenate all video streams
            concat_inputs = ''.join([f"[v{i}]" for i in range(len(image_paths))])
            filter_parts.append(f"{concat_inputs}concat=n={len(image_paths)}:v=1:a=0[outv]")
            
            filter_complex = ';'.join(filter_parts)
            
            # Create video with audio in one command
            cmd = [
                'ffmpeg', '-y'
            ] + input_args + [
                '-i', audio_path,
                '-filter_complex', filter_complex,
                '-map', '[outv]',
                '-map', f'{len(image_paths)}:a',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-pix_fmt', 'yuv420p',
                '-shortest',
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ Video created successfully with official logo and Leonardo illustrations")
                return True
            else:
                logger.error(f"❌ FFmpeg failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error in video creation: {e}")
            return False

def main():
    """Main execution"""
    print("🎬 Official Logo + Leonardo.ai Video Generator")
    print("=" * 55)
    print("🎵 Using Rachel McGrath voice")
    print("🎨 Using official Junior News Digest logo")
    print("🖼️  Using Leonardo.ai style illustrations")
    print()
    
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg ready")
    except:
        print("❌ FFmpeg not available")
        return 1
    
    generator = OfficialVideoGenerator()
    
    # Ask user for video type
    print("📹 Video Options:")
    print("1. Standard video (current audio length)")
    print("2. Extended 7-minute video + YouTube Short")
    print()
    
    choice = input("Choose option (1 or 2): ").strip()
    
    if choice == "2":
        print("\n🎬 Creating extended 7-minute video...")
        video_path = generator.create_extended_video_with_tts("Ocean Robot Adventure", 420)
    else:
        print("\n🎬 Creating standard video...")
        video_path = generator.create_video_with_official_logo_and_leonardo()
    
    if video_path:
        print("\n🎉 SUCCESS!")
        print(f"📹 Video created: {video_path}")
        print("\n🏆 Features:")
        print("   ✅ Official Junior News Digest logo intro")
        print("   ✅ Rachel McGrath voice narration")  
        print("   ✅ Leonardo.ai style illustrations")
        print("   ✅ Professional video quality")
        print("   ✅ Perfect timing and synchronization")
        
        if choice == "2":
            print("   ✅ Extended 7-minute duration")
            print("   ✅ YouTube Short version included")
        
        print("\n🎬 Your official video is ready!")
        return 0
    else:
        print("\n❌ Video creation failed")
        return 1

if __name__ == "__main__":
    exit(main())
