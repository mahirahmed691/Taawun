import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const NotificationItem = ({ item, onDelete }) => (
  <View style={styles.notificationItem}>
    <Text style={styles.notificationMessage}>{item.message}</Text>
    <Text style={styles.notificationTime}>{item.time}</Text>
    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const NotificationsTab = ({ notificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Create as many notifications as the badge count
    const newNotifications = Array.from({ length: notificationCount }, (_, index) => ({
      id: index + 1,
      message: `New notification ${index + 1}`,
      time: "Just now",
    }));
    
    setNotifications(newNotifications);
  }, [notificationCount]);

  const handleDelete = (id) => {
    const updatedNotifications = notifications.filter((item) => item.id !== id);
    setNotifications(updatedNotifications);
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationItem item={item} onDelete={handleDelete} />}
      />
      {notifications.length > 0 && (
        <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteAllButton}>
          <Text style={styles.deleteAllButtonText}>Delete All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  badgeContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ff6961",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    color: "#fff",
    fontWeight: "bold",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationMessage: {
    fontSize: 12,
    marginBottom: 8,
  },
  notificationTime: {
    color: "#777",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#ff6961",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
  },
  deleteAllButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#ff6961",
    borderRadius: 4,
    alignItems: "center",
  },
  deleteAllButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NotificationsTab;
