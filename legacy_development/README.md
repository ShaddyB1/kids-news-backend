# 📰 Kids Daily News Newsletter Generator

A fun and educational daily newsletter system that scrapes the internet for news and transforms it into kid-friendly content suitable for ages 6-10!

## ✨ Features

- 🌍 **Daily News Scraping**: Automatically fetches news from kid-friendly and general sources
- 🎯 **Content Filtering**: Filters out negative/inappropriate content and focuses on positive stories
- 📚 **Age-Appropriate Language**: Simplifies complex news articles for 6-10 year olds reading level
- 🎨 **Beautiful HTML Newsletters**: Creates colorful, engaging newsletters with emojis and kid-friendly design
- 🎪 **Daily Activities**: Includes fun activities, facts, and positive messages
- ⏰ **Automatic Scheduling**: Can run daily at a specified time
- 🤖 **AI Enhancement**: Optional OpenAI integration for better content simplification

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Configuration (Optional)

Copy the example configuration:
```bash
cp config_example.env .env
```

Edit `.env` to add your OpenAI API key (optional but recommended for better content):
```
OPENAI_API_KEY=your_api_key_here
```

### 3. Test Run

Generate your first newsletter:
```bash
python main.py --mode test
```

This will create sample newsletters in the `newsletters/` folder!

## 📖 Usage

### Generate Newsletter Now
```bash
python main.py --mode now
```

### Schedule Daily Newsletter
```bash
python main.py --mode schedule
```
By default, this runs every day at 8:00 AM. Change the time:
```bash
python main.py --mode schedule --time 09:30
```

### Test Individual Components

Test news scraping:
```bash
python news_scraper.py
```

Test content processing:
```bash
python content_processor.py
```

Test newsletter generation:
```bash
python newsletter_generator.py
```

Test activities generator:
```bash
python kids_activities.py
```

## 📁 Project Structure

```
kids-newsletter/
├── main.py                    # Main application
├── config.py                  # Configuration settings
├── news_scraper.py           # News scraping module
├── content_processor.py      # Content simplification
├── newsletter_generator.py   # HTML/text newsletter creation
├── kids_activities.py        # Fun activities generator
├── requirements.txt          # Python dependencies
├── config_example.env        # Example environment config
├── README.md                 # This file
├── newsletters/              # Generated newsletters (created automatically)
└── kids_newsletter.log       # Application logs
```

## 🎯 How It Works

1. **News Scraping**: Fetches articles from kid-friendly sources (BBC Newsround, National Geographic Kids) and general news RSS feeds
2. **Content Filtering**: Removes articles with negative topics (violence, disasters, etc.) and prioritizes positive content
3. **Language Simplification**: Converts complex language to 2nd-3rd grade reading level using word replacements and AI
4. **Newsletter Generation**: Creates beautiful HTML and text newsletters with activities and fun facts
5. **Activity Integration**: Adds themed activities, fun facts, and positive messages for kids

## 🌟 News Sources

**Kid-Friendly Sources:**
- BBC Newsround
- National Geographic Kids
- Time for Kids

**General Sources (filtered and simplified):**
- CNN RSS
- Reuters Top News
- National Geographic News

## 🎨 Newsletter Features

- **Colorful Design**: Kid-friendly colors and Comic Sans font
- **Emojis**: Lots of fun emojis throughout
- **Reading Levels**: Shows reading difficulty for each article
- **Activities Section**: Daily activities categorized by type (creative, outdoor, educational, etc.)
- **Fun Facts**: Daily interesting facts for kids
- **Positive Messages**: Encouraging messages to build confidence

## ⚙️ Configuration Options

Edit `config.py` or use environment variables:

- `TARGET_READING_LEVEL`: Target grade level (default: 3.0)
- `MAX_ARTICLES_PER_DAY`: Maximum articles per newsletter (default: 5)
- `NEWSLETTER_TITLE`: Custom newsletter title
- `OPENAI_API_KEY`: For AI-powered content simplification

## 🤖 AI Enhancement (Optional)

With an OpenAI API key, the system can:
- Better simplify complex language
- Ensure appropriate reading levels
- Create more engaging content for kids

Get your API key at: https://platform.openai.com/api-keys

## 🔧 Customization

### Add New News Sources

Edit `config.py` and add RSS feeds to:
- `RSS_FEEDS`: Kid-friendly RSS feeds
- `GENERAL_NEWS_SOURCES`: General news (will be filtered)

### Modify Content Filters

Edit `content_processor.py`:
- `POSITIVE_TOPICS`: Topics to prioritize
- `NEGATIVE_TOPICS`: Topics to filter out
- Word replacement dictionaries

### Customize Activities

Edit `kids_activities.py`:
- Add new activity categories
- Add more fun facts
- Create themed activity sets

## 📊 Example Output

The system generates:
- `kids_newsletter_YYYYMMDD.html`: Beautiful HTML newsletter
- `kids_newsletter_YYYYMMDD.txt`: Plain text version
- Logs in `kids_newsletter.log`

## 🛠️ Troubleshooting

**No articles found:**
- Check internet connection
- RSS feeds may be temporarily unavailable
- Check logs for specific errors

**Reading level too high:**
- Ensure OpenAI API key is set for better simplification
- Adjust `TARGET_READING_LEVEL` in config

**Scheduling not working:**
- Ensure system clock is correct
- Check that the script keeps running
- Use `screen` or similar for long-running processes

## 🎉 Sample Activities

The newsletter includes activities like:
- 🎨 Creative: Drawing, storytelling, music
- 🏃‍♂️ Outdoor: Nature hunts, gardening, sports
- 🧪 Science: Simple experiments, observations
- 📚 Educational: Reading, learning new words
- 👨‍👩‍👧‍👦 Social: Family activities, helping others

## 📝 License

This project is open source. Feel free to modify and adapt for your needs!

## 🤝 Contributing

Ideas for improvement:
- Add more news sources
- Improve content filtering
- Add more activity types
- Create email sending functionality
- Add weather-based activities
- Multi-language support

Happy learning! 🌟📚🚀 