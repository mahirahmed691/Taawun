// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name with the provided full name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      console.log('Registration successful!');

      // Navigate to the Home screen or any other screen after successful registration
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>From The River</Text>
      <Text style={styles.strapline}>To The Sea</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <Button
        mode="outlined"
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Button>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#094349',
  },
  input: {
    height: 40,
    width: '90%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '900',
    letterSpacing: 4,
  },
  strapline: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    fontWeight: '300',
    letterSpacing: 10,
  },
  registerButton: {
    backgroundColor: '#CF5189',
    width: '90%',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
