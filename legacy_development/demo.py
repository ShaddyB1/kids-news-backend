#!/usr/bin/env python3
"""
Quick demo of the kids newsletter - no internet required!
"""

from datetime import datetime
from newsletter_generator import NewsletterGenerator
from news_scraper import NewsArticle
from kids_activities import KidsActivitiesGenerator

def create_demo_newsletter():
    """Create a demo newsletter with sample content"""
    
    # Create sample articles (no internet scraping needed)
    sample_articles = [
        NewsArticle(
            title="Smart People Find Amazing Glowing Fish! 🐠✨",
            content="Scientists found a new fish that glows like a rainbow! It lives deep in the ocean where it's very dark. The fish makes its own light to talk to other fish. It's like having a flashlight built into your body!",
            url="http://example.com/1",
            source="Science News for Kids"
        ),
        NewsArticle(
            title="Kids Around the World Help Save Animals! 🐾💚",
            content="Children everywhere are helping to save animals! They are building bird houses, cleaning up beaches, and planting trees. One group of kids saved 100 sea turtles by cleaning trash from the beach!",
            url="http://example.com/2", 
            source="Animal Friends News"
        ),
        NewsArticle(
            title="New Robot Helps Kids Learn Math! 🤖📚",
            content="A friendly robot was made to help kids with math homework! The robot can dance, tell jokes, and make math fun. Kids who use the robot are getting better at math and having more fun learning!",
            url="http://example.com/3",
            source="Cool Tech for Kids"
        )
    ]
    
    # Set reading levels
    for article in sample_articles:
        article.reading_level = 2.8
        article.is_kid_friendly = True
    
    # Generate newsletter
    generator = NewsletterGenerator()
    activities_gen = KidsActivitiesGenerator()
    
    # Create HTML newsletter
    html_content = generator.create_html_newsletter(sample_articles)
    
    # Add activities section
    activities_html = activities_gen.create_kids_section_html('science')
    html_content = html_content.replace(
        '<div class="fun-fact">',
        activities_html + '<div class="fun-fact">',
        1
    )
    
    # Save demo newsletter
    demo_file = generator.save_newsletter(html_content, "demo_newsletter.html")
    
    print("🎉 Demo newsletter created!")
    print(f"📁 File saved: {demo_file}")
    print("🌐 Open this file in your web browser to see the design!")
    
    return demo_file

if __name__ == "__main__":
    create_demo_newsletter()