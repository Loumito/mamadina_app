import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useData} from '../../context/DataContext';
import {Screen, Badge, EmptyState} from '../../components/ui';
import {COLORS} from '../../constants';
import {
  vehicleStatusLabel,
  vehicleStatusColor,
  tripStatusLabel,
  tripStatusColor,
  formatDate,
  formatTime,
} from '../../utils/labels';
import {VehicleStatus} from '../../types';

const VEHICLE_STATUSES: VehicleStatus[] = [
  'available',
  'in_transit',
  'maintenance',
];

export const FleetScreen: React.FC = () => {
  const {vehicles, trips, getUserById, setVehicleStatus} = useData();
  const [tab, setTab] = useState<'vehicles' | 'trips'>('vehicles');

  const changeStatus = (id: string, current: VehicleStatus) => {
    const options = VEHICLE_STATUSES.filter(s => s !== current).map(s => ({
      text: vehicleStatusLabel[s],
      onPress: () => setVehicleStatus(id, s),
    }));
    Alert.alert('Statut du véhicule', 'Choisir un nouveau statut', [
      ...options,
      {text: 'Annuler', style: 'cancel'},
    ]);
  };

  return (
    <Screen title="Flotte" subtitle={`${vehicles.length} véhicules`}>
      <View style={styles.tabs}>
        {(['vehicles', 'trips'] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'vehicles' ? 'Véhicules' : 'Trajets'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'vehicles'
        ? vehicles.map(v => {
            const driver = v.driverId ? getUserById(v.driverId) : undefined;
            return (
              <TouchableOpacity
                key={v.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => changeStatus(v.id, v.status)}>
                <View style={styles.cardTop}>
                  <Text style={styles.plate}>🚚 {v.licensePlate}</Text>
                  <Badge
                    label={vehicleStatusLabel[v.status]}
                    color={vehicleStatusColor[v.status]}
                  />
                </View>
                <Text style={styles.model}>
                  {v.brand} {v.model} · {v.year}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>
                    🧑 {driver ? `${driver.firstName} ${driver.lastName}` : 'Non assigné'}
                  </Text>
                  <Text style={styles.meta}>
                    📏 {v.mileage.toLocaleString('fr-FR')} km
                  </Text>
                </View>
                {v.nextMaintenance ? (
                  <Text style={styles.maintenance}>
                    🔧 Prochaine maintenance : {formatDate(v.nextMaintenance)}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })
        : trips.length === 0
        ? <EmptyState icon="🛣️" title="Aucun trajet" />
        : trips.map(tr => {
            const driver = getUserById(tr.driverId);
            const vehicle = vehicles.find(v => v.id === tr.vehicleId);
            return (
              <View key={tr.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.plate}>
                    {vehicle?.licensePlate ?? 'Véhicule'}
                  </Text>
                  <Badge
                    label={tripStatusLabel[tr.status]}
                    color={tripStatusColor[tr.status]}
                  />
                </View>
                <Text style={styles.model}>{tr.notes ?? 'Trajet'}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>
                    🧑 {driver ? `${driver.firstName} ${driver.lastName}` : '—'}
                  </Text>
                  <Text style={styles.meta}>📏 {tr.distance} km</Text>
                </View>
                <Text style={styles.maintenance}>
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
              </View>
            );
          })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFF',
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
  model: {
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
  },
  maintenance: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 10,
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
});
