import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Badge, EmptyState} from '../../components/ui';
import {Button} from '../../components/common';
import {COLORS} from '../../constants';
import {
  attendanceStatusLabel,
  attendanceStatusColor,
  formatDate,
  formatTime,
} from '../../utils/labels';

export const AttendanceScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {getTodayAttendance, getAttendanceForUser, checkIn, checkOut} = useData();
  if (!user) return null;

  const today = getTodayAttendance(user.id);
  const history = getAttendanceForUser(user.id).filter(
    a => a.date.toDateString() !== new Date().toDateString(),
  );

  const hasCheckedIn = !!today?.checkIn;
  const hasCheckedOut = !!today?.checkOut;

  return (
    <Screen title="Pointage" subtitle={formatDate(new Date())}>
      <View style={styles.clockCard}>
        <Text style={styles.clockIcon}>🕐</Text>
        <Text style={styles.clockStatus}>
          {!hasCheckedIn
            ? "Vous n'avez pas encore pointé"
            : hasCheckedOut
            ? 'Journée terminée'
            : 'En service'}
        </Text>
        {today?.checkIn ? (
          <Text style={styles.clockDetail}>
            Arrivée : {formatTime(today.checkIn)}
            {today.checkOut ? `  ·  Départ : ${formatTime(today.checkOut)}` : ''}
          </Text>
        ) : null}
        {today ? (
          <Badge
            label={attendanceStatusLabel[today.status]}
            color={attendanceStatusColor[today.status]}
            style={styles.todayBadge}
          />
        ) : null}

        {!hasCheckedIn ? (
          <Button
            title="✓ Pointer mon arrivée"
            onPress={() => checkIn(user.id)}
            style={styles.button}
          />
        ) : !hasCheckedOut ? (
          <Button
            title="Pointer mon départ"
            variant="secondary"
            onPress={() => checkOut(user.id)}
            style={styles.button}
          />
        ) : (
          <Text style={styles.doneText}>Merci, à demain ! 👋</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Historique</Text>
      {history.length === 0 ? (
        <EmptyState icon="📅" title="Aucun historique" />
      ) : (
        history.map(a => (
          <View key={a.id} style={styles.row}>
            <View>
              <Text style={styles.rowDate}>{formatDate(a.date)}</Text>
              <Text style={styles.rowTime}>
                {a.checkIn ? formatTime(a.checkIn) : '—'}
                {a.checkOut ? ` → ${formatTime(a.checkOut)}` : ''}
              </Text>
            </View>
            <Badge
              label={attendanceStatusLabel[a.status]}
              color={attendanceStatusColor[a.status]}
            />
          </View>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  clockCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 8,
  },
  clockIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  clockStatus: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clockDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  todayBadge: {
    marginTop: 12,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  doneText: {
    marginTop: 20,
    fontSize: 15,
    color: COLORS.success,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rowTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
