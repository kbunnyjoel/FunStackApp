import 'react-native-gesture-handler';
import {AppRegistry, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import App from './App';
import {name as appName} from './app.json';

PushNotification.configure({
  onRegister: token => {
    if (__DEV__) {
      console.log('Push token', token);
    }
  },
  onNotification: notification => {
    if (__DEV__) {
      console.log('Notification received', notification);
    }
    if (Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  },
  popInitialNotification: true,
  requestPermissions: false,
});

PushNotification.createChannel(
  {
    channelId: 'funstack-alerts',
    channelName: 'FunStack Alerts',
    channelDescription: 'Alert channel used by the in-app notification demo.',
    vibrate: true,
    importance: Importance.HIGH,
    soundName: 'default',
  },
  created => {
    if (__DEV__) {
      console.log(`notification channel ready: ${created}`);
    }
  },
);

AppRegistry.registerComponent(appName, () => App);
