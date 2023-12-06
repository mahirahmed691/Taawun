import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const CommentList = ({
  comments,
  onDeleteComment,
  onDeleteReply,
  onReply,
  handleReply,
  handleDelete,
}) => {
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  const renderActionButton = (comment, iconName, iconColor, onPress) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.iconButton}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </TouchableOpacity>
    );
  };

  const handleReplyPress = (commentId) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      handleReply(comment);
    }
  };

  const renderReplies = (parentCommentId) => {
    const replies = comments.filter(
      (comment) => comment.parentCommentId === parentCommentId
    );

    if (replies.length === 0) {
      return null;
    }

    return (
      <KeyboardAvoidingView style={styles.repliesContainer}>
        {replies.map((reply) => (
          <Card key={reply.id} style={styles.replyCard}>
            <Card.Title
              title={reply.user}
              subtitle={reply.text}
              left={(props) => (
                <Avatar.Image {...props} source={{ uri: reply.userAvatar }} />
              )}
            />
            <Card.Content>
              <Text style={styles.dateText}>
                {moment(reply.date).fromNow()}
              </Text>
            </Card.Content>
            <View style={styles.buttonContainer}>
              {renderActionButton(reply, "trash-bin", "#E0245E", () =>
                onDeleteReply(reply.id)
              )}
              {renderActionButton(reply, "ios-share", "#1DA1F2", () =>
                handleReplyPress(reply.id)
              )}
              {renderActionButton(reply, "ios-share", "#009688", () => {})}
              {renderActionButton(reply, "ios-arrow-up", "#009688", () => {})}
            </View>
            {renderReplies(reply.id)}
          </Card>
        ))}
      </KeyboardAvoidingView>
    );
  };

  const handleCommentPress = (comment) => {
    console.log("Navigating to CommentDetails with comment:", comment);
    navigation.navigate("CommentDetails", {
      comment,
      allowReply: true,
      onReply,
      onDelete: onDeleteComment,
      handleReply,
      handleDelete,
    });
  };

  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <TouchableOpacity
          key={comment.id}
          onPress={() => handleCommentPress(comment)}
        >
          <Card style={styles.commentCard}>
            <Card.Content>
              <Text style={styles.dateText}>
                {moment(comment.date).fromNow()}
              </Text>
            </Card.Content>
            <Card.Title
              title={comment.user}
              subtitle={comment.text}
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardSubtitle}
              left={(props) => (
                <Avatar.Image {...props} source={{ uri: comment.userAvatar }} />
              )}
            />
            <View style={styles.buttonContainer}>
              {renderActionButton(comment, "trash-bin", "#E0245E", () =>
                onDeleteComment(comment.id)
              )}
              {renderActionButton(comment, "chatbox", "#1DA1F2", () =>
                handleReplyPress(comment.id)
              )}
              {renderActionButton(comment, "ios-share", "#009688", () => {})}
              {renderActionButton(
                comment,
                "ios-analytics",
                "#000000",
                () => {}
              )}
            </View>
            {renderReplies(comment.id)}
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  commentCard: {
    marginBottom: 5,
    borderRadius: 16,
    margin: 10,
    paddingBottom: 20,
    padding: 2.5,
    backgroundColor: "#f0f8ff",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#555",
  },
  dateText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  repliesContainer: {
    marginTop: 10,
  },
  replyCard: {
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  iconButton: {
    padding: 5,
    marginRight: 10,
  },
});

export default CommentList;
