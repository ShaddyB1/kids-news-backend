import requests
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re
from typing import List, Dict, Optional
from .config import Config
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsArticle:
    def __init__(self, title: str, content: str, url: str, source: str, published_date: Optional[datetime] = None):
        self.title = title
        self.content = content
        self.url = url
        self.source = source
        self.published_date = published_date or datetime.now()
        self.is_kid_friendly = False
        self.reading_level = 0.0

class NewsScraper:
    def __init__(self):
        self.config = Config()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

    def fetch_rss_feed(self, feed_url: str) -> List[NewsArticle]:
        """Fetch articles from RSS feed"""
        articles = []
        try:
            logger.info(f"Fetching RSS feed: {feed_url}")
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries[:10]:  # Limit to 10 most recent
                # Get published date
                published_date = None
                if hasattr(entry, 'published_parsed'):
                    published_date = datetime(*entry.published_parsed[:6])
                
                # Extract content
                content = ""
                if hasattr(entry, 'summary'):
                    content = self._clean_html(entry.summary)
                elif hasattr(entry, 'description'):
                    content = self._clean_html(entry.description)
                
                article = NewsArticle(
                    title=entry.title,
                    content=content,
                    url=entry.link,
                    source=feed.feed.title if hasattr(feed.feed, 'title') else feed_url,
                    published_date=published_date
                )
                articles.append(article)
                
        except Exception as e:
            logger.error(f"Error fetching RSS feed {feed_url}: {e}")
        
        return articles

    def fetch_web_articles(self, url: str) -> List[NewsArticle]:
        """Fetch articles by scraping web pages"""
        articles = []
        try:
            logger.info(f"Scraping web page: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Different selectors for different sites
            article_selectors = [
                'article',
                '.story',
                '.news-item',
                '.article',
                '[class*="story"]',
                '[class*="article"]'
            ]
            
            for selector in article_selectors:
                elements = soup.select(selector)
                if elements:
                    for element in elements[:5]:  # Limit to 5 articles per page
                        title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
                        if title_elem:
                            title = title_elem.get_text().strip()
                            content = self._extract_article_content(element)
                            
                            if title and content and len(content) > 50:
                                article = NewsArticle(
                                    title=title,
                                    content=content,
                                    url=url,
                                    source=self._extract_site_name(url)
                                )
                                articles.append(article)
                    break
                    
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
        
        return articles

    def _clean_html(self, html_content: str) -> str:
        """Remove HTML tags and clean text"""
        if not html_content:
            return ""
        
        soup = BeautifulSoup(html_content, 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text()
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text

    def _extract_article_content(self, element) -> str:
        """Extract readable content from article element"""
        # Remove unwanted elements
        for unwanted in element.find_all(['script', 'style', 'nav', 'header', 'footer', 'aside']):
            unwanted.decompose()
        
        # Get paragraphs first
        paragraphs = element.find_all('p')
        if paragraphs:
            content = ' '.join([p.get_text().strip() for p in paragraphs])
        else:
            content = element.get_text().strip()
        
        # Clean up
        content = re.sub(r'\s+', ' ', content)
        return content[:500]  # Limit length

    def _extract_site_name(self, url: str) -> str:
        """Extract site name from URL"""
        try:
            from urllib.parse import urlparse
            domain = urlparse(url).netloc
            return domain.replace('www.', '')
        except:
            return url

    def is_content_appropriate(self, article: NewsArticle) -> bool:
        """Check if content is appropriate for kids"""
        text = (article.title + " " + article.content).lower()
        
        # Check for negative topics
        for negative_topic in self.config.NEGATIVE_TOPICS:
            if negative_topic in text:
                logger.info(f"Filtering out article with negative topic: {negative_topic}")
                return False
        
        # Prefer positive topics
        positive_score = sum(1 for topic in self.config.POSITIVE_TOPICS if topic in text)
        return positive_score > 0 or len(text) > 100  # Either positive or substantial content

    def fetch_all_news(self) -> List[NewsArticle]:
        """Fetch news from all configured sources"""
        all_articles = []
        
        # Fetch from RSS feeds
        for feed_url in self.config.RSS_FEEDS:
            articles = self.fetch_rss_feed(feed_url)
            all_articles.extend(articles)
        
        # Fetch from general news RSS (will be filtered)
        for feed_url in self.config.GENERAL_NEWS_SOURCES:
            articles = self.fetch_rss_feed(feed_url)
            all_articles.extend(articles)
        
        # Filter appropriate content
        kid_friendly_articles = []
        for article in all_articles:
            if self.is_content_appropriate(article):
                article.is_kid_friendly = True
                kid_friendly_articles.append(article)
        
        # Sort by date and limit
        kid_friendly_articles.sort(key=lambda x: x.published_date, reverse=True)
        return kid_friendly_articles[:self.config.MAX_ARTICLES_PER_DAY]

if __name__ == "__main__":
    scraper = NewsScraper()
    articles = scraper.fetch_all_news()
    
    print(f"Found {len(articles)} kid-friendly articles:")
    for article in articles:
        print(f"- {article.title} ({article.source})")
        print(f"  {article.content[:100]}...")
        print() 