import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import ForumListTab from "../components/ForumListTab";
import PrayerTab from "../components/PrayerTab";
import NotificationsTab from "../components/NotifcationsTab";
import MessagesTab from "../components/MessagesTab";
import styles from "../styles";
import { firestore, db } from "../config/firebaseConfig";
import { useAuth } from '../Auth/AuthContext'; 

const CommunityScreen = ({ navigation }) => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [keywords, setKeywords] = useState("");
  const [forumName, setForumName] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [shouldKeepMenuOpen, setShouldKeepMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ForumList");
  const longPressTimeout = useRef(null);
  const [notificationCount, setNotificationCount] = useState(5);
  const [dismissableKeywords, setDismissableKeywords] = useState([]);
  const [likedTweets, setLikedTweets] = useState({});
  const [bookmarkedForums, setBookmarkedForums] = useState([]);

  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const forumsCollection = collection(firestore, "forums");

    const unsubscribeForums = onSnapshot(forumsCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Forums from Firestore:", data);
      setForums(data); // Update the forums state
    });

    return () => {
      unsubscribeForums();
    };
  }, []);

  const createForum = () => {
    // Validation
    if (forumName.trim() === "") {
      return;
    }

    // Create new forum data
    const newForum = {
      name: forumName,
      description: forumDescription,
      date: new Date().toLocaleDateString(),
    };

    // Add the new forum to Firestore
    addDoc(collection(db, "forums"), newForum)
      .then((docRef) => {
        console.log("Forum added successfully with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding forum: ", error);
      });

    // Clear local state
    setForumName("");
    setForumDescription("");
    setIsModalVisible(false);
    setIsLongPressActive(false);
    setShouldKeepMenuOpen(false);
  };

  const handleLongPress = () => {
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressActive(true);
      Vibration.vibrate(500);
    }, 500);
  };

  const handleKeywordPress = (keyword) => {
    setDismissableKeywords((prevKeywords) =>
      prevKeywords.filter((k) => k !== keyword)
    );
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
      setIsModalVisible(true); // Open the modal
    }
  };

  const renderLongPressMenu = () => {
    const buttonStyle = {
      color: "#094349",
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#094349",
      padding: 14,
    };

    const handleLikePress = (tweetId) => {
      // Toggle the liked status for the tweet
      setLikedTweets((prevLikedTweets) => {
        const updatedLikedTweets = { ...prevLikedTweets };
        updatedLikedTweets[tweetId] = !updatedLikedTweets[tweetId];
        return updatedLikedTweets;
      });

      // Vibrate to provide feedback (you can customize this)
      Vibration.vibrate(200);
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
              onPress={() =>
                navigation.navigate("FromTheRiver", {
                  screen: "Influencer",
                })
              }
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FromTheRiver", {
              screen: "Comment",
              params: {
                forum: item,
                user: user,
              },
            })
          }
        >
          <Ionicons name="chatbox-outline" size={20} color="#111" />
        </TouchableOpacity>

        <Ionicons
          name={likedTweets[item.id] ? "flame" : "flame-outline"}
          size={24}
          color={likedTweets[item.id] ? "orange" : "#111"}
          onPress={() => handleLikePress(item.id)}
        />
        <Ionicons
          name="bookmarks-outline"
          size={20}
          color={bookmarkedForums.includes(item.id) ? "tomato" : "#111"}
          onPress={() => handleBookmarkPress(item.id)}
        />
        <Ionicons name="share-social-outline" size={20} color="#111" />
      </View>
    </View>
  );

  const handleLikePress = (tweetId) => {
    // Toggle the liked status for the tweet
    setLikedTweets((prevLikedTweets) => {
      const updatedLikedTweets = { ...prevLikedTweets };
      updatedLikedTweets[tweetId] = !updatedLikedTweets[tweetId];
      return updatedLikedTweets;
    });

    // Vibrate to provide feedback (you can customize this)
    Vibration.vibrate(200);
  };

  const handleBookmarkPress = (forumId) => {
    // Check if the forum is already bookmarked
    const isBookmarked = bookmarkedForums.includes(forumId);

    // Toggle the bookmark status
    const updatedBookmarkedForums = isBookmarked
      ? bookmarkedForums.filter((id) => id !== forumId)
      : [...bookmarkedForums, forumId];

    // Update the state with the new bookmarked forums
    setBookmarkedForums(updatedBookmarkedForums);

    // Vibrate to provide feedback (you can customize this)
    Vibration.vibrate(200);
  };
  const renderPost = ({ item, navigation }) => (
    <View style={styles.postContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FromTheRiver", {
            screen: "Slide",
            params: {
              post: item,
            },
          });
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
            keyExtractor={(item) => item.id.toString()}
          />
        );
      case "Notifications":
        return <NotificationsTab notificationCount={notificationCount} />;
      case "Messages":
        return <MessagesTab />;
      case "Prayer":
        return <PrayerTab />;
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
            color={activeTab === "ForumList" ? "tomato" : "#094349"}
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
            color={activeTab === "Feed" ? "#fff" : "#094349"}
            style={[
              styles.tabBarIcon,
              activeTab === "Feed" && styles.activeTabText,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBarButton,
            activeTab === "Prayer" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Prayer")}
        >
          <Ionicons
            name="moon-outline"
            size={24}
            color={activeTab === "Prayer" ? "#fff" : "#094349"}
            style={[
              styles.tabBarIcon,
              activeTab === "Prayer" && styles.activeTabText,
            ]}
          />
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
            color={activeTab === "Messages" ? "#fff" : "#094349"}
            style={[
              styles.tabBarIcon,
              activeTab === "Messages" && styles.activeTabText,
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
            color={activeTab === "Notifications" ? "#fff" : "#094349"}
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
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 50 }}>
        {renderTabContent(
          activeTab,
          forums,
          posts, // Pass the posts data
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
              name="add"
              size={30}
              color="#111"
              onPress={() => {
                setIsModalVisible(true);
                createForum(); // Call the createForum function when the "Add" button is pressed
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Forum Title:</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter a descriptive title for your forum"
              placeholderTextColor="#333"
              value={forumName}
              onChangeText={(text) => setForumName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              mode="outlined"
              style={[styles.input, styles.multilineInput]}
              placeholderTextColor="#333"
              placeholder="Provide a brief description of your forum"
              value={forumDescription}
              onChangeText={(text) => setForumDescription(text)}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Keywords:</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter keywords (comma-separated)"
              placeholderTextColor="#333"
              value={keywords}
              onChangeText={(text) => setKeywords(text)}
              onSubmitEditing={() => {
                setDismissableKeywords((prevKeywords) => [
                  ...prevKeywords,
                  keywords.trim(),
                ]);
                setKeywords("");
              }}
            />
          </View>

          <View style={styles.keywordsContainer}>
            <Text style={styles.label}>Selected Keywords:</Text>
            <FlatList
              data={dismissableKeywords}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleKeywordPress(item)}>
                  <View style={styles.dismissableKeyword}>
                    <Text style={styles.keywordText}>{item}</Text>
                    <Ionicons name="close-circle" size={20} color="red" />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityScreen;
