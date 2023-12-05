import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Button, Card, Avatar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import { firestore, db } from "../config/firebaseConfig";
import CommentList from "../components/CommentList";
import { useAuth } from "../Auth/AuthContext";

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
      const commentData = {
        user: authUser.displayName,
        userAvatar: authUser.photoURL,
        text: newComment,
        forumId: forum.id,
        timestamp: serverTimestamp(),
        date: selectedDate.toISOString(),
        parentCommentId: selectedComment, // Add the parent comment ID
      };

      try {
        const docRef = await addDoc(
          collection(firestore, "comments"),
          commentData
        );

        // Create a calendar event
        const eventDetails = {
          title: "Comment Event",
          startDate: selectedDate,
          endDate: selectedDate,
          notes: newComment,
        };

        const calendarId = await Calendar.createCalendarAsync({
          title: "My App Calendar",
          color: "#00cbaf",
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: Calendar.Sources.DEFAULT,
          sourceName: "My App",
          name: "My App Calendar",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        await Calendar.createEventAsync(calendarId, eventDetails);

        console.log("Comment added successfully with ID: ", docRef.id);
        setNewComment("");
        setSelectedDate(new Date());
        setSelectedComment(null); // Clear the selected comment after adding a reply
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    } else {
      console.error("User is not authenticated.");
    }
  };

  const replyToComment = (commentId) => {
    setSelectedComment(commentId);
  };

  const cancelReply = () => {
    setSelectedComment(null);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.commentCard}>
        <Card.Title
          title={forum.name}
          subtitle={`Join the discussion in ${forum.description}`}
          left={(props) => <Avatar.Icon {...props} icon="forum" />}
        />
      </Card>

      <ScrollView style={styles.scrollView}>
        <CommentList
          comments={comments}
          currentUser={authUser}
          onReply={replyToComment}
        />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment"
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={showDatePicker} style={styles.button}>
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
            Add Comment
          </Button>
        </View>

        {/* Reply feature */}
        {selectedComment && (
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reply to the comment"
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity onPress={cancelReply} style={styles.button}>
              <Text style={styles.buttonText}>Cancel Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addComment} style={styles.button}>
              <Text style={styles.buttonText}>Add Reply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  commentCard: {
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default CommentScreen;
