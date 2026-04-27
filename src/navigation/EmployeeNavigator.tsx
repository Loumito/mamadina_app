import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

// Placeholder screens
const TasksScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Mes Tâches</Text>
  </View>
);

const AttendanceScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Pointage</Text>
  </View>
);

const MessagesScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Messages</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Mon Profil</Text>
  </View>
);

export const EmployeeNavigator: React.FC = () => {
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
        name="Tasks"
        component={TasksScreen}
        options={{title: 'Mes tâches'}}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{title: 'Pointage'}}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{title: 'Messages'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profil'}}
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
