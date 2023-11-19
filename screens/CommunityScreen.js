import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ForumListTab = ({ forums, renderItem }) => (
  <FlatList
    data={forums}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    style={styles.forumList}
  />
);

const ExploreTab = () => (
  <View>
    {/* Content for Explore Tab */}
    <Text>Explore Tab</Text>
  </View>
);

const NotificationsTab = () => (
  <View>
    {/* Content for Notifications Tab */}
    <Text>Notifications Tab</Text>
  </View>
);

const MessagesTab = () => (
  <View>
    {/* Content for Messages Tab */}
    <Text>Messages Tab</Text>
  </View>
);

const CommunityScreen = ({ navigation }) => {
  const [forumName, setForumName] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [forums, setForums] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [shouldKeepMenuOpen, setShouldKeepMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ForumList");
  const longPressTimeout = useRef(null);

  const createForum = () => {
    if (forumName.trim() === "") {
      return;
    }

    const newForum = {
      id: Date.now().toString(),
      name: forumName,
      description: forumDescription,
      date: new Date().toLocaleDateString(),
    };

    setForums((prevForums) => [...prevForums, newForum]);

    setForumName("");
    setForumDescription("");

    setIsModalVisible(false);
    setIsLongPressActive(false);
    setShouldKeepMenuOpen(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleLongPress = () => {
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressActive(true);
      Vibration.vibrate(500);
    }, 500);
  };

  const handlePressOut = () => {
    clearTimeout(longPressTimeout.current);
    if (!shouldKeepMenuOpen) {
      setIsLongPressActive(false);
    }
  };

  const closeLongPressMenu = () => {
    setShouldKeepMenuOpen(false);
    setIsLongPressActive(false);
  };

  const handleCreateButtonPress = () => {
    if (isLongPressActive) {
      closeLongPressMenu();
    } else {
      openModal();
    }
  };

  const renderLongPressMenu = () => {
    const buttonStyle = {
      color: "tomato",
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "black",
      overflow: "hidden",
      padding: 14,
    };

    return (
      <View style={styles.longPressMenu}>
        <TouchableOpacity
          style={[
            styles.longPressMenuItem,
            { position: "absolute", bottom: 20, right: 55 },
          ]}
          onPress={() => {
            console.log("Like pressed");
            Vibration.vibrate(200);
          }}
        >
          <Ionicons
            name="mic-outline"
            size={20}
            color="#fff"
            style={buttonStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.longPressMenuItem,
            { position: "absolute", bottom: 80, right: 30 },
          ]}
          onPress={() => {
            console.log("Comment pressed");
            Vibration.vibrate(200);
          }}
        >
          <Ionicons
            name="earth-outline"
            size={20}
            color="#fff"
            style={buttonStyle}
            onPress={() => navigation.navigate("People")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.longPressMenuItem,
            { position: "absolute", bottom: 105, right: -25 },
          ]}
          onPress={() => {
            console.log("Share pressed");
            Vibration.vibrate(200);
          }}
        >
          <Ionicons
            name="duplicate-outline"
            size={20}
            color="#fff"
            style={buttonStyle}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.forumItem}>
      <Text style={styles.forumTitle}>{item.name}</Text>
      <Text style={styles.forumDate}>{item.date}</Text>
      <Text style={styles.forumDescription}>{item.description}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Ionicons name="chatbox-outline" size={20} color="#111" />
        <Ionicons name="flame-outline" size={20} color="#111" />
        <Ionicons name="bookmarks-outline" size={20} color="#111" />
        <Ionicons name="share-social-outline" size={20} color="#111" />
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "ForumList":
        return <ForumListTab forums={forums} renderItem={renderItem} />;
      case "Explore":
        return <ExploreTab />;
      case "Notifications":
        return <NotificationsTab />;
      case "Messages":
        return <MessagesTab />;
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeLongPressMenu}>
      <SafeAreaView style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabBarButton,
              activeTab === "ForumList" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("ForumList")}
          >
            <Ionicons
              name="chatbox-outline"
              size={24}
              color={activeTab === "ForumList" ? "tomato" : "#000"}
              style={[
                styles.tabBarIcon,
                activeTab === "ForumList" && styles.activeTabText,
              ]}
            />
            <Text
              style={[
                {
                  color: activeTab === "ForumList" ? "tomato" : "#000",
                  fontSize: activeTab === "ForumList" ? 16 : 14,
                },
                activeTab === "ForumList" && styles.activeTabText,
              ]}
            >
              Forums
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={[
    styles.tabBarButton,
    activeTab === "Explore" && styles.activeTab,
  ]}
  onPress={() => setActiveTab("Explore")}
>
  <Ionicons
    name="search-outline"
    size={24}
    color={activeTab === "Explore" ? "#fff" : "#000"}
    style={[styles.tabBarIcon, activeTab === "Explore" && styles.activeTabText]}
  />
  <Text
    style={[
      {
        color: activeTab === "Explore" ? "#fff" : "#000",
        fontSize: activeTab === "Explore" ? 16 : 14,
      },
      activeTab === "Explore" && styles.activeTabText,
    ]}
  >
    Explore
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.tabBarButton,
    activeTab === "Notifications" && styles.activeTab,
  ]}
  onPress={() => setActiveTab("Notifications")}
>
  <Ionicons
    name="notifications-outline"
    size={24}
    color={activeTab === "Notifications" ? "#fff" : "#000"}
    style={[
      styles.tabBarIcon,
      activeTab === "Notifications" && styles.activeTabText,
    ]}
  />
  <Text
    style={[
      {
        color: activeTab === "Notifications" ? "#fff" : "#000",
        fontSize: activeTab === "Notifications" ? 16 : 14,
      },
      activeTab === "Notifications" && styles.activeTabText,
    ]}
  >
    Notifications
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.tabBarButton,
    activeTab === "Messages" && styles.activeTab,
  ]}
  onPress={() => setActiveTab("Messages")}
>
  <Ionicons
    name="mail-outline"
    size={24}
    color={activeTab === "Messages" ? "#fff" : "#000"}
    style={[styles.tabBarIcon, activeTab === "Messages" && styles.activeTabText]}
  />
  <Text
    style={[
      {
        color: activeTab === "Messages" ? "#fff" : "#000",
        fontSize: activeTab === "Messages" ? 16 : 14,
      },
      activeTab === "Messages" && styles.activeTabText,
    ]}
  >
    Messages
  </Text>
</TouchableOpacity>

        </View>

        {renderTabContent()}

        <TouchableWithoutFeedback
          onPress={handleCreateButtonPress}
          onLongPress={() => {
            handleLongPress();
            setShouldKeepMenuOpen(true);
          }}
          onPressOut={handlePressOut}
        >
          <View
            style={[
              styles.createButton,
              {
                backgroundColor: isLongPressActive ? "black" : "tomato",
                width: isLongPressActive ? 45 : 50,
                height: isLongPressActive ? 45 : 50,
              },
            ]}
          >
            <Ionicons
              name={isLongPressActive ? "close" : "add"}
              size={isLongPressActive ? 24 : 30}
              color="#fff"
            />
            {isLongPressActive && renderLongPressMenu()}
          </View>
        </TouchableWithoutFeedback>

        <Modal visible={isModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Ionicons
                name="close"
                size={30}
                color="black"
                onPress={() => setIsModalVisible(false)}
              />

              <Ionicons
                name="create"
                size={30}
                color="tomato"
                onPress={createForum}
              />
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "tomato",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  forumList: {
    flex: 1,
    width: "100%",
  },
  forumItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 10,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  forumDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  forumDescription: {
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  modalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  longPressMenu: {
    position: "absolute",
    bottom: 0,
    right: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    flexDirection: "column",
    alignItems: "flex-end",
    zIndex: 2,
  },
  longPressMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  longPressMenuItemText: {
    marginLeft: 5,
    color: "#000",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    
  },
  tabBarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor:'#f0f0f0'
  },
  tabBarIcon: {
    marginRight: 5,
  },
  activeTab: {
    backgroundColor: "#000", 

  },
  activeTabText: {
    color: "tomato", 
    fontSize: 16,
  },
});

export default CommunityScreen;
