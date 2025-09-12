#!/usr/bin/env python3
"""
Test script to add stories to the editorial system for approval
"""

import sqlite3
import uuid
from datetime import datetime
import json

def add_test_stories():
    """Add test stories to the automated editorial system"""
    
    # Connect to the database
    conn = sqlite3.connect('automated_editorial.db')
    cursor = conn.cursor()
    
    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS automated_stories (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            headline TEXT NOT NULL,
            content TEXT NOT NULL,
            script TEXT,
            category TEXT NOT NULL,
            is_approved INTEGER DEFAULT 0,
            created_date TEXT NOT NULL,
            approved_date TEXT,
            publishing_day TEXT,
            video_generated INTEGER DEFAULT 0,
            quiz_generated INTEGER DEFAULT 0
        )
    ''')
    
    # Test stories
    test_stories = [
        {
            'title': 'Amazing Ocean Robot Saves Marine Life',
            'headline': 'Kids Invent Robot That Cleans Ocean and Saves Sea Animals',
            'content': 'A group of brilliant young inventors from Ocean View Elementary School created an incredible underwater robot that helps save sea animals! The robot, nicknamed "Ocean Guardian," swims through the water collecting plastic waste and dangerous trash that could hurt dolphins, turtles, and fish. The students worked for six months with their science teacher to build this amazing invention. The robot can work underwater for 8 hours and has already collected over 500 pounds of trash from the local harbor! Marine biologists are amazed by what these kids accomplished.',
            'category': 'environment'
        },
        {
            'title': 'Young Scientists Discover New Species of Butterfly',
            'headline': 'Kids Find Colorful New Butterfly Species in School Garden',
            'content': 'Students at Rainbow Elementary School made an incredible scientific discovery right in their school garden! While studying butterflies for their science project, they found a beautiful butterfly that scientists had never seen before. The butterfly has bright purple and gold wings with tiny silver spots. Dr. Sarah Chen, a butterfly expert, confirmed it\'s a completely new species! The students named it the "Rainbow Garden Butterfly" and their discovery will be published in a real science magazine.',
            'category': 'science'
        },
        {
            'title': 'Kids Build Solar-Powered School Bus',
            'headline': 'Students Create Eco-Friendly School Bus That Runs on Sunshine',
            'content': 'Students from Green Tech Middle School built an amazing school bus that runs entirely on solar power! The bus has special solar panels on the roof that collect energy from the sun. It can carry 20 students and travels completely silently without any pollution. The project took the students eight months to complete, and they worked with engineers and their teachers. The solar bus will start taking kids to school next month, showing how young people can help protect our planet!',
            'category': 'technology'
        },
        {
            'title': 'Young Athletes Start Inclusive Sports Program',
            'headline': 'Kids Create Sports Program Where Everyone Can Play Together',
            'content': 'A group of amazing young athletes started a special sports program where kids of all abilities can play together and have fun! The program, called "Sports for Everyone," includes basketball, soccer, and swimming activities designed so that everyone can participate. The young organizers, aged 10-14, raised money for special equipment and trained volunteer coaches. Over 200 kids have joined the program, and they\'re having so much fun while learning teamwork and friendship!',
            'category': 'sports'
        },
        {
            'title': 'Students Launch Healthy Food Garden Project',
            'headline': 'Kids Grow Fresh Vegetables to Feed Their Whole Community',
            'content': 'Students at Sunny Hill Elementary started an incredible garden project that now feeds hundreds of families in their community! They grow fresh vegetables like tomatoes, carrots, lettuce, and peppers in their school garden. Every week, they harvest the vegetables and give them free to families who need healthy food. The students learned about nutrition, farming, and helping others. Their garden project has inspired 10 other schools to start their own community gardens!',
            'category': 'health'
        }
    ]
    
    # Add stories to database
    for story in test_stories:
        story_id = str(uuid.uuid4())
        
        # Generate a simple script
        script = f"""Welcome to Junior News Digest! Today's amazing story is about {story['title'].lower()}.

{story['content']}

This incredible story shows how young people can make a real difference in the world! 

Why it matters: This story teaches us that kids have the power to solve problems and help others. When young people work together and use their creativity, they can create amazing solutions that make the world a better place for everyone!

Thanks for watching Junior News Digest - where young minds discover amazing stories!"""
        
        cursor.execute('''
            INSERT OR REPLACE INTO automated_stories 
            (id, title, headline, content, script, category, is_approved, created_date, publishing_day, video_generated, quiz_generated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            story_id,
            story['title'],
            story['headline'],
            story['content'],
            script,
            story['category'],
            0,  # Not approved yet
            datetime.now().isoformat(),
            None,  # Will be set when approved
            0,  # Video not generated yet
            0   # Quiz not generated yet
        ))
    
    conn.commit()
    conn.close()
    
    print(f"✅ Added {len(test_stories)} test stories to the editorial system!")
    print("📝 Stories are ready for approval in the editorial portal:")
    print("🌐 https://ornate-crumble-ffc133.netlify.app/")
    print("\n📋 Stories added:")
    for i, story in enumerate(test_stories, 1):
        print(f"  {i}. {story['title']} ({story['category']})")

if __name__ == "__main__":
    add_test_stories()
