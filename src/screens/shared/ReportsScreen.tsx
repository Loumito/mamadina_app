import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Share, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, StatCard, Badge, EmptyState} from '../../components/ui';
import {COLORS} from '../../constants';
import {formatDate} from '../../utils/labels';
import {ReportType, Task} from '../../types';

type Period = 'daily' | 'weekly' | 'monthly';

const periodLabel: Record<Period, string> = {
  daily: "Aujourd'hui",
  weekly: 'Cette semaine',
  monthly: 'Ce mois',
};

const periodDays: Record<Period, number> = {daily: 1, weekly: 7, monthly: 30};

const reportTypeLabel: Record<ReportType, string> = {
  daily: 'Journalier',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  custom: 'Personnalisé',
};

export const ReportsScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {tasks, trips, vehicles, attendance, departments, users, reports, getUserById} =
    useData();
  const [period, setPeriod] = useState<Period>('weekly');

  if (!user) return null;

  const isManager = user.role === 'manager';
  const dept = isManager ? departments.find(d => d.managerId === user.id) : undefined;
  const memberIds = isManager
    ? dept
      ? [...dept.employeeIds]
      : users.filter(u => u.departmentId === user.departmentId).map(u => u.id)
    : null;

  const since = Date.now() - periodDays[period] * 24 * 60 * 60 * 1000;

  const inScope = (t: Task) =>
    !memberIds || t.assignedTo.some(id => memberIds.includes(id));

  const periodTasks = tasks.filter(
    t => inScope(t) && t.updatedAt.getTime() >= since,
  );
  const tasksCompleted = periodTasks.filter(t => t.status === 'completed').length;
  const tasksDelayed = periodTasks.filter(t => t.status === 'delayed').length;
  const tasksInProgress = periodTasks.filter(t => t.status === 'in_progress').length;

  const scopedAttendance = attendance.filter(
    a =>
      a.date.getTime() >= since &&
      (!memberIds || memberIds.includes(a.userId)),
  );
  const present = scopedAttendance.filter(
    a => a.status === 'present' || a.status === 'late',
  ).length;
  const attendanceRate = scopedAttendance.length
    ? Math.round((present / scopedAttendance.length) * 100)
    : 100;

  const periodTrips = trips.filter(tr => tr.createdAt.getTime() >= since);
  const completedTrips = periodTrips.filter(tr => tr.status === 'completed').length;
  const totalDistance = periodTrips.reduce((s, tr) => s + (tr.distance ?? 0), 0);
  const vehiclesActive = vehicles.filter(v => v.status !== 'maintenance').length;

  const onExport = (format: string) => {
    const lines = [
      `Rapport ${periodLabel[period]} — ${dept ? dept.name : 'Entreprise'}`,
      `Tâches terminées : ${tasksCompleted}`,
      `Tâches en retard : ${tasksDelayed}`,
      `Tâches en cours : ${tasksInProgress}`,
      `Taux de présence : ${attendanceRate}%`,
      !isManager ? `Trajets terminés : ${completedTrips}` : '',
      !isManager ? `Distance totale : ${totalDistance} km` : '',
    ].filter(Boolean);
    Share.share({message: lines.join('\n'), title: 'Rapport Mamadina'}).catch(
      () => Alert.alert('Export', `Format ${format} indisponible en mode démo.`),
    );
  };

  const savedReports = isManager
    ? reports.filter(r => r.departmentId === dept?.id || r.createdBy === user.id)
    : reports;

  return (
    <Screen title="Rapports" subtitle="Indicateurs de performance">
      <View style={styles.periodRow}>
        {(Object.keys(periodLabel) as Period[]).map(p => {
          const active = p === period;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, active && styles.periodChipActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, active && styles.periodTextActive]}>
                {periodLabel[p]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.statRow}>
        <StatCard value={tasksCompleted} label="Tâches terminées" icon="✅" color={COLORS.success} />
        <View style={styles.gap} />
        <StatCard value={tasksDelayed} label="En retard" icon="⚠️" color={COLORS.error} />
      </View>
      <View style={[styles.statRow, styles.statRowSpacing]}>
        <StatCard value={tasksInProgress} label="En cours" icon="🔄" color={COLORS.info} />
        <View style={styles.gap} />
        <StatCard value={`${attendanceRate}%`} label="Présence" icon="📅" color={COLORS.primary} />
      </View>
      {!isManager ? (
        <View style={[styles.statRow, styles.statRowSpacing]}>
          <StatCard value={completedTrips} label="Trajets terminés" icon="🚚" color={COLORS.secondary} />
          <View style={styles.gap} />
          <StatCard value={`${totalDistance} km`} label="Distance" icon="🛣️" color={COLORS.info} />
        </View>
      ) : null}

      <View style={styles.exportRow}>
        <TouchableOpacity style={styles.exportBtn} onPress={() => onExport('PDF')}>
          <Text style={styles.exportText}>📄 Exporter PDF</Text>
        </TouchableOpacity>
        <View style={styles.gap} />
        <TouchableOpacity style={styles.exportBtn} onPress={() => onExport('Excel')}>
          <Text style={styles.exportText}>📊 Exporter Excel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Rapports enregistrés</Text>
      {savedReports.length === 0 ? (
        <EmptyState icon="📁" title="Aucun rapport" message="Les rapports générés apparaîtront ici." />
      ) : (
        savedReports.map(r => (
          <View key={r.id} style={styles.reportCard}>
            <View style={styles.flex}>
              <Text style={styles.reportTitle}>
                {reportTypeLabel[r.type]} · {r.departmentId ? departments.find(d => d.id === r.departmentId)?.name : '—'}
              </Text>
              <Text style={styles.reportMeta}>
                {formatDate(r.startDate)} – {formatDate(r.endDate)} · par{' '}
                {getUserById(r.createdBy)?.firstName ?? '—'}
              </Text>
            </View>
            <Badge
              label={r.format.toUpperCase()}
              color={r.format === 'pdf' ? COLORS.error : COLORS.success}
            />
          </View>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  periodRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  periodChipActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodTextActive: {
    color: '#fff',
  },
  statRow: {
    flexDirection: 'row',
  },
  statRowSpacing: {
    marginTop: 12,
  },
  gap: {
    width: 12,
  },
  exportRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  exportBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  exportText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 10,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  reportMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
