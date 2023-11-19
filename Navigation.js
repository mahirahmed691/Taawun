import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import BoycottedPlacesScreen from "./screens/BoycottedPlacesScreen";
import PlaceDetailScreen from "./screens/PlacedDetailScreen";
import BarcodeScanner from "./screens/BarcodeScanner";
import AllowedScreen from "./screens/AllowedScreen";
import CommunityScreen from "./screens/CommunityScreen";
import SettingsScreen from "./screens/SettingsScreen";
import InfluencerScreen from "./screens/InfluencerScreen";

// Load fonts before rendering the app
async function loadFonts() {
  await Font.loadAsync({
    "Material Icons": require("react-native-vector-icons/Fonts/MaterialIcons.ttf"),
    ...Ionicons.font, // Load Ionicons font
  });
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const BoycottedPlacesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        height: 60,
      },
      headerTitleStyle: {
        fontSize: 12,
      },
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Boycotted Places"
      component={BoycottedPlacesScreen}
      options={({ route }) => ({
        headerTitle: getHeaderTitle(route),
      })}
    />
    <Stack.Screen
      name="PlaceDetail"
      component={PlaceDetailScreen}
      options={{ headerTitle: "Place Details" }}
    />

    <Stack.Screen
      name="People"
      component={InfluencerScreen}
      options={{ headerTitle: "People" }}
    />
  </Stack.Navigator>
);

const Navigation = () => {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={TabNavigation}
          options={({ route }) => ({
            title: getHeaderTitle(route),
          })}
        />
        <Drawer.Screen name="Community" component={CommunityScreen} />
        <Drawer.Screen name="Barcode" component={BarcodeScanner} />
        <Drawer.Screen name="Verified" component={AllowedScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Barcode") {
            iconName = focused ? "barcode" : "barcode-outline";
          } else if (route.name === "Verified") {
            iconName = focused ? "shield-checkmark" : "checkmark-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={BoycottedPlacesStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Community"
        component={CommunityScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Barcode"
        component={BarcodeScanner}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Verified"
        component={AllowedScreen}
      />

      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

// Function to get the dynamic header title
const getHeaderTitle = (route) => {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? "Boycotted Places";

  switch (routeName) {
    case "Home":
      return "Home";
    case "Community":
      return "Community";
    case "Barcode":
      return "Barcode Scanner";
    case "Verified":
      return "Verified Places";
    default:
      return "Revolt";
  }
};

export default Navigation;
