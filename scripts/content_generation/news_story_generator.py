#!/usr/bin/env python3
"""
News Story Generator for Junior News Digest
Generates 10 current, real-world news stories for children aged 6-12
"""

import requests
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsStoryGenerator:
    def __init__(self):
        load_dotenv()
        
        # News API configuration
        self.news_api_key = os.getenv('NEWS_API_KEY')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        # Output directory
        self.output_dir = Path("../../kids_news_content")
        self.output_dir.mkdir(exist_ok=True)
        
        # Story template for kids
        self.story_prompt = """You are a friendly news reporter writing for children aged 6 to 12. 

Take this news story and rewrite it following these exact rules:

1. Write a clear, simple **headline** that includes the city/country where it happened
2. Rewrite in exactly **5 sentences** using simple language
3. Explain what happened, where, why, and who is involved
4. Avoid scary, violent, or overly complex details
5. After the 5 sentences, add **one sentence starting with "Why it matters:"**
6. Make the story positive and hopeful, even if the topic is serious
7. Focus on how it helps kids, families, or makes the world better

Format exactly like this:
Headline: [Clear, simple headline with location]
[Sentence 1]
[Sentence 2] 
[Sentence 3]
[Sentence 4]
[Sentence 5]
Why it matters: [Simple explanation of why kids should care]

Original news story:
{original_story}"""

        logger.info("📰 News Story Generator initialized")

    def fetch_current_news(self):
        """Fetch current news from News API"""
        if not self.news_api_key:
            logger.error("❌ NEWS_API_KEY not found in .env file")
            return None
        
        try:
            # Get news from past 7 days
            from_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            
            # Categories that are good for kids (avoid politics, crime, etc.)
            categories = ['science', 'technology', 'health', 'general']
            all_articles = []
            
            for category in categories:
                url = f"https://newsapi.org/v2/top-headlines"
                params = {
                    'apiKey': self.news_api_key,
                    'category': category,
                    'language': 'en',
                    'from': from_date,
                    'sortBy': 'publishedAt',
                    'pageSize': 20
                }
                
                response = requests.get(url, params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get('articles', [])
                    
                    # Filter for kid-friendly content
                    filtered_articles = self.filter_kid_friendly_articles(articles)
                    all_articles.extend(filtered_articles)
                    
                    logger.info(f"✅ Fetched {len(filtered_articles)} kid-friendly {category} articles")
                else:
                    logger.error(f"❌ Failed to fetch {category} news: {response.status_code}")
            
            # Remove duplicates and limit to 15 articles
            unique_articles = self.remove_duplicates(all_articles)[:15]
            logger.info(f"📊 Total unique articles: {len(unique_articles)}")
            
            return unique_articles
            
        except Exception as e:
            logger.error(f"❌ Error fetching news: {e}")
            return None

    def filter_kid_friendly_articles(self, articles):
        """Filter articles for kid-friendly content"""
        kid_friendly = []
        
        # Keywords to avoid
        avoid_keywords = [
            'death', 'killed', 'murder', 'war', 'violence', 'attack', 'terrorism',
            'crime', 'prison', 'arrest', 'lawsuit', 'scandal', 'controversy',
            'accident', 'crash', 'disaster', 'fire', 'flood', 'earthquake'
        ]
        
        # Keywords to prefer
        prefer_keywords = [
            'discovery', 'breakthrough', 'innovation', 'help', 'save', 'protect',
            'school', 'students', 'children', 'education', 'learning', 'research',
            'environment', 'clean', 'renewable', 'sustainable', 'conservation',
            'health', 'medicine', 'cure', 'treatment', 'recovery', 'wellness',
            'space', 'science', 'technology', 'invention', 'achievement', 'success'
        ]
        
        for article in articles:
            title = article.get('title', '').lower()
            description = article.get('description', '').lower() if article.get('description') else ''
            content = f"{title} {description}"
            
            # Skip if contains avoid keywords
            if any(keyword in content for keyword in avoid_keywords):
                continue
            
            # Prefer if contains good keywords
            if any(keyword in content for keyword in prefer_keywords):
                kid_friendly.append(article)
            # Also include general positive news
            elif len(content) > 50 and article.get('urlToImage'):
                kid_friendly.append(article)
        
        return kid_friendly

    def remove_duplicates(self, articles):
        """Remove duplicate articles based on title similarity"""
        unique_articles = []
        seen_titles = set()
        
        for article in articles:
            title = article.get('title', '').lower()
            # Simple deduplication based on first 50 characters
            title_key = title[:50]
            
            if title_key not in seen_titles:
                seen_titles.add(title_key)
                unique_articles.append(article)
        
        return unique_articles

    def rewrite_for_kids(self, article):
        """Rewrite news article for kids using OpenAI"""
        if not self.openai_api_key:
            logger.error("❌ OPENAI_API_KEY not found in .env file")
            return None
        
        try:
            # Prepare the story content
            original_story = f"""
            Title: {article.get('title', '')}
            Description: {article.get('description', '')}
            Content: {article.get('content', '')[:500]}
            Source: {article.get('source', {}).get('name', 'Unknown')}
            """
            
            # Make OpenAI API call
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'gpt-4',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are an expert at writing news for children aged 6-12. You make complex topics simple and always focus on positive, hopeful angles.'
                    },
                    {
                        'role': 'user',
                        'content': self.story_prompt.format(original_story=original_story)
                    }
                ],
                'max_tokens': 300,
                'temperature': 0.7
            }
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                kid_story = result['choices'][0]['message']['content'].strip()
                
                # Parse the response
                parsed_story = self.parse_story_response(kid_story, article)
                return parsed_story
            else:
                logger.error(f"❌ OpenAI API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error rewriting story: {e}")
            return None

    def parse_story_response(self, story_text, original_article):
        """Parse the AI response into structured story format"""
        lines = story_text.strip().split('\n')
        
        story = {
            'headline': '',
            'sentences': [],
            'why_it_matters': '',
            'original_url': original_article.get('url', ''),
            'source': original_article.get('source', {}).get('name', ''),
            'published_at': original_article.get('publishedAt', ''),
            'image_url': original_article.get('urlToImage', ''),
            'generated_at': datetime.now().isoformat()
        }
        
        current_sentences = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('Headline:'):
                story['headline'] = line.replace('Headline:', '').strip()
            elif line.startswith('Why it matters:'):
                story['why_it_matters'] = line.replace('Why it matters:', '').strip()
            elif not line.startswith('Headline:') and not line.startswith('Why it matters:') and story['headline']:
                # This is a story sentence
                current_sentences.append(line)
        
        story['sentences'] = current_sentences[:5]  # Ensure exactly 5 sentences
        
        return story

    def generate_daily_stories(self, target_count=10):
        """Generate 10 kid-friendly news stories for today"""
        logger.info(f"📰 Generating {target_count} kid-friendly news stories...")
        
        # Fetch current news
        articles = self.fetch_current_news()
        if not articles:
            logger.error("❌ No articles fetched")
            return []
        
        # Generate kid-friendly stories
        kid_stories = []
        processed = 0
        
        for article in articles:
            if len(kid_stories) >= target_count:
                break
                
            processed += 1
            logger.info(f"🔄 Processing article {processed}/{len(articles)}: {article.get('title', '')[:50]}...")
            
            kid_story = self.rewrite_for_kids(article)
            if kid_story and kid_story['headline'] and len(kid_story['sentences']) >= 4:
                kid_stories.append(kid_story)
                logger.info(f"✅ Generated story {len(kid_stories)}: {kid_story['headline']}")
            else:
                logger.warning(f"⚠️ Skipped story - incomplete data")
        
        logger.info(f"🎉 Generated {len(kid_stories)} complete stories!")
        return kid_stories

    def save_stories(self, stories):
        """Save stories to JSON file"""
        today = datetime.now().strftime('%Y-%m-%d')
        filename = f"kids_news_{today}.json"
        filepath = self.output_dir / filename
        
        output_data = {
            'date': today,
            'generated_at': datetime.now().isoformat(),
            'story_count': len(stories),
            'stories': stories
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 Stories saved to: {filepath}")
        return str(filepath)

    def format_for_video(self, stories):
        """Format stories for video generation"""
        formatted_stories = []
        
        for i, story in enumerate(stories, 1):
            formatted = {
                'id': f"story_{i}",
                'headline': story['headline'],
                'full_text': ' '.join(story['sentences']) + ' ' + story['why_it_matters'],
                'sentences': story['sentences'],
                'why_it_matters': story['why_it_matters'],
                'duration_estimate': len(' '.join(story['sentences'])) * 0.05,  # Rough estimate
                'image_prompt': self.create_image_prompt(story),
                'source': story['source'],
                'category': self.determine_category(story['headline'])
            }
            formatted_stories.append(formatted)
        
        return formatted_stories

    def create_image_prompt(self, story):
        """Create Leonardo.ai prompt from story content"""
        headline = story['headline'].lower()
        content = ' '.join(story['sentences']).lower()
        
        # Determine main theme
        if any(word in content for word in ['space', 'planet', 'astronaut', 'mars', 'moon']):
            return "colorful space scene with planets and stars, children's book illustration style, bright and educational"
        elif any(word in content for word in ['ocean', 'sea', 'marine', 'fish', 'whale']):
            return "underwater ocean scene with colorful marine life, educational cartoon style, bright and cheerful"
        elif any(word in content for word in ['school', 'student', 'learn', 'education']):
            return "happy children in classroom or learning environment, diverse kids, bright educational illustration"
        elif any(word in content for word in ['animal', 'wildlife', 'zoo', 'pet']):
            return "cute animals in natural habitat, children's book style, colorful and friendly"
        elif any(word in content for word in ['technology', 'robot', 'invention', 'innovation']):
            return "friendly technology and innovation scene, colorful gadgets, kids and technology, educational style"
        elif any(word in content for word in ['environment', 'green', 'clean', 'renewable']):
            return "beautiful nature scene with clean environment, renewable energy, hopeful and green illustration"
        elif any(word in content for word in ['health', 'medicine', 'doctor', 'hospital']):
            return "positive healthcare scene with friendly doctors and happy families, reassuring medical illustration"
        else:
            return "positive news scene with happy diverse children, community helping each other, hopeful illustration style"

    def determine_category(self, headline):
        """Determine story category for organization"""
        headline_lower = headline.lower()
        
        if any(word in headline_lower for word in ['space', 'planet', 'astronaut', 'mars', 'moon']):
            return 'space'
        elif any(word in headline_lower for word in ['ocean', 'sea', 'marine', 'environment']):
            return 'environment'
        elif any(word in headline_lower for word in ['school', 'student', 'learn', 'education']):
            return 'education'
        elif any(word in headline_lower for word in ['technology', 'robot', 'invention', 'innovation']):
            return 'technology'
        elif any(word in headline_lower for word in ['health', 'medicine', 'doctor']):
            return 'health'
        elif any(word in headline_lower for word in ['animal', 'wildlife', 'zoo']):
            return 'animals'
        else:
            return 'general'

def main():
    """Generate today's kid-friendly news stories"""
    print("📰 Junior News Digest - Story Generator")
    print("=" * 45)
    print("🎯 Generating 10 kid-friendly news stories...")
    print()
    
    generator = NewsStoryGenerator()
    
    # Check API keys
    if not generator.news_api_key:
        print("❌ Please add NEWS_API_KEY to your .env file")
        print("   Get one free at: https://newsapi.org/")
        return 1
    
    if not generator.openai_api_key:
        print("❌ Please add OPENAI_API_KEY to your .env file")
        print("   Get one at: https://platform.openai.com/")
        return 1
    
    # Generate stories
    stories = generator.generate_daily_stories(target_count=10)
    
    if not stories:
        print("❌ No stories generated")
        return 1
    
    # Save stories
    filepath = generator.save_stories(stories)
    
    # Format for video
    video_stories = generator.format_for_video(stories)
    
    print(f"\n🎉 SUCCESS!")
    print(f"📊 Generated {len(stories)} kid-friendly stories")
    print(f"💾 Saved to: {filepath}")
    print(f"🎬 Ready for video generation!")
    
    # Preview first story
    if stories:
        print(f"\n📖 Preview of first story:")
        print(f"   Headline: {stories[0]['headline']}")
        print(f"   Sentences: {len(stories[0]['sentences'])}")
        print(f"   Why it matters: {stories[0]['why_it_matters'][:50]}...")
    
    return 0

if __name__ == "__main__":
    exit(main())
