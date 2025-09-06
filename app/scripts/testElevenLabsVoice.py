#!/usr/bin/env python3
"""
Test ElevenLabs Voice Integration
Uses the API key from the parent directory .env file
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the correct parent directory
env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(env_path)

def test_elevenlabs_voice():
    """Test the ElevenLabs API with the new voice"""
    
    api_key = os.getenv('ELEVENLABS_API_KEY')
    voice_id = "paRTfYnetOrTukxfEm1J"  # Your new voice ID
    
    if not api_key:
        print("❌ ELEVENLABS_API_KEY not found in .env file")
        return False
    
    print("🎵 Testing ElevenLabs Voice Integration")
    print(f"🔑 API Key found: {api_key[:10]}...")
    print(f"🎙️  Voice ID: {voice_id}")
    
    # Test story text
    story_text = """
    Welcome to Junior News Digest! Today we have an amazing story about Aqua, 
    the ocean cleanup robot. Aqua swims through the deep blue sea, helping 
    marine life and keeping our oceans clean. Join us on this underwater adventure!
    """
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    
    data = {
        "text": story_text.strip(),
        "voice_settings": {
            "stability": 0.6,
            "similarity_boost": 0.8
        },
        "model_id": "eleven_monolingual_v1"
    }
    
    try:
        print("🔄 Generating speech sample...")
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            # Save the audio file
            output_dir = Path("assets/audio")
            output_dir.mkdir(parents=True, exist_ok=True)
            
            output_file = output_dir / "test_voice_sample.mp3"
            with open(output_file, "wb") as f:
                f.write(response.content)
            
            print("✅ SUCCESS! Voice sample generated")
            print(f"💾 Audio saved to: {output_file}")
            print("🎧 You can now play this file to hear the new voice")
            
            # Get file size for confirmation
            file_size = output_file.stat().st_size
            print(f"📊 File size: {file_size} bytes")
            
            return True
            
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"📝 Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_voice_availability():
    """Test if the voice is available in your account"""
    
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("❌ No API key found in environment")
        print(f"🔍 Checking .env file at: {env_path}")
        print(f"📁 File exists: {env_path.exists()}")
        if env_path.exists():
            with open(env_path, 'r') as f:
                content = f.read()
                has_key = 'ELEVENLABS_API_KEY' in content
                print(f"🔑 Contains ELEVENLABS_API_KEY: {has_key}")
        return False
    
    print(f"\n🔍 Checking available voices...")
    print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")
    
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": api_key}
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            voices = response.json().get('voices', [])
            print(f"📋 Found {len(voices)} voices in your account")
            
            # Look for our specific voice
            target_voice = "paRTfYnetOrTukxfEm1J"
            found_voice = None
            
            for voice in voices:
                if voice.get('voice_id') == target_voice:
                    found_voice = voice
                    break
            
            if found_voice:
                print(f"✅ Target voice found!")
                print(f"   Name: {found_voice.get('name', 'Unknown')}")
                print(f"   ID: {found_voice.get('voice_id')}")
                print(f"   Category: {found_voice.get('category', 'Unknown')}")
            else:
                print(f"⚠️  Target voice {target_voice} not found in your account")
                print("📝 All available voices in your account:")
                for i, voice in enumerate(voices, 1):
                    print(f"   {i}. {voice.get('name', 'Unknown')} (ID: {voice.get('voice_id', 'Unknown')})")
                    if voice.get('category'):
                        print(f"      Category: {voice.get('category')}")
                    if voice.get('description'):
                        print(f"      Description: {voice.get('description')}")
                    print()
            
            return found_voice is not None
            
        else:
            print(f"❌ Error fetching voices: {response.status_code}")
            print(f"📝 Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Kids News App - ElevenLabs Voice Test")
    print("=" * 50)
    
    # Test voice availability
    voice_available = test_voice_availability()
    
    if voice_available:
        # Test voice generation
        success = test_elevenlabs_voice()
        
        if success:
            print("\n🎉 All tests passed!")
            print("🔧 Integration ready for the app")
            return 0
        else:
            print("\n❌ Voice generation failed")
            return 1
    else:
        print("\n⚠️  Voice not available in your account")
        print("💡 Please check the voice ID or your ElevenLabs subscription")
        return 1

if __name__ == "__main__":
    exit(main())
