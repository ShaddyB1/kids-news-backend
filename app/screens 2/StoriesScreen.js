import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/storiesStyles';

function StoriesScreen() {
  const [selectedStory, setSelectedStory] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const video = useRef(null);
  const [entitled, setEntitled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        const entitlementId = Constants.expoConfig?.extra?.revenuecat?.entitlement || 'pro';
        setEntitled(Boolean(info.entitlements.active[entitlementId]));
      } catch (_) {}
    })();
  }, []);

  const stories = [
    {
      title: 'Ocean Robot Saves the Day',
      category: 'Environment',
      content:
        "Hey friends! Meet the amazing ocean-cleaning robot that looks like a whale! 🐋 Students from Marine Tech Academy worked with engineers to create this incredible invention. The robot, nicknamed 'Wally the Whale,' swims through our oceans collecting tiny plastic pieces that hurt sea animals. It uses special sensors to find pollution and sucks it up like a super-powered vacuum cleaner! The best part? It runs on solar power, so it's completely eco-friendly. Since Wally started working, he's cleaned over 10,000 pounds of plastic from the Pacific Ocean! Thanks to these brilliant young inventors, sea turtles, dolphins, and fish have cleaner, safer homes. This shows that when kids have big dreams and work with experts, they can literally save the world, one piece of plastic at a time!",
      videoSource: require('../assets/videos/ocean_robot_saves_the_day_story.mp4'),
      videoDescription:
        'Join Wally the Whale Robot on an amazing underwater adventure! Learn how young inventors are cleaning our oceans and saving sea animals with this incredible solar-powered robot.',
    },
    {
      title: 'Solar School Bus Adventure',
      category: 'Technology',
      content:
        "Buckle up for an exciting ride! 🚌☀️ Sunny Hills Elementary in California now has the coolest school bus ever - it's powered entirely by the sun! The bright yellow bus has 20 solar panels on its roof that collect sunshine and turn it into electricity. Students helped design it during their STEM class, choosing everything from the battery size to the comfortable seats inside. The bus is whisper-quiet, creates zero pollution, and even has USB charging ports for tablets! Driver Mr. Rodriguez says it's like driving a spaceship. The best part? On sunny days, the bus makes extra energy that powers the school's computers! Students learn about clean energy every day just by riding to school. The solar bus has inspired 15 other schools to go solar too. Who knew that getting to school could help save the planet and teach science at the same time?",
      videoSource: require('../assets/videos/solar_school_bus_adventure_story.mp4'),
      videoDescription:
        "Take a ride on the world's most amazing school bus! Discover how students helped design this quiet, clean, solar-powered bus that's helping save the planet.",
    },
    {
      title: 'Young Inventors Change the World',
      category: 'Science',
      content:
        "Get ready to meet the most amazing kid inventors ever! 🚀 First, there's Emma from Toronto, age 11, who noticed her grandmother struggling to hear. So she invented special smart glasses that show what people are saying as text! Now her grandma never misses a word. Next is Marcus from Kenya, age 9, who saw his neighbors walking miles for clean water. He created a portable water filter using local materials that removes 99% of harmful bacteria! His invention now helps over 500 families. Then there's Priya from Mumbai, age 10, who built a friendly robot companion for elderly people living alone. The robot reminds them to take medicine, calls family members, and even tells jokes! Finally, meet Diego from Mexico, age 12, who invented solar-powered street lights that charge phones and provide WiFi for his community. These incredible kids prove that age is just a number when you want to help others. They saw problems in their communities and didn't wait for adults to fix them - they became the solution!",
      videoSource: require('../assets/videos/young_inventors_change_the_world_story.mp4'),
      videoDescription:
        'Meet four incredible young inventors from around the world! From smart glasses to water filters, see how kids your age are solving real problems in their communities.',
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={commonStyles.container} contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.storyTabs}>
          {stories.map((story, index) => (
            <TouchableOpacity key={index} style={[styles.storyTab, selectedStory === index && styles.storyTabActive]} onPress={() => setSelectedStory(index)}>
              <Text style={[styles.storyTabText, selectedStory === index && styles.storyTabTextActive]}>Story {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{stories[selectedStory].category}</Text>
        </View>

        <Text style={styles.storyTitle}>{stories[selectedStory].title}</Text>

        <TouchableOpacity
          style={styles.watchVideoButton}
          onPress={() => {
            Vibration.vibrate(50);
            setShowVideo(!showVideo);
          }}
        >
          <Text style={styles.watchVideoButtonText}>{showVideo ? '📖 Read Story' : '🎬 Watch Video'}</Text>
        </TouchableOpacity>

        {!entitled && (
          <View style={[commonStyles.card, { marginTop: 8 }]}>
            <Text style={commonStyles.cardText}>Subscribe to watch the full videos. You can read the stories for free.</Text>
          </View>
        )}

        {showVideo && entitled ? (
          <View style={styles.videoSection}>
            <View style={styles.videoContainer}>
              <Video
                ref={video}
                style={styles.videoPlayer}
                source={stories[selectedStory].videoSource}
                useNativeControls={true}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                shouldPlay={false}
                volume={1.0}
                isMuted={false}
                usePoster={false}
                progressUpdateIntervalMillis={100}
                positionMillis={0}
                onLoad={() => {
                  console.log('Video loaded instantly');
                }}
              />
            </View>

            <View style={styles.videoInfoCard}>
              <Text style={styles.videoInfoTitle}>🎬 About This Video</Text>
              <Text style={styles.videoInfoText}>{stories[selectedStory].videoDescription}</Text>
              <Text style={styles.videoInfoText}>Duration: ~1 minute • Educational Content • Perfect for Kids Ages 6-10</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.storyContent}>{stories[selectedStory].content}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default StoriesScreen;


