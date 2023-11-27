// TabNavigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import BoycottedPlacesScreen from "../screens/BoycottedPlacesScreen";
import CommunityScreen from "../screens/CommunityScreen";
import BarcodeScanner from "../screens/BarcodeScanner";
import AllowedScreen from "../screens/AllowedScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PlacesDetailScreen from "../screens/PlacesDetailScreen";

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused, color, size) => {
  let iconName;
  let iconColor = focused ? "#094349" : "gray"; // Set colors based on the focused state

  if (route.name === "Home") {
    iconName = focused ? "home" : "home-outline";
  } else if (route.name === "Community") {
    iconName = focused ? "chatbubble" : "chatbubble-outline";
  } else if (route.name === "Barcode") {
    iconName = focused ? "barcode" : "barcode-outline";
  } else if (route.name === "Shop") {
    iconName = focused ? "receipt" : "receipt-outline";
  } else if (route.name === "Settings") {
    iconName = focused ? "settings" : "settings-outline";
  }

  return <Ionicons name={iconName} size={size} color={iconColor} />;
};

const TabNavigation = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route, focused, color, size),
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: "#094349",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={BoycottedPlacesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Barcode" component={BarcodeScanner} />
      <Tab.Screen name="Shop" component={AllowedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
