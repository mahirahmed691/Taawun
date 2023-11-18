// PlaceDetailScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import styles from "../styles";

const PlaceDetailScreen = ({ route }) => {
  const { place } = route.params;

  const renderNewsArticle = ({ item }) => (
    <View style={styles.newsArticleContainer}>
      <TouchableOpacity onPress={() => openURL(item.url)}>
        <Image
          source={{ uri: item.image }}
          style={styles.newsArticleImage}
          onError={(error) =>
            console.error(
              "News article image loading error:",
              error.nativeEvent.error
            )
          }
        />
      </TouchableOpacity>
      <Text style={styles.newsArticleTitle}>{item.title}</Text>
      <Text style={styles.newsArticleDescription}>{item.description}</Text>
    </View>
  );

  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening URL:", err)
    );
  };

  const formatArticleName = (url) => {
    // Remove dashes and capitalize each word
    return url
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderUrl = (url, index) => {
    // Assuming the article name is the last part of the URL
    const articleName = formatArticleName(
      url.url.substring(url.url.lastIndexOf("/") + 1)
    );
    return (
      <TouchableOpacity key={index} onPress={() => openURL(url.url)}>
        <View style={styles.urlContainer}>
          <Text style={styles.urlText}>{articleName}</Text>
          <Image
            source={{ uri: url.image }}
            style={styles.urlImage}
            onError={(error) =>
              console.error("URL image loading error:", error.nativeEvent.error)
            }
          />
          <Text style={styles.linkDateText}>Link Date: {url.linkDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: place.image }}
        style={styles.detailImage}
        onError={(error) =>
          console.error("Main image loading error:", error.nativeEvent.error)
        }
      />
      <Text style={styles.descriptionText}>
        {place.description}
      </Text>
      <Text style={styles.sectionHeader}>Sources</Text>
      <FlatList
        data={place.urls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderUrl(item, index)}
      />
    </SafeAreaView>
  );
};

export default PlaceDetailScreen;
