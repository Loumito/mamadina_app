/**
 * labels.ts - Libellés français et couleurs pour les énumérations métier.
 */
import {
  TaskStatus,
  TaskPriority,
  UserRole,
  VehicleStatus,
  TripStatus,
  AttendanceStatus,
} from '../types';
import {COLORS} from '../constants';

export const taskStatusLabel: Record<TaskStatus, string> = {
  not_started: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminée',
  delayed: 'En retard',
};

export const taskStatusColor: Record<TaskStatus, string> = {
  not_started: COLORS.statusNotStarted,
  in_progress: COLORS.statusInProgress,
  completed: COLORS.statusCompleted,
  delayed: COLORS.statusDelayed,
};

export const taskPriorityLabel: Record<TaskPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

export const taskPriorityColor: Record<TaskPriority, string> = {
  low: COLORS.priorityLow,
  medium: COLORS.priorityMedium,
  high: COLORS.priorityHigh,
  urgent: COLORS.priorityUrgent,
};

export const roleLabel: Record<UserRole, string> = {
  admin: 'Administrateur',
  manager: 'Responsable',
  employee: 'Employé',
  driver: 'Chauffeur',
};

export const roleColor: Record<UserRole, string> = {
  admin: COLORS.roleAdmin,
  manager: COLORS.roleManager,
  employee: COLORS.roleEmployee,
  driver: COLORS.roleDriver,
};

export const vehicleStatusLabel: Record<VehicleStatus, string> = {
  available: 'Disponible',
  in_transit: 'En route',
  maintenance: 'Maintenance',
};

export const vehicleStatusColor: Record<VehicleStatus, string> = {
  available: COLORS.vehicleAvailable,
  in_transit: COLORS.vehicleInTransit,
  maintenance: COLORS.vehicleMaintenance,
};

export const tripStatusLabel: Record<TripStatus, string> = {
  in_progress: 'En cours',
  completed: 'Terminé',
  delayed: 'En retard',
};

export const tripStatusColor: Record<TripStatus, string> = {
  in_progress: COLORS.statusInProgress,
  completed: COLORS.statusCompleted,
  delayed: COLORS.statusDelayed,
};

export const attendanceStatusLabel: Record<AttendanceStatus, string> = {
  present: 'Présent',
  absent: 'Absent',
  late: 'En retard',
  on_leave: 'En congé',
};

export const attendanceStatusColor: Record<AttendanceStatus, string> = {
  present: COLORS.attendancePresent,
  absent: COLORS.attendanceAbsent,
  late: COLORS.attendanceLate,
  on_leave: COLORS.attendanceOnLeave,
};

export const initials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short', year: 'numeric'});

export const formatTime = (date: Date): string =>
  date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});

export const formatDateTime = (date: Date): string =>
  `${formatDate(date)} · ${formatTime(date)}`;

export const relativeDay = (date: Date): string => {
  const a = new Date(date).setHours(0, 0, 0, 0);
  const b = new Date().setHours(0, 0, 0, 0);
  const diff = Math.round((a - b) / (24 * 60 * 60 * 1000));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  if (diff === -1) return 'Hier';
  if (diff < 0) return `Il y a ${Math.abs(diff)} j`;
  return `Dans ${diff} j`;
};
