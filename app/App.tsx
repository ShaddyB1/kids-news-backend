import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import DarkHomeScreen from './src/screens/main/DarkHomeScreen';
import LightHomeScreen from './src/screens/main/LightHomeScreen';
import DarkVideosScreen from './src/screens/main/DarkVideosScreen';
import LightVideosScreen from './src/screens/main/LightVideosScreen';
import DarkBookmarksScreen from './src/screens/main/DarkBookmarksScreen';
import LightBookmarksScreen from './src/screens/main/LightBookmarksScreen';
import DarkAccountScreen from './src/screens/main/DarkAccountScreen';
import LightAccountScreen from './src/screens/main/LightAccountScreen';
import DarkArticleDetailScreen from './src/screens/article/DarkArticleDetailScreen';
import VideoPlayerScreen from './src/screens/video/VideoPlayerScreen';
import DarkBottomTabBar from './src/components/DarkBottomTabBar';

const MainApp: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const handleArticlePress = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  const handleVideoPress = (videoData: any) => {
    setSelectedVideo(videoData);
  };

  const handleBackToHome = () => {
    setSelectedArticleId(null);
  };

  const handleBackFromVideo = () => {
    setSelectedVideo(null);
  };

  const renderScreen = () => {
    // If a video is selected, show the video player screen
    if (selectedVideo) {
      return (
        <VideoPlayerScreen 
          videoData={selectedVideo} 
          onBack={handleBackFromVideo} 
        />
      );
    }

    // If an article is selected, show the article detail screen
    if (selectedArticleId) {
      return (
        <DarkArticleDetailScreen 
          articleId={selectedArticleId} 
          onBack={handleBackToHome} 
        />
      );
    }

          // Otherwise, show the normal tab screens
          switch (activeTab) {
            case 'home':
              return isDarkMode ?
                <DarkHomeScreen onArticlePress={handleArticlePress} /> :
                <LightHomeScreen onArticlePress={handleArticlePress} />;
            case 'videos':
              return isDarkMode ?
                <DarkVideosScreen onVideoPress={handleVideoPress} /> :
                <LightVideosScreen onVideoPress={handleVideoPress} />;
            case 'bookmarks':
              return isDarkMode ? <DarkBookmarksScreen /> : <LightBookmarksScreen />;
            case 'account':
              return isDarkMode ? <DarkAccountScreen /> : <LightAccountScreen />;
            default:
              return isDarkMode ?
                <DarkHomeScreen onArticlePress={handleArticlePress} /> :
                <LightHomeScreen onArticlePress={handleArticlePress} />;
          }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
        {!selectedArticleId && !selectedVideo && (
          <DarkBottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
        )}
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});