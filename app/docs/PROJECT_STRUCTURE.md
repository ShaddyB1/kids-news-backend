# Kids News App - Project Structure

## Overview
This document outlines the organized structure of the Kids News App, designed for easy maintenance and scalability.

## Folder Structure

```
kids_news_app_fixed/
├── src/                          # Main source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Basic UI components (Button, Card, etc.)
│   │   ├── forms/                # Form-specific components
│   │   └── media/                # Media-related components
│   ├── screens/                  # Screen components
│   │   ├── main/                 # Main app screens
│   │   ├── auth/                 # Authentication screens
│   │   └── settings/             # Settings screens
│   ├── services/                 # Service layer
│   │   ├── api/                  # API services
│   │   ├── storage/              # Storage services
│   │   ├── audio/                # Audio services
│   │   └── video/                # Video services
│   ├── utils/                    # Utility functions
│   │   ├── helpers/              # Helper functions
│   │   ├── validators/           # Validation functions
│   │   └── formatters/           # Data formatting functions
│   ├── types/                    # TypeScript type definitions
│   ├── constants/                # App constants and configuration
│   ├── data/                     # Static data and mock data
│   ├── hooks/                    # Custom React hooks
│   └── config/                   # App configuration
├── assets/                       # Static assets
│   ├── images/                   # Image files
│   ├── icons/                    # Icon files
│   ├── fonts/                    # Font files
│   ├── audio/                    # Audio files
│   └── videos/                   # Video files
├── docs/                         # Documentation
│   ├── api/                      # API documentation
│   ├── setup/                    # Setup instructions
│   └── deployment/               # Deployment guides
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── styles/                       # Legacy styles (to be moved)
├── App.tsx                       # Main app component
├── index.ts                      # App entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── app.json                      # Expo configuration
└── README.md                     # Project README
```

## Key Services

### AudioService
- Handles audio playback, pause, resume, and stop functionality
- Manages audio volume and status
- Located: `src/services/audio/audioService.ts`

### VideoService
- Manages video playback controls
- Handles video configuration and status
- Located: `src/services/video/videoService.ts`

### ElevenLabsService
- Text-to-speech generation using ElevenLabs API
- Configured with voice ID: `paRTfYnetOrTukxfEm1J`
- Located: `src/services/api/elevenLabsService.ts`

### StorageService
- AsyncStorage wrapper for data persistence
- Type-safe storage operations
- Located: `src/services/storage/storageService.ts`

### StoryGeneratorService
- Generates new stories with audio using ElevenLabs
- Creates age-appropriate content
- Located: `src/services/api/storyGeneratorService.ts`

## Component Organization

### UI Components (`src/components/ui/`)
- `Button.tsx` - Reusable button component
- `Card.tsx` - Card container component
- `StoryCard.tsx` - Story-specific card component
- `CategoryTabs.tsx` - Category navigation tabs
- `AuthorBadge.tsx` - Author information badge
- `CategoryBadge.tsx` - Category label badge

### Screens (`src/screens/main/`)
- `HomeScreen.tsx` - Main dashboard
- `StoriesScreen.tsx` - Story browsing and reading
- `QuizScreen.tsx` - Interactive quizzes
- `ArchiveScreen.tsx` - Story archive
- `ParentScreen.tsx` - Parent controls and settings
- `AccountScreen.tsx` - User account management

## Type Definitions (`src/types/`)
- `story.ts` - Story-related types
- `quiz.ts` - Quiz-related types
- `user.ts` - User-related types
- `parent.ts` - Parent control types
- `navigation.ts` - Navigation types
- `components.ts` - Component prop types

## Configuration (`src/constants/`)
- `theme.ts` - App theme and design tokens
- `config.ts` - App configuration constants

## Data Management (`src/data/`)
- `stories.ts` - Story data
- `quiz.ts` - Quiz data
- `archive.ts` - Archive data

## Custom Hooks (`src/hooks/`)
- `useAuth.ts` - Authentication hook
- `useAnimation.ts` - Animation utilities hook

## Utilities (`src/utils/helpers/`)
- `haptics.ts` - Haptic feedback utilities
- `updates.ts` - App update utilities

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Run on iOS: `npm run ios`
4. Run on Android: `npm run android`

## Development Guidelines

1. **Component Structure**: Keep components small and focused
2. **Service Layer**: Use services for business logic and API calls
3. **Type Safety**: Always use TypeScript types
4. **Testing**: Write tests for critical functionality
5. **Documentation**: Update docs when adding new features

## Voice Integration

The app now uses ElevenLabs voice ID `paRTfYnetOrTukxfEm1J` for all text-to-speech functionality. This provides consistent, high-quality narration for stories and interactive content.

## Future Enhancements

- Add more voice options
- Implement offline story caching
- Add parental controls
- Enhance quiz interactivity
- Add story creation tools
