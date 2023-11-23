// LoginScreen.js

import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the correct function
import { auth } from "../config/firebase"; // Update the path accordingly
import Logo from "../assets/logo.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button mode="contained" style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Button>

      <Text
        style={styles.link}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        Not a member yet? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#094349",
  },
  logo: {
    width: "90%",
    height: 300,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "90%",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#CF5189",
    width: "90%",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  link: {
    fontSize: 12,
    fontWeight: "900",
    color: "white",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default LoginScreen;
