import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment"; // Import moment library
import { useAuth } from "../Auth/AuthContext";
import { updateDatabaseWithReply } from "../config/firebaseConfig"; // Import your database update function

const CommentDetailsScreen = ({ route }) => {
  const { comment, allowReply, onReply, onDelete } = route.params;
  const { user: authUser } = useAuth();
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);

  useEffect(() => {
    // If the comment object is updated externally, update the replies state
    setReplies(comment.replies || []);
  }, [comment.replies]);

  const replyToComment = async () => {
    if (newReply.trim() === "") {
      return;
    }

    // Add the reply if allowReply is true and authUser is not null
    if (allowReply && authUser) {
      const reply = {
        id: replies.length + 1, // You should generate a unique ID
        user: authUser.displayName,
        userAvatar: authUser.photoURL,
        text: newReply,
        date: new Date().toISOString(),
        userEmail: authUser.email,
      };

      // Update the UI with the new reply
      setReplies([...replies, reply]);

      try {
        // Update the database with the new reply
        await updateDatabaseWithReply(comment.id, reply);
        console.log("Database updated with reply:", reply);
      } catch (error) {
        console.error("Error updating database:", error);
      }

      // Notify the parent component about the new reply
      onReply(reply);
    }

    // Clear the input
    setNewReply("");
  };

  const deleteReply = (replyId) => {
    // Filter out the deleted reply
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);

    // Update the UI
    setReplies(updatedReplies);

    // You might want to notify the parent component about the deleted reply
    // onDeleteReply(replyId);
  };

  const deleteComment = async () => {
    console.log("Deleting comment with ID:", comment.id);
  
    try {
      // Call the onDelete function with the comment id
      if (onDelete) {
        await onDelete(comment.id);
        // Uncomment the following line if you want to navigate back
        // navigation.goBack(); // Example: navigate back after deleting
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = moment();
    const commentTimestamp = moment(timestamp);
    const diffMinutes = now.diff(commentTimestamp, "minutes");
    const diffHours = now.diff(commentTimestamp, "hours");

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.commentCard}>
        <Card.Title
          titleStyle={{ fontWeight: "700" }}
          title={comment.user}
          subtitle={comment.text}
          left={(props) => (
            <Avatar.Image {...props} source={{ uri: comment.userAvatar }} />
          )}
        />
        <Card.Content>
          <Text style={styles.dateText}>{formatTimeAgo(comment.date)}</Text>
        </Card.Content>
        {authUser && authUser.email === comment.userEmail && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => deleteComment(comment.id)}
              style={styles.deleteButton}
            >
              <Text>Delete</Text>
              <Ionicons name="trash-bin" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* Display replies to the selected comment */}
      {replies && replies.length > 0 && (
        <ScrollView style={styles.repliesContainer}>
          {replies.map((reply) => (
            <Card key={reply.id} style={styles.replyCard}>
              <Card.Content>
                {authUser && authUser.email === reply.userEmail && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => deleteReply(reply.id)}
                      style={styles.deleteButton}
                    >
                      <Text>Delete</Text>
                      <Ionicons name="trash-bin" size={14} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              </Card.Content>
              <Card.Title
                title={reply.user}
                subtitle={reply.text}
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: reply.userAvatar }} />
                )}
              />
              <Card.Content>
                <Text style={styles.dateText}>{formatTimeAgo(reply.date)}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {allowReply && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reply to the comment"
            value={newReply}
            onChangeText={(text) => setNewReply(text)}
          />
          <TouchableOpacity onPress={replyToComment} style={styles.replyButton}>
            <Ionicons name="send" size={12} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  commentCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  deleteButton: {
    marginTop: 10,
    borderColor: "red",
  },
  repliesContainer: {
    marginTop: 10,
    maxHeight: 150, // Set a max height for the ScrollView
  },
  repliesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  replyCard: {
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
  },
  replyContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  replyButton: {
    backgroundColor: "#00cbaf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    width: 50,
    height: 40,
  },
  replyButtonText: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});

export default CommentDetailsScreen;