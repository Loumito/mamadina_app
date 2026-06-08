import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch, Alert} from 'react-native';
import {useData} from '../../context/DataContext';
import {Screen, Avatar, Badge, Fab, EmptyState} from '../../components/ui';
import {UserFormModal} from '../../components/features/UserFormModal';
import {COLORS} from '../../constants';
import {initials, roleColor, roleLabel} from '../../utils/labels';
import {UserRole} from '../../types';

const FILTERS: {key: UserRole | 'all'; label: string}[] = [
  {key: 'all', label: 'Tous'},
  {key: 'manager', label: 'Responsables'},
  {key: 'employee', label: 'Employés'},
  {key: 'driver', label: 'Chauffeurs'},
];

export const UsersScreen: React.FC = () => {
  const {users, departments, addUser, toggleUserActive, getDepartmentById} =
    useData();
  const [filter, setFilter] = useState<UserRole | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = users.filter(u => filter === 'all' || u.role === filter);

  return (
    <Screen title="Utilisateurs" subtitle={`${users.length} membres`} scroll>
      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const selected = f.key === filter;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}>
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextSelected,
                ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="👥" title="Aucun utilisateur" />
      ) : (
        filtered.map(u => {
          const dept = u.departmentId ? getDepartmentById(u.departmentId) : undefined;
          return (
            <View key={u.id} style={styles.row}>
              <Avatar
                label={initials(u.firstName, u.lastName)}
                color={roleColor[u.role]}
              />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {u.firstName} {u.lastName}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {u.email}
                </Text>
                <View style={styles.badges}>
                  <Badge label={roleLabel[u.role]} color={roleColor[u.role]} />
                  {dept ? (
                    <Text style={styles.dept}>· {dept.name}</Text>
                  ) : null}
                </View>
              </View>
              <Switch
                value={u.isActive}
                onValueChange={() => toggleUserActive(u.id)}
                trackColor={{false: COLORS.border, true: COLORS.success}}
              />
            </View>
          );
        })
      )}

      <UserFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={user => {
          addUser(user);
          Alert.alert('Succès', `${user.firstName} ${user.lastName} a été ajouté.`);
        }}
        departments={departments}
      />
      <Fab onPress={() => setModalVisible(true)} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dept: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
});
