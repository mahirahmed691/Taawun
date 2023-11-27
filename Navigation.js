// Navigation.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./config/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigation from "./Auth/TabNavigation"; 
import LoginScreen from "./screens/LoginScreen";
import CommunityScreen from "./screens/CommunityScreen";
import AllowedScreen from "./screens/AllowedScreen";
import BarcodeScanner from "./screens/BarcodeScanner";
import SettingsScreen from "./screens/SettingsScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PlacesDetailScreen from "./screens/PlacesDetailScreen";
import SlideShowScreen from "./components/SlideshowScreen"
import PlaceDetails from "./screens/PlaceDetails";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const AuthenticatedApp = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={TabNavigation} />
    <Drawer.Screen name="Community" component={CommunityScreen} />
    <Drawer.Screen name="Barcode" component={BarcodeScanner} />
    <Drawer.Screen name="Shop" component={AllowedScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="FromTheRiver" component={MainStackNavigator}  options={{ drawerLabel: "" }} />
  </Drawer.Navigator>
);

const MainStackNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // Show the header
        headerTitle:"",
        headerLeft: () => (
          <IconButton
            icon={({ color, size }) => (
              <Ionicons
                name="arrow-back"
                size={size}
                color={color}
                style={{ alignItems: "flex-start" }}
              />
            )}
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    >
      <Stack.Screen name="PlaceDetailScreen" component={PlacesDetailScreen} />
      <Stack.Screen name="ShopDetail" component={PlaceDetails} />
      <Stack.Screen name="Slide" component={SlideShowScreen} />
    </Stack.Navigator>
  );
};

const UnauthenticatedApp = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: null,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const Navigation = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      setUser(user);
    };

    checkAuthState();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </NavigationContainer>
  );
};

export default Navigation;
