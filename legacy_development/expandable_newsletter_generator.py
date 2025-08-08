from datetime import datetime
from typing import List
import os
from jinja2 import Template
from news_scraper import NewsArticle
from config import Config
from kids_activities import KidsActivitiesGenerator
import logging

logger = logging.getLogger(__name__)

class ExpandableNewsletterGenerator:
    def __init__(self):
        self.config = Config()
        self.activities_gen = KidsActivitiesGenerator()

    def create_expandable_newsletter(self, articles: List[NewsArticle], date: datetime = None) -> str:
        """Create a super cool newsletter with expandable articles"""
        
        if date is None:
            date = datetime.now()
        
        # Enhanced HTML template with expandable articles
        html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
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
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --accent-color: #ff6b6b;
            --success-color: #4ecdc4;
            --warning-color: #ffeaa7;
            --text-dark: #2d3436;
            --text-light: #636e72;
            --white: #ffffff;
            --shadow: 0 10px 30px rgba(0,0,0,0.15);
            --shadow-hover: 0 20px 40px rgba(0,0,0,0.25);
        }
        
        body {
            font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, #667eea 100%);
            background-attachment: fixed;
            min-height: 100vh;
            color: var(--text-dark);
            overflow-x: hidden;
        }
        
        /* Floating background elements */
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
            background: rgba(255, 255, 255, 0.1);
            animation: float 20s infinite linear;
        }
        
        .bg-shapes .shape:nth-child(1) {
            width: 80px;
            height: 80px;
            left: 10%;
            animation-delay: 0s;
        }
        
        .bg-shapes .shape:nth-child(2) {
            width: 120px;
            height: 120px;
            left: 70%;
            animation-delay: 5s;
        }
        
        .bg-shapes .shape:nth-child(3) {
            width: 100px;
            height: 100px;
            left: 40%;
            animation-delay: 10s;
        }
        
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
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
                transform: translateY(50px);
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
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            animation: move 20s linear infinite;
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
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
            animation: bounce 2s ease-in-out infinite alternate;
        }
        
        @keyframes bounce {
            0% {
                transform: translateY(0px);
            }
            100% {
                transform: translateY(-10px);
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
            background: linear-gradient(135deg, var(--warning-color) 0%, #fdcb6e 100%);
            color: var(--text-dark);
            padding: 15px 25px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            font-size: 1.2em;
            margin: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .article-card {
            background: var(--white);
            margin: 25px 30px;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
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
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.6s;
            pointer-events: none;
        }
        
        .article-card:hover::before {
            left: 100%;
        }
        
        .article-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: var(--shadow-hover);
            border-left-color: var(--accent-color);
        }
        
        .article-card.expanded {
            transform: scale(1.02);
            border-left-color: var(--success-color);
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
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
            animation: wiggle 2s ease-in-out infinite;
        }
        
        @keyframes wiggle {
            0%, 100% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(5deg);
            }
            75% {
                transform: rotate(-5deg);
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
            background: linear-gradient(135deg, var(--success-color), #00b894);
            color: var(--white);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .expand-button {
            background: linear-gradient(135deg, var(--accent-color), #e84393);
            color: var(--white);
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 auto;
        }
        
        .expand-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .article-expanded {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-out, padding 0.3s ease;
            padding: 0 25px;
        }
        
        .article-expanded.show {
            max-height: 1000px;
            padding: 0 25px 25px 25px;
        }
        
        .expanded-content {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            padding: 25px;
            margin-top: 20px;
        }
        
        .expanded-story {
            font-size: 1.3em;
            line-height: 1.8;
            color: var(--text-dark);
            margin-bottom: 20px;
        }
        
        .fun-facts {
            background: linear-gradient(135deg, var(--success-color), #00b894);
            color: var(--white);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        .fun-facts h4 {
            font-family: 'Fredoka', cursive;
            font-size: 1.4em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .fun-facts ul {
            list-style: none;
            padding: 0;
        }
        
        .fun-facts li {
            margin: 10px 0;
            padding-left: 25px;
            position: relative;
        }
        
        .fun-facts li::before {
            content: '⭐';
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .related-activities {
            background: linear-gradient(135deg, #fd79a8, #fdcb6e);
            color: var(--white);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        .related-activities h4 {
            font-family: 'Fredoka', cursive;
            font-size: 1.4em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .activity-item {
            background: rgba(255,255,255,0.2);
            padding: 12px 15px;
            border-radius: 10px;
            margin: 10px 0;
            font-size: 1.1em;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .activity-item:hover {
            background: rgba(255,255,255,0.3);
            transform: translateX(10px);
        }
        
        .fun-section {
            background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
            color: var(--white);
            margin: 25px 30px;
            padding: 25px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .fun-section h3 {
            font-family: 'Fredoka', cursive;
            font-size: 1.8em;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
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
            animation: heartbeat 2s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
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
            
            .fun-section {
                margin: 15px 20px;
                padding: 20px;
            }
            
            .click-counter {
                top: 10px;
                right: 10px;
            }
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
        
        {% if articles %}
            {% for article in articles %}
            <div class="article-card" id="article-{{ loop.index }}">
                <div class="article-preview">
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
                    <button class="expand-button" onclick="toggleArticle({{ loop.index }})">
                        <span class="expand-text">🔍 Read More!</span>
                        <span class="expand-icon">▼</span>
                    </button>
                </div>
                
                <div class="article-expanded" id="expanded-{{ loop.index }}">
                    <div class="expanded-content">
                        <div class="expanded-story">
                            {{ article.expanded_content }}
                        </div>
                        
                        <div class="fun-facts">
                            <h4>🤓 Cool Facts!</h4>
                            <ul>
                                {% for fact in article.fun_facts %}
                                <li>{{ fact }}</li>
                                {% endfor %}
                            </ul>
                        </div>
                        
                        <div class="related-activities">
                            <h4>🎯 Try These Activities!</h4>
                            {% for activity in article.activities %}
                            <div class="activity-item" onclick="celebrateActivity(this)">
                                {{ activity }}
                            </div>
                            {% endfor %}
                        </div>
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
        
        <div class="fun-section">
            <h3>🧠 Amazing Fact!</h3>
            <p>{{ fun_fact }}</p>
        </div>
        
        <div class="fun-section">
            <h3>💝 Special Message</h3>
            <p>{{ positive_message }}</p>
        </div>
        
        <div class="footer">
            <p>💡 This newsletter was made especially for amazing kids like you!</p>
            <p>Keep learning, keep growing, keep being awesome! ⭐</p>
        </div>
    </div>

    <script>
        let clickCount = 0;
        let readArticles = 0;
        let expandedArticles = new Set();
        
        function incrementClicks() {
            clickCount++;
            document.getElementById('clickCount').textContent = clickCount;
            
            if (clickCount === 10) {
                showCelebration("🎉 10 clicks! You're super active! 🎉");
            } else if (clickCount === 25) {
                showCelebration("🌟 25 clicks! You're a clicking champion! 🌟");
            }
        }
        
        function toggleArticle(articleId) {
            const expandedDiv = document.getElementById(`expanded-${articleId}`);
            const button = document.querySelector(`#article-${articleId} .expand-button`);
            const icon = button.querySelector('.expand-icon');
            const text = button.querySelector('.expand-text');
            const card = document.getElementById(`article-${articleId}`);
            
            if (expandedDiv.classList.contains('show')) {
                // Collapse
                expandedDiv.classList.remove('show');
                icon.textContent = '▼';
                text.textContent = '🔍 Read More!';
                card.classList.remove('expanded');
                expandedArticles.delete(articleId);
            } else {
                // Expand
                expandedDiv.classList.add('show');
                icon.textContent = '▲';
                text.textContent = '📖 Show Less';
                card.classList.add('expanded');
                expandedArticles.add(articleId);
                
                // Celebrate first expansion
                if (expandedArticles.size === 1) {
                    showCelebration("📚 Awesome! You're reading the full story! 📚");
                } else if (expandedArticles.size === 3) {
                    showCelebration("🎓 WOW! You're a super reader! 🎓");
                }
                
                // Add sparkle effect
                addSparkles(card);
                
                // Smooth scroll to the expanded content
                setTimeout(() => {
                    expandedDiv.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        }
        
        function celebrateActivity(element) {
            element.style.background = 'rgba(255,255,255,0.5)';
            element.style.transform = 'translateX(15px) scale(1.05)';
            
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
                    sparkle.style.fontSize = '1.5em';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.left = Math.random() * 100 + '%';
                    sparkle.style.top = Math.random() * 100 + '%';
                    sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
                    
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
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 20px 30px;
                border-radius: 25px;
                font-size: 1.3em;
                font-weight: bold;
                text-align: center;
                z-index: 10000;
                animation: celebrationPop 3s ease-out forwards;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
                    transform: translateY(-30px) scale(1.5);
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
            showCelebration("🎉 Click articles to read more! 🎉");
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
        if any(word in content_lower for word in ['space', 'mars', 'robot', 'crystals']):
            story_type = 'space'
        elif any(word in content_lower for word in ['ocean', 'robot', 'fish', 'clean']):
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
            filename = f"expandable_newsletter_{date_str}.html"
        
        os.makedirs("newsletters", exist_ok=True)
        filepath = os.path.join("newsletters", filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Expandable newsletter saved to {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error saving newsletter: {e}")
            return None

if __name__ == "__main__":
    generator = ExpandableNewsletterGenerator()
    
    # Create test articles
    test_articles = [
        NewsArticle(
            title="Space Robot Finds Purple Crystals on Mars! 🤖💜🚀",
            content="A super smart robot on Mars found amazing purple crystals that shine like diamonds! Scientists think they might help us learn how to grow plants on Mars.",
            url="http://example.com/mars",
            source="Space Explorer News"
        ),
        NewsArticle(
            title="10-Year-Old Girl Invents Robot That Cleans Ocean! 🌊🤖♻️",
            content="Sarah built a special robot that swims in the ocean and picks up plastic trash! Her robot has already saved 500 fish and made the ocean cleaner.",
            url="http://example.com/ocean",
            source="Young Inventors Daily"
        )
    ]
    
    for article in test_articles:
        article.reading_level = 2.5
    
    html_newsletter = generator.create_expandable_newsletter(test_articles)
    html_file = generator.save_newsletter(html_newsletter, "EXPANDABLE_NEWSLETTER.html")
    
    print(f"🎉 Expandable newsletter created: {html_file}")
    print("🔍 Click the 'Read More!' buttons to see articles expand!") 