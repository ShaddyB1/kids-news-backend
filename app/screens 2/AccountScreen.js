import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';
import commonStyles from '../styles/commonStyles';
import styles from '../styles/accountStyles';

function AccountScreen() {
  const [user, setUser] = useState(null);
  const [entitled, setEntitled] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID',
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setUser({ provider: 'google' });
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const entitlementId = Constants.expoConfig?.extra?.revenuecat?.entitlement || 'pro';
        setEntitled(Boolean(customerInfo.entitlements.active[entitlementId]));
      } catch (_) {}
    })();
  }, []);

  const restore = async () => {
    try {
      const info = await Purchases.restorePurchases();
      const entitlementId = Constants.expoConfig?.extra?.revenuecat?.entitlement || 'pro';
      setEntitled(Boolean(info.entitlements.active[entitlementId]));
      Alert.alert('Restored');
    } catch (e) {
      Alert.alert('Restore failed');
    }
  };

  const manage = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current?.availablePackages?.length) {
        await Purchases.purchasePackage(current.availablePackages[0]);
        const info = await Purchases.getCustomerInfo();
        const entitlementId = Constants.expoConfig?.extra?.revenuecat?.entitlement || 'pro';
        setEntitled(Boolean(info.entitlements.active[entitlementId]));
      } else {
        Alert.alert('No subscription available');
      }
    } catch (e) {
      // cancelled or error
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={commonStyles.container}>
        <Text style={styles.title}>Account</Text>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Sign in</Text>
          <TouchableOpacity style={commonStyles.optionButton} onPress={() => promptAsync()} disabled={!request}>
            <Text style={commonStyles.optionText}>Continue with Google</Text>
          </TouchableOpacity>
          {AppleAuthentication.isAvailableAsync && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={{ height: 44, marginTop: 12 }}
              onPress={async () => {
                try {
                  await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  setUser({ provider: 'apple' });
                } catch (_) {}
              }}
            />
          )}
          <Text style={{ marginTop: 12 }}>Signed in: {user ? user.provider : 'Guest'}</Text>
        </View>

        <View style={[commonStyles.card, { marginTop: 12 }]}>
          <Text style={commonStyles.cardTitle}>Subscription</Text>
          <Text style={commonStyles.cardText}>Status: {entitled ? 'Active' : 'Free'}</Text>
          <TouchableOpacity style={commonStyles.optionButton} onPress={manage}>
            <Text style={commonStyles.optionText}>{entitled ? 'Manage Subscription' : 'Upgrade'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={commonStyles.optionButton} onPress={restore}>
            <Text style={commonStyles.optionText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AccountScreen;


