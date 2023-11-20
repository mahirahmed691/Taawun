import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  FlatList,
  Image,
  ScrollView,
  Dimensions, // Import Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ForumListTab from "../components/ForumListTab";
import ExploreTab from "../components/ExploreTab";
import NotificationsTab from "../components/NotifcationsTab";
import MessagesTab from "../components/MessagesTab";
import styles from "../styles";

const CommunityScreen = ({ navigation }) => {
  const [forumName, setForumName] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [shouldKeepMenuOpen, setShouldKeepMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ForumList");
  const longPressTimeout = useRef(null);
  const [notificationCount, setNotificationCount] = useState(5);

  const [forums, setForums] = useState([
    // Initialize with 6 dummy items
    {
      id: "1",
      name: "Forum 1",
      description: "Description for Forum 1",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "2",
      name: "Forum 2",
      description: "Description for Forum 2",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "3",
      name: "Forum 3",
      description: "Description for Forum 3",
      date: new Date().toLocaleDateString(),
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: "1",
      type: "tweet",
      title: "Exciting news!",
      content: "Just launched my new product. Check it out!",
      date: "2023-11-17",
      image: require("../assets/logo.png"),
    },
    {
      id: "2",
      type: "instagram",
      title: "Moody Face",
      content: "The face Ive got whilst I code this app 🌅 #MoodyFace",
      date: "2023-11-16",
      image: require("../assets/sunset.jpeg"),
    },
    {
      id: "3",
      type: "facebook",
      title: "Fun day with friends",
      content: "Had a great time with friends at the amusement park!",
      date: "2023-11-15",
      image: require("../assets/logo.png"),
    },
    {
      id: "4",
      type: "tweet",
      title: "Exciting news!",
      content: "Just launched my new product. Check it out!",
      date: "2023-11-17",
      image: require("../assets/logo.png"),
    },
    {
      id: "5",
      type: "instagram",
      title: "Beautiful sunset",
      content: "Enjoying the sunset at the beach. 🌅 #Nature",
      date: "2023-11-16",
      image: require("../assets/sunset.jpeg"),
    },
    {
      id: "6",
      type: "facebook",
      title: "Fun day with friends",
      content: "Had a great time with friends at the amusement park!",
      date: "2023-11-15",
      image: require("../assets/logo.png"),
    },
  ]);

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
          <View
            style={{
              backgroundColor: "#f0f0f0",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          >
            <Ionicons
              name="mic-outline"
              size={20}
              color="#fff"
              borderRadius={20}
              style={buttonStyle}
            />
          </View>
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
          <View
            style={{
              backgroundColor: "#f0f0f0",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          >
            <Ionicons
              name="earth-outline"
              size={20}
              color="#fff"
              style={buttonStyle}
              onPress={() => navigation.navigate("People")}
            />
          </View>
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
          <View
            style={{
              backgroundColor: "#f0f0f0",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          >
            <Ionicons
              name="duplicate-outline"
              size={20}
              color="#fff"
              style={buttonStyle}
            />
          </View>
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

  const renderPost = ({ item, navigation }) => (
    <View style={styles.postContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Slideshow", { post: item });
        }}
      >
        {item.type === "tweet" && (
          <View style={[styles.postItem, styles.tweetItem]}>
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <View style={styles.postContentContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDate}>{item.date}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
          </View>
        )}

        {item.type === "instagram" && (
          <View style={[styles.postItem, styles.instagramItem]}>
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <View style={styles.postContentContainer}>
              <Image source={item.image} style={styles.postImage} />
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDate}>{item.date}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
          </View>
        )}

        {item.type === "facebook" && (
          <View style={[styles.postItem, styles.facebookItem]}>
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            <View style={styles.postContentContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDate}>{item.date}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = (
    activeTab,
    forums,
    posts,
    renderItem,
    navigation,
    notificationCount
  ) => {
    switch (activeTab) {
      case "ForumList":
        return <ForumListTab forums={forums} renderItem={renderItem} />;
      case "Feed":
        return (
          <FlatList
            data={posts}
            renderItem={({ item }) => renderPost({ item, navigation })}
            keyExtractor={(item) => item.id}
          />
        );
      case "Notifications":
        return <NotificationsTab notificationCount={notificationCount} />;
      case "Messages":
        return <MessagesTab />;
      default:
        return null;
    }
  };

  return (
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
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBarButton,
            activeTab === "Feed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Feed")}
        >
          <Ionicons
            name="newspaper-outline"
            size={24}
            color={activeTab === "Feed" ? "#fff" : "#000"}
            style={[
              styles.tabBarIcon,
              activeTab === "Feed" && styles.activeTabText,
            ]}
          />
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
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
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
            size={18}
            color={activeTab === "Messages" ? "#fff" : "#000"}
            style={[
              styles.tabBarIcon,
              activeTab === "Messages" && styles.activeTabText,
            ]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 50 }}>
        {renderTabContent(
          activeTab,
          forums,
          posts,
          renderItem,
          navigation,
          notificationCount
        )}
      </ScrollView>

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
  );
};

export default CommunityScreen;
