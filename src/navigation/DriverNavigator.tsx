import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants';
import {tabIcon} from '../components/ui';
import {TripsScreen} from '../screens/driver/TripsScreen';
import {MapScreen} from '../screens/driver/MapScreen';
import {MessagesScreen} from '../screens/shared/MessagesScreen';
import {ProfileScreen} from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();

export const DriverNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {height: 60, paddingBottom: 8, paddingTop: 6},
      }}>
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{title: 'Trajets', tabBarIcon: tabIcon('🛣️')}}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Carte', tabBarIcon: tabIcon('🗺️')}}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{title: 'Messages', tabBarIcon: tabIcon('💬')}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profil', tabBarIcon: tabIcon('👤')}}
      />
    </Tab.Navigator>
  );
};
