export * from './roles';
export * from './colors';

export const APP_NAME = 'Mamadina';
export const APP_VERSION = '1.0.0';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const GEOFENCE = {
  DEFAULT_RADIUS: 100, // meters
  CHECK_IN_RADIUS: 50, // meters
};

export const LOCATION_TRACKING = {
  UPDATE_INTERVAL: 30000, // 30 seconds
  FASTEST_INTERVAL: 10000, // 10 seconds
  DISTANCE_FILTER: 10, // meters
};

export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  TASK_OVERDUE: 'task_overdue',
  MESSAGE_RECEIVED: 'message_received',
  TRIP_STARTED: 'trip_started',
  TRIP_DELAYED: 'trip_delayed',
  TRIP_COMPLETED: 'trip_completed',
  VEHICLE_MAINTENANCE: 'vehicle_maintenance',
};
