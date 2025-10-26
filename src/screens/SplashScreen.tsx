import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {colors, gradients, spacing} from '../theme/colors';

function SplashScreen() {
  return (
    <LinearGradient colors={gradients.hero} style={styles.container}>
      <Text style={styles.logo}>FS</Text>
      <Text style={styles.title}>FunStack Lab</Text>
      <Text style={styles.subtitle}>Full-stack playground</Text>
      <ActivityIndicator
        color={colors.text}
        size="large"
        style={styles.loader}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 60,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  loader: {
    marginTop: spacing.lg,
  },
});

export default SplashScreen;
