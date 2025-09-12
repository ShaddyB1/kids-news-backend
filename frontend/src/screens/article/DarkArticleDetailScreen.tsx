import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { DarkDS, getDarkShadow, getDarkSpacing, getDarkFontSize, getDarkBorderRadius, getDarkCategoryColor } from '../../config/darkNewsDesignSystem';

const { width: screenWidth } = Dimensions.get('window');

interface ArticleData {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  author: string;
  publishDate: string;
  readTime: string;
  likes: number;
  comments: number;
  views: string;
  isBreaking?: boolean;
  isLive?: boolean;
  isTrending?: boolean;
  tags: string[];
  relatedVideo?: {
    title: string;
    duration: string;
    thumbnail: string;
  };
  quiz?: {
    questions: QuizQuestion[];
  };
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface DarkArticleDetailScreenProps {
  articleId: string;
  onBack: () => void;
}

// Mock article data - in real app, this would come from props or API
const mockArticle: ArticleData = {
  id: '1',
  title: 'Young Scientists Create Revolutionary Ocean Cleaning Robot',
  category: 'technology',
  content: `A group of brilliant young scientists from Marine Tech Academy have developed an incredible AI-powered robot that's helping to clean our oceans! 🌊

The robot, nicknamed "Wally the Whale," is designed to look like a friendly whale and can swim through the ocean collecting tiny plastic pieces that harm sea animals. Using special sensors, Wally can detect pollution and suck it up like a super-powered vacuum cleaner!

**How Wally Works:**
• Solar-powered technology means it's completely eco-friendly
• AI sensors detect different types of ocean pollution
• Special collection system safely removes plastic without harming sea life
• Can operate for weeks without human supervision

The best part? Since Wally started working six months ago, he's already cleaned over 10,000 pounds of plastic from the Pacific Ocean! That's like removing 500,000 plastic bottles from the sea.

"We wanted to create something that could help the ocean animals we love so much," says Sarah Chen, 16, one of the lead inventors. "When we see dolphins and sea turtles swimming in cleaner water because of our robot, it makes all the hard work worth it."

The project started when the students noticed how much plastic waste was washing up on their local beaches. Instead of just feeling sad about it, they decided to do something amazing!

**What Makes This Special:**
Thanks to these brilliant young inventors, sea turtles, dolphins, and fish now have cleaner, safer homes. This incredible project shows that when kids have big dreams and work with experts, they can literally save the world, one piece of plastic at a time!

The team is now working on creating more "Wally" robots to help clean oceans around the world. They've also inspired other young people to think about how technology can solve environmental problems.`,
  summary: 'Brilliant students develop AI-powered robot that removes plastic waste from oceans with unprecedented efficiency.',
  author: 'Sarah Johnson',
  publishDate: '2 days ago',
  readTime: '3 min read',
  likes: 1200,
  comments: 89,
  views: '2.1K',
  isBreaking: true,
  tags: ['robotics', 'ocean', 'environment', 'ai', 'students'],
  relatedVideo: {
    title: 'Watch Wally the Whale Robot in Action!',
    duration: '7:32',
    thumbnail: '🤖',
  },
  quiz: {
    questions: [
      {
        id: '1',
        question: 'What is the nickname of the ocean-cleaning robot?',
        options: ['Wally the Whale', 'Ocean Bot', 'Sea Cleaner', 'Plastic Hunter'],
        correctAnswer: 0,
        explanation: 'The robot is nicknamed "Wally the Whale" because it\'s designed to look like a friendly whale!',
      },
      {
        id: '2',
        question: 'How much plastic has Wally cleaned from the ocean?',
        options: ['5,000 pounds', '10,000 pounds', '15,000 pounds', '20,000 pounds'],
        correctAnswer: 1,
        explanation: 'Wally has cleaned over 10,000 pounds of plastic from the Pacific Ocean - that\'s like 500,000 plastic bottles!',
      },
      {
        id: '3',
        question: 'What powers Wally the robot?',
        options: ['Batteries', 'Solar energy', 'Ocean waves', 'Wind power'],
        correctAnswer: 1,
        explanation: 'Wally runs on solar power, making it completely eco-friendly and sustainable!',
      },
    ],
  },
};

const DarkArticleDetailScreen: React.FC<DarkArticleDetailScreenProps> = ({ articleId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'article' | 'video' | 'quiz'>('article');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const categoryColor = getDarkCategoryColor(mockArticle.category);

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < mockArticle.quiz!.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      setTimeout(() => setShowResults(true), 1000);
    }
  };

  const getQuizScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === mockArticle.quiz!.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const renderStatusBadge = () => {
    if (mockArticle.isBreaking) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: DarkDS.colors.status.breaking }]}>
          <Text style={styles.statusBadgeText}>BREAKING</Text>
        </View>
      );
    }
    if (mockArticle.isTrending) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: DarkDS.colors.status.trending }]}>
          <Text style={styles.statusBadgeText}>TRENDING 📈</Text>
        </View>
      );
    }
    return null;
  };

  const renderArticleContent = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.articleHeader}>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleCategory, { color: categoryColor }]}>
            {mockArticle.category.toUpperCase()}
          </Text>
          {renderStatusBadge()}
        </View>
        <Text style={styles.articleTitle}>{mockArticle.title}</Text>
        <Text style={styles.articleSummary}>{mockArticle.summary}</Text>
        
        <View style={styles.articleInfo}>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>By {mockArticle.author}</Text>
            <Text style={styles.publishDate}>{mockArticle.publishDate} • {mockArticle.readTime}</Text>
          </View>
          <View style={styles.articleStats}>
            <Text style={styles.statText}>👁 {mockArticle.views}</Text>
            <Text style={styles.statText}>❤️ {mockArticle.likes}</Text>
            <Text style={styles.statText}>💬 {mockArticle.comments}</Text>
          </View>
        </View>
      </View>

      <View style={styles.articleBody}>
        <Text style={styles.articleContent}>{mockArticle.content}</Text>
      </View>

      <View style={styles.articleTags}>
        <Text style={styles.tagsTitle}>Related Topics:</Text>
        <View style={styles.tagsContainer}>
          {mockArticle.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderVideoContent = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {mockArticle.relatedVideo ? (
        <View style={styles.videoSection}>
          <View style={styles.videoPlayer}>
            <View style={[styles.videoThumbnail, { backgroundColor: categoryColor }]}>
              <Text style={styles.videoThumbnailEmoji}>{mockArticle.relatedVideo.thumbnail}</Text>
            </View>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
            <View style={styles.videoDuration}>
              <Text style={styles.videoDurationText}>{mockArticle.relatedVideo.duration}</Text>
            </View>
          </View>
          <Text style={styles.videoTitle}>{mockArticle.relatedVideo.title}</Text>
          <Text style={styles.videoDescription}>
            Watch Wally the Whale robot in action as it cleans the ocean! See how this amazing invention works and meet the young scientists who created it.
          </Text>
          
          <View style={styles.videoActions}>
            <TouchableOpacity style={styles.videoActionButton}>
              <Text style={styles.videoActionIcon}>▶️</Text>
              <Text style={styles.videoActionText}>Play Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoActionButton}>
              <Text style={styles.videoActionIcon}>📤</Text>
              <Text style={styles.videoActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoActionButton}>
              <Text style={styles.videoActionIcon}>🔖</Text>
              <Text style={styles.videoActionText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noVideoSection}>
          <Text style={styles.noVideoIcon}>📹</Text>
          <Text style={styles.noVideoTitle}>No Video Available</Text>
          <Text style={styles.noVideoText}>
            A related video for this story is being generated and will be available soon!
          </Text>
        </View>
      )}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderQuizContent = () => {
    if (!mockArticle.quiz) {
      return (
        <View style={styles.noQuizSection}>
          <Text style={styles.noQuizIcon}>🧠</Text>
          <Text style={styles.noQuizTitle}>Quiz Coming Soon</Text>
          <Text style={styles.noQuizText}>
            An interactive quiz for this story is being prepared!
          </Text>
        </View>
      );
    }

    if (!quizStarted) {
      return (
        <View style={styles.quizIntro}>
          <Text style={styles.quizIntroIcon}>🧠</Text>
          <Text style={styles.quizIntroTitle}>Test Your Knowledge!</Text>
          <Text style={styles.quizIntroText}>
            How well did you understand the story about Wally the Whale robot? Take this fun quiz to find out!
          </Text>
          <View style={styles.quizStats}>
            <Text style={styles.quizStat}>📝 {mockArticle.quiz.questions.length} questions</Text>
            <Text style={styles.quizStat}>⏱️ 2-3 minutes</Text>
            <Text style={styles.quizStat}>🏆 Earn points for correct answers</Text>
          </View>
          <TouchableOpacity 
            style={styles.startQuizButton}
            onPress={() => setQuizStarted(true)}
          >
            <Text style={styles.startQuizButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (showResults) {
      const score = getQuizScore();
      const percentage = Math.round((score / mockArticle.quiz.questions.length) * 100);
      
      return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          <View style={styles.quizResults}>
            <Text style={styles.quizResultsIcon}>
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
            </Text>
            <Text style={styles.quizResultsTitle}>
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Great Job!' : 'Keep Learning!'}
            </Text>
            <Text style={styles.quizScore}>
              You scored {score} out of {mockArticle.quiz.questions.length}
            </Text>
            <Text style={styles.quizPercentage}>{percentage}% correct</Text>
            
            <View style={styles.quizReview}>
              <Text style={styles.quizReviewTitle}>Review Your Answers:</Text>
              {mockArticle.quiz.questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <View key={question.id} style={styles.reviewQuestion}>
                    <View style={styles.reviewQuestionHeader}>
                      <Text style={styles.reviewQuestionNumber}>Q{index + 1}</Text>
                      <Text style={styles.reviewQuestionStatus}>
                        {isCorrect ? '✅' : '❌'}
                      </Text>
                    </View>
                    <Text style={styles.reviewQuestionText}>{question.question}</Text>
                    <Text style={styles.reviewCorrectAnswer}>
                      Correct: {question.options[question.correctAnswer]}
                    </Text>
                    <Text style={styles.reviewExplanation}>{question.explanation}</Text>
                  </View>
                );
              })}
            </View>
            
            <TouchableOpacity 
              style={styles.retakeQuizButton}
              onPress={() => {
                setQuizStarted(false);
                setCurrentQuestion(0);
                setSelectedAnswers([]);
                setShowResults(false);
              }}
            >
              <Text style={styles.retakeQuizButtonText}>Take Quiz Again</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      );
    }

    const question = mockArticle.quiz.questions[currentQuestion];
    return (
      <View style={styles.quizQuestion}>
        <View style={styles.quizProgress}>
          <Text style={styles.quizProgressText}>
            Question {currentQuestion + 1} of {mockArticle.quiz.questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((currentQuestion + 1) / mockArticle.quiz.questions.length) * 100}%`,
                  backgroundColor: categoryColor 
                }
              ]} 
            />
          </View>
        </View>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.answerOptions}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerOption,
                selectedAnswers[currentQuestion] === index && styles.selectedAnswer
              ]}
              onPress={() => handleQuizAnswer(index)}
              disabled={selectedAnswers[currentQuestion] !== undefined}
            >
              <Text style={[
                styles.answerOptionText,
                selectedAnswers[currentQuestion] === index && styles.selectedAnswerText
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DarkDS.colors.backgrounds.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Text style={styles.headerActionIcon}>
              {isBookmarked ? '🔖' : '🔖'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Text style={styles.headerActionIcon}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'article' && [styles.activeTab, { borderBottomColor: categoryColor }]
          ]}
          onPress={() => setActiveTab('article')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'article' && [styles.activeTabText, { color: categoryColor }]
          ]}>
            📰 Article
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'video' && [styles.activeTab, { borderBottomColor: categoryColor }]
          ]}
          onPress={() => setActiveTab('video')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'video' && [styles.activeTabText, { color: categoryColor }]
          ]}>
            📹 Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'quiz' && [styles.activeTab, { borderBottomColor: categoryColor }]
          ]}
          onPress={() => setActiveTab('quiz')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'quiz' && [styles.activeTabText, { color: categoryColor }]
          ]}>
            🧠 Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'article' && renderArticleContent()}
        {activeTab === 'video' && renderVideoContent()}
        {activeTab === 'quiz' && renderQuizContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkDS.colors.backgrounds.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: DarkDS.colors.backgrounds.elevated,
  },
  backButton: {
    padding: getDarkSpacing('sm'),
  },
  backIcon: {
    fontSize: 24,
    color: DarkDS.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: getDarkSpacing('sm'),
  },
  headerAction: {
    padding: getDarkSpacing('sm'),
  },
  headerActionIcon: {
    fontSize: 20,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: DarkDS.colors.backgrounds.secondary,
    borderBottomWidth: 1,
    borderBottomColor: DarkDS.colors.backgrounds.elevated,
  },
  tab: {
    flex: 1,
    paddingVertical: getDarkSpacing('lg'),
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // borderBottomColor will be set dynamically
  },
  tabText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.secondary,
  },
  activeTabText: {
    fontWeight: DarkDS.typography.weights.bold,
    // color will be set dynamically
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  articleHeader: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingTop: getDarkSpacing('xl'),
    paddingBottom: getDarkSpacing('lg'),
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getDarkSpacing('md'),
    gap: getDarkSpacing('md'),
  },
  articleCategory: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 4,
    borderRadius: getDarkBorderRadius('xs'),
  },
  statusBadgeText: {
    fontSize: getDarkFontSize('xs'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    lineHeight: getDarkFontSize('xxxl') * 1.2,
    marginBottom: getDarkSpacing('md'),
  },
  articleSummary: {
    fontSize: getDarkFontSize('lg'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('lg') * 1.4,
    marginBottom: getDarkSpacing('lg'),
  },
  articleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getDarkSpacing('md'),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('xs'),
  },
  publishDate: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  articleStats: {
    flexDirection: 'row',
    gap: getDarkSpacing('lg'),
  },
  statText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.tertiary,
  },
  articleBody: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('xl'),
  },
  articleContent: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.primary,
    lineHeight: getDarkFontSize('md') * 1.6,
  },
  articleTags: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingVertical: getDarkSpacing('lg'),
    borderTopWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  tagsTitle: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getDarkSpacing('sm'),
  },
  tag: {
    paddingHorizontal: getDarkSpacing('md'),
    paddingVertical: getDarkSpacing('sm'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('chip'),
  },
  tagText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  videoSection: {
    paddingHorizontal: getDarkSpacing('lg'),
    paddingTop: getDarkSpacing('xl'),
  },
  videoPlayer: {
    height: 200,
    borderRadius: getDarkBorderRadius('card'),
    overflow: 'hidden',
    marginBottom: getDarkSpacing('lg'),
    position: 'relative',
  },
  videoThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnailEmoji: {
    fontSize: 64,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: DarkDS.colors.text.primary,
  },
  videoDuration: {
    position: 'absolute',
    bottom: getDarkSpacing('md'),
    right: getDarkSpacing('md'),
    paddingHorizontal: getDarkSpacing('sm'),
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: getDarkBorderRadius('xs'),
  },
  videoDurationText: {
    fontSize: getDarkFontSize('xs'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  videoTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  videoDescription: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('md') * 1.4,
    marginBottom: getDarkSpacing('xl'),
  },
  videoActions: {
    flexDirection: 'row',
    gap: getDarkSpacing('md'),
  },
  videoActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getDarkSpacing('md'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
  },
  videoActionIcon: {
    fontSize: 16,
    marginRight: getDarkSpacing('xs'),
  },
  videoActionText: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.medium,
    color: DarkDS.colors.text.primary,
  },
  noVideoSection: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('xxxxl'),
    paddingHorizontal: getDarkSpacing('lg'),
  },
  noVideoIcon: {
    fontSize: 48,
    marginBottom: getDarkSpacing('lg'),
  },
  noVideoTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
  },
  noVideoText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
    lineHeight: getDarkFontSize('md') * 1.4,
  },
  quizIntro: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('xxxxl'),
    paddingHorizontal: getDarkSpacing('lg'),
  },
  quizIntroIcon: {
    fontSize: 48,
    marginBottom: getDarkSpacing('lg'),
  },
  quizIntroTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  quizIntroText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
    lineHeight: getDarkFontSize('md') * 1.4,
    marginBottom: getDarkSpacing('xl'),
  },
  quizStats: {
    alignItems: 'center',
    marginBottom: getDarkSpacing('xl'),
    gap: getDarkSpacing('sm'),
  },
  quizStat: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.tertiary,
  },
  startQuizButton: {
    paddingHorizontal: getDarkSpacing('xl'),
    paddingVertical: getDarkSpacing('md'),
    backgroundColor: DarkDS.colors.accent.primary,
    borderRadius: getDarkBorderRadius('md'),
  },
  startQuizButtonText: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.text.primary,
  },
  quizQuestion: {
    flex: 1,
    paddingHorizontal: getDarkSpacing('lg'),
    paddingTop: getDarkSpacing('xl'),
  },
  quizProgress: {
    marginBottom: getDarkSpacing('xl'),
  },
  quizProgressText: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    marginBottom: getDarkSpacing('md'),
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionText: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    lineHeight: getDarkFontSize('lg') * 1.3,
    marginBottom: getDarkSpacing('xl'),
    textAlign: 'center',
  },
  answerOptions: {
    gap: getDarkSpacing('md'),
  },
  answerOption: {
    padding: getDarkSpacing('lg'),
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    borderWidth: 2,
    borderColor: DarkDS.colors.backgrounds.elevated,
    ...getDarkShadow('sm'),
  },
  selectedAnswer: {
    borderColor: DarkDS.colors.accent.primary,
    backgroundColor: DarkDS.colors.accent.primary + '20',
  },
  answerOptionText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.medium,
  },
  selectedAnswerText: {
    color: DarkDS.colors.accent.primary,
    fontWeight: DarkDS.typography.weights.bold,
  },
  quizResults: {
    alignItems: 'center',
    paddingHorizontal: getDarkSpacing('lg'),
    paddingTop: getDarkSpacing('xl'),
  },
  quizResultsIcon: {
    fontSize: 64,
    marginBottom: getDarkSpacing('lg'),
  },
  quizResultsTitle: {
    fontSize: getDarkFontSize('xl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('md'),
  },
  quizScore: {
    fontSize: getDarkFontSize('lg'),
    color: DarkDS.colors.text.secondary,
    marginBottom: getDarkSpacing('sm'),
  },
  quizPercentage: {
    fontSize: getDarkFontSize('xxxl'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.accent.primary,
    marginBottom: getDarkSpacing('xl'),
  },
  quizReview: {
    width: '100%',
    marginBottom: getDarkSpacing('xl'),
  },
  quizReviewTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('lg'),
    textAlign: 'center',
  },
  reviewQuestion: {
    backgroundColor: DarkDS.colors.backgrounds.card,
    borderRadius: getDarkBorderRadius('card'),
    padding: getDarkSpacing('lg'),
    marginBottom: getDarkSpacing('md'),
    borderWidth: 1,
    borderColor: DarkDS.colors.backgrounds.elevated,
  },
  reviewQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getDarkSpacing('sm'),
  },
  reviewQuestionNumber: {
    fontSize: getDarkFontSize('sm'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.accent.primary,
  },
  reviewQuestionStatus: {
    fontSize: 20,
  },
  reviewQuestionText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.primary,
    fontWeight: DarkDS.typography.weights.medium,
    marginBottom: getDarkSpacing('sm'),
  },
  reviewCorrectAnswer: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.accent.success,
    fontWeight: DarkDS.typography.weights.semibold,
    marginBottom: getDarkSpacing('xs'),
  },
  reviewExplanation: {
    fontSize: getDarkFontSize('sm'),
    color: DarkDS.colors.text.secondary,
    lineHeight: getDarkFontSize('sm') * 1.4,
  },
  retakeQuizButton: {
    paddingHorizontal: getDarkSpacing('xl'),
    paddingVertical: getDarkSpacing('md'),
    backgroundColor: DarkDS.colors.backgrounds.elevated,
    borderRadius: getDarkBorderRadius('md'),
    borderWidth: 1,
    borderColor: DarkDS.colors.accent.primary,
  },
  retakeQuizButtonText: {
    fontSize: getDarkFontSize('md'),
    fontWeight: DarkDS.typography.weights.semibold,
    color: DarkDS.colors.accent.primary,
  },
  noQuizSection: {
    alignItems: 'center',
    paddingVertical: getDarkSpacing('xxxxl'),
    paddingHorizontal: getDarkSpacing('lg'),
  },
  noQuizIcon: {
    fontSize: 48,
    marginBottom: getDarkSpacing('lg'),
  },
  noQuizTitle: {
    fontSize: getDarkFontSize('lg'),
    fontWeight: DarkDS.typography.weights.bold,
    color: DarkDS.colors.text.primary,
    marginBottom: getDarkSpacing('sm'),
  },
  noQuizText: {
    fontSize: getDarkFontSize('md'),
    color: DarkDS.colors.text.secondary,
    textAlign: 'center',
    lineHeight: getDarkFontSize('md') * 1.4,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DarkArticleDetailScreen;
