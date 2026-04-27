import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import {selectIsAuthenticated, selectUserRole} from '../store/slices/authSlice';
import {setUser, setLoading} from '../store/slices/authSlice';
import {authService} from '../services';
import {AuthNavigator} from './AuthNavigator';
import {AdminNavigator} from './AdminNavigator';
import {ManagerNavigator} from './ManagerNavigator';
import {EmployeeNavigator} from './EmployeeNavigator';
import {DriverNavigator} from './DriverNavigator';
import {Loading} from '../components/common';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(user => {
      dispatch(setUser(user));
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [dispatch, initializing]);

  if (initializing) {
    return <Loading message="Chargement..." />;
  }

  const getRoleNavigator = () => {
    switch (userRole) {
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
  };

  const Navigator = isAuthenticated ? getRoleNavigator() : AuthNavigator;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={Navigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
