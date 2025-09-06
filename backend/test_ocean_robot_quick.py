#!/usr/bin/env python3
"""
Quick test of Ocean Robot with improved text detection
Uses existing audio, focuses only on fixing illustrations
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from story_synchronized_generator import StorySynchronizedGenerator
from pathlib import Path
import shutil
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def test_quick_ocean_robot():
    """Test with improved detection and better prompts"""
    
    generator = StorySynchronizedGenerator()
    
    # Test just one illustration first
    logger.info("🧪 Testing Ocean Robot illustration generation with improved detection...")
    
    # Simple, clear prompt without complex descriptions
    test_prompt = "Underwater robot fish swimming in clear blue ocean water with tropical fish"
    story_context = "Ocean cleanup robot adventure story"
    
    try:
        # Test generation
        result = generator.generate_story_synchronized_illustration(
            test_prompt, 1, story_context  # scene_num = 1 (not logo)
        )
        
        if result and Path(result).exists():
            logger.info(f"✅ Successfully generated: {Path(result).name}")
            
            # Quick visual check - print file size and path
            file_size = Path(result).stat().st_size / 1024  # KB
            logger.info(f"📏 File size: {file_size:.1f} KB")
            
            return True
        else:
            logger.error("❌ Failed to generate test illustration")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error in test generation: {e}")
        return False

if __name__ == "__main__":
    success = test_quick_ocean_robot()
    print(f"\n{'✅ SUCCESS' if success else '❌ FAILED'}")
    sys.exit(0 if success else 1)
