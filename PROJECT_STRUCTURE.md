# Junior News Digest - Project Structure

This document outlines the organized structure of the Junior News Digest project for better maintainability and development workflow.

## 📁 **Root Directory Structure**

```
junior-news-digest/
├── frontend/                 # React Native mobile application
├── backend/                  # Python Flask backend API
├── content/                  # Media assets and generated content
├── scripts/                  # Utility and automation scripts
├── docs/                     # All documentation
├── deployment/               # Deployment configurations
├── archive/                  # Legacy and archived files
├── .github/                  # GitHub templates and workflows
├── README.md                 # Main project documentation
├── LICENSE                   # MIT License
├── package.json              # Root package configuration
└── cleanup.sh               # Project cleanup script
```

## 🎯 **Frontend Directory** (`frontend/`)

The React Native mobile application built with Expo.

```
frontend/
├── src/                      # Main source code
│   ├── components/           # Reusable React components
│   ├── screens/             # App screens and pages
│   ├── services/            # API and utility services
│   ├── config/              # Design systems and configuration
│   ├── contexts/            # React contexts for state management
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── assets/                  # Static assets (images, audio)
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── App.tsx                  # Main app component
├── package.json             # Frontend dependencies
├── tsconfig.json            # TypeScript configuration
├── metro.config.js          # Metro bundler configuration
├── babel.config.js          # Babel configuration
├── app.json                 # Expo configuration
└── eas.json                 # Expo Application Services config
```

## 🔧 **Backend Directory** (`backend/`)

Python Flask backend API and content management system.

```
backend/
├── integrated_backend.py     # Main Flask application
├── thumbnail_generator.py    # AI thumbnail generation
├── thumbnail_api.py          # Thumbnail management API
├── upload_content.py         # Content upload utilities
├── verify_content.py         # Content verification
├── requirements.txt          # Python dependencies
├── videos/                   # Video content storage
├── thumbnails/               # Generated thumbnail storage
├── generated_videos/         # AI-generated video content
├── story_sync_videos/        # Story-synchronized videos
└── uploads/                  # File upload storage
```

## 📦 **Content Directory** (`content/`)

All media assets and generated content.

```
content/
├── assets/                   # Static assets
│   ├── audio/               # Audio files
│   └── OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png
└── generated_videos/         # Generated video content
    ├── full_videos/          # Complete story videos
    ├── youtube_shorts/       # Short-form content
    └── thumbnails/           # Video thumbnails
```

## 🛠️ **Scripts Directory** (`scripts/`)

Utility scripts and automation tools.

```
scripts/
├── production/               # Production scripts
│   ├── final_video_generator.py
│   └── integrated_backend.py
├── CLEANUP_SCRIPT.py         # Project cleanup utility
└── [other utility scripts]
```

## 📚 **Documentation Directory** (`docs/`)

All project documentation and guides.

```
docs/
├── api/                      # API documentation
├── deployment/               # Deployment guides
├── setup/                    # Setup instructions
├── PROJECT_STRUCTURE.md      # This file
├── RENDER_DEPLOY_GUIDE.md    # Render deployment guide
└── [other documentation files]
```

## 🚀 **Deployment Directory** (`deployment/`)

Deployment configurations and infrastructure.

```
deployment/
├── render.yaml               # Render deployment config
├── netlify.toml              # Netlify configuration
└── netlify/                  # Netlify functions
    └── functions/
        └── api.py
```

## 📦 **Archive Directory** (`archive/`)

Legacy files and development history.

```
archive/
├── kids_news_content/        # Content archives
├── legacy_development/       # Old development files
└── [other archived content]
```

## 🔄 **Development Workflow**

### **Frontend Development**
```bash
cd frontend
npm install
npx expo start
```

### **Backend Development**
```bash
cd backend
pip install -r requirements.txt
python integrated_backend.py
```

### **Content Management**
```bash
cd scripts
python upload_content.py
python verify_content.py
```

### **Project Cleanup**
```bash
./cleanup.sh
```

## 📋 **Key Files**

- **`README.md`**: Main project documentation
- **`CONTRIBUTING.md`**: Contribution guidelines
- **`SECURITY.md`**: Security policy
- **`LICENSE`**: MIT License
- **`CHANGELOG.md`**: Release history
- **`package.json`**: Root package configuration
- **`cleanup.sh`**: Project cleanup script

## 🎯 **Benefits of This Structure**

1. **Clear Separation**: Frontend, backend, and content are clearly separated
2. **Easy Navigation**: Related files are grouped together
3. **Scalable**: Easy to add new features and components
4. **Maintainable**: Clear organization makes maintenance easier
5. **Team-Friendly**: Multiple developers can work on different parts
6. **Deployment-Ready**: Clear separation makes deployment easier

## 🔧 **Maintenance**

- **Regular Cleanup**: Run `./cleanup.sh` to remove temporary files
- **Documentation**: Keep docs updated when making changes
- **Dependencies**: Keep frontend and backend dependencies updated
- **Content**: Organize new content in the appropriate directories

This structure follows industry best practices and makes the project easy to understand, maintain, and scale.
