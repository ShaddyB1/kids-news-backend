#!/usr/bin/env python3
"""
Quiz generation script for stories
"""

import sqlite3
import uuid
import json
from datetime import datetime

def generate_quiz_for_article(article_id: str):
    """Generate a quiz for a specific article"""
    
    # Connect to databases
    conn_articles = sqlite3.connect('junior_news_integrated.db')
    conn_editorial = sqlite3.connect('automated_editorial.db')
    
    cursor_articles = conn_articles.cursor()
    cursor_editorial = conn_editorial.cursor()
    
    # Get article details
    cursor_articles.execute('SELECT title, content, category FROM articles WHERE id = ?', (article_id,))
    article = cursor_articles.fetchone()
    
    if not article:
        print(f"❌ Article {article_id} not found!")
        return None
    
    title, content, category = article
    
    # Generate quiz questions based on content
    quiz_questions = generate_questions_from_content(title, content, category)
    
    # Create quiz ID
    quiz_id = f"quiz_{article_id}"
    
    # Create quizzes table if it doesn't exist
    cursor_articles.execute('''
        CREATE TABLE IF NOT EXISTS quizzes (
            id TEXT PRIMARY KEY,
            article_id TEXT NOT NULL,
            title TEXT NOT NULL,
            questions TEXT NOT NULL,
            total_questions INTEGER NOT NULL,
            created_date TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles (id)
        )
    ''')
    
    # Insert quiz
    cursor_articles.execute('''
        INSERT OR REPLACE INTO quizzes 
        (id, article_id, title, questions, total_questions, created_date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        quiz_id,
        article_id,
        f"Quiz: {title}",
        json.dumps(quiz_questions),
        len(quiz_questions),
        datetime.now().isoformat()
    ))
    
    conn_articles.commit()
    conn_articles.close()
    conn_editorial.close()
    
    print(f"✅ Generated quiz for article: {title}")
    return quiz_id

def generate_questions_from_content(title, content, category):
    """Generate quiz questions based on article content"""
    
    # Simple question templates based on content analysis
    questions = []
    
    # Question 1: Main topic
    questions.append({
        "id": str(uuid.uuid4()),
        "question": f"What is the main topic of this story?",
        "options": [
            title,
            "A different story",
            "Something else",
            "I don't know"
        ],
        "correct_answer": 0,
        "explanation": f"The main topic is: {title}"
    })
    
    # Question 2: Category
    category_options = {
        'environment': ['Protecting nature', 'Space exploration', 'Sports', 'Technology'],
        'science': ['Scientific discovery', 'Sports', 'Art', 'Music'],
        'technology': ['New inventions', 'Nature', 'Sports', 'Art'],
        'sports': ['Athletic achievement', 'Science', 'Art', 'Nature'],
        'health': ['Health and wellness', 'Sports', 'Art', 'Technology']
    }
    
    if category in category_options:
        options = category_options[category].copy()
        if category == 'environment':
            correct_idx = 0
        elif category == 'science':
            correct_idx = 0
        elif category == 'technology':
            correct_idx = 0
        elif category == 'sports':
            correct_idx = 0
        elif category == 'health':
            correct_idx = 0
        else:
            correct_idx = 0
    else:
        options = ['Amazing discovery', 'Sports news', 'Art project', 'Music event']
        correct_idx = 0
    
    questions.append({
        "id": str(uuid.uuid4()),
        "question": f"What category does this story belong to?",
        "options": options,
        "correct_answer": correct_idx,
        "explanation": f"This story is about {category}!"
    })
    
    # Question 3: Key detail from content
    if "robot" in content.lower():
        questions.append({
            "id": str(uuid.uuid4()),
            "question": "What special invention is mentioned in this story?",
            "options": ["A robot", "A car", "A book", "A toy"],
            "correct_answer": 0,
            "explanation": "The story mentions a robot that helps solve problems!"
        })
    elif "scientists" in content.lower():
        questions.append({
            "id": str(uuid.uuid4()),
            "question": "Who made the discovery in this story?",
            "options": ["Scientists", "Artists", "Musicians", "Athletes"],
            "correct_answer": 0,
            "explanation": "Scientists made the amazing discovery!"
        })
    elif "students" in content.lower() or "kids" in content.lower():
        questions.append({
            "id": str(uuid.uuid4()),
            "question": "Who are the main characters in this story?",
            "options": ["Students/Kids", "Adults", "Animals", "Robots"],
            "correct_answer": 0,
            "explanation": "Students and kids are the heroes of this story!"
        })
    else:
        questions.append({
            "id": str(uuid.uuid4()),
            "question": "What makes this story special?",
            "options": ["Young people helping", "Adults working", "Animals playing", "Robots dancing"],
            "correct_answer": 0,
            "explanation": "This story shows how young people can make a difference!"
        })
    
    # Question 4: Impact/Why it matters
    questions.append({
        "id": str(uuid.uuid4()),
        "question": "Why is this story important for kids?",
        "options": [
            "It shows kids can make a difference",
            "It's just entertainment",
            "It's about adults only",
            "It doesn't matter"
        ],
        "correct_answer": 0,
        "explanation": "This story shows that kids have the power to change the world!"
    })
    
    # Question 5: Fun fact
    questions.append({
        "id": str(uuid.uuid4()),
        "question": "What can you learn from this story?",
        "options": [
            "Teamwork and creativity are powerful",
            "Only adults can solve problems",
            "Kids should never try new things",
            "Science is boring"
        ],
        "correct_answer": 0,
        "explanation": "You can learn that teamwork, creativity, and trying new things can solve big problems!"
    })
    
    return questions

def generate_quizzes_for_all_articles():
    """Generate quizzes for all articles that don't have them"""
    
    conn = sqlite3.connect('junior_news_integrated.db')
    cursor = conn.cursor()
    
    # Get all articles
    cursor.execute('SELECT id, title FROM articles')
    articles = cursor.fetchall()
    
    # Get existing quizzes (create table if it doesn't exist)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quizzes (
            id TEXT PRIMARY KEY,
            article_id TEXT NOT NULL,
            title TEXT NOT NULL,
            questions TEXT NOT NULL,
            total_questions INTEGER NOT NULL,
            created_date TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles (id)
        )
    ''')
    
    cursor.execute('SELECT article_id FROM quizzes')
    existing_quizzes = [row[0] for row in cursor.fetchall()]
    
    generated_count = 0
    for article_id, title in articles:
        if article_id not in existing_quizzes:
            quiz_id = generate_quiz_for_article(article_id)
            if quiz_id:
                generated_count += 1
                print(f"✅ Generated quiz for: {title}")
        else:
            print(f"⏭️  Quiz already exists for: {title}")
    
    conn.close()
    print(f"\n🎉 Generated {generated_count} new quizzes!")

if __name__ == "__main__":
    generate_quizzes_for_all_articles()
