import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI API key for content processing
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    
    # Target reading level (Flesch-Kincaid grade level)
    TARGET_READING_LEVEL = 3.0  # Appropriate for ages 6-10
    
    # Kid-friendly news sources
    NEWS_SOURCES = [
        'https://www.newsround.co.uk/news',  # BBC Newsround (already kid-focused)
        'https://www.natgeokids.com/uk/',    # National Geographic Kids
        'https://www.timeforkids.com/',      # Time for Kids
    ]
    
    # RSS Feeds for more reliable content
    RSS_FEEDS = [
        'https://feeds.bbci.co.uk/newsround/rss.xml',
        'https://www.natgeokids.com/uk/feed/',
    ]
    
    # General news sources (will be filtered and simplified)
    GENERAL_NEWS_SOURCES = [
        'https://rss.cnn.com/rss/edition.rss',
        'https://feeds.reuters.com/reuters/topNews',
        'https://feeds.nationalgeographic.com/ng/News/News_Main',
    ]
    
    # Topics to focus on (positive/educational)
    POSITIVE_TOPICS = [
        'science', 'discovery', 'animals', 'environment', 'space',
        'technology', 'art', 'music', 'sports', 'achievement',
        'kindness', 'helping', 'invention', 'nature', 'education'
    ]
    
    # Topics to avoid or filter out
    NEGATIVE_TOPICS = [
        'war', 'violence', 'crime', 'death', 'disaster', 'terrorism',
        'accident', 'tragedy', 'conflict', 'fighting', 'injured'
    ]
    
    # Newsletter settings
    NEWSLETTER_TITLE = "Kids Daily News 📰"
    NEWSLETTER_SUBTITLE = "Amazing things happening around the world!"
    MAX_ARTICLES_PER_DAY = 5
    
    # Email settings (optional)
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    EMAIL_USER = os.getenv('EMAIL_USER', '')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '') 