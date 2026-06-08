import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useData} from '../../context/DataContext';
import {Screen, Fab, EmptyState} from '../../components/ui';
import {TaskCard} from '../../components/features/TaskCard';
import {TaskFormModal} from '../../components/features/TaskFormModal';
import {COLORS} from '../../constants';
import {Task, TaskStatus, User} from '../../types';
import {taskStatusLabel} from '../../utils/labels';

interface TaskListScreenProps {
  title: string;
  subtitle?: string;
  tasks: Task[];
  assignableUsers: User[];
  departmentId: string;
  currentUserId: string;
  canCreate?: boolean;
  canManage?: boolean;
}

const FILTERS: {key: TaskStatus | 'all'; label: string}[] = [
  {key: 'all', label: 'Toutes'},
  {key: 'not_started', label: 'À faire'},
  {key: 'in_progress', label: 'En cours'},
  {key: 'completed', label: 'Terminées'},
  {key: 'delayed', label: 'En retard'},
];

const NEXT_STATUSES: TaskStatus[] = [
  'not_started',
  'in_progress',
  'completed',
  'delayed',
];

export const TaskListScreen: React.FC<TaskListScreenProps> = ({
  title,
  subtitle,
  tasks,
  assignableUsers,
  departmentId,
  currentUserId,
  canCreate = false,
  canManage = false,
}) => {
  const {addTask, updateTaskStatus, deleteTask} = useData();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  const handleTaskPress = (task: Task) => {
    const statusOptions = NEXT_STATUSES.filter(s => s !== task.status).map(s => ({
      text: `→ ${taskStatusLabel[s]}`,
      onPress: () => updateTaskStatus(task.id, s, currentUserId),
    }));

    const buttons: any[] = [...statusOptions];
    if (canManage) {
      buttons.push({
        text: 'Supprimer',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Supprimer', `Supprimer « ${task.title} » ?`, [
            {text: 'Annuler', style: 'cancel'},
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => deleteTask(task.id),
            },
          ]),
      });
    }
    buttons.push({text: 'Fermer', style: 'cancel'});

    Alert.alert(task.title, 'Changer le statut de la tâche', buttons);
  };

  return (
    <Screen title={title} subtitle={subtitle ?? `${tasks.length} tâche(s)`}>
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
          icon="📋"
          title="Aucune tâche"
          message="Aucune tâche ne correspond à ce filtre."
        />
      ) : (
        filtered.map(t => (
          <TaskCard key={t.id} task={t} onPress={() => handleTaskPress(t)} />
        ))
      )}

      {canCreate && (
        <>
          <TaskFormModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={dto => addTask(dto, currentUserId)}
            assignableUsers={assignableUsers}
            departmentId={departmentId}
          />
          <Fab onPress={() => setModalVisible(true)} />
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
