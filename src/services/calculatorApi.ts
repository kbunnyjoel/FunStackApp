import axios from 'axios';
import {Alert, Platform} from 'react-native';

import {env} from '../config/env';

export type Operator = 'add' | 'subtract' | 'multiply';

export type CalculatorPayload = {
  a: number;
  b: number;
  operator: Operator;
};

export type CalculatorResponse = {
  result: number;
  a: number;
  b: number;
  operator: Operator;
};

function getFallbackUrl() {
  const localUrl = Platform.select({
    ios: 'http://localhost:4000',
    android: 'http://10.0.2.2:4000',
    default: 'http://localhost:4000',
  });
  return __DEV__ ? localUrl! : 'https://your-heroku-app.herokuapp.com';
}

export async function calculateRemote(
  payload: CalculatorPayload,
): Promise<CalculatorResponse> {
  const baseUrl = env.calculatorApiUrl || getFallbackUrl();
  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, '')}/calculate`,
      payload,
      {
        timeout: 7000,
      },
    );
    return response.data as CalculatorResponse;
  } catch (error) {
    console.error('Calculator request failed', error);
    Alert.alert(
      'Calculation failed',
      'We could not reach the math API. Make sure it is running locally or deployed to Heroku.',
    );
    throw error;
  }
}
