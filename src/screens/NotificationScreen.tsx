import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {signOut} from '@react-native-firebase/auth';

import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {colors, spacing} from '../theme/colors';
import {
  requestNotificationPermission,
  sendCelebrationNotification,
} from '../services/notifications';
import {firebaseAuth} from '../lib/firebase';

function NotificationScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastNotification, setLastNotification] = useState<Date | null>(null);

  useEffect(() => {
    requestNotificationPermission().then(setPermissionGranted);
  }, []);

  const handlePress = async () => {
    const allowed = await requestNotificationPermission();
    setPermissionGranted(allowed);

    if (!allowed) {
      Alert.alert(
        'Permission needed',
        'Enable notifications to feel the red button magic.',
      );
      return;
    }

    await sendCelebrationNotification();
    setLastNotification(new Date());
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Sign out failed', error);
      Alert.alert('Sign out failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SurfaceCard>
        <Text style={styles.title}>Big red button</Text>
        <Text style={styles.subtitle}>
          Tap to send yourself a celebratory notification. Permissions currently{' '}
          {permissionGranted ? 'granted' : 'blocked'}.
        </Text>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            label="Press me"
            onPress={handlePress}
            variant="danger"
            style={styles.redButton}
          />
        </View>
        {lastNotification && (
          <Text style={styles.subtitle}>
            Last notification at {lastNotification.toLocaleTimeString()}.
          </Text>
        )}
        <View style={styles.signOutWrapper}>
          <PrimaryButton
            label="Sign out"
            onPress={handleSignOut}
            variant="secondary"
          />
        </View>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.mutedText,
    marginBottom: spacing.md,
  },
  buttonWrapper: {
    marginBottom: spacing.md,
  },
  redButton: {
    transform: [{scale: 1.05}],
    paddingVertical: spacing.lg,
  },
  signOutWrapper: {
    marginTop: spacing.lg,
  },
});

export default NotificationScreen;
