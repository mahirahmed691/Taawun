import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { sendPasswordResetEmail, AuthErrorCodes } from '@firebase/auth';
import { auth } from '../config/firebaseConfig';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      if (!email) {
        Alert.alert('Error', 'Please enter your email.');
        return;
      }

      // Send a password reset email
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.'
      );

      // Navigate to the Login screen or any other screen after sending the reset email
      navigation.navigate('Login');
    } catch (error) {
      // Check if the error is due to the email not being found
      if (error.code === AuthErrorCodes.USER_NOT_FOUND) {
        Alert.alert('Error', 'This email address is not registered.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email address, and we'll send you a link to reset your password.
      </Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button mode="outlined" style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#094349',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '900',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '90%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resetButton: {
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

export default ForgotPasswordScreen;
