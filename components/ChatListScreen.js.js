import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserStatus from "../components/userStatus";
import Swipeable from "react-native-gesture-handler/Swipeable";
import styles from "../styles";
import { ScrollView } from "react-native-gesture-handler";

// Dummy user data for stories
const users = [
  {
    id: 1,
    name: "Mahfuz",
    avatar:
      "https://cdn.vox-cdn.com/thumbor/Yc2Lc8sDhNbb88mA_TkdYjkxGtk=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22728302/rev_1_SJM_FP_0012_High_Res_JPEG.jpeg",
    onlineStatus: true,
  },
  {
    id: 2,
    name: "Nasir",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkSTh62nQjyTwVKST7waMaMkco4dTXFcyybg&usqp=CAU", // Replace with the actual URL
    onlineStatus: false,
  },
  {
    id: 3,
    name: "Sayeed",
    avatar:
      "data:image/jpeg;base64,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", // Replace with the actual URL
    onlineStatus: true,
  },
  {
    id: 4,
    name: "Rifaat",
    avatar:
      "https://t3.ftcdn.net/jpg/04/32/24/08/360_F_432240885_U5v0N3PaSG4echxjah4OkgpaSFwQdkpx.jpg ", // Replace with the actual URL
    onlineStatus: true,
  },
];

const ChatListItem = ({ user, chat, onPress, onLongPress, onSwipeDelete }) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.swipeDeleteContainer}
            onPress={onSwipeDelete}
          >
            <Ionicons name="md-trash" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      >
        <View style={styles.userChatContainer}>
          <Image source={{ uri: user.avatar }} style={styles.userChatAvatar} />
          <View style={styles.userChatContent}>
            <View style={styles.nameAndStatus}>
              <Text style={styles.userChatName}>{user.name}</Text>
              <UserStatus
                onlineStatus={user.onlineStatus}
                lastSeen={chat.lastSeen}
              />
            </View>
            <Text style={styles.lastMessage}>
              {chat.messages && chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1]
                : "No messages"}
            </Text>
          </View>
          {chat.unreadMessages > 0 && (
            <View style={styles.badgeContainer}>
              <TouchableOpacity onPress={() => handleBadgePress(chat.userId)}>
                <Ionicons
                  name="md-mail-unread"
                  size={18}
                  color="#000"
                  style={styles.unreadIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.lastMessageTime}>
            {chat.lastMessageTime &&
              chat.lastMessageTime.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
          </Text>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

const ChatListScreen = () => {
  const [userChats, setUserChats] = useState([]);
  const [filteredUserChats, setFilteredUserChats] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupSettings, setGroupSettings] = useState({
    private: false,
    notifications: true,
  });

  const navigation = useNavigation();

  useEffect(() => {
    // Simulate fetching user chat messages
    const dummyUserChats = [
      {
        userId: 1,
        messages: ["Hello!", "How are you?"],
        lastMessageTime: new Date(),
        unreadMessages: 1,
        lastSeen: "a moment ago",
      },
      {
        userId: 2,
        messages: ["Hi!", "I'm good, thanks!"],
        lastMessageTime: new Date(),
        unreadMessages: 0,
        lastSeen: "2 hours ago",
      },
      {
        userId: 3,
        messages: ["Hey!", "What's up?"],
        lastMessageTime: new Date(),
        unreadMessages: 2,
        lastSeen: "yesterday",
      },
      {
        userId: 4,
        messages: ["Hey!", "What's up?"],
        lastMessageTime: new Date(),
        unreadMessages: 2,
        lastSeen: "yesterday",
      },
    ];

    const sortedChats = [...dummyUserChats].sort(
      (a, b) => b.lastMessageTime - a.lastMessageTime
    );
    setUserChats(sortedChats);
    setFilteredUserChats(sortedChats);
  }, []);

  const handleChatPress = (userId, userName, onlineStatus) => {
    navigation.navigate("FromTheRiver", {
      screen: "ChatDetail",
      params: {
        userId: userId,
        userName: userName,
        onlineStatus: onlineStatus,
      },
    });
  };

  const handleMenuOptionPress = (option) => {
    if (option === "createGroup") {
      setIsModalVisible(true);
    } else if (option === "inviteUsers") {
      console.log("Inviting users...");
    }
  };

  const handleChatLongPress = (userId) => {
    console.log(`Long pressed on chat with user ID: ${userId}`);
  };

  const handleBadgePress = (userId) => {
    console.log(`Badge pressed on chat with user ID: ${userId}`);
  };

  const handleCreateGroup = () => {
    setIsModalVisible(true);
  };

  const handleCreateGroupOption = (option) => {
    if (option === "createGroup") {
      setIsModalVisible(true);
    } else if (option === "inviteUsers") {
      console.log("Inviting users...");
    }
  };

  const handleSearch = (query) => {
    console.log("Query:", query);
    const lowerCaseQuery = query.toLowerCase();
    console.log("LowerCaseQuery:", lowerCaseQuery);

    const filteredChats = userChats.filter((chat) =>
      users[chat.userId - 1].name.toLowerCase().includes(lowerCaseQuery)
    );
    console.log("FilteredChats:", filteredChats);

    setFilteredUserChats(filteredChats);
    setSearchQuery(query);
  };

  const handleGroupSettingsChange = (setting) => {
    setGroupSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSwipeDelete = (userId) => {
    const updatedChats = userChats.filter((chat) => chat.userId !== userId);
    setUserChats(updatedChats);
    setFilteredUserChats(updatedChats);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUsers([]);
  };

  const handleModalConfirm = () => {
    console.log("Selected Users:", selectedUsers);
    console.log("Group Name:", groupName);
    console.log("Group Settings:", groupSettings);

    setIsModalVisible(false);
    setSelectedUsers([]);
    setGroupName("");
    setGroupSettings({
      private: false,
      notifications: true,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <TouchableOpacity
          style={styles.menuBarButton}
          onPress={handleCreateGroup}
        >
          <Ionicons name="md-person-add" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.menuBarButton}
            onPress={() => console.log("Status Filter Pressed")}
          >
            <Ionicons name="md-options" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuBarButton}
            onPress={() => console.log("Sort Options Pressed")}
          >
            <Ionicons name="md-funnel" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuBarButton}
            onPress={() => setNotificationsEnabled((prev) => !prev)}
          >
            <Ionicons
              name={
                notificationsEnabled
                  ? "md-notifications"
                  : "md-notifications-off"
              }
              size={20}
              color={notificationsEnabled ? "crimson" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        placeholderTextColor="black"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <Text style={{ fontSize: 20, fontWeight: "900", marginLeft: 15 }}>
        Chats
      </Text>

      <FlatList
        data={filteredUserChats}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <ChatListItem
            user={users[item.userId - 1]}
            chat={item}
            onPress={() =>
              handleChatPress(
                item.userId,
                users[item.userId - 1].name,
                users[item.userId - 1].onlineStatus
              )
            }
            onLongPress={() => handleChatLongPress(item.userId)}
            onSwipeDelete={() => handleSwipeDelete(item.userId)}
          />
        )}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Group Name"
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />

            <View style={styles.groupSettingsContainer}>
              <TouchableOpacity
                style={styles.groupSettingOption}
                onPress={() => handleGroupSettingsChange("private")}
              >
                <Ionicons
                  name={
                    groupSettings.private ? "md-lock-open" : "md-lock-closed"
                  }
                  size={24}
                  color="#3498db"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.groupSettingOption}
                onPress={() => handleGroupSettingsChange("notifications")}
              >
                <Ionicons
                  name={
                    groupSettings.notifications
                      ? "md-notifications"
                      : "md-notifications-off"
                  }
                  size={24}
                  color="#3498db"
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalUserItem,
                    { backgroundColor: pressed ? "#ddd" : "#fff" },
                  ]}
                  onPress={() => {
                    setSelectedUsers((prevUsers) =>
                      prevUsers.includes(item.id)
                        ? prevUsers.filter((userId) => userId !== item.id)
                        : [...prevUsers, item.id]
                    );
                  }}
                >
                  <Image source={item.avatar} style={styles.modalUserAvatar} />
                  <Text style={styles.modalUserName}>{item.name}</Text>
                  {selectedUsers.includes(item.id) && (
                    <Ionicons
                      name="md-checkmark-circle"
                      size={24}
                      color="#3498db"
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalConfirm}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatListScreen;
