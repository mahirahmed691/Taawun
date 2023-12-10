import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

const PlaceDetails = ({ route }) => {
  const { name, description, image, instagram, showcase, url, country } = route.params;

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.showcaseImage} />
  );

  const openInstagram = () => {
    const instagramURL = `https://www.instagram.com/${instagram}/`;
    Linking.openURL(instagramURL).catch((err) =>
      console.error(`Failed to open Instagram: ${err}`)
    );
  };

  const openURL = () => {
    Linking.openURL(url).catch((err) =>
      console.error(`Failed to open URL: ${err}`)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card elevation={0} style={{ borderRadius: 0 }}>
        <Card.Cover source={{ uri: image }} style={styles.detailImage} />
        <Card.Content style={styles.detailContainer}>
          <Title style={styles.detailName}>{name}</Title>
          <Paragraph style={styles.detailDescription}>{description}</Paragraph>
          <TouchableOpacity onPress={openInstagram}>
            <Text style={styles.detailInstagram}>
              <Ionicons name="logo-instagram" size={15} /> {`${instagram}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openURL}>
            <Text style={styles.detailInstagram}>
              <Ionicons name="link" size={15} /> {`${url}`}
            </Text>
          </TouchableOpacity>
          <Text style={styles.detailInstagram}>
              <Ionicons name="globe" size={15} /> {`${country}`}
            </Text>
        </Card.Content>
      </Card>

      {showcase && showcase.length > 0 && (
        <View style={styles.showcaseContainer}>
          <Text style={styles.showcaseTitle}>Showcase</Text>
          <FlatList
            data={showcase}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailImage: {
    height: 200,
    borderRadius:0,
  },
  detailContainer: {
    padding: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    borderRadius:0,
  },
  detailDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailInstagram: {
    color: "#3498db",
    marginBottom: 10,
    fontWeight:'500'
  },
  showcaseContainer: {
    marginTop: 0,
    marginBottom:40,
  },
  showcaseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft:15
  },
  showcaseImage: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: "cover",
  },
});

export default PlaceDetails;
