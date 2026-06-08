import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, StatCard, EmptyState} from '../../components/ui';
import {TaskCard} from '../../components/features/TaskCard';
import {COLORS} from '../../constants';
import {Task, TaskStatus} from '../../types';
import {taskStatusLabel} from '../../utils/labels';

const FILTERS: {key: TaskStatus | 'all'; label: string}[] = [
  {key: 'all', label: 'Toutes'},
  {key: 'not_started', label: 'À faire'},
  {key: 'in_progress', label: 'En cours'},
  {key: 'completed', label: 'Terminées'},
];

const NEXT_STATUSES: TaskStatus[] = ['not_started', 'in_progress', 'completed'];

export const MyTasksScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {tasks, updateTaskStatus} = useData();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  if (!user) return null;

  const myTasks = tasks.filter(t => t.assignedTo.includes(user.id));
  const filtered = myTasks.filter(t => filter === 'all' || t.status === filter);
  const open = myTasks.filter(t => t.status !== 'completed').length;
  const done = myTasks.filter(t => t.status === 'completed').length;

  const handlePress = (task: Task) => {
    const options = NEXT_STATUSES.filter(s => s !== task.status).map(s => ({
      text: `→ ${taskStatusLabel[s]}`,
      onPress: () => updateTaskStatus(task.id, s, user.id),
    }));
    Alert.alert(task.title, 'Mettre à jour le statut', [
      ...options,
      {text: 'Fermer', style: 'cancel'},
    ]);
  };

  return (
    <Screen title="Mes tâches" subtitle={`${myTasks.length} assignée(s)`}>
      <View style={styles.statRow}>
        <StatCard value={open} label="À faire" icon="📌" color={COLORS.secondary} />
        <View style={styles.gap} />
        <StatCard value={done} label="Terminées" icon="✅" color={COLORS.success} />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const selected = f.key === filter;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}>
              <Text
                style={[styles.filterText, selected && styles.filterTextSelected]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="Rien à faire ici"
          message="Aucune tâche pour ce filtre."
        />
      ) : (
        filtered.map(t => (
          <TaskCard key={t.id} task={t} onPress={() => handlePress(t)} />
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  gap: {
    width: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  filterTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
});
