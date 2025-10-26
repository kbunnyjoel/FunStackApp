import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {colors, radius, spacing} from '../theme/colors';
import {calculateRemote, Operator} from '../services/calculatorApi';

const OPERATORS: {label: string; value: Operator}[] = [
  {label: 'Addition (+)', value: 'add'},
  {label: 'Subtraction (-)', value: 'subtract'},
  {label: 'Multiplication (×)', value: 'multiply'},
];

function CalculatorScreen() {
  const [first, setFirst] = useState('3');
  const [second, setSecond] = useState('7');
  const [operator, setOperator] = useState<Operator>('multiply');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const a = Number(first);
    const b = Number(second);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      Alert.alert(
        'Invalid numbers',
        'Please enter valid numbers before calculating.',
      );
      return;
    }

    try {
      setLoading(true);
      const response = await calculateRemote({a, b, operator});
      setResult(response.result);
    } catch (error) {
      // calculateRemote already shows an alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SurfaceCard>
        <Text style={styles.title}>Heroku calculator</Text>
        <Text style={styles.subtitle}>
          This tab talks to a minimal Express API. Deploy it to Heroku and enter
          your numbers below.
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="First number"
          placeholderTextColor={colors.mutedText}
          value={first}
          onChangeText={setFirst}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Second number"
          placeholderTextColor={colors.mutedText}
          value={second}
          onChangeText={setSecond}
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={operator}
            onValueChange={value => setOperator(value as Operator)}
            dropdownIconColor={colors.text}
            style={styles.picker}>
            {OPERATORS.map(option => (
              <Picker.Item
                label={option.label}
                value={option.value}
                key={option.value}
              />
            ))}
          </Picker>
        </View>

        <PrimaryButton
          label={loading ? 'Calculating...' : 'Calculate'}
          onPress={handleCalculate}
          disabled={loading}
        />

        {result !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultValue}>{result}</Text>
          </View>
        )}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
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
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  pickerWrapper: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  picker: {
    color: colors.textpicker,
  },
  resultCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  resultLabel: {
    color: colors.mutedText,
    marginBottom: spacing.xs,
  },
  resultValue: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
});

export default CalculatorScreen;
