# Thumbnail Generation System

This system automatically generates and manages thumbnails for news stories using AI image generation services and fallback options.

## Features

- 🤖 **AI Image Generation**: DALL-E 3, Leonardo.ai, Stability AI
- 📸 **Stock Photos**: Unsplash integration
- 🎨 **Placeholder Generation**: Custom thumbnails with story info
- 🔄 **Automatic Analysis**: Story content analysis for relevant thumbnails
- 📱 **API Integration**: RESTful API for thumbnail management
- 🛠️ **CLI Tools**: Command-line management utilities

## Setup

### 1. Install Dependencies

```bash
pip install -r thumbnail_requirements.txt
```

### 2. Configure API Keys

Edit `thumbnail_config.json` or set environment variables:

```bash
export OPENAI_API_KEY="your-openai-key"
export LEONARDO_API_KEY="your-leonardo-key"
export STABILITY_API_KEY="your-stability-key"
export UNSPLASH_API_KEY="your-unsplash-key"
```

### 3. Start Backend

The thumbnail API is automatically included in the main backend:

```bash
python integrated_backend.py
```

## Usage

### Command Line Interface

#### Generate All Thumbnails
```bash
python manage_thumbnails.py generate-all
```

#### Generate Specific Thumbnails
```bash
python manage_thumbnails.py generate-specific --story-ids story_001 story_002
```

#### Check Status
```bash
python manage_thumbnails.py status
```

#### Clean Orphaned Thumbnails
```bash
python manage_thumbnails.py clean
```

#### Analyze Story
```bash
python manage_thumbnails.py analyze --story-ids story_001
```

#### Force Regenerate
```bash
python manage_thumbnails.py generate-all --force
```

### API Endpoints

#### Generate Thumbnails for Stories
```bash
POST /api/thumbnails/generate
Content-Type: application/json

{
  "stories": [
    {
      "id": "story_001",
      "title": "Kids Plant Trees",
      "summary": "Students plant 1000 trees",
      "content": "Full story content...",
      "category": "environment"
    }
  ]
}
```

#### Generate Single Thumbnail
```bash
POST /api/thumbnails/generate/story_001
Content-Type: application/json

{
  "story": {
    "id": "story_001",
    "title": "Kids Plant Trees",
    "summary": "Students plant 1000 trees",
    "content": "Full story content...",
    "category": "environment"
  }
}
```

#### Check Thumbnail Status
```bash
GET /api/thumbnails/status
```

#### Upload Custom Thumbnail
```bash
POST /api/thumbnails/upload
Content-Type: multipart/form-data

file: [image file]
story_id: story_001
```

#### Delete Thumbnail
```bash
DELETE /api/thumbnails/delete/story_001
```

#### Analyze Story for Thumbnail
```bash
POST /api/thumbnails/analyze/story_001
Content-Type: application/json

{
  "story": {
    "id": "story_001",
    "title": "Kids Plant Trees",
    "summary": "Students plant 1000 trees",
    "content": "Full story content...",
    "category": "environment"
  }
}
```

## How It Works

### 1. Story Analysis
The system analyzes story content to extract:
- **Themes**: environment, science, health, sports, etc.
- **Visual Elements**: trees, robots, food, sports equipment, etc.
- **Category-specific Elements**: Based on story category

### 2. Prompt Generation
Creates optimized prompts for each AI provider:
- **DALL-E 3**: Detailed, kid-friendly descriptions
- **Leonardo.ai**: Concise, style-focused prompts
- **Stability AI**: Technical, parameter-optimized prompts
- **Unsplash**: Search query optimization

### 3. Thumbnail Generation
Tries providers in order of preference:
1. Preferred provider (configurable)
2. DALL-E 3
3. Leonardo.ai
4. Stability AI
5. Unsplash stock photos
6. Placeholder generation (fallback)

### 4. Image Processing
All generated images are:
- Resized to 400x300 (4:3 aspect ratio)
- Optimized for web (JPEG, 85% quality)
- Saved with story ID as filename

## Configuration

### Provider Settings
Edit `thumbnail_config.json` to configure:

```json
{
  "preferred_provider": "dalle3",
  "fallback_to_stock": true,
  "generate_placeholder": true,
  "thumbnail_size": {
    "width": 400,
    "height": 300
  },
  "quality": 85
}
```

### Category Customization
Add or modify categories in the config:

```json
{
  "categories": {
    "your_category": {
      "color": [255, 0, 0],
      "emoji": "🎯",
      "keywords": ["keyword1", "keyword2"],
      "visual_elements": ["element1", "element2"]
    }
  }
}
```

## Integration with App

The app automatically uses generated thumbnails:

```typescript
// In StoryDetailScreen.tsx
const thumbnailUrl = `${API_CONFIG.baseUrl}${video.thumbnail_url}`;
```

## Troubleshooting

### Common Issues

1. **API Key Not Set**
   - Check environment variables
   - Verify API key validity

2. **Generation Fails**
   - Check internet connection
   - Verify API quotas
   - Check logs for specific errors

3. **Poor Quality Images**
   - Adjust prompt templates
   - Try different providers
   - Modify generation parameters

4. **Missing Thumbnails**
   - Run status check: `python manage_thumbnails.py status`
   - Regenerate missing thumbnails
   - Check file permissions

### Logs
Check logs for detailed error information:
```bash
tail -f logs/thumbnail_generator.log
```

## Cost Optimization

### Free Options
- **Placeholder Generation**: Always free
- **Unsplash**: Free with API key
- **Stability AI**: Free tier available

### Paid Options
- **DALL-E 3**: $0.040 per image
- **Leonardo.ai**: Various pricing tiers
- **Stability AI**: Pay-per-use

### Recommendations
1. Use placeholder generation for development
2. Enable Unsplash for production (free)
3. Use DALL-E 3 for high-quality custom images
4. Set up proper fallback chains

## Examples

### Generate Thumbnails for All Stories
```bash
# Check current status
python manage_thumbnails.py status

# Generate missing thumbnails
python manage_thumbnails.py generate-all

# Force regenerate all
python manage_thumbnails.py generate-all --force
```

### Custom Thumbnail Upload
```bash
curl -X POST http://localhost:5002/api/thumbnails/upload \
  -F "file=@custom_thumbnail.jpg" \
  -F "story_id=story_001"
```

### Analyze Story Content
```bash
python manage_thumbnails.py analyze --story-ids story_001
```

This will show:
- Extracted themes
- Visual elements
- Generated prompts for each provider
- Recommended thumbnail approach
