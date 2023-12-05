// CommentList.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Card } from "react-native-paper";

const CommentList = ({ comments, currentUser, onReply }) => {
  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <Card key={comment.id} style={styles.commentCard}>
          <Card.Title
            title={comment.user}
            subtitle={comment.text}
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{ uri: comment.userAvatar }}
              />
            )}
          />
          <Card.Content>
            <Text style={styles.dateText}>{comment.date}</Text>
          </Card.Content>
          {onReply && (
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => onReply(comment.id)}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          )}
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  commentCard: {
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  replyButton: {
    marginTop: 5,
    marginLeft: 10,
    padding: 5,
    backgroundColor: "#00cbaf",
    borderRadius: 5,
  },
  replyButtonText: {
    color: "white",
  },
});

export default CommentList;
