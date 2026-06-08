import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, StatCard, Avatar} from '../../components/ui';
import {TaskCard} from '../../components/features/TaskCard';
import {AlertsPanel} from '../../components/features/AlertsPanel';
import {buildAlerts} from '../../utils/analytics';
import {COLORS} from '../../constants';
import {initials, roleColor} from '../../utils/labels';

export const DashboardScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {tasks, departments, users, vehicles, trips, getUserById} = useData();
  if (!user) return null;

  const dept = departments.find(d => d.managerId === user.id);
  const memberIds = dept
    ? [...dept.employeeIds]
    : users.filter(u => u.departmentId === user.departmentId).map(u => u.id);

  const teamTasks = tasks.filter(t =>
    t.assignedTo.some(id => memberIds.includes(id)),
  );
  const inProgress = teamTasks.filter(t => t.status === 'in_progress').length;
  const delayed = teamTasks.filter(t => t.status === 'delayed').length;
  const completed = teamTasks.filter(t => t.status === 'completed').length;

  const priority = teamTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 3);

  const alerts = buildAlerts(teamTasks, vehicles, trips, id => {
    const u = getUserById(id);
    return u ? `${u.firstName} ${u.lastName}` : '—';
  });

  return (
    <Screen
      title={`Bonjour, ${user.firstName} 👋`}
      subtitle={dept ? dept.name : 'Espace responsable'}
      right={
        <Avatar
          label={initials(user.firstName, user.lastName)}
          color={roleColor[user.role]}
        />
      }>
      <View style={styles.statRow}>
        <StatCard value={inProgress} label="En cours" icon="🔄" color={COLORS.info} />
        <View style={styles.gap} />
        <StatCard value={delayed} label="En retard" icon="⚠️" color={COLORS.error} />
        <View style={styles.gap} />
        <StatCard
          value={completed}
          label="Terminées"
          icon="✅"
          color={COLORS.success}
        />
      </View>

      <Text style={styles.sectionTitle}>Alertes</Text>
      <AlertsPanel alerts={alerts} limit={3} />

      <Text style={styles.sectionTitle}>Membres de l'équipe</Text>
      <View style={styles.teamCard}>
        {memberIds.length === 0 ? (
          <Text style={styles.empty}>Aucun membre dans votre équipe.</Text>
        ) : (
          memberIds.map(id => {
            const member = users.find(u => u.id === id);
            if (!member) return null;
            return (
              <View key={id} style={styles.member}>
                <Avatar
                  label={initials(member.firstName, member.lastName)}
                  color={roleColor[member.role]}
                  size={40}
                />
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.firstName}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <Text style={styles.sectionTitle}>Tâches prioritaires</Text>
      {priority.length === 0 ? (
        <Text style={styles.empty}>Aucune tâche en attente. 🎉</Text>
      ) : (
        priority.map(t => <TaskCard key={t.id} task={t} />)
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
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
  teamCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
  },
  member: {
    alignItems: 'center',
    width: 64,
    marginRight: 8,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  empty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
