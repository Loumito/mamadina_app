import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

// Placeholder screens
const DashboardScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Dashboard Responsable</Text>
  </View>
);

const TasksScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Gestion des Tâches</Text>
  </View>
);

const TeamScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Mon Équipe</Text>
  </View>
);

const MessagesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Messages</Text>
  </View>
);

const ReportsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Rapports</Text>
  </View>
);

export const ManagerNavigator: React.FC = () => {
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
        name="Tasks"
        component={TasksScreen}
        options={{title: 'Tâches'}}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{title: 'Équipe'}}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{title: 'Messages'}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Rapports'}}
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
