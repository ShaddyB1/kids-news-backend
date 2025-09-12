import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { COLORS, SPACING } from '@constants/theme';

export default function AccountScreen() {
  const { 
    user, 
    entitled, 
    signInWithGoogle, 
    signInWithApple, 
    restore,
    googleAuthRequest 
  } = useAuth();

  const handleManageSubscription = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current?.availablePackages?.length) {
        await Purchases.purchasePackage(current.availablePackages[0]);
      } else {
        Alert.alert('No subscription available');
      }
    } catch (e) {
      // User cancelled or error occurred
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    Alert.alert(success ? 'Restored' : 'Restore failed');
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>

        <Card title="Sign in">
          <Button
            title="Continue with Google"
            onPress={signInWithGoogle}
            disabled={!googleAuthRequest}
            variant="primary"
          />

          {AppleAuthentication.isAvailableAsync && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={{ height: 44, marginTop: 12 }}
              onPress={signInWithApple}
            />
          )}

          <Text style={{ marginTop: 12 }}>
            Signed in: {user ? user.provider : 'Guest'}
          </Text>
        </Card>

        <Card title="Subscription" style={{ marginTop: 12 }}>
          <Text style={commonStyles.cardText}>
            Status: {entitled ? 'Active' : 'Free'}
          </Text>
          
          <Button
            title={entitled ? 'Manage Subscription' : 'Upgrade'}
            onPress={handleManageSubscription}
            variant="primary"
            style={{ marginTop: 8 }}
          />
          
          <Button
            title="Restore Purchases"
            onPress={handleRestore}
            variant="secondary"
            style={{ marginTop: 8 }}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  container: {
    flex: 1,
    padding: SPACING.layout.screenPadding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.layout.sectionGap,
    textAlign: 'center',
  },
});
