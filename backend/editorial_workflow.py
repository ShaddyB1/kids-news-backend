#!/usr/bin/env python3
"""
Junior News Digest - Editorial Workflow System
==============================================

This system manages the weekly editorial workflow:
1. Every Sunday: Generate 15-20 candidate stories for editor review
2. Editor reviews, selects, and edits stories
3. Generate videos and quizzes for approved stories
4. Schedule content for Monday, Wednesday, Friday uploads

Usage:
    python editorial_workflow.py generate-candidates    # Generate Sunday story candidates
    python editorial_workflow.py review-portal          # Start editor review portal
    python editorial_workflow.py process-approved       # Process approved stories
    python editorial_workflow.py schedule-week          # Schedule content for the week
"""

import argparse
import json
import sys
import os
import sqlite3
from datetime import datetime, timedelta, date
import requests
import random
from typing import List, Dict, Any
from flask import Flask, render_template_string, request, redirect, url_for, flash, jsonify

# Add the production directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from add_content import ContentManager

class NewsStoryGenerator:
    """Generate candidate news stories for editorial review"""
    
    def __init__(self):
        self.categories = [
            'technology', 'science', 'environment', 'health', 
            'education', 'sports', 'culture', 'general'
        ]
        
    def generate_candidate_stories(self, count=20) -> List[Dict[str, Any]]:
        """Generate candidate stories for editorial review"""
        
        # Sample story templates for different categories
        story_templates = {
            'technology': [
                {
                    'title': 'Young Inventors Create {innovation} to Help {cause}',
                    'content_template': 'A group of brilliant students from {school} has invented an amazing {innovation}! The {innovation} uses {technology} to {benefit}. The students worked with their teacher for {duration} to build this incredible invention. {impact_stat}! This shows how young people can create solutions to help {cause}.',
                    'innovations': ['solar-powered robot', 'smart recycling system', 'water purification device', 'air quality monitor'],
                    'causes': ['the environment', 'their community', 'elderly people', 'animals'],
                    'technologies': ['solar panels', 'artificial intelligence', 'sensors', 'renewable energy'],
                    'benefits': ['clean parks', 'reduce waste', 'provide clean water', 'monitor pollution'],
                    'schools': ['Green Valley School', 'Tech Academy', 'Innovation Middle School', 'STEM High School']
                }
            ],
            'science': [
                {
                    'title': 'Scientists Discover {discovery} That Could {impact}',
                    'content_template': 'Amazing scientists have made an incredible discovery about {subject}! They found that {discovery} could {impact}. The research team worked for {duration} to understand {phenomenon}. This discovery means that {benefit}. Young scientists around the world are excited about this breakthrough!',
                    'discoveries': ['new medicine', 'clean energy source', 'way to grow food faster', 'method to clean oceans'],
                    'impacts': ['help sick children', 'power entire cities', 'feed more people', 'save marine life'],
                    'subjects': ['space', 'the human body', 'plants', 'the ocean'],
                    'phenomena': ['how cells work', 'how stars form', 'how plants grow', 'how ecosystems function']
                }
            ],
            'environment': [
                {
                    'title': 'Kids Plant {number} Trees to Fight Climate Change',
                    'content_template': 'Thousands of children from around the world have planted {number} trees in just one weekend! The amazing project, called "{project_name}," happened in {locations}. Kids aged 6 to 16 worked with their families and teachers to plant {tree_types} in parks, schools, and neighborhoods. Scientists say these trees will {environmental_benefit}. The children also learned about {educational_aspect}.',
                    'numbers': ['10,000', '25,000', '50,000', '100,000'],
                    'project_names': ['Trees for Tomorrow', 'Green Future Initiative', 'Plant Hope Project', 'Climate Heroes'],
                    'tree_types': ['oak, maple, and fruit trees', 'native species', 'fast-growing varieties', 'flowering trees'],
                    'environmental_benefits': ['clean the air and fight climate change', 'provide homes for animals', 'prevent soil erosion', 'create cooler neighborhoods']
                }
            ]
        }
        
        candidates = []
        
        for i in range(count):
            category = random.choice(self.categories)
            
            if category in story_templates:
                template = random.choice(story_templates[category])
                story = self._generate_from_template(template, category)
            else:
                story = self._generate_generic_story(category, i)
            
            story['candidate_id'] = f"candidate_{datetime.now().strftime('%Y%m%d')}_{i+1:03d}"
            story['generated_date'] = datetime.now().isoformat()
            story['status'] = 'pending_review'
            story['editor_notes'] = ''
            story['priority_score'] = random.randint(1, 10)
            
            candidates.append(story)
        
        # Sort by priority score (highest first)
        candidates.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return candidates
    
    def _generate_from_template(self, template: Dict, category: str) -> Dict[str, Any]:
        """Generate a story from a template"""
        # Fill in template variables
        title = template['title']
        content = template['content_template']
        
        # Replace placeholders with random choices
        for key, values in template.items():
            if key.endswith('s') and key != 'title' and key != 'content_template':
                placeholder = f"{{{key[:-1]}}}"  # Remove 's' and wrap in braces
                if placeholder in title:
                    title = title.replace(placeholder, random.choice(values))
                if placeholder in content:
                    content = content.replace(placeholder, random.choice(values))
        
        # Add some random details
        durations = ['3 months', '6 months', '8 months', '1 year']
        impact_stats = [
            'The invention can help 1000 people every day',
            'It works 10 times faster than old methods',
            'It uses 50% less energy than traditional systems',
            'It can process 100 items per hour'
        ]
        
        content = content.replace('{duration}', random.choice(durations))
        content = content.replace('{impact_stat}', random.choice(impact_stats))
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content,
            'is_breaking': random.choice([True, False]) if random.random() < 0.2 else False,
            'is_trending': random.choice([True, False]) if random.random() < 0.3 else False,
            'is_hot': random.choice([True, False]) if random.random() < 0.25 else False
        }
    
    def _generate_generic_story(self, category: str, index: int) -> Dict[str, Any]:
        """Generate a generic story for categories without templates"""
        titles = {
            'sports': [
                f'Young Athletes Break Records at {category.title()} Championship',
                f'Kids Create New {category.title()} Program for Community',
                f'Amazing {category.title()} Team Wins International Competition'
            ],
            'health': [
                f'New Study Shows How {category.title()} Habits Help Kids Grow Strong',
                f'Young Doctors Create {category.title()} Program for Schools',
                f'Amazing {category.title()} Discovery Helps Children Stay Healthy'
            ],
            'education': [
                f'Students Create Revolutionary {category.title()} Program',
                f'New {category.title()} Method Helps Kids Learn Faster',
                f'Young Teachers Change {category.title()} Forever'
            ],
            'culture': [
                f'Kids Preserve Ancient {category.title()} Traditions',
                f'Young Artists Create Amazing {category.title()} Project',
                f'Children Celebrate {category.title()} Heritage Festival'
            ]
        }
        
        category_titles = titles.get(category, [f'Amazing {category.title()} Discovery #{index+1}'])
        title = random.choice(category_titles)
        
        content = f"This is an exciting story about {category} that will inspire young minds. " \
                 f"Children and young people are making incredible discoveries and contributions in {category}. " \
                 f"This story shows how kids can make a real difference in the world through creativity, " \
                 f"hard work, and determination. The impact of their work will help communities and " \
                 f"inspire other young people to pursue their dreams in {category}."
        
        return {
            'title': title,
            'content': content,
            'category': category,
            'author': 'Junior News Team',
            'summary': content[:150] + '...' if len(content) > 150 else content,
            'is_breaking': False,
            'is_trending': random.choice([True, False]) if random.random() < 0.3 else False,
            'is_hot': False
        }

class EditorialWorkflow:
    """Manage the editorial workflow system"""
    
    def __init__(self):
        self.db_path = 'editorial_workflow.db'
        self.content_manager = ContentManager()
        self.story_generator = NewsStoryGenerator()
        self._init_workflow_database()
    
    def _init_workflow_database(self):
        """Initialize the editorial workflow database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Candidate stories table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS candidate_stories (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT,
                category TEXT NOT NULL,
                author TEXT NOT NULL,
                generated_date TEXT NOT NULL,
                status TEXT DEFAULT 'pending_review',
                editor_notes TEXT DEFAULT '',
                priority_score INTEGER DEFAULT 5,
                is_breaking BOOLEAN DEFAULT FALSE,
                is_trending BOOLEAN DEFAULT FALSE,
                is_hot BOOLEAN DEFAULT FALSE,
                approved_date TEXT,
                final_title TEXT,
                final_content TEXT,
                final_summary TEXT
            )
        ''')
        
        # Weekly schedule table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weekly_schedule (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                week_start_date TEXT NOT NULL,
                candidate_id TEXT NOT NULL,
                scheduled_date TEXT NOT NULL,
                day_of_week TEXT NOT NULL,
                article_id TEXT,
                video_id TEXT,
                quiz_id TEXT,
                status TEXT DEFAULT 'scheduled',
                created_date TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES candidate_stories (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def generate_weekly_candidates(self, count=20):
        """Generate candidate stories for the week"""
        print(f"🎯 Generating {count} candidate stories for editorial review...")
        
        candidates = self.story_generator.generate_candidate_stories(count)
        
        # Save candidates to database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Clear previous week's pending candidates
        cursor.execute("DELETE FROM candidate_stories WHERE status = 'pending_review'")
        
        saved_count = 0
        for candidate in candidates:
            try:
                cursor.execute('''
                    INSERT INTO candidate_stories 
                    (id, title, content, summary, category, author, generated_date, 
                     status, priority_score, is_breaking, is_trending, is_hot)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    candidate['candidate_id'], candidate['title'], candidate['content'],
                    candidate['summary'], candidate['category'], candidate['author'],
                    candidate['generated_date'], candidate['status'], candidate['priority_score'],
                    candidate['is_breaking'], candidate['is_trending'], candidate['is_hot']
                ))
                saved_count += 1
            except Exception as e:
                print(f"❌ Error saving candidate {candidate['candidate_id']}: {e}")
        
        conn.commit()
        conn.close()
        
        print(f"✅ Generated and saved {saved_count} candidate stories!")
        print(f"📅 Stories are ready for editorial review")
        print(f"🔗 Run 'python editorial_workflow.py review-portal' to start the review process")
        
        return candidates
    
    def get_pending_candidates(self):
        """Get all pending candidate stories"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, content, summary, category, author, priority_score,
                   is_breaking, is_trending, is_hot, editor_notes
            FROM candidate_stories 
            WHERE status = 'pending_review'
            ORDER BY priority_score DESC, generated_date DESC
        ''')
        
        candidates = []
        for row in cursor.fetchall():
            candidates.append({
                'id': row[0],
                'title': row[1],
                'content': row[2],
                'summary': row[3],
                'category': row[4],
                'author': row[5],
                'priority_score': row[6],
                'is_breaking': row[7],
                'is_trending': row[8],
                'is_hot': row[9],
                'editor_notes': row[10] or ''
            })
        
        conn.close()
        return candidates
    
    def approve_story(self, candidate_id: str, final_title: str = None, 
                     final_content: str = None, final_summary: str = None, 
                     editor_notes: str = ''):
        """Approve a candidate story"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'approved', 
                approved_date = ?, 
                final_title = COALESCE(?, title),
                final_content = COALESCE(?, content),
                final_summary = COALESCE(?, summary),
                editor_notes = ?
            WHERE id = ?
        ''', (
            datetime.now().isoformat(), final_title, final_content, 
            final_summary, editor_notes, candidate_id
        ))
        
        conn.commit()
        conn.close()
        
        print(f"✅ Approved story: {candidate_id}")
    
    def reject_story(self, candidate_id: str, editor_notes: str = ''):
        """Reject a candidate story"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'rejected', editor_notes = ?
            WHERE id = ?
        ''', (editor_notes, candidate_id))
        
        conn.commit()
        conn.close()
        
        print(f"❌ Rejected story: {candidate_id}")
    
    def get_approved_stories(self):
        """Get all approved stories ready for processing"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, COALESCE(final_title, title) as title,
                   COALESCE(final_content, content) as content,
                   COALESCE(final_summary, summary) as summary,
                   category, author, is_breaking, is_trending, is_hot
            FROM candidate_stories 
            WHERE status = 'approved'
            ORDER BY approved_date
        ''')
        
        stories = []
        for row in cursor.fetchall():
            stories.append({
                'candidate_id': row[0],
                'title': row[1],
                'content': row[2],
                'summary': row[3],
                'category': row[4],
                'author': row[5],
                'is_breaking': row[6],
                'is_trending': row[7],
                'is_hot': row[8]
            })
        
        conn.close()
        return stories
    
    def process_approved_stories(self):
        """Process approved stories - create articles, videos, and quizzes"""
        approved_stories = self.get_approved_stories()
        
        if not approved_stories:
            print("📝 No approved stories to process")
            return
        
        print(f"🔄 Processing {len(approved_stories)} approved stories...")
        
        processed_count = 0
        for story in approved_stories:
            try:
                # Add article to main database
                article_id = self.content_manager.add_article(
                    title=story['title'],
                    content=story['content'],
                    category=story['category'],
                    author=story['author'],
                    summary=story['summary'],
                    is_breaking=story['is_breaking'],
                    is_trending=story['is_trending'],
                    is_hot=story['is_hot']
                )
                
                if article_id:
                    # TODO: Generate video for the story
                    # video_id = self._generate_video(story)
                    
                    # TODO: Generate quiz for the story  
                    # quiz_id = self._generate_quiz(story)
                    
                    # Mark as processed
                    self._mark_story_processed(story['candidate_id'], article_id)
                    processed_count += 1
                    
                    print(f"✅ Processed: {story['title']}")
                
            except Exception as e:
                print(f"❌ Error processing {story['title']}: {e}")
        
        print(f"🎉 Successfully processed {processed_count} stories!")
        
        if processed_count > 0:
            print("📅 Ready to schedule content for the week")
            print("🔗 Run 'python editorial_workflow.py schedule-week' to create the weekly schedule")
    
    def _mark_story_processed(self, candidate_id: str, article_id: str, 
                             video_id: str = None, quiz_id: str = None):
        """Mark a story as processed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE candidate_stories 
            SET status = 'processed'
            WHERE id = ?
        ''', (candidate_id,))
        
        conn.commit()
        conn.close()
    
    def schedule_weekly_content(self):
        """Schedule processed content for Monday, Wednesday, Friday"""
        # Get this week's Monday
        today = date.today()
        days_since_monday = today.weekday()
        monday = today - timedelta(days=days_since_monday)
        
        # Get processed stories that haven't been scheduled yet
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT cs.id, cs.title
            FROM candidate_stories cs
            LEFT JOIN weekly_schedule ws ON cs.id = ws.candidate_id 
                AND ws.week_start_date = ?
            WHERE cs.status = 'processed' AND ws.candidate_id IS NULL
            ORDER BY cs.approved_date
        ''', (monday.isoformat(),))
        
        unscheduled_stories = cursor.fetchall()
        
        if not unscheduled_stories:
            print("📅 No unscheduled stories found")
            conn.close()
            return
        
        # Schedule stories for Monday, Wednesday, Friday
        schedule_days = [
            (monday, 'Monday'),
            (monday + timedelta(days=2), 'Wednesday'), 
            (monday + timedelta(days=4), 'Friday')
        ]
        
        scheduled_count = 0
        story_index = 0
        
        for schedule_date, day_name in schedule_days:
            stories_per_day = len(unscheduled_stories) // 3
            if day_name == 'Friday':  # Give Friday any remaining stories
                stories_per_day = len(unscheduled_stories) - story_index
            
            for i in range(min(stories_per_day, len(unscheduled_stories) - story_index)):
                if story_index >= len(unscheduled_stories):
                    break
                
                candidate_id, title = unscheduled_stories[story_index]
                
                cursor.execute('''
                    INSERT INTO weekly_schedule 
                    (week_start_date, candidate_id, scheduled_date, day_of_week, status)
                    VALUES (?, ?, ?, ?, 'scheduled')
                ''', (monday.isoformat(), candidate_id, schedule_date.isoformat(), day_name))
                
                print(f"📅 Scheduled for {day_name} ({schedule_date}): {title}")
                scheduled_count += 1
                story_index += 1
        
        conn.commit()
        conn.close()
        
        print(f"✅ Scheduled {scheduled_count} stories for the week of {monday}")

# Flask Web Interface for Editorial Review
app = Flask(__name__)
app.secret_key = 'editorial-workflow-secret-2024'

workflow = EditorialWorkflow()

REVIEW_PORTAL_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Junior News Digest - Editorial Review Portal</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { text-align: center; color: #4A90E2; margin-bottom: 30px; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .candidates { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .candidate { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .candidate-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .candidate-title { font-size: 18px; font-weight: bold; color: #2E5C8A; margin-bottom: 10px; }
        .candidate-meta { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge.category { background: #E3F2FD; color: #1976D2; }
        .badge.priority { background: #FFF3E0; color: #F57C00; }
        .badge.breaking { background: #FFEBEE; color: #D32F2F; }
        .badge.trending { background: #F3E5F5; color: #7B1FA2; }
        .badge.hot { background: #FFF8E1; color: #F9A825; }
        .candidate-content { margin-bottom: 15px; max-height: 150px; overflow-y: auto; }
        .candidate-summary { color: #666; font-style: italic; margin-bottom: 15px; }
        .editor-notes { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px; }
        .actions { display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .btn-approve { background: #4CAF50; color: white; }
        .btn-reject { background: #f44336; color: white; }
        .btn-edit { background: #FF9800; color: white; }
        .btn:hover { opacity: 0.8; }
        .flash-messages { margin-bottom: 20px; }
        .flash-success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .flash-error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .process-section { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📰 Junior News Digest</h1>
        <h2>Editorial Review Portal</h2>
        <p>{{ today_date }} - Weekly Story Candidates</p>
    </div>
    
    <div class="flash-messages">
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="flash-{{ category }}">{{ message }}</div>
                {% endfor %}
            {% endif %}
        {% endwith %}
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h3>{{ total_candidates }}</h3>
            <p>Total Candidates</p>
        </div>
        <div class="stat-card">
            <h3>{{ approved_count }}</h3>
            <p>Approved</p>
        </div>
        <div class="stat-card">
            <h3>{{ pending_count }}</h3>
            <p>Pending Review</p>
        </div>
    </div>
    
    {% if approved_count > 0 %}
    <div class="process-section">
        <h3>🎉 {{ approved_count }} Stories Approved!</h3>
        <p>Ready to process approved stories and create content.</p>
        <form action="/process-approved" method="post" style="display: inline;">
            <button type="submit" class="btn btn-approve" style="font-size: 16px; padding: 15px 30px;">
                🔄 Process Approved Stories
            </button>
        </form>
    </div>
    {% endif %}
    
    <div class="candidates">
        {% for candidate in candidates %}
        <div class="candidate">
            <div class="candidate-title">{{ candidate.title }}</div>
            
            <div class="candidate-meta">
                <span class="badge category">{{ candidate.category }}</span>
                <span class="badge priority">Priority: {{ candidate.priority_score }}/10</span>
                {% if candidate.is_breaking %}<span class="badge breaking">🔴 Breaking</span>{% endif %}
                {% if candidate.is_trending %}<span class="badge trending">🔥 Trending</span>{% endif %}
                {% if candidate.is_hot %}<span class="badge hot">⚡ Hot</span>{% endif %}
            </div>
            
            <div class="candidate-summary">{{ candidate.summary }}</div>
            
            <div class="candidate-content">{{ candidate.content }}</div>
            
            <form action="/review-story" method="post">
                <input type="hidden" name="candidate_id" value="{{ candidate.id }}">
                <textarea name="editor_notes" class="editor-notes" placeholder="Editor notes (optional)...">{{ candidate.editor_notes }}</textarea>
                <div class="actions">
                    <button type="submit" name="action" value="approve" class="btn btn-approve">✅ Approve</button>
                    <button type="submit" name="action" value="reject" class="btn btn-reject">❌ Reject</button>
                    <button type="submit" name="action" value="edit" class="btn btn-edit">✏️ Edit & Approve</button>
                </div>
            </form>
        </div>
        {% endfor %}
    </div>
</body>
</html>
'''

@app.route('/')
def review_portal():
    """Main editorial review portal"""
    candidates = workflow.get_pending_candidates()
    
    # Get counts
    total_candidates = len(candidates)
    approved_count = len(workflow.get_approved_stories())
    pending_count = total_candidates
    
    return render_template_string(REVIEW_PORTAL_TEMPLATE, 
                                candidates=candidates,
                                total_candidates=total_candidates,
                                approved_count=approved_count,
                                pending_count=pending_count,
                                today_date=datetime.now().strftime('%A, %B %d, %Y'))

@app.route('/review-story', methods=['POST'])
def review_story():
    """Handle story review actions"""
    candidate_id = request.form['candidate_id']
    action = request.form['action']
    editor_notes = request.form.get('editor_notes', '')
    
    if action == 'approve':
        workflow.approve_story(candidate_id, editor_notes=editor_notes)
        flash(f'✅ Story approved successfully!', 'success')
    
    elif action == 'reject':
        workflow.reject_story(candidate_id, editor_notes=editor_notes)
        flash(f'❌ Story rejected', 'error')
    
    elif action == 'edit':
        # For now, just approve - in a full implementation, this would open an edit form
        workflow.approve_story(candidate_id, editor_notes=editor_notes)
        flash(f'✏️ Story approved with edits!', 'success')
    
    return redirect(url_for('review_portal'))

@app.route('/process-approved', methods=['POST'])
def process_approved():
    """Process all approved stories"""
    workflow.process_approved_stories()
    flash('🎉 All approved stories have been processed!', 'success')
    return redirect(url_for('review_portal'))

def main():
    parser = argparse.ArgumentParser(description='Junior News Digest Editorial Workflow')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Generate candidates command
    generate_cmd = subparsers.add_parser('generate-candidates', help='Generate candidate stories for review')
    generate_cmd.add_argument('--count', type=int, default=20, help='Number of candidates to generate')
    
    # Review portal command
    subparsers.add_parser('review-portal', help='Start the editorial review web portal')
    
    # Process approved command
    subparsers.add_parser('process-approved', help='Process approved stories')
    
    # Schedule week command
    subparsers.add_parser('schedule-week', help='Schedule content for the week')
    
    # Status command
    subparsers.add_parser('status', help='Show current workflow status')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    workflow_manager = EditorialWorkflow()
    
    if args.command == 'generate-candidates':
        workflow_manager.generate_weekly_candidates(args.count)
    
    elif args.command == 'review-portal':
        print("🚀 Starting Editorial Review Portal...")
        print("📝 Visit http://localhost:5002 to review stories")
        print("🛑 Press Ctrl+C to stop")
        app.run(host='0.0.0.0', port=5002, debug=True)
    
    elif args.command == 'process-approved':
        workflow_manager.process_approved_stories()
    
    elif args.command == 'schedule-week':
        workflow_manager.schedule_weekly_content()
    
    elif args.command == 'status':
        # Show current status
        pending = workflow_manager.get_pending_candidates()
        approved = workflow_manager.get_approved_stories()
        
        print(f"📊 Editorial Workflow Status")
        print(f"   Pending Review: {len(pending)}")
        print(f"   Approved: {len(approved)}")
        print(f"   Ready for Processing: {len(approved)}")

if __name__ == '__main__':
    main()
