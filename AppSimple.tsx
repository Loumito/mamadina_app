/**
 * AppSimple.tsx - Version simplifiée pour tester l'application sans Firebase
 * 
 * Pour l'utiliser, modifiez temporairement index.js :
 * import App from './AppSimple';  // Au lieu de './App'
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {AdminNavigator} from './src/navigation/AdminNavigator';
import {COLORS} from './src/constants';

function AppSimple(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <AdminNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default AppSimple;
