// CommentScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { Button, Card, Avatar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { firestore } from "../config/firebaseConfig";
import CommentList from "../components/CommentList";
import { useAuth } from "../Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const CommentScreen = ({ route }) => {
  const { forum } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedComment, setSelectedComment] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const commentsCollection = collection(firestore, "comments");
    const unsubscribeComments = onSnapshot(commentsCollection, (snapshot) => {
      const data = snapshot.docs
        .filter((doc) => doc.data().forumId === forum.id)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(data);
    });

    return () => {
      unsubscribeComments();
    };
  }, [forum.id]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    hideDatePicker();
  };

  const addComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    if (!selectedDate) {
      console.error("Please select a date.");
      return;
    }

    if (authUser) {
      try {
        if (selectedComment !== null) {
          const parentComment = comments.find((c) => c.id === selectedComment);
          const replyData = {
            user: authUser.displayName,
            userAvatar: authUser.photoURL,
            text: newComment,
            forumId: forum.id,
            timestamp: serverTimestamp(),
            date: selectedDate.toISOString(),
            parentCommentId: selectedComment,
            userEmail: authUser.email,
          };

          parentComment.replies = parentComment.replies || [];
          parentComment.replies.push(replyData);

          await setDoc(
            doc(firestore, "comments", selectedComment),
            parentComment
          );

          setNewComment("");
          setSelectedComment(null);
        } else {
          const commentData = {
            user: authUser.displayName,
            userAvatar: authUser.photoURL,
            text: newComment,
            forumId: forum.id,
            timestamp: serverTimestamp(),
            date: selectedDate.toISOString(),
            userEmail: authUser.email,
            replies: [],
          };

          const docRef = await addDoc(
            collection(firestore, "comments"),
            commentData
          );

          console.log("Comment added successfully with ID: ", docRef.id);

          setNewComment("");
          setSelectedDate(new Date());
        }
      } catch (error) {
        console.error("Error adding comment or reply: ", error);
      }
    } else {
      console.error("User is not authenticated.");
    }
  };

  const replyToComment = (commentId) => {
    setSelectedComment(commentId);
    setNewComment(`@${comments.find((c) => c.id === commentId)?.user} `);
  };

  const cancelReply = () => {
    setSelectedComment(null);
    setNewComment("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Card style={styles.commentCard}>
          <Card.Title
            title={forum.name}
            subtitle={`Join the discussion in ${forum.description}`}
            left={(props) => (
              <Ionicons size={40} name="md-chatbubbles-outline" />
            )}
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubtitle}
          />
        </Card>

        <ScrollView style={styles.commentListContainer}>
          <CommentList
            comments={comments}
            currentUser={authUser}
            onReply={replyToComment}
          />
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What are your thoughts..."
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={showDatePicker}
              style={styles.button}
            >
              Select Date
            </Button>

            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleDateConfirm}
              />
            )}

            <Button mode="contained" onPress={addComment} style={styles.button}>
              Tweet
            </Button>
          </View>
        </View>

        {selectedComment !== null && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyToText}>
              Replying to:{" "}
              {comments.find((c) => c.id === selectedComment)?.user}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Tweet your reply..."
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
              multiline={true}
              numberOfLines={4}
            />
            <TouchableOpacity onPress={addComment} style={styles.replyButton}>
              <Text style={styles.replyButtonText}>Tweet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelReply} style={styles.replyButton}>
              <Text style={styles.replyButtonText}>Cancel Reply</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10, // Adjust as needed
  },
  commentListContainer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#00cbaf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  replyContainer: {
    flexDirection: "column",
    backgroundColor: "#00cbaf",
    borderRadius: 8,
    padding: 10,
  },
  replyToText: {
    fontSize: 16,
    marginBottom: 5,
  },
  replyButton: {
    backgroundColor: "#00cbaf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 5,
  },
  replyButtonText: {
    color: "white",
  },
  commentCard: {
    padding: 10,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#f0f8ff",
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 10,
    color: "#555",
  },
});

export default CommentScreen;
