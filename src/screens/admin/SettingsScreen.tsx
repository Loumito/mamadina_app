import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {selectUser, logout} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Avatar, Badge} from '../../components/ui';
import {COLORS, APP_NAME, APP_VERSION} from '../../constants';
import {initials, roleColor, roleLabel} from '../../utils/labels';

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const user = useSelector(selectUser);
  const {users, tasks, vehicles, departments} = useData();

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');

  const confirmLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <Screen title="Paramètres">
      {user && (
        <View style={styles.headerCard}>
          <Avatar
            label={initials(user.firstName, user.lastName)}
            color={roleColor[user.role]}
            size={64}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <Badge label={roleLabel[user.role]} color={roleColor[user.role]} />
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
      <View style={styles.statsCard}>
        <Stat label="Utilisateurs" value={users.length} />
        <Stat label="Tâches" value={tasks.length} />
        <Stat label="Véhicules" value={vehicles.length} />
        <Stat label="Départements" value={departments.length} />
      </View>

      <Text style={styles.sectionTitle}>Application</Text>
      <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
        <Text style={styles.rowIcon}>🌐</Text>
        <Text style={styles.rowLabel}>Langue</Text>
        <Text style={styles.rowValue}>
          {i18n.language === 'ar' ? 'العربية' : 'Français'}
        </Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={styles.rowIcon}>ℹ️</Text>
        <Text style={styles.rowLabel}>{APP_NAME}</Text>
        <Text style={styles.rowValue}>v{APP_VERSION}</Text>
      </View>
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          Mode démonstration actif : les données sont locales. Connectez Firebase
          (google-services.json / GoogleService-Info.plist) pour synchroniser en
          temps réel.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.row, styles.logoutRow]}
        onPress={confirmLogout}>
        <Text style={styles.rowIcon}>🚪</Text>
        <Text style={[styles.rowLabel, styles.logoutLabel]}>Déconnexion</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const Stat: React.FC<{label: string; value: number}> = ({label, value}) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  rowIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  noteCard: {
    backgroundColor: COLORS.primaryLight + '55',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },
  logoutRow: {
    marginTop: 10,
  },
  logoutLabel: {
    color: COLORS.error,
  },
});
