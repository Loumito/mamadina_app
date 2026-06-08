import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {
  selectIsAuthenticated,
  selectUserRole,
} from '../store/slices/authSlice';
import {AuthNavigator} from './AuthNavigator';
import {AdminNavigator} from './AdminNavigator';
import {ManagerNavigator} from './ManagerNavigator';
import {EmployeeNavigator} from './EmployeeNavigator';
import {DriverNavigator} from './DriverNavigator';

const Stack = createStackNavigator();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const RoleNavigator = (() => {
    if (!isAuthenticated) return AuthNavigator;
    switch (role) {
      case 'admin':
        return AdminNavigator;
      case 'manager':
        return ManagerNavigator;
      case 'employee':
        return EmployeeNavigator;
      case 'driver':
        return DriverNavigator;
      default:
        return AuthNavigator;
    }
  })();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Root" component={RoleNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
