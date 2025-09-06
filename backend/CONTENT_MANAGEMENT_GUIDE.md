# 📝 Content Management Guide
## Junior News Digest Backend

This guide shows you how to add articles and videos to your Junior News Digest backend.

## 🚀 Quick Start

### 1. Add a Single Article
```bash
cd production
python add_content.py add-article \
  --title "Kids Invent Amazing Solar Robot" \
  --content "A group of students created an incredible solar-powered robot that cleans parks and helps the environment..." \
  --category technology \
  --author "Young Inventors Team" \
  --trending
```

### 2. Add a Single Video
```bash
python add_content.py add-video \
  --title "Solar Robot in Action" \
  --url "https://your-cdn.com/videos/solar-robot.mp4" \
  --description "Watch the amazing solar robot clean up parks!" \
  --duration "4:30" \
  --category technology
```

### 3. Generate Sample Content for Testing
```bash
# Add 10 sample articles
python bulk_content_loader.py --sample-articles 10

# Add 5 sample videos  
python bulk_content_loader.py --sample-videos 5
```

## 📋 Detailed Commands

### Article Management

#### Add Article with All Options
```bash
python add_content.py add-article \
  --title "Young Scientists Discover Clean Energy Solution" \
  --content "Amazing story content here..." \
  --category science \
  --author "Dr. Science Kids" \
  --summary "Short description of the article" \
  --breaking \
  --trending \
  --hot
```

#### Available Categories
- `technology` - Tech innovations and inventions
- `science` - Scientific discoveries and research
- `environment` - Environmental and climate stories
- `health` - Health and medical breakthroughs
- `education` - Educational initiatives and learning
- `sports` - Sports achievements and events
- `culture` - Cultural events and arts
- `general` - General interest stories

#### Article Flags
- `--breaking` - Mark as breaking news (🔴 BREAKING)
- `--trending` - Mark as trending (🔥 TRENDING)
- `--hot` - Mark as hot topic (⚡ HOT)

### Video Management

#### Add Video with All Options
```bash
python add_content.py add-video \
  --title "Amazing Kids Change the World" \
  --url "https://cdn.example.com/videos/kids-change-world.mp4" \
  --description "Inspiring story of young changemakers making a difference" \
  --thumbnail "https://cdn.example.com/thumbnails/kids-change-world.jpg" \
  --duration "7:45" \
  --category education
```

### List Content

```bash
# List recent articles
python add_content.py list-articles

# List recent videos
python add_content.py list-videos
```

## 📦 Bulk Content Loading

### From JSON File

1. **Create a JSON file** (e.g., `my_content.json`):
```json
{
  "articles": [
    {
      "title": "Kids Build Underwater Robot",
      "content": "Full article content here...",
      "category": "technology",
      "author": "Ocean Explorer Team",
      "is_trending": true,
      "is_hot": false,
      "is_breaking": false
    }
  ],
  "videos": [
    {
      "title": "Underwater Robot Adventure",
      "video_url": "https://example.com/videos/underwater-robot.mp4",
      "description": "Join the underwater robot on its amazing journey!",
      "duration": "5:20",
      "category": "technology",
      "thumbnail_url": "https://example.com/thumbnails/underwater-robot.jpg"
    }
  ]
}
```

2. **Load the content**:
```bash
python bulk_content_loader.py --from-json my_content.json
```

### Create Sample JSON Template
```bash
python bulk_content_loader.py --create-sample-json template.json
```

## 🌐 Production Deployment

### On Your Local Machine
```bash
# Navigate to your project
cd /Users/shadrackaddo/Desktop/projects/junior\ graphic/production

# Add content
python add_content.py add-article --title "..." --content "..." --category technology
```

### On Render (Production Server)

1. **SSH into your Render instance** (if available)
2. **Or create a deployment script** that runs the content management commands
3. **Or use the Render Console** to run commands directly

### Via API (Alternative Method)

You can also create content via HTTP requests to your backend:

```bash
# Add article via API
curl -X POST https://kids-news-backend.onrender.com/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Amazing New Discovery",
    "content": "Full article content...",
    "category": "science",
    "author": "Science Team"
  }'

# Add video via API  
curl -X POST https://kids-news-backend.onrender.com/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Educational Video",
    "video_url": "https://example.com/video.mp4",
    "description": "Amazing educational content",
    "duration": "4:30"
  }'
```

## 🔧 Database Management

### View Database Contents
```bash
# Connect to SQLite database
sqlite3 junior_news.db

# List all articles
SELECT id, title, category, published_date FROM articles ORDER BY published_date DESC;

# List all videos
SELECT id, title, duration, category FROM videos ORDER BY published_date DESC;

# Exit SQLite
.quit
```

### Backup Database
```bash
# Create backup
cp junior_news.db junior_news_backup_$(date +%Y%m%d).db
```

## 📊 Content Guidelines

### Articles
- **Title**: Clear, engaging, kid-friendly (max 100 characters)
- **Content**: 200-800 words, written for ages 6-12
- **Summary**: Auto-generated or custom (max 200 characters)
- **Categories**: Use appropriate category for better organization
- **Author**: Credit the content creator

### Videos
- **Duration**: Recommended 3-8 minutes for kid attention spans
- **Thumbnails**: Bright, colorful, engaging images
- **Descriptions**: Clear explanation of what kids will learn
- **URLs**: Ensure videos are accessible and kid-safe

## 🚨 Important Notes

1. **Content Safety**: All content should be appropriate for children ages 6-12
2. **Database Backups**: Always backup before bulk operations
3. **Testing**: Test content additions in development before production
4. **Categories**: Use consistent category names for better organization
5. **URLs**: Ensure all video URLs are accessible and working

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**:
```bash
# Check if database file exists
ls -la junior_news.db

# Check permissions
chmod 644 junior_news.db
```

**Import Errors**:
```bash
# Make sure you're in the production directory
cd production

# Check Python path
python -c "import sys; print(sys.path)"
```

**Content Not Appearing in App**:
1. Check database with `list-articles` command
2. Verify API endpoints are working
3. Check app's API configuration
4. Restart the backend service

## 📈 Content Strategy

### Recommended Content Mix
- **40%** Science & Technology stories
- **25%** Environment & Climate stories  
- **20%** Health & Education stories
- **15%** Sports, Culture & General stories

### Publishing Schedule
- **Daily**: 2-3 new articles
- **Weekly**: 1-2 new videos
- **Special Events**: Breaking news as needed

### Engagement Features
- Mark trending topics with `--trending`
- Use `--breaking` for urgent, important news
- Use `--hot` for popular, engaging content

---

**Need Help?** Check the database with `python add_content.py list-articles` to see your content!
