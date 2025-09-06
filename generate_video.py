#!/usr/bin/env python3
"""
Main Video Generation Script - Junior News Digest
Run this script to generate videos with official logo and Leonardo.ai illustrations
"""

import sys
import subprocess
from pathlib import Path

def main():
    """Main video generation entry point"""
    print("🎬 Junior News Digest - Video Generator")
    print("=" * 45)
    print()
    
    script_path = Path("scripts/video_generation/video_generator_official_logo_leonardo.py")
    
    if not script_path.exists():
        print("❌ Video generation script not found!")
        print(f"Expected: {script_path}")
        return 1
    
    # Run the video generator
    try:
        subprocess.run([sys.executable, str(script_path)], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Video generation failed: {e}")
        return 1
    except KeyboardInterrupt:
        print("\n⚠️ Video generation cancelled")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
