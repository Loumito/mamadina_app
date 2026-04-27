import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Trigger when a task is created
export const onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskId = context.params.taskId;

    // Send notifications to assigned users
    const assignedUsers = task.assignedTo || [];

    const notifications = assignedUsers.map((userId: string) => {
      return admin.firestore().collection('notifications').add({
        userId,
        type: 'task_assigned',
        title: 'Nouvelle tâche assignée',
        message: `Vous avez été assigné à la tâche: ${task.title}`,
        data: {
          taskId,
          taskTitle: task.title,
        },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await Promise.all(notifications);

    // Send push notifications (if FCM tokens are stored)
    // This would require fetching user tokens and using FCM

    return null;
  });

// Trigger when a task is updated
export const onTaskUpdated = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const taskId = context.params.taskId;

    // Check if status changed
    if (before.status !== after.status) {
      // Notify the person who assigned the task
      if (after.assignedBy) {
        await admin.firestore().collection('notifications').add({
          userId: after.assignedBy,
          type: 'task_updated',
          title: 'Tâche mise à jour',
          message: `La tâche "${after.title}" est maintenant: ${after.status}`,
          data: {
            taskId,
            taskTitle: after.title,
            oldStatus: before.status,
            newStatus: after.status,
          },
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    return null;
  });

// Scheduled function to check for overdue tasks
export const checkOverdueTasks = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM
  .timeZone('Africa/Algiers')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    // Get all tasks that are overdue and not completed
    const overdueTasks = await admin
      .firestore()
      .collection('tasks')
      .where('dueDate', '<', now)
      .where('status', '!=', 'completed')
      .get();

    const updates: Promise<any>[] = [];

    overdueTasks.forEach((doc) => {
      const task = doc.data();

      // Update task status to delayed
      updates.push(
        doc.ref.update({
          status: 'delayed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Notify assigned users
      task.assignedTo.forEach((userId: string) => {
        updates.push(
          admin.firestore().collection('notifications').add({
            userId,
            type: 'task_overdue',
            title: 'Tâche en retard',
            message: `La tâche "${task.title}" est en retard`,
            data: {
              taskId: doc.id,
              taskTitle: task.title,
            },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })
        );
      });
    });

    await Promise.all(updates);

    return null;
  });
