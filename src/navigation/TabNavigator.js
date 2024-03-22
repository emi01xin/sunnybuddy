import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UVIndexScreen from '../screens/UVIndexScreen';
import QuizScreen from '../screens/QuizScreen';
import MySkinScreen from '../screens/MySkinScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="UV Index" component={UVIndexScreen} />
      <Tab.Screen name="Sunscreen Quiz" component={QuizScreen} />
      <Tab.Screen name="My Skin" component={MySkinScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
