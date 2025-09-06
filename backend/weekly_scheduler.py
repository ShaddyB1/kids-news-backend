#!/usr/bin/env python3
"""
Weekly Content Scheduler for Junior News Digest
===============================================

Automates the weekly editorial workflow:
- Sunday: Generate candidate stories
- Monday/Wednesday/Friday: Publish scheduled content

Usage:
    python weekly_scheduler.py --check-schedule    # Check what should run today
    python weekly_scheduler.py --run-today         # Run today's scheduled tasks
    python weekly_scheduler.py --setup-cron        # Set up automated cron jobs
"""

import argparse
import sys
import os
import sqlite3
from datetime import datetime, date, timedelta
import subprocess
import json

# Add the production directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from editorial_workflow import EditorialWorkflow
from add_content import ContentManager

class WeeklyScheduler:
    """Manages automated weekly content scheduling"""
    
    def __init__(self):
        self.workflow = EditorialWorkflow()
        self.content_manager = ContentManager()
    
    def check_todays_tasks(self):
        """Check what tasks should run today"""
        today = date.today()
        day_name = today.strftime('%A')
        
        print(f"📅 Today is {day_name}, {today}")
        print("🔍 Checking scheduled tasks...")
        
        tasks = []
        
        # Sunday: Generate candidate stories
        if day_name == 'Sunday':
            tasks.append({
                'type': 'generate_candidates',
                'description': 'Generate 15-20 candidate stories for editorial review',
                'priority': 'high'
            })
        
        # Monday, Wednesday, Friday: Check for scheduled content
        if day_name in ['Monday', 'Wednesday', 'Friday']:
            scheduled_content = self._get_scheduled_content_for_today()
            if scheduled_content:
                tasks.append({
                    'type': 'publish_content',
                    'description': f'Publish {len(scheduled_content)} scheduled articles',
                    'priority': 'high',
                    'content': scheduled_content
                })
        
        # Check if there are approved stories ready for processing
        approved_stories = self.workflow.get_approved_stories()
        if approved_stories:
            tasks.append({
                'type': 'process_approved',
                'description': f'Process {len(approved_stories)} approved stories',
                'priority': 'medium'
            })
        
        # Check if there are unscheduled processed stories
        unscheduled = self._get_unscheduled_stories()
        if unscheduled:
            tasks.append({
                'type': 'schedule_content',
                'description': f'Schedule {len(unscheduled)} processed stories for the week',
                'priority': 'medium'
            })
        
        return tasks
    
    def _get_scheduled_content_for_today(self):
        """Get content scheduled for today"""
        today = date.today()
        
        conn = sqlite3.connect(self.workflow.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT ws.candidate_id, cs.title, cs.final_title, cs.final_content, 
                   cs.final_summary, cs.category, cs.author, cs.is_breaking, 
                   cs.is_trending, cs.is_hot
            FROM weekly_schedule ws
            JOIN candidate_stories cs ON ws.candidate_id = cs.id
            WHERE ws.scheduled_date = ? AND ws.status = 'scheduled'
        ''', (today.isoformat(),))
        
        scheduled = []
        for row in cursor.fetchall():
            scheduled.append({
                'candidate_id': row[0],
                'title': row[2] or row[1],  # Use final_title if available
                'content': row[3] or '',   # final_content
                'summary': row[4] or '',   # final_summary
                'category': row[5],
                'author': row[6],
                'is_breaking': row[7],
                'is_trending': row[8],
                'is_hot': row[9]
            })
        
        conn.close()
        return scheduled
    
    def _get_unscheduled_stories(self):
        """Get processed stories that haven't been scheduled yet"""
        today = date.today()
        monday = today - timedelta(days=today.weekday())
        
        conn = sqlite3.connect(self.workflow.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT cs.id, cs.title
            FROM candidate_stories cs
            LEFT JOIN weekly_schedule ws ON cs.id = ws.candidate_id 
                AND ws.week_start_date = ?
            WHERE cs.status = 'processed' AND ws.candidate_id IS NULL
        ''', (monday.isoformat(),))
        
        unscheduled = cursor.fetchall()
        conn.close()
        
        return [{'id': row[0], 'title': row[1]} for row in unscheduled]
    
    def run_todays_tasks(self):
        """Execute today's scheduled tasks"""
        tasks = self.check_todays_tasks()
        
        if not tasks:
            print("✅ No tasks scheduled for today")
            return
        
        print(f"🚀 Running {len(tasks)} tasks for today...")
        
        for task in tasks:
            print(f"\n📋 Task: {task['description']}")
            
            try:
                if task['type'] == 'generate_candidates':
                    self._run_generate_candidates()
                
                elif task['type'] == 'publish_content':
                    self._run_publish_content(task['content'])
                
                elif task['type'] == 'process_approved':
                    self._run_process_approved()
                
                elif task['type'] == 'schedule_content':
                    self._run_schedule_content()
                
                print(f"✅ Completed: {task['description']}")
                
            except Exception as e:
                print(f"❌ Error in task '{task['description']}': {e}")
        
        print(f"\n🎉 All tasks completed for {date.today()}")
    
    def _run_generate_candidates(self):
        """Generate candidate stories"""
        self.workflow.generate_weekly_candidates(20)
        
        # Send notification to editor
        self._send_editor_notification(
            "📰 Weekly Story Candidates Ready",
            f"20 new story candidates have been generated and are ready for editorial review.\n\n"
            f"Please visit the Editorial Review Portal to review and approve stories:\n"
            f"http://localhost:5002\n\n"
            f"Or run: python editorial_workflow.py review-portal"
        )
    
    def _run_publish_content(self, scheduled_content):
        """Publish scheduled content"""
        published_count = 0
        
        for content in scheduled_content:
            try:
                # Add article to main database
                article_id = self.content_manager.add_article(
                    title=content['title'],
                    content=content['content'] or f"This is the content for {content['title']}. The full article will be available soon.",
                    category=content['category'],
                    author=content['author'],
                    summary=content['summary'] or content['title'],
                    is_breaking=content['is_breaking'],
                    is_trending=content['is_trending'],
                    is_hot=content['is_hot']
                )
                
                if article_id:
                    # Mark as published in schedule
                    self._mark_content_published(content['candidate_id'])
                    published_count += 1
                    print(f"   ✅ Published: {content['title']}")
                
            except Exception as e:
                print(f"   ❌ Error publishing '{content['title']}': {e}")
        
        print(f"📱 Published {published_count} articles to the app")
        
        # Send notification
        if published_count > 0:
            self._send_editor_notification(
                f"📱 {published_count} Articles Published",
                f"{published_count} articles have been automatically published to the Junior News Digest app.\n\n"
                f"Published on: {date.today().strftime('%A, %B %d, %Y')}"
            )
    
    def _mark_content_published(self, candidate_id):
        """Mark scheduled content as published"""
        conn = sqlite3.connect(self.workflow.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE weekly_schedule 
            SET status = 'published'
            WHERE candidate_id = ? AND scheduled_date = ?
        ''', (candidate_id, date.today().isoformat()))
        
        conn.commit()
        conn.close()
    
    def _run_process_approved(self):
        """Process approved stories"""
        self.workflow.process_approved_stories()
    
    def _run_schedule_content(self):
        """Schedule processed content for the week"""
        self.workflow.schedule_weekly_content()
    
    def _send_editor_notification(self, subject, message):
        """Send notification to editor (placeholder for email/Slack integration)"""
        print(f"\n📧 NOTIFICATION: {subject}")
        print(f"📝 {message}")
        
        # TODO: Implement actual notification system
        # - Email notification
        # - Slack notification  
        # - Push notification
        # - SMS notification
    
    def setup_cron_jobs(self):
        """Set up automated cron jobs for the weekly workflow"""
        
        cron_jobs = [
            # Sunday at 9:00 AM: Generate candidate stories
            "0 9 * * 0 cd /Users/shadrackaddo/Desktop/projects/junior\\ graphic/production && /usr/local/bin/python3 weekly_scheduler.py --run-today",
            
            # Monday, Wednesday, Friday at 8:00 AM: Publish scheduled content
            "0 8 * * 1,3,5 cd /Users/shadrackaddo/Desktop/projects/junior\\ graphic/production && /usr/local/bin/python3 weekly_scheduler.py --run-today",
            
            # Daily at 6:00 PM: Check for any pending tasks
            "0 18 * * * cd /Users/shadrackaddo/Desktop/projects/junior\\ graphic/production && /usr/local/bin/python3 weekly_scheduler.py --check-schedule"
        ]
        
        print("⚙️ Setting up automated cron jobs...")
        print("\n📋 Cron jobs to add:")
        
        for job in cron_jobs:
            print(f"   {job}")
        
        print(f"\n🔧 To set up these cron jobs, run:")
        print(f"   crontab -e")
        print(f"\nThen add the above lines to your crontab file.")
        
        print(f"\n📅 Weekly Schedule:")
        print(f"   Sunday 9:00 AM    - Generate 20 candidate stories")
        print(f"   Monday 8:00 AM    - Publish scheduled articles")  
        print(f"   Wednesday 8:00 AM - Publish scheduled articles")
        print(f"   Friday 8:00 AM    - Publish scheduled articles")
        print(f"   Daily 6:00 PM     - Check for pending tasks")
        
        return cron_jobs
    
    def show_weekly_overview(self):
        """Show overview of the current week's content"""
        today = date.today()
        monday = today - timedelta(days=today.weekday())
        
        print(f"📅 Weekly Content Overview")
        print(f"   Week of: {monday.strftime('%B %d, %Y')}")
        print(f"   Today: {today.strftime('%A, %B %d, %Y')}")
        print()
        
        # Get this week's schedule
        conn = sqlite3.connect(self.workflow.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT ws.day_of_week, ws.scheduled_date, cs.title, ws.status
            FROM weekly_schedule ws
            JOIN candidate_stories cs ON ws.candidate_id = cs.id
            WHERE ws.week_start_date = ?
            ORDER BY ws.scheduled_date
        ''', (monday.isoformat(),))
        
        schedule = cursor.fetchall()
        
        if schedule:
            print("📰 Scheduled Content:")
            current_day = None
            for day, date_str, title, status in schedule:
                if day != current_day:
                    print(f"\n   {day} ({date_str}):")
                    current_day = day
                
                status_emoji = "✅" if status == "published" else "📅"
                print(f"     {status_emoji} {title}")
        else:
            print("📝 No content scheduled for this week yet")
        
        # Show pending candidates
        pending = self.workflow.get_pending_candidates()
        if pending:
            print(f"\n🔍 Pending Review: {len(pending)} candidate stories")
        
        # Show approved stories
        approved = self.workflow.get_approved_stories()
        if approved:
            print(f"✅ Approved: {len(approved)} stories ready for processing")
        
        conn.close()

def main():
    parser = argparse.ArgumentParser(description='Junior News Digest Weekly Scheduler')
    parser.add_argument('--check-schedule', action='store_true', help='Check what tasks should run today')
    parser.add_argument('--run-today', action='store_true', help='Run today\'s scheduled tasks')
    parser.add_argument('--setup-cron', action='store_true', help='Set up automated cron jobs')
    parser.add_argument('--overview', action='store_true', help='Show weekly content overview')
    
    args = parser.parse_args()
    
    if not any([args.check_schedule, args.run_today, args.setup_cron, args.overview]):
        parser.print_help()
        return
    
    scheduler = WeeklyScheduler()
    
    if args.check_schedule:
        tasks = scheduler.check_todays_tasks()
        
        if tasks:
            print(f"📋 Tasks scheduled for today:")
            for task in tasks:
                priority_emoji = "🔥" if task['priority'] == 'high' else "📝"
                print(f"   {priority_emoji} {task['description']}")
        else:
            print("✅ No tasks scheduled for today")
    
    if args.run_today:
        scheduler.run_todays_tasks()
    
    if args.setup_cron:
        scheduler.setup_cron_jobs()
    
    if args.overview:
        scheduler.show_weekly_overview()

if __name__ == '__main__':
    main()
