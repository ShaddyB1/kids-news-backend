import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/parentStyles';

function ParentScreen() {
  const handlePinAccess = () => {
    Alert.alert('🔐 Parent Dashboard', 'Demo: Stories read: 1/3\nQuizzes passed: 1/3\nScreen time: 15 min today');
  };

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={commonStyles.container}>
        <View style={styles.parentContainer}>
          <Text style={styles.parentTitle}>Parent Dashboard 👨‍👩‍👧‍👦</Text>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>📊 This Week's Progress</Text>
            <Text style={commonStyles.cardText}>📖 Stories read: 1/3</Text>
            <Text style={commonStyles.cardText}>🧠 Quizzes passed: 1/3</Text>
            <Text style={commonStyles.cardText}>⏰ Screen time: 15 min today</Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>⚙️ Settings</Text>
            <Text style={commonStyles.cardText}>📬 Notifications: Tue/Wed/Fri @ 8:00 AM</Text>
            <Text style={commonStyles.cardText}>🔐 Parental controls: Active</Text>
          </View>

          <TouchableOpacity style={styles.pinButton} onPress={handlePinAccess}>
            <Text style={styles.pinButtonText}>🔒 Access Full Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ParentScreen;


