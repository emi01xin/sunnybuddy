import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

// load fonts
const fetchFonts = () => {
  return Font.loadAsync({
    'OpenSans_Condensed-R': require('./assets/fonts/OpenSans_Condensed-Regular.ttf'),
    'OpenSans-R': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SB': require('./assets/fonts/OpenSans-SemiBold.ttf'),
  });
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await fetchFonts();
        // Artificially delay for two seconds to simulate a slow loading process
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  // Hide the splash screen when app is ready
  SplashScreen.hideAsync();
  
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
