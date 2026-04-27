export * from './user.types';
export * from './task.types';
export * from './message.types';
export * from './fleet.types';
export * from './attendance.types';
export * from './department.types';
export * from './report.types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
