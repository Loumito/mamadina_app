/**
 * analytics.ts - Évaluation de performance et alertes intelligentes.
 *
 * Fonctions pures dérivant des indicateurs à partir des données métier.
 */
import {Task, Attendance, Vehicle, Trip, User} from '../types';

export interface Performance {
  score: number; // 0..100
  total: number;
  completed: number;
  onTime: number;
  delayed: number;
  attendanceRate: number; // 0..1
  rating: 'excellent' | 'bon' | 'moyen' | 'faible';
}

export const performanceRating = (score: number): Performance['rating'] => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'bon';
  if (score >= 50) return 'moyen';
  return 'faible';
};

export function computePerformance(
  userId: string,
  tasks: Task[],
  attendance: Attendance[],
): Performance {
  const userTasks = tasks.filter(t => t.assignedTo.includes(userId));
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.status === 'completed').length;
  const delayed = userTasks.filter(t => t.status === 'delayed').length;
  const onTime = userTasks.filter(
    t =>
      t.status === 'completed' &&
      t.completedAt &&
      t.completedAt.getTime() <= t.dueDate.getTime(),
  ).length;

  const userAttendance = attendance.filter(a => a.userId === userId);
  const present = userAttendance.filter(
    a => a.status === 'present' || a.status === 'late',
  ).length;
  const attendanceRate =
    userAttendance.length > 0 ? present / userAttendance.length : 1;

  // Score: 50% taux de complétion, 30% ponctualité, 20% présence.
  const completionRate = total > 0 ? completed / total : 0;
  const punctualityRate = completed > 0 ? onTime / completed : total > 0 ? 0 : 1;
  const score = Math.round(
    (completionRate * 0.5 + punctualityRate * 0.3 + attendanceRate * 0.2) * 100,
  );

  return {
    score,
    total,
    completed,
    onTime,
    delayed,
    attendanceRate,
    rating: performanceRating(score),
  };
}

export type AlertSeverity = 'high' | 'medium' | 'low';

export interface SmartAlert {
  id: string;
  icon: string;
  title: string;
  detail: string;
  severity: AlertSeverity;
}

export function buildAlerts(
  tasks: Task[],
  vehicles: Vehicle[],
  trips: Trip[],
  getUserName: (id: string) => string,
): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const now = Date.now();

  // Tâches en retard ou bientôt dues
  tasks.forEach(t => {
    if (t.status === 'completed') return;
    const overdue = t.dueDate.getTime() < now;
    const dueSoon =
      !overdue && t.dueDate.getTime() - now < 24 * 60 * 60 * 1000;
    if (t.status === 'delayed' || overdue) {
      alerts.push({
        id: `task-${t.id}`,
        icon: '⏰',
        title: `Tâche en retard : ${t.title}`,
        detail: `Assignée à ${t.assignedTo.map(getUserName).join(', ') || '—'}`,
        severity: t.priority === 'urgent' ? 'high' : 'medium',
      });
    } else if (dueSoon) {
      alerts.push({
        id: `task-${t.id}`,
        icon: '📌',
        title: `Échéance proche : ${t.title}`,
        detail: 'À terminer dans moins de 24 h',
        severity: 'low',
      });
    }
  });

  // Trajets en retard / alertes de déviation
  trips.forEach(tr => {
    tr.alerts.forEach((a, i) => {
      alerts.push({
        id: `trip-${tr.id}-${i}`,
        icon: a.type === 'deviation' ? '🧭' : '🚚',
        title: `Trajet ${getUserName(tr.driverId)} : ${a.message}`,
        detail: tr.notes ?? 'Trajet en cours',
        severity: a.severity,
      });
    });
  });

  // Maintenance véhicules
  vehicles.forEach(v => {
    if (v.status === 'maintenance') {
      alerts.push({
        id: `veh-${v.id}`,
        icon: '🔧',
        title: `${v.licensePlate} en maintenance`,
        detail: `${v.brand} ${v.model}`,
        severity: 'medium',
      });
    } else if (
      v.nextMaintenance &&
      v.nextMaintenance.getTime() - now < 7 * 24 * 60 * 60 * 1000
    ) {
      alerts.push({
        id: `veh-${v.id}`,
        icon: '🔧',
        title: `Maintenance proche : ${v.licensePlate}`,
        detail: 'Entretien prévu sous 7 jours',
        severity: 'low',
      });
    }
  });

  const order: Record<AlertSeverity, number> = {high: 0, medium: 1, low: 2};
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}
