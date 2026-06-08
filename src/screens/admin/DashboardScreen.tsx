import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, StatCard, Avatar, Badge} from '../../components/ui';
import {AlertsPanel} from '../../components/features/AlertsPanel';
import {buildAlerts} from '../../utils/analytics';
import {COLORS} from '../../constants';
import {
  initials,
  roleColor,
  taskStatusLabel,
  taskStatusColor,
  formatTime,
} from '../../utils/labels';
import {TaskStatus} from '../../types';

export const DashboardScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {users, tasks, vehicles, trips, attendance, getUserById} = useData();

  const alerts = buildAlerts(tasks, vehicles, trips, id => {
    const u = getUserById(id);
    return u ? `${u.firstName} ${u.lastName}` : '—';
  });

  const activeUsers = users.filter(u => u.isActive).length;
  const activeTasks = tasks.filter(
    t => t.status === 'in_progress' || t.status === 'not_started',
  ).length;
  const inTransit = vehicles.filter(v => v.status === 'in_transit').length;
  const presentToday = attendance.filter(
    a =>
      a.date.toDateString() === new Date().toDateString() &&
      (a.status === 'present' || a.status === 'late'),
  ).length;

  const statusCounts = (['not_started', 'in_progress', 'completed', 'delayed'] as TaskStatus[]).map(
    s => ({status: s, count: tasks.filter(t => t.status === s).length}),
  );
  const totalTasks = tasks.length || 1;

  const recent = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 4);

  return (
    <Screen
      title={`Bonjour, ${user?.firstName ?? ''} 👋`}
      subtitle="Tableau de bord administrateur"
      right={
        user ? (
          <Avatar
            label={initials(user.firstName, user.lastName)}
            color={roleColor[user.role]}
          />
        ) : undefined
      }>
      <View style={styles.statRow}>
        <StatCard value={activeUsers} label="Utilisateurs actifs" icon="👥" />
        <View style={styles.gap} />
        <StatCard
          value={activeTasks}
          label="Tâches en cours"
          icon="📋"
          color={COLORS.secondary}
        />
      </View>
      <View style={[styles.statRow, styles.statRowSpacing]}>
        <StatCard
          value={inTransit}
          label="Véhicules en route"
          icon="🚚"
          color={COLORS.info}
        />
        <View style={styles.gap} />
        <StatCard
          value={presentToday}
          label="Présents aujourd'hui"
          icon="✅"
          color={COLORS.success}
        />
      </View>

      <Text style={styles.sectionTitle}>Alertes</Text>
      <AlertsPanel alerts={alerts} limit={3} />

      <Text style={styles.sectionTitle}>Répartition des tâches</Text>
      <View style={styles.card}>
        {statusCounts.map(({status, count}) => (
          <View key={status} style={styles.barRow}>
            <Text style={styles.barLabel}>{taskStatusLabel[status]}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(count / totalTasks) * 100}%`,
                    backgroundColor: taskStatusColor[status],
                  },
                ]}
              />
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Activité récente</Text>
      <View style={styles.card}>
        {recent.map((t, i) => (
          <View
            key={t.id}
            style={[styles.activityRow, i < recent.length - 1 && styles.divider]}>
            <View style={styles.flex}>
              <Text style={styles.activityTitle} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={styles.activityTime}>
                Mise à jour {formatTime(t.updatedAt)}
              </Text>
            </View>
            <Badge
              label={taskStatusLabel[t.status]}
              color={taskStatusColor[t.status]}
            />
          </View>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  statRow: {
    flexDirection: 'row',
  },
  statRowSpacing: {
    marginTop: 12,
  },
  gap: {
    width: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  barLabel: {
    width: 80,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  barCount: {
    width: 24,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
