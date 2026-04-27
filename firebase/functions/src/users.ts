import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Set custom claims for user roles
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Check if request is made by an admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Verify admin role
  const callerUid = context.auth.uid;
  const callerDoc = await admin
    .firestore()
    .collection('users')
    .doc(callerUid)
    .get();

  if (!callerDoc.exists || callerDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set user roles'
    );
  }

  // Set custom claims
  const {uid, role} = data;

  await admin.auth().setCustomUserClaims(uid, {role});

  // Update Firestore user document
  await admin.firestore().collection('users').doc(uid).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {success: true, message: 'User role updated successfully'};
});

// Create user with role (called by admin)
export const createUserWithRole = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    // Verify admin role
    const callerUid = context.auth.uid;
    const callerDoc = await admin
      .firestore()
      .collection('users')
      .doc(callerUid)
      .get();

    if (!callerDoc.exists || callerDoc.data()?.role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can create users'
      );
    }

    const {email, password, role, firstName, lastName, phone, departmentId} =
      data;

    // Create user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {role});

    // Create Firestore document
    await admin
      .firestore()
      .collection('users')
      .doc(userRecord.uid)
      .set({
        email,
        role,
        firstName,
        lastName,
        phone,
        departmentId: departmentId || null,
        isActive: true,
        permissions: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return {
      success: true,
      uid: userRecord.uid,
      message: 'User created successfully',
    };
  }
);
