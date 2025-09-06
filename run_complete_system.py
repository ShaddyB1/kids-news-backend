#!/usr/bin/env python3
"""
Main Integration Script - Junior News Digest Complete System
Choose between FREE or PREMIUM video generation
"""

import subprocess
import sys
from pathlib import Path

def main():
    print("🎬 Junior News Digest - Complete System")
    print("=" * 45)
    print()
    print("Choose your video generation option:")
    print()
    print("1. 🆓 FREE System")
    print("   - Uses news scraping (no API keys)")
    print("   - Enhanced fallback images")
    print("   - $0 cost per video")
    print()
    print("2. 💎 PREMIUM System") 
    print("   - Uses News API + OpenAI")
    print("   - Professional AI images (DALL-E 3)")
    print("   - ~$0.70 cost per video")
    print()
    print("3. 📱 Test React Native App")
    print("   - View story preview widget")
    print("   - See integrated app")
    print()
    
    choice = input("Enter your choice (1, 2, or 3): ").strip()
    
    if choice == "1":
        print("\n🆓 Running FREE System...")
        return run_free_system()
    elif choice == "2":
        print("\n💎 Running PREMIUM System...")
        return run_premium_system()
    elif choice == "3":
        print("\n📱 Starting React Native App...")
        return run_react_app()
    else:
        print("❌ Invalid choice")
        return 1

def run_free_system():
    """Run the completely free system"""
    try:
        script_path = Path("scripts/integrated_system/complete_free_video_system.py")
        
        if not script_path.exists():
            print(f"❌ Script not found: {script_path}")
            return 1
        
        result = subprocess.run([sys.executable, str(script_path)], check=True)
        return result.returncode
        
    except subprocess.CalledProcessError as e:
        print(f"❌ FREE system failed: {e}")
        return 1
    except Exception as e:
        print(f"❌ Error running FREE system: {e}")
        return 1

def run_premium_system():
    """Run the premium system with APIs"""
    try:
        script_path = Path("scripts/complete_video_system/news_video_generator.py")
        
        if not script_path.exists():
            print(f"❌ Script not found: {script_path}")
            return 1
        
        # Check for required API keys
        from pathlib import Path
        env_file = Path(".env")
        
        if not env_file.exists():
            print("❌ .env file not found!")
            print("💡 Create .env file with your API keys:")
            print("   NEWS_API_KEY=your_key")
            print("   OPENAI_API_KEY=your_key")
            print("   See API_SETUP_GUIDE.md for details")
            return 1
        
        result = subprocess.run([sys.executable, str(script_path)], check=True)
        return result.returncode
        
    except subprocess.CalledProcessError as e:
        print(f"❌ PREMIUM system failed: {e}")
        return 1
    except Exception as e:
        print(f"❌ Error running PREMIUM system: {e}")
        return 1

def run_react_app():
    """Start the React Native app"""
    try:
        app_dir = Path("app_development/kids_news_app_fixed")
        
        if not app_dir.exists():
            print(f"❌ App directory not found: {app_dir}")
            return 1
        
        print("🚀 Starting React Native development server...")
        print("📱 Scan QR code with Expo Go app on your phone")
        print("💻 Or press 'w' to open in web browser")
        print()
        
        # Change to app directory and start Expo
        subprocess.run([
            "bash", "-c", 
            f"cd '{app_dir}' && npx expo start --clear"
        ])
        
        return 0
        
    except KeyboardInterrupt:
        print("\n⚠️ React Native server stopped")
        return 0
    except Exception as e:
        print(f"❌ Error starting React Native app: {e}")
        return 1

def show_system_status():
    """Show current system status"""
    print("\n📊 System Status:")
    print("=" * 30)
    
    # Check FFmpeg
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg: Ready")
    except:
        print("❌ FFmpeg: Not available")
    
    # Check Python packages
    packages = ['requests', 'feedparser', 'beautifulsoup4', 'pillow']
    for package in packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}: Installed")
        except ImportError:
            print(f"❌ {package}: Missing")
    
    # Check .env file
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file: Found")
    else:
        print("⚠️ .env file: Missing (needed for PREMIUM)")
    
    # Check app directory
    app_dir = Path("app_development/kids_news_app_fixed")
    if app_dir.exists():
        print("✅ React Native App: Ready")
    else:
        print("❌ React Native App: Missing")
    
    print()

if __name__ == "__main__":
    show_system_status()
    exit(main())
