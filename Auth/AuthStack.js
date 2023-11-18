import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthComponent from './AuthComponent'; // Update the path

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={AuthComponent}
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
