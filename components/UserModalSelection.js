// UserSelectionModal.js
import React, { useState, useEffect } from "react";
import { View, Modal, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";

const UserSelectionModal = ({ users, isVisible, onClose, onUserSelect }) => {
  const handleUserSelect = (userId) => {
    onUserSelect(userId);
    onClose();
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserSelect(item.id)}>
      <View style={styles.userItemContainer}>
        <Image source={item.avatar} style={styles.userItemAvatar} />
        <Text style={styles.userItemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Users</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userItemName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UserSelectionModal;
