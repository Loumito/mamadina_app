import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Avatar, Badge, EmptyState} from '../../components/ui';
import {COLORS} from '../../constants';
import {initials, roleColor, roleLabel} from '../../utils/labels';
import {computePerformance, Performance} from '../../utils/analytics';

const ratingLabel: Record<Performance['rating'], string> = {
  excellent: 'Excellent',
  bon: 'Bon',
  moyen: 'Moyen',
  faible: 'Faible',
};

const ratingColor: Record<Performance['rating'], string> = {
  excellent: COLORS.success,
  bon: COLORS.info,
  moyen: COLORS.warning,
  faible: COLORS.error,
};

export const TeamScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {users, tasks, departments, attendance} = useData();
  if (!user) return null;

  const dept = departments.find(d => d.managerId === user.id);
  const members = users.filter(
    u =>
      u.id !== user.id &&
      (dept
        ? dept.employeeIds.includes(u.id)
        : u.departmentId === user.departmentId),
  );

  return (
    <Screen
      title="Mon équipe"
      subtitle={dept ? `${dept.name} · ${members.length} membres` : undefined}>
      {members.length === 0 ? (
        <EmptyState icon="👥" title="Aucun membre" />
      ) : (
        members.map(m => {
          const perf = computePerformance(m.id, tasks, attendance);
          return (
            <View key={m.id} style={styles.card}>
              <View style={styles.header}>
                <Avatar
                  label={initials(m.firstName, m.lastName)}
                  color={roleColor[m.role]}
                  size={48}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {m.firstName} {m.lastName}
                  </Text>
                  <View style={styles.badges}>
                    <Badge label={roleLabel[m.role]} color={roleColor[m.role]} />
                    {!m.isActive ? (
                      <Badge
                        label="Inactif"
                        color={COLORS.textSecondary}
                        style={styles.badgeSpacing}
                      />
                    ) : null}
                  </View>
                  <Text style={styles.phone}>📞 {m.phone}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={[styles.scoreValue, {color: ratingColor[perf.rating]}]}>
                    {perf.score}
                  </Text>
                  <Badge
                    label={ratingLabel[perf.rating]}
                    color={ratingColor[perf.rating]}
                  />
                </View>
              </View>
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {perf.completed}/{perf.total}
                  </Text>
                  <Text style={styles.metricLabel}>Tâches</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{perf.onTime}</Text>
                  <Text style={styles.metricLabel}>À temps</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricValue, perf.delayed > 0 && styles.metricBad]}>
                    {perf.delayed}
                  </Text>
                  <Text style={styles.metricLabel}>En retard</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {Math.round(perf.attendanceRate * 100)}%
                  </Text>
                  <Text style={styles.metricLabel}>Présence</Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  scoreBox: {
    alignItems: 'center',
    paddingLeft: 12,
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricBad: {
    color: COLORS.error,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 5,
  },
  badgeSpacing: {
    marginLeft: 6,
  },
  phone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
