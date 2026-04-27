import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

// Placeholder screens
const DashboardScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Dashboard Administrateur</Text>
  </View>
);

const UsersScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Gestion des Utilisateurs</Text>
  </View>
);

const TasksScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Gestion des Tâches</Text>
  </View>
);

const FleetScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Gestion de la Flotte</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Paramètres</Text>
  </View>
);

export const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textOnPrimary,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Tableau de bord'}}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{title: 'Utilisateurs'}}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{title: 'Tâches'}}
      />
      <Tab.Screen
        name="Fleet"
        component={FleetScreen}
        options={{title: 'Flotte'}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Paramètres'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
});
