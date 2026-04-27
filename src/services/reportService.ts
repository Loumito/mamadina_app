import {firebaseFirestore, COLLECTIONS} from '../api/firebase';
import {GenerateReportDto, Report} from '../types';

export class ReportService {
  async generateReport(
    data: GenerateReportDto,
    userId: string,
  ): Promise<string> {
    try {
      // In a real implementation, this would trigger a Cloud Function
      // to generate the report and upload it to Storage
      const docRef = await firebaseFirestore.collection(COLLECTIONS.REPORTS).add({
        ...data,
        createdBy: userId,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Generate report error:', error);
      throw new Error(error.message || 'Failed to generate report');
    }
  }

  async getReports(userId?: string): Promise<Report[]> {
    try {
      let query = firebaseFirestore.collection(COLLECTIONS.REPORTS);

      if (userId) {
        query = query.where('createdBy', '==', userId) as any;
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Get reports error:', error);
      return [];
    }
  }

  async getPerformanceMetrics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      // Get tasks for the period
      const tasksSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.TASKS)
        .where('assignedTo', 'array-contains', userId)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      const tasks = tasksSnapshot.docs.map(doc => doc.data());

      const completed = tasks.filter(t => t.status === 'completed').length;
      const delayed = tasks.filter(t => t.status === 'delayed').length;
      const inProgress = tasks.filter(t => t.status === 'in_progress').length;

      // Get attendance for the period
      const attendanceSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.ATTENDANCE)
        .where('userId', '==', userId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .get();

      const attendance = attendanceSnapshot.docs.map(doc => doc.data());
      const presentDays = attendance.filter(a => a.status === 'present').length;
      const totalDays = attendance.length;
      const attendanceRate =
        totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        tasksCompleted: completed,
        tasksDelayed: delayed,
        tasksInProgress: inProgress,
        attendanceRate,
        averageCompletionTime: 0, // Would need to calculate based on task durations
      };
    } catch (error) {
      console.error('Get performance metrics error:', error);
      return null;
    }
  }
}

export const reportService = new ReportService();
