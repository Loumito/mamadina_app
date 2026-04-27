export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReportFormat = 'pdf' | 'excel';

export interface PerformanceMetrics {
  tasksCompleted: number;
  tasksDelayed: number;
  tasksInProgress: number;
  attendanceRate: number;
  averageCompletionTime: number;
}

export interface FleetMetrics {
  totalTrips: number;
  completedTrips: number;
  delayedTrips: number;
  totalDistance: number;
  vehiclesActive: number;
  vehiclesInMaintenance: number;
}

export interface Report {
  id: string;
  type: ReportType;
  format: ReportFormat;
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  userId?: string;
  performanceMetrics?: PerformanceMetrics;
  fleetMetrics?: FleetMetrics;
  fileUrl?: string;
  createdAt: Date;
  createdBy: string;
}

export interface GenerateReportDto {
  type: ReportType;
  format: ReportFormat;
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  userId?: string;
}
