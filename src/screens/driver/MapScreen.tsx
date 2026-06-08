import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Badge, EmptyState} from '../../components/ui';
import {COLORS} from '../../constants';
import {
  vehicleStatusLabel,
  vehicleStatusColor,
  tripStatusLabel,
  tripStatusColor,
} from '../../utils/labels';
import {Location} from '../../types';

const MAP_SIZE = 260;
const PADDING = 24;

function plot(points: Location[]) {
  if (points.length === 0) return [];
  const lats = points.map(p => p.latitude);
  const lngs = points.map(p => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 1;
  const spanLng = maxLng - minLng || 1;
  const usable = MAP_SIZE - PADDING * 2;
  return points.map(p => ({
    // latitude grows upward → invert Y
    top: PADDING + (1 - (p.latitude - minLat) / spanLat) * usable,
    left: PADDING + ((p.longitude - minLng) / spanLng) * usable,
  }));
}

export const MapScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {vehicles, trips} = useData();
  if (!user) return null;

  const vehicle = vehicles.find(v => v.driverId === user.id);
  const activeTrip = trips.find(
    t => t.driverId === user.id && t.status === 'in_progress',
  );
  const routePoints =
    activeTrip?.actualRoute && activeTrip.actualRoute.length > 0
      ? activeTrip.actualRoute
      : vehicle?.currentLocation
      ? [vehicle.currentLocation]
      : [];
  const positions = plot(routePoints);

  return (
    <Screen title="Carte GPS" subtitle="Suivi de position">
      {!vehicle ? (
        <EmptyState
          icon="🚗"
          title="Aucun véhicule assigné"
          message="Contactez votre responsable pour l'attribution d'un véhicule."
        />
      ) : (
        <>
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleTop}>
              <Text style={styles.plate}>🚚 {vehicle.licensePlate}</Text>
              <Badge
                label={vehicleStatusLabel[vehicle.status]}
                color={vehicleStatusColor[vehicle.status]}
              />
            </View>
            <Text style={styles.model}>
              {vehicle.brand} {vehicle.model} · {vehicle.year}
            </Text>
          </View>

          <View style={styles.mapWrapper}>
            <View style={styles.mapGrid}>
              {Array.from({length: 4}).map((_, i) => (
                <View key={`h${i}`} style={[styles.gridLine, {top: (i + 1) * (MAP_SIZE / 5)}]} />
              ))}
              {Array.from({length: 4}).map((_, i) => (
                <View
                  key={`v${i}`}
                  style={[styles.gridLineV, {left: (i + 1) * (MAP_SIZE / 5)}]}
                />
              ))}
              {positions.map((pos, i) => {
                const isStart = i === 0;
                const isLast = i === positions.length - 1;
                const color = isLast
                  ? COLORS.primary
                  : isStart
                  ? COLORS.success
                  : COLORS.secondary;
                return (
                  <View
                    key={i}
                    style={[
                      styles.marker,
                      {top: pos.top - 7, left: pos.left - 7, backgroundColor: color},
                      isLast && styles.markerCurrent,
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.legend}>
              <Legend color={COLORS.success} label="Départ" />
              <Legend color={COLORS.secondary} label="Trajet" />
              <Legend color={COLORS.primary} label="Position actuelle" />
            </View>
          </View>

          {vehicle.currentLocation ? (
            <View style={styles.coordCard}>
              <Text style={styles.coordLabel}>📍 Coordonnées actuelles</Text>
              <Text style={styles.coord}>
                Lat {vehicle.currentLocation.latitude.toFixed(4)} · Lng{' '}
                {vehicle.currentLocation.longitude.toFixed(4)}
              </Text>
            </View>
          ) : null}

          {activeTrip ? (
            <View style={styles.tripCard}>
              <View style={styles.vehicleTop}>
                <Text style={styles.tripTitle}>Trajet en cours</Text>
                <Badge
                  label={tripStatusLabel[activeTrip.status]}
                  color={tripStatusColor[activeTrip.status]}
                />
              </View>
              <Text style={styles.model}>{activeTrip.notes}</Text>
              <Text style={styles.coord}>
                Distance parcourue : {activeTrip.distance} km ·{' '}
                {activeTrip.actualRoute.length} points GPS
              </Text>
            </View>
          ) : (
            <Text style={styles.noTrip}>Aucun trajet actif pour le moment.</Text>
          )}
        </>
      )}
    </Screen>
  );
};

const Legend: React.FC<{color: string; label: string}> = ({color, label}) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, {backgroundColor: color}]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  vehicleTop: {
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
  mapWrapper: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  mapGrid: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    backgroundColor: '#E8F0E5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  marker: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  markerCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  coordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  coordLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  coord: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noTrip: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});
