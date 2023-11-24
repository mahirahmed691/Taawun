// Import necessary components and modules
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ForumComment = ({ forumComments, onAddForumComment }) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  const handleAddComment = () => {
    setIsCommentVisible(false); // Hide the comment section
    onAddForumComment("New comment"); // Add a new comment (you can replace this with actual comment data)
  };

  return (
    <View>
      {/* Display existing comments */}
      {forumComments.map((comment, index) => (
        <Text key={index}>{comment}</Text>
      ))}

      {/* Button to show/hide comment section */}
      <TouchableOpacity onPress={() => setIsCommentVisible(!isCommentVisible)}>
        <Text>Add Comment</Text>
      </TouchableOpacity>

      {/* Comment input section */}
      {isCommentVisible && (
        <View>
          {/* Add your comment input UI here */}
          <TouchableOpacity onPress={handleAddComment}>
            <Text>Submit Comment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ForumComment;
