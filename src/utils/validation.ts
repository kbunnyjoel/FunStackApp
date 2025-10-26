import {disposableEmailDomains} from '../constants/disposableEmailDomains';

const emailRegex =
  /^(?:[-a-zA-Z0-9_'^&%+]+\.)*[-a-zA-Z0-9_'^&%+]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const MIN_PASSWORD_LENGTH = 10;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email.trim().toLowerCase());
}

export function isDisposableEmail(email: string): boolean {
  const [, domain = ''] = email.split('@');
  const normalized = domain.trim().toLowerCase();
  return disposableEmailDomains.some(
    tempDomain =>
      normalized === tempDomain || normalized.endsWith(`.${tempDomain}`),
  );
}

export function getPasswordStrength(password: string) {
  const rules = {
    length: password.length >= MIN_PASSWORD_LENGTH,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passed = Object.values(rules).filter(Boolean).length;
  const messages: string[] = [];
  if (!rules.length) {
    messages.push(`Use at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!rules.hasUpper || !rules.hasLower) {
    messages.push('Mix upper and lower case letters');
  }
  if (!rules.hasNumber) {
    messages.push('Add at least one number');
  }
  if (!rules.hasSymbol) {
    messages.push('Include a special character');
  }

  const tiers = ['Too weak', 'Weak', 'Okay', 'Strong', 'Excellent'];
  const label = tiers[Math.max(0, passed - 1)];
  const colors = ['#FF5E5B', '#FF8C42', '#FFD166', '#06D6A0', '#04B59A'];

  return {
    label,
    score: passed,
    message: messages[0] ?? '',
    color: colors[Math.max(0, passed - 1)],
  };
}
