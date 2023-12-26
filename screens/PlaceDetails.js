import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Title, Paragraph } from "react-native-paper";
import * as Sharing from "expo-sharing";
import MapView, { Marker } from "react-native-maps";
import ViewShot from "react-native-view-shot";
import Accordion from "react-native-collapsible/Accordion";

const PlaceDetails = ({ route, navigation }) => {
  const {
    name,
    description,
    image,
    instagram,
    showcase,
    url,
    country,
    email,
    location,
    reviews,
    phone,
  } = route.params;

  const latitude = location?.latitude || 0;
  const longitude = location?.longitude || 0;

  const [emailBody, setEmailBody] = useState("");
  const [userReview, setUserReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSectionCollapsed, setIsEmailSectionCollapsed] = useState(true);
  const viewShotRef = useRef(null);

  const openInstagram = () => Linking.openURL(`https://www.instagram.com/${instagram}/`).catch(console.error);

  const openURL = () => Linking.openURL(url).catch(console.error);

  const sendEmail = () => {
    const subject = `Inquiry about ${name}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    Linking.openURL(mailtoLink).catch(console.error);
  };

  const handleShare = async () => {
    try {
      const imageURI = await viewShotRef.current.capture();
      await Sharing.shareAsync(imageURI);
    } catch (error) {
      console.error(`Sharing failed: ${error.message}`);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={openInstagram}>
            <Ionicons name="logo-instagram" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="share" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleShare, openInstagram]);

  const submitReview = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUserReview("");
    }, 2000);
  };

  const SECTIONS = [
    {
      title: "Send Email",
      content: (
        <View style={styles.emailContainer}>
          <Text style={styles.emailLabel}>Email Shop Owner:</Text>
          <TextInput
            style={styles.emailInput}
            multiline
            numberOfLines={5}
            value={emailBody}
            onChangeText={(text) => setEmailBody(text)}
          />
          <TouchableOpacity style={styles.emailButton} onPress={sendEmail}>
            <Text style={styles.emailButtonText}>
              <Ionicons name="mail" size={15} /> Send Email
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const renderSectionTitle = () => <View />;

  const renderHeader = (section, index, isActive) => (
    <TouchableOpacity
      onPress={() => setIsEmailSectionCollapsed(!isEmailSectionCollapsed)}
      style={styles.collapsibleHeader}
    >
      <Text style={styles.collapsibleHeaderText}>{section.title}</Text>
      <Ionicons name={isActive ? "chevron-up" : "chevron-down"} size={18} color="#555" />
    </TouchableOpacity>
  );

  const renderContent = (section) => <View>{section.content}</View>;

  return (
    <ScrollView style={styles.container}>
      <Card elevation={0} style={styles.card}>
        <Card.Cover source={{ uri: image }} style={styles.detailImage} />
        <Card.Content style={styles.detailContainer}>
          <Title style={styles.detailName}>{name}</Title>
          <Paragraph style={styles.detailDescription}>{description}</Paragraph>
          <TouchableOpacity onPress={openInstagram}>
            <Text style={styles.detailLink}>
              <Ionicons name="logo-instagram" size={15} /> {`${instagram}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openURL}>
            <Text style={styles.detailLink}>
              <Ionicons name="link" size={15} /> {`${url}`}
            </Text>
          </TouchableOpacity>
          <Text style={styles.detailLink}>
            <Ionicons name="globe" size={15} /> {`${country}`}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={styles.detailLink}>
              <Ionicons name="call" size={15} /> {`${phone}`}
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {phone && (
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>
            <Ionicons name="call" size={15} /> Phone:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={styles.phoneText}>{phone}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ViewShot style={styles.mapContainer} ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          scrollEnabled={false}
          showsUserLocation={true}
        >
          {location && (
            <Marker coordinate={{ latitude, longitude }} title={name} />
          )}
        </MapView>
      </ViewShot>

      {reviews && reviews.length > 0 && (
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewText}>{review}</Text>
            </View>
          ))}
        </View>
      )}

      {showcase && showcase.length > 0 && (
        <View style={styles.showcaseContainer}>
          <Text style={styles.showcaseTitle}>Showcase</Text>
          <FlatList
            data={showcase}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.showcaseImage} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.reviewContainer}>
        <Text style={styles.reviewLabel}>Write a Review:</Text>
        <TextInput
          style={styles.reviewInput}
          multiline
          numberOfLines={5}
          value={userReview}
          onChangeText={(text) => setUserReview(text)}
        />
        <TouchableOpacity style={styles.reviewButton} onPress={submitReview} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.reviewButtonText}>
              <Ionicons name="star" size={15} /> Submit Review
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Accordion
        sections={SECTIONS}
        activeSections={isEmailSectionCollapsed ? [] : [0]}
        renderSectionTitle={renderSectionTitle}
        renderHeader={renderHeader}
        renderContent={renderContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 0,
  },
  detailImage: {
    height:200,
resizeMode:'cover',
    borderRadius: 0,
  },
  detailContainer: {
    padding: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailLink: {
    color: "#3498db",
    marginBottom: 10,
    fontWeight: "500",
  },
  mapContainer: {
    height: 200,
    marginVertical: 20,
  },
  map: {
    flex: 1,
  },
  emailContainer: {
    marginHorizontal: 20,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  emailInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 160,
    textAlignVertical: "top",
  },
  emailButton: {
    backgroundColor: "#000",
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 50,
    alignSelf: "center",
  },
  emailButtonText: {
    color: "white",
    alignSelf: "center",
  },
  reviewsContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  reviewInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 160,
    textAlignVertical: "top",
  },
  reviewButton: {
    backgroundColor: "#000",
    width: "100%",
    padding: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  reviewButtonText: {
    color: "white",
    alignSelf: "center",
  },
  showcaseContainer: {
    marginTop: 20,
  },
  showcaseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
  },
  showcaseImage: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: "cover",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#eee",
    width: "90%",
    alignSelf: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  collapsibleHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRightContainer: {
    flexDirection: "row",
    marginRight: 20,
  },
  iconButton: {
    marginLeft: 10,
  },
  phoneContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  phoneLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  phoneText: {
    fontSize: 16,
    color: "#333",
  },
});

export default PlaceDetails;
