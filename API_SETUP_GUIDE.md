# 🔑 API Setup Guide - Professional Image Generation & News

## 📋 **Required API Keys**

Add these to your `.env` file for professional image generation and current news stories:

```env
# News API (Required for current stories)
NEWS_API_KEY=your_news_api_key_here

# OpenAI API (Required for story rewriting + DALL-E 3 images)
OPENAI_API_KEY=your_openai_api_key_here

# Leonardo.ai API (Optional - high quality illustrations)
LEONARDO_API_KEY=your_leonardo_api_key_here

# Stability AI API (Optional - Stable Diffusion images)
STABILITY_API_KEY=your_stability_api_key_here

# ElevenLabs API (Already configured)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## 🌟 **Image Quality Comparison**

### **Current PIL Images** ❌
- Basic shapes and text
- Not suitable for kids
- Poor visual quality
- Limited educational value

### **Professional AI Images** ✅
- **DALL-E 3**: Highest quality, perfect for kids content
- **Leonardo.ai**: Excellent cartoon style, great for education
- **Stability AI**: Good quality, anime/illustration style
- All services create proper illustrations with characters and scenes

## 🔧 **API Setup Instructions**

### 1. **News API** (FREE)
- **Website**: https://newsapi.org/
- **Free Tier**: 1,000 requests/month
- **Purpose**: Fetch current real-world news stories
- **Setup**: Register → Get API key → Add to `.env`

### 2. **OpenAI API** (Pay-per-use)
- **Website**: https://platform.openai.com/
- **Cost**: ~$0.01-0.04 per story rewrite + $0.04 per DALL-E 3 image
- **Purpose**: Rewrite news for kids + generate highest quality images
- **Setup**: Create account → Add payment → Get API key → Add to `.env`

### 3. **Leonardo.ai API** (FREE Tier)
- **Website**: https://leonardo.ai/
- **Free Tier**: 150 tokens daily (≈30-75 images)
- **Purpose**: High-quality cartoon illustrations
- **Setup**: Register → API section → Generate key → Add to `.env`

### 4. **Stability AI** (Pay-per-use)
- **Website**: https://platform.stability.ai/
- **Cost**: ~$0.01-0.05 per image
- **Purpose**: Stable Diffusion illustrations
- **Setup**: Create account → API keys → Add to `.env`

## 💰 **Cost Breakdown**

### **Daily Video (10 stories)**
- News fetching: **FREE** (within limits)
- Story rewriting: **~$0.30** (OpenAI GPT-4)
- Images (DALL-E 3): **~$0.40** (10 images)
- **Total per day: ~$0.70**

### **Monthly Cost**
- **~$21/month** for daily professional videos
- Much cheaper if using Leonardo.ai free tier
- Even cheaper with Stability AI

## 🎯 **Recommended Setup**

### **Best Quality** (Recommended)
```env
NEWS_API_KEY=your_key
OPENAI_API_KEY=your_key  # For stories + DALL-E 3 images
LEONARDO_API_KEY=your_key  # Backup for images
```

### **Budget Option**
```env
NEWS_API_KEY=your_key
OPENAI_API_KEY=your_key  # For stories only
LEONARDO_API_KEY=your_key  # Free tier images
```

### **Free Tier Only**
```env
NEWS_API_KEY=your_key  # Free tier
LEONARDO_API_KEY=your_key  # Free tier
# Note: Stories won't be rewritten for kids without OpenAI
```

## 🚀 **Usage**

### **Generate Daily News Video**
```bash
# Complete system with professional images
python3 scripts/complete_video_system/news_video_generator.py
```

### **Test Image Services**
```bash
# Test which services are working
python3 scripts/image_generation/professional_image_service.py
```

### **Generate Stories Only**
```bash
# Just generate news stories
python3 scripts/content_generation/news_story_generator.py
```

## ✅ **Features You'll Get**

### **Current News Stories**
- ✅ 10 real-world current events
- ✅ Rewritten for ages 6-12
- ✅ Clear headlines with locations
- ✅ Exactly 5 sentences per story
- ✅ "Why it matters" explanations
- ✅ Positive and hopeful messaging

### **Professional Images**
- ✅ High-quality AI illustrations
- ✅ Kid-friendly cartoon style
- ✅ Educational and engaging
- ✅ Matches story content perfectly
- ✅ Much better than current PIL images

### **Complete Videos**
- ✅ Official Junior News Digest branding
- ✅ Professional image quality
- ✅ 7+ minute full videos
- ✅ 60-second YouTube Shorts
- ✅ Ready for social media

## 🎨 **Image Quality Examples**

**Before (PIL):** Simple text on gradient background  
**After (DALL-E 3):** Detailed cartoon scenes with characters, actions, and educational content

**Before (PIL):** Basic shapes and colors  
**After (Leonardo.ai):** Professional children's book illustrations

The difference is **night and day** - your videos will look truly professional! 🎉

## 🔒 **Security Note**

- Keep API keys in `.env` file only
- Never commit `.env` to version control
- Use environment variables in production
- Monitor API usage to avoid unexpected charges
