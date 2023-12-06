import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { auth } from "../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { Updates } from "expo";
import { Paragraph, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';


const PrivacyPolicyContent = ({ onClose }) => {
  const privacyPolicyText = (
    <Paragraph style={{ fontSize: 15 }}>
      <Text style={styles.heading}>Privacy Policy- FromTheRiver</Text>
      <Text style={styles.text}>
        {"\n"}
        Welcome to FromTheRiver. This Privacy Policy is designed to help you
        understand how we collect, use, and safeguard your personal information.
        By using FromTheRiver, you agree to the terms outlined in this Privacy
        Policy.
        {"\n\n"}
        <Text style={styles.subHeading}>Information We Collect</Text>
        {"\n"}
        Personal Information: We may collect your name, email address, and other
        contact details.
        {"\n"}
        Account Information: If you create an account, we may collect your
        username, password, and other account-related information.
        {"\n"}
        Profile Information: We may collect information about your preferences,
        settings, and other details you choose to provide.
        {"\n\n"}
        <Text style={styles.subHeading}>Usage Information</Text>
        {"\n"}
        We automatically collect certain information when you use FromTheRiver,
        including:
        {"\n"}
        Device Information: We may collect information about your device,
        including the type, model, operating system, and unique identifiers.
        {"\n"}
        Log Data: Our servers automatically record information that your device
        sends whenever you use FromTheRiver. This may include your IP address,
        the pages you visit, app features you use, and other statistics.
        {"\n\n"}
        <Text style={styles.subHeading}>Location Information</Text>
        {"\n"}
        With your consent, we may collect information about your precise or
        approximate location. You can control location settings through your
        device settings or app permissions.
        {"\n\n"}
        <Text style={styles.subHeading}>How We Use Your Information</Text>
        {"\n"}
        We use the information we collect for various purposes, including:
        {"\n"}
        Providing and maintaining FromTheRiver. Personalizing your experience
        and improving our services. Sending important notices, such as updates,
        security alerts, and support messages. Analyzing usage patterns to
        enhance the functionality of FromTheRiver. Complying with legal
        obligations.
        {"\n\n"}
        <Text style={styles.subHeading}>Data Sharing and Disclosure</Text>
        {"\n"}
        We do not sell, trade, or otherwise transfer your personal information
        to third parties without your consent, except as described in this
        Privacy Policy.
        {"\n"}
        Service Providers: We may share your information with third-party
        service providers to perform tasks on our behalf (e.g., hosting,
        analytics).
        {"\n"}
        Legal Compliance: We may disclose your information when required by law
        or in response to a valid legal request.
        {"\n\n"}
        <Text style={styles.subHeading}>Your Choices</Text>
        {"\n"}
        You have the right to:
        {"\n"}
        Access, correct, or delete your personal information. Opt-out of
        receiving promotional communications. Control location settings. Disable
        cookies through your browser settings.
        {"\n\n"}
        <Text style={styles.subHeading}>Security</Text>
        {"\n"}
        We take reasonable measures to protect your personal information from
        unauthorized access, disclosure, alteration, and destruction.
        {"\n\n"}
        <Text style={styles.subHeading}>Changes to This Privacy Policy</Text>
        {"\n"}
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
        {"\n\n"}
        <Text style={styles.subHeading}>Contact Us</Text>
        {"\n"}
        If you have any questions or concerns about this Privacy Policy, please
        contact us at FromTheRiver-enquiries.gmail.com.
        {"\n\n"}
        Thank you for using FromTheRiver!
      </Text>
    </Paragraph>
  );

  return (
    <SafeAreaView style={styles.modalContent}>
      <ScrollView>
        <IconButton
          icon={() => <Ionicons name="close" size={15} color="black" />}
          style={{ alignSelf: "flex-end", marginRight: 10 }}
          mode="outlined"
          onPress={onClose}
        />
        <Text style={{ margin: 10 }}>{privacyPolicyText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsScreen = ({ navigation }) => {
  const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);

  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const fullName = user.displayName;
          const [first, ...rest] = fullName.split(" ");
          setUsername(first); // Change this line
          setProfilePicture(user.photoURL);
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
      }
    };

    fetchUserInfo();
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
        // Update the user's profile with the new profile picture URL
        await updateProfile(auth.currentUser, {
          photoURL: result.uri,
        });
      }
    } catch (error) {
      console.error("Error picking an image", error);
    }
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await auth.signOut();
      console.log("User logged out successfully.");
  
      // Check if Updates is available before calling reload
      if (Updates && Updates.reload) {
        // Reload the app after logout
        await Updates.reload();
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.sectionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Settings</Text>

          <View style={styles.section}>
            {/* Profile Picture */}

            {profilePicture && (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
              />
            )}
            <TouchableOpacity onPress={handlePickProfilePicture}>
              <Text style={styles.settingAction}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <Text>Name</Text>
            <Text style={styles.settingValue}>{username}</Text>
          </View>

          {/* Push Notifications */}
          <View style={styles.settingItem}>
            <Text>Push Notifications</Text>
            <Switch
              value={true}
              trackColor={{ false: "#767577", true: "teal" }}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <Text>Dark Mode</Text>
            <Switch value={false} />
          </View>

          {/* Language */}
          <View style={styles.settingItem}>
            <Text>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Settings</Text>

          {/* Change Password */}
          <View style={styles.settingItem}>
            <Text>Change Password</Text>
            <TouchableOpacity>
              <Text style={styles.settingAction}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Email Notifications */}
          <View style={styles.settingItem}>
            <Text>Email Notifications</Text>
            <Switch
              value={true}
              trackColor={{ false: "#767577", true: "teal" }}
            />
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>App Information</Text>

          {/* Version */}
          <View style={styles.settingItem}>
            <Text>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          {/* Privacy Policy */}
          <View style={styles.settingItem}>
            <Text>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setPrivacyPolicyVisible(true)}>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>

          {/* Terms of Service */}
          <View style={styles.settingItem}>
            <Text>Terms of Service</Text>
            <TouchableOpacity onPress={() => setPrivacyPolicyVisible(true)}>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal
        visible={isPrivacyPolicyVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyPolicyVisible(false)}
      >
        <PrivacyPolicyContent onClose={() => setPrivacyPolicyVisible(false)} />
      </Modal>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(navigation)}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  settingValue: {
    color: "#000",
  },
  settingAction: {
    color: "#007BFF",
    alignSelf: "center",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  privacyPolicyText: {
    marginVertical: 10,
    fontSize: 14,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: "center",
  },
  logoutButton: {
    bottom: 10,
    backgroundColor: "teal",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalBodyText: {
    margin: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  settingLabel: {
    color: "#555",
  },
});

export default SettingsScreen;