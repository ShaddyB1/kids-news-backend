# 📰 Junior News Digest
## Complete News App with Automated Editorial Workflow

A comprehensive news application designed for children ages 6-12, featuring automated content generation, editorial workflow management, and a beautiful React Native app.

## 🏗️ **Project Structure**

```
junior-news-digest/
├── backend/           # Integrated backend with API + Editorial System
│   ├── integrated_backend.py      # Main backend with automation
│   ├── add_content.py             # Content management tools
│   ├── editorial_workflow.py      # Editorial workflow system
│   ├── weekly_scheduler.py        # Automation scheduler
│   ├── requirements.txt           # Python dependencies
│   └── docs/                      # Backend documentation
├── app/               # React Native Application
│   ├── src/                       # Source code
│   ├── App.tsx                    # Main app component
│   ├── package.json               # App dependencies
│   └── assets/                    # App assets
├── assets/            # Shared Media Assets
│   ├── OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png
│   └── generated_videos/          # Generated content
├── deployment/        # Deployment Configuration
│   ├── render.yaml               # Render deployment config
│   └── deployment_guide.md       # Deployment instructions
├── docs/              # Documentation
│   ├── CONTENT_MANAGEMENT_GUIDE.md
│   ├── EDITORIAL_WORKFLOW_GUIDE.md
│   └── API_DOCUMENTATION.md
└── archive/           # Archived Development Files
```

## 🚀 **Quick Start**

### **1. Backend Setup**
```bash
cd backend

# Install dependencies
pip3 install -r requirements.txt

# Start integrated backend (API + Editorial Portal + Automation)
python3 integrated_backend.py
```

**Backend will be available at:**
- 📱 **API**: http://localhost:5000/api/
- 📝 **Editorial Portal**: http://localhost:5000/editorial/
- 🔍 **Health Check**: http://localhost:5000/api/health

### **2. App Setup**
```bash
cd app

# Install dependencies
npm install

# Start development server
npx expo start
```

### **3. Access Editorial Portal**
Visit http://localhost:5000/editorial/ to:
- 📝 Review candidate stories
- ✅ Approve/reject content
- 🔄 Process approved stories
- 📅 Manage weekly schedule

## ⚙️ **Automated Editorial Workflow**

### **Weekly Schedule**
- **Sunday 9:00 AM**: Generate 15-20 candidate stories
- **Monday 8:00 AM**: Publish 1/3 of approved content
- **Wednesday 8:00 AM**: Publish 1/3 of approved content  
- **Friday 8:00 AM**: Publish 1/3 of approved content

### **Editorial Process**
1. **Story Generation**: AI generates candidate stories
2. **Editorial Review**: Review stories via web portal
3. **Content Processing**: Approved stories become articles
4. **Automated Publishing**: Content published on schedule

## 🎯 **Key Features**

### **Backend Features**
- ✅ **RESTful API** for mobile app
- 📝 **Editorial Portal** for content management
- 🤖 **Automated Story Generation** 
- ⏰ **Background Automation** scheduler
- 🗄️ **SQLite Database** with full schema
- 📊 **Real-time Status** monitoring
- 🔐 **JWT Authentication** ready

### **App Features**
- 📱 **React Native** with Expo SDK 53
- 🌓 **Dark/Light Themes** with persistence
- 🎥 **Video Player** integration
- 📰 **Article Reader** with quizzes
- 🔍 **Search & Categories** 
- 👤 **User Profiles** and bookmarks
- 📊 **Real-time Data** from backend API

### **Editorial Features**
- 📝 **Web-based Review Portal**
- 🎯 **Priority-based Story Ranking**
- ✅ **One-click Approve/Reject**
- 📝 **Editor Notes** and feedback
- 📅 **Weekly Content Scheduling**
- 📊 **Progress Tracking** dashboard

## 🔧 **Development**

### **Backend Development**
```bash
cd backend

# Generate candidate stories
python3 editorial_workflow.py generate-candidates --count 20

# Start review portal only
python3 editorial_workflow.py review-portal

# Process approved stories
python3 editorial_workflow.py process-approved

# Check automation status
python3 weekly_scheduler.py --overview
```

### **App Development**
```bash
cd app

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android
npx expo run:android

# Build for production
npx expo build
```

### **Content Management**
```bash
cd backend

# Add single article
python3 add_content.py add-article --title "Amazing Discovery" --content "..." --category science

# Add single video
python3 add_content.py add-video --title "Cool Video" --url "video.mp4" --description "..."

# Bulk load content
python3 bulk_content_loader.py --sample-articles 10 --sample-videos 5

# List current content
python3 add_content.py list-articles
python3 add_content.py list-videos
```

## 🌐 **Production Deployment**

### **Deploy to Render**
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy integrated backend"
   git push origin main
   ```

2. **Render Auto-deploys** using `deployment/render.yaml`

3. **Access Production**:
   - API: https://kids-news-backend.onrender.com/api/
   - Editorial: https://kids-news-backend.onrender.com/editorial/

### **App Store Deployment**
```bash
cd app

# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android

# Submit to stores
eas submit --platform all
```

## 📊 **API Endpoints**

### **Public API**
- `GET /api/health` - Health check
- `GET /api/articles` - Get all articles
- `GET /api/videos` - Get all videos
- `GET /api/articles/{id}` - Get specific article

### **Editorial API**
- `GET /editorial/` - Editorial portal
- `POST /editorial/generate` - Generate candidates
- `POST /editorial/review-story` - Review story
- `POST /editorial/process-approved` - Process stories

## 🔍 **Monitoring & Analytics**

### **Health Monitoring**
```bash
# Check backend health
curl https://kids-news-backend.onrender.com/api/health

# Check editorial status
curl https://kids-news-backend.onrender.com/editorial/api/status
```

### **Database Monitoring**
```bash
cd backend

# Check database status
python3 -c "from integrated_backend import db_manager; print('Database OK')"

# View database contents
sqlite3 junior_news_integrated.db ".tables"
```

## 🛠️ **Troubleshooting**

### **Common Issues**

**Backend Won't Start:**
```bash
# Check dependencies
pip3 install -r backend/requirements.txt

# Check port availability
lsof -i :5000

# Check logs
tail -f backend/backend.log
```

**App Won't Connect:**
```bash
# Update API URL in app/src/config/api.ts
# Restart Metro bundler
cd app && npx expo start --clear
```

**Editorial Portal Not Loading:**
```bash
# Check if backend is running
curl http://localhost:5000/editorial/

# Clear browser cache
# Check browser console for errors
```

## 📚 **Documentation**

- 📖 **[Content Management Guide](docs/CONTENT_MANAGEMENT_GUIDE.md)** - How to add articles and videos
- 📝 **[Editorial Workflow Guide](docs/EDITORIAL_WORKFLOW_GUIDE.md)** - Complete editorial process
- 🚀 **[Deployment Guide](docs/RENDER_DEPLOY_GUIDE.md)** - Production deployment
- 🔧 **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 **Success Metrics**

### **Current Status**
- ✅ **Backend**: Fully integrated with automation
- ✅ **App**: Production-ready React Native app
- ✅ **Editorial**: Complete workflow system
- ✅ **Deployment**: Ready for Render/App Store
- ✅ **Documentation**: Comprehensive guides
- ✅ **Testing**: Sample data and workflows

### **Production Ready Features**
- 🔄 **Automated Content Generation**
- 📝 **Editorial Review System** 
- 📱 **Mobile App** with real data
- 🌐 **Cloud Deployment** configuration
- 📊 **Monitoring & Analytics** tools
- 🔐 **Security & Authentication** ready

---

**Your Junior News Digest is now a complete, production-ready system! 🚀**

**Next Steps:**
1. 🌐 Deploy backend to Render
2. 📱 Deploy app to App Stores  
3. 📝 Start editorial workflow
4. 📊 Monitor and optimize

**Need Help?** Check the documentation in the `docs/` folder or open an issue!
