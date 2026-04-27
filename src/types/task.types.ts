export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'delayed';

export interface TaskHistory {
  action: string;
  userId: string;
  timestamp: Date;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string[];
  assignedBy: string;
  departmentId: string;
  dueDate: Date;
  startDate: Date;
  completedAt?: Date;
  attachments: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  history: TaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string[];
  departmentId: string;
  dueDate: Date;
  startDate: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string[];
  dueDate?: Date;
  attachments?: string[];
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  departmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
