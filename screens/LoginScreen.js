import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import the correct functions
import { auth } from "../config/firebaseConfig";
import Logo from "../assets/logo.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Get the auth object
      const auth = getAuth();

      // Attempt to sign in the user with the provided email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // If successful, log the user in and navigate to the Home screen
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      // Handle errors, such as incorrect password or non-existent user
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

      <Text
        onPress={() => {
          navigation.navigate("ForgotPassword");
        }}
        style={styles.forgotLink}
      >
        Forgot Password?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#234A57",
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
backgroundColor: "#000",
    width: "90%",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  link: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "900",
    textDecorationLine: "underline",
    color: "white",
    marginTop:10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default LoginScreen;