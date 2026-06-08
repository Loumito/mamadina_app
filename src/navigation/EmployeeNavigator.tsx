import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants';
import {tabIcon} from '../components/ui';
import {MyTasksScreen} from '../screens/employee/MyTasksScreen';
import {AttendanceScreen} from '../screens/employee/AttendanceScreen';
import {MessagesScreen} from '../screens/shared/MessagesScreen';
import {ProfileScreen} from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();

export const EmployeeNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {height: 60, paddingBottom: 8, paddingTop: 6},
      }}>
      <Tab.Screen
        name="Tasks"
        component={MyTasksScreen}
        options={{title: 'Mes tâches', tabBarIcon: tabIcon('📋')}}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{title: 'Pointage', tabBarIcon: tabIcon('🕐')}}
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
