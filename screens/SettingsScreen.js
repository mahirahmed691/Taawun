import React from "react";
import { SafeAreaView, ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Settings</Text>

          <View style={styles.settingItem}>
            <Text>Push Notifications</Text>
            <Switch value={true} />
          </View>

          <View style={styles.settingItem}>
            <Text>Dark Mode</Text>
            <Switch value={false} />
          </View>

          <View style={styles.settingItem}>
            <Text>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Settings</Text>

          <View style={styles.settingItem}>
            <Text>Change Password</Text>
            <TouchableOpacity>
              <Text style={styles.settingAction}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <Text>Email Notifications</Text>
            <Switch value={true} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>App Information</Text>

          <View style={styles.settingItem}>
            <Text>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <Text>Privacy Policy</Text>
            <TouchableOpacity>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <Text>Terms of Service</Text>
            <TouchableOpacity>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
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
    color: "#555",
  },
  settingAction: {
    color: "#007BFF",
  },
});

export default SettingsScreen;
