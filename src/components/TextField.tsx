import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import {colors, radius, spacing} from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export function TextField({
  label,
  error,
  helperText,
  containerStyle,
  style,
  ...rest
}: Props) {
  const hasError = Boolean(error);
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedText}
        style={[styles.input, style, hasError && styles.errorBorder]}
        {...rest}
      />
      {helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : hasError ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    color: colors.mutedText,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  input: {
    width: '100%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  helper: {
    color: colors.mutedText,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
});
