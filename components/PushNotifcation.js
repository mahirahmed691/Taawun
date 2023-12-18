// PushNotificationService.js
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

class PushNotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }

  async scheduleNotification(title, body, data) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null,
    });
  }

  async localNotification(title, body) {
    await this.scheduleNotification(title, body, {});
  }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
