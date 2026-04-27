import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store/store';
import {AppNavigator} from './src/navigation';
import {Loading} from './src/components/common';
import './src/i18n/i18n.config';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading message="Initialisation..." />} persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor="#2196F3" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

export default App;
