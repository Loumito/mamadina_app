import {firebaseFirestore, COLLECTIONS} from './firebase';
import {
  User,
  Task,
  Message,
  Conversation,
  Vehicle,
  Trip,
  Attendance,
  Department,
  Report,
} from '../types';

// Generic CRUD operations
export class FirestoreService<T> {
  constructor(private collectionName: string) {}

  async create(data: Partial<T>, id?: string): Promise<string> {
    try {
      const docRef = id
        ? firebaseFirestore.collection(this.collectionName).doc(id)
        : firebaseFirestore.collection(this.collectionName).doc();

      await docRef.set({
        ...data,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async read(id: string): Promise<T | null> {
    try {
      const doc = await firebaseFirestore
        .collection(this.collectionName)
        .doc(id)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {id: doc.id, ...doc.data()} as T;
    } catch (error) {
      console.error(`Error reading document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.collectionName)
        .doc(id)
        .update({
          ...data,
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await firebaseFirestore.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async list(limit = 50): Promise<T[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.collectionName)
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as T));
    } catch (error) {
      console.error(`Error listing documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  collection() {
    return firebaseFirestore.collection(this.collectionName);
  }
}

// Service instances for each collection
export const usersService = new FirestoreService<User>(COLLECTIONS.USERS);
export const departmentsService = new FirestoreService<Department>(
  COLLECTIONS.DEPARTMENTS,
);
export const tasksService = new FirestoreService<Task>(COLLECTIONS.TASKS);
export const messagesService = new FirestoreService<Message>(
  COLLECTIONS.MESSAGES,
);
export const conversationsService = new FirestoreService<Conversation>(
  COLLECTIONS.CONVERSATIONS,
);
export const vehiclesService = new FirestoreService<Vehicle>(
  COLLECTIONS.VEHICLES,
);
export const tripsService = new FirestoreService<Trip>(COLLECTIONS.TRIPS);
export const attendanceService = new FirestoreService<Attendance>(
  COLLECTIONS.ATTENDANCE,
);
export const reportsService = new FirestoreService<Report>(COLLECTIONS.REPORTS);
