// FeedScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../styles";

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const sampleData = [
    {
      id: 2,
      description: "Syrian-American hip-hop artist and peace advocate.",
      name: "Omar Offendum",
      socialMedia: {
        twitter: "@Offendum",
        instagram: "@offendum",
        facebook: "/offendum",
        tiktok: "/AhedTamimiOfficial",
      },
      image: require("../assets/logo.png"),
    },
    {
      id: 3,
      description:
        "Palestinian activist known for her role in the resistance movement.",
      name: "Ahed Tamimi",
      socialMedia: {
        twitter: "@AhedTamimiReal",
        instagram: "@ahedtamimi",
        facebook: "/AhedTamimiOfficial",
        tiktok: "/AhedTamimiOfficial",
      },
      image: require("../assets/logo.png"),
    },
    {
      id: 4,
      description:
        "Palestinian-American political activist and co-chair of the Women's March.",
      name: "Linda Sarsour",
      socialMedia: {
        twitter: "@lsarsour",
        instagram: "@lsarsour",
        facebook: "/linda.sarsour",
        tiktok: "/AhedTamimiOfficial",
      },
      image: require("../assets/logo.png"),
    },
    {
      id: 5,
      description:
        "American academic, author, and activist known for his advocacy of Palestinian rights.",
      name: "Marc Lamont Hill",
      socialMedia: {
        twitter: "@marclamonthill",
        instagram: "@marclamonthill",
        facebook: "/marclamonthill",
        tiktok: "/AhedTamimiOfficial",
      },
      image: require("../assets/logo.png"),
    },
    {
      id: 6,
      description:
        "British-Bengali who uses coding skills to support Palestine.",
      name: "Mahir Ahmned",
      socialMedia: {
        twitter: "@marclamonthill",
        instagram: "@marclamonthill",
        facebook: "/marclamonthill",
        tiktok: "/AhedTamimiOfficial",
      },
      image: require("../assets/logo.png"),
    },
  ];

  useEffect(() => {
    setPosts(sampleData);
  }, []);

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.timelineItem}
      onPress={() => {
        navigation.navigate("FromTheRiver", {
          screen: "Slide",
          params: {
            post: item,
          },
        });
      }}
    >
      <View style={styles.timelineContentContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={item.image} style={styles.postImage} />
            <Text style={styles.postTitle}>{item.name}</Text>
          </View>
          <View style={styles.socialMediaContainer}>
            {Object.entries(item.socialMedia).map(([platform, handle]) => (
              <View key={platform} style={styles.socialMediaIconContainer}>
                {getSocialMediaIcon(platform)}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.postDescription}>{item.description}</Text>

        <View style={styles.likeCommentContainer}>
          <TouchableOpacity onPress={() => handleLike(item)}>
            <Ionicons
              name={item.isLiked ? "heart" : "heart-outline"}
              size={24}
              color={item.isLiked ? "red" : "#333"}
              style={styles.likeIcon}
            />
          </TouchableOpacity>
          <Text>{item.likes} likes</Text>
          <TouchableOpacity onPress={() => handleComment(item)}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color="#333"
              style={styles.commentIcon}
            />
          </TouchableOpacity>
          <Text>{item.comments ? item.comments.length : 0} comments</Text>
        </View>

        {item.comments && item.comments.length > 0 && (
          <ScrollView style={styles.commentContainer}>
            {item.comments.map((comment, index) => (
              <Text key={index} style={styles.commentText}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>:{" "}
                {comment.text}
              </Text>
            ))}
          </ScrollView>
        )}

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentInput}
            onChangeText={(text) => setCommentInput(text)}
          />
          <TouchableOpacity onPress={() => handleAddComment(item)}>
            <Ionicons
              name="paper-plane-outline"
              size={24}
              color="#333"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getSocialMediaIcon = (platform) => {
    const iconStyle = { marginRight: 5, marginBottom: 2 };

    switch (platform) {
      case "twitter":
        return (
          <Ionicons
            name="logo-twitter"
            size={24}
            color="#000"
            style={iconStyle}
          />
        );
      case "instagram":
        return (
          <Ionicons
            name="logo-instagram"
            size={24}
            color="#E1306C"
            style={iconStyle}
          />
        );
      case "facebook":
        return (
          <Ionicons
            name="logo-facebook"
            size={24}
            color="#1877F2"
            style={iconStyle}
          />
        );
      case "tiktok":
        return (
          <FontAwesome5
            name="tiktok"
            size={24}
            color="#000"
            style={iconStyle}
          />
        );
      default:
        return (
          <Ionicons name="md-globe" size={24} color="#333" style={iconStyle} />
        );
    }
  };

  const handleLike = (post) => {
    post.isLiked = !post.isLiked;
    setPosts([...posts]);
  };

  const handleComment = (post) => {
    console.log("View comments for post", post);
  };

  const handleAddComment = (post) => {
    if (commentInput.trim() !== "") {
      post.comments = [
        ...(post.comments || []),
        { author: "User", text: commentInput },
      ];
      setCommentInput("");
      setPosts([...posts]);
    }
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => renderPost({ item })}
      keyExtractor={(item) => item.id.toString()}
      style={styles.feedList}
    />
  );
};

export default FeedScreen;