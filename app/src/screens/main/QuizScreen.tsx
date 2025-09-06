import React, { useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { quizQuestions } from '@data/quiz';
import { haptics } from '@utils/helpers/haptics';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { useAnimation } from '@hooks/useAnimation';

export default function QuizScreen() {
  const { width } = useWindowDimensions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { animation: slideAnim, scale } = useAnimation(0);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    haptics.medium();
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Delay before moving to next question or results
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        Animated.spring(slideAnim, {
          toValue: -(width * (currentQuestion + 1)),
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const handleReset = () => {
    haptics.heavy();
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsEmoji}>
            {score === quizQuestions.length ? '🎉' : score > quizQuestions.length / 2 ? '👏' : '💪'}
          </Text>
          <Text style={styles.resultsTitle}>
            {score === quizQuestions.length
              ? 'Perfect Score!'
              : score > quizQuestions.length / 2
              ? 'Great Job!'
              : 'Keep Learning!'}
          </Text>
          <Text style={styles.resultsScore}>
            You got {score} out of {quizQuestions.length} correct
          </Text>
          <Button
            title="Try Again"
            onPress={handleReset}
            variant="primary"
            size="large"
            style={{ marginTop: SPACING.xl }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
      </View>

      {/* Questions */}
      <Animated.View
        style={[
          styles.questionsContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {quizQuestions.map((question, qIndex) => (
          <View
            key={qIndex}
            style={[styles.questionCard, { width }]}
          >
            <Text style={styles.questionText}>{question.q}</Text>

            <View style={styles.optionsContainer}>
              {question.options.map((option, oIndex) => {
                const isSelected = selectedAnswer === oIndex;
                const isCorrect = selectedAnswer !== null && oIndex === question.correct;
                const isWrong = isSelected && !isCorrect;

                return (
                  <TouchableOpacity
                    key={oIndex}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedOption,
                      isCorrect && styles.correctOption,
                      isWrong && styles.wrongOption,
                    ]}
                    onPress={() => handleAnswer(oIndex)}
                    disabled={selectedAnswer !== null}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        (isSelected || isCorrect) && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {isCorrect && (
                      <Text style={styles.resultEmoji}>✅</Text>
                    )}
                    {isWrong && (
                      <Text style={styles.resultEmoji}>❌</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  progressContainer: {
    padding: SPACING.layout.screenPadding,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.card.border,
    borderRadius: BORDER_RADIUS.pill,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary.main,
  },
  progressText: {
    fontFamily: TYPOGRAPHY.fonts.medium,
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  questionsContainer: {
    flexDirection: 'row',
  },
  questionCard: {
    padding: SPACING.layout.screenPadding,
  },
  questionText: {
    fontFamily: TYPOGRAPHY.fonts.bold,
    fontSize: TYPOGRAPHY.sizes.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.card.border,
    ...SHADOWS.small,
  },
  selectedOption: {
    borderColor: COLORS.primary.main,
    backgroundColor: COLORS.primary.main + '10',
  },
  correctOption: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  wrongOption: {
    borderColor: COLORS.status.live,
    backgroundColor: COLORS.status.live + '10',
  },
  optionText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fonts.medium,
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.text.primary,
  },
  selectedOptionText: {
    color: COLORS.primary.main,
    fontFamily: TYPOGRAPHY.fonts.bold,
  },
  resultEmoji: {
    fontSize: TYPOGRAPHY.sizes.h3,
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.layout.screenPadding,
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  resultsTitle: {
    fontFamily: TYPOGRAPHY.fonts.bold,
    fontSize: TYPOGRAPHY.sizes.h1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  resultsScore: {
    fontFamily: TYPOGRAPHY.fonts.medium,
    fontSize: TYPOGRAPHY.sizes.h3,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});