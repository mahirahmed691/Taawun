// ForumListTab.js
import React from "react";
import { FlatList, Text, View } from "react-native";

export const ForumListTab = ({ forums, renderItem }) => (
  <View>
    <FlatList
      data={forums}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  </View>
);

export default ForumListTab;
