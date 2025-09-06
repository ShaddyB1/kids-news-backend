from datetime import datetime
from typing import List
import os
from jinja2 import Template
from .news_scraper import NewsArticle
from .config import Config
import logging

logger = logging.getLogger(__name__)

class NewsletterGenerator:
    def __init__(self):
        self.config = Config()

    def create_html_newsletter(self, articles: List[NewsArticle], date: datetime = None) -> str:
        """Create a beautiful HTML newsletter for kids"""
        
        if date is None:
            date = datetime.now()
        
        # Kid-friendly HTML template
        html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <style>
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header .subtitle {
            font-size: 1.2em;
            margin-top: 10px;
            opacity: 0.9;
        }
        .date {
            background: #ffeaa7;
            color: #2d3436;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 20px;
        }
        .article {
            background: #f8f9fa;
            border-left: 5px solid #74b9ff;
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        .article:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .article-title {
            font-size: 1.4em;
            font-weight: bold;
            color: #2d3436;
            margin-bottom: 10px;
            line-height: 1.3;
        }
        .article-content {
            font-size: 1.1em;
            line-height: 1.6;
            color: #636e72;
        }
        .article-source {
            font-size: 0.9em;
            color: #74b9ff;
            font-weight: bold;
            margin-top: 10px;
        }
        .reading-level {
            background: #55efc4;
            color: #00b894;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
            margin-top: 5px;
        }
        .fun-fact {
            background: linear-gradient(45deg, #fd79a8, #fdcb6e);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #ddd;
            border-radius: 10px;
            color: #636e72;
        }
        .emoji {
            font-size: 1.5em;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                padding: 20px;
            }
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <div class="subtitle">{{ subtitle }}</div>
        </div>
        
        <div class="date">
            <span class="emoji">📅</span> {{ formatted_date }}
        </div>
        
        {% if articles %}
            {% for article in articles %}
            <div class="article">
                <div class="article-title">
                    <span class="emoji">✨</span> {{ article.title }}
                </div>
                <div class="article-content">
                    {{ article.content }}
                </div>
                <div class="article-source">
                    📰 Source: {{ article.source }}
                </div>
                {% if article.reading_level %}
                <div class="reading-level">
                    📚 Reading Level: {{ "%.1f"|format(article.reading_level) }} - {{ get_level_description(article.reading_level) }}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        {% else %}
            <div class="fun-fact">
                <span class="emoji">🌟</span> No news today means it's a great day to play and learn! <span class="emoji">🌟</span>
            </div>
        {% endif %}
        
        <div class="fun-fact">
            <span class="emoji">🧠</span> Did you know? Reading news helps you learn about the world! Keep being curious! <span class="emoji">🚀</span>
        </div>
        
        <div class="footer">
            <p><span class="emoji">💡</span> This newsletter was made especially for kids like you!</p>
            <p>Keep learning, keep growing, keep being awesome! <span class="emoji">⭐</span></p>
        </div>
    </div>
</body>
</html>
        """
        
        template = Template(html_template)
        
        # Format date in kid-friendly way
        formatted_date = date.strftime("%A, %B %d, %Y")
        
        def get_level_description(grade_level):
            if grade_level <= 2:
                return "Perfect for beginning readers!"
            elif grade_level <= 4:
                return "Great for kids learning to read!"
            elif grade_level <= 6:
                return "Good for confident readers!"
            else:
                return "A bit challenging but doable!"
        
        html_content = template.render(
            title=self.config.NEWSLETTER_TITLE,
            subtitle=self.config.NEWSLETTER_SUBTITLE,
            formatted_date=formatted_date,
            articles=articles,
            get_level_description=get_level_description
        )
        
        return html_content

    def create_text_newsletter(self, articles: List[NewsArticle], date: datetime = None) -> str:
        """Create a simple text version of the newsletter"""
        
        if date is None:
            date = datetime.now()
        
        text_content = []
        text_content.append("=" * 50)
        text_content.append(f"{self.config.NEWSLETTER_TITLE}")
        text_content.append(f"{self.config.NEWSLETTER_SUBTITLE}")
        text_content.append("=" * 50)
        text_content.append(f"📅 {date.strftime('%A, %B %d, %Y')}")
        text_content.append("")
        
        if articles:
            for i, article in enumerate(articles, 1):
                text_content.append(f"{i}. ✨ {article.title}")
                text_content.append("-" * len(f"{i}. ✨ {article.title}"))
                text_content.append(f"{article.content}")
                text_content.append(f"📰 Source: {article.source}")
                if hasattr(article, 'reading_level') and article.reading_level:
                    level_desc = self._get_level_description(article.reading_level)
                    text_content.append(f"📚 Reading Level: {article.reading_level:.1f} - {level_desc}")
                text_content.append("")
        else:
            text_content.append("🌟 No news today means it's a great day to play and learn! 🌟")
            text_content.append("")
        
        text_content.append("-" * 50)
        text_content.append("🧠 Did you know? Reading news helps you learn about the world!")
        text_content.append("Keep being curious! 🚀")
        text_content.append("")
        text_content.append("💡 This newsletter was made especially for kids like you!")
        text_content.append("Keep learning, keep growing, keep being awesome! ⭐")
        text_content.append("=" * 50)
        
        return "\n".join(text_content)

    def _get_level_description(self, grade_level: float) -> str:
        """Get reading level description"""
        if grade_level <= 2:
            return "Perfect for beginning readers!"
        elif grade_level <= 4:
            return "Great for kids learning to read!"
        elif grade_level <= 6:
            return "Good for confident readers!"
        else:
            return "A bit challenging but doable!"

    def save_newsletter(self, content: str, filename: str = None, format_type: str = "html") -> str:
        """Save newsletter to file"""
        
        if filename is None:
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"kids_newsletter_{date_str}.{format_type}"
        
        # Create newsletters directory if it doesn't exist
        os.makedirs("newsletters", exist_ok=True)
        
        filepath = os.path.join("newsletters", filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Newsletter saved to {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Error saving newsletter: {e}")
            return None

    def create_kids_activity_section(self) -> str:
        """Create a fun activity section for kids"""
        
        activities = [
            "🎨 Draw a picture of your favorite animal from today's news!",
            "📝 Write a short story about going to space!",
            "🔍 Look outside and count how many different types of birds you can see!",
            "🧪 Try a simple science experiment with water and food coloring!",
            "📚 Read a book about something you learned today!",
            "🎵 Make up a song about your favorite news story!",
            "🏃‍♂️ Go outside and play for at least 30 minutes!",
            "❓ Ask an adult to help you learn more about something interesting from the news!",
            "🌱 Plant a seed and watch it grow over the next few weeks!",
            "🎭 Act out one of the news stories for your family!"
        ]
        
        import random
        selected_activities = random.sample(activities, 3)
        
        activity_html = """
        <div class="fun-fact">
            <h3 style="margin-top: 0;">🎯 Fun Activities for Today!</h3>
            <ul style="text-align: left; margin: 10px 0;">
        """
        
        for activity in selected_activities:
            activity_html += f"<li style='margin: 5px 0;'>{activity}</li>"
        
        activity_html += """
            </ul>
        </div>
        """
        
        return activity_html

if __name__ == "__main__":
    # Test the newsletter generator
    generator = NewsletterGenerator()
    
    # Create test articles
    test_articles = [
        NewsArticle(
            title="Smart People Find Cool New Fish!",
            content="Scientists found a new fish that glows in the dark! It lives very deep in the ocean. The fish is very pretty and has bright colors.",
            url="http://example.com/1",
            source="Science News for Kids"
        ),
        NewsArticle(
            title="Kids Help Save the Environment!",
            content="Children around the world are helping to clean up parks and beaches. They are picking up trash and planting new trees. This helps animals and makes the Earth cleaner!",
            url="http://example.com/2",
            source="Green Kids News"
        )
    ]
    
    # Set reading levels
    for article in test_articles:
        article.reading_level = 2.5
    
    # Generate HTML newsletter
    html_newsletter = generator.create_html_newsletter(test_articles)
    html_file = generator.save_newsletter(html_newsletter, "test_newsletter.html")
    
    # Generate text newsletter
    text_newsletter = generator.create_text_newsletter(test_articles)
    text_file = generator.save_newsletter(text_newsletter, "test_newsletter.txt", "txt")
    
    print(f"Test newsletters created:")
    print(f"HTML: {html_file}")
    print(f"Text: {text_file}")
    print("\nHTML preview:")
    print(html_newsletter[:500] + "...") 