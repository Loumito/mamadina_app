import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

// Placeholder screens
const TripsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Mes Trajets</Text>
  </View>
);

const MapScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Carte GPS</Text>
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

export const DriverNavigator: React.FC = () => {
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
        name="Trips"
        component={TripsScreen}
        options={{title: 'Mes trajets'}}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Carte'}}
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
