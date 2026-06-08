import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, StatCard, Badge, EmptyState} from '../../components/ui';
import {Button} from '../../components/common';
import {COLORS} from '../../constants';
import {
  tripStatusLabel,
  tripStatusColor,
  formatTime,
  formatDate,
} from '../../utils/labels';

export const TripsScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {trips, vehicles, setTripStatus} = useData();
  if (!user) return null;

  const myTrips = trips
    .filter(t => t.driverId === user.id)
    .sort((a, b) => b.departureTime.getTime() - a.departureTime.getTime());
  const completed = myTrips.filter(t => t.status === 'completed').length;
  const distance = myTrips.reduce((sum, t) => sum + t.distance, 0);

  const finishTrip = (id: string) => {
    Alert.alert('Terminer le trajet', 'Confirmer la fin du trajet ?', [
      {text: 'Annuler', style: 'cancel'},
      {text: 'Terminer', onPress: () => setTripStatus(id, 'completed')},
    ]);
  };

  return (
    <Screen title="Mes trajets" subtitle={`${myTrips.length} trajet(s)`}>
      <View style={styles.statRow}>
        <StatCard value={completed} label="Terminés" icon="✅" color={COLORS.success} />
        <View style={styles.gap} />
        <StatCard
          value={`${distance.toFixed(0)}`}
          label="Km parcourus"
          icon="📏"
          color={COLORS.info}
        />
      </View>

      {myTrips.length === 0 ? (
        <EmptyState icon="🛣️" title="Aucun trajet" />
      ) : (
        myTrips.map(tr => {
          const vehicle = vehicles.find(v => v.id === tr.vehicleId);
          return (
            <View key={tr.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.plate}>🚚 {vehicle?.licensePlate ?? '—'}</Text>
                <Badge
                  label={tripStatusLabel[tr.status]}
                  color={tripStatusColor[tr.status]}
                />
              </View>
              <Text style={styles.notes}>{tr.notes ?? 'Trajet'}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>📅 {formatDate(tr.departureTime)}</Text>
                <Text style={styles.meta}>📏 {tr.distance} km</Text>
              </View>
              <Text style={styles.meta}>
                🕐 Départ {formatTime(tr.departureTime)}
                {tr.arrivalTime
                  ? ` · Arrivée ${formatTime(tr.arrivalTime)}`
                  : tr.estimatedArrival
                  ? ` · ETA ${formatTime(tr.estimatedArrival)}`
                  : ''}
              </Text>
              {tr.alerts.length > 0 ? (
                <View style={styles.alert}>
                  <Text style={styles.alertText}>
                    ⚠️ {tr.alerts[tr.alerts.length - 1].message}
                  </Text>
                </View>
              ) : null}
              {tr.status === 'in_progress' ? (
                <Button
                  title="Terminer le trajet"
                  onPress={() => finishTrip(tr.id)}
                  style={styles.button}
                  size="small"
                />
              ) : null}
            </View>
          );
        })
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gap: {
    width: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notes: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  alert: {
    backgroundColor: COLORS.warning + '22',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  alertText: {
    fontSize: 12,
    color: COLORS.secondaryDark,
  },
  button: {
    marginTop: 14,
  },
});
