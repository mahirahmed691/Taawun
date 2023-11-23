// TabNavigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './HomeScreen';
// import ProfileScreen from './ProfileScreen';
import BoycottedPlacesScreen from '../screens/BoycottedPlacesScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={BoycottedPlacesScreen} />
      {/* <Tab.Screen name="Profile" component={BoycottedPlacesScreen} /> */}
      {/* Add other authenticated screens */}
    </Tab.Navigator>
  );
};

export default TabNavigation;
