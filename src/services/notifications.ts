import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

const CHANNEL_ID = 'funstack-alerts';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const status = await PushNotification.requestPermissions();
    return Boolean(status?.alert);
  }

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return status === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
}

export async function sendCelebrationNotification() {
  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    title: 'FunStack says hi',
    message: 'Your red button worked! Keep exploring the other tabs.',
    playSound: true,
    vibrate: true,
    importance: 'high',
  });
}
