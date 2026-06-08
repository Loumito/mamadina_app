import React from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {selectUser, logout} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Avatar, Badge} from '../../components/ui';
import {COLORS} from '../../constants';
import {
  initials,
  roleColor,
  roleLabel,
  attendanceStatusLabel,
  attendanceStatusColor,
  formatDate,
} from '../../utils/labels';

export const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const user = useSelector(selectUser);
  const {getDepartmentById, getAttendanceForUser} = useData();

  if (!user) return null;

  const department = user.departmentId
    ? getDepartmentById(user.departmentId)
    : undefined;
  const history = getAttendanceForUser(user.id).slice(0, 5);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');
  };

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
    <Screen title="Profil">
      <View style={styles.headerCard}>
        <Avatar
          label={initials(user.firstName, user.lastName)}
          color={roleColor[user.role]}
          size={72}
        />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Badge label={roleLabel[user.role]} color={roleColor[user.role]} />
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="✉️" label="Email" value={user.email} />
        <InfoRow icon="📞" label="Téléphone" value={user.phone} />
        {department ? (
          <InfoRow icon="🏢" label="Département" value={department.name} />
        ) : null}
        <InfoRow icon="📅" label="Membre depuis" value={formatDate(user.createdAt)} />
      </View>

      {history.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pointages récents</Text>
          <View style={styles.infoCard}>
            {history.map(a => (
              <View key={a.id} style={styles.attendanceRow}>
                <Text style={styles.attendanceDate}>{formatDate(a.date)}</Text>
                <Badge
                  label={attendanceStatusLabel[a.status]}
                  color={attendanceStatusColor[a.status]}
                />
              </View>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Préférences</Text>
      <TouchableOpacity style={styles.actionRow} onPress={toggleLanguage}>
        <Text style={styles.actionIcon}>🌐</Text>
        <Text style={styles.actionLabel}>Langue</Text>
        <Text style={styles.actionValue}>
          {i18n.language === 'ar' ? 'العربية' : 'Français'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionRow, styles.logoutRow]}
        onPress={confirmLogout}>
        <Text style={styles.actionIcon}>🚪</Text>
        <Text style={[styles.actionLabel, styles.logoutLabel]}>Déconnexion</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const InfoRow: React.FC<{icon: string; label: string; value: string}> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.flex}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  flex: {flex: 1},
  headerCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 24,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  attendanceDate: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  actionValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  logoutRow: {
    marginTop: 4,
  },
  logoutLabel: {
    color: COLORS.error,
  },
});
