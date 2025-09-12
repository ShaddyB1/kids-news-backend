import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { playfulKidsDesignSystem as ds } from '../config/playfulKidsDesignSystem';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const { width, height } = Dimensions.get('window');

interface Article {
  id: string;
  title: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  published_date: string;
  read_time: string;
}

interface Video {
  id: string;
  article_id: string;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  duration: string;
  status: string;
  upload_date: string;
}

interface Quiz {
  id: string;
  article_id: string;
  title: string;
  questions: QuizQuestion[];
  total_questions: number;
  created_date: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface StoryDetailScreenProps {
  article: Article;
  onBack: () => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
}

const StoryDetailScreen: React.FC<StoryDetailScreenProps> = ({ 
  article, 
  onBack, 
  onToggleBookmark,
  isBookmarked 
}) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const videoPlayer = useVideoPlayer(video ? `${API_CONFIG.baseUrl}${video.file_path}` : '', (player) => {
    player.loop = false;
    player.muted = false;
  });

  useEffect(() => {
    loadStoryContent();
  }, [article.id]);

  const loadStoryContent = async () => {
    setLoading(true);
    try {
      console.log('Loading content for article:', article.id);
      
      // Fetch all videos and find the one for this article
      const videosUrl = `${API_CONFIG.baseUrl}/api/videos`;
      console.log('Fetching videos from:', videosUrl);
      const videosResponse = await fetch(videosUrl);
      
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        console.log('Videos data received:', videosData);
        if (videosData.success && videosData.videos) {
          // Find video for this article
          const articleVideo = videosData.videos.find((v: any) => v.id === `video_${article.id.replace('story_', '')}`);
          if (articleVideo) {
            // Convert API format to our expected format
            setVideo({
              id: articleVideo.id,
              article_id: article.id,
              title: articleVideo.title,
              description: articleVideo.description,
              file_path: articleVideo.video_url,
              thumbnail_path: articleVideo.thumbnail_url,
              duration: articleVideo.duration,
              status: articleVideo.status,
              upload_date: articleVideo.upload_date
            });
          }
        }
      } else {
        console.log('Videos response not ok:', videosResponse.status);
      }

      // Try to fetch quiz
      const quizUrl = `${API_CONFIG.baseUrl}/api/articles/${article.id}/quiz`;
      console.log('Fetching quiz from:', quizUrl);
      const quizResponse = await fetch(quizUrl);
      
      if (quizResponse.ok) {
        const quizData = await quizResponse.json();
        console.log('Quiz data received:', quizData);
        if (quizData.success && quizData.quiz) {
          setQuiz(quizData.quiz);
        }
      } else {
        console.log('Quiz response not ok:', quizResponse.status);
      }
      
      // If no video found, create a placeholder
      if (!video) {
        setVideo({
          id: `video_${article.id}`,
          article_id: article.id,
          title: `${article.title} - Video`,
          description: 'Watch this amazing story come to life!',
          file_path: `${API_CONFIG.baseUrl}/videos/${article.id}.mp4`,
          thumbnail_path: `${API_CONFIG.baseUrl}/thumbnails/${article.id}.jpg`,
          duration: '5:30',
          status: 'ready',
          upload_date: article.published_date
        });
      }
      
    } catch (error) {
      console.error('Error loading story content:', error);
      // Set fallback data
      setVideo({
        id: `video_${article.id}`,
        article_id: article.id,
        title: `${article.title} - Video`,
        description: 'Watch this amazing story come to life!',
        file_path: `${API_CONFIG.baseUrl}/videos/${article.id}.mp4`,
        thumbnail_path: `${API_CONFIG.baseUrl}/thumbnails/${article.id}.jpg`,
        duration: '5:30',
        status: 'ready',
        upload_date: article.published_date
      });
      
      // Set fallback quiz with story-specific questions
      const fallbackQuiz = getFallbackQuiz(article);
      setQuiz(fallbackQuiz);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackQuiz = (article: Article) => {
    const quizQuestions = {
      'story_001': [
        {
          question: 'What is the name of the ocean-cleaning robot?',
          options: ['Ocean Helper', 'Sea Cleaner', 'Wave Robot', 'Marine Bot'],
          answer: 'Ocean Helper',
          explanation: 'The robot is called Ocean Helper and it swims like a friendly whale!'
        },
        {
          question: 'How many sea animals has the robot saved?',
          options: ['100', '500', 'Over 1,000', '10,000'],
          answer: 'Over 1,000',
          explanation: 'Ocean Helper has saved over 1,000 sea animals from plastic pollution!'
        },
        {
          question: 'How much ocean has the robot cleaned?',
          options: ['50 square miles', '100 square miles', '500 square miles', '1000 square miles'],
          answer: '500 square miles',
          explanation: 'The robot has cleaned an amazing 500 square miles of ocean!'
        }
      ],
      'story_002': [
        {
          question: 'What is the new butterfly species called?',
          options: ['Rainbowing', 'Sparklewing', 'Goldwing', 'Amazon Flutter'],
          answer: 'Sparklewing',
          explanation: 'The new butterfly is called Sparklewing because of its sparkling wings!'
        },
        {
          question: 'Where was the butterfly discovered?',
          options: ['Africa', 'Asia', 'Amazon rainforest', 'Australia'],
          answer: 'Amazon rainforest',
          explanation: 'The students found Sparklewing in the Amazon rainforest during a field trip!'
        },
        {
          question: 'What makes this butterfly special?',
          options: ['It glows in the dark', 'Its wings change color', 'It is very large', 'It makes sounds'],
          answer: 'Its wings change color',
          explanation: 'Sparklewing has iridescent wings that change from purple to gold!'
        }
      ]
    };

    const questions = quizQuestions[article.id as keyof typeof quizQuestions] || [
      {
        question: 'What is the main topic of this story?',
        options: ['Science', 'Environment', 'Technology', 'All of the above'],
        answer: 'All of the above',
        explanation: 'This story combines different topics to teach us important lessons!'
      },
      {
        question: 'What can we learn from this story?',
        options: ['Kids can make a difference', 'Teamwork is important', 'Innovation helps the world', 'All of these'],
        answer: 'All of these',
        explanation: 'Every story teaches us that young people can change the world!'
      },
      {
        question: 'How did the kids in the story help others?',
        options: ['By solving a problem', 'By working together', 'By being creative', 'All of the above'],
        answer: 'All of the above',
        explanation: 'The kids used creativity, teamwork, and problem-solving to help their community!'
      }
    ];

    return {
      id: `quiz_${article.id}`,
      article_id: article.id,
      title: `${article.title} Quiz`,
      questions,
      total_questions: questions.length,
      created_date: article.published_date
    };
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerQuestion = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (quiz && answer === quiz.questions[currentQuestion].answer) {
      setQuizScore(quizScore + 1);
    }

    setTimeout(() => {
      if (quiz && currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const getStoryImage = () => {
    return `https://picsum.photos/400/250?random=${article.id}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={ds.colors.primary.orange} />
        <Text style={styles.loadingText}>Loading story...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story</Text>
          <TouchableOpacity onPress={() => onToggleBookmark(article.id)} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '📑'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: getStoryImage() }} style={styles.heroImage} />
          {video && (
            <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
              <Text style={styles.playIcon}>▶️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Story Content */}
        <View style={styles.content}>
          <Text style={styles.storyTitle}>{article.title}</Text>
          <Text style={styles.storyHeadline}>{article.headline}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>✍️</Text>
              <Text style={styles.metaText}>{article.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱</Text>
              <Text style={styles.metaText}>{article.read_time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{article.published_date}</Text>
            </View>
          </View>

          <Text style={styles.storyContent}>{article.content}</Text>

          {/* Video Thumbnail */}
          {video && (
            <View style={styles.videoThumbnailContainer}>
              <Image 
                source={{ uri: `${API_CONFIG.baseUrl}${video.thumbnail_path}` }}
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
                <Text style={styles.playButtonIcon}>▶️</Text>
              </TouchableOpacity>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoDuration}>{video.duration}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {video && (
              <TouchableOpacity style={styles.actionButton} onPress={handlePlayVideo}>
                <Text style={styles.actionIcon}>🎬</Text>
                <Text style={styles.actionText}>Watch Video</Text>
              </TouchableOpacity>
            )}
            
            {quiz && (
              <TouchableOpacity style={styles.actionButton} onPress={handleStartQuiz}>
                <Text style={styles.actionIcon}>🧩</Text>
                <Text style={styles.actionText}>Take Quiz</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🎤</Text>
              <Text style={styles.actionText}>Read Aloud</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Related Stories */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>More Stories Like This</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.relatedCard}>
                  <Image 
                    source={{ uri: `https://picsum.photos/200/150?random=${i}` }} 
                    style={styles.relatedImage}
                  />
                  <Text style={styles.relatedText}>Amazing Story {i}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Video Modal */}
      {showVideo && video && (
        <View style={styles.videoModal}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseVideo}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.videoContainer}>
            <VideoView
              style={styles.video}
              player={videoPlayer}
              fullscreenOptions={{
                allowsFullscreen: true,
                allowsPictureInPicture: true,
              } as any}
            />
          </View>
        </View>
      )}

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <View style={styles.quizModal}>
          <View style={styles.quizContainer}>
            {!quizCompleted ? (
              <>
                <Text style={styles.quizProgress}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Text>
                <Text style={styles.quizQuestion}>
                  {quiz.questions[currentQuestion].question}
                </Text>
                <View style={styles.quizOptions}>
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.quizOption,
                        selectedAnswer === option && styles.quizOptionSelected,
                        selectedAnswer === option && 
                        option === quiz.questions[currentQuestion].answer && 
                        styles.quizOptionCorrect,
                        selectedAnswer === option && 
                        option !== quiz.questions[currentQuestion].answer && 
                        styles.quizOptionWrong,
                      ]}
                      onPress={() => handleAnswerQuestion(option)}
                      disabled={selectedAnswer !== null}
                    >
                      <Text style={styles.quizOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedAnswer && (
                  <Text style={styles.quizExplanation}>
                    {quiz.questions[currentQuestion].explanation}
                  </Text>
                )}
              </>
            ) : (
              <View style={styles.quizResult}>
                <Text style={styles.quizResultIcon}>🏆</Text>
                <Text style={styles.quizResultTitle}>Quiz Complete!</Text>
                <Text style={styles.quizResultScore}>
                  You got {quizScore} out of {quiz.questions.length} correct!
                </Text>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => setShowQuiz(false)}
                >
                  <Text style={styles.primaryButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ds.colors.ui.background,
  },
  loadingText: {
    ...{ fontSize: ds.typography.sizes.lg, color: ds.colors.text.secondary },
    marginTop: ds.spacing.lg,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ds.spacing.xl,
    paddingVertical: ds.spacing.lg,
    backgroundColor: ds.colors.ui.surface,
    ...ds.shadows.sm,
  },
  backButton: {
    padding: ds.spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: ds.colors.text.primary,
  },
  headerTitle: {
    ...{ fontSize: ds.typography.sizes.xxl, fontWeight: '700' as any, color: ds.colors.text.primary },
  },
  bookmarkButton: {
    padding: ds.spacing.sm,
  },
  bookmarkIcon: {
    fontSize: 24,
  },

  // Hero
  heroContainer: {
    position: 'relative',
    width: width,
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...ds.shadows.lg,
  },
  playIcon: {
    fontSize: 24,
  },

  // Content
  content: {
    padding: ds.spacing.xl,
  },
  storyTitle: {
    ...{ fontSize: ds.typography.sizes.xxxl, fontWeight: '700' as any, color: ds.colors.text.primary },
    marginBottom: ds.spacing.sm,
  },
  storyHeadline: {
    ...{ fontSize: ds.typography.sizes.lg, color: ds.colors.text.secondary },
    color: ds.colors.text.secondary,
    marginBottom: ds.spacing.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: ds.spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ds.spacing.lg,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: ds.spacing.xs,
  },
  metaText: {
    ...{ fontSize: ds.typography.sizes.sm, color: ds.colors.text.secondary },
  },
  storyContent: {
    ...{ fontSize: ds.typography.sizes.lg, color: ds.colors.text.secondary },
    lineHeight: 24,
    marginBottom: ds.spacing.xxl,
  },

  // Video Thumbnail
  videoThumbnailContainer: {
    marginTop: ds.spacing.xl,
    borderRadius: ds.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: ds.colors.ui.surface,
    ...ds.shadows.md,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
  },
  playButtonIcon: {
    fontSize: 24,
    color: ds.colors.text.onPrimary,
  },
  videoInfo: {
    padding: ds.spacing.lg,
  },
  videoTitle: {
    ...{ fontSize: ds.typography.sizes.lg, fontWeight: '600' as any, color: ds.colors.text.primary },
    marginBottom: ds.spacing.xs,
  },
  videoDuration: {
    ...{ fontSize: ds.typography.sizes.sm, color: ds.colors.text.secondary },
    color: ds.colors.text.secondary,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: ds.spacing.xxl,
  },
  actionButton: {
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.lg,
    paddingVertical: ds.spacing.md,
    paddingHorizontal: ds.spacing.lg,
    marginRight: ds.spacing.md,
    marginBottom: ds.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...ds.shadows.sm,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: ds.spacing.sm,
  },
  actionText: {
    ...{ fontSize: ds.typography.sizes.md, color: ds.colors.text.secondary },
    fontWeight: '500' as any,
  },

  // Related Stories
  relatedSection: {
    marginTop: ds.spacing.xl,
  },
  relatedTitle: {
    ...{ fontSize: ds.typography.sizes.xl, fontWeight: '600' as any, color: ds.colors.text.primary },
    marginBottom: ds.spacing.lg,
  },
  relatedCard: {
    width: 150,
    marginRight: ds.spacing.lg,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    borderRadius: ds.borderRadius.lg,
    marginBottom: ds.spacing.sm,
  },
  relatedText: {
    ...{ fontSize: ds.typography.sizes.md, color: ds.colors.text.secondary },
    textAlign: 'center',
  },

  // Video Modal
  videoModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: ds.spacing.md,
  },
  closeIcon: {
    fontSize: 30,
    color: ds.colors.text.onPrimary,
  },
  videoContainer: {
    width: width * 0.9,
    height: height * 0.5,
  },
  video: {
    width: '100%',
    height: '100%',
  },

  // Quiz Modal
  quizModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ds.colors.ui.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizContainer: {
    width: width * 0.9,
    backgroundColor: ds.colors.ui.surface,
    borderRadius: ds.borderRadius.xxl,
    padding: ds.spacing.xxl,
    ...ds.shadows.xl,
  },
  quizProgress: {
    ...{ fontSize: ds.typography.sizes.sm, color: ds.colors.text.secondary },
    textAlign: 'center',
    marginBottom: ds.spacing.lg,
  },
  quizQuestion: {
    ...{ fontSize: ds.typography.sizes.xxl, fontWeight: '700' as any, color: ds.colors.text.primary },
    textAlign: 'center',
    marginBottom: ds.spacing.xxl,
  },
  quizOptions: {
    marginBottom: ds.spacing.xl,
  },
  quizOption: {
    backgroundColor: ds.colors.ui.surfaceAlt,
    borderRadius: ds.borderRadius.lg,
    padding: ds.spacing.lg,
    marginBottom: ds.spacing.md,
  },
  quizOptionSelected: {
    backgroundColor: ds.colors.primary.orange + '20',
  },
  quizOptionCorrect: {
    backgroundColor: ds.colors.status.success + '20',
    borderWidth: 2,
    borderColor: ds.colors.status.success,
  },
  quizOptionWrong: {
    backgroundColor: ds.colors.status.error + '20',
    borderWidth: 2,
    borderColor: ds.colors.status.error,
  },
  quizOptionText: {
    ...{ fontSize: ds.typography.sizes.lg, color: ds.colors.text.secondary },
    textAlign: 'center',
  },
  quizExplanation: {
    ...{ fontSize: ds.typography.sizes.md, color: ds.colors.text.secondary },
    textAlign: 'center',
    color: ds.colors.text.secondary,
    fontStyle: 'italic',
  },
  quizResult: {
    alignItems: 'center',
  },
  quizResultIcon: {
    fontSize: 64,
    marginBottom: ds.spacing.lg,
  },
  quizResultTitle: {
    ...{ fontSize: ds.typography.sizes.xxxl, fontWeight: '700' as any, color: ds.colors.text.primary },
    marginBottom: ds.spacing.md,
  },
  quizResultScore: {
    ...{ fontSize: ds.typography.sizes.lg, color: ds.colors.text.secondary },
    marginBottom: ds.spacing.xxl,
  },

  // Buttons
  primaryButton: {
    ...ds.components.primaryButton,
  },
  primaryButtonText: {
    ...ds.components.primaryButtonText,
  },
});

export default StoryDetailScreen;