import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";

const CommunityScreen = () => {
  const [forumName, setForumName] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [forums, setForums] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const forumListRef = useRef(null);

  const createForum = () => {
    if (forumName.trim() === "") {
      // Prevent creating an empty forum
      return;
    }

    // Update the forums list
    setForums((prevForums) => [
      ...prevForums,
      {
        id: Date.now().toString(),
        name: forumName,
        description: forumDescription,
        date: new Date().toLocaleDateString(),
      },
    ]);
    // Clear the input fields
    setForumName("");
    setForumDescription("");
    // Close the modal
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.forumItem}>
      <Text style={styles.forumTitle}>{item.name}</Text>
      <Text style={styles.forumDescription}>{item.description}</Text>
      <Text style={styles.forumDate}>Created on: {item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Community Forums</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        ref={forumListRef}
        data={forums}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.forumList}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Create a Forum</Text>

            <TouchableOpacity style={styles.createButton} onPress={createForum}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Forum Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter forum title"
              value={forumName}
              onChangeText={(text) => setForumName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter forum description"
              value={forumDescription}
              onChangeText={(text) => setForumDescription(text)}
              multiline
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "black",
    borderRadius: 25, // Half of the width and height to make it round
    width: 50,
    height: 50,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forumList: {
    width: "100%",
  },
  forumItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  forumDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  forumDate: {
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CommunityScreen;
