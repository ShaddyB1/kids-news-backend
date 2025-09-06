import React from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/quizStyles';

function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showResults, setShowResults] = React.useState(false);

  const questions = [
    { q: 'What does the ocean robot look like?', options: ['A whale', 'A shark', 'A turtle'], correct: 0 },
    { q: 'What problem does it solve?', options: ['Noise', 'Plastic pollution', 'Flooding'], correct: 1 },
    { q: 'What powers the solar bus?', options: ['Gas', 'Wind', 'Solar energy'], correct: 2 },
  ];

  const selectAnswer = (answerIndex) => {
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
        <View style={commonStyles.centerContainer}>
          <Text style={styles.resultsTitle}>🎉 Great job!</Text>
          <Text style={styles.resultsScore}>Your score: {score}/{questions.length}</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Vibration.vibrate(50);
              resetQuiz();
            }}
          >
            <Text style={styles.resetButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={commonStyles.container}>
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>Quiz Time! 🧠</Text>
          <Text style={styles.questionText}>{questions[currentQuestion].q}</Text>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={commonStyles.optionButton}
              onPress={() => {
                Vibration.vibrate(30);
                selectAnswer(index);
              }}
            >
              <Text style={commonStyles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.progressText}>Question {currentQuestion + 1} of {questions.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default QuizScreen;


