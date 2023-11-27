// SlideshowScreen.js
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";

const SlideshowScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  const renderPost = () => {
    switch (post.type) {
      case "tweet":
        return (
          <View style={[styles.slide, styles.tweetItem]}>
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <View style={styles.twitterPostContainer}>
              <View style={styles.twitterUserInfo}>
                <Image
                  source={post.image}
                  style={styles.twitterProfilePicture}
                />
                <View>
                  <Text style={styles.twitterDisplayName}>Display Name</Text>
                  <Text style={styles.twitterUsername}>
                    @{post.username} • {post.date}
                  </Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
            </View>
          </View>
        );
      case "instagram":
        return (
          <View style={[styles.slide, styles.instagramItem]}>
            <View style={{ backgroundColor: "#fff", width: "100%" }}>
              <Ionicons
                name="logo-instagram"
                size={24}
                color="#E1306C"
                style={{ marginLeft: 5 }}
              />
            </View>
            <Image source={post.image} style={styles.postImage} />
            <View style={styles.postContentContainer}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDate}>{post.date}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
            </View>
          </View>
        );
      case "facebook":
        return (
          <View style={[styles.slide, styles.facebookItem]}>
            <View style={styles.facebookPostContainer}>
              <View style={styles.facebookPostHeader}>
                <Image
                  source={post.image}
                  style={styles.facebookProfilePicture}
                />
                <View style={styles.facebookPostHeaderInfo}>
                  <Text style={styles.facebookSenderName}>{post.title}</Text>
                  <Text style={styles.postDate}>{post.date}</Text>
                </View>
              </View>
              <View style={styles.postContentContainer}>
                <Text style={styles.postContent}>{post.content}</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons
        autoplay
        autoplayTimeout={5} // Adjust the timeout as needed (in seconds)
        onIndexChanged={handleIndexChanged}
      >
        {renderPost()}
      </Swiper>
      <View style={styles.overlay}>
        <Ionicons
          name="close"
          size={30}
          color="white"
          style={styles.closeIcon}
          onPress={() => navigation.navigate("Community")}
        />
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
  },
  postItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 8,
    backgroundColor: "#fff",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  tweetItem: {
    backgroundColor: "#1DA1F2",
  },
  instagramItem: {
    backgroundColor: "#DD3671",
  },
  facebookItem: {
    backgroundColor: "#1877F2",
  },
  postContentContainer: {
    marginLeft: 16,
    backgroundColor: "white",
    padding: 40,
    width: "100%",
    marginLeft: -1,
    alignSelf: "center",
  },
  postContent: {
    color: "#000",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
    marginBottom: 30,
  },
  closeIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: "#fff",
  },
  facebookMessageContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  facebookMessageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    color: "black",
  },
  facebookProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  facebookSenderName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  twitterPostContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 10,
    padding: 40,
    marginTop: 10,
  },
  twitterUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    color: "black",
  },
  twitterProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  twitterDisplayName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  twitterUsername: {
    color: "black",
  },
  facebookPostContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    margin:10,
  },
  facebookPostHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  facebookProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  facebookPostHeaderInfo: {
    flexDirection: "column",
  },
});

export default SlideshowScreen;
