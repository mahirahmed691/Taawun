// RegisterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebaseConfig';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Request permission to access the user's media library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handlePickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setProfilePicture(result.uri);
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name with the provided full name
      await updateProfile(userCredential.user, {
        displayName: fullName,
        // Add the profile picture URL to the user's profile if available
        photoURL: profilePicture,
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
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <Image source={require('../assets/palestine.jpeg')} style={styles.defaultProfilePicture} />
      )}
      <TouchableOpacity onPress={handlePickProfilePicture}>
        <Text style={styles.pickPictureButton}>Pick Profile Picture</Text>
      </TouchableOpacity>
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
      <Button mode="outlined" style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  pickPictureButton: {
    color: 'white',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  defaultProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'gray', // You can set a background color for the default avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default RegisterScreen;
