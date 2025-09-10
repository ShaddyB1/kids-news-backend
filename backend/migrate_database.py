#!/usr/bin/env python3
"""
Database Migration Script for Junior News Digest
===============================================

Adds the script column to existing automated_stories table
"""

import sqlite3
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_database(db_path: str = "editorial_automation.db"):
    """Add script column to existing database"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if script column exists
        cursor.execute("PRAGMA table_info(automated_stories)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'script' not in columns:
            logger.info("Adding script column to automated_stories table...")
            cursor.execute('''
                ALTER TABLE automated_stories 
                ADD COLUMN script TEXT NOT NULL DEFAULT ''
            ''')
            
            # Update existing stories with generated scripts
            cursor.execute("SELECT id, title, content FROM automated_stories")
            stories = cursor.fetchall()
            
            for story_id, title, content in stories:
                script_parts = [
                    f"Hi kids! Today we have an amazing story called '{title}'!",
                    "",
                    "Let me tell you what happened:",
                    "",
                    content,
                    "",
                    "Isn't that incredible? This shows us that with creativity and hard work, we can make amazing things happen!",
                    "",
                    "What do you think about this story? Remember, you can make a difference too!",
                    "",
                    "Thanks for watching Junior News Digest! See you next time!"
                ]
                
                script = "\n".join(script_parts)
                
                cursor.execute('''
                    UPDATE automated_stories 
                    SET script = ?
                    WHERE id = ?
                ''', (script, story_id))
            
            conn.commit()
            logger.info(f"✅ Successfully added script column and generated scripts for {len(stories)} existing stories")
        else:
            logger.info("✅ Script column already exists")
        
        # Update publishing_schedule table structure if needed
        cursor.execute("PRAGMA table_info(publishing_schedule)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'publish_day' not in columns:
            logger.info("Updating publishing_schedule table structure...")
            
            # Create new table with updated structure
            cursor.execute('''
                CREATE TABLE publishing_schedule_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    week_start_date TEXT NOT NULL,
                    publish_day TEXT NOT NULL,
                    story_id TEXT NOT NULL,
                    story_order INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'scheduled',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Migrate existing data if any
            cursor.execute("SELECT * FROM publishing_schedule")
            old_data = cursor.fetchall()
            
            for row in old_data:
                # Convert old format to new format
                if len(row) >= 5:  # Has monday_story_id, etc.
                    week_start_date, monday_id, wednesday_id, friday_id = row[1:5]
                    
                    if monday_id:
                        cursor.execute('''
                            INSERT INTO publishing_schedule_new 
                            (week_start_date, publish_day, story_id, story_order, status)
                            VALUES (?, ?, ?, ?, ?)
                        ''', (week_start_date, 'Monday', monday_id, 1, 'scheduled'))
                    
                    if wednesday_id:
                        cursor.execute('''
                            INSERT INTO publishing_schedule_new 
                            (week_start_date, publish_day, story_id, story_order, status)
                            VALUES (?, ?, ?, ?, ?)
                        ''', (week_start_date, 'Wednesday', wednesday_id, 1, 'scheduled'))
                    
                    if friday_id:
                        cursor.execute('''
                            INSERT INTO publishing_schedule_new 
                            (week_start_date, publish_day, story_id, story_order, status)
                            VALUES (?, ?, ?, ?, ?)
                        ''', (week_start_date, 'Friday', friday_id, 1, 'scheduled'))
            
            # Replace old table with new table
            cursor.execute("DROP TABLE publishing_schedule")
            cursor.execute("ALTER TABLE publishing_schedule_new RENAME TO publishing_schedule")
            
            conn.commit()
            logger.info("✅ Successfully updated publishing_schedule table structure")
        else:
            logger.info("✅ Publishing schedule table already has correct structure")
        
        conn.close()
        logger.info("🎉 Database migration completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Database migration failed: {e}")
        raise

if __name__ == '__main__':
    migrate_database()
