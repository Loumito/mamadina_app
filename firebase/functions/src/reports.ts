import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Calculate employee performance metrics
export const calculateEmployeePerformance = functions.pubsub
  .schedule('0 0 * * 0') // Every Sunday at midnight
  .timeZone('Africa/Algiers')
  .onRun(async (context) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get all employees
    const employees = await admin
      .firestore()
      .collection('users')
      .where('role', 'in', ['employee', 'manager'])
      .get();

    const performanceUpdates: Promise<any>[] = [];

    for (const employeeDoc of employees.docs) {
      const userId = employeeDoc.id;

      // Get tasks completed this week
      const tasks = await admin
        .firestore()
        .collection('tasks')
        .where('assignedTo', 'array-contains', userId)
        .where('updatedAt', '>=', admin.firestore.Timestamp.fromDate(oneWeekAgo))
        .get();

      const completed = tasks.docs.filter(
        (doc) => doc.data().status === 'completed'
      ).length;
      const delayed = tasks.docs.filter(
        (doc) => doc.data().status === 'delayed'
      ).length;
      const total = tasks.size;

      // Get attendance this week
      const attendance = await admin
        .firestore()
        .collection('attendance')
        .where('userId', '==', userId)
        .where('date', '>=', admin.firestore.Timestamp.fromDate(oneWeekAgo))
        .get();

      const present = attendance.docs.filter(
        (doc) => doc.data().status === 'present'
      ).length;
      const attendanceRate =
        attendance.size > 0 ? (present / attendance.size) * 100 : 0;

      // Calculate performance score (0-100)
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const delayPenalty = delayed * 5; // -5 points per delayed task
      const performanceScore = Math.max(
        0,
        Math.min(100, (completionRate + attendanceRate) / 2 - delayPenalty)
      );

      // Store performance data
      performanceUpdates.push(
        admin
          .firestore()
          .collection('performance')
          .add({
            userId,
            weekStart: admin.firestore.Timestamp.fromDate(oneWeekAgo),
            weekEnd: admin.firestore.Timestamp.now(),
            tasksTotal: total,
            tasksCompleted: completed,
            tasksDelayed: delayed,
            attendanceRate,
            performanceScore,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      );
    }

    await Promise.all(performanceUpdates);

    console.log(`Calculated performance for ${employees.size} employees`);

    return null;
  });

// Generate monthly department reports
export const generateMonthlyReports = functions.pubsub
  .schedule('0 1 1 * *') // First day of every month at 1 AM
  .timeZone('Africa/Algiers')
  .onRun(async (context) => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const startOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    );

    // Get all departments
    const departments = await admin
      .firestore()
      .collection('departments')
      .get();

    const reportPromises: Promise<any>[] = [];

    for (const deptDoc of departments.docs) {
      const departmentId = deptDoc.id;
      const deptData = deptDoc.data();

      // Get tasks for this department
      const tasks = await admin
        .firestore()
        .collection('tasks')
        .where('departmentId', '==', departmentId)
        .where(
          'createdAt',
          '>=',
          admin.firestore.Timestamp.fromDate(startOfMonth)
        )
        .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(endOfMonth))
        .get();

      const completed = tasks.docs.filter(
        (doc) => doc.data().status === 'completed'
      ).length;
      const delayed = tasks.docs.filter(
        (doc) => doc.data().status === 'delayed'
      ).length;

      // Create monthly report
      reportPromises.push(
        admin.firestore().collection('reports').add({
          type: 'monthly',
          departmentId,
          departmentName: deptData.name,
          startDate: admin.firestore.Timestamp.fromDate(startOfMonth),
          endDate: admin.firestore.Timestamp.fromDate(endOfMonth),
          performanceMetrics: {
            tasksCompleted: completed,
            tasksDelayed: delayed,
            tasksInProgress: tasks.size - completed - delayed,
            completionRate:
              tasks.size > 0 ? (completed / tasks.size) * 100 : 0,
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          createdBy: 'system',
        })
      );
    }

    await Promise.all(reportPromises);

    console.log(`Generated monthly reports for ${departments.size} departments`);

    return null;
  });
