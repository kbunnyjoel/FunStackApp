import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const typography = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    color: colors.mutedText,
  },
});
