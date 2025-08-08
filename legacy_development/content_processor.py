import openai
import textstat
import re
from typing import List, Dict
from .config import Config
from .news_scraper import NewsArticle
import logging

logger = logging.getLogger(__name__)

class ContentProcessor:
    def __init__(self):
        self.config = Config()
        if self.config.OPENAI_API_KEY:
            openai.api_key = self.config.OPENAI_API_KEY

    def simplify_for_kids(self, article: NewsArticle) -> NewsArticle:
        """Simplify article content for kids aged 6-10"""
        
        # First, calculate current reading level
        original_level = textstat.flesch_kincaid_grade(article.content)
        article.reading_level = original_level
        
        # If already at appropriate level, minimal processing
        if original_level <= self.config.TARGET_READING_LEVEL:
            simplified_content = self._basic_simplification(article.content)
        else:
            # Use AI to simplify if available
            if self.config.OPENAI_API_KEY:
                simplified_content = self._ai_simplify(article.title, article.content)
            else:
                simplified_content = self._basic_simplification(article.content)
        
        # Create new article with simplified content
        simplified_article = NewsArticle(
            title=self._simplify_title(article.title),
            content=simplified_content,
            url=article.url,
            source=article.source,
            published_date=article.published_date
        )
        
        simplified_article.is_kid_friendly = True
        simplified_article.reading_level = textstat.flesch_kincaid_grade(simplified_content)
        
        return simplified_article

    def _simplify_title(self, title: str) -> str:
        """Simplify title for kids"""
        # Remove complex punctuation
        title = re.sub(r'[:\-—–]', ' - ', title)
        # Replace various quote marks with simple quotes
        title = re.sub(r'[""]', '"', title)
        title = re.sub(r'['']', "'", title)
        
        # Basic word replacements
        replacements = {
            'scientists': 'smart people',
            'researchers': 'smart people',
            'investigation': 'looking into',
            'authorities': 'people in charge',
            'approximately': 'about',
            'significant': 'big',
            'additional': 'more',
            'numerous': 'many',
            'extensive': 'big',
            'demonstrate': 'show',
            'utilize': 'use',
            'purchase': 'buy',
            'assistance': 'help'
        }
        
        for complex_word, simple_word in replacements.items():
            title = re.sub(r'\b' + complex_word + r'\b', simple_word, title, flags=re.IGNORECASE)
        
        return title

    def _basic_simplification(self, content: str) -> str:
        """Basic text simplification without AI"""
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', content)
        simplified_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Skip very long sentences
            if len(sentence.split()) > 20:
                continue
                
            # Basic word replacements
            sentence = self._replace_complex_words(sentence)
            
            # Simplify sentence structure
            sentence = self._simplify_sentence_structure(sentence)
            
            if sentence:
                simplified_sentences.append(sentence)
        
        return '. '.join(simplified_sentences[:3]) + '.'  # Limit to 3 sentences

    def _replace_complex_words(self, text: str) -> str:
        """Replace complex words with simpler alternatives"""
        replacements = {
            # Common complex words and their simple replacements
            'approximately': 'about',
            'significant': 'big',
            'magnificent': 'amazing',
            'tremendous': 'huge',
            'extraordinary': 'amazing',
            'investigate': 'look into',
            'demonstrate': 'show',
            'participate': 'take part',
            'communicate': 'talk',
            'construct': 'build',
            'discover': 'find',
            'examine': 'look at',
            'observe': 'watch',
            'recognize': 'know',
            'understand': 'know',
            'receive': 'get',
            'require': 'need',
            'attempt': 'try',
            'achieve': 'do',
            'provide': 'give',
            'consider': 'think about',
            'determine': 'find out',
            'indicate': 'show',
            'suggest': 'say',
            'reveal': 'show',
            'establish': 'make',
            'maintain': 'keep',
            'obtain': 'get',
            'purchase': 'buy',
            'utilize': 'use',
            'assistance': 'help',
            'opportunity': 'chance',
            'environment': 'place',
            'individual': 'person',
            'location': 'place',
            'temperature': 'how hot or cold',
            'transportation': 'ways to travel',
            'information': 'facts',
            'organization': 'group',
            'community': 'neighborhood',
            'government': 'people who run the country',
            'definitely': 'for sure',
            'obviously': 'clearly',
            'particularly': 'especially',
            'generally': 'usually',
            'specifically': 'exactly',
            'essentially': 'basically',
            'immediately': 'right away',
            'eventually': 'later',
            'frequently': 'often',
            'occasionally': 'sometimes',
            'numerous': 'many',
            'various': 'different',
            'several': 'some',
            'multiple': 'many',
            'additional': 'more',
            'enormous': 'huge',
            'tiny': 'very small',
            'gigantic': 'huge',
            'microscopic': 'very tiny'
        }
        
        for complex_word, simple_word in replacements.items():
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(complex_word) + r'\b'
            text = re.sub(pattern, simple_word, text, flags=re.IGNORECASE)
        
        return text

    def _simplify_sentence_structure(self, sentence: str) -> str:
        """Simplify sentence structure"""
        
        # Remove parenthetical information
        sentence = re.sub(r'\([^)]*\)', '', sentence)
        
        # Remove quotes and complex punctuation
        sentence = re.sub(r'[""]', '"', sentence)
        sentence = re.sub(r'['']', "'", sentence)
        
        # Split compound sentences with "and"
        if ' and ' in sentence and len(sentence.split()) > 15:
            parts = sentence.split(' and ', 1)
            sentence = parts[0].strip()
        
        # Remove starting conjunctions that make sentences complex
        sentence = re.sub(r'^(However|Nevertheless|Furthermore|Moreover|Additionally|Therefore|Consequently),?\s*', '', sentence, flags=re.IGNORECASE)
        
        # Ensure sentence ends properly
        if sentence and not sentence.endswith(('.', '!', '?')):
            sentence += '.'
        
        return sentence.strip()

    def _ai_simplify(self, title: str, content: str) -> str:
        """Use OpenAI to simplify content for kids"""
        try:
            prompt = f"""
            Please rewrite this news article for children aged 6-10 years old. 
            
            Rules:
            - Use simple words that kids can understand
            - Keep sentences short (10 words or less)
            - Make it positive and interesting for kids
            - Use a reading level appropriate for 2nd-3rd grade
            - Keep it to 2-3 sentences maximum
            - Make it exciting but not scary
            
            Title: {title}
            Original content: {content}
            
            Kid-friendly version:
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7
            )
            
            simplified = response.choices[0].message.content.strip()
            
            # Verify reading level
            level = textstat.flesch_kincaid_grade(simplified)
            if level <= self.config.TARGET_READING_LEVEL + 1:
                return simplified
            else:
                # Fallback to basic simplification
                return self._basic_simplification(content)
                
        except Exception as e:
            logger.error(f"AI simplification failed: {e}")
            return self._basic_simplification(content)

    def add_kid_friendly_context(self, article: NewsArticle) -> str:
        """Add kid-friendly context and explanation"""
        
        context_starters = [
            "Did you know that ",
            "Isn't it cool that ",
            "Amazing news! ",
            "Guess what? ",
            "Here's something fun: ",
            "This is so exciting! "
        ]
        
        # Pick a context starter based on content
        if any(word in article.content.lower() for word in ['space', 'planet', 'star']):
            starter = "Amazing space news! "
        elif any(word in article.content.lower() for word in ['animal', 'pet', 'zoo']):
            starter = "Cool animal news! "
        elif any(word in article.content.lower() for word in ['invention', 'robot', 'technology']):
            starter = "Super cool invention! "
        else:
            starter = context_starters[0]
        
        return starter + article.content

    def get_reading_level_description(self, grade_level: float) -> str:
        """Get human-readable description of reading level"""
        if grade_level <= 2:
            return "Perfect for beginning readers!"
        elif grade_level <= 4:
            return "Great for kids learning to read!"
        elif grade_level <= 6:
            return "Good for confident readers!"
        else:
            return "A bit challenging but doable!"

if __name__ == "__main__":
    # Test the content processor
    processor = ContentProcessor()
    
    # Test article
    test_article = NewsArticle(
        title="Scientists Discover Extraordinary New Species in the Deep Ocean",
        content="Researchers from the Marine Biology Institute have discovered a magnificent new species of jellyfish in the depths of the Pacific Ocean. The extraordinary creature possesses bioluminescent capabilities and demonstrates unique behavioral patterns that scientists are investigating further.",
        url="http://example.com",
        source="Test Source"
    )
    
    simplified = processor.simplify_for_kids(test_article)
    print(f"Original title: {test_article.title}")
    print(f"Simplified title: {simplified.title}")
    print(f"Original content: {test_article.content}")
    print(f"Simplified content: {simplified.content}")
    print(f"Reading level: {simplified.reading_level}") 