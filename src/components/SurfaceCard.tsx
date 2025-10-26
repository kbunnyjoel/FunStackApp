import React, {ReactNode} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {colors, radius, shadow, spacing} from '../theme/colors';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export function SurfaceCard({children, style}: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadow.card,
  },
});
