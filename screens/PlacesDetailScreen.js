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
import { ScrollView } from "react-native-gesture-handler";

const PlacesDetailScreen = ({ route }) => {
  const { place } = route.params;

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
          <View style={styles.horizontalLine} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderAlternative = ({ item, index }) => (
    <TouchableOpacity onPress={() => openURL(item)}>
    <ScrollView showsVerticalScrollIndicator style={styles.alternativeContainer}>
      <Image source={{ uri: item }} style={{ height: 80, width: 80, marginTop: 5, margin: 0 }} />
    </ScrollView>
  </TouchableOpacity>
  );
  

  return (
    <View style={styles.container2}>
      <Image
        source={{ uri: place.image }}
        style={styles.detailImage}
        onError={(error) =>
          console.error("Main image loading error:", error.nativeEvent.error)
        }
      />
      <Text style={styles.descriptionText}>{place.description}</Text>
      <Text style={styles.sectionHeader2}>Alternatives</Text>
      <FlatList
        data={place.alternatives}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAlternative}
        horizontal 
      />
      <Text style={styles.sectionHeader2}>Sources</Text>
      <FlatList
        data={place.urls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderUrl(item, index)}
      />
    </View>
  );
};

export default PlacesDetailScreen;
