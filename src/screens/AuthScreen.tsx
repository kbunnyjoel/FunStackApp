import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {firebaseAuth} from '../lib/firebase';

import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {TextField} from '../components/TextField';
import {colors, gradients, radius, spacing} from '../theme/colors';
import {
  getPasswordStrength,
  isDisposableEmail,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
} from '../utils/validation';

const AUTH_MODES = {
  signup: {
    title: 'Create a vibrant account',
    cta: 'Sign up & launch',
    helper:
      'Use a strong password and a real email so Firebase can keep you safe.',
  },
  login: {
    title: 'Welcome back',
    cta: 'Sign in',
    helper: 'Enter the credentials you used to register.',
  },
} as const;

type AuthMode = keyof typeof AUTH_MODES;

function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    setError(null);
    setFeedback(null);

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email.');
      return;
    }

    if (mode === 'signup' && isDisposableEmail(trimmedEmail)) {
      setError('Temporary or disposable email addresses are not allowed.');
      return;
    }

    if (password.length === 0) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(
          firebaseAuth,
          trimmedEmail,
          password,
        );
        setFeedback('Account created! We signed you in.');
      } else {
        await signInWithEmailAndPassword(
          firebaseAuth,
          trimmedEmail,
          password,
        );
      }
    } catch (err: unknown) {
      console.error(err);
      const firebaseError = err as {code?: string; message?: string};
      setError(mapFirebaseAuthError(firebaseError.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      setError('Enter a valid email so we can send reset instructions.');
      return;
    }

    try {
      setSubmitting(true);
      await sendPasswordResetEmail(firebaseAuth, trimmedEmail);
      setFeedback('Password reset link sent. Check your inbox.');
    } catch (err) {
      const firebaseError = err as {code?: string};
      setError(mapFirebaseAuthError(firebaseError.code));
    } finally {
      setSubmitting(false);
    }
  };

  const {title, cta, helper} = AUTH_MODES[mode];

  return (
    <LinearGradient colors={gradients.hero} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ios: 'padding', android: undefined})}
        keyboardVerticalOffset={120}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}>
          <Text style={styles.kicker}>FunStack Lab</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{helper}</Text>

          <SurfaceCard style={styles.card}>
            <View style={styles.modeSwitcher}>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.modePill,
                  mode === 'signup' && styles.modePillActive,
                ]}
                onPress={() => {
                  setMode('signup');
                  setError(null);
                  setFeedback(null);
                }}>
                <Text style={styles.modeText}>Sign up</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.modePill,
                  mode === 'login' && styles.modePillActive,
                ]}
                onPress={() => {
                  setMode('login');
                  setError(null);
                  setFeedback(null);
                }}>
                <Text style={styles.modeText}>Sign in</Text>
              </Pressable>
            </View>

            <View style={styles.formSpacing}>
              <TextField
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onChangeText={setEmail}
                value={email}
                placeholder="you@example.com"
                containerStyle={styles.fieldSpacing}
              />
              <TextField
                label="Password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                placeholder="SuperSecret123!"
                helperText={`Strength: ${passwordStrength.label}`}
                containerStyle={styles.fieldSpacing}
              />
              {password.length > 0 && passwordStrength.message.length > 0 && (
                <Text
                  style={[
                    styles.passwordHint,
                    {color: passwordStrength.color},
                  ]}>
                  {passwordStrength.message}
                </Text>
              )}

              {error && <Text style={styles.errorText}>{error}</Text>}
              {feedback && !error && (
                <Text style={styles.feedbackText}>{feedback}</Text>
              )}

              <PrimaryButton
                label={cta}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={styles.fieldSpacing}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>
          </SurfaceCard>

          <Text style={styles.terms}>
            By continuing you agree to the Firebase powered auth flow and the
            app demo terms.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function mapFirebaseAuthError(code?: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address looks invalid.';
    case 'auth/email-already-in-use':
      return 'This email already has an account. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Try adding more characters and symbols.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'We could not match those credentials.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  kicker: {
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.text,
    opacity: 0.8,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    marginTop: spacing.md,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  modePill: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    color: colors.text,
    fontWeight: '600',
  },
  formSpacing: {
    width: '100%',
  },
  fieldSpacing: {
    marginBottom: spacing.md,
  },
  passwordHint: {
    fontSize: 12,
    marginTop: -spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackText: {
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '600',
  },
  forgotText: {
    textAlign: 'center',
    color: colors.mutedText,
    marginTop: spacing.sm,
  },
  terms: {
    color: colors.text,
    opacity: 0.6,
    marginTop: spacing.lg,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AuthScreen;
