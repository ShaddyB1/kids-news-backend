#!/usr/bin/env python3
"""
Simple Web Interface for Content Management
===========================================

A simple Flask web interface for adding articles and videos to the Junior News Digest backend.
Run this locally to easily add content through a web form.

Usage:
    python content_admin.py
    # Then visit http://localhost:5001 in your browser
"""

from flask import Flask, render_template_string, request, redirect, url_for, flash
import sys
import os

# Add the production directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from add_content import ContentManager

app = Flask(__name__)
app.secret_key = 'junior-news-admin-secret-key-2024'

# Initialize content manager
cm = ContentManager()

# HTML Templates
ADMIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Junior News Digest - Content Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #4A90E2; margin-bottom: 30px; }
        .nav { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; }
        .nav a { background: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #357ABD; }
        .nav a.active { background: #2E5C8A; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        textarea { height: 200px; resize: vertical; }
        .checkbox-group { display: flex; gap: 20px; align-items: center; }
        .checkbox-group input { width: auto; margin-right: 5px; }
        button { background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #45a049; }
        .flash-messages { margin-bottom: 20px; }
        .flash-success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .flash-error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
        .content-list { margin-top: 30px; }
        .content-item { background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
        .content-title { font-weight: bold; color: #2E5C8A; }
        .content-meta { color: #666; font-size: 12px; margin-top: 5px; }
        .badges { margin-top: 5px; }
        .badge { background: #6c757d; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 5px; }
        .badge.breaking { background: #dc3545; }
        .badge.trending { background: #fd7e14; }
        .badge.hot { background: #ffc107; color: #000; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📰 Junior News Digest</h1>
            <h2>Content Administration</h2>
        </div>
        
        <div class="nav">
            <a href="/" class="{{ 'active' if page == 'home' else '' }}">📊 Dashboard</a>
            <a href="/add-article" class="{{ 'active' if page == 'add-article' else '' }}">📝 Add Article</a>
            <a href="/add-video" class="{{ 'active' if page == 'add-video' else '' }}">🎥 Add Video</a>
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
        
        {% block content %}{% endblock %}
    </div>
</body>
</html>
'''

DASHBOARD_TEMPLATE = '''
{% extends "base.html" %}
{% block content %}
<h3>📊 Content Overview</h3>
<p>Welcome to the Junior News Digest content management system!</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
    <div>
        <h4>📰 Recent Articles ({{ articles|length }})</h4>
        <div class="content-list">
            {% for article in articles %}
            <div class="content-item">
                <div class="content-title">{{ article[1] }}</div>
                <div class="content-meta">{{ article[3] }} • {{ article[4][:19] }}</div>
                <div class="badges">
                    {% if article[5] %}<span class="badge breaking">🔴 BREAKING</span>{% endif %}
                    {% if article[6] %}<span class="badge trending">🔥 TRENDING</span>{% endif %}
                    {% if article[7] %}<span class="badge hot">⚡ HOT</span>{% endif %}
                    <span class="badge">{{ article[2] }}</span>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
    
    <div>
        <h4>🎥 Recent Videos ({{ videos|length }})</h4>
        <div class="content-list">
            {% for video in videos %}
            <div class="content-item">
                <div class="content-title">{{ video[1] }}</div>
                <div class="content-meta">{{ video[3] }} • {{ video[4][:19] }} • {{ video[2] }}</div>
                <div class="badges">
                    <span class="badge">{{ video[5] }}</span>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>
{% endblock %}
'''

ADD_ARTICLE_TEMPLATE = '''
{% extends "base.html" %}
{% block content %}
<h3>📝 Add New Article</h3>
<form method="POST">
    <div class="form-group">
        <label for="title">Article Title *</label>
        <input type="text" id="title" name="title" required placeholder="Enter an engaging title for kids...">
    </div>
    
    <div class="form-group">
        <label for="content">Article Content *</label>
        <textarea id="content" name="content" required placeholder="Write the full article content here. Make it engaging and appropriate for ages 6-12..."></textarea>
    </div>
    
    <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" name="category" required>
            <option value="">Select a category...</option>
            <option value="technology">🤖 Technology</option>
            <option value="science">🔬 Science</option>
            <option value="environment">🌍 Environment</option>
            <option value="health">🏥 Health</option>
            <option value="education">📚 Education</option>
            <option value="sports">⚽ Sports</option>
            <option value="culture">🎨 Culture</option>
            <option value="general">📰 General</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="author">Author</label>
        <input type="text" id="author" name="author" value="Junior News Team" placeholder="Author name...">
    </div>
    
    <div class="form-group">
        <label for="summary">Summary (optional)</label>
        <textarea id="summary" name="summary" style="height: 80px;" placeholder="Brief summary (auto-generated if left empty)..."></textarea>
    </div>
    
    <div class="form-group">
        <label>Special Flags</label>
        <div class="checkbox-group">
            <label><input type="checkbox" name="breaking"> 🔴 Breaking News</label>
            <label><input type="checkbox" name="trending"> 🔥 Trending</label>
            <label><input type="checkbox" name="hot"> ⚡ Hot Topic</label>
        </div>
    </div>
    
    <button type="submit">📝 Add Article</button>
</form>
{% endblock %}
'''

ADD_VIDEO_TEMPLATE = '''
{% extends "base.html" %}
{% block content %}
<h3>🎥 Add New Video</h3>
<form method="POST">
    <div class="form-group">
        <label for="title">Video Title *</label>
        <input type="text" id="title" name="title" required placeholder="Enter an engaging video title...">
    </div>
    
    <div class="form-group">
        <label for="video_url">Video URL *</label>
        <input type="url" id="video_url" name="video_url" required placeholder="https://example.com/videos/my-video.mp4">
    </div>
    
    <div class="form-group">
        <label for="description">Description *</label>
        <textarea id="description" name="description" required style="height: 100px;" placeholder="Describe what kids will learn from this video..."></textarea>
    </div>
    
    <div class="form-group">
        <label for="duration">Duration</label>
        <input type="text" id="duration" name="duration" value="5:30" placeholder="5:30" pattern="[0-9]+:[0-9]{2}">
        <small style="color: #666;">Format: MM:SS (e.g., 5:30)</small>
    </div>
    
    <div class="form-group">
        <label for="thumbnail_url">Thumbnail URL (optional)</label>
        <input type="url" id="thumbnail_url" name="thumbnail_url" placeholder="https://example.com/thumbnails/my-video.jpg">
    </div>
    
    <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" name="category" required>
            <option value="">Select a category...</option>
            <option value="technology">🤖 Technology</option>
            <option value="science">🔬 Science</option>
            <option value="environment">🌍 Environment</option>
            <option value="health">🏥 Health</option>
            <option value="education">📚 Education</option>
            <option value="sports">⚽ Sports</option>
            <option value="culture">🎨 Culture</option>
            <option value="general">📰 General</option>
        </select>
    </div>
    
    <button type="submit">🎥 Add Video</button>
</form>
{% endblock %}
'''

@app.context_processor
def utility_processor():
    def get_page():
        return request.endpoint or 'home'
    return dict(page=get_page())

@app.route('/')
def dashboard():
    try:
        # Get recent articles
        cursor = cm.db.conn.cursor()
        cursor.execute('''
            SELECT id, title, category, author, published_date, is_breaking, is_trending, is_hot
            FROM articles 
            ORDER BY published_date DESC 
            LIMIT 10
        ''')
        articles = cursor.fetchall()
        
        # Get recent videos
        cursor.execute('''
            SELECT id, title, duration, category, published_date, category
            FROM videos 
            ORDER BY published_date DESC 
            LIMIT 10
        ''')
        videos = cursor.fetchall()
        
        # Render with base template
        template = ADMIN_TEMPLATE.replace('{% block content %}{% endblock %}', DASHBOARD_TEMPLATE)
        return render_template_string(template, articles=articles, videos=videos, page='home')
        
    except Exception as e:
        flash(f'Error loading dashboard: {e}', 'error')
        return render_template_string(ADMIN_TEMPLATE.replace('{% block content %}{% endblock %}', '<p>Error loading content.</p>'))

@app.route('/add-article', methods=['GET', 'POST'])
def add_article():
    if request.method == 'POST':
        try:
            title = request.form['title']
            content = request.form['content']
            category = request.form['category']
            author = request.form['author'] or 'Junior News Team'
            summary = request.form['summary'] or None
            is_breaking = 'breaking' in request.form
            is_trending = 'trending' in request.form
            is_hot = 'hot' in request.form
            
            article_id = cm.add_article(
                title=title,
                content=content,
                category=category,
                author=author,
                summary=summary,
                is_breaking=is_breaking,
                is_trending=is_trending,
                is_hot=is_hot
            )
            
            if article_id:
                flash(f'✅ Article "{title}" added successfully!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('❌ Error adding article. Please try again.', 'error')
                
        except Exception as e:
            flash(f'❌ Error: {e}', 'error')
    
    template = ADMIN_TEMPLATE.replace('{% block content %}{% endblock %}', ADD_ARTICLE_TEMPLATE)
    return render_template_string(template, page='add-article')

@app.route('/add-video', methods=['GET', 'POST'])
def add_video():
    if request.method == 'POST':
        try:
            title = request.form['title']
            video_url = request.form['video_url']
            description = request.form['description']
            duration = request.form['duration'] or '5:30'
            thumbnail_url = request.form['thumbnail_url'] or None
            category = request.form['category']
            
            video_id = cm.add_video(
                title=title,
                video_url=video_url,
                description=description,
                duration=duration,
                thumbnail_url=thumbnail_url,
                category=category
            )
            
            if video_id:
                flash(f'✅ Video "{title}" added successfully!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('❌ Error adding video. Please try again.', 'error')
                
        except Exception as e:
            flash(f'❌ Error: {e}', 'error')
    
    template = ADMIN_TEMPLATE.replace('{% block content %}{% endblock %}', ADD_VIDEO_TEMPLATE)
    return render_template_string(template, page='add-video')

if __name__ == '__main__':
    print("🚀 Starting Junior News Digest Content Admin...")
    print("📝 Visit http://localhost:5001 to manage content")
    print("🛑 Press Ctrl+C to stop")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
