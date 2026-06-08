import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants';
import {tabIcon} from '../components/ui';
import {DashboardScreen} from '../screens/admin/DashboardScreen';
import {UsersScreen} from '../screens/admin/UsersScreen';
import {TasksScreen} from '../screens/admin/TasksScreen';
import {FleetScreen} from '../screens/admin/FleetScreen';
import {ReportsScreen} from '../screens/shared/ReportsScreen';
import {SettingsScreen} from '../screens/admin/SettingsScreen';

const Tab = createBottomTabNavigator();

export const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {height: 60, paddingBottom: 8, paddingTop: 6},
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Accueil', tabBarIcon: tabIcon('📊')}}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{title: 'Utilisateurs', tabBarIcon: tabIcon('👥')}}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{title: 'Tâches', tabBarIcon: tabIcon('📋')}}
      />
      <Tab.Screen
        name="Fleet"
        component={FleetScreen}
        options={{title: 'Flotte', tabBarIcon: tabIcon('🚚')}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Rapports', tabBarIcon: tabIcon('📈')}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Paramètres', tabBarIcon: tabIcon('⚙️')}}
      />
    </Tab.Navigator>
  );
};
