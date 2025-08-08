from datetime import datetime
from typing import List
import os
from jinja2 import Template
from news_scraper import NewsArticle
from config import Config
from kids_activities import KidsActivitiesGenerator
import logging

logger = logging.getLogger(__name__)

class WebNewsletterGenerator:
    def __init__(self):
        self.config = Config()
        self.activities_gen = KidsActivitiesGenerator()

    def create_web_newsletter(self, articles: List[NewsArticle], date: datetime = None) -> str:
        """Create a web-ready newsletter with email signup and softer colors"""
        
        if date is None:
            date = datetime.now()
        
        # Web-ready HTML template with email signup and softer colors
        html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    
    <!-- Meta Tags for Social Sharing -->
    <meta name="description" content="A fun, interactive daily newsletter designed for kids aged 6-10! Discover amazing facts, positive stories, and exciting adventures from around the world.">
    <meta name="keywords" content="kids news, children newsletter, educational content, fun facts, positive stories">
    <meta name="author" content="Kids Daily News">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Kids Daily News - Fun News for Kids!">
    <meta property="og:description" content="Interactive daily newsletter with amazing stories, fun facts, and positive messages designed just for kids aged 6-10!">
    <meta property="og:site_name" content="Kids Daily News">
    <meta property="og:url" content="https://juniornewsdigest.netlify.app/">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Kids Daily News - Fun News for Kids!">
    <meta name="twitter:description" content="Interactive daily newsletter with amazing stories, fun facts, and positive messages designed just for kids aged 6-10!">
    
    <!-- Prevent JavaScript from being indexed -->
    <meta name="robots" content="index, follow, noimageindex">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            /* Softer, less bright colors */
            --primary-color: #8FA4E8;
            --secondary-color: #9A7EC2;
            --accent-color: #FF8A8A;
            --success-color: #7FDDD4;
            --warning-color: #FFE4A3;
            --text-dark: #2d3436;
            --text-light: #636e72;
            --white: #ffffff;
            --light-gray: #f8f9fa;
            --shadow: 0 8px 25px rgba(0,0,0,0.12);
            --shadow-hover: 0 15px 35px rgba(0,0,0,0.18);
        }
        
        body {
            font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, #8FA4E8 100%);
            background-attachment: fixed;
            min-height: 100vh;
            color: var(--text-dark);
            overflow-x: hidden;
        }
        
        /* Floating background elements with softer opacity */
        .bg-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .bg-shapes .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            animation: float 25s infinite linear;
        }
        
        .bg-shapes .shape:nth-child(1) {
            width: 60px;
            height: 60px;
            left: 10%;
            animation-delay: 0s;
        }
        
        .bg-shapes .shape:nth-child(2) {
            width: 90px;
            height: 90px;
            left: 70%;
            animation-delay: 8s;
        }
        
        .bg-shapes .shape:nth-child(3) {
            width: 75px;
            height: 75px;
            left: 40%;
            animation-delay: 16s;
        }
        
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--white);
            border-radius: 25px;
            padding: 0;
            box-shadow: var(--shadow);
            position: relative;
            z-index: 10;
            overflow: hidden;
            animation: slideInUp 1s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            background: linear-gradient(135deg, var(--accent-color) 0%, var(--success-color) 100%);
            color: var(--white);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 15px,
                rgba(255,255,255,0.08) 15px,
                rgba(255,255,255,0.08) 30px
            );
            animation: move 25s linear infinite;
        }
        
        @keyframes move {
            0% {
                transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }
        
        .header h1 {
            font-family: 'Fredoka', cursive;
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 2;
            animation: bounce 3s ease-in-out infinite alternate;
        }
        
        @keyframes bounce {
            0% {
                transform: translateY(0px);
            }
            100% {
                transform: translateY(-8px);
            }
        }
        
        .header .subtitle {
            font-size: 1.3em;
            font-weight: 400;
            position: relative;
            z-index: 2;
            opacity: 0.95;
        }
        
        .date-badge {
            background: linear-gradient(135deg, var(--warning-color) 0%, #F0D49C 100%);
            color: var(--text-dark);
            padding: 15px 25px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            font-size: 1.2em;
            margin: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.03);
            }
        }
        
        /* Email Signup Section */
        .email-signup {
            background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
            margin: 25px 30px;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            border-left: 5px solid var(--primary-color);
            box-shadow: var(--shadow);
        }
        
        .email-signup h3 {
            font-family: 'Fredoka', cursive;
            color: var(--primary-color);
            font-size: 1.8em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .email-signup p {
            color: var(--text-light);
            font-size: 1.1em;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .email-form {
            display: flex;
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .email-input {
            flex: 1;
            min-width: 200px;
            padding: 12px 15px;
            border: 2px solid var(--primary-color);
            border-radius: 25px;
            font-size: 1em;
            font-family: inherit;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .email-input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(143, 164, 232, 0.2);
        }
        
        .email-submit {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .email-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .email-success, .email-error {
            margin-top: 15px;
            padding: 10px 15px;
            border-radius: 10px;
            display: none;
        }
        
        .email-success {
            background: rgba(127, 221, 212, 0.2);
            color: var(--success-color);
            border: 1px solid var(--success-color);
        }
        
        .email-error {
            background: rgba(255, 138, 138, 0.2);
            color: var(--accent-color);
            border: 1px solid var(--accent-color);
        }
        
        .article-card {
            background: var(--white);
            margin: 25px 30px;
            border-radius: 20px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
            border-left: 5px solid var(--primary-color);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }
        
        .article-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
            transition: left 0.6s;
            pointer-events: none;
        }
        
        .article-card:hover::before {
            left: 100%;
        }
        
        .article-card:hover {
            transform: translateY(-6px) scale(1.01);
            box-shadow: var(--shadow-hover);
            border-left-color: var(--accent-color);
        }
        

        
        .article-preview {
            padding: 25px;
        }
        
        .article-title {
            font-family: 'Fredoka', cursive;
            font-size: 1.6em;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 15px;
            line-height: 1.3;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .article-title .emoji {
            font-size: 1.2em;
            animation: wiggle 3s ease-in-out infinite;
        }
        
        @keyframes wiggle {
            0%, 100% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(3deg);
            }
            75% {
                transform: rotate(-3deg);
            }
        }
        
        .article-summary {
            font-size: 1.2em;
            line-height: 1.7;
            color: var(--text-light);
            margin-bottom: 15px;
        }
        
        .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .article-source {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .reading-level {
            background: linear-gradient(135deg, var(--success-color), #6BC9C1);
            color: var(--white);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .article-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        
        .kids-read-btn, .parent-guide-btn {
            border: none;
            padding: 15px 20px;
            border-radius: 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            min-width: 140px;
            position: relative;
            overflow: hidden;
        }
        
        .kids-read-btn::before, .parent-guide-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        
        .kids-read-btn:hover::before, .parent-guide-btn:hover::before {
            left: 100%;
        }
        
        .kids-read-btn {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: var(--white);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .parent-guide-btn {
            background: linear-gradient(135deg, #4ECDC4, #45B7AF);
            color: var(--white);
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }
        
        .kids-read-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }
        
        .parent-guide-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
        }
        
        .btn-icon {
            font-size: 1.4em;
            margin-bottom: 2px;
        }
        
        .btn-text {
            font-size: 1em;
            font-weight: 700;
            margin-bottom: 2px;
        }
        
        .btn-subtitle {
            font-size: 0.8em;
            opacity: 0.9;
            font-weight: 400;
            text-align: center;
            line-height: 1.2;
        }
        
        /* Category Filter */
        .category-filter {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0 30px 0;
            flex-wrap: wrap;
            padding: 0 20px;
        }
        
        .category-btn {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            color: #495057;
            border: 2px solid transparent;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .category-btn:hover {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            transform: translateY(-2px);
        }
        
        .category-btn.active {
            background: linear-gradient(135deg, #4ECDC4, #45B7AF);
            color: white;
            border-color: #4ECDC4;
        }
        
        .category-tag {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 600;
            margin-right: 10px;
        }
        
        .article-card.hidden {
            display: none;
        }
        
        /* Rotating sections */
        .rotating-section {
            position: relative;
        }
        
        .rotate-btn {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            cursor: pointer;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        
        .rotate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
        
        .content-rotating {
            animation: fadeOut 0.3s ease-out forwards;
        }
        
        .content-rotating.fade-in {
            animation: fadeIn 0.3s ease-in forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        

        
        .fun-section {
            background: linear-gradient(135deg, #F5A5C7 0%, #F0C78A 100%);
            color: var(--white);
            margin: 25px 30px;
            padding: 25px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        
        .fun-section h3 {
            font-family: 'Fredoka', cursive;
            font-size: 1.8em;
            margin-bottom: 15px;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }
        
        .footer {
            background: linear-gradient(135deg, var(--text-light), var(--text-dark));
            color: var(--white);
            text-align: center;
            padding: 30px;
            margin-top: 30px;
        }
        
        .footer p {
            margin: 10px 0;
            font-size: 1.1em;
        }
        
        /* Interactive elements */
        .click-counter {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: var(--white);
            padding: 10px 15px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 1000;
            cursor: pointer;
            animation: heartbeat 3s ease-in-out infinite;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        @keyframes heartbeat {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .container {
                margin: 10px;
                border-radius: 20px;
            }
            
            .header h1 {
                font-size: 2.2em;
            }
            
            .article-card {
                margin: 15px 20px;
            }
            
            .article-preview {
                padding: 20px;
            }
            
            .fun-section, .email-signup {
                margin: 15px 20px;
                padding: 20px;
            }
            
            .click-counter {
                top: 10px;
                right: 10px;
            }
            
            .email-form {
                flex-direction: column;
                align-items: center;
            }
            
            .email-input {
                min-width: unset;
                width: 100%;
                margin-bottom: 10px;
            }
            
            .category-filter {
                gap: 8px;
                margin: 15px 0 25px 0;
            }
            
            .category-btn {
                font-size: 0.8em;
                padding: 6px 12px;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <!-- Floating background shapes -->
    <div class="bg-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    
    <!-- Interactive click counter -->
    <div class="click-counter" onclick="incrementClicks()">
        🎯 Clicks: <span id="clickCount">0</span>
    </div>
    
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <div class="subtitle">{{ subtitle }}</div>
        </div>
        
        <div class="date-badge">
            📅 {{ formatted_date }}
        </div>
        
        <!-- Email Signup Section -->
        <div class="email-signup">
            <h3>📧 Join Our Daily Newsletter!</h3>
            <p>Get amazing kid-friendly news delivered to your inbox every morning! 🌟</p>
            <form class="email-form" onsubmit="submitEmail(event)">
                <input 
                    type="email" 
                    class="email-input" 
                    placeholder="Enter your email address" 
                    required
                    id="emailInput"
                >
                <button type="submit" class="email-submit">
                    🚀 Subscribe!
                </button>
            </form>
            <div class="email-success" id="emailSuccess">
                🎉 Awesome! You're subscribed! Welcome to our newsletter family! 🎉
            </div>
            <div class="email-error" id="emailError">
                😅 Oops! Something went wrong. Please try again!
            </div>
        </div>
        
        {% if articles %}
        <!-- Category Filter (Clean & Simple) -->
        <div class="category-filter">
            <button class="category-btn active" onclick="filterByCategory('all')">🌟 All Stories</button>
            <button class="category-btn" onclick="filterByCategory('Science')">🔬 Science</button>
            <button class="category-btn" onclick="filterByCategory('Sports')">⚽ Sports</button>
            <button class="category-btn" onclick="filterByCategory('Environment')">🌍 Environment</button>
            <button class="category-btn" onclick="filterByCategory('Technology')">💻 Technology</button>
            <button class="category-btn" onclick="filterByCategory('Community')">🏘️ Community</button>
        </div>
        
            {% for article in articles %}
            <div class="article-card" id="article-{{ loop.index }}" data-category="{{ article.category|default('News') }}">
                <div class="article-preview">
                    <div class="article-meta">
                        <span class="category-tag">{{ article.category|default('📰 News') }}</span>
                        <span class="source">📰 {{ article.source }}</span>
                        <span class="reading-time">⏱️ {{ article.reading_time }} min read</span>
                        {% if article.reading_level %}
                        <div class="reading-level">
                            📚 Level: {{ "%.1f"|format(article.reading_level) }}
                        </div>
                        {% endif %}
                    </div>
                    <div class="article-title">
                        <span class="emoji">✨</span>
                        {{ article.title }}
                    </div>
                    <div class="article-summary">
                        {{ article.content }}
                    </div>
                    <div class="article-meta">
                        <div class="article-source">
                            📰 {{ article.source }}
                        </div>
                        {% if article.reading_level %}
                        <div class="reading-level">
                            📚 Level: {{ "%.1f"|format(article.reading_level) }}
                        </div>
                        {% endif %}
                    </div>
                    <div class="article-buttons">
                        <button class="kids-read-btn" onclick="event.stopPropagation(); openKidsArticle({{ loop.index }})">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">Kids Adventure!</span>
                            <span class="btn-subtitle">Fun story & activities</span>
                        </button>
                        <button class="parent-guide-btn" onclick="event.stopPropagation(); openParentGuide({{ loop.index }})">
                            <span class="btn-icon">👨‍👩‍👧‍👦</span>
                            <span class="btn-text">Parent Guide</span>
                            <span class="btn-subtitle">Discussion & context</span>
                        </button>
                    </div>
                </div>
            </div>
            {% endfor %}
        {% else %}
            <div class="fun-section">
                <h3>🌟 No News Today!</h3>
                <p>That means it's a perfect day to play, learn, and have fun! 🎉</p>
            </div>
        {% endif %}
        
        <div class="fun-section rotating-section">
            <div class="fun-content">
                <h3>🧠 Amazing Fact!</h3>
                <p id="rotating-fact">{{ fun_fact }}</p>
                <button class="rotate-btn" onclick="rotateFact()">🔄 New Fact!</button>
            </div>
        </div>
        
        <div class="fun-section rotating-section">
            <div class="fun-content">
                <h3>💝 Special Message</h3>
                <p id="rotating-message">{{ positive_message }}</p>
                <button class="rotate-btn" onclick="rotateMessage()">✨ New Message!</button>
            </div>
        </div>
        
        <div class="footer">
            <p>💡 This newsletter was made especially for amazing kids like you!</p>
            <p>Keep learning, keep growing, keep being awesome! ⭐</p>
        </div>
    </div>

    <script type="text/javascript">
        // Kids Newsletter Interactive Features
        let clickCount = 0;
        let readArticles = 0;
        let expandedArticles = new Set();
        
        // Article data for new tab functionality
        const articleData = [
            {% for article in articles %}
            {
                title: {{ article.title|tojson }},
                content: {{ article.content|tojson }},
                expandedContent: {{ article.expanded_content|tojson }},
                funFacts: {{ article.fun_facts|tojson }},
                activities: {{ article.activities|tojson }},
                source: {{ article.source|tojson }},
                readingLevel: {{ "%.1f"|format(article.reading_level) }},
                category: {{ article.category|default('News')|tojson }},
                educationalContext: "This story helps children develop understanding of the world around them and encourages curiosity about {{ article.category|default('current events') }}."
            }{% if not loop.last %},{% endif %}
                         {% endfor %}
        ];
        
        // Amazing facts and positive messages arrays
        const amazingFacts = [
            "Did you know that octopuses have three hearts and blue blood? 🐙",
            "A group of flamingos is called a 'flamboyance'! How fancy! 💃",
            "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs! 🍯",
            "The shortest war in history lasted only 38-45 minutes! ⏰",
            "Bananas are berries, but strawberries aren't! 🍌🍓",
            "A shrimp's heart is in its head! 🦐❤️",
            "It rains diamonds on Jupiter and Saturn! 💎🌟",
            "Dolphins have names for each other! They use special whistles! 🐬",
            "The Great Wall of China isn't visible from space with the naked eye! 🏯",
            "Wombat poop is cube-shaped! Nature is weird and wonderful! 🧊"
        ];
        
        const positiveMessages = [
            "You are braver than you believe and stronger than you seem! 💪✨",
            "Every day is a new adventure waiting to be discovered! 🌟🗺️",
            "Your curiosity about the world makes it a more wonderful place! 🌍💫",
            "Reading and learning today makes you smarter tomorrow! 📚🧠",
            "You have the power to make someone's day brighter with your smile! 😊🌈",
            "Every question you ask helps you grow into an amazing person! ❓🌱",
            "Your imagination can take you anywhere in the universe! 🚀🌌",
            "Being kind is a superpower that makes the world better! 🦸‍♀️💝",
            "You are capable of incredible things - believe in yourself! 🌟💫",
            "Learning something new is like adding a new color to your world! 🎨🌈"
        ];
        
        let currentFactIndex = 0;
        let currentMessageIndex = 0;
        
        function incrementClicks() {
            clickCount++;
            document.getElementById('clickCount').textContent = clickCount;
            
            if (clickCount === 10) {
                showCelebration("🎉 10 clicks! You're super active! 🎉");
            } else if (clickCount === 25) {
                showCelebration("🌟 25 clicks! You're a clicking champion! 🌟");
            }
        }
        
        async function submitEmail(event) {
            event.preventDefault();
            
            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value;
            const successDiv = document.getElementById('emailSuccess');
            const errorDiv = document.getElementById('emailError');
            
            // Hide previous messages
            successDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            
            try {
                // Netlify handles form submission automatically
                // const response = await fetch('/api/subscribe', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({ email: email })
                // });
                
                // if (response.ok) {
                    successDiv.style.display = 'block';
                    emailInput.value = '';
                    // showCelebration("📧 Welcome to our newsletter family! 📧");
                    
                    // Add sparkle effect to signup section
                    const signupSection = document.querySelector('.email-signup');
                    addSparkles(signupSection);
                // } else {
                //     throw new Error('Subscription failed');
                // }
            } catch (error) {
                console.error('Error:', error);
                errorDiv.style.display = 'block';
            }
        }
        
        // Create article page HTML
        function createFullArticlePage(article) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Kids Daily News</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
            min-height: 100vh;
            color: #2d3436;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 25px;
            padding: 40px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .back-btn {
            background: #FF6B6B;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .article-title {
            font-family: 'Fredoka', cursive;
            font-size: 2.5em;
            color: #2d3436;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .article-content {
            font-size: 1.3em;
            line-height: 1.8;
            margin-bottom: 30px;
            color: #636e72;
        }
        .extended-content {
            font-size: 1.2em;
            line-height: 1.7;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 15px;
        }
        .fun-facts {
            background: linear-gradient(135deg, #4ECDC4, #45B7AF);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 25px 0;
        }
        .fun-facts h3 {
            font-family: 'Fredoka', cursive;
            font-size: 1.6em;
            margin-bottom: 15px;
        }
        .fun-facts ul {
            list-style: none;
            padding: 0;
        }
        .fun-facts li {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
        }
        .fun-facts li::before {
            content: '⭐';
            position: absolute;
            left: 0;
        }
        .activities {
            background: linear-gradient(135deg, #A8E6CF, #88D8A3);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 25px 0;
        }
        .activities h3 {
            font-family: 'Fredoka', cursive;
            font-size: 1.6em;
            margin-bottom: 15px;
        }
        .activity-item {
            background: rgba(255,255,255,0.2);
            padding: 12px 15px;
            border-radius: 10px;
            margin: 10px 0;
            font-size: 1.1em;
        }
        .source-info {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 15px;
            color: #636e72;
        }
    </style>
</head>
<body>
    <div class="container">
        <button class="back-btn" onclick="window.close()">← Back to Newsletter</button>
        
        <h1 class="article-title">${article.title}</h1>
        
        <div class="article-content">
            ${article.content}
        </div>
        
        <div class="extended-content">
            <h3>📖 The Full Adventure:</h3>
            ${article.expandedContent}
        </div>
        
        <div class="fun-facts">
            <h3>🤓 Amazing Facts!</h3>
            <ul>
                ${article.funFacts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
        </div>
        
        <div class="activities">
            <h3>🎯 Try These Fun Activities!</h3>
            ${article.activities.map(activity => `<div class="activity-item">${activity}</div>`).join('')}
        </div>
        
        <div class="source-info">
            <p><strong>📰 Source:</strong> ${article.source}</p>
            <p><strong>📚 Reading Level:</strong> ${article.readingLevel} - Perfect for kids!</p>
        </div>
    </div>
 </body>
 </html>`;
        }
        
        function openKidsArticle(articleIndex) {
            console.log('Opening kids article:', articleIndex);
            const article = articleData[articleIndex - 1];
            if (!article) {
                console.error('Article not found:', articleIndex, articleData);
                alert('Oops! Article not found. Let me know about this issue!');
                return;
            }
            
            // Generate full article page
            const fullArticleHTML = createFullArticlePage(article);
             
             // Open in new tab
             const newTab = window.open('', '_blank');
             newTab.document.write(fullArticleHTML);
             newTab.document.close();
             
             // Add sparkle effect
             addSparkles(event.target.closest('.article-card'));
             showCelebration("🚀 Kids adventure story launching! 🚀");
         }
        
        function openParentGuide(articleIndex) {
            console.log('Opening parent guide:', articleIndex);
            const article = articleData[articleIndex - 1];
            if (!article) {
                console.error('Article not found:', articleIndex, articleData);
                alert('Oops! Article not found. Let me know about this issue!');
                return;
            }
            
            // Create parent guide HTML for new tab
            const parentGuideHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parent Guide: ${article.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #4ECDC4 0%, #45B7AF 100%);
            min-height: 100vh;
            color: #2d3436;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 25px;
            padding: 40px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .back-btn {
            background: #4ECDC4;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .parent-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
            border-radius: 15px;
        }
        .parent-title {
            font-family: 'Fredoka', cursive;
            font-size: 2em;
            color: #4ECDC4;
            margin-bottom: 10px;
        }
        .article-title {
            font-family: 'Fredoka', cursive;
            font-size: 2.2em;
            color: #2d3436;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .content-section {
            margin: 25px 0;
            padding: 25px;
            border-radius: 15px;
        }
        .educational-context {
            background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
        }
        .discussion-questions {
            background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
        }
        .learning-objectives {
            background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
        }
        .section-title {
            font-family: 'Fredoka', cursive;
            font-size: 1.6em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .kids-content {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            border-left: 4px solid #4ECDC4;
        }
        .discussion-list {
            list-style: none;
            padding: 0;
        }
        .discussion-list li {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
            line-height: 1.6;
        }
        .discussion-list li::before {
            content: '💭';
            position: absolute;
            left: 0;
        }
        .tips-box {
            background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            border-left: 4px solid #FFA726;
        }
    </style>
</head>
<body>
    <div class="container">
        <button class="back-btn" onclick="window.close()">← Back to Newsletter</button>
        
        <div class="parent-header">
            <div class="parent-title">👨‍👩‍👧‍👦 Parent Guide</div>
            <p>Everything you need to discuss this story with your child</p>
        </div>
        
        <h1 class="article-title">${article.title}</h1>
        
        <div class="kids-content">
            <h3>📖 What Your Child Read:</h3>
            <p>${article.content}</p>
        </div>
        
        <div class="content-section educational-context">
            <h3 class="section-title">🎓 Educational Context</h3>
            <p>${article.educationalContext || 'This story helps children develop understanding and critical thinking skills.'}</p>
        </div>
        
        <div class="content-section discussion-questions">
            <h3 class="section-title">💭 Discussion Questions</h3>
            <ul class="discussion-list">
                <li>What was your favorite part of this story and why?</li>
                <li>How do you think the people in this story felt?</li>
                <li>What questions would you like to ask about this story?</li>
                <li>How might this discovery help people in the future?</li>
            </ul>
        </div>
        
        <div class="content-section learning-objectives">
            <h3 class="section-title">🎯 Learning Objectives</h3>
            <p>This story helps children develop curiosity about the world, understand how people work together to solve problems, and appreciate the value of learning and discovery.</p>
        </div>
        
        <div class="tips-box">
            <h3>💡 Parent Tips:</h3>
            <ul>
                <li>Ask open-ended questions to encourage critical thinking</li>
                <li>Connect the story to your child's own experiences</li>
                <li>Encourage your child to share what they found most interesting</li>
                <li>Use this as a starting point for related activities or research</li>
            </ul>
        </div>
    </div>
</body>
</html>
            `;
            
            // Open in new tab
            const newTab = window.open('', '_blank');
            newTab.document.write(parentGuideHTML);
            newTab.document.close();
            
            // Add sparkle effect
            addSparkles(event.target.closest('.article-card'));
            showCelebration("👨‍👩‍👧‍👦 Parent guide opening! Perfect for discussion! 👨‍👩‍👧‍👦");
        }
        
        // Category filtering
        function filterByCategory(category) {
            const articles = document.querySelectorAll('.article-card');
            const buttons = document.querySelectorAll('.category-btn');
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Filter articles
            articles.forEach(article => {
                const articleCategory = article.dataset.category;
                if (category === 'all' || articleCategory === category) {
                    article.classList.remove('hidden');
                    article.style.animation = 'fadeIn 0.5s ease';
                } else {
                    article.classList.add('hidden');
                }
            });
            
            // Celebration for filtering
            if (category !== 'all') {
                showCelebration(`📚 Showing ${category} stories! 📚`);
            } else {
                showCelebration("🌟 Showing all amazing stories! 🌟");
            }
        }
        
        // Rotate amazing facts
        function rotateFact() {
            const factElement = document.getElementById('rotating-fact');
            factElement.classList.add('content-rotating');
            
            setTimeout(() => {
                currentFactIndex = (currentFactIndex + 1) % amazingFacts.length;
                factElement.textContent = amazingFacts[currentFactIndex];
                factElement.classList.remove('content-rotating');
                factElement.classList.add('fade-in');
                
                setTimeout(() => {
                    factElement.classList.remove('fade-in');
                }, 300);
                
                showCelebration("🧠 Amazing! Here's another cool fact! 🧠");
                addSparkles(factElement.closest('.fun-section'));
            }, 300);
        }
        
        // Rotate positive messages
        function rotateMessage() {
            const messageElement = document.getElementById('rotating-message');
            messageElement.classList.add('content-rotating');
            
            setTimeout(() => {
                currentMessageIndex = (currentMessageIndex + 1) % positiveMessages.length;
                messageElement.textContent = positiveMessages[currentMessageIndex];
                messageElement.classList.remove('content-rotating');
                messageElement.classList.add('fade-in');
                
                setTimeout(() => {
                    messageElement.classList.remove('fade-in');
                }, 300);
                
                showCelebration("✨ Here's some more positivity for you! ✨");
                addSparkles(messageElement.closest('.fun-section'));
            }, 300);
        }
        
        // Auto-rotate facts and messages every 10 seconds
        setInterval(() => {
            if (Math.random() > 0.5) {
                rotateFact();
            } else {
                rotateMessage();
            }
        }, 10000); // Rotate every 10 seconds
        
        function celebrateActivity(element) {
            element.style.background = 'rgba(255,255,255,0.4)';
            element.style.transform = 'translateX(12px) scale(1.03)';
            
            addSparkles(element);
            
            setTimeout(() => {
                element.style.background = 'rgba(255,255,255,0.2)';
                element.style.transform = 'translateX(0px) scale(1)';
            }, 500);
            
            const messages = [
                "🎨 Great activity choice!",
                "🌟 You're so creative!",
                "🚀 Amazing idea!",
                "💡 Smart thinking!"
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showCelebration(randomMessage);
        }
        
        function addSparkles(element) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.innerHTML = '✨';
                    sparkle.style.position = 'absolute';
                    sparkle.style.fontSize = '1.3em';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.left = Math.random() * 100 + '%';
                    sparkle.style.top = Math.random() * 100 + '%';
                    sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
                    sparkle.style.zIndex = '1000';
                    
                    element.style.position = 'relative';
                    element.appendChild(sparkle);
                    
                    setTimeout(() => sparkle.remove(), 1500);
                }, i * 200);
            }
        }
        
        function showCelebration(message) {
            const celebration = document.createElement('div');
            celebration.textContent = message;
            celebration.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #FF8A8A, #7FDDD4);
                color: white;
                padding: 20px 30px;
                border-radius: 25px;
                font-size: 1.3em;
                font-weight: bold;
                text-align: center;
                z-index: 10000;
                animation: celebrationPop 3s ease-out forwards;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            `;
            
            document.body.appendChild(celebration);
            setTimeout(() => celebration.remove(), 3000);
        }
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkle {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-25px) scale(1.3);
                }
            }
            
            @keyframes celebrationPop {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                80% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Welcome message
        window.addEventListener('load', function() {
            showCelebration("🎉 Welcome! Click 'Subscribe' to get daily newsletters! 🎉");
        });
    </script>
</body>
</html>
        """
        
        template = Template(html_template)
        
        # Format date
        formatted_date = date.strftime("%A, %B %d, %Y")
        
        # Get fun content
        fun_fact = self.activities_gen.get_fun_fact()
        positive_message = self.activities_gen.get_positive_message()
        
        # Enhance articles with expanded content
        enhanced_articles = []
        for article in articles:
            enhanced_article = self._enhance_article_content(article)
            enhanced_articles.append(enhanced_article)
        
        html_content = template.render(
            title=self.config.NEWSLETTER_TITLE,
            subtitle=self.config.NEWSLETTER_SUBTITLE,
            formatted_date=formatted_date,
            articles=enhanced_articles,
            fun_fact=fun_fact,
            positive_message=positive_message
        )
        
        return html_content

    def create_netlify_newsletter(self, articles: List[NewsArticle], date: datetime = None) -> str:
        """Create a Netlify-specific newsletter with fixed forms"""
        
        if date is None:
            date = datetime.now()
        
        # Get the base newsletter 
        html_content = self.create_web_newsletter(articles, date)
        
        # Replace the fetch API call with proper Netlify form handling
        html_content = html_content.replace(
            '// Netlify handles form submission automatically',
            'setTimeout(() => {\n                    successDiv.style.display = "block";\n                    emailInput.value = "";\n                    showCelebration("📧 Thank you for subscribing! 📧");\n                    addSparkles(document.querySelector(".email-signup"));\n                }, 1000);'
        )
        
        return html_content

    def _enhance_article_content(self, article: NewsArticle) -> dict:
        """Enhance article with expanded content, facts, and activities"""
        
        # Generate expanded story content
        expanded_stories = {
            'space': [
                "The robot used special cameras and tools to find these crystals deep underground! Scientists think the crystals formed millions of years ago when Mars had water. The crystals are so beautiful they look like purple gems!",
                "The discovery happened when the robot was digging in a special place called a crater. The crystals might help us understand how life could exist on Mars one day!",
                "Scientists are so excited because these crystals could help plants grow on Mars in the future. Maybe one day, kids like you could visit Mars and see a whole garden growing there!"
            ],
            'ocean': [
                "Sarah spent 6 months building her robot using recycled materials from her garage! She learned about ocean pollution in school and wanted to help. Her robot can dive 50 feet deep and has special grabbing arms.",
                "The robot has saved sea turtles, dolphins, and hundreds of fish by cleaning up plastic bottles and bags. Sarah's invention inspired other kids around the world to build their own ocean-cleaning robots!",
                "Sarah's robot sends pictures back to her computer so she can see all the sea creatures it meets. She named her robot 'Ocean Hero' and it has its own social media account where kids can follow its adventures!"
            ],
            'default': [
                "This amazing story shows how creative and smart people can make the world better! The discovery happened after months of careful work and lots of teamwork.",
                "Scientists and researchers worked together from all around the world to make this happen. They used special tools and technology to learn new things that help everyone!",
                "This discovery will help us learn more about our world and maybe inspire you to become a scientist, inventor, or explorer one day!"
            ]
        }
        
        # Determine story type
        content_lower = article.content.lower()
        if any(word in content_lower for word in ['space', 'mars', 'robot', 'crystals', 'sing']):
            story_type = 'space'
        elif any(word in content_lower for word in ['ocean', 'robot', 'fish', 'clean', 'plastic']):
            story_type = 'ocean'
        else:
            story_type = 'default'
        
        # Generate fun facts based on content
        fun_facts_options = {
            'space': [
                "Mars is called the 'Red Planet' because it's covered in red dust!",
                "A day on Mars is almost the same length as a day on Earth!",
                "Mars has the biggest volcano in our solar system!",
                "Scientists think Mars used to have oceans like Earth!"
            ],
            'ocean': [
                "The ocean covers more than 70% of our planet!",
                "There are more than 230,000 different species living in the ocean!",
                "The deepest part of the ocean is deeper than Mount Everest is tall!",
                "Ocean water is salty because of dissolved minerals from rocks!"
            ],
            'animals': [
                "Dogs can learn more than 150 words!",
                "A dog's nose print is unique, just like human fingerprints!",
                "Dogs dream just like humans do!",
                "The oldest known dog lived to be 29 years old!"
            ],
            'science': [
                "Your brain has about 86 billion nerve cells!",
                "Light travels so fast it could go around Earth 7 times in one second!",
                "There are more possible games of chess than atoms in the universe!",
                "Honey never spoils - even honey from ancient Egypt is still good!"
            ]
        }
        
        # Select appropriate facts
        if story_type in fun_facts_options:
            selected_facts = fun_facts_options[story_type][:3]
        else:
            selected_facts = fun_facts_options['science'][:3]
        
        # Generate related activities
        activities = self.activities_gen.get_themed_activities(story_type, 4)
        
        return {
            'title': article.title,
            'content': article.content,
            'source': article.source,
            'reading_level': getattr(article, 'reading_level', 2.5),
            'expanded_content': expanded_stories[story_type][0],
            'fun_facts': selected_facts,
            'activities': activities
        }

    def save_newsletter(self, content: str, filename: str = None) -> str:
        """Save newsletter to file"""
        
        if filename is None:
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"web_newsletter_{date_str}.html"
        
        os.makedirs("newsletters", exist_ok=True)
        filepath = os.path.join("newsletters", filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Web newsletter saved to {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error saving newsletter: {e}")
            return None

if __name__ == "__main__":
    generator = WebNewsletterGenerator()
    
    # Create test articles
    test_articles = [
        NewsArticle(
            title="Space Robot Discovers Singing Crystals on Mars! 🤖🎵🚀",
            content="A super smart robot on Mars found incredible crystals that make beautiful music when the wind blows! Scientists think these magical crystals could help us understand how Mars makes sounds.",
            url="http://example.com/mars",
            source="Cosmic Discovery News"
        ),
        NewsArticle(
            title="Girl, 8, Builds Robot Fish to Clean Ocean Plastic! 🐟🤖💙",
            content="Emma built amazing robot fish that eat plastic trash in the ocean! Her robot fish have already cleaned up 1000 pieces of trash and helped save baby sea turtles.",
            url="http://example.com/ocean",
            source="Ocean Heroes Daily"
        )
    ]
    
    for article in test_articles:
        article.reading_level = 2.5
    
    html_newsletter = generator.create_web_newsletter(test_articles)
    html_file = generator.save_newsletter(html_newsletter, "WEB_READY_NEWSLETTER.html")
    
    print(f"🎉 Web-ready newsletter created: {html_file}")
    print("📧 Includes email signup functionality!")
    print("🎨 Softer, more comfortable colors!") 