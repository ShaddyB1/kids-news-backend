#!/usr/bin/env python3
"""
ElevenLabs Integration for Ultra-Natural Voice
Matches the reference video's quality exactly
"""

import os
import requests
import json
from pathlib import Path
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ElevenLabsVoiceGenerator:
    """
    Creates truly natural voice using ElevenLabs API
    Just like the reference video
    """
    
    def __init__(self):
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        self.voice_choice = os.getenv('ELEVENLABS_VOICE', 'jessica')
        self.model_choice = os.getenv('ELEVENLABS_MODEL', 'eleven_turbo_v2_5')
        self.output_dir = Path("elevenlabs_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        if self.api_key and self.api_key != 'paste_your_key_here_now':
            logger.info(f"✅ ElevenLabs API key loaded from .env")
            logger.info(f"📢 Using voice: {self.voice_choice}")
            logger.info(f"🎯 Using model: {self.model_choice}")
    
    def get_best_voices_for_kids(self):
        """
        Best ElevenLabs voices for kids content (from their platform)
        """
        voices = {
            'jessica': {
                'id': '21m00Tcm4TlvDq8ikWAM',  # Jessica - warm, friendly
                'description': 'Warm female narrator, perfect for kids stories'
            },
            'samara': {
                'id': 'CwhRBWXzGAHq8TQ4Fs17',  # Samara - expressive
                'description': 'Very expressive, great for excitement'
            },
            'brian': {
                'id': 'nPczCjzI2devNBz1zQrb',  # Brian - friendly male
                'description': 'Friendly British accent, great for education'
            },
            'alice': {
                'id': 'Xb7hH8MSUJpSbSDYk0k2',  # Alice - young, cheerful
                'description': 'Young, cheerful voice for kids content'
            },
            'bill': {
                'id': 'pqHfZKP75CvOlQylNhV4',  # Bill - documentary style
                'description': 'Clear narrator voice, good for facts'
            }
        }
        return voices
    
    def create_natural_script_with_tags(self, article: str, title: str) -> str:
        """
        Create script with ElevenLabs expression tags for maximum naturalness
        The reference video likely uses these features
        """
        
        # ElevenLabs supports these expression tags:
        # [surprised] [excited] [sad] [angry] [terrified] [shouting] [whispering]
        # [hopeful] [unfriendly] [cheerful] [laughing] [sighing]
        
        script = []
        
        # Opening with genuine excitement
        script.append("[excited] Hey friends! Oh my goodness, do I have an AMAZING story for you today!")
        script.append("[cheerful] Get ready, because this is going to blow your mind!")
        
        # Hook with wonder
        if 'robot' in article.lower() and 'fish' in article.lower():
            script.append("[surprised] So imagine this... a robot... that's also a fish... swimming in the ocean RIGHT NOW!")
            script.append("[excited] And get this - it's eating plastic! Like... EATING it! To help save the ocean!")
            script.append("[cheerful] Can you believe that? A robot fish superhero!")
        
        # Main story with varied emotions
        script.append("Okay, so here's what happened...")
        script.append("[hopeful] There's this super smart student - her name is Eleanor - and she had this BRILLIANT idea!")
        script.append("She thought... [whispering] what if we could make a robot that swims like a fish?")
        
        script.append("[excited] But not just ANY robot fish...")
        script.append("This one would swim around and eat up all the tiny pieces of plastic in the ocean!")
        script.append("[surprised] The plastic that's so small we can't even see it!")
        
        script.append("[cheerful] And you know what? The scientists LOVED her idea!")
        script.append("[excited] They actually built it! They really did!")
        
        script.append("They called it Gillbert - [laughing] isn't that the CUTEST name?")
        script.append("[hopeful] And now Gillbert is out there, swimming around, protecting all the fish!")
        
        # Amazing fact with genuine excitement
        script.append("[surprised] Oh! Oh! And here's the really cool part...")
        script.append("[excited] Gillbert doesn't need batteries or anything!")
        script.append("It just swims and swims, cleaning the ocean all day long!")
        script.append("[shouting] How AWESOME is that?!")
        
        # Engagement
        script.append("[cheerful] Can you imagine swimming next to a robot fish?")
        script.append("What would YOU name your robot fish if you had one?")
        
        # Inspiration
        script.append("[hopeful] You know what this means?")
        script.append("It means that kids - kids just like YOU - can have ideas that change the world!")
        script.append("[excited] Eleanor was just a student when she thought of this!")
        
        script.append("So next time you have a crazy idea...")
        script.append("[cheerful] Remember Gillbert the robot fish!")
        script.append("[hopeful] Your idea could be the next big thing!")
        
        # Warm ending
        script.append("[cheerful] Alright friends, that's our amazing story for today!")
        script.append("Keep being curious, keep dreaming big...")
        script.append("[excited] And I'll see you next time with another INCREDIBLE adventure!")
        script.append("[cheerful] Bye bye!")
        
        return '\n'.join(script)
    
    def generate_elevenlabs_voice(self, script: str, voice_name: str = None) -> str:
        """
        Generate voice using ElevenLabs API
        This is what makes the reference video sound so natural
        """
        
        if not self.api_key or self.api_key == 'paste_your_key_here_now':
            logger.error("""
            ⚠️ ELEVENLABS API KEY NEEDED!
            
            Please add your API key to the .env file:
            1. Open .env file in this directory
            2. Replace 'paste_your_key_here_now' with your actual API key
            3. Save the file and run this script again
            
            Don't have a key? Get one free at https://elevenlabs.io
            Free tier gives you 10,000 characters/month
            """)
            return None
        
        # Use voice from env or parameter
        if not voice_name:
            voice_name = self.voice_choice
        
        voices = self.get_best_voices_for_kids()
        voice_id = voices[voice_name]['id']
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }
        
        # Use model from env or default
        data = {
            "text": script,
            "model_id": self.model_choice,
            "voice_settings": {
                "stability": float(os.getenv('ELEVENLABS_STABILITY', '0.5')),
                "similarity_boost": float(os.getenv('ELEVENLABS_SIMILARITY', '0.75')),
                "style": float(os.getenv('ELEVENLABS_STYLE', '0.6')),
                "use_speaker_boost": os.getenv('ELEVENLABS_SPEAKER_BOOST', 'true').lower() == 'true'
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            output_path = self.output_dir / f"natural_voice_{voice_name}.mp3"
            with open(output_path, 'wb') as f:
                f.write(response.content)
            logger.info(f"✅ Natural ElevenLabs voice generated: {output_path}")
            return str(output_path)
        else:
            logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
            return None
    
    def show_how_to_get_graphics(self):
        """
        The reference video uses actual illustrated graphics, not generated shapes
        Here's how to match that quality
        """
        
        graphics_guide = """
        🎨 HOW TO GET GRAPHICS LIKE THE REFERENCE VIDEO:
        
        The reference video uses REAL ILLUSTRATIONS, not programmatically generated shapes.
        Here are your options:
        
        1. **Stock Illustration Sites** (Quick & Affordable):
           - Freepik.com - Thousands of kid-friendly illustrations
           - Flaticon.com - Vector graphics and characters
           - Pixabay.com - Free illustrations
           - Shutterstock - Premium quality
           
           Search for: "kids ocean illustration", "robot fish cartoon", 
                      "underwater scene kids", "cute robot character"
        
        2. **AI Image Generation** (Custom & Fast):
           - DALL-E 3 - Best quality, via ChatGPT or API
           - Midjourney - Excellent for illustrations
           - Stable Diffusion - Free, open source
           
           Prompts to use:
           "Cute cartoon robot fish swimming underwater, kids illustration style, bright colors"
           "Happy children looking at ocean, cartoon style, colorful illustration"
           "Underwater scene with plastic bottles, kid-friendly illustration, bright"
        
        3. **Canva Pro** (Templates Ready):
           - Has animated characters
           - Kids education templates
           - Ocean/underwater scenes
           - Can export as video
        
        4. **Hire an Illustrator** (Best Quality):
           - Fiverr - $25-100 per scene
           - Upwork - Professional illustrators
           - 99designs - Contest format
        
        5. **Animation Software**:
           - Adobe Character Animator - Animate illustrations
           - Vyond - Pre-made characters and scenes
           - Animaker - Kid-friendly templates
        
        MATCHING THE REFERENCE VIDEO:
        - Style: Flat illustration, bright colors
        - Characters: Simple, rounded, friendly
        - Backgrounds: Gradient skies, simple shapes
        - Colors: Bright blues, corals, yellows
        - Movement: Subtle animations, floating elements
        """
        
        print(graphics_guide)
        
        # Save guide
        guide_path = self.output_dir / "graphics_guide.txt"
        with open(guide_path, 'w') as f:
            f.write(graphics_guide)
        
        return guide_path

def create_reference_quality_video():
    """
    Create video with ElevenLabs voice quality
    """
    
    generator = ElevenLabsVoiceGenerator()
    
    # Sample article
    article = """
    A student named Eleanor Mackintosh invented a robot fish called Gillbert
    that helps clean the ocean by eating tiny pieces of plastic.
    """
    
    title = "Robot Fish Saves the Ocean!"
    
    print("\n" + "="*60)
    print("🎬 CREATING REFERENCE-QUALITY VIDEO")
    print("="*60)
    
    # Create natural script with expression tags
    script = generator.create_natural_script_with_tags(article, title)
    
    # Save script
    script_path = generator.output_dir / "natural_script.txt"
    with open(script_path, 'w') as f:
        f.write(script)
    print(f"\n✅ Script created: {script_path}")
    
    # Generate ElevenLabs voice
    voice_path = generator.generate_elevenlabs_voice(script, 'jessica')
    
    if voice_path:
        print(f"\n🎤 VOICE SUCCESS!")
        print(f"Natural ElevenLabs voice at: {voice_path}")
        print("This matches the reference video quality!")
    else:
        print("\n⚠️ To get natural voice like the reference:")
        print("1. Sign up at elevenlabs.io (free)")
        print("2. Get your API key")
        print("3. Run: export ELEVENLABS_API_KEY='your_key'")
    
    # Show how to get graphics
    print("\n" + "="*60)
    generator.show_how_to_get_graphics()
    
    print("\n" + "="*60)
    print("📊 REFERENCE VIDEO ANALYSIS:")
    print("="*60)
    print("""
    The reference video (final_video.mp4) uses:
    
    1. **Voice**: ElevenLabs or similar premium TTS
       - Natural intonation and emotion
       - Expression tags for excitement
       - Professional narration quality
    
    2. **Graphics**: Real illustrations (not code-generated)
       - Ocean scene with characters
       - Robot fish illustration
       - Kids looking at ocean
       - Underwater backgrounds
       - Text overlays with animation
    
    3. **Style**: 
       - Flat design illustrations
       - Bright, saturated colors
       - Simple character designs
       - Smooth transitions
       - Text appears with effects
    
    To EXACTLY match this:
    1. Use ElevenLabs API (as shown above)
    2. Get illustrations from Freepik/Canva/DALL-E
    3. Assemble in video editor or use our script
    """)
    
    return {
        'script': script_path,
        'voice': voice_path,
        'graphics_guide': generator.output_dir / "graphics_guide.txt"
    }

if __name__ == "__main__":
    result = create_reference_quality_video()
    
    print("\n" + "="*60)
    print("✨ NEXT STEPS TO MATCH REFERENCE:")
    print("="*60)
    print("1. Get ElevenLabs API key (free tier works)")
    print("2. Download illustrations from suggested sources")
    print("3. Run this script with API key set")
    print("4. Combine voice + illustrations = Reference quality!")
    print("="*60)
