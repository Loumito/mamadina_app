import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

// Firebase Configuration
// Note: Firebase is configured via google-services.json (Android) and GoogleService-Info.plist (iOS)

// Export Firebase instances
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();
export const firebaseMessaging = messaging();

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  DEPARTMENTS: 'departments',
  TASKS: 'tasks',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  VEHICLES: 'vehicles',
  TRIPS: 'trips',
  ATTENDANCE: 'attendance',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
};

// Enable offline persistence
firebaseFirestore.settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await firebaseMessaging.requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await firebaseMessaging.getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

export default {
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  storage: firebaseStorage,
  messaging: firebaseMessaging,
  collections: COLLECTIONS,
};
