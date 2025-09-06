import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/homeStyles';

function HomeScreen({ navigation }) {
  const [currentFact, setCurrentFact] = React.useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const facts = [
    '🦋 Butterflies taste with their feet!',
    '🐙 Octopuses have three hearts!',
    '🌟 A group of stars is called a constellation!',
    "🐧 Penguins can't fly but swim super fast!",
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={commonStyles.container} contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.bannerTitle}>Kids Daily News 📰</Text>
          <Text style={styles.bannerSubtitle}>Fun stories for kids aged 6-10!</Text>
          <View style={styles.sparkles}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>🌟</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
        </LinearGradient>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>🌟 This Week's Stories</Text>
          <Text style={commonStyles.cardText}>• Ocean Robot Saves the Day</Text>
          <Text style={commonStyles.cardText}>• Solar School Bus Adventure</Text>
          <Text style={commonStyles.cardText}>• Young Inventors Change the World</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF6B9D' }]}
            onPress={() => {
              Vibration.vibrate(50);
              navigation.navigate('Stories');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>📖</Text>
            <Text style={styles.actionText}>Stories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
            onPress={() => {
              Vibration.vibrate(50);
              navigation.navigate('Archive');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>📚</Text>
            <Text style={styles.actionText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#45B7D1' }]}
            onPress={() => {
              Vibration.vibrate(50);
              navigation.navigate('Quiz');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🧠</Text>
            <Text style={styles.actionText}>Quiz</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setCurrentFact((prev) => (prev + 1) % facts.length);
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start();
          }}
        >
          <Animated.View style={[styles.factCard, { opacity: fadeAnim }]}>
            <Text style={styles.factTitle}>🎯 Fun Fact (Tap for more!)</Text>
            <Text style={styles.factText}>{facts[currentFact]}</Text>
            <Text style={commonStyles.cardHint}>👆 Tap to see another fact!</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageCard}
          activeOpacity={0.8}
          onPress={() => {
            Animated.sequence([
              Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
              Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();
          }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.messageTitle}>💝 Daily Inspiration</Text>
            <Text style={styles.messageText}>Small acts of kindness make a big difference! 💕</Text>
            <Text style={commonStyles.cardHint}>👆 Tap to feel inspired!</Text>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;


