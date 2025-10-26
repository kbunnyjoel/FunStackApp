import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import {colors, radius, spacing} from '../theme/colors';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

const variantStyles: Record<NonNullable<Props['variant']>, ViewStyle> = {
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.surfaceAlt},
  danger: {backgroundColor: colors.danger},
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        variantStyles[variant],
        style,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.88}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
