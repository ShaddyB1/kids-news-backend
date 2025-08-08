#!/usr/bin/env python3
"""
Video Quality Checker
Analyzes generated videos for common quality issues:
- Text artifacts in illustrations
- Dark/black frames at start
- Watermarks
- Logo quality
"""

import sys
import subprocess
import json
from pathlib import Path
from PIL import Image
import numpy as np
import tempfile
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class VideoQualityChecker:
    def __init__(self, video_path: str):
        self.video_path = Path(video_path)
        if not self.video_path.exists():
            raise FileNotFoundError(f"Video not found: {video_path}")
        
        self.temp_dir = tempfile.mkdtemp(prefix="video_check_")
        self.issues = []
    
    def extract_frames(self, count: int = 10) -> list:
        """Extract frames from video for analysis"""
        frames = []
        duration = self.get_video_duration()
        
        for i in range(count):
            # Avoid extracting from the very end
            timestamp = (i / (count + 1)) * duration
            frame_path = Path(self.temp_dir) / f"frame_{i:03d}.png"
            
            cmd = [
                'ffmpeg', '-ss', str(timestamp),
                '-i', str(self.video_path),
                '-vframes', '1',
                '-y', str(frame_path),
                '-loglevel', 'error'
            ]
            
            result = subprocess.run(cmd, capture_output=True)
            if result.returncode == 0 and frame_path.exists():
                frames.append(frame_path)
            else:
                logger.warning(f"Failed to extract frame at {timestamp:.2f}s")
        
        return frames
    
    def get_video_duration(self) -> float:
        """Get video duration in seconds"""
        cmd = [
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'json',
            str(self.video_path)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        return float(data['format']['duration'])
    
    def check_for_text(self, img_path: Path) -> bool:
        """Check if frame contains actual text artifacts (not natural scene details)"""
        img = Image.open(img_path).convert('L')
        width, height = img.size
        
        # Focus on top 15% where text artifacts appear
        top_region = img.crop((0, 0, width, int(height * 0.15)))
        pixels = np.array(top_region)
        
        # Look for actual text patterns like "Ocean's a save-/s fre"
        # Method 1: Check for dark text bands
        row_means = np.mean(pixels, axis=1)
        dark_rows = np.sum(row_means < 50)  # Very dark rows
        
        # Method 2: Check for consistent text blocks
        row_std = np.std(pixels, axis=1)
        consistent_rows = np.sum(row_std < 20)  # Consistent intensity rows
        
        # Only flag if we have substantial evidence of text
        has_text = dark_rows > 8 and consistent_rows > 12
        
        # Additional check for dark text block at very top
        if pixels.shape[0] > 10:
            top_5_rows = pixels[:5, :]
            if np.mean(top_5_rows) < 40:  # Very dark at top
                row_consistency = np.std([np.std(row) for row in top_5_rows])
                if row_consistency < 15:  # Consistent darkness
                    has_text = True
        
        return has_text
    
    def check_darkness(self, img_path: Path) -> bool:
        """Check if frame is too dark"""
        img = Image.open(img_path)
        pixels = np.array(img)
        
        # Calculate average brightness
        brightness = np.mean(pixels)
        
        return brightness < 30  # Very dark if average pixel value < 30
    
    def check_watermark(self, img_path: Path) -> bool:
        """Check for potential watermarks"""
        img = Image.open(img_path)
        width, height = img.size
        
        # Check bottom-right corner (common watermark location)
        corner = img.crop((width - 200, height - 100, width, height))
        pixels = np.array(corner)
        
        # Check for bright regions (watermarks are often white/light)
        bright_pixels = np.sum(pixels > 200) / pixels.size
        
        return bright_pixels > 0.1  # More than 10% bright pixels in corner
    
    def check_first_frame_logo(self, img_path: Path) -> bool:
        """Check if first frame contains the Junior News Digest logo"""
        img = Image.open(img_path)
        pixels = np.array(img)
        
        # Check for vibrant colors (logo characteristic)
        # Logo has bright orange/yellow and blue
        orange_yellow = np.logical_and(
            pixels[:, :, 0] > 200,  # High red
            pixels[:, :, 1] > 150    # High green
        )
        blue = np.logical_and(
            pixels[:, :, 2] > 150,   # High blue
            pixels[:, :, 0] < 100    # Low red
        )
        
        has_orange = np.sum(orange_yellow) > 1000
        has_blue = np.sum(blue) > 1000
        
        return has_orange and has_blue
    
    def run_quality_checks(self):
        """Run all quality checks on the video"""
        logger.info(f"🔍 Checking video quality: {self.video_path.name}")
        
        # Extract frames
        frames = self.extract_frames(count=10)
        
        # Check first frame for logo and darkness
        first_frame = frames[0]
        if self.check_darkness(first_frame):
            self.issues.append("❌ First frame is too dark (should show bright logo)")
        elif not self.check_first_frame_logo(first_frame):
            self.issues.append("⚠️ First frame may not contain the official logo")
        else:
            logger.info("✅ First frame contains bright logo")
        
        # Check all frames for text and watermarks
        text_frames = []
        watermark_frames = []
        
        for i, frame in enumerate(frames):
            if i > 0:  # Skip first frame (logo)
                if self.check_for_text(frame):
                    text_frames.append(i)
                
                if self.check_watermark(frame):
                    watermark_frames.append(i)
        
        if text_frames:
            self.issues.append(f"❌ Text artifacts detected in frames: {text_frames}")
        else:
            logger.info("✅ No text artifacts detected")
        
        if watermark_frames:
            self.issues.append(f"⚠️ Possible watermarks in frames: {watermark_frames}")
        else:
            logger.info("✅ No watermarks detected")
        
        # Check audio presence
        self.check_audio()
        
        # Summary
        if self.issues:
            logger.info("\n⚠️ Quality Issues Found:")
            for issue in self.issues:
                logger.info(f"  {issue}")
            return False
        else:
            logger.info("\n✅ Video passed all quality checks!")
            return True
    
    def check_audio(self):
        """Check if video has audio"""
        cmd = [
            'ffprobe', '-v', 'error',
            '-select_streams', 'a:0',
            '-show_entries', 'stream=codec_type',
            '-of', 'json',
            str(self.video_path)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        
        if not data.get('streams'):
            self.issues.append("❌ No audio stream found")
        else:
            logger.info("✅ Audio stream present")
    
    def cleanup(self):
        """Clean up temporary files"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)


def main():
    if len(sys.argv) < 2:
        print("Usage: python video_quality_checker.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    
    checker = VideoQualityChecker(video_path)
    try:
        passed = checker.run_quality_checks()
        sys.exit(0 if passed else 1)
    finally:
        checker.cleanup()


if __name__ == "__main__":
    main()
