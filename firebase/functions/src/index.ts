import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all Cloud Functions
export * from './users';
export * from './tasks';
export * from './notifications';
export * from './reports';
