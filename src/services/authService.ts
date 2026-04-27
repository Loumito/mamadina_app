import {firebaseAuth, firebaseFirestore, COLLECTIONS} from '../api/firebase';
import {User, CreateUserDto, UserRole} from '../types';

export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Get user data from Firestore
      const userDoc = await firebaseFirestore
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      return {
        id: uid,
        ...userData,
      } as User;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        return null;
      }

      const userDoc = await firebaseFirestore
        .collection(COLLECTIONS.USERS)
        .doc(currentUser.uid)
        .get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      return {
        id: currentUser.uid,
        ...userData,
      } as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      await firebaseFirestore
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({
          ...data,
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No user signed in');
      }
      await user.updatePassword(newPassword);
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password');
    }
  }

  // Admin only - Create user with role
  async createUser(userData: CreateUserDto): Promise<string> {
    try {
      // Note: User creation with custom claims should be done via Cloud Functions
      // This is a simplified version
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        userData.email,
        userData.password,
      );
      const uid = userCredential.user.uid;

      // Create user document in Firestore
      await firebaseFirestore
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .set({
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          departmentId: userData.departmentId || null,
          isActive: true,
          permissions: [],
          createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });

      return uid;
    } catch (error: any) {
      console.error('Create user error:', error);
      throw new Error(error.message || 'Failed to create user');
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseAuth.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
