import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Input, Button} from '../common';
import {COLORS} from '../../constants';
import {TaskPriority, CreateTaskDto, User} from '../../types';
import {taskPriorityLabel, taskPriorityColor, initials} from '../../utils/labels';
import {Avatar} from '../ui';

interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTaskDto) => void;
  assignableUsers: User[];
  departmentId: string;
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const DUE_OPTIONS = [
  {label: 'Demain', days: 1},
  {label: '3 jours', days: 3},
  {label: '1 semaine', days: 7},
  {label: '2 semaines', days: 14},
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  assignableUsers,
  departmentId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dueDays, setDueDays] = useState(3);
  const [error, setError] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssignedTo([]);
    setDueDays(3);
    setError('');
  };

  const toggleAssignee = (id: string) => {
    setAssignedTo(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (title.trim().length < 3) {
      setError('Le titre doit contenir au moins 3 caractères.');
      return;
    }
    if (!description.trim()) {
      setError('La description est requise.');
      return;
    }
    if (assignedTo.length === 0) {
      setError('Assignez la tâche à au moins une personne.');
      return;
    }
    const now = new Date();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignedTo,
      departmentId,
      startDate: now,
      dueDate: new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>Nouvelle tâche</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Input
              label="Titre"
              placeholder="Titre de la tâche"
              value={title}
              onChangeText={setTitle}
            />
            <Input
              label="Description"
              placeholder="Décrivez la tâche..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />

            <Text style={styles.label}>Priorité</Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map(p => {
                const selected = p === priority;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.chip,
                      selected && {
                        backgroundColor: taskPriorityColor[p] + '22',
                        borderColor: taskPriorityColor[p],
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        selected && {color: taskPriorityColor[p], fontWeight: '700'},
                      ]}>
                      {taskPriorityLabel[p]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Échéance</Text>
            <View style={styles.chipRow}>
              {DUE_OPTIONS.map(o => {
                const selected = o.days === dueDays;
                return (
                  <TouchableOpacity
                    key={o.days}
                    onPress={() => setDueDays(o.days)}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}>
                      {o.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Assigner à</Text>
            {assignableUsers.length === 0 ? (
              <Text style={styles.noUsers}>
                Aucun employé disponible dans ce département.
              </Text>
            ) : (
              assignableUsers.map(u => {
                const selected = assignedTo.includes(u.id);
                return (
                  <TouchableOpacity
                    key={u.id}
                    style={[styles.userRow, selected && styles.userRowSelected]}
                    onPress={() => toggleAssignee(u.id)}>
                    <Avatar
                      label={initials(u.firstName, u.lastName)}
                      size={36}
                    />
                    <Text style={styles.userName}>
                      {u.firstName} {u.lastName}
                    </Text>
                    <Text style={styles.check}>{selected ? '✓' : ''}</Text>
                  </TouchableOpacity>
                );
              })
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Annuler"
              variant="outline"
              onPress={() => {
                reset();
                onClose();
              }}
              style={styles.actionButton}
            />
            <Button
              title="Créer"
              onPress={handleSubmit}
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '40',
  },
  userName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  check: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  noUsers: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
