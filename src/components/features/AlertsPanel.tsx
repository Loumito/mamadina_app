import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../constants';
import {SmartAlert, AlertSeverity} from '../../utils/analytics';

const severityColor: Record<AlertSeverity, string> = {
  high: COLORS.error,
  medium: COLORS.warning,
  low: COLORS.info,
};

interface AlertsPanelProps {
  alerts: SmartAlert[];
  limit?: number;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({alerts, limit}) => {
  const shown = limit ? alerts.slice(0, limit) : alerts;

  if (alerts.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>✅ Aucune alerte. Tout est à jour.</Text>
      </View>
    );
  }

  return (
    <View>
      {shown.map(a => (
        <View key={a.id} style={styles.row}>
          <View
            style={[
              styles.stripe,
              {backgroundColor: severityColor[a.severity]},
            ]}
          />
          <Text style={styles.icon}>{a.icon}</Text>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {a.title}
            </Text>
            <Text style={styles.detail} numberOfLines={1}>
              {a.detail}
            </Text>
          </View>
        </View>
      ))}
      {limit && alerts.length > limit ? (
        <Text style={styles.more}>+ {alerts.length - limit} autre(s) alerte(s)</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: COLORS.success + '18',
    borderRadius: 12,
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
  },
  icon: {
    fontSize: 20,
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  more: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
});
