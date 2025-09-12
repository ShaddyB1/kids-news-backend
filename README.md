# Junior News Digest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Python](https://img.shields.io/badge/Python-3.12+-green.svg)](https://python.org/)

> A kid-friendly news app that makes current events accessible and engaging for children aged 6-12.

## What does this thing do?

Junior News Digest is a React Native mobile application designed to deliver age-appropriate news content to children. The app features:

- **Interactive News Stories**: Real news adapted for kids with engaging visuals and simple language
- **Video Content**: Animated story videos with professional narration
- **Educational Quizzes**: Interactive quizzes to reinforce learning
- **Beautiful UI**: Playful, kid-friendly design system with bright colors and fun animations
- **Thumbnail Generation**: AI-powered thumbnail creation for visual appeal
- **Backend API**: Complete content management system with automated workflows

The app transforms complex world events into digestible, educational content that helps children understand the world around them while maintaining a positive, hopeful tone.

## Installation Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.12+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/junior-news-digest.git
   cd junior-news-digest
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the backend**
   ```bash
   cd backend
   python integrated_backend.py
   ```

5. **Start the mobile app**
   ```bash
   cd frontend
   npx expo start
   ```

6. **Scan QR code** with Expo Go app on your phone or press `i` for iOS simulator

### Development Setup

For detailed development setup, see [CONTRIBUTING.md](CONTRIBUTING.md).

## How do I contribute?

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Security considerations

**Security Issues**: Please report security vulnerabilities privately to [security@example.com](mailto:security@example.com). See [SECURITY.md](SECURITY.md) for more information.

## Project Structure

```
junior-news-digest/
├── app/                    # React Native mobile application
│   ├── src/
│   │   ├── screens/       # App screens and components
│   │   ├── config/        # Design systems and configuration
│   │   └── services/      # API and utility services
│   └── package.json
├── backend/               # Python Flask backend
│   ├── integrated_backend.py
│   ├── thumbnail_generator.py
│   └── requirements.txt
├── assets/               # Images, videos, and static content
├── docs/                # Documentation
└── deployment/          # Deployment configurations
```

## Features

- 📱 **Cross-platform**: iOS and Android support
- 🎥 **Video Content**: AI-generated story videos
- 🖼️ **Smart Thumbnails**: AI-powered thumbnail generation
- 📚 **Educational**: Age-appropriate content with quizzes
- 🔄 **Automated**: Backend content management system
- 🌐 **API-First**: RESTful API for content delivery

## Project Structure

```
junior-news-digest/
├── frontend/             # React Native mobile application
│   ├── src/             # Main source code
│   │   ├── components/  # Reusable React components
│   │   ├── screens/     # App screens and pages
│   │   ├── services/    # API and utility services
│   │   └── config/      # Design systems and configuration
│   └── package.json
├── backend/             # Python Flask backend API
│   ├── integrated_backend.py
│   ├── thumbnail_generator.py
│   └── requirements.txt
├── content/             # Media assets and generated content
├── scripts/             # Utility and automation scripts
├── docs/                # All documentation
├── deployment/          # Deployment configurations
└── archive/             # Legacy and archived files
```

For detailed structure information, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Technology Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Python, Flask, SQLite
- **AI Services**: OpenAI DALL-E, Leonardo.ai, Stability AI
- **Video**: FFmpeg, ElevenLabs TTS
- **Deployment**: Render, Netlify

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: aaddoshadrack@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/junior-news-digest/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/junior-news-digest/wiki)

---

Made with ❤️ for curious young minds
