import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Task} from '../../types';
import {COLORS} from '../../constants';
import {Badge} from '../ui';
import {
  taskStatusLabel,
  taskStatusColor,
  taskPriorityLabel,
  taskPriorityColor,
  relativeDay,
} from '../../utils/labels';
import {useData} from '../../context/DataContext';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, onPress}) => {
  const {getUserById} = useData();
  const assignees = task.assignedTo
    .map(id => getUserById(id))
    .filter(Boolean)
    .map(u => `${u!.firstName} ${u!.lastName}`)
    .join(', ');

  const overdue =
    task.status !== 'completed' && task.dueDate.getTime() < Date.now();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.priorityBar,
            {backgroundColor: taskPriorityColor[task.priority]},
          ]}
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
          <View style={styles.badgeRow}>
            <Badge
              label={taskStatusLabel[task.status]}
              color={taskStatusColor[task.status]}
            />
            <Badge
              label={taskPriorityLabel[task.priority]}
              color={taskPriorityColor[task.priority]}
              style={styles.badgeSpacing}
            />
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              👤 {assignees || 'Non assignée'}
            </Text>
            <Text
              style={[styles.meta, overdue && styles.overdue]}>
              📅 {relativeDay(task.dueDate)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
  },
  priorityBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  badgeSpacing: {
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  overdue: {
    color: COLORS.error,
    fontWeight: '600',
  },
});
