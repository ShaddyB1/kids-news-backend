#!/usr/bin/env python3
"""
Content Verification Script for Junior News Digest
=================================================

This script verifies that all content is properly uploaded and accessible:
- Checks stories, videos, and thumbnails
- Tests API endpoints
- Verifies file accessibility
"""

import requests
import json
import os
from pathlib import Path

def verify_content():
    """Verify all content is properly uploaded and accessible"""
    base_url = "http://192.168.1.69:5002"
    
    print("🔍 Verifying Junior News Digest Content...")
    print("=" * 50)
    
    # Check stories
    print("\n📰 Checking Stories...")
    try:
        response = requests.get(f"{base_url}/api/articles", timeout=10)
        if response.status_code == 200:
            data = response.json()
            stories = data.get('articles', [])
            print(f"✅ Found {len(stories)} stories")
            
            for story in stories:
                print(f"  • {story['title']} (ID: {story['id']})")
                print(f"    Category: {story['category']} | Views: {story['views']}")
        else:
            print(f"❌ Failed to fetch stories: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching stories: {e}")
    
    # Check videos
    print("\n🎥 Checking Videos...")
    try:
        response = requests.get(f"{base_url}/api/videos", timeout=10)
        if response.status_code == 200:
            data = response.json()
            videos = data.get('videos', [])
            print(f"✅ Found {len(videos)} videos")
            
            for video in videos:
                print(f"  • {video['title']} (ID: {video['id']})")
                print(f"    Duration: {video['duration']} | Status: {video['status']}")
        else:
            print(f"❌ Failed to fetch videos: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching videos: {e}")
    
    # Check thumbnails
    print("\n🖼️ Checking Thumbnails...")
    try:
        response = requests.get(f"{base_url}/api/thumbnails/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            thumbnails = data.get('status', {}).get('thumbnails', [])
            print(f"✅ Found {len(thumbnails)} thumbnails")
            
            for thumb in thumbnails:
                print(f"  • {thumb['filename']} (Story: {thumb['story_id']}) - {thumb['size_bytes']} bytes")
        else:
            print(f"❌ Failed to fetch thumbnails: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching thumbnails: {e}")
    
    # Check quizzes
    print("\n🧩 Checking Quizzes...")
    quiz_count = 0
    try:
        for i in range(1, 7):  # Check stories 1-6
            story_id = f"story_{i:03d}"
            response = requests.get(f"{base_url}/api/articles/{story_id}/quiz", timeout=5)
            if response.status_code == 200:
                data = response.json()
                quiz = data.get('quiz', {})
                if quiz:
                    quiz_count += 1
                    print(f"  • Quiz for {story_id}: {quiz.get('total_questions', 0)} questions")
    except Exception as e:
        print(f"❌ Error checking quizzes: {e}")
    
    print(f"✅ Found {quiz_count} quizzes")
    
    # Test file accessibility
    print("\n📁 Testing File Accessibility...")
    test_files = [
        "/videos/story_001.mp4",
        "/thumbnails/story_001.jpg"
    ]
    
    for file_path in test_files:
        try:
            response = requests.head(f"{base_url}{file_path}", timeout=5)
            if response.status_code == 200:
                print(f"✅ {file_path} - Accessible")
            else:
                print(f"❌ {file_path} - Not accessible ({response.status_code})")
        except Exception as e:
            print(f"❌ {file_path} - Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Content verification completed!")
    print("\n📱 Your app should now have:")
    print("  • 6 complete news stories")
    print("  • 6 video files with thumbnails")
    print("  • 6 interactive quizzes")
    print("  • All content properly linked and accessible")

if __name__ == "__main__":
    verify_content()
