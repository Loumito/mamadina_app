import {firebaseFirestore, COLLECTIONS} from '../api/firebase';
import {Task, CreateTaskDto, UpdateTaskDto, TaskFilter} from '../types';

export class TaskService {
  async createTask(data: CreateTaskDto, createdBy: string): Promise<string> {
    try {
      const docRef = await firebaseFirestore.collection(COLLECTIONS.TASKS).add({
        ...data,
        assignedBy: createdBy,
        status: 'not_started',
        attachments: [],
        history: [
          {
            action: 'created',
            userId: createdBy,
            timestamp: firebaseFirestore.FieldValue.serverTimestamp(),
          },
        ],
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Create task error:', error);
      throw new Error(error.message || 'Failed to create task');
    }
  }

  async updateTask(
    taskId: string,
    data: UpdateTaskDto,
    userId: string,
  ): Promise<void> {
    try {
      const taskRef = firebaseFirestore.collection(COLLECTIONS.TASKS).doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        throw new Error('Task not found');
      }

      const history = taskDoc.data()?.history || [];
      history.push({
        action: 'updated',
        userId,
        timestamp: firebaseFirestore.FieldValue.serverTimestamp(),
        details: JSON.stringify(data),
      });

      await taskRef.update({
        ...data,
        history,
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update task error:', error);
      throw new Error(error.message || 'Failed to update task');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await firebaseFirestore.collection(COLLECTIONS.TASKS).doc(taskId).delete();
    } catch (error: any) {
      console.error('Delete task error:', error);
      throw new Error(error.message || 'Failed to delete task');
    }
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      const doc = await firebaseFirestore
        .collection(COLLECTIONS.TASKS)
        .doc(taskId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {id: doc.id, ...doc.data()} as Task;
    } catch (error) {
      console.error('Get task error:', error);
      return null;
    }
  }

  async getTasks(filter?: TaskFilter): Promise<Task[]> {
    try {
      let query = firebaseFirestore.collection(COLLECTIONS.TASKS);

      if (filter?.status) {
        query = query.where('status', '==', filter.status) as any;
      }
      if (filter?.priority) {
        query = query.where('priority', '==', filter.priority) as any;
      }
      if (filter?.assignedTo) {
        query = query.where('assignedTo', 'array-contains', filter.assignedTo) as any;
      }
      if (filter?.departmentId) {
        query = query.where('departmentId', '==', filter.departmentId) as any;
      }

      const snapshot = await query.orderBy('createdAt', 'desc').limit(100).get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
    } catch (error) {
      console.error('Get tasks error:', error);
      return [];
    }
  }

  async addAttachment(taskId: string, fileUrl: string): Promise<void> {
    try {
      const taskRef = firebaseFirestore.collection(COLLECTIONS.TASKS).doc(taskId);
      await taskRef.update({
        attachments: firebaseFirestore.FieldValue.arrayUnion(fileUrl),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Add attachment error:', error);
      throw new Error(error.message || 'Failed to add attachment');
    }
  }

  subscribeToTasks(
    filter: TaskFilter,
    callback: (tasks: Task[]) => void,
  ): () => void {
    let query = firebaseFirestore.collection(COLLECTIONS.TASKS);

    if (filter?.status) {
      query = query.where('status', '==', filter.status) as any;
    }
    if (filter?.assignedTo) {
      query = query.where('assignedTo', 'array-contains', filter.assignedTo) as any;
    }
    if (filter?.departmentId) {
      query = query.where('departmentId', '==', filter.departmentId) as any;
    }

    const unsubscribe = query.orderBy('createdAt', 'desc').onSnapshot(
      snapshot => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        callback(tasks);
      },
      error => {
        console.error('Subscribe to tasks error:', error);
      },
    );

    return unsubscribe;
  }
}

export const taskService = new TaskService();
