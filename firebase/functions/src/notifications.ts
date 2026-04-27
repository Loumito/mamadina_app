import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Send push notification when a notification document is created
export const sendPushNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const userId = notification.userId;

    // Get user's FCM token
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      console.log('User not found');
      return null;
    }

    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.log('No FCM token for user');
      return null;
    }

    // Send FCM notification
    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: notification.data || {},
      token: fcmToken,
    };

    try {
      await admin.messaging().send(message);
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    return null;
  });

// Clean up old notifications (older than 30 days)
export const cleanupOldNotifications = functions.pubsub
  .schedule('0 2 * * *') // Every day at 2 AM
  .timeZone('Africa/Algiers')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldNotifications = await admin
      .firestore()
      .collection('notifications')
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();

    const batch = admin.firestore().batch();

    oldNotifications.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`Deleted ${oldNotifications.size} old notifications`);

    return null;
  });
