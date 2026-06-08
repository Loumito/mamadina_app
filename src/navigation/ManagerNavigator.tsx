import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants';
import {tabIcon} from '../components/ui';
import {DashboardScreen} from '../screens/manager/DashboardScreen';
import {TasksScreen} from '../screens/manager/TasksScreen';
import {TeamScreen} from '../screens/manager/TeamScreen';
import {ReportsScreen} from '../screens/shared/ReportsScreen';
import {MessagesScreen} from '../screens/shared/MessagesScreen';

const Tab = createBottomTabNavigator();

export const ManagerNavigator: React.FC = () => {
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
        name="Tasks"
        component={TasksScreen}
        options={{title: 'Tâches', tabBarIcon: tabIcon('📋')}}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{title: 'Équipe', tabBarIcon: tabIcon('👥')}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Rapports', tabBarIcon: tabIcon('📈')}}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{title: 'Messages', tabBarIcon: tabIcon('💬')}}
      />
    </Tab.Navigator>
  );
};
