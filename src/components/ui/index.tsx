/**
 * Composants d'interface réutilisables par tous les rôles.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../constants';

// --- Conteneur d'écran avec en-tête ---------------------------------------
interface ScreenProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  title,
  subtitle,
  right,
  children,
  scroll = true,
  onRefresh,
  refreshing,
}) => {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollBody}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flexBody}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {body}
    </SafeAreaView>
  );
};

// --- Badge / pastille de statut -------------------------------------------
interface BadgeProps {
  label: string;
  color: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({label, color, style}) => (
  <View style={[styles.badge, {backgroundColor: color + '22'}, style]}>
    <View style={[styles.badgeDot, {backgroundColor: color}]} />
    <Text style={[styles.badgeText, {color}]}>{label}</Text>
  </View>
);

// --- Carte de statistique --------------------------------------------------
interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
  icon?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  color = COLORS.primary,
  icon,
  style,
}) => (
  <View style={[styles.statCard, style]}>
    {icon ? <Text style={styles.statIcon}>{icon}</Text> : null}
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// --- Avatar avec initiales -------------------------------------------------
interface AvatarProps {
  label: string;
  color?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  label,
  color = COLORS.primary,
  size = 44,
}) => (
  <View
    style={[
      styles.avatar,
      {width: size, height: size, borderRadius: size / 2, backgroundColor: color},
    ]}>
    <Text style={[styles.avatarText, {fontSize: size * 0.38}]}>{label}</Text>
  </View>
);

// --- État vide -------------------------------------------------------------
interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  message,
}) => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
  </View>
);

// --- Bouton d'action flottant ---------------------------------------------
interface FabProps {
  onPress: () => void;
  icon?: string;
}

export const Fab: React.FC<FabProps> = ({onPress, icon = '＋'}) => (
  <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.fabIcon}>{icon}</Text>
  </TouchableOpacity>
);

// --- Titre de section ------------------------------------------------------
export const SectionTitle: React.FC<{title: string; style?: ViewStyle}> = ({
  title,
  style,
}) => <Text style={[styles.sectionTitle, style]}>{title}</Text>;

// --- Icône d'onglet (emoji, sans police native) ----------------------------
export const tabIcon =
  (active: string, inactive?: string) =>
  ({focused}: {focused: boolean}) =>
    (
      <Text style={{fontSize: 22}}>
        {focused ? active : inactive ?? active}
      </Text>
    );

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  flexBody: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: '#FFF',
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
});
