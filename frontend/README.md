# Kids News App

A React Native app built with Expo that delivers educational news content for kids aged 6-10.

## Project Structure

```
app_development/kids_news_app_fixed/
├── assets/              # Static assets (images, videos, fonts)
├── components/          # Shared UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── CategoryBadge.tsx
├── constants/           # App-wide constants and configuration
│   ├── config.ts       # App configuration
│   └── theme.ts        # UI theme constants
├── data/               # Mock data and content
│   ├── archive.ts
│   ├── quiz.ts
│   └── stories.ts
├── hooks/              # Custom React hooks
│   ├── useAnimation.ts
│   └── useAuth.ts
├── screens/            # App screens/pages
│   ├── AccountScreen.tsx
│   ├── ArchiveScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ParentScreen.tsx
│   ├── QuizScreen.tsx
│   └── StoriesScreen.tsx
├── styles/             # Styles for screens and shared components
│   ├── accountStyles.ts
│   ├── archiveStyles.ts
│   ├── commonStyles.ts
│   ├── homeStyles.ts
│   ├── navigation.ts
│   ├── parentStyles.ts
│   ├── quizStyles.ts
│   └── storiesStyles.ts
├── types/              # TypeScript type definitions
│   ├── navigation.ts
│   ├── quiz.ts
│   ├── story.ts
│   └── user.ts
├── utils/              # Helper functions
│   ├── haptics.ts
│   └── updates.ts
├── App.tsx             # App entry point
├── tsconfig.json       # TypeScript configuration
└── README.md          # Project documentation
```

## Features

- Educational news stories for kids
- Interactive quizzes
- Video content (subscription-based)
- Archive of past stories
- Parent dashboard
- Authentication (Google & Apple Sign-In)
- In-app purchases via RevenueCat

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Google Auth credentials
   - RevenueCat API keys
   - Other service credentials

3. Run the app:
   ```bash
   npm start
   ```

## Code Style

- TypeScript for type safety
- Functional components with hooks
- Shared components for consistency
- Theme-based styling
- Proper error handling
- Haptic feedback for interactions

## Architecture Decisions

- Separated concerns into logical directories
- Shared types for type safety
- Centralized constants and configuration
- Custom hooks for reusable logic
- Component-specific styles with shared theme
- Mock data separated from components

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Create reusable components when possible
4. Update documentation as needed
5. Test thoroughly before submitting changes
