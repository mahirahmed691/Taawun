// AllowedScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  ImageBackground,
  StatusBar,
  View,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles.js";
import allowedData from "../data/allowed.json";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from 'expo-sharing';

const AllowedScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [allowedPlaces, setAllowedPlaces] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      if (allowedData && allowedData.allowedTargets) {
        setAllowedPlaces(allowedData.allowedTargets);
      }
      setRefreshing(false);
    }, 1000); 
  }, []);

  useEffect(() => {
    onRefresh(); 
  }, [onRefresh]);

  const filteredPlaces = allowedPlaces.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedPlaces = filteredPlaces.reduce((acc, place) => {
    const firstLetter = place.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(place);
    return acc;
  }, {});

  const sectionedData = Object.keys(groupedPlaces)
    .sort()
    .map((key) => ({
      title: key,
      data: groupedPlaces[key].sort((a, b) => a.name.localeCompare(b.name)),
    }));

  const navigateToDetails = (item) => {
    navigation.navigate("FromTheRiver", {
      screen: "ShopDetail",
      params: {
        name: item.name,
        image: item.image,
        instagram: item.instagram,
        url: item.url,
        description: item.desc,
        showcase: item.showcase,
        country: item.country,
      },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => navigateToDetails(item)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 20 }}>
            {item.name}
          </Text>
          <Button
            mode="outlined"
            onPress={() => openInstagram(item.instagram)}
            theme={{
              colors: {
                primary: "#E94A67",
              },
            }}
          >
            <Text>
              <Ionicons name="logo-instagram" />
            </Text>
          </Button>
        </View>
      </TouchableOpacity>

      <Text style={{ fontWeight: "300", fontStyle:"italic", marginTop: 5, marginBottom: 10 }}>
        {item.description}
      </Text>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.itemImage}
      ></ImageBackground>
    </View>
  );

  const openInstagram = (instagramUsername) => {
    const instagramURL = `https://www.instagram.com/${instagramUsername}/`;

    Linking.openURL(instagramURL).catch((err) =>
      console.error(`Failed to open Instagram: ${err}`)
    );
  };


  const sharePlace = async (item) => {
    try {
      await Sharing.shareAsync(`Check out this place: ${item.name}`);
    } catch (error) {
      console.error(`Sharing failed: ${error.message}`);
    }
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor="black"
            placeholder="Search verified places by name..."
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>
      <FlatList
        data={sectionedData}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <View>
            {renderSectionHeader({ section: item })}
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.name}
              renderItem={renderItem}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default AllowedScreen;
