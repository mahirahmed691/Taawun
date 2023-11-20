// ExploreTab.js
import React from "react";
import { FlatList } from "react-native";

export const ExploreTab = ({ posts, renderPost }) => (
  <FlatList
    data={posts}
    renderItem={renderPost}
    keyExtractor={(item) => item.id}
  />
);

export default ExploreTab;
